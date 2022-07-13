package com.navigationdemo;

import android.graphics.Bitmap;
import android.graphics.drawable.Drawable;
import android.util.Base64;
import android.util.Log;

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
        },300,300);
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
                System.out.println("length:"+messages.length());
                if(messages.length()==0){
                    LaunchActivity.refreshChatFlag = 0;
                }
                else {
                    LaunchActivity.refreshChatFlag = 1;
                }
                //AnswerActivity.messageList=new ArrayList<>();
                //messageList = new LinkedList<>();

                //AnswerActivity.messageList;
                //chatBeanList.add(new ChatBean("Hello~~~",null,0));
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
                System.out.println("mlist:"+AnswerActivity.messageList.size());

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
                    String userPhone ="http://www.cn901.com/res/avatar/2020/02/avatar-mingming-19074821.jpg";
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

    //学生上传图片
    public static void saveBase64Image(Bitmap bitmap) {
        new Thread(new Runnable(){
            @Override
            public void run() {
                try {
                    String roomId = LaunchActivity.mRoomId;
                    String userId = LaunchActivity.mUserId;

                    /**
                     *bitmap转为base64
                     */
                    //先将bitmap转为byte[]
                    ByteArrayOutputStream baos = new ByteArrayOutputStream();
                    bitmap.compress(Bitmap.CompressFormat.JPEG,50,baos);
                    byte[] bytes = baos.toByteArray();

                    //将byte[]转为base64
                    String baseCode = Base64.encodeToString(bytes,Base64.NO_WRAP);
                    System.out.println("base64:"+baseCode);

                    URL url = new URL("http://www.cn901.net:8111/AppServer/ajax/studentApp_saveBase64Image.do?baseCode="+baseCode+"&&learnPlanId==test111&userId=ming6002&callback=ha");

//                    URL  url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_saveBase64Image.do?"
//                            + "roomId="+roomId
//                            + "&userId="+userId
//                            + "&questionId="+questionId
//                            + "&baseCode="+baseCode);
                    System.out.println(url);
                    HttpURLConnection ansConnection = (HttpURLConnection) url.openConnection();
                    ansConnection.setRequestMethod("GET");
                    System.out.println("ansConnection"+ansConnection);
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
}
