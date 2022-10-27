package com.navigationdemo;

import android.graphics.Bitmap;
import android.os.Bundle;
import android.os.Message;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class HttpActivityStu extends AnswerActivityStu {

    private static final String TAG = "xiao";
    private static Timer getControlMessageTimer;
    private static String baseUrl = "http://www.cn901.com";


    public static void startGetControlMessageTimer(String roomId, String userId, MainActivity_stu mainActivity_stu) {

        getControlMessageTimer = new Timer();
        getControlMessageTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                getControlMessage(roomId, userId, mainActivity_stu);
            }
        },10,300);
    }

    public static void stopGetControlMessageTimer() {
        getControlMessageTimer.cancel();
    }

    public static String bitmapToBase64(Bitmap bitmap) {

        String result = null;
        ByteArrayOutputStream baos = null;
        try {
            if (bitmap != null) {
                baos = new ByteArrayOutputStream();
                bitmap.compress(Bitmap.CompressFormat.PNG, 100, baos);

                baos.flush();
                baos.close();

                byte[] bitmapBytes = baos.toByteArray();
                result = Base64.encodeToString(bitmapBytes, Base64.NO_WRAP);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            try {
                if (baos != null) {
                    baos.flush();
                    baos.close();
                }
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        return result;
    }

    //学生上传图片
    public static void saveBase64Image(String userId, String roomId, Bitmap bitmap) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {

                    String baseCode = bitmapToBase64(bitmap);
                    System.out.println("base64:"+baseCode);

                    //URL url = new URL("http://www.cn901.net:8111/AppServer/ajax/studentApp_saveBase64Image.do?learnPlanId=test111&userId=ming6002&baseCode="+baseCode);

                    URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_saveBase64Image.do?"
                            + "roomId="+roomId
                            + "&userId="+userId
                            + "&questionId="+questionId
                            + "&baseCode="+baseCode);
                    System.out.println(url);
                    HttpURLConnection ansConnection = (HttpURLConnection) url.openConnection();
                    ansConnection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
                    ansConnection.setRequestMethod("POST");
                    //System.out.println("ansConnection"+ansConnection);
                    ansConnection.setConnectTimeout(8000);
                    ansConnection.setReadTimeout(8000);
                    InputStream inputStream = ansConnection.getInputStream();
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");

                    BufferedReader bufferedReader = new BufferedReader(reader);
                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while ((temp = bufferedReader.readLine()) != null) {
                        buffer.append(temp);
                    }
                    bufferedReader.close();//记得关闭
                    reader.close();
                    inputStream.close();
                    System.out.println("MAIN-testRaiseHandAction"+ buffer.toString());//打印结果
                    try{
                        // 从服务器端获取Json字符串
                        String backlogJsonStr = buffer.toString();
                        backlogJsonStr = backlogJsonStr.substring(backlogJsonStr.indexOf("{"), backlogJsonStr.lastIndexOf("}") + 1);
                        backlogJsonStr = backlogJsonStr.replace("\\\"","'");
                        JSONObject jsonObject = new JSONObject(backlogJsonStr);
                        String data = jsonObject.getString("success");
                        System.out.println("base64 success==>"+data);

                        base64url = jsonObject.getString("data");
                        System.out.println("base64 url==>"+base64url.replaceFirst("/html",""));
                    }catch (JSONException e) {
                        e.printStackTrace();
                        System.out.println("base64 wrong1==>");
                    }
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                    System.out.println("base64 wron2==>");
                } catch (IOException e) {
                    e.printStackTrace();
                    System.out.println("base64 wrong3==>");
                }
            }
        }).start();
    }

    /**
     * 学生保存答案
     *
     * @param stuAnswer        学生答案
     * @param userId           答题用户Id
     * @param userName         答题用户姓名
     * @param mainActivity_stu 主线程
     */

    public static void saveAnswer(String stuAnswer, String userId, String userName, MainActivity_stu mainActivity_stu) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
//            String answerQuestionId = "c3407566-b14f-465c-9ed9-fa48ecc7b2fe";
//            String stuAnswer="asdfghjkl";
                    String startAnswerTime = "1234567890000";
                    String source = "app";
                    URL  url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_stuSaveAnswer.do?"
                            + "answerQuestionId="+questionId
                            + "&stuAnswer="+stuAnswer
                            + "&userId="+userId
                            + "&name="+userName
                            + "&startAnswerTime="+questionStartAnswerTime
                            + "&source="+source);
                    //URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_stuSaveAnswer.do?answerQuestionId=948fa054-8b95-4fce-bb8f-7ae914ffbb76&stuAnswer=D&userId=ming6001&name=ming6001&startAnswerTime=1650002839347&source=app");
                    System.out.println(url);

                    HttpURLConnection ansConnection = (HttpURLConnection) url.openConnection();

                    ansConnection.setRequestMethod("GET");
                    ansConnection.setConnectTimeout(8000);
                    ansConnection.setReadTimeout(8000);
                    //ansConnection.setRequestMethod("POST");
                    //ansConnection.connect();
                    InputStream inputStream = ansConnection.getInputStream();
                    //System.out.println("response:"+ansConnection.getResponseCode());
                    //BufferedReader br = new BufferedReader(new InputStreamReader(ansConnection.getInputStream()));
//                    if (ansConnection.getResponseCode() != HttpURLConnection.HTTP_OK
//                            ||ansConnection.getResponseCode() != HttpURLConnection.HTTP_CREATED
//                            ||ansConnection.getResponseCode() != HttpURLConnection.HTTP_ACCEPTED ) {
//                        inputStream = ansConnection.getErrorStream();
//                    }
//                    else{
//                        inputStream = ansConnection.getInputStream();
//                    }

                    //InputStream inputStream = httpURLConnection.getInputStream();
                    //4，建蓄水池蓄水-InputStreamReader
                    //InputStreamReader reader = new InputStreamReader(inputStream, "UTF-8");
                    InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
                    //5，水桶盛水--BufferedReader
                    BufferedReader bufferedReader = new BufferedReader(reader);

                    StringBuffer buffer = new StringBuffer();
                    String temp = null;

                    while ((temp = bufferedReader.readLine()) != null) {
                        //取水--如果不为空就一直取
                        buffer.append(temp);
                    }
                    bufferedReader.close();//记得关闭
                    reader.close();
                    inputStream.close();
                    Log.e("MAIN-http-return", buffer.toString());//打印结果
                    try{
                        // 从服务器端获取Json字符串
                        String backlogJsonStr = buffer.toString();
                        backlogJsonStr = backlogJsonStr.substring(backlogJsonStr.indexOf("{"), backlogJsonStr.lastIndexOf("}") + 1);
                        backlogJsonStr = backlogJsonStr.replace("\\\"","'");
                        JSONObject jsonObject = new JSONObject(backlogJsonStr);

                        String data = jsonObject.getString("success");
                        System.out.println("success==>"+data);
                        //JSONObject sec = new JSONObject(data);
                    }catch (JSONException e) {
                        e.printStackTrace();
                    }
                } catch (MalformedURLException e) {
                    e.printStackTrace();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }
        }).start();
    }

    /**
     * 学生举手操作
     *
     * @param userId           操作用户Id
     * @param roomId           用户所在房间Id
     * @param type             操作类型 "up" 举手，"down" 手放下
     * @param mainActivity_stu 主线程
     */
    public static void handsUp(String userId, String roomId, String type, MainActivity_stu mainActivity_stu) {
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_saveControl.do?"
                            + "roomId=" + roomId
                            + "&raiseHandAction=" + type + "_" + userId
                    );
                    Log.e(TAG, "leaveOrJoinClass: " +  url);

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

                    Log.e(TAG, "leaveOrJoinClass: " +  buffer.toString());
                    try{
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        String success = "";
                        success = jsonObject.getString("success");
                        if(!success.equals("")) {
                            Toast.makeText(mainActivity_stu, type + "操作成功！", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(mainActivity_stu, "操作失败，请检查网络设置", Toast.LENGTH_SHORT).show();
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
     * 学生进入/退出课堂操作
     *
     * @param userId           操作用户ID，userId + "_" + name拼接
     * @param roomId           操作房间ID
     * @param type             操作动作"leave" or "join"
     * @param mainActivity_stu 主线程
     */

    public static void leaveOrJoinClass(String userId, String roomId, String type, MainActivity_stu mainActivity_stu ){
        new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    URL url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_TestJoinOrLeaveRoom.do?"
                            + "userId=" + userId
                            + "&roomId=" + roomId
                            + "&type=" + type
                            + "$source=" + "app"
                    );
                    Log.e(TAG, "leaveOrJoinClass: " +  url);

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

                    Log.e(TAG, "leaveOrJoinClass: " +  buffer.toString());
                    try{
                        String backLogJsonStr = buffer.toString();
//                        String backLogJsonStr = "{\"joinlist\":[{\"value\":\"李龙龙\",\"key\":\"ming6001\"}],\"ketanglist\":[{\"num\":\"60\",\"value\":\"我校2022级葛舸班\",\"key\":\"4195ketang\"}]}";
                        JSONObject jsonObject = stringToJson(backLogJsonStr);
                        String success = "";
                        success = jsonObject.getString("success");
                        if(!success.equals("")) {
                            Toast.makeText(mainActivity_stu, type + "房间操作成功！", Toast.LENGTH_SHORT).show();
                        } else {
                            Toast.makeText(mainActivity_stu, "操作失败，请检查网络设置", Toast.LENGTH_SHORT).show();
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

    //http访问服务器请求,学生获取互动消息接口
    public static void getControlMessage(String roomId, String userId, MainActivity_stu mainActivity_stu) {

        try {
            //1,找水源--创建URL
            //URL url = new URL("http://www.cn901.net:8111/AppServer/ajax/studentApp_getStudentAnswerList.do?learnPlanId=ba6aa102-de42-430d-b953-d046953f264f&userName=ming6051");//放网站
            //URL url = new URL("http://www.cn901.net:8111/AppServer/ajax/userManage_login.do?userName="+userid+"&passWord="+userpassword+"&callback=ha");
            //URL url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_getControlMessage.do?roomId="+roomId+"&userId="+userId);
            URL  url = new URL(baseUrl + "/ShopGoods/ajax/livePlay_getControlMessage.do?roomId="+roomId+"&userId="+userId);
            //2,开水闸--openConnection
            HttpURLConnection httpURLConnection = (HttpURLConnection) url.openConnection();
            //3，建管道--InputStream
            InputStream inputStream = httpURLConnection.getInputStream();
            //4，建蓄水池蓄水-InputStreamReader
            //InputStreamReader reader = new InputStreamReader(inputStream, "UTF-8");
            InputStreamReader reader = new InputStreamReader(inputStream, "GBK");
            //5，水桶盛水--BufferedReader
            BufferedReader bufferedReader = new BufferedReader(reader);

            StringBuffer buffer = new StringBuffer();
            String temp = null;

            while ((temp = bufferedReader.readLine()) != null) {
                //取水--如果不为空就一直取
                buffer.append(temp);
            }
            bufferedReader.close();//记得关闭
            reader.close();
            inputStream.close();
            Log.e("Student-http", buffer.toString());//打印结果

            try{
                // 从服务器端获取Json字符串
                String backlogJsonStr = buffer.toString();
                backlogJsonStr = backlogJsonStr.substring(backlogJsonStr.indexOf("{"), backlogJsonStr.lastIndexOf("}") + 1);
                backlogJsonStr = backlogJsonStr.replace("\\\"","'");
                JSONObject jsonObject = new JSONObject(backlogJsonStr);

                String data = jsonObject.getString("data");
                System.out.println("data==>"+data);
                JSONObject sec = new JSONObject(data);

                String questionAction_Time = sec.getString("questionAction");
                if(questionAction_Time.length()>0){
                    questionAction = questionAction_Time.split("_")[0];
                    questionTime = questionAction_Time.split("_")[1];
                    System.out.print("questionAction==>"+questionAction);
                    System.out.println(" questionTime==>"+questionTime);
                }

                questionId = sec.getString("questionId");
                System.out.println("questionId==>"+questionId);

                questionBaseTypeId = sec.getString("questionBaseTypeId");
                System.out.println("questionBaseTypeId==>"+questionBaseTypeId);

                questionSubNum = sec.getString("questionSubNum");
                System.out.println("questionSubNum==>"+questionSubNum);

                questionStartAnswerTime = sec.getString("questionStartAnswerTime");
                System.out.println("questionStartAnswerTime==>"+questionStartAnswerTime);

                String deviceMicAction_Time = sec.getString("deviceMicAction");
                if(deviceMicAction_Time.length()>0){
                    deviceMicAction = deviceMicAction_Time.split("_")[0];
                    deviceMicTime = deviceMicAction_Time.split("_")[1];
                    System.out.print("deviceMicAction==>"+deviceMicAction);
                    System.out.println(" deviceMicTime==>"+deviceMicTime);
                }

                String deviceCameraAction_Time = sec.getString("deviceCameraAction");
                if(deviceCameraAction_Time.length()>0){
                    deviceCameraAction = deviceCameraAction_Time.split("_")[0];
                    deviceCameraTime = deviceCameraAction_Time.split("_")[1];
                    System.out.print("deviceCameraAction==>"+deviceCameraAction);
                    System.out.println(" deviceCameraTime==>"+deviceCameraTime);
                }

                String deviceWordsAction_Time = sec.getString("deviceWordsAction");
                if(deviceWordsAction_Time.length()>0){
                    deviceWordsAction = deviceWordsAction_Time.split("_")[0];
                    deviceWordsTime = deviceWordsAction_Time.split("_")[1];
                    System.out.print("deviceWordsAction==>"+deviceWordsAction);
                    System.out.println(" deviceWordsTime==>"+deviceWordsTime);
                }

                platformUserId = sec.getString("platformUserId");
                System.out.println("platformUpUserId==>"+platformUserId);

                allHandAction = sec.getString("allHandAction");
                System.out.println("allHandAction==>"+allHandAction);

                success = jsonObject.getString("success");
                System.out.println("success==>"+success);

                message = jsonObject.getString("message");
                System.out.println("message==>"+message);

            }catch (JSONException e) {
                e.printStackTrace();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}

