package com.navigationdemo;

import java.util.ArrayList;
import java.util.List;

public class AnswerActivityStu extends MainActivity_stu {

    public static String questionAction;
    public static String questionTime;
    public static String questionId;
    public static String questionBaseTypeId;
    public static String questionSubNum;
    public static String questionStartAnswerTime;
    public static String deviceMicAction;
    public static String deviceMicTime;
    public static String deviceCameraAction;
    public static String deviceCameraTime;
    public static String deviceWordsAction;
    public static String deviceWordsTime;
    public static String platformUserId;
    public static String allHandAction;
    public static String success;
    public static String message;
    public static String base64url;

    public static String chatTime;
    public static List<ChatBean> messageList;

    public static String chatStatus="";
    public static String chatMessage="";

    public static List<ClassDataBean> ketangList = new ArrayList<>();
    public static List<StudentDataBean> joinList = new ArrayList<>();

    public static StudentDataBean findMemberInJoinList(String userId) {
        for (int i = 0; i < joinList.size(); i++ ){
            if(userId.equals(joinList.get(i).getUserId()))
                return joinList.get(i);
        }
        return null;
    }

    public static ClassDataBean findMemberInKetangList(String userId) {
        for (int i = 0; i < ketangList.size(); i++ ){
            if(userId.equals(ketangList.get(i).getUserId()))
                return ketangList.get(i);
        }
        return null;
    }
}
