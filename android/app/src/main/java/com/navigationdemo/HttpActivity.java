package com.navigationdemo;

import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.os.FileUtils;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.style.ImageSpan;
import android.util.Base64;
import android.util.Log;

//import org.apache.http.HttpEntity;
//import org.apache.http.NameValuePair;
//import org.apache.http.client.ClientProtocolException;
//import org.apache.http.client.entity.UrlEncodedFormEntity;
//import org.apache.http.client.methods.CloseableHttpResponse;
//import org.apache.http.client.methods.HttpPost;
//import org.apache.http.impl.client.CloseableHttpClient;
//import org.apache.http.impl.client.HttpClients;
//import org.apache.http.message.BasicNameValuePair;
//import org.apache.http.util.EntityUtils;
//import cz.msebera.android.httpclient.HttpEntity;
//import cz.msebera.android.httpclient.NameValuePair;
//import cz.msebera.android.httpclient.client.ClientProtocolException;
//import cz.msebera.android.httpclient.client.entity.UrlEncodedFormEntity;
//import cz.msebera.android.httpclient.client.methods.CloseableHttpResponse;
//import cz.msebera.android.httpclient.client.methods.HttpPost;
//import cz.msebera.android.httpclient.impl.client.CloseableHttpClient;
//import cz.msebera.android.httpclient.impl.client.HttpClients;
//import cz.msebera.android.httpclient.message.BasicNameValuePair;
//import cz.msebera.android.httpclient.util.EntityUtils;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class HttpActivity extends AnswerActivity {

    public static Drawable mydrawable = null;

    public static void timer() {

        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                getControlMessage();
                getChatRoomMessageByStuApp(last_actiontime_chat);
            }
        },100,100);
    }

    //http访问服务器请求,学生获取互动消息接口
    public static void getControlMessage() {

        try {
            String roomId = LaunchActivity.mRoomId;
            String userId = LaunchActivity.mUserId;
            //1,找水源--创建URL
            //URL url = new URL("http://www.cn901.net:8111/AppServer/ajax/studentApp_getStudentAnswerList.do?learnPlanId=ba6aa102-de42-430d-b953-d046953f264f&userName=ming6051");//放网站
            //URL url = new URL("http://www.cn901.net:8111/AppServer/ajax/userManage_login.do?userName="+userid+"&passWord="+userpassword+"&callback=ha");
            //URL url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_getControlMessage.do?roomId="+roomId+"&userId="+userId);
            URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_getControlMessage.do?roomId="+roomId+"&userId="+userId);
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
            Log.e("MAIN-http", buffer.toString());//打印结果

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

    //http访问服务器请求,学生获取消息列表
    public static void getChatRoomMessageByStuApp(String lastCurrentTime) {
        try {
            String roomId = LaunchActivity.mRoomId;
            String userId = LaunchActivity.mUserId;
            String startTime = "0";
            URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_getChatRoomMessageByStuApp.do?"
                    +"roomId="+roomId
                    +"&userId="+userId
                    +"&startTime="+last_actiontime_chat);
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
            Log.e("MAIN-http", buffer.toString());//打印结果

            try{
                // 从服务器端获取Json字符串
                String backlogJsonStr = buffer.toString();
                backlogJsonStr = backlogJsonStr.substring(backlogJsonStr.indexOf("{"), backlogJsonStr.lastIndexOf("}") + 1);
                backlogJsonStr = backlogJsonStr.replace("\\\"","'");
                JSONObject jsonObject = new JSONObject(backlogJsonStr);

                System.out.println("last_actiontime_chat==>"+last_actiontime_chat);

                chatTime = jsonObject.getString("currentTime");
                System.out.println("currentTime==>"+chatTime);

                //更新聊天当前值，将新获取到的消息append到messagelist后面
                last_actiontime_chat = chatTime;

//                String messagelist = jsonObject.getString("list");
//                System.out.println("messagelist==>"+messagelist);
                JSONArray messages=jsonObject.getJSONArray("list");
                System.out.println("chat_length:"+messages.length());

                //AnswerActivity.messageList=new ArrayList<>();
                //messageList = new LinkedList<>();

                //AnswerActivity.messageList;
                //chatBeanList.add(new ChatBean("Hello~~~",null,0));
                if(messages.length()<=0){
                    return;
                }
                mydrawable = HttpActivity.loadImageFromNetwork(mUserPhoto);
                for(int i=0;i<messages.length();i++){
                    ChatBean item = new ChatBean();
                    item.messageStuget = messages.getJSONObject(i).getString("message");
                    item.phone = messages.getJSONObject(i).getString("phone");
                    item.time = messages.getJSONObject(i).getString("time");
                    item.timeStr = messages.getJSONObject(i).getString("timeStr");
                    item.nameStuget = messages.getJSONObject(i).getString("name");
                    item.userId = messages.getJSONObject(i).getString("userId");
                    item.role = messages.getJSONObject(i).getString("role");
                    item.type=Integer.parseInt(item.role);
                    item.drawable = loadImageFromNetwork(item.phone);
                    System.out.println("phone:"+item.phone);

                    System.out.println("currentTime==>"+chatTime);
                    System.out.println("iiiitemTime==>"+item.time);
                    //if(item.time.compareTo(chatTime)>=0){
                        AnswerActivity.messageList.add(item);
                    //}
                }
//                System.out.println("mlist:"+AnswerActivity.messageList.size());
//                for(int i=0;i<AnswerActivity.messageList.size();i++){
//                    System.out.println("messageList["+i+"]"+AnswerActivity.messageList.get(i).messageStuget);
//                }
//
//                if(LaunchActivity.mlist_size!=AnswerActivity.messageList.size()){
//                    LaunchActivity.refreshChatFlag = 1;
//                    LaunchActivity.mlist_size=AnswerActivity.messageList.size();
//                }
//                else {
//                    LaunchActivity.refreshChatFlag = 0;
//                }
//                System.out.println("refreshChatFlag:"+LaunchActivity.refreshChatFlag);

            }catch (JSONException e) {
                e.printStackTrace();
            }
        } catch (MalformedURLException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    static Drawable loadImageFromNetwork(String urladdr) {
        Drawable drawable = null;
        try{
            //judge if has picture locate or not according to filename
            drawable = Drawable.createFromStream(new URL(urladdr).openStream(), "image.jpg");
        }catch(IOException e){
            Log.d("test",e.getMessage());
        }
        if(drawable == null){
            Log.d("test","null drawable");
        }else{
            Log.d("test","not null drawable");
        }
        return drawable;
    }


    //http访问服务器请求,学生保存答案
    public static void stuSaveAnswer(final String stuAnswer) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
//            String answerQuestionId = "c3407566-b14f-465c-9ed9-fa48ecc7b2fe";
//            String stuAnswer="asdfghjkl";
                    String userId = LaunchActivity.mUserId;
                    String name =LaunchActivity.mUserCn;
                    String startAnswerTime = "1234567890000";
                    String source = "app";
                    URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_stuSaveAnswer.do?"
                            + "answerQuestionId="+questionId
                            + "&stuAnswer="+stuAnswer
                            + "&userId="+userId
                            + "&name="+name
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


    //http访问服务器请求,学生抢答
    public static void testQiangDa() {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
//            String answerQuestionId = "c3407566-b14f-465c-9ed9-fa48ecc7b2fe";
//            String stuAnswer="asdfghjkl";
                    String userId = LaunchActivity.mUserId;
                    String name =LaunchActivity.mUserCn;
                    String startAnswerTime = "1234567890000";
                    String source = "app";
                    URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_saveStuQd.do?"
                            + "questionId="+questionId
                            + "&baseTypeId="+questionBaseTypeId
                            + "&questionSubNum="+questionSubNum
                            + "&roomId="+mRoomId
                            + "&stuId="+mUserId
                            + "&stuName="+mUserCn
                            + "&stuId="+mUserId
                            + "&source="+source
                            + "&ketangId="+"");
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

    //http访问服务器请求,学生发送消息
    public static void saveChatRoomMessage(final String message) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
                    String roomId = LaunchActivity.mRoomId;
                    String userId = LaunchActivity.mUserId;
                    String userCn =LaunchActivity.mUserCn;
                    //String userPhone ="http:\\/\\/www.cn901.com\\/res\\/avatar\\/2020\\/02\\/avatar-mingming-19074821.jpg";
                    String userPhone =LaunchActivity.mUserPhoto;
                    //String message = "";
                    String role = "0";
                    String source = "app";
                    URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_saveChatRoomMessage.do?"
                            + "roomId="+roomId
                            + "&userId="+userId
                            + "&userCn="+userCn
                            + "&userPhone="+userPhone
                            + "&message="+message
                            + "&role="+role
                            + "&source="+source);
                    //URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_stuSaveAnswer.do?answerQuestionId=948fa054-8b95-4fce-bb8f-7ae914ffbb76&stuAnswer=D&userId=ming6001&name=ming6001&startAnswerTime=1650002839347&source=app");
                    System.out.println(url);
                    HttpURLConnection ansConnection = (HttpURLConnection) url.openConnection();
                    ansConnection.setRequestMethod("GET");
                    ansConnection.setConnectTimeout(8000);
                    ansConnection.setReadTimeout(8000);
                    InputStream inputStream = ansConnection.getInputStream();
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
                        AnswerActivity.chatStatus = jsonObject.getString("status");
                        System.out.println("chatStatus==>"+AnswerActivity.chatStatus);
                        AnswerActivity.chatMessage = jsonObject.getString("message");
                        System.out.println("chatMessage==>"+chatMessage);
                        System.out.println("chatMessage_item==>"+message);
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

    //模拟学生app端进房间，出房间（仅测试使用）
    public static void testJoinOrLeaveRoom(String action) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
                    String roomId = LaunchActivity.mRoomId;
                    String userId = LaunchActivity.mUserId+"_"+LaunchActivity.mUserCn;
                    //String userId = "123123_测试名称";
                    String type = action;
                    URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_TestJoinOrLeaveRoom.do?"
                            + "roomId="+roomId
                            + "&userId="+userId
                            + "&type="+type);
                    System.out.println(url);
                    HttpURLConnection ansConnection = (HttpURLConnection) url.openConnection();
                    ansConnection.setRequestMethod("GET");
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
                    System.out.println("MAIN-testJoinOrLeaveRoom"+ buffer.toString());//打印结果
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

    //模拟学生app端举手
    public static void testRaiseHandAction(String handaction) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
                    String roomId = LaunchActivity.mRoomId;
                    String userId = LaunchActivity.mUserId;

                    String raiseHandAction = handaction+"_"+userId;
                    URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_saveControl.do?"
                            + "roomId="+roomId
                            + "&raiseHandAction="+raiseHandAction);
                    System.out.println(url);
                    HttpURLConnection ansConnection = (HttpURLConnection) url.openConnection();
                    ansConnection.setRequestMethod("GET");
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
    public static void saveBase64Image(Bitmap bitmap) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
                    String roomId = LaunchActivity.mRoomId;
                    String userId = LaunchActivity.mUserId;

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

//    public static String testUploadImageBase64(Bitmap bitmap) {
//        String baseCode = bitmapToBase64(bitmap);
//        //String serverUrl = "http://www.cn901.com/ShopGoods/ajax/studentApp_saveBase64Image.do";
//        String serverUrl = "http://www.cn901.net:8111/AppServer/ajax/studentApp_saveBase64Image.do";
//        String str = null;
//        CloseableHttpClient httpclient = HttpClients.createDefault();
//        HttpPost httppost = new HttpPost(serverUrl);
//        List<NameValuePair> formparams = new ArrayList<NameValuePair>();
//        formparams.add(new BasicNameValuePair("baseCode", baseCode));
//        formparams.add(new BasicNameValuePair("learnPlanId", "1111"));
//        formparams.add(new BasicNameValuePair("userId", "ming6010"));
//        UrlEncodedFormEntity uefEntity;
//        try {
//            uefEntity = new UrlEncodedFormEntity(formparams, "GBK");
//            httppost.setEntity(uefEntity);
//            CloseableHttpResponse response = httpclient.execute(httppost);
//            try {
//                HttpEntity entity = response.getEntity();
//                if (entity != null) {
//                    str = EntityUtils.toString(entity);
//                    return str;
//                }
//            } finally {
//                response.close();
//            }
//        } catch (ClientProtocolException e) {
//            e.printStackTrace();
//        } catch (UnsupportedEncodingException e1) {
//            e1.printStackTrace();
//        } catch (IOException e) {
//            e.printStackTrace();
//        } finally {
//            try {
//                httpclient.close();
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        }
//        return "";
//    }

    public static String readContentFromPost(Bitmap bitmap){
        final String[] ans = {""};
        new Thread(new Runnable() {
            @Override
            public void run(){
                try {
                    String baseCode = bitmapToBase64(bitmap);
                    System.out.println("basecode:"+baseCode);


//                    URL  postUrl = new URL("http://www.cn901.net:8111/AppServer/ajax/studentApp_saveBase64Image.do?"
//                    + "roomId="+LaunchActivity.mRoomId
//                    + "&userId="+LaunchActivity.mUserId
//                    + "&questionId="+questionId
//                    + "&baseCode="+baseCode);

                    // Post请求的url，与get不同的是不需要带参数
                    //URL postUrl = new URL("http://www.cn901.net:8111/AppServer/ajax/studentApp_saveBase64Image.do");
                    URL postUrl = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_saveBase64Image.do");
                    // 打开连接
                    HttpURLConnection connection = (HttpURLConnection) postUrl.openConnection();
                    // 设置是否向connection输出，因为这个是post请求，参数要放在
                    // http正文内，因此需要设为true
                    connection.setDoOutput(true);
                    // Read from the connection. Default is true.
                    connection.setDoInput(true);
                    // 默认是 GET方式
                    connection.setRequestMethod("POST");
                    // Post 请求不能使用缓存
                    connection.setUseCaches(false);
                    connection.setInstanceFollowRedirects(true);
                    // 配置本次连接的Content-type，配置为application/x-www-form-urlencoded的
                    // 意思是正文是urlencoded编码过的form参数，下面我们可以看到我们对正文内容使用URLEncoder.encode
                    // 进行编码
                    connection.setRequestProperty("Content-Type","application/x-www-form-urlencoded");
                    // 连接，从postUrl.openConnection()至此的配置必须要在connect之前完成，
                    // 要注意的是connection.getOutputStream会隐含的进行connect。
                    connection.connect();
                    DataOutputStream out = new DataOutputStream(connection.getOutputStream());
                    // The URL-encoded contend
                    // 正文，正文内容其实跟get的URL中 '? '后的参数字符串一致
                    baseCode = URLEncoder.encode(baseCode,"utf-8");
                    String content = "questionId="+questionId+ "&userId="+ mUserId + "&roomId=" + mRoomId + "&baseCode="+baseCode;
                    // DataOutputStream.writeBytes将字符串中的16位的unicode字符以8位的字符形式写到流里面
                    out.writeBytes(content);
                    out.flush();
                    out.close();
                    BufferedReader reader = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                    String line;
                    StringBuffer buffer = new StringBuffer();
                    while ((line = reader.readLine()) != null){
                        System.out.println(line);
                        buffer.append(line);
                    }
                    try{
                        // 从服务器端获取Json字符串
                        String backlogJsonStr = buffer.toString();
                        backlogJsonStr = backlogJsonStr.substring(backlogJsonStr.indexOf("{"), backlogJsonStr.lastIndexOf("}") + 1);
                        backlogJsonStr = backlogJsonStr.replace("\\\"","'");
                        JSONObject jsonObject = new JSONObject(backlogJsonStr);
                        String data = jsonObject.getString("status");
                        System.out.println("base64 success==>"+data);

                        base64url = jsonObject.getString("url");
                        //System.out.println("base64 url==>"+base64url.replaceFirst("/html",""));
                        System.out.println("base64 url==>"+base64url.replaceFirst("/html",""));
                        ans[0] = base64url;
                        base64id_url.put(base64_index,base64url);
                        base64_index++;

                    }catch (JSONException e) {
                        e.printStackTrace();
                        System.out.println("base64 wrong1==>");
                    }

                } catch (IOException e) {
                    e.printStackTrace();
                    System.out.println("readContent wrong:");
                }

            }

        }).start();
        try {
            Thread.sleep(60);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
        return ans[0];
    }

    public static String txt2String(File file){
        StringBuilder result = new StringBuilder();
        try{
            BufferedReader br = new BufferedReader(new FileReader(file));//构造一个BufferedReader类来读取文件
            String s = null;
            while((s = br.readLine())!=null){//使用readLine方法，一次读一行
                result.append(System.lineSeparator()+s);
            }
            br.close();
        }catch(Exception e){
            e.printStackTrace();
        }
        return result.toString();
    }

}
