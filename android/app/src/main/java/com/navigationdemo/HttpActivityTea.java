package com.navigationdemo;

import android.os.Bundle;
import android.os.Message;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class HttpActivityTea extends AnswerActivityTea {

    private static final String TAG = "xiao";
    private static Timer getHandsUpTimer;
    private static String baseUrl = "http://www.cn901.com";

    public static void startHandsUpTimer(MainActivity_tea mainActivityTea) {

        getHandsUpTimer = new Timer();
        getHandsUpTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                getHandsUp(mainActivityTea);
            }
        },10,100);
    }

    public static void stopHandsUpTimer() {
        if(getHandsUpTimer != null) {
            getHandsUpTimer.cancel();
        }
    }




    public static JSONObject stringToJson(String str) {
        JSONObject jsonObject = null;
        str = str.substring(str.indexOf("{"), str.lastIndexOf("}") + 1);
        str = str.replace("\\\"","'");
        try {
            jsonObject = new JSONObject(str);
        } catch (JSONException e) {
            e.printStackTrace();
        }
        return jsonObject;
    }


    public static void getHandsUp(MainActivity_tea mainActivityTea) {
        try{
            String roomId = MainActivity_tea.roomid;
            String userId = MainActivity_tea.userId;
            URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_getRaiseHandUserIds.do?"
                    + "roomId=" + roomId
                    + "&userId=" + userId);
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            httpURLConnection.setRequestMethod("GET");
            httpURLConnection.connect();
            InputStream inputStream = httpURLConnection.getInputStream();
            InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
            BufferedReader bufferedReader = new BufferedReader(reader);
            StringBuffer buffer = new StringBuffer();
            String temp = null;
            while((temp = bufferedReader.readLine()) != null){
                buffer.append(temp);
            }
            // 关闭
            bufferedReader.close();
            reader.close();
            inputStream.close();
            httpURLConnection.disconnect();
//            Log.e(TAG, "getHandsUpList: " + buffer.toString());
            try{
                String backLogJsonStr = buffer.toString();
//                String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                JSONObject jsonObject = stringToJson(backLogJsonStr);
                String userListStr = jsonObject.getString("raiseHandUserId");
                String splitter = ",";

                String[] handsUpIdList = userListStr.split(splitter);
                List<MemberDataBean> tempHandsUpList = new ArrayList<>();
                for (int i = 0; i < handsUpIdList.length; i++) {
                    if(handsUpIdList[i].equals("")) continue;
                    Log.e(TAG, "getHandsUpList: " + handsUpIdList[i]);
                    StudentDataBean studentMemberInJoinList = findMemberInJoinList(handsUpIdList[i]);
                    if(studentMemberInJoinList != null) {
                        tempHandsUpList.add(studentMemberInJoinList);
                        continue;
                    } else {
                        ClassDataBean classMemberInKetangList = findMemberInKetangList(handsUpIdList[i]);
                        if(classMemberInKetangList != null){
                            tempHandsUpList.add((MemberDataBean) classMemberInKetangList);
                            continue;
                        } else {
                            Log.e(TAG, "getHandsUp: 未找到该用户!");
                        }
                    }
                }
                AnswerActivityTea.handsUpList = tempHandsUpList;
                Message updateHandsUpListMessage = Message.obtain();
                updateHandsUpListMessage.what = MyEvent.UPDATE_HANDS_UP_TIME;
                mainActivityTea.handler.sendMessage(updateHandsUpListMessage);
            } catch (JSONException e) {
                e.printStackTrace();
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



    public static void getMemberList(MainActivity_tea mainActivityTea) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try{
                    String roomId = MainActivity_tea.roomid;
//                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_TestGetStuJoinOrLeaveRoomList.do?"
//                            + "roomId=" + roomId);
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_getRoomMemberList.do?"
                              + "roomId=" + roomId);

                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.setConnectTimeout(8000);
                    httpURLConnection.setReadTimeout(8000);
                    httpURLConnection.connect();

                    InputStream inputStream = httpURLConnection.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
                    BufferedReader bufferedReader = new BufferedReader(reader);
                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while((temp = bufferedReader.readLine()) != null){
                        buffer.append(temp);
                    }

                    // 关闭
                    bufferedReader.close();
                    reader.close();
                    inputStream.close();
                    httpURLConnection.disconnect();
                    Log.e(TAG, "getMemberList: " + buffer.toString());
                    try{
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        JSONArray memberListJsonArray = jsonObject.getJSONArray("list");
                        List<StudentDataBean> tempJoinList = new ArrayList<>();
                        List<ClassDataBean> tempKetangList = new ArrayList<>();
                        for (int i=0; i < memberListJsonArray.length(); i ++) {
                            JSONObject jsonObj = memberListJsonArray.getJSONObject(i);
                            int studentNum = jsonObj.getInt("num");
                            if(studentNum > 0) {
                                ClassDataBean classDataBean = new ClassDataBean(jsonObj.getString("value"), jsonObj.getString("key"), studentNum);
                                tempKetangList.add(classDataBean);
                            } else {
                                StudentDataBean studentDataBean = new StudentDataBean(jsonObj.getString("value"), jsonObj.getString("key"));
                                tempJoinList.add(studentDataBean);
                            }
                        }
                        joinList = tempJoinList;
                        ketangList = tempKetangList;
                        Message msg = new Message();
                        msg.what = MyEvent.UPDATE_MEMBER_LIST;
                        mainActivityTea.handler.sendMessage(msg);
                        Log.e(TAG, "getMemberList: " + jsonObject);
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     *
     *
     * @param micAction    麦克风操作
     * @param cameraAction 摄像头操作
     * @param wordAction   聊天室操作
     * @param handAction   举手操作
     * @param userId       操作对象ID
     * @param position     操作位置
     * @param mainActivityTea 主线程
     */

    public static void memberController(String micAction, String cameraAction, String wordAction, String handAction, String userId, int position, MainActivity_tea mainActivityTea) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String roomId = roomid;
                    if(!userId.equals("")) {
                        roomId += "@_@" + userId;
                    }
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_saveControl.do?"
                            + "roomId=" + roomId
                            + "&deviceMicAction=" + micAction
                            + "&deviceCameraAction=" + cameraAction
                            + "&deviceWordsAction=" + wordAction
                            + "&handAction=" + handAction
                    );
                    Log.e(TAG, "memberController: getUrl  " + url );
                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.setConnectTimeout(8000);
                    httpURLConnection.setReadTimeout(8000);
                    httpURLConnection.connect();

                    InputStream inputStream = httpURLConnection.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
                    BufferedReader bufferedReader = new BufferedReader(reader);
                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while((temp = bufferedReader.readLine()) != null) {
                        buffer.append(temp);
                    }

                    // 关闭
                    bufferedReader.close();
                    reader.close();
                    inputStream.close();
                    httpURLConnection.disconnect();

                    try{
                        Log.e(TAG, "memberController: getRespond  " + buffer.toString() );
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        String success = "";
                        success = jsonObject.getString("success");
                        if(!success.equals("")) {
                            Message msg = Message.obtain();
                            if(!micAction.equals(""))
                                msg.what = MyEvent.UPDATE_AUDIO_ICON;
                            else if (!wordAction.equals(""))
                                msg.what = MyEvent.UPDATE_CHAT_ICON;
                            else if (!cameraAction.equals(""))
                                msg.what = 4;
                            Bundle bundle = new Bundle();
                            if(position != -1)
                                bundle.putInt("position", position);
                            msg.setData(bundle);
                            mainActivityTea.handler.sendMessage(msg);
                        } else {
                            Toast.makeText(mainActivityTea, "memberController: 操作失败，请检查网络设置", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        Log.e(TAG, "memberController: " + e.toString() );
                        e.printStackTrace();
                    }
                } catch (IOException e) {
                    Log.e(TAG, "memberController: " + e.toString() );
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     * 学生主动上下讲台控制
     *
     * @param userId       操作用户ID
     * @param stuName      操作用户用户名
     * @param type         操作动作
     */

    public static void speakerController(String userId, String stuName, String type, MainActivity_stu mainActivityStu) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String roomId = roomid;
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_savePlatform.do?"
                            + "roomId=" + roomId
                            + "&stuId=" + userId
                            + "&name=" + URLEncoder.encode(stuName, "utf-8")
                            + "&type=" + type
                    );
                    Log.e(TAG, "speakerController: " +  url);

                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.setConnectTimeout(8000);
                    httpURLConnection.setReadTimeout(8000);
                    httpURLConnection.connect();

                    InputStream inputStream = httpURLConnection.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
                    BufferedReader bufferedReader = new BufferedReader(reader);
                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while((temp = bufferedReader.readLine()) != null) {
                        buffer.append(temp);
                    }

                    // 关闭
                    bufferedReader.close();
                    reader.close();
                    inputStream.close();
                    httpURLConnection.disconnect();

                    Log.e(TAG, "speakerController: " +  buffer.toString());
                    try{
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        String success = "";
                        success = jsonObject.getString("success");
                        if(success.equals("")) {
                            Toast.makeText(mainActivityStu, "操作失败，请检查网络设置", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     * 上下讲台控制
     *
     * @param userId       操作用户ID
     * @param stuName      操作用户用户名
     * @param type         操作动作
     * @param position     操作位置
     * @param mainActivityTea 主线程
     */
    public static void speakerController(String userId, String stuName, String type, int position, MainActivity_tea mainActivityTea){
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String roomId = roomid;
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_savePlatform.do?"
                            + "roomId=" + roomId
                            + "&stuId=" + userId
                            + "&name=" + URLEncoder.encode(stuName, "utf-8")
                            + "&type=" + type
                    );
                    Log.e(TAG, "speakerController: " +  url);

                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.setConnectTimeout(8000);
                    httpURLConnection.setReadTimeout(8000);
                    httpURLConnection.connect();

                    InputStream inputStream = httpURLConnection.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
                    BufferedReader bufferedReader = new BufferedReader(reader);
                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while((temp = bufferedReader.readLine()) != null) {
                        buffer.append(temp);
                    }

                    // 关闭
                    bufferedReader.close();
                    reader.close();
                    inputStream.close();
                    httpURLConnection.disconnect();

                    Log.e(TAG, "speakerController: " +  buffer.toString());
                    try{
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        String success = "";
                        success = jsonObject.getString("success");
                        if(!success.equals("")) {
                            Message msg = Message.obtain();
                            msg.what = MyEvent.UPDATE_SPEAKER_ICON;
                            Bundle bundle = new Bundle();
                            bundle.putInt("position", position);
                            msg.setData(bundle);
                            mainActivityTea.handler.sendMessage(msg);
                        } else {
                            Toast.makeText(mainActivityTea, "操作失败，请检查网络设置", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    public static void initClass(int screenWidth, int screenHeight, String source, MainActivity_tea mainActivityTea) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String roomId = MainActivity_tea.roomid;
                    String userId = MainActivity_tea.userId;
                    String userName = MainActivity_tea.userName;
                    String keTangId = MainActivity_tea.keTangId;
                    String keTangName = MainActivity_tea.keTangName;
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_deleteMemcached.do?"
                            + "roomId=" + roomId
                            + "&keTangId=" + keTangId
                            + "&keTangName=" + URLEncoder.encode(keTangName, "utf-8")
                            + "&userId=" + userId
                            + "&name=" + URLEncoder.encode(userName, "utf-8")
                            + "&source=" + source
                            + "&width=" + screenWidth
                            + "&height=" + screenHeight
                    );

                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.setConnectTimeout(8000);
                    httpURLConnection.setReadTimeout(8000);
                    httpURLConnection.connect();

                    InputStream inputStream = httpURLConnection.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
                    BufferedReader bufferedReader = new BufferedReader(reader);
                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while((temp = bufferedReader.readLine()) != null) {
                        buffer.append(temp);
                    }

                    // 关闭
                    bufferedReader.close();
                    reader.close();
                    inputStream.close();
                    httpURLConnection.disconnect();

                    Log.e(TAG, "audioController: " +  buffer.toString());
                    try{
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        String success = "";
                        String joinStatus = "";
                        success = jsonObject.getString("success");
                        joinStatus = jsonObject.getString("joinStatus");
                        if(!success.equals("")) {
                            Toast.makeText(mainActivityTea, "初始化房间成功！", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(mainActivityTea, "操作失败，请检查网络设置", Toast.LENGTH_SHORT).show();
                        }
                        if(!joinStatus.equals("")) {
                            String judgement = joinStatus.toLowerCase();
                            if(judgement.equals("true")) {
                                Toast.makeText(mainActivityTea, "该账号已在别处登录", Toast.LENGTH_SHORT).show();
                            } else if (judgement.equals("false")) {
                                Toast.makeText(mainActivityTea, "登录成功", Toast.LENGTH_SHORT).show();
                            }
                        } else {
                            Toast.makeText(mainActivityTea, "获取登录状态失败，请检查网络设置", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    public static void overClass(String type, String source, MainActivity_tea mainActivityTea){
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    String roomId = MainActivity_tea.roomid;
                    String userId = MainActivity_tea.userId;
                    String userName = MainActivity_tea.userName;
                    String keTangId = MainActivity_tea.keTangId;
                    String keTangName = MainActivity_tea.keTangName;
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_hostJoinOrLeaveRoom.do?"
                            + "roomId=" + roomId
                            + "&keTangId=" + keTangId
                            + "&keTangName=" + URLEncoder.encode(keTangName, "utf-8")
                            + "&userId=" + userId
                            + "&name=" + URLEncoder.encode(userName, "utf-8")
                            + "&type=" + type
                            + "&source=" + source
                    );

                    HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
                    httpURLConnection.setRequestMethod("GET");
                    httpURLConnection.setConnectTimeout(8000);
                    httpURLConnection.setReadTimeout(8000);
                    httpURLConnection.connect();

                    InputStream inputStream = httpURLConnection.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
                    BufferedReader bufferedReader = new BufferedReader(reader);
                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while((temp = bufferedReader.readLine()) != null) {
                        buffer.append(temp);
                    }

                    // 关闭
                    bufferedReader.close();
                    reader.close();
                    inputStream.close();
                    httpURLConnection.disconnect();

                    Log.e(TAG, "audioController: " +  buffer.toString());
                    try{
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        String success = "";
                        success = jsonObject.getString("success");
                        if(!success.equals("")) {
                            Toast.makeText(mainActivityTea, "退出房间成功！", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(mainActivityTea, "操作失败，请检查网络设置", Toast.LENGTH_SHORT).show();
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();

    }
}

