package com.navigationdemo;

import java.util.ArrayList;
import java.util.List;

public class AnswerActivityTea extends MainActivity_tea {

    public static List<StudentDataBean> joinList = new ArrayList<>();
    public static List<ClassDataBean> ketangList = new ArrayList<>();
    public static List<MemberDataBean> handsUpList = new ArrayList<>();

    public static String roomId;
    public static String currentketangId;   //自己的课堂id
    public static String answerQuestionId;

    public static List<KeTangBean> classList;  //加入的课堂  //要分析的课堂信息（肖先把数据传递过来）（他传过来的数据应该不包括  汇总数据以及其它移动端）

    //接口2 开始答题、结束答题等
    public static Long startTime;
    public static boolean isSuccess;


    //接口7
    public static int answerNum; //已作答学生人数

    //接口3
    public static List<Integer> ylist; //柱状图-纵坐标（每个答案选择的学生个数）
    public static List<String> xlist; //柱状图-横坐标（答案）
    public static List<StuAnswerBean> alist; //作答的学生信息
    public static boolean submitAnswerStatus;  //是否有人作答
    public static String answer;  //正确答案
    public static String answerStu; //所有学生答案(需要分割)

    //接口5
    public static boolean submitAnswerStatus_zhuguan; //是否有人作答（主观题）
    public static List<StuAnswerBean> alist_zhuguan; //作答的学生信息（主观题）

    //接口8  获取随机或者抢答的学生姓名，学生id
    public static String flag;   //kt表示随机的是课堂的学生，stu表示随机的是移动端的学生
    public static String ketangId;  //flag=kt，ketangId=具体课堂id;flag=stu，则ketangId=-1
    public static String stuId;
    public static String stuName;


    //接口9 获取随机或者抢答的学生提交的答案
    public static String answer_sjOrQd;

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
