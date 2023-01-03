package com.navigationdemo;

import android.annotation.SuppressLint;
import android.content.Context;
import android.graphics.Color;
import android.os.Build;
import android.os.Bundle;
import android.os.SystemClock;
import android.text.Html;
import android.text.method.ScrollingMovementMethod;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.WindowManager;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.widget.AdapterView;
import android.widget.Button;
import android.widget.Chronometer;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.core.content.ContextCompat;
import androidx.fragment.app.Fragment;

import com.github.mikephil.charting.charts.BarChart;
import com.github.mikephil.charting.components.AxisBase;
import com.github.mikephil.charting.components.Legend;
import com.github.mikephil.charting.components.XAxis;
import com.github.mikephil.charting.components.YAxis;
import com.github.mikephil.charting.data.BarData;
import com.github.mikephil.charting.data.BarDataSet;
import com.github.mikephil.charting.data.BarEntry;
import com.github.mikephil.charting.data.Entry;
import com.github.mikephil.charting.formatter.IAxisValueFormatter;
import com.github.mikephil.charting.formatter.IValueFormatter;
import com.github.mikephil.charting.interfaces.datasets.IBarDataSet;
import com.github.mikephil.charting.utils.ViewPortHandler;
import com.navigationdemo.AnswerActivityTea;
import com.navigationdemo.Http_HuDongActivityTea;
import com.navigationdemo.KeTangBean;
import com.navigationdemo.MainActivity_tea;
import com.navigationdemo.R;
import com.navigationdemo.StuAnswerBean;
import com.navigationdemo.adapter.MyAdapter;
import com.navigationdemo.utils.MyImageGetter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.security.SecureRandom;
import java.security.cert.CertificateException;
import java.security.cert.X509Certificate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;

import javax.net.ssl.HostnameVerifier;
import javax.net.ssl.HttpsURLConnection;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSession;
import javax.net.ssl.TrustManager;
import javax.net.ssl.X509TrustManager;

import android.content.res.Configuration;


public class AnswerQuestionFragment extends Fragment implements View.OnClickListener{
    final Context context = getActivity();
    private View FcontentView; //Fragment页面对应的view

    private double screenWidth , screenHeight;

    private Chronometer jishiqi;
    private TextView tx_answers_sum; //作答人数/总人数

    private TextView txType_tiwen; //互动类型-提问
    private TextView txType_suiji; //互动类型-随机
    private TextView txType_qiangda; //互动类型-抢答
    private ImageView img_tiwen , img_suiji , img_qiangda;
    private int txType = 1;  ///1提问2随机3抢答


    private TextView txModle_danxuan; //互动模式-单选
    private TextView txModle_duoxuan; //互动模式-多选
    private TextView txModle_panduan; //互动模式-判断
    private TextView txModle_luru; //互动模式-录入

    private ImageView imgdanxuan , imgduoxuan , imgpanduan , imgluru;

    private LinearLayout linear_choose; //txChoose+tx_choosenum+img_choose
    private TextView txChoose  , tx_choosenum; //选项数
    private ImageView img_choose;
    //    private Spinner spinner; //下拉选择框
//    private TextView spinner;
    private int chooseNum = 4; //默认选项个数是4
    private PopupWindow pw_chooseNum;
    private TextView tx_2 , tx_3 , tx_4 , tx_5 , tx_6 , tx_7 , tx_8 ;

    private Button btBegin1 , btBegin2; //开始按钮（不可点击、可点击）
    private LinearLayout linear1 , linear2; //按钮：单题分析 答题详情  结束作答 关闭提问;计时器区域
    private Button btSingle , btAnswers , btEnd , btClosed; //单题分析 答题详情  结束作答 关闭提问

    private BarChart barChart; //柱状图
    private TextView tx_noanswer; //没有人提交答案
    private ScrollView slStusAnswers; //答题详情

    private PopupWindow popupWindow_szda; //客观题-设置答案弹框

    //主观题
    private ScrollView slStusAnswersImg; //答案内容
    private ScrollView slStusAnswers_zhuguan;  //答题详情
    private TextView tx_noanswer_zhuguan;//没有人提交答案

    //单选UI
    private LinearLayout linear_danxuan;
    private ImageView a , b , c , d , e , f , g , h;

    //多选UI
    private LinearLayout linear_duoxuan;
    private ImageView a1 , b1 , c1 , d1 , e1 , f1 , g1 , h1;

    //判断UI
    private LinearLayout linear_panduan;
    private ImageView right , error;
    private String answer;
    private boolean setAnswer_status; //设置答案是否成功

    //单选UI(随机、抢答）
    private LinearLayout linear_danxuan_sq;
    private ImageView a_sq , b_sq , c_sq , d_sq , e_sq , f_sq , g_sq , h_sq;

    //多选UI(随机、抢答）
    private LinearLayout linear_duoxuan_sq;
    private ImageView a1_sq , b1_sq , c1_sq , d1_sq , e1_sq , f1_sq , g1_sq , h1_sq;

    //判断UI(随机、抢答）
    private LinearLayout linear_panduan_sq;
    private ImageView right_sq , error_sq;
    private String answer_sq;
    private boolean setAnswer_status_sq; //设置答案是否成功

    //随机或抢答的状态
    /**
     * 0:初始值
     * 1:随机或抢答选中了一个学生
     * 2:学生回答了问题=>激活设置答案和点赞按钮
     * 3:老师设置了答案
     */
    private int suiji_qiangda_flag = 0;

    //随机或抢答的学生的姓名、id以及答案
    private String stuName_selected , stuId_selected , stuAnswer_selected;
    //轮训(随机/抢答 选人，获取答案时公用)
    private Timer mTimer;
    //轮训(提问 获取已经提交答案的学生人数)
    private Timer mTimer_stuNum;

    private PopupWindow pw_selectStu;
    private ImageView img_zan;
    private TextView tx_stuname , tx_tishi;
    private boolean isClick_btClose = false;
    //随机/抢答 已选中学生和设置答案弹框
    private PopupWindow pw_selectStuAnswer , pw_setAnswer;


    //单题分析页面，左侧班级列表
    private int selectedIndex = 0;
    private TextView tx_huizong;
    private boolean isSelect_huizong = true;
    private MyAdapter myAdapter;

    //单题分析 答题详情右侧页面顶部详细信息（最快答对、正确率等）
    private TextView tx_quick , tx_top1 , tx_top2 , tx_top3;
    private ImageView img_top1 , img_top2 , img_top3;

    private TextView tx_answer1 , tx_answer2 , tx_right1 , tx_right2 , tx_dati1 , tx_dati2;
    private LinearLayout linear_right , linear_quick , linear_answer;

    //答题详情页面，右侧答题情况，静态数据
    private List<String> listAnswers;
    private List<List<String>> listStusName;

    //主观题学生答案
    private List<String> stusNameList;
    private List<String> stusAnswerList;
    private int selectStuAnswerIndex = 0; //主观题（选中哪个学生的答案stusNameList）

    //文字形式的主观题答案
    private List<List<String>> stusAnswerList_name_txt;
    private List<String> stusAnswerList_answer_txt;

    //拍照形式的主观题答案
    private List<String> stusAnswerList_name_img;
    private List<String> stusAnswerList_answer_img;

    //未作答的学生(主观题)
    private List<String> stusAnswerList_Noanswer = Arrays.asList(new String[]{
            "谢海玉" , "吴妙仁" , "孔国宁" , "陈思" , "马元兴" , "孟丹君"
    });

    public void setListitem(List<String> listitem) {
        this.listitem.clear();
        this.listitem.addAll(listitem);
        myAdapter.notifyDataSetChanged();

    }

    private  List<String> listitem;

    public AnswerQuestionFragment() {
        // Required empty public constructor
        initJoinClassInformation();
    }
    //获取屏幕宽高
    private void getScreenProps(){
        //应用程序显示区域指定可能包含应用程序窗口的显示部分，不包括系统装饰
        DisplayMetrics displayMetrics = getActivity().getResources().getDisplayMetrics();
        screenWidth = displayMetrics.widthPixels;
        screenHeight = displayMetrics.heightPixels;
        Log.e("", "width: " + screenWidth + ",height:" + screenHeight);
    }

    //获取32位uuid作为questionId（默认是32位）
    private void getUUID(){
        System.out.println("旧的answerQuestionId是: " + AnswerActivityTea.answerQuestionId);
        AnswerActivityTea.answerQuestionId = UUID.randomUUID().toString();
        System.out.println("新的answerQuestionId是: " + AnswerActivityTea.answerQuestionId);
    }

    //UI组件事件绑定
    private void bindViews() {
        txType_tiwen.setOnClickListener(this);
        txType_suiji.setOnClickListener(this);
        txType_qiangda.setOnClickListener(this);
        txModle_danxuan.setOnClickListener(this);
        txModle_duoxuan.setOnClickListener(this);
        txModle_panduan.setOnClickListener(this);
        txModle_luru.setOnClickListener(this);

        img_tiwen.setOnClickListener(this);
        img_suiji.setOnClickListener(this);
        img_qiangda.setOnClickListener(this);

        imgdanxuan.setOnClickListener(this);
        imgduoxuan.setOnClickListener(this);
        imgpanduan.setOnClickListener(this);
        imgluru.setOnClickListener(this);
    }

    //重置所有文本的选中状态(互动类型)
    private void setSelected1(){
        txType_tiwen.setSelected(false);
        txType_suiji.setSelected(false);
        txType_qiangda.setSelected(false);

        img_tiwen.setSelected(false);
        img_suiji.setSelected(false);
        img_qiangda.setSelected(false);
    }
    //重置所有文本的选中状态(互动模式)
    private void setSelected2(){
        txModle_danxuan.setSelected(false);
        txModle_duoxuan.setSelected(false);
        txModle_panduan.setSelected(false);
        txModle_luru.setSelected(false);

        imgdanxuan.setSelected(false);
        imgduoxuan.setSelected(false);
        imgpanduan.setSelected(false);
        imgluru.setSelected(false);
    }

    //互动模式其中一项是否被选中
    private boolean isSelected(){
        if(txModle_danxuan.isSelected()
                || txModle_duoxuan.isSelected()
                || txModle_panduan.isSelected()
                || txModle_luru.isSelected()
        ){
            return true;
        }
        return false;
    }

    //显示答题详情(客观题）
    private void showStusAnswers(View v){
        System.out.println("显示答题详情！！！！！！！！！！！！！！！！！！！！！！！！！！！！");
        System.out.println("学生答案: " + AnswerActivityTea.answerStu);
        LinearLayout linearStusAnswers = v.findViewById(R.id.linearStusAnswers);
        //清空布局
        linearStusAnswers.removeAllViews();
        splitStuAnswers(); //分割学生答案
        //选择的答案个数
        int linearSum = listAnswers.size();
        LinearLayout[] answersList = new LinearLayout[linearSum];
        for(int k = 0 ; k < answersList.length ; k++){
            answersList[k] = new LinearLayout(getActivity());
            //设置参数
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            answersList[k].setLayoutParams(params);
            answersList[k].setOrientation(LinearLayout.HORIZONTAL);
        }
        boolean flag = false; //用来标识当前展示的选项是否是正确答案
        for(int i = 0 ; i < listStusName.size() ; i++){
            if(listAnswers.get(i).equals(answer)){
                flag = true;
            }

            TextView txt_answerTitle = new TextView(getActivity());
            //设置参数
            LinearLayout.LayoutParams tparams = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            tparams.setMargins(30 , 3 , 0 , 0);
            txt_answerTitle.setLayoutParams(tparams);
//            txt_answerTitle.setTextSize(15);
            txt_answerTitle.setTextColor(Color.parseColor("#828798"));

            TextView txt_answer = new TextView(getActivity());
            //设置参数
            LinearLayout.LayoutParams txt_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            txt_params.setMargins(5 , 3 , 0 , 0);
            txt_answer.setLayoutParams(txt_params);
//            txt_answer.setTextSize(20);
            if(listAnswers.get(i).equals("未答")){
                txt_answerTitle.setText("未答题");
                answersList[i].addView(txt_answerTitle);
            }else{
                txt_answerTitle.setText("选择: ");
                txt_answer.setTextColor(Color.parseColor("#90d7ec"));
                txt_answer.setText(listAnswers.get(i));
                answersList[i].addView(txt_answerTitle);
                answersList[i].addView(txt_answer);
            }
            linearStusAnswers.addView(answersList[i]);

            //包裹选择当前选项作为答案的学生姓名
            LinearLayout linearAll = new LinearLayout(getActivity());
            //设置参数
            LinearLayout.LayoutParams linear_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            linear_params.setMargins(20 , 0 , 20 , 0 );
            linearAll.setLayoutParams(linear_params);
            linearAll.setOrientation(LinearLayout.VERTICAL);

            int linearCount = (int)Math.ceil(listStusName.get(i).size() / 8.0);
            Log.e("一共有多少学生:   " , listStusName.get(i).size() + "");
            Log.e("一共需要多少个linear:   " , linearCount + "");
            LinearLayout[] linearList = new LinearLayout[linearCount];
            for(int k = 0 ; k < linearList.length ; k++){
                linearList[k] = new LinearLayout(getActivity());
                //设置参数
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT);
                linearList[k].setLayoutParams(params);
                linearList[k].setWeightSum(8);
                linearList[k].setOrientation(LinearLayout.HORIZONTAL);
            }
            for(int j = 0 ; j < listStusName.get(i).size() ; j++){
                TextView txt_name = new TextView(getActivity());
                //设置参数
//                LinearLayout.LayoutParams txtname_params = new LinearLayout.LayoutParams(70, 30);
                LinearLayout.LayoutParams txtname_params = new LinearLayout.LayoutParams(
                        0,
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        1);

                //每行展示8个学生姓名
                if(j % 8 == 0){
                    txtname_params.setMargins(10 , 3 , 5 , 3);
                }else{
                    txtname_params.setMargins(5 , 3 , 5 , 3);
                }
                txt_name.setLayoutParams(txtname_params);
                txt_name.setPadding(5 , 2 , 5 , 2);
//                txt_name.setTextSize(15);
                txt_name.setGravity(Gravity.CENTER);
                txt_name.setText(listStusName.get(i).get(j));
//                txt_name.setBackgroundColor(Color.parseColor("#007947"));
                if(flag){ //正确答案
                    txt_name.setBackgroundColor(Color.parseColor("#84bf96"));
                    txt_name.setTextColor(Color.parseColor("#007947"));
                }else{
                    txt_name.setBackgroundColor(Color.parseColor("#d3d7d4"));
                    txt_name.setTextColor(Color.parseColor("#828798"));
                }
                linearList[j / 8].addView(txt_name);
            }
            flag = false;
            for(int k = 0 ; k < linearList.length ; k++){
                linearAll.addView(linearList[k]);
            }
            linearStusAnswers.addView(linearAll);
        }
    }

    //分割学生答案-客观题
    private void splitStuAnswers(){
        System.out.println("开始分割学生答案！！！！！！！！！！！！！！");
        //AnswerActivity.answerStu格式:
        // D:葛舸_2,葛舸_5,索夏利,@#@A:葛舸_3,@#@B:葛舸_1,何一繁,卢文静,@#@C:葛舸_0,葛舸_4,孙亮亮,@#@
        String stuAnswers = AnswerActivityTea.answerStu;
        System.out.println("学生答案1111:" + stuAnswers);
        String[] answer_names_list = stuAnswers.split(",@#@");
        for(int i = 0 ; i < answer_names_list.length ; i++){
            System.out.println("学生答案2222:" + answer_names_list[i]);
        }

        //答案列表
        if(listAnswers != null){
            listAnswers.clear();
        }else{
            listAnswers = new ArrayList<>();
        }
        //学生姓名列表
        if(listStusName != null){
            listStusName.clear();
        }else{
            listStusName = new ArrayList<List<String>>();
        }
        for(int i = 0 ; i < answer_names_list.length ; i++){
            String answer = answer_names_list[i].substring(0 , answer_names_list[i].indexOf(":"));
            listAnswers.add(answer);

            String names = answer_names_list[i].substring(answer_names_list[i].indexOf(":") + 1);
            String[] name_list = names.split(",");
            List<String> name_List = new ArrayList<String>(Arrays.asList(name_list));
            listStusName.add(name_List);
        }
        System.out.println("listAnswers: " + listAnswers);
        System.out.println("listStusName: " + listStusName);
    }

    //获取答对人数
    private int getAnswerCurrentStuNum(){
        int count = 0;
        for(int i = 0 ; i < listAnswers.size() ; i++){
            if(listAnswers.get(i).equals(answer)){
                return listStusName.get(i).size();
            }
        }
        return count;
    }

    //获取答对学生名单(只有姓名)
    private List<String> getAnswerCurrentStuNames(){
        List<String> stus_right = new ArrayList<>();
        for(int i = 0 ; i < listAnswers.size() ; i++){
            if(listAnswers.get(i).equals(answer)){
                stus_right.addAll(listStusName.get(i));
                break;
            }
        }
        return stus_right;
    }

    //获取前几个答对学生信息StuAnswerBean（最多找3个)
    private List<StuAnswerBean> getACStuBeanList(int num){
        int findNum = num >= 3 ? 3 : num;
        List<StuAnswerBean> answerRight_stuslistTop = new ArrayList<StuAnswerBean>();
        for(int i = 0 ; i < AnswerActivityTea.alist.size() ; i++){
            if(answerRight_stuslistTop.size() >= findNum){
                break;
            }else{
                if(AnswerActivityTea.alist.get(i).stuAnswer.equals(answer)){
                    answerRight_stuslistTop.add(AnswerActivityTea.alist.get(i));
                }
            }
        }
        return answerRight_stuslistTop;
    }


    //判断是否显示页面右侧顶部详细信息
    private void isShowMoreInformation(int flag , int index){
        System.out.println("是否显示正确率、最快答对人数信息、正确答案!!!!!!!!!!!!!");
        if(answer != null && answer.length() > 0){ //已经设置了答案 flag=1标识单题分析页面
            splitStuAnswers(); //分割学生答案
//            List<String> answerRight_stuList = getAnswerCurrentStuNames(); //答对学生名单
            int answer_rightNum = getAnswerCurrentStuNum(); //答对人数
            System.out.println("答对人数: " + answer_rightNum);
            if(flag == 1){ //已经设置了答案 flag=1标识单题分析页面
                if(answer_rightNum > 0){ //显示前三个答对学生信息
                    linear_quick.setVisibility(View.VISIBLE);
                    img_top1.setVisibility(View.INVISIBLE);
                    tx_top1.setVisibility(View.INVISIBLE);
                    img_top2.setVisibility(View.INVISIBLE);
                    tx_top2.setVisibility(View.INVISIBLE);
                    img_top3.setVisibility(View.INVISIBLE);
                    tx_top3.setVisibility(View.INVISIBLE);
                    //前几个答对学生名单(最多3个）
                    List<StuAnswerBean> answerRight_stuslistTop = getACStuBeanList(answer_rightNum);
                    for(int i = 0 ; i < answerRight_stuslistTop.size() ; i++){
                        System.out.println("答对学生姓名: " + (i + 1) + " , " + answerRight_stuslistTop.get(i).name);
                    }
                    int quickNum = answerRight_stuslistTop.size();
                    if(quickNum >= 1){
                        img_top1.setVisibility(View.VISIBLE);
                        tx_top1.setVisibility(View.VISIBLE);
                        tx_top1.setText(answerRight_stuslistTop.get(0).name);
                    }
                    if(quickNum >= 2){
                        img_top2.setVisibility(View.VISIBLE);
                        tx_top2.setVisibility(View.VISIBLE);
                        tx_top2.setText(answerRight_stuslistTop.get(1).name);
                    }
                    if(quickNum >= 3){
                        img_top3.setVisibility(View.VISIBLE);
                        tx_top3.setVisibility(View.VISIBLE);
                        tx_top3.setText(answerRight_stuslistTop.get(2).name);
                    }
                }else{
                    linear_quick.setVisibility(View.GONE);
                }
            }else{
                linear_quick.setVisibility(View.GONE);
            }
            //计算正确率
            int classAllNum = AnswerActivityTea.alist.size(); //总人数（作答）
//            if(index == -1){ //计算汇总人数
//                classAllNum = getJoinClassAllStuNum();
//            }else{ //获取要分析的班级人数
//                classAllNum = AnswerActivity.classList.get(index).stuNum;
//            }
            System.out.println("作答总人数: " + classAllNum);
            linear_right.setVisibility(View.VISIBLE);
            int right_per = (int)(answer_rightNum * 1.0 / classAllNum * 100);
            System.out.println("作答总人数: " + classAllNum + " , 答对人数: " + answer_rightNum + " , 正确率: " + right_per + "%");
            tx_right2.setText(right_per + "%");
            linear_answer.setVisibility(View.VISIBLE);
            tx_answer2.setText(answer);
        }else{ //未设置答案
//            if(flag != 1){ //答题详情页面
            linear_quick.setVisibility(View.GONE);
            linear_answer.setVisibility(View.GONE);
            linear_right.setVisibility(View.INVISIBLE);
//            }
        }
    }

    //获取加入课堂的总人数
    private int getJoinClassAllStuNum(){
        int count = 0 ;
        for(int i = 0 ; i < AnswerActivityTea.classList.size() ; i++){
            count += AnswerActivityTea.classList.get(i).stuNum;
        }
        System.out.println("加入课堂的学生总人数:   " + count);
        return count;
    }

    //加载加入课堂的成员（ming、gege、其它移动端）
    private void initJoinClassInformation(){
        //直接从AnswerActivity.ketangList   AnswerActivity.joinList获取就好（肖赋值）
        if(AnswerActivityTea.classList != null){
            AnswerActivityTea.classList.clear();
        }
        if(AnswerActivityTea.classList == null){
            AnswerActivityTea.classList = new ArrayList<>();
        }
        if(AnswerActivityTea.ketangList != null && AnswerActivityTea.ketangList.size() > 0){
            for(int i = 0 ; i < AnswerActivityTea.ketangList.size() ; i++){
                KeTangBean classItem = new KeTangBean(
                        AnswerActivityTea.ketangList.get(i).getUserId() ,
                        AnswerActivityTea.ketangList.get(i).getName() ,
                        AnswerActivityTea.ketangList.get(i).getNum());
                AnswerActivityTea.classList.add(classItem);
            }
        }
        if(AnswerActivityTea.joinList != null && AnswerActivityTea.joinList.size() > 0){
            KeTangBean class_yidong = new KeTangBean("zb" , "其他移动端" , AnswerActivityTea.joinList.size());
            AnswerActivityTea.classList.add(class_yidong);
        }
//        KeTangBean class_ming = new KeTangBean("4193" , "我校2022级明铭班" , 60);
//        KeTangBean class_ge = new KeTangBean("4195ketang" , "我校2022级葛舸班" , 60);
//        KeTangBean class_yidong = new KeTangBean("zb" , "其他移动端" , 20);
//        AnswerActivity.classList.add(class_ming);
//        AnswerActivity.classList.add(class_ge);
//        AnswerActivity.classList.add(class_yidong);
    }

    //清空学生作答情况
    private void initHttpData_memberAnswer(){
        AnswerActivityTea.ylist = null;
        AnswerActivityTea.xlist = null;
        AnswerActivityTea.alist = null;
        AnswerActivityTea.submitAnswerStatus = false;
        AnswerActivityTea.answer = "";
        AnswerActivityTea.answerStu = "";
    }


    //将http返回的学生作答情况的数据进行处理，并放入共享变量中（客观题）
    private void updateHttpData_memberAnswer(JSONObject jsonObject) throws JSONException {
        //柱状图-纵坐标（每个答案选择的学生个数）
        JSONArray array_ylist = jsonObject.getJSONArray("ylist");
        if(AnswerActivityTea.ylist != null){
            AnswerActivityTea.ylist.clear();
        }
        if(AnswerActivityTea.ylist == null){
            AnswerActivityTea.ylist = new ArrayList<>();
        }
        for(int i = 0 ; i < array_ylist.length() ; i++){
            AnswerActivityTea.ylist.add((Integer) array_ylist.get(i));
        }

        System.out.println("ylist==>" + AnswerActivityTea.ylist);
        //柱状图-横坐标（答案）
        JSONArray array_xlist = jsonObject.getJSONArray("xlist");
        if(AnswerActivityTea.xlist != null){
            AnswerActivityTea.xlist.clear();
        }
        if(AnswerActivityTea.xlist == null){
            AnswerActivityTea.xlist = new ArrayList<>();
        }
        for(int i = 0 ; i < array_xlist.length() ; i++){
            AnswerActivityTea.xlist.add((String) array_xlist.get(i));
        }
        System.out.println("xlist==>" + AnswerActivityTea.xlist);
        //作答的学生信息
        JSONArray array_alist = jsonObject.getJSONArray("alist");
        if(AnswerActivityTea.alist != null){
            AnswerActivityTea.alist.clear();
        }
        if(AnswerActivityTea.alist == null){
            AnswerActivityTea.alist = new ArrayList<>();
        }
        for(int i = 0 ; i < array_alist.length() ; i++){
            StuAnswerBean item = new StuAnswerBean();
            item.questionId = array_alist.getJSONObject(i).getString("questionId");
            item.name = array_alist.getJSONObject(i).getString("name");
            item.userId = array_alist.getJSONObject(i).getString("userId");
            item.stuAnswer = array_alist.getJSONObject(i).getString("stuAnswer");
            item.stuAnswerTime = array_alist.getJSONObject(i).getLong("stuAnswerTime");
            item.startAnswerTime = array_alist.getJSONObject(i).getLong("startAnswerTime");
            AnswerActivityTea.alist.add(item);
            System.out.println("item==>" + item.toString());
        }
        System.out.println("alist共多少学生回答问题==>" + AnswerActivityTea.alist.size());
        //是否有人作答
        boolean status = jsonObject.getBoolean("status");
        AnswerActivityTea.submitAnswerStatus = status;
        System.out.println("是否有人提交答案==>" + AnswerActivityTea.submitAnswerStatus);
        //正确答案
        String answer = jsonObject.getString("answer");
        AnswerActivityTea.answer = answer;
        System.out.println("正确答案是==>" + AnswerActivityTea.answer);
        //所有学生答案
        String answerStu = jsonObject.getString("answerStu");
        AnswerActivityTea.answerStu = answerStu;
        System.out.println("所有学生答案==>" + AnswerActivityTea.answerStu);
    }

    //获取加入课堂的班级或移动端的学生作答情况  aflag:单题分析-1，答题详情-2 index:汇总数据（-1）、班级以及其他移动端index  v:客观题弹框popupwindow
    private void getJoinClassMemberSubmitAnswerInf(String ketangId , int stuNum , int index , int aflag , View v){
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("获取加入课堂的班级或移动端的学生作答情况！！！！！！！！！！！！！！！！！！！！！！！！");
                initHttpData_memberAnswer();
//                int count = AnswerActivity.alist != null && AnswerActivity.alist.size() > 0 ? AnswerActivity.alist.size() : 0;
                System.out.println("学生作答情况111:  " + AnswerActivityTea.xlist);
                JSONObject jsonObject = Http_HuDongActivityTea.getSubmitAnswerClass_keguan(ketangId , stuNum);
                String status = "";
                if(jsonObject != null){
                    try {
                        updateHttpData_memberAnswer(jsonObject);
                        status = jsonObject.getString("status");
                        System.out.println("学生作答情况222:  " + status);
                    } catch (JSONException ex) {
                        ex.printStackTrace();
                    }
                }
                if(jsonObject != null && status != null && status.length() > 0){
//                    count = AnswerActivity.alist != null && AnswerActivity.alist.size() > 0 ? AnswerActivity.alist.size() : 0;
                    System.out.println("学生作答情况333:  " + AnswerActivityTea.xlist);
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            //更新答题率
                            if(ketangId.equals("all")){
                                int all_count = getJoinClassAllStuNum();
                                int answer_count = 0;
                                for(int i = 0 ; i < AnswerActivityTea.ylist.size() ; i++){
                                    answer_count += AnswerActivityTea.ylist.get(i);
                                }
                                tx_dati2.setText((int)(answer_count * 1.0 / all_count * 100) + "%");
                                System.out.println("总人数:  " + all_count + " ,  作答人数:  " + answer_count + " ,  答题率:  " + (int)(answer_count * 1.0 / all_count * 100));
                            }else{
                                int all_count = AnswerActivityTea.classList.get(index).stuNum;
                                int answer_count = 0;
                                for(int i = 0 ; i < AnswerActivityTea.ylist.size() ; i++){
                                    answer_count += AnswerActivityTea.ylist.get(i);
                                }
                                tx_dati2.setText((int)(answer_count * 1.0 / all_count * 100) + "%");
                                System.out.println("总人数:  " + all_count + " ,  作答人数:  " + answer_count + " ,  答题率:  " + (int)(answer_count * 1.0 / all_count * 100));
                            }
                            if(aflag == 1){ //单题分析
                                //先将显示柱状图的组件不显示，然后再次显示
                                barChart.setVisibility(View.INVISIBLE); //不加入该语句：柱状图还是显示上一个班级的作答情况
                                barChart.setVisibility(View.VISIBLE);

                                tx_noanswer.setVisibility(View.GONE);

                                isShowMoreInformation(aflag , index);

                                setAxis(AnswerActivityTea.xlist); // 设置坐标轴
                                setLegend(); // 设置图例
                                setData(AnswerActivityTea.xlist, AnswerActivityTea.ylist);  // 设置数据
                            }else{ //答题详情
                                tx_noanswer.setVisibility(View.GONE);
                                isShowMoreInformation(aflag , index);
                                showStusAnswers(v); //显示“答案详情”
                            }
                        }
                    });
                }else{
//                    Toast.makeText(getActivity(), "没有人提交答案" + answer, Toast.LENGTH_SHORT).show();
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            slStusAnswers.setVisibility(View.GONE);
                            barChart.setVisibility(View.GONE);
                            tx_noanswer.setVisibility(View.VISIBLE);
                            tx_dati2.setText("0%");
                            linear_quick.setVisibility(View.GONE);
                            if(answer != null && answer.length() > 0){
                                linear_answer.setVisibility(View.VISIBLE);
                                tx_answer2.setText(answer);
                            }else{
                                linear_answer.setVisibility(View.INVISIBLE);
                            }
                            linear_right.setVisibility(View.INVISIBLE);
                        }
                    });
                }
            }
        }).start();
    }

    //显示弹框(客观题：单选、多选、判断)
    private void showPopupWindow(View v , int flag){
        initJoinClassInformation(); //加载加入课堂的成员
        //将popupWindow将要展示的弹窗内容view放入popupWindow中
        if(screenWidth <= 0){
            getScreenProps();
        }
//        PopupWindow popupWindow = new PopupWindow(v , (int)(screenWidth * 0.75) , (int)(screenHeight * 0.8) , false);
        PopupWindow popupWindow = new PopupWindow(v , WindowManager.LayoutParams.MATCH_PARENT , WindowManager.LayoutParams.MATCH_PARENT , false);

        //弹框展示在屏幕中间Gravity.CENTER,x和y是相对于Gravity.CENTER的偏移
        popupWindow.showAtLocation(v , Gravity.CENTER , 0 , 0);

        //弹框左侧显示“汇总数据”
        tx_huizong = v.findViewById(R.id.tx_huizong);
        ListView lvClass = v.findViewById(R.id.lvClass);
        lvClass.setDivider(null); //不显示边框

        //单题分析 答题详情右侧页面顶部详细信息（最快答对、正确率等）
        tx_quick = v.findViewById(R.id.tx_quick);
        img_top1 = v.findViewById(R.id.img_top1);
        tx_top1 = v.findViewById(R.id.tx_top1);
        img_top2 = v.findViewById(R.id.img_top2);
        tx_top2 = v.findViewById(R.id.tx_top2);
        img_top3 = v.findViewById(R.id.img_top3);
        tx_top3 = v.findViewById(R.id.tx_top3);

        tx_answer1 = v.findViewById(R.id.tx_answer1);
        tx_answer2 = v.findViewById(R.id.tx_answer2);
        tx_right1 = v.findViewById(R.id.tx_right1);
        tx_right2 = v.findViewById(R.id.tx_right2);
        tx_dati1 = v.findViewById(R.id.tx_dati1);
        tx_dati2 = v.findViewById(R.id.tx_dati2);

        linear_right = v.findViewById(R.id.linear_right);
        linear_answer = v.findViewById(R.id.linear_answer);
        linear_quick = v.findViewById(R.id.linear_quick);

        //单题分析 答题详情
        View view1 , view2;   //单题分析 答题详情字体上方的横条
        TextView txt_danti , txt_daan;
        txt_danti = v.findViewById(R.id.txdanti);
        txt_daan = v.findViewById(R.id.txdaan);
        view1 = v.findViewById(R.id.view1);
        view2 = v.findViewById(R.id.view2);



        //单题分析-柱状图，答题详情-学生答案
        tx_noanswer = v.findViewById(R.id.tx_noanswer);
        barChart = v.findViewById(R.id.bar_chart);
        barChart.setTouchEnabled(true); // 设置是否可以触摸
        barChart.setDragEnabled(true);// 是否可以拖拽
        barChart.setScaleEnabled(true);// 是否可以缩放

        slStusAnswers = v.findViewById(R.id.slStusAnswers);

        //要显示的数据(左侧班级信息)
        List<String> listitem = new ArrayList<>();
        for (int i = 0; i < AnswerActivityTea.classList.size() ; i++) {
            String temp = AnswerActivityTea.classList.get(i).keTangName;
            listitem.add(temp);
        }

        //创建⼀个Adapter
        myAdapter = new MyAdapter(listitem , this.getActivity() , selectedIndex , isSelect_huizong);
        lvClass.setAdapter(myAdapter);
        lvClass.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @SuppressLint("WrongConstant")
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
//                Object result = adapterView.getItemAtPosition(position);//获取选择项的值
                selectedIndex = position;
                Log.e("汇总数据是否选中1：  " ,  myAdapter.isSelect()+ "");
                myAdapter.setSelect(false);
                myAdapter.changeSelected(position);
                Log.e("汇总数据是否选中2：  " ,  myAdapter.isSelect()+ "");
                if(isSelect_huizong){
                    tx_huizong.setBackgroundColor(Color.parseColor("#FFFFFF"));
                    tx_huizong.setTextColor(Color.parseColor("#FF000000"));
                }
                isSelect_huizong = false;
                Log.e("当前选中的index是123：  " , position + "");

                int aflag = 0;
                if(view1.getVisibility() == 0){  //单题分析，显示柱状图
                    aflag = 1;
                    slStusAnswers.setVisibility(View.GONE);
                    tx_noanswer.setVisibility(View.GONE);
                    barChart.setVisibility(View.GONE);
                    barChart.setVisibility(View.VISIBLE);
                    barChart.getDescription().setEnabled(false); // 不显示描述
                    barChart.setExtraOffsets(20, 20, 20, 20); // 设置饼图的偏移量，类似于内边距 ，设置视图窗口大小
                }

                if(view2.getVisibility() == 0){ //答题详情，显示学生姓名
                    aflag = 2;
                    tx_noanswer.setVisibility(View.GONE);
                    barChart.setVisibility(View.GONE);
                    slStusAnswers.setVisibility(View.VISIBLE);
//                    isShowMoreInformation(2 , selectedIndex);
                    //showStusAnswers(v); //显示“答案详情”
                }

                initHttpData_memberAnswer();
                System.out.println("学生答案_class_1111:  " + AnswerActivityTea.answerStu);
                int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                getJoinClassMemberSubmitAnswerInf(classId , count , selectedIndex , aflag , v);
                System.out.println("学生答案_class_2222:  " + AnswerActivityTea.answerStu);
            }
        });

        tx_huizong.setOnClickListener(new View.OnClickListener() {
            @SuppressLint("WrongConstant")
            @Override
            public void onClick(View view) {
                isSelect_huizong = true;
                myAdapter.setmSelect(0);
                myAdapter.setSelect(true);
                tx_huizong.setBackgroundColor(Color.parseColor("#007947"));
                tx_huizong.setTextColor(Color.parseColor("#FFFFFF"));

                int aflag = 0;

                if(view1.getVisibility() == 0){  //单题分析，显示柱状图
                    aflag = 1;
                    slStusAnswers.setVisibility(View.GONE);
                    tx_noanswer.setVisibility(View.GONE);
                    barChart.setVisibility(View.GONE);
                    barChart.setVisibility(View.VISIBLE);
                    barChart.getDescription().setEnabled(false); // 不显示描述
                    barChart.setExtraOffsets(20, 20, 20, 20); // 设置饼图的偏移量，类似于内边距 ，设置视图窗口大小
//                    isShowMoreInformation(1 , -1);
                }


                if(view2.getVisibility() == 0){ //答题详情，显示学生姓名
                    aflag = 2;
                    barChart.setVisibility(View.GONE);
                    tx_noanswer.setVisibility(View.GONE);
                    slStusAnswers.setVisibility(View.VISIBLE);
//                    isShowMoreInformation(2 , -1);
//                    showStusAnswers(v); //显示“答案详情”
                }

                initHttpData_memberAnswer(); //清空学生的回答情况，之后再次请求
                System.out.println("学生答案汇总1111:  " + AnswerActivityTea.answerStu);
                int count = getJoinClassAllStuNum();
                //请求当前要分析的课堂的学生回答情况
                getJoinClassMemberSubmitAnswerInf("all" , count , -1 , aflag , v);
                System.out.println("学生答案汇总22222:  " + AnswerActivityTea.answerStu);
            }
        });

        //初始进入popupwindow
        if(flag == 1){  //"单题分析“
            slStusAnswers.setVisibility(View.GONE);
            tx_noanswer.setVisibility(View.GONE);
            barChart.setVisibility(View.VISIBLE);
            barChart.getDescription().setEnabled(false); // 不显示描述
            barChart.setExtraOffsets(20, 20, 20, 20); // 设置饼图的偏移量，类似于内边距 ，设置视图窗口大小

            view1.setVisibility(View.VISIBLE);
            view2.setVisibility(View.GONE);
            txt_danti.setTextColor(Color.parseColor("#007947"));
            txt_daan.setTextColor(Color.parseColor("#FF000000"));
        }else{ //"答题详情"
            barChart.setVisibility(View.GONE);
            tx_noanswer.setVisibility(View.GONE);
            slStusAnswers.setVisibility(View.VISIBLE);
            view1.setVisibility(View.GONE);
            view2.setVisibility(View.VISIBLE);
            txt_daan.setTextColor(Color.parseColor("#007947"));
            txt_danti.setTextColor(Color.parseColor("#FF000000"));

//            showStusAnswers(v); //显示“答案详情”
        }


        if(isSelect_huizong){
            //初始进入popupwindow，显示汇总数据
            System.out.println("学生答案11111:  " + AnswerActivityTea.answerStu);
            int count = getJoinClassAllStuNum();
            //请求当前要分析的课堂的学生回答情况
            getJoinClassMemberSubmitAnswerInf("all" , count , -1 , flag , v);
            System.out.println("学生答案22222:  " + AnswerActivityTea.answerStu);
        }else{
            initHttpData_memberAnswer();
            System.out.println("学生答案_class_1111:  " + AnswerActivityTea.answerStu);
            int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
            String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
            getJoinClassMemberSubmitAnswerInf(classId , count , selectedIndex , flag , v);
            System.out.println("学生答案_class_2222:  " + AnswerActivityTea.answerStu);
        }



        txt_danti.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int selectedIndex = myAdapter.getmSelect();
                slStusAnswers.setVisibility(View.GONE);
                barChart.setVisibility(View.VISIBLE);
                barChart.getDescription().setEnabled(false); // 不显示描述
                barChart.setExtraOffsets(20, 20, 20, 20); // 设置饼图的偏移量，类似于内边距 ，设置视图窗口大小

                view1.setVisibility(View.VISIBLE);
                view2.setVisibility(View.GONE);
                txt_danti.setTextColor(Color.parseColor("#007947"));
                txt_daan.setTextColor(Color.parseColor("#FF000000"));

//                isShowMoreInformation(1 , selectedIndex);
                if(isSelect_huizong){
                    //初始进入popupwindow，显示汇总数据
                    System.out.println("单题分析11111:  " + AnswerActivityTea.answerStu);
                    int count = getJoinClassAllStuNum();
                    //请求当前要分析的课堂的学生回答情况
                    getJoinClassMemberSubmitAnswerInf("all" , count , -1 , 1 , v);
                    System.out.println("单题分析22222:  " + AnswerActivityTea.answerStu);
                }else{
                    initHttpData_memberAnswer();
                    System.out.println("单题分析_class_1111:  " + AnswerActivityTea.answerStu);
                    int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                    String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                    getJoinClassMemberSubmitAnswerInf(classId , count , selectedIndex , 1 , v);
                    System.out.println("单题分析_class_2222:  " + AnswerActivityTea.answerStu);
                }
            }
        });

        txt_daan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                int selectedIndex = myAdapter.getmSelect();
                barChart.setVisibility(View.GONE);
                slStusAnswers.setVisibility(View.VISIBLE);
                view1.setVisibility(View.GONE);
                view2.setVisibility(View.VISIBLE);
                txt_daan.setTextColor(Color.parseColor("#007947"));
                txt_danti.setTextColor(Color.parseColor("#FF000000"));

                if(isSelect_huizong){
                    //初始进入popupwindow，显示汇总数据
                    System.out.println("答题详情11111:  " + AnswerActivityTea.answerStu);
                    int count = getJoinClassAllStuNum();
                    //请求当前要分析的课堂的学生回答情况
                    getJoinClassMemberSubmitAnswerInf("all" , count , -1 , 2 , v);
                    System.out.println("答题详情22222:  " + AnswerActivityTea.answerStu);
                }else{
                    initHttpData_memberAnswer();
                    System.out.println("答题详情_class_1111:  " + AnswerActivityTea.answerStu);
                    int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                    String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                    getJoinClassMemberSubmitAnswerInf(classId , count , selectedIndex , 2 , v);
                    System.out.println("答题详情_class_2222:  " + AnswerActivityTea.answerStu);
                }
//                showStusAnswers(v); //显示“答案详情”
//                isShowMoreInformation(2 , selectedIndex);
            }
        });

        //设置答案按钮
        ImageView img_szda = v.findViewById(R.id.imgSet);
        //公布结果按钮
        ImageView img_gbjg = v.findViewById(R.id.imgPush);
        //刷新按钮
        ImageView img_flash = v.findViewById(R.id.imgFlash);
        //退出按钮
        ImageView imgexit = v.findViewById(R.id.imgExit);
        //共享屏幕
        ImageView img_share = v.findViewById(R.id.imgShare);

        img_szda.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
//                LinearLayout linear1 = v.findViewById(R.id.linear1);
//                LinearLayout linear2 = v.findViewById(R.id.linear2);
//                LinearLayout linear3 = v.findViewById(R.id.linear3);
//                View ve = v.findViewById(R.id.view);
//
//                linear1.getBackground().setAlpha(10);
//                linear2.getBackground().setAlpha(10);
//                linear3.getBackground().setAlpha(10);
//                ve.getBackground().setAlpha(10);


//                WindowManager.LayoutParams lp = getActivity().getWindow().getAttributes();
//                lp.alpha = 0.2f; // 0.0~1.0
//                getActivity().getWindow().setAttributes(lp); //getActivity() 是上下文context

                View v_self = LayoutInflater.from(getActivity()).inflate(R.layout.single_question_answers, null, false);
                if(isSelect_huizong){
                    setAnswers(v_self , v , popupWindow , flag , "all");
                }else{
                    setAnswers(v_self , v , popupWindow , flag , AnswerActivityTea.classList.get(selectedIndex).ketangId);
                }
            }
        });

        img_gbjg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                popupWindow.dismiss();
                //将popupwindow移动到左上角
                popupWindow.showAtLocation(v , Gravity.TOP | Gravity.LEFT , 0 , 0);
                //不显示公布结果、刷新按钮，设置答案以及退出按钮向右移动
                img_szda.setPadding(200 , 0 , 0 , 0);
                img_gbjg.setVisibility(View.GONE);
                img_flash.setVisibility(View.GONE);
            }
        });

        img_flash.setOnClickListener(new View.OnClickListener() {
            @SuppressLint("WrongConstant")
            @Override
            public void onClick(View view) {
                Log.e("点击了刷新按钮", view.getId() + "");
                System.out.println("点击了刷新按钮！！！！！！！！！！！！！！！");
                int position = myAdapter.getmSelect();
                int aflag = 0;
                if(view1.getVisibility() == 0){  //单题分析，显示柱状图
                    aflag = 1;
                    slStusAnswers.setVisibility(View.GONE);
                    barChart.setVisibility(View.GONE);
                    barChart.setVisibility(View.VISIBLE);
                    barChart.getDescription().setEnabled(false); // 不显示描述
                    barChart.setExtraOffsets(20, 20, 20, 20); // 设置饼图的偏移量，类似于内边距 ，设置视图窗口大小
                }

                if(view2.getVisibility() == 0){ //答题详情，显示学生姓名
                    aflag = 2;
                    barChart.setVisibility(View.GONE);
                    slStusAnswers.setVisibility(View.VISIBLE);
                }

                if(isSelect_huizong){
                    //初始进入popupwindow，显示汇总数据
                    System.out.println("单题分析11111:  " + AnswerActivityTea.answerStu);
                    int count = getJoinClassAllStuNum();
                    //请求当前要分析的课堂的学生回答情况
                    getJoinClassMemberSubmitAnswerInf("all" , count , -1 , aflag , v);
                    System.out.println("单题分析22222:  " + AnswerActivityTea.answerStu);
                }else{
                    initHttpData_memberAnswer();
                    System.out.println("单题分析_class_1111:  " + AnswerActivityTea.answerStu);
                    int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                    String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                    getJoinClassMemberSubmitAnswerInf(classId , count , selectedIndex , aflag , v);
                    System.out.println("单题分析_class_2222:  " + AnswerActivityTea.answerStu);
                }
            }
        });

        imgexit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //退出之前，需要先关闭共享屏幕！！！！！！
                if((img_share.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.share_end).getConstantState())){
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MainActivity_tea activity = (MainActivity_tea) getActivity();
                            activity.stopScreenCapture();
                        }
                    });
                }
                popupWindow.dismiss();
                selectedIndex = 0;
                answer = "";
                isSelect_huizong = true;
                //如果设置答案弹框未关闭，则主动关闭
                if(popupWindow_szda != null && popupWindow_szda.isShowing()){
                    popupWindow_szda.dismiss();
                }
            }
        });

        img_share.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                if((img_share.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.share).getConstantState())){
                    //开始共享屏幕
                    btEnd.performClick();
                    img_share.setImageDrawable(getResources().getDrawable((R.mipmap.share_end)));
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MainActivity_tea activity = (MainActivity_tea) getActivity();
                            activity.startScreenCapture();
                        }
                    });
                }else{
                    //结束共享屏幕
                    img_share.setImageDrawable(getResources().getDrawable((R.mipmap.share)));
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MainActivity_tea activity = (MainActivity_tea) getActivity();
                            activity.stopScreenCapture();
                        }
                    });
                }
            }
        });
    }

    // 设置坐标轴
    private void setAxis(List<String> labelName) {
        System.out.println("柱状图横坐标11111:   " + labelName);
        // 设置x轴
        XAxis xAxis = barChart.getXAxis();
        xAxis.setYOffset(10); // 设置标签对x轴的偏移量，垂直方向
        // 设置y轴，y轴有两条，分别为左和右
        if(txModle_duoxuan.isSelected()){
            //设置X轴文字顺时针旋转角度，逆时针取负值
            barChart.getXAxis().setLabelRotationAngle(-50);
            xAxis.setYOffset(5); // 设置标签对x轴的偏移量，垂直方向
        }
        xAxis.setPosition(XAxis.XAxisPosition.BOTTOM);  // 设置x轴显示在下方，默认在上方

        xAxis.setDrawGridLines(false); // 将此设置为true，绘制该轴的网格线。
        xAxis.setLabelCount(labelName.size());  // 设置x轴上的标签个数
        xAxis.setTextSize(15f); // x轴上标签的大小
        xAxis.setAxisLineColor(Color.parseColor("#426ab3"));
        // 设置x轴显示的值的格式
        xAxis.setValueFormatter(new IAxisValueFormatter() {
            @Override
            public String getFormattedValue(float value, AxisBase axis) {
                if ((int) value < labelName.size()) {
                    return labelName.get((int) value);
                } else {
                    return "";
                }
            }
        });

        int max = 0;
        for(int i = 0 ; i < AnswerActivityTea.ylist.size() ; i++){
            if(AnswerActivityTea.ylist.get(i) > max){
                max = AnswerActivityTea.ylist.get(i);
            }
        }
        max += 1;

        YAxis yAxis_right = barChart.getAxisRight();
        yAxis_right.setAxisMaximum(max);  // 设置y轴的最大值
        yAxis_right.setAxisMinimum(0f);  // 设置y轴的最小值
        yAxis_right.setEnabled(false);  // 不显示右边的y轴

        YAxis yAxis_left = barChart.getAxisLeft();
        yAxis_left.setAxisMaximum(max);
        yAxis_left.setAxisMinimum(0f);
        yAxis_left.setTextSize(15f); // 设置y轴的标签大小
        yAxis_left.setAxisLineColor(Color.parseColor("#426ab3"));
        yAxis_left.setGridColor(Color.parseColor("#426ab3"));
//        yAxis_left.setGridLineWidth(1f);
    }

    // 设置图例
    private void setLegend() {
        Legend legend = barChart.getLegend();
        legend.setEnabled(false);  //不显示图例
//        legend.setFormSize(12f); // 图例的图形大小
//        legend.setTextSize(15f); // 图例的文字大小
//        legend.setDrawInside(true); // 设置图例在图中
//        legend.setOrientation(Legend.LegendOrientation.VERTICAL); // 图例的方向为垂直
//        legend.setHorizontalAlignment(Legend.LegendHorizontalAlignment.RIGHT); //显示位置，水平右对齐
//        legend.setVerticalAlignment(Legend.LegendVerticalAlignment.TOP); // 显示位置，垂直上对齐
//        // 设置水平与垂直方向的偏移量
//        legend.setYOffset(55f);
//        legend.setXOffset(30f);
    }

    //设置数据
    private void setData(List<String> labelName , List<Integer> labelCount) {
        List<IBarDataSet> sets = new ArrayList<>();
        // 此处有两个DataSet，所以有两条柱子，BarEntry（）中的x和y分别表示显示的位置和高度
        // x是横坐标，表示位置，y是纵坐标，表示高度
        List<BarEntry> barEntries1 = new ArrayList<>();
        for(int i = 0 ; i < labelCount.size() ; i++){
            barEntries1.add(new BarEntry(i, labelCount.get(i)));
        }
//        barEntries1.add(new BarEntry(0, 2f));
//        barEntries1.add(new BarEntry(1, 39f));
//        barEntries1.add(new BarEntry(2, 5f));
//        barEntries1.add(new BarEntry(3, 8f));
//        barEntries1.add(new BarEntry(4, 3f));
        BarDataSet barDataSet1 = new BarDataSet(barEntries1, "");
        barDataSet1.setValueTextColor(Color.BLACK); // 值的颜色
        barDataSet1.setValueTextSize(15f); // 值的大小
//        barDataSet1.setColor(Color.parseColor("#1AE61A")); // 柱子的颜色
        List<Integer> colors = new ArrayList<>();
        for(int i = 0 ; i < labelName.size() ; i++){
            if(labelName.get(i).equals(answer)){
                colors.add(Color.parseColor("#FF6100"));
            }else if(labelName.get(i) == "未答"){
                colors.add(Color.parseColor("#828798"));
            }else{
                colors.add(Color.parseColor("#4e72b8"));
            }
        }
        barDataSet1.setColors(colors);
//        barDataSet1.setColors(Color.parseColor("#FF6100"),
//                Color.parseColor("#485060"),
//                Color.parseColor("#FFC800"),
//                Color.parseColor("#694E42"),
//                Color.parseColor("#485060"));
//        barDataSet1.setLabel("蔬菜"); // 设置标签之后，图例的内容默认会以设置的标签显示
        // 设置柱子上数据显示的格式
        barDataSet1.setValueFormatter(new IValueFormatter() {
            @Override
            public String getFormattedValue(float value, Entry entry, int dataSetIndex, ViewPortHandler viewPortHandler) {
                // 此处的value默认保存一位小数
                return (int)value + "人";
            }
        });
        sets.add(barDataSet1);

        BarData barData = new BarData(sets);
        barData.setBarWidth(0.6f); // 设置柱子的宽度
        barChart.setData(barData);
    }

    //设置答案popupwindow（提问）
    public void setAnswers(View v , View v_parent , PopupWindow p_parent , int flag , String ketangId){
        //将popupWindow将要展示的弹窗内容view放入popupWindow中
//        PopupWindow popupWindow_szda = new PopupWindow(v ,
//                450,
//                300,
//                false);
        if(screenWidth <= 0){
            getScreenProps();
        }
        popupWindow_szda = new PopupWindow(v , (int)(screenWidth * 0.45) , (int)(screenHeight * 0.4) , false);

        //弹框展示在屏幕中间Gravity.CENTER,x和y是相对于Gravity.CENTER的偏移
        popupWindow_szda.showAtLocation(v , Gravity.CENTER , 0 , 0);

        //关闭popupwindow
        ImageView closeImg = v.findViewById(R.id.imgClose);
        closeImg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                answer = "";
                popupWindow_szda.dismiss();
            }
        });

        //单选UI
        linear_danxuan = v.findViewById(R.id.linearImg1);
        a = v.findViewById(R.id.a);
        b = v.findViewById(R.id.b);
        c = v.findViewById(R.id.c);
        d = v.findViewById(R.id.d);
        e = v.findViewById(R.id.e);
        f = v.findViewById(R.id.f);
        g = v.findViewById(R.id.g);
        h = v.findViewById(R.id.h);
        //多选UI
        linear_duoxuan = v.findViewById(R.id.linearImg2);
        a1 = v.findViewById(R.id.a1);
        b1 = v.findViewById(R.id.b1);
        c1 = v.findViewById(R.id.c1);
        d1 = v.findViewById(R.id.d1);
        e1 = v.findViewById(R.id.e1);
        f1 = v.findViewById(R.id.f1);
        g1 = v.findViewById(R.id.g1);
        h1 = v.findViewById(R.id.h1);
        //判断UI
        linear_panduan = v.findViewById(R.id.linearImg3);
        right = v.findViewById(R.id.right);
        error = v.findViewById(R.id.error);


        int count = chooseNum; //选项个数

        //单选(图标）
        if(txModle_danxuan.isSelected()){
            linear_danxuan.setVisibility(View.VISIBLE);
            linear_duoxuan.setVisibility(View.GONE);
            linear_panduan.setVisibility(View.GONE);

            if(count == 2){
                c.setVisibility(View.GONE);
                d.setVisibility(View.GONE);
                e.setVisibility(View.GONE);
                f.setVisibility(View.GONE);
                g.setVisibility(View.GONE);
                h.setVisibility(View.GONE);
            }else if(count == 3){
                d.setVisibility(View.GONE);
                e.setVisibility(View.GONE);
                f.setVisibility(View.GONE);
                g.setVisibility(View.GONE);
                h.setVisibility(View.GONE);
            }else if(count == 4){
                e.setVisibility(View.GONE);
                f.setVisibility(View.GONE);
                g.setVisibility(View.GONE);
                h.setVisibility(View.GONE);
            }else if(count == 5){
                f.setVisibility(View.GONE);
                g.setVisibility(View.GONE);
                h.setVisibility(View.GONE);
            }else if(count == 6){
                g.setVisibility(View.GONE);
                h.setVisibility(View.GONE);
            }else if(count == 7){
                h.setVisibility(View.GONE);
            }else if(count == 8){

            }
        }
        //多选(图标）
        if(txModle_duoxuan.isSelected()){
            linear_danxuan.setVisibility(View.GONE);
            linear_panduan.setVisibility(View.GONE);
            linear_duoxuan.setVisibility(View.VISIBLE);
            if(count == 2){
                c1.setVisibility(View.GONE);
                d1.setVisibility(View.GONE);
                e1.setVisibility(View.GONE);
                f1.setVisibility(View.GONE);
                g1.setVisibility(View.GONE);
                h1.setVisibility(View.GONE);
            }else if(count == 3){
                d1.setVisibility(View.GONE);
                e1.setVisibility(View.GONE);
                f1.setVisibility(View.GONE);
                g1.setVisibility(View.GONE);
                h1.setVisibility(View.GONE);
            }else if(count == 4){
                e1.setVisibility(View.GONE);
                f1.setVisibility(View.GONE);
                g1.setVisibility(View.GONE);
                h1.setVisibility(View.GONE);
            }else if(count == 5){
                f1.setVisibility(View.GONE);
                g1.setVisibility(View.GONE);
                h1.setVisibility(View.GONE);
            }else if(count == 6){
                g1.setVisibility(View.GONE);
                h1.setVisibility(View.GONE);
            }else if(count == 7){
                h1.setVisibility(View.GONE);
            }else if(count == 8){

            }
        }
        //判断(图标）
        if(txModle_panduan.isSelected()){
            linear_danxuan.setVisibility(View.GONE);
            linear_duoxuan.setVisibility(View.GONE);
            linear_panduan.setVisibility(View.VISIBLE);
        }

        //点击事件（单选）
        a.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                a.setSelected(true);
                a.setImageDrawable(getResources().getDrawable((R.mipmap.a_select)));
            }
        });
        b.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                b.setSelected(true);
                b.setImageDrawable(getResources().getDrawable((R.mipmap.b_select)));
            }
        });
        c.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                c.setSelected(true);
                c.setImageDrawable(getResources().getDrawable((R.mipmap.c_select)));
            }
        });
        d.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                d.setSelected(true);
                d.setImageDrawable(getResources().getDrawable((R.mipmap.d_select)));
            }
        });
        e.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                e.setSelected(true);
                e.setImageDrawable(getResources().getDrawable((R.mipmap.e_select)));
            }
        });
        f.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                f.setSelected(true);
                f.setImageDrawable(getResources().getDrawable((R.mipmap.f_select)));
            }
        });
        g.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                g.setSelected(true);
                g.setImageDrawable(getResources().getDrawable((R.mipmap.g_select)));
            }
        });
        h.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus();
                h.setSelected(true);
                h.setImageDrawable(getResources().getDrawable((R.mipmap.h_select)));
            }
        });
        //点击事件（多选）
        a1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //判断当前imageView是否为某一图片（可用来判断imageview是否被选中）
                if((a1.getDrawable().getCurrent().getConstantState()).equals(
                        ContextCompat.getDrawable(getActivity(), R.mipmap.ad_select).getConstantState())
                ) {
                    a1.setSelected(false);
                    a1.setImageDrawable(getResources().getDrawable((R.mipmap.da)));
                }else {
                    a1.setSelected(true);
                    a1.setImageDrawable(getResources().getDrawable((R.mipmap.ad_select)));
                }

            }
        });
        b1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((b1.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.bd_select).getConstantState())){
                    b1.setSelected(false);
                    b1.setImageDrawable(getResources().getDrawable((R.mipmap.db)));
                }else{
                    b1.setSelected(true);
                    b1.setImageDrawable(getResources().getDrawable((R.mipmap.bd_select)));
                }
            }
        });
        c1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((c1.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.cd_select).getConstantState())){
                    c1.setSelected(false);
                    c1.setImageDrawable(getResources().getDrawable((R.mipmap.dc)));
                }else{
                    c1.setSelected(true);
                    c1.setImageDrawable(getResources().getDrawable((R.mipmap.cd_select)));
                }
            }
        });
        d1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((d1.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.dd_select).getConstantState())){
                    d1.setSelected(false);
                    d1.setImageDrawable(getResources().getDrawable((R.mipmap.dd)));
                }else{
                    d1.setSelected(true);
                    d1.setImageDrawable(getResources().getDrawable((R.mipmap.dd_select)));
                }
            }
        });
        e1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((e1.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.ed_select).getConstantState())){
                    e1.setSelected(false);
                    e1.setImageDrawable(getResources().getDrawable((R.mipmap.ed)));
                }else{
                    e1.setSelected(true);
                    e1.setImageDrawable(getResources().getDrawable((R.mipmap.ed_select)));
                }
            }
        });
        f1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((f1.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.fd_select).getConstantState())){
                    f1.setSelected(false);
                    f1.setImageDrawable(getResources().getDrawable((R.mipmap.fd)));
                }else{
                    f1.setSelected(true);
                    f1.setImageDrawable(getResources().getDrawable((R.mipmap.fd_select)));
                }
            }
        });
        g1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((g1.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.gd_select).getConstantState())){
                    g1.setSelected(false);
                    g1.setImageDrawable(getResources().getDrawable((R.mipmap.gd)));
                }else{
                    g1.setSelected(true);
                    g1.setImageDrawable(getResources().getDrawable((R.mipmap.gd_select)));
                }
            }
        });
        h1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((h1.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.hd_select).getConstantState())){
                    h1.setSelected(false);
                    h1.setImageDrawable(getResources().getDrawable((R.mipmap.hd)));
                }else{
                    h1.setSelected(true);
                    h1.setImageDrawable(getResources().getDrawable((R.mipmap.hd_select)));
                }
            }
        });
        //点击事件（判断）
        right.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                right.setSelected(true);
                error.setSelected(false);
                right.setImageDrawable(getResources().getDrawable((R.mipmap.right_select)));
                error.setImageDrawable(getResources().getDrawable((R.mipmap.error)));
            }
        });
        error.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                right.setSelected(false);
                error.setSelected(true);
                right.setImageDrawable(getResources().getDrawable((R.mipmap.right)));
                error.setImageDrawable(getResources().getDrawable((R.mipmap.error_select)));
            }
        });

        Button bt_save = v.findViewById(R.id.btSave);
        bt_save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if (txModle_danxuan.isSelected()) {
                    answer = "";
                    if (a.isSelected()) {
                        answer = "A";
                    } else if (b.isSelected()) {
                        answer = "B";
                    } else if (c.isSelected()) {
                        answer = "C";
                    } else if (d.isSelected()) {
                        answer = "D";
                    } else if (e.isSelected()) {
                        answer = "E";
                    } else if (f.isSelected()) {
                        answer = "F";
                    } else if (g.isSelected()) {
                        answer = "G";
                    } else if (h.isSelected()) {
                        answer = "H";
                    } else {
                        answer = "";
                    }
//                    Toast.makeText(getActivity(), "单选答案是：" + answer, Toast.LENGTH_SHORT).show();
                } else if (txModle_duoxuan.isSelected()) {
                    answer = "";
                    if (a1.isSelected()) {
                        answer = answer + "A";
                    }
                    if (b1.isSelected()) {
                        answer = answer + "B";
                    }
                    if (c1.isSelected()) {
                        answer = answer + "C";
                    }
                    if (d1.isSelected()) {
                        answer = answer + "D";
                    }
                    if (e1.isSelected()) {
                        answer = answer + "E";
                    }
                    if (f1.isSelected()) {
                        answer = answer + "F";
                    }
                    if (g1.isSelected()) {
                        answer = answer + "G";
                    }
                    if (h1.isSelected()) {
                        answer = answer + "H";
                    }
//                    Toast.makeText(getActivity(), "多选答案是：" + answer, Toast.LENGTH_SHORT).show();
                } else if (txModle_panduan.isSelected()) {
                    answer = "";
                    if (right.isSelected()) {
                        answer = "对";
                    } else if (error.isSelected()) {
                        answer = "错";
                    } else {
                        answer = "";
                    }
//                    Toast.makeText(getActivity(), "判断答案是：" + answer, Toast.LENGTH_SHORT).show();
                }

                if(answer.length() > 0){
                    if((txModle_duoxuan.isSelected() && answer.length() >= 2)
                            || txModle_panduan.isSelected()
                            || txModle_danxuan.isSelected()
                    ){
                        setAnswer_keguan(ketangId);
                        //当前线程暂停wait 500ms
                        synchronized (Thread.currentThread()){
                            try {
                                Thread.currentThread().wait(500);
                            } catch (InterruptedException ex) {
                                ex.printStackTrace();
                            }
                        }
                        System.out.println("设置完答案了！！！！！！！");
                        if(setAnswer_status){
                            Toast.makeText(getActivity(),"答案设置成功",Toast.LENGTH_SHORT).show();
                            popupWindow_szda.dismiss(); //关掉“设置答案”页面的popupwindow
                            p_parent.dismiss(); //关掉“单题分析”页面的popupwindow
                            //再次打开“单题分析”页面的popupwindow
                            showPopupWindow(v_parent, flag);
                        }else{
                            answer = "";
                            Toast.makeText(getActivity(),"答案设置失败",Toast.LENGTH_SHORT).show();
                        }
//                        Toast.makeText(getActivity(),"答案是" + answer ,Toast.LENGTH_SHORT).show();
                    }else{
                        Toast.makeText(getActivity(),"请设置答案",Toast.LENGTH_SHORT).show();
                    }
                }else{
                    Toast.makeText(getActivity(),"请设置答案",Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    //设置客观题答案（提问）
    private void setAnswer_keguan(String ketangId){
        new Thread(new Runnable() {
            @Override
            public void run() {
                setAnswer_status = Http_HuDongActivityTea.setAnswer(ketangId , answer);
            }
        }).start();
    }

    //单选图标状态
    public void setDanxuanImgStatus(){
        a.setImageDrawable(getResources().getDrawable((R.mipmap.aa)));
        b.setImageDrawable(getResources().getDrawable((R.mipmap.ab)));
        c.setImageDrawable(getResources().getDrawable((R.mipmap.ac)));
        d.setImageDrawable(getResources().getDrawable((R.mipmap.ad)));
        e.setImageDrawable(getResources().getDrawable((R.mipmap.ae)));
        f.setImageDrawable(getResources().getDrawable((R.mipmap.af)));
        g.setImageDrawable(getResources().getDrawable((R.mipmap.ag)));
        h.setImageDrawable(getResources().getDrawable((R.mipmap.h)));
        a.setSelected(false);
        b.setSelected(false);
        c.setSelected(false);
        d.setSelected(false);
        e.setSelected(false);
        f.setSelected(false);
        g.setSelected(false);
        h.setSelected(false);
    }


    //清空学生作答情况-主观题
    private void initHttpData_memberAnswer_zhuguan(){
        AnswerActivityTea.submitAnswerStatus_zhuguan = false;
        AnswerActivityTea.alist_zhuguan = null;
    }

    //将http返回的学生作答情况的数据进行处理，并放入共享变量中(主观题）（接口5）
    private void updateHttpData_memberAnswer_zhuguan(JSONObject jsonObject) throws JSONException{
        AnswerActivityTea.submitAnswerStatus_zhuguan = jsonObject.getBoolean("status");
        //作答的学生信息
        JSONArray array_list = jsonObject.getJSONArray("list");
        if(AnswerActivityTea.alist_zhuguan != null){
            AnswerActivityTea.alist_zhuguan.clear();
        }
        if(AnswerActivityTea.alist_zhuguan == null){
            AnswerActivityTea.alist_zhuguan = new ArrayList<>();
        }
        for(int i = 0 ; i < array_list.length() ; i++){
            StuAnswerBean item = new StuAnswerBean();
            item.questionId = array_list.getJSONObject(i).getString("questionId");
            item.name = array_list.getJSONObject(i).getString("name");
            item.userId = array_list.getJSONObject(i).getString("userId");
            item.stuAnswer = array_list.getJSONObject(i).getString("stuAnswer");
            item.stuAnswerTime = array_list.getJSONObject(i).getLong("stuAnswerTime");
            item.startAnswerTime = array_list.getJSONObject(i).getLong("startAnswerTime");
            AnswerActivityTea.alist_zhuguan.add(item);
            System.out.println("item==>" + item.toString());
        }
        System.out.println("list共多少学生回答问题==>" + AnswerActivityTea.alist_zhuguan.size());

        setStuAnswers_zhuguan();
    }

    //将接口返回的主观题答案转化为List<String> stusNameList 、 List<String> stusAnswerList
    private void setStuAnswers_zhuguan(){
        System.out.println("主观题的学生答案！！！！！！！！！！！");
        if(stusNameList != null){
            stusNameList.clear();
        }else{
            stusNameList = new ArrayList<>();
        }

        if(stusAnswerList != null){
            stusAnswerList.clear();
        }else{
            stusAnswerList = new ArrayList<>();
        }

        for(int i = 0 ; i < AnswerActivityTea.alist_zhuguan.size() ; i++){
            stusNameList.add(AnswerActivityTea.alist_zhuguan.get(i).name);
            stusAnswerList.add(AnswerActivityTea.alist_zhuguan.get(i).stuAnswer);
            System.out.println("学生姓名: " + stusNameList.get(i) + "  ,  学生答案: " + stusAnswerList.get(i));
        }
    }

    //请求当前要分析的课堂的学生回答情况(主观题答案内容) aflag:答案内容-1，答题详情-2 index:汇总数据（-1）、班级以及其他移动端index  v:主观题弹框popupwindow
    private void getJoinClassMemberSubmitAnswerInf_zhuguan(String ketangId , int index , int aflag , View v){
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("主观题: 获取加入课堂的班级或移动端的学生作答情况！！！！！！！！！！！！！！！！！！！！！！！！");
                initHttpData_memberAnswer_zhuguan();
                System.out.println("主观题学生作答情况111:  " + AnswerActivityTea.alist_zhuguan);
                JSONObject jsonObject = Http_HuDongActivityTea.getSubmitAnswerClass_zhuguan(ketangId);
                String status = "";
                if(jsonObject != null){
                    try {
                        updateHttpData_memberAnswer_zhuguan(jsonObject);
                        status = jsonObject.getString("status");
                        System.out.println("主观题学生作答情况222:  " + status);
                    } catch (JSONException ex) {
                        ex.printStackTrace();
                    }
                }
                if(jsonObject != null && status != null && status.length() > 0){
                    System.out.println("主观题学生作答情况333:  " + AnswerActivityTea.alist_zhuguan);
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            //更新答题率
                            if(ketangId.equals("all")){
                                int all_count = getJoinClassAllStuNum();
                                int answer_count = AnswerActivityTea.alist_zhuguan.size();
                                tx_dati2.setText((int)(answer_count * 1.0 / all_count * 100) + "%");
                                System.out.println("总人数:  " + all_count + " ,  作答人数:  " + answer_count + " ,  答题率:  " + (int)(answer_count * 1.0 / all_count * 100));
                            }else{
                                int all_count = AnswerActivityTea.classList.get(index).stuNum;
                                int answer_count = AnswerActivityTea.alist_zhuguan.size();
                                tx_dati2.setText((int)(answer_count * 1.0 / all_count * 100) + "%");
                                System.out.println("总人数:  " + all_count + " ,  作答人数:  " + answer_count + " ,  答题率:  " + (int)(answer_count * 1.0 / all_count * 100));
                            }
                            tx_noanswer_zhuguan.setVisibility(View.GONE);
                            if(aflag == 1){ //答案内容
                                showStudentsAnswer_img(v);
                            }else{ //答题详情
                                showStudentsAnswer(v);
                            }
                        }
                    });
                }else{
//                    Toast.makeText(getActivity(), "没有人提交答案" + answer, Toast.LENGTH_SHORT).show();
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            slStusAnswers_zhuguan.setVisibility(View.GONE);
                            slStusAnswersImg.setVisibility(View.GONE);
                            tx_noanswer_zhuguan.setVisibility(View.VISIBLE);
                            tx_dati2.setText("0%");
                        }
                    });
                }
            }
        }).start();
    }

    //将http返回的学生作答情况的数据进行处理，并放入共享变量中（主观题-答案内容）
    private void updateHttpData_memberAnswer_content(JSONObject jsonObject) throws JSONException {
        //是否有人作答
        boolean status = jsonObject.getBoolean("status");
        AnswerActivityTea.submitAnswerStatus = status;
        System.out.println("是否有人提交答案==>" + AnswerActivityTea.submitAnswerStatus);

        //作答的学生信息
        JSONArray array_alist = jsonObject.getJSONArray("alist");
        if(AnswerActivityTea.alist != null){
            AnswerActivityTea.alist.clear();
        }
        if(AnswerActivityTea.alist == null){
            AnswerActivityTea.alist = new ArrayList<>();
        }
        for(int i = 0 ; i < array_alist.length() ; i++){
            StuAnswerBean item = new StuAnswerBean();
            item.questionId = array_alist.getJSONObject(i).getString("questionId");
            item.name = array_alist.getJSONObject(i).getString("name");
            item.userId = array_alist.getJSONObject(i).getString("userId");
            item.stuAnswer = array_alist.getJSONObject(i).getString("stuAnswer");
            item.stuAnswerTime = array_alist.getJSONObject(i).getLong("stuAnswerTime");
            item.startAnswerTime = array_alist.getJSONObject(i).getLong("startAnswerTime");
            AnswerActivityTea.alist.add(item);
            System.out.println("item==>" + item.toString());
        }
        System.out.println("alist共多少学生回答问题==>" + AnswerActivityTea.alist.size());

        //所有学生答案
        String answerStu = jsonObject.getString("answerStu");
        AnswerActivityTea.answerStu = answerStu;
        System.out.println("所有学生答案==>" + AnswerActivityTea.answerStu);

        //将学生答案分割并放入List<List<String>> stusAnswerList_name、List<String> stusAnswerList_answer
        splitStuAnswers_zhuguan();
    }

    //分割学生答案-主观题
    // List<List<String>> stusAnswerList_name_txt、List<String> stusAnswerList_answer_txt
    //List<String> stusAnswerList_name_img;  List<String> stusAnswerList_answer_img;
    private void splitStuAnswers_zhuguan(){
        System.out.println("开始分割学生答案！！！！！！！！！！！！！！");
        //AnswerActivity.answerStu格式:
        // D:葛舸_2,葛舸_5,索夏利,@#@A:葛舸_3,@#@B:葛舸_1,何一繁,卢文静,@#@C:葛舸_0,葛舸_4,孙亮亮,@#@
        String stuAnswers = AnswerActivityTea.answerStu;
        System.out.println("学生答案1111:" + stuAnswers);
        String[] answer_names_list = stuAnswers.split(",@#@");
        for(int i = 0 ; i < answer_names_list.length ; i++){
            System.out.println("学生答案2222:" + answer_names_list[i]);
        }

        //答案列表-文字
        if(stusAnswerList_answer_txt != null){
            stusAnswerList_answer_txt.clear();
        }else{
            stusAnswerList_answer_txt = new ArrayList<>();
        }
        //学生姓名列表-文字
        if(stusAnswerList_name_txt != null){
            stusAnswerList_name_txt.clear();
        }else{
            stusAnswerList_name_txt = new ArrayList<List<String>>();
        }

        //答案列表-img
        if(stusAnswerList_answer_img != null){
            stusAnswerList_answer_img.clear();
        }else{
            stusAnswerList_answer_img = new ArrayList<>();
        }
        //学生姓名列表-img
        if(stusAnswerList_name_img != null){
            stusAnswerList_name_img.clear();
        }else{
            stusAnswerList_name_img = new ArrayList<>();
        }
        for(int i = 0 ; i < answer_names_list.length ; i++){
            String answer = answer_names_list[i].substring(0 , answer_names_list[i].indexOf(":"));
            String names = answer_names_list[i].substring(answer_names_list[i].indexOf(":") + 1);
            String[] name_list = names.split(",");
            //图片类型的答案
            if(answer.indexOf("img") >= 0){
                stusAnswerList_answer_img.add(answer);
                for(int j = 0 ; j < name_list.length ; j++){
                    stusAnswerList_name_img.add(name_list[j]);
                }
            }else{
                stusAnswerList_answer_txt.add(answer);
                List<String> name_List = new ArrayList<String>(Arrays.asList(name_list));
                stusAnswerList_name_txt.add(name_List);
            }
        }
        System.out.println("stusAnswerList_name_txt: " + stusAnswerList_name_txt);
        System.out.println("stusAnswerList_answer_txt: " + stusAnswerList_answer_txt);
        System.out.println("stusAnswerList_name_img: " + stusAnswerList_name_img);
        System.out.println("stusAnswerList_answer_img: " + stusAnswerList_answer_img);
    }

    //请求当前要分析的课堂的学生回答情况(主观题答案详情) aflag:答案内容-1，答题详情-2 index:汇总数据（-1）、班级以及其他移动端index  v:主观题弹框popupwindow
    private void getJoinClassMemberSubmitAnswerInf_zhuguan_content(String ketangId , int stuNum ,  int index , int aflag , View v){
        new Thread(new Runnable() {
            @Override
            public void run() {
                System.out.println("主观题: 获取加入课堂的班级或移动端的学生作答情况！！！！！！！！！！！！！！！！！！！！！！！！");
                initHttpData_memberAnswer();
                System.out.println("主观题学生作答情况111:  " + AnswerActivityTea.alist);
                JSONObject jsonObject = Http_HuDongActivityTea.getSubmitAnswerClass_keguan(ketangId , stuNum);
                String status = "";
                if(jsonObject != null){
                    try {
                        updateHttpData_memberAnswer_content(jsonObject);
                        status = jsonObject.getString("status");
                        System.out.println("主观题学生作答情况222:  " + status);
                    } catch (JSONException ex) {
                        ex.printStackTrace();
                    }
                }
                if(jsonObject != null && status != null && status.length() > 0){
                    System.out.println("主观题学生作答情况333:  " + AnswerActivityTea.alist);
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            //更新答题率
                            if(ketangId.equals("all")){
                                int all_count = getJoinClassAllStuNum();
                                int answer_count = AnswerActivityTea.alist.size();
                                tx_dati2.setText((int)(answer_count * 1.0 / all_count * 100) + "%");
                                System.out.println("总人数:  " + all_count + " ,  作答人数:  " + answer_count + " ,  答题率:  " + (int)(answer_count * 1.0 / all_count * 100));
                            }else{
                                int all_count = AnswerActivityTea.classList.get(index).stuNum;
                                int answer_count = AnswerActivityTea.alist.size();
                                tx_dati2.setText((int)(answer_count * 1.0 / all_count * 100) + "%");
                                System.out.println("总人数:  " + all_count + " ,  作答人数:  " + answer_count + " ,  答题率:  " + (int)(answer_count * 1.0 / all_count * 100));
                            }
                            tx_noanswer_zhuguan.setVisibility(View.GONE);
                            if(aflag == 1){ //答案内容
                                showStudentsAnswer_img(v);
                            }else{ //答题详情
                                showStudentsAnswer(v);
                            }
                        }
                    });
                }else{
//                    Toast.makeText(getActivity(), "没有人提交答案" + answer, Toast.LENGTH_SHORT).show();
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {
                            slStusAnswers_zhuguan.setVisibility(View.GONE);
                            slStusAnswersImg.setVisibility(View.GONE);
                            tx_noanswer_zhuguan.setVisibility(View.VISIBLE);
                            tx_dati2.setText("0%");
                        }
                    });
                }
            }
        }).start();
    }


    //显示弹框(主观题)
    private void showPopupWindow_luru(View v , int flag){
        //将popupWindow将要展示的弹窗内容view放入popupWindow中
//        PopupWindow popupWindow = new PopupWindow(v ,
//                1000,
//                650,
//                false);
        initJoinClassInformation(); //加载加入课堂的成员
        if(screenWidth <= 0){
            getScreenProps();
        }
//        PopupWindow popupWindow = new PopupWindow(v , (int)(screenWidth * 0.75) , (int)(screenHeight * 0.8) , false);
        PopupWindow popupWindow = new PopupWindow(v , WindowManager.LayoutParams.MATCH_PARENT , WindowManager.LayoutParams.MATCH_PARENT , false);

        //弹框展示在屏幕中间Gravity.CENTER,x和y是相对于Gravity.CENTER的偏移
        popupWindow.showAtLocation(v , Gravity.CENTER , 0 , 0);

        //答案内容 答题详情
        View view1 , view2;   //答案内容 答题详情字体上方的横条
        TextView txt_daan , txt_dati;
        txt_daan = v.findViewById(R.id.txdaan);
        txt_dati = v.findViewById(R.id.txdati);
        view1 = v.findViewById(R.id.view1);
        view2 = v.findViewById(R.id.view2);

        slStusAnswersImg = v.findViewById(R.id.slStusAnswersImg);
        slStusAnswers_zhuguan = v.findViewById(R.id.slStusAnswers);
        tx_noanswer_zhuguan = v.findViewById(R.id.tx_noanswer);

        tx_dati1 = v.findViewById(R.id.tx_dati1);
        tx_dati2 = v.findViewById(R.id.tx_dati2);


        //弹框左侧显示“汇总数据”
        tx_huizong = v.findViewById(R.id.tx_huizong);
        ListView lvClass = v.findViewById(R.id.lvClass);
        lvClass.setDivider(null); //不显示边框

        //要显示的数据(左侧班级信息)
        List<String> listitem = new ArrayList<>();
        for (int i = 0; i < AnswerActivityTea.classList.size() ; i++) {
            String temp = AnswerActivityTea.classList.get(i).keTangName;
            listitem.add(temp);
        }

        //创建⼀个Adapter
        myAdapter = new MyAdapter(listitem , this.getActivity() , selectedIndex , isSelect_huizong);
        lvClass.setAdapter(myAdapter);
        lvClass.setOnItemClickListener(new AdapterView.OnItemClickListener() {
            @SuppressLint("WrongConstant")
            @Override
            public void onItemClick(AdapterView<?> adapterView, View view, int position, long id) {
                selectedIndex = position;
                Log.e("汇总数据是否选中1：  " ,  myAdapter.isSelect()+ "");
                myAdapter.setSelect(false);
                myAdapter.changeSelected(position);
                Log.e("汇总数据是否选中2：  " ,  myAdapter.isSelect()+ "");
                if(isSelect_huizong){
                    tx_huizong.setBackgroundColor(Color.parseColor("#FFFFFF"));
                    tx_huizong.setTextColor(Color.parseColor("#FF000000"));
                }
                isSelect_huizong = false;
                Log.e("当前选中的index是123：  " , position + "");

                int aflag = 0;
                if(view1.getVisibility() == 0){  //答案内容，显示webview
                    aflag = 1;
                    view1.setVisibility(View.VISIBLE);
                    view2.setVisibility(View.GONE);
                    txt_daan.setTextColor(Color.parseColor("#007947"));
                    txt_dati.setTextColor(Color.parseColor("#FF000000"));
                    slStusAnswersImg.setVisibility(View.VISIBLE);
                    slStusAnswers_zhuguan.setVisibility(View.GONE);
                    tx_noanswer_zhuguan.setVisibility(View.GONE);
                }

                if(view2.getVisibility() == 0){ //答题详情，显示学生姓名
                    aflag = 2;
                    view1.setVisibility(View.GONE);
                    view2.setVisibility(View.VISIBLE);
                    txt_daan.setTextColor(Color.parseColor("#FF000000"));
                    txt_dati.setTextColor(Color.parseColor("#007947"));
                    slStusAnswersImg.setVisibility(View.GONE);
                    slStusAnswers_zhuguan.setVisibility(View.VISIBLE);
                    tx_noanswer_zhuguan.setVisibility(View.GONE);
                }

                String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                if(aflag == 1){
                    System.out.println("主观题学生答案_class_1111:  " + AnswerActivityTea.alist_zhuguan);
                    getJoinClassMemberSubmitAnswerInf_zhuguan(classId , selectedIndex , aflag , v);
                    System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist_zhuguan);
                }else{
                    System.out.println("主观题学生答案_class_11111:  " + AnswerActivityTea.alist);
                    int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                    getJoinClassMemberSubmitAnswerInf_zhuguan_content(classId , count ,  selectedIndex , aflag , v);
                    System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist);
                }
            }
        });

        //初始进入popupwindow
        if(flag == 1){  //"答案内容“
            slStusAnswersImg.setVisibility(View.VISIBLE);
            slStusAnswers_zhuguan.setVisibility(View.GONE);
            tx_noanswer_zhuguan.setVisibility(View.GONE);
            view1.setVisibility(View.VISIBLE);
            view2.setVisibility(View.GONE);
            txt_daan.setTextColor(Color.parseColor("#007947"));
            txt_dati.setTextColor(Color.parseColor("#FF000000"));
//            showStudentsAnswer_img(v);
        }else{ //"答题详情"
            slStusAnswersImg.setVisibility(View.GONE);
            slStusAnswers_zhuguan.setVisibility(View.VISIBLE);
            tx_noanswer_zhuguan.setVisibility(View.GONE);
            view1.setVisibility(View.GONE);
            view2.setVisibility(View.VISIBLE);
            txt_daan.setTextColor(Color.parseColor("#FF000000"));
            txt_dati.setTextColor(Color.parseColor("#007947"));
//            showStudentsAnswer(v);
        }

        //初始进入popupwindow，显示汇总数据
        if(isSelect_huizong){
            //请求当前要分析的课堂的学生回答情况
            if(flag == 1){
                System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist_zhuguan);
                getJoinClassMemberSubmitAnswerInf_zhuguan("all" , -1 , flag , v);
                System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist_zhuguan);
            }else{
                System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist);
                int count = getJoinClassAllStuNum();
                getJoinClassMemberSubmitAnswerInf_zhuguan_content("all" , count ,  -1 , flag , v);
                System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist);
            }
        }else{
            String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
            if(flag == 1){
                System.out.println("主观题学生答案_class_1111:  " + AnswerActivityTea.alist_zhuguan);
                getJoinClassMemberSubmitAnswerInf_zhuguan(classId , selectedIndex , flag , v);
                System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist_zhuguan);
            }else{
                System.out.println("主观题学生答案_class_11111:  " + AnswerActivityTea.alist);
                int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                getJoinClassMemberSubmitAnswerInf_zhuguan_content(classId , count ,  selectedIndex , flag , v);
                System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist);
            }
        }


        tx_huizong.setOnClickListener(new View.OnClickListener() {
            @SuppressLint("WrongConstant")
            @Override
            public void onClick(View view) {
                isSelect_huizong = true;
                myAdapter.setmSelect(0);
                myAdapter.setSelect(true);
                tx_huizong.setBackgroundColor(Color.parseColor("#007947"));
                tx_huizong.setTextColor(Color.parseColor("#FFFFFF"));
                int aflag = 0;
                if(view1.getVisibility() == 0){  //答案内容，显示webview
                    aflag = 1;
                    view1.setVisibility(View.VISIBLE);
                    view2.setVisibility(View.GONE);
                    txt_daan.setTextColor(Color.parseColor("#007947"));
                    txt_dati.setTextColor(Color.parseColor("#FF000000"));
                    slStusAnswersImg.setVisibility(View.VISIBLE);
                    slStusAnswers_zhuguan.setVisibility(View.GONE);
                    tx_noanswer_zhuguan.setVisibility(View.GONE);
                }

                if(view2.getVisibility() == 0){ //答题详情，显示学生姓名
                    aflag = 2;
                    view1.setVisibility(View.GONE);
                    view2.setVisibility(View.VISIBLE);
                    txt_daan.setTextColor(Color.parseColor("#FF000000"));
                    txt_dati.setTextColor(Color.parseColor("#007947"));
                    slStusAnswersImg.setVisibility(View.GONE);
                    slStusAnswers_zhuguan.setVisibility(View.VISIBLE);
                    tx_noanswer_zhuguan.setVisibility(View.GONE);
                }

                //请求当前要分析的课堂的学生回答情况
                if(aflag == 1){
                    System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist_zhuguan);
                    getJoinClassMemberSubmitAnswerInf_zhuguan("all" , -1 , aflag , v);
                    System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist_zhuguan);
                }else{
                    System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist);
                    int count = getJoinClassAllStuNum();
                    getJoinClassMemberSubmitAnswerInf_zhuguan_content("all" , count ,  -1 , aflag , v);
                    System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist);
                }
            }
        });

        txt_daan.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                view1.setVisibility(View.VISIBLE);
                view2.setVisibility(View.GONE);
                txt_daan.setTextColor(Color.parseColor("#007947"));
                txt_dati.setTextColor(Color.parseColor("#FF000000"));
//                showStudentsAnswer_img(v);
                if(isSelect_huizong){
                    //请求当前要分析的课堂的学生回答情况
                    System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist_zhuguan);
                    getJoinClassMemberSubmitAnswerInf_zhuguan("all" , -1 , 1 , v);
                    System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist_zhuguan);
                }else{
                    System.out.println("主观题学生答案_class_1111:  " + AnswerActivityTea.alist_zhuguan);
                    String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                    getJoinClassMemberSubmitAnswerInf_zhuguan(classId , selectedIndex , 1 , v);
                    System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist_zhuguan);
                }
            }
        });

        txt_dati.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                view1.setVisibility(View.GONE);
                view2.setVisibility(View.VISIBLE);
                txt_daan.setTextColor(Color.parseColor("#FF000000"));
                txt_dati.setTextColor(Color.parseColor("#007947"));
//                showStudentsAnswer(v);
                if(isSelect_huizong){
                    //请求当前要分析的课堂的学生回答情况
                    System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist);
                    int count = getJoinClassAllStuNum();
                    getJoinClassMemberSubmitAnswerInf_zhuguan_content("all" , count ,  -1 , 2 , v);
                    System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist);
                }else{
                    System.out.println("主观题学生答案_class_11111:  " + AnswerActivityTea.alist);
                    String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                    int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                    getJoinClassMemberSubmitAnswerInf_zhuguan_content(classId , count ,  selectedIndex , 2 , v);
                    System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist);
                }
            }
        });

        //公布结果按钮
        ImageView img_gbjg = v.findViewById(R.id.imgPush);
        //刷新按钮
        ImageView img_flash = v.findViewById(R.id.imgFlash);
        //退出按钮
        ImageView img_exit = v.findViewById(R.id.imgExit);
        //共享按钮
        ImageView img_share = v.findViewById(R.id.imgShare);


        img_gbjg.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                popupWindow.dismiss();
                //将popupwindow移动到左上角
                popupWindow.showAtLocation(v , Gravity.TOP | Gravity.LEFT , 0 , 0);
                //不显示公布结果、刷新按钮，设置答案,退出按钮向右移动
                img_gbjg.setVisibility(View.INVISIBLE);
                img_flash.setVisibility(View.INVISIBLE);
            }
        });

        img_flash.setOnClickListener(new View.OnClickListener() {
            @SuppressLint("WrongConstant")
            @Override
            public void onClick(View view) {
                System.out.println("点击了更新数据!!!!!!!!!!!!!!!");
                Log.e("点击了刷新按钮", view.getId() + "");
                int position = myAdapter.getmSelect();
                int aflag = 0;
                if(view1.getVisibility() == 0){  //答案内容，显示webview
                    aflag = 1;
                    view1.setVisibility(View.VISIBLE);
                    view2.setVisibility(View.GONE);
                    txt_daan.setTextColor(Color.parseColor("#007947"));
                    txt_dati.setTextColor(Color.parseColor("#FF000000"));
                    slStusAnswersImg.setVisibility(View.VISIBLE);
                    slStusAnswers_zhuguan.setVisibility(View.GONE);
                    tx_noanswer_zhuguan.setVisibility(View.GONE);
                }

                if(view2.getVisibility() == 0){ //答题详情，显示学生姓名
                    aflag = 2;
                    view1.setVisibility(View.GONE);
                    view2.setVisibility(View.VISIBLE);
                    txt_daan.setTextColor(Color.parseColor("#FF000000"));
                    txt_dati.setTextColor(Color.parseColor("#007947"));
                    slStusAnswersImg.setVisibility(View.GONE);
                    slStusAnswers_zhuguan.setVisibility(View.VISIBLE);
                    tx_noanswer_zhuguan.setVisibility(View.GONE);
                }

                if(isSelect_huizong){
                    //请求当前要分析的课堂的学生回答情况
                    if(aflag == 1){
                        System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist_zhuguan);
                        getJoinClassMemberSubmitAnswerInf_zhuguan("all" , -1 , aflag , v);
                        System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist_zhuguan);
                    }else{
                        System.out.println("主观题学生答案11111:  " + AnswerActivityTea.alist);
                        int count = getJoinClassAllStuNum();
                        getJoinClassMemberSubmitAnswerInf_zhuguan_content("all" , count ,  -1 , aflag , v);
                        System.out.println("主观题学生答案22222:  " + AnswerActivityTea.alist);
                    }
                }else{
                    String classId = AnswerActivityTea.classList.get(selectedIndex).ketangId;
                    if(aflag == 1){
                        System.out.println("主观题学生答案_class_1111:  " + AnswerActivityTea.alist_zhuguan);
                        getJoinClassMemberSubmitAnswerInf_zhuguan(classId , selectedIndex , aflag , v);
                        System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist_zhuguan);
                    }else{
                        System.out.println("主观题学生答案_class_11111:  " + AnswerActivityTea.alist);
                        int count = AnswerActivityTea.classList.get(selectedIndex).stuNum;
                        getJoinClassMemberSubmitAnswerInf_zhuguan_content(classId , count ,  selectedIndex , aflag , v);
                        System.out.println("主观题学生答案_class_22222:  " + AnswerActivityTea.alist);
                    }
                }
            }
        });

        img_exit.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //退出之前，需要先关闭屏幕共享！！！！！！
                if((img_share.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.share_end).getConstantState())){
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MainActivity_tea activity = (MainActivity_tea) getActivity();
                            activity.stopScreenCapture();
                        }
                    });
                }
                popupWindow.dismiss();
                selectedIndex = 0;
                isSelect_huizong = true;
            }
        });

        img_share.setOnClickListener(new View.OnClickListener(){
            @Override
            public void onClick(View view) {
                if((img_share.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.share).getConstantState())){
                    //开始共享屏幕
                    btEnd.performClick(); //分享屏幕时主动触发结束答题按钮
                    img_share.setImageDrawable(getResources().getDrawable((R.mipmap.share_end)));
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MainActivity_tea activity = (MainActivity_tea) getActivity();
                            activity.startScreenCapture();
                        }
                    });
                }else{
                    //结束共享屏幕
                    img_share.setImageDrawable(getResources().getDrawable((R.mipmap.share)));
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MainActivity_tea activity = (MainActivity_tea) getActivity();
                            activity.stopScreenCapture();
                        }
                    });
                }
            }
        });
    }

    //主观题-显示学生答案内容
    private void showStudentsAnswer_img(View v){
        slStusAnswersImg = v.findViewById(R.id.slStusAnswersImg);
        slStusAnswers_zhuguan = v.findViewById(R.id.slStusAnswers);
        tx_noanswer_zhuguan = v.findViewById(R.id.tx_noanswer);
        slStusAnswersImg.setVisibility(View.VISIBLE);
        slStusAnswers_zhuguan.setVisibility(View.GONE);
        tx_noanswer_zhuguan.setVisibility(View.GONE);

        //动态在这个布局中添加控件
        LinearLayout linearStusAnswersImg = v.findViewById(R.id.linearStusAnswersImg);
        linearStusAnswersImg.removeAllViews();

        int studentsNum = stusNameList.size(); //答题的学生人数
        //每行展示3个学生答案，linearsNum表示需要几个线性布局来包裹学生答案
        int linearsNum = (int)Math.ceil(studentsNum / 3.0);
        LinearLayout[] answersList = new LinearLayout[linearsNum];
        //初始化所有LinearLayout，每个都3等份
        for(int i = 0 ; i < answersList.length ; i++){
            answersList[i] = new LinearLayout(getActivity());
            //设置参数
            LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT, LinearLayout.LayoutParams.WRAP_CONTENT);
            answersList[i].setWeightSum(3);  //3等份
            answersList[i].setLayoutParams(params);
            answersList[i].setOrientation(LinearLayout.HORIZONTAL);
        }

        if(screenWidth < 0){
            getScreenProps();
        }

        for(int i = 0 ; i < studentsNum ; i++){
            LinearLayout linearStu = new LinearLayout(getActivity());
            LinearLayout.LayoutParams linear_params = new LinearLayout.LayoutParams(0, (int)(screenHeight * 0.35), 1);
            //每行展示3个学生答案
            if(i % 3 == 0){
                linear_params.setMargins(10 , 3 , 5 , 3);
            }else{
                linear_params.setMargins(5 , 3 , 5 , 3);
            }
            linearStu.setOrientation(LinearLayout.VERTICAL);
            linearStu.setLayoutParams(linear_params);
            linearStu.setBackground(getResources().getDrawable(R.drawable.linear_shape));

            TextView tx_name = new TextView(getActivity());
            LinearLayout.LayoutParams tx_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            tx_name.setLayoutParams(tx_params);
            tx_name.setPadding(0 , 2 , 0 , 2);
            tx_name.setGravity(Gravity.CENTER);
            tx_name.setText(stusNameList.get(i));
            tx_name.setTextColor(Color.parseColor("#FFFFFF"));

            linearStu.addView(tx_name);

            LinearLayout htmlView = new LinearLayout(getActivity());
            LinearLayout.LayoutParams htmlView_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    0,
                    1);
            htmlView_params.setMargins(2 , 0 , 2 , 2);
            htmlView.setLayoutParams(htmlView_params);
            htmlView.setOrientation(LinearLayout.VERTICAL);
            htmlView.setBackground(getResources().getDrawable(R.drawable.txt_shape));

            WebView answer_webView = new WebView(getActivity());
            answer_webView.setId(i);
            LinearLayout.LayoutParams webView_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.MATCH_PARENT);
            //为了看到底部两侧的圆角
            webView_params.setMargins(5 , 0 , 5 , 5);
            answer_webView.setLayoutParams(webView_params);
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) { //不安全站点资源http等
                answer_webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
            }
            answer_webView.getSettings().setBlockNetworkImage(false); //解除数据阻止
            answer_webView.setHorizontalScrollBarEnabled(false); //滚动条水平不显示
            answer_webView.setVerticalScrollBarEnabled(false);//滚动条竖直不显示
            answer_webView.getSettings().setDefaultTextEncodingName("UTF-8"); //防止中文乱码
            answer_webView.setOnTouchListener(new View.OnTouchListener() {
                @Override
                public boolean onTouch(View view, MotionEvent ev) {
                    //ScrollView和webview滚动冲突
                    //父控件调用touch事件,滚动冲突
//                    ((WebView)view).requestDisallowInterceptTouchEvent(true);
                    selectStuAnswerIndex = view.getId();
//                    Toast.makeText(getActivity(),"点击了答案",Toast.LENGTH_SHORT).show();
                    showImageAnswer(v); //显示单个学生答案
                    return false;
                }
            });

            String unEncodedHtml = stusAnswerList.get(i).toString();
            answer_webView.loadDataWithBaseURL(null , unEncodedHtml , "text/html",  "utf-8", null);

            htmlView.addView(answer_webView);
            linearStu.addView(htmlView);
            answersList[i / 3].addView(linearStu);
        }
        for(int i = 0 ; i < answersList.length ; i++){
            linearStusAnswersImg.addView(answersList[i]);
        }
    }


    //显示主观题答案-图片
    private void showImageAnswer(View v){
        LinearLayout linear1 = v.findViewById(R.id.linear1);
        LinearLayout linear_imgAndtxt = v.findViewById(R.id.linear_imgAndtxt);
        LinearLayout linear_img = v.findViewById(R.id.linear_img);
        //清空布局
        linear_img.removeAllViews();

        ImageView img_back = v.findViewById(R.id.img_back);
        ImageView img_next = v.findViewById(R.id.img_next);
        TextView tx_who = v.findViewById(R.id.tx_who);
        TextView tx_num = v.findViewById(R.id.tx_num);
        TextView tx_close = v.findViewById(R.id.tx_close);

        linear1.setVisibility(View.GONE);
        linear_imgAndtxt.setVisibility(View.VISIBLE);

        Log.e("当前选中的学生index是: ", selectStuAnswerIndex + "");
        if(selectStuAnswerIndex >= 0){
            Log.e("当前选中的学生姓名是: ", stusNameList.get(selectStuAnswerIndex));
            Log.e("当前选中的学生答案url是: ", stusAnswerList.get(selectStuAnswerIndex));
            int allNum = stusAnswerList.size(); //图片答案-总人数
            String tx = (selectStuAnswerIndex + 1) + "/" + allNum;
            tx_num.setText(tx);
            tx_who.setText(stusNameList.get(selectStuAnswerIndex)); //学生姓名
            WebView answer_webView = getWebView(); //加载单个学生答案
            linear_img.addView(answer_webView);
        }
        //上翻页
        img_back.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(selectStuAnswerIndex >= 1){
                    selectStuAnswerIndex--;
                    int allNum = stusAnswerList.size(); //图片答案-总人数
                    String tx = (selectStuAnswerIndex + 1) + "/" + allNum;
                    tx_num.setText(tx);
                    tx_who.setText(stusNameList.get(selectStuAnswerIndex));
                    linear_img.removeAllViews();  //清空布局
                    WebView answer_webView = getWebView();//加载单个学生答案
                    linear_img.addView(answer_webView);
                }
            }
        });
        //下翻页
        img_next.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(selectStuAnswerIndex < stusAnswerList.size() - 1){
                    selectStuAnswerIndex++;
                    int allNum = stusAnswerList.size(); //图片答案-总人数
                    String tx = (selectStuAnswerIndex + 1) + "/" + allNum;
                    tx_num.setText(tx);
                    tx_who.setText(stusNameList.get(selectStuAnswerIndex));
                    linear_img.removeAllViews();
                    WebView answer_webView = getWebView();//加载单个学生答案
//                    TextView answer_webView = getTextView();
                    linear_img.addView(answer_webView);
                }
            }
        });

        tx_close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                linear1.setVisibility(View.VISIBLE);
                linear_imgAndtxt.setVisibility(View.GONE);
                selectStuAnswerIndex = 0;
            }
        });
    }

    //获取textview
    private TextView getTextView(){
        TextView answer_webView = new TextView(getActivity());
        LinearLayout.LayoutParams webView_params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT);
        //为了看到底部两侧的圆角
        webView_params.setMargins(5 , 0 , 5 , 5);
        answer_webView.setLayoutParams(webView_params);
        final  String answer_stu = stusAnswerList.get(selectStuAnswerIndex).toString();
        MyImageGetter myImageGetter = new MyImageGetter(getActivity(), answer_webView);
//        MyTagHandler tagHandler = new MyTagHandler(getActivity());
        CharSequence sequence;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
            sequence = Html.fromHtml(answer_stu, Html.FROM_HTML_MODE_LEGACY, myImageGetter, null);
        } else {
            sequence = Html.fromHtml(answer_stu);
        }
        answer_webView.setText(sequence);

        answer_webView.setMovementMethod(ScrollingMovementMethod.getInstance());// 设置可滚动

        return answer_webView;
    }

    //获取webview
    private WebView getWebView(){
        WebView answer_webView = new WebView(getActivity());
        LinearLayout.LayoutParams webView_params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT);
        answer_webView.setLayoutParams(webView_params);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) { //不安全站点资源http等
            answer_webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
//        answer_webView.getSettings().setJavaScriptEnabled(true);
//        answer_webView.getSettings().setDomStorageEnabled(true); //webView默认不开启DOM Storage
        answer_webView.getSettings().setBlockNetworkImage(false); //解除数据阻止
        answer_webView.setHorizontalScrollBarEnabled(false);  //不显示水平滚动条
        answer_webView.setVerticalScrollBarEnabled(false);//不显示垂直滚动条

        answer_webView.getSettings().setUseWideViewPort(true);//设定支持 viewport
        answer_webView.getSettings().setLoadWithOverviewMode(true);   //自适应屏幕  缩放至屏幕的大小
        answer_webView.getSettings().setBuiltInZoomControls(true);  //是否使用内置的缩放机制
        answer_webView.getSettings().setDisplayZoomControls(false); //隐藏缩放控件
        answer_webView.getSettings().setSupportZoom(true);//设定支持缩放
        answer_webView.getSettings().setDefaultTextEncodingName("UTF-8");

        String unEncodedHtml = stusAnswerList.get(selectStuAnswerIndex).toString();
        answer_webView.loadDataWithBaseURL(null , unEncodedHtml , "text/html",  "utf-8", null);
        return answer_webView;
    }


    //主观题-显示学生答题详情
    private void showStudentsAnswer(View v){
        slStusAnswersImg = v.findViewById(R.id.slStusAnswersImg);
        slStusAnswers_zhuguan = v.findViewById(R.id.slStusAnswers);
        tx_noanswer_zhuguan = v.findViewById(R.id.tx_noanswer);
        slStusAnswers_zhuguan.setVisibility(View.VISIBLE);
        slStusAnswersImg.setVisibility(View.GONE);
        tx_noanswer_zhuguan.setVisibility(View.GONE);

        //在该布局内动态添加控件
        LinearLayout linearStusAnswers = v.findViewById(R.id.linearStusAnswers);
        linearStusAnswers.removeAllViews();
        //文字答案
        for(int i = 0 ; i < stusAnswerList_answer_txt.size() ; i++){
            //包裹选择当前选项作为答案的学生姓名
            LinearLayout linearAnswer = new LinearLayout(getActivity());
            //设置参数
            LinearLayout.LayoutParams linear_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            linear_params.setMargins(20 , 0 , 20 , 5 );
            linearAnswer.setLayoutParams(linear_params);
            linearAnswer.setOrientation(LinearLayout.HORIZONTAL);

            TextView txt_da = new TextView(getActivity());
            //设置参数
            LinearLayout.LayoutParams txt_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            txt_da.setLayoutParams(txt_params);
//            txt_da.setTextSize(15);
            txt_da.setText("答:");
            txt_da.setTextColor(Color.parseColor("#828798"));

            TextView txt_answer = new TextView(getActivity());
            txt_answer.setPadding(10 , 0 , 0 , 0);
            txt_answer.setLayoutParams(txt_params);
//            txt_answer.setTextSize(15);
            txt_answer.setText(stusAnswerList_answer_txt.get(i));
            txt_answer.setTextColor(Color.parseColor("#33a3dc"));
            linearAnswer.addView(txt_da);
            linearAnswer.addView(txt_answer);
            linearStusAnswers.addView(linearAnswer);

            //包裹选择当前选项作为答案的学生姓名
            LinearLayout linearAll = new LinearLayout(getActivity());
            //设置参数
            LinearLayout.LayoutParams linearAll_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            linear_params.setMargins(10 , 0 , 10 , 0 );
            linearAll.setLayoutParams(linearAll_params);
            linearAll.setOrientation(LinearLayout.VERTICAL);

            int linearSum =  (int)Math.ceil(stusAnswerList_name_txt.get(i).size() / 8.0);
            LinearLayout[] answersList = new LinearLayout[linearSum];
            for(int k = 0 ; k < answersList.length ; k++){
                answersList[k] = new LinearLayout(getActivity());
                //设置参数
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT);
                answersList[k].setLayoutParams(params);
                answersList[k].setWeightSum(8);
                answersList[k].setOrientation(LinearLayout.HORIZONTAL);
            }
            for(int j = 0 ; j < stusAnswerList_name_txt.get(i).size() ; j++){
                TextView txt_name = new TextView(getActivity());
                LinearLayout.LayoutParams txtname_params = new LinearLayout.LayoutParams(
                        0,
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        1);

                //每行展示8个学生姓名
                if(j % 8 == 0){
                    txtname_params.setMargins(10 , 3 , 5 , 3);
                }else{
                    txtname_params.setMargins(5 , 3 , 5 , 3);
                }
                txt_name.setLayoutParams(txtname_params);
                txt_name.setPadding(5 , 2 , 5 , 2);
//                txt_name.setTextSize(15);
                txt_name.setGravity(Gravity.CENTER);
                txt_name.setText(stusAnswerList_name_txt.get(i).get(j));

                txt_name.setBackgroundColor(Color.parseColor("#d3d7d4"));
                txt_name.setTextColor(Color.parseColor("#828798"));
                answersList[j / 8].addView(txt_name);
            }
            for(int k = 0 ; k < answersList.length ; k++){
                linearAll.addView(answersList[k]);
            }
            linearStusAnswers.addView(linearAll);
        }

        //拍照答案
        if(stusAnswerList_name_img.size() > 0){
            TextView txt_paizhao = new TextView(getActivity());
            //设置参数
            LinearLayout.LayoutParams txt_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.WRAP_CONTENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            txt_params.setMargins(10 , 5 , 10 , 5);
            txt_paizhao.setLayoutParams(txt_params);
//            txt_paizhao.setTextSize(15);
            txt_paizhao.setText("拍照片");
            txt_paizhao.setTextColor(Color.parseColor("#828798"));
            linearStusAnswers.addView(txt_paizhao);

            //包裹选择当前选项作为答案的学生姓名
            LinearLayout linearAll = new LinearLayout(getActivity());
            //设置参数
            LinearLayout.LayoutParams linear_params = new LinearLayout.LayoutParams(
                    LinearLayout.LayoutParams.MATCH_PARENT,
                    LinearLayout.LayoutParams.WRAP_CONTENT);
            linearAll.setLayoutParams(linear_params);
            linearAll.setOrientation(LinearLayout.VERTICAL);

            int linearSum =  (int)Math.ceil(stusAnswerList_name_img.size() / 8.0);
            LinearLayout[] answersList = new LinearLayout[linearSum];
            for(int k = 0 ; k < answersList.length ; k++){
                answersList[k] = new LinearLayout(getActivity());
                //设置参数
                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
                        LinearLayout.LayoutParams.MATCH_PARENT,
                        LinearLayout.LayoutParams.WRAP_CONTENT);
                answersList[k].setLayoutParams(params);
                answersList[k].setWeightSum(8);
                answersList[k].setOrientation(LinearLayout.HORIZONTAL);
            }
            for(int i = 0 ; i < stusAnswerList_name_img.size() ; i++){
                TextView txt_name = new TextView(getActivity());
                LinearLayout.LayoutParams txtname_params = new LinearLayout.LayoutParams(
                        0,
                        LinearLayout.LayoutParams.WRAP_CONTENT,
                        1);

                //每行展示8个学生姓名
                if(i % 8 == 0){
                    txtname_params.setMargins(10 , 5 , 5 , 5);
                }else{
                    txtname_params.setMargins(5 , 5 , 5 , 5);
                }
                txt_name.setLayoutParams(txtname_params);
                txt_name.setPadding(5 , 2 , 5 , 2);
//                txt_name.setTextSize(15);
                txt_name.setGravity(Gravity.CENTER);
                txt_name.setText(stusAnswerList_name_img.get(i));

                txt_name.setBackgroundColor(Color.parseColor("#d3d7d4"));
                txt_name.setTextColor(Color.parseColor("#828798"));
                answersList[i / 8].addView(txt_name);
            }
            for(int k = 0 ; k < answersList.length ; k++){
                linearAll.addView(answersList[k]);
            }
            linearStusAnswers.addView(linearAll);
        }

        //未答题
//        if(stusAnswerList_Noanswer.size() > 0){
//            TextView txt_weida = new TextView(getActivity());
//            //设置参数
//            LinearLayout.LayoutParams txt_params = new LinearLayout.LayoutParams(
//                    LinearLayout.LayoutParams.WRAP_CONTENT,
//                    LinearLayout.LayoutParams.WRAP_CONTENT);
//            txt_params.setMargins(10 , 5 , 10 , 5);
//            txt_weida.setLayoutParams(txt_params);
//            txt_weida.setTextSize(15);
//            txt_weida.setText("未答题");
//            txt_weida.setTextColor(Color.parseColor("#828798"));
//            linearStusAnswers.addView(txt_weida);
//
//            //包裹选择当前选项作为答案的学生姓名
//            LinearLayout linearAll = new LinearLayout(getActivity());
//            //设置参数
//            LinearLayout.LayoutParams linear_params = new LinearLayout.LayoutParams(
//                    LinearLayout.LayoutParams.MATCH_PARENT,
//                    LinearLayout.LayoutParams.WRAP_CONTENT);
//            linearAll.setLayoutParams(linear_params);
//            linearAll.setOrientation(LinearLayout.VERTICAL);
//
//            int linearSum =  (int)Math.ceil(stusAnswerList_Noanswer.size() / 8.0);
//            LinearLayout[] answersList = new LinearLayout[linearSum];
//            for(int k = 0 ; k < answersList.length ; k++){
//                answersList[k] = new LinearLayout(getActivity());
//                //设置参数
//                LinearLayout.LayoutParams params = new LinearLayout.LayoutParams(
//                        LinearLayout.LayoutParams.MATCH_PARENT,
//                        LinearLayout.LayoutParams.WRAP_CONTENT);
//                answersList[k].setLayoutParams(params);
//                answersList[k].setWeightSum(8);
//                answersList[k].setOrientation(LinearLayout.HORIZONTAL);
//            }
//            for(int i = 0 ; i < stusAnswerList_Noanswer.size() ; i++){
//                TextView txt_name = new TextView(getActivity());
//                LinearLayout.LayoutParams txtname_params = new LinearLayout.LayoutParams(
//                        0,
//                        LinearLayout.LayoutParams.WRAP_CONTENT,
//                        1);
//
//                //每行展示8个学生姓名
//                if(i % 8 == 0){
//                    txtname_params.setMargins(10 , 5 , 5 , 5);
//                }else{
//                    txtname_params.setMargins(5 , 5 , 5 , 5);
//                }
//                txt_name.setLayoutParams(txtname_params);
//                txt_name.setPadding(5 , 2 , 5 , 2);
//                txt_name.setTextSize(15);
//                txt_name.setGravity(Gravity.CENTER);
//                txt_name.setText(stusAnswerList_Noanswer.get(i));
//
//                txt_name.setBackgroundColor(Color.parseColor("#d3d7d4"));
//                txt_name.setTextColor(Color.parseColor("#828798"));
//                answersList[i / 8].addView(txt_name);
//            }
//            for(int k = 0 ; k < answersList.length ; k++){
//                linearAll.addView(answersList[k]);
//            }
//            linearStusAnswers.addView(linearAll);
//        }
    }

    public static void handleSSLHandshake() {
        try {
            TrustManager[] trustAllCerts = new TrustManager[]{new X509TrustManager() {
                @Override
                public void checkServerTrusted(X509Certificate[] chain, String authType) throws CertificateException {

                }

                @Override
                public void checkClientTrusted(X509Certificate[] x509Certificates, String s) throws CertificateException {

                }

                @Override
                public X509Certificate[] getAcceptedIssuers() {
                    return new X509Certificate[0];
                }
            }};
            SSLContext sc = SSLContext.getInstance("TLS");
            // trustAllCerts信任所有的证书
            sc.init(null, trustAllCerts, new SecureRandom());
            HttpsURLConnection.setDefaultSSLSocketFactory(sc.getSocketFactory());
            HttpsURLConnection.setDefaultHostnameVerifier(new HostnameVerifier() {
                @Override
                public boolean verify(String hostname, SSLSession session) {
                    return true;
                }
            });
        } catch (Exception ignored) {

        }
    }

    //每隔800毫秒获取随机或者抢答的学生姓名，学生id
    private void getSuijiOrQiangdaStu(View  v){
        System.out.println("选人选人选人选人选人选人选人选人选人选人选人选人选人选人选人选人选人选人！！！！！！！！！！！！！！！！！！！！！！！！");
        if(mTimer != null){
            mTimer.cancel();
            mTimer = null;
        }

        //延迟delay毫秒后，执行第一次task，然后每隔period毫秒执行一次task
        mTimer = new Timer();
        mTimer.schedule(new TimerTask() {
            @Override
            public void run() {

                //请求接口，是否有学生数据!!!!!!！！！！！！！！！！！！！！！！
                getSelectedStu(v);
                //请求到数据之后，关掉轮训任务，并显示已选择学生信息
                if(stuName_selected != null && stuName_selected.length() > 0){
                    mTimer.cancel();
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() { //|| isClick_btClose == false
                            //重新随机 重新抢答 可点
                            btEnd.setTextColor(Color.parseColor("#FFFFFFFF"));
                            btEnd.setBackground(getResources().getDrawable((R.drawable.btn_begin_enable)));

                            showSelectedStu(v);  //显示已选择学生信息
                            //抢答：获取到抢答学生姓名之后，需要先发送“开始抢答作答”指令（接口）,再获取学生答案
                            if(txType_qiangda.isSelected()
                                    && stuName_selected != null
                                    && stuName_selected.length() > 0){
                                System.out.println("已获取到抢答学生信息，开始获取抢答学生的答案？？？？？？？？？？？？？" + stuName_selected);
                                beginOrEndQueAction("startAnswerQiangDa");
                            }
                            getSelectedStuAnswer(v); //调取接口，获取学生答案

                            tx_answers_sum.setVisibility(View.INVISIBLE);
                            jishiqi.setVisibility(View.VISIBLE);
                            jishiqi.setBase(SystemClock.elapsedRealtime());  //设置起始时间 ，这里是从0开始
                            jishiqi.start();   //开始计时
                        }
                    });
                }
            }
        } , 800 , 800);
    }

    //请求接口，是否有学生数据!!!!!!！！！！！！！！！！！！！！！！
    private void getSelectedStu(View v){
        new Thread(new Runnable() {
            @Override
            public void run() {
                getActivity().runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        if(txType_tiwen.isSelected()){
                            txType = 1;
                        }else if(txType_suiji.isSelected()){
                            txType = 2;
                        }else{
                            txType = 3;
                        }
                    }
                });
                System.out.println("请求接口，获取随机或抢答学生姓名，答题类型是: " + txType);
                AnswerActivityTea.stuId = "";
                AnswerActivityTea.stuName = "";
                Http_HuDongActivityTea.getSjOrQdStu(txType);   //获取随机或抢答学生信息
                if(AnswerActivityTea.stuId != null && AnswerActivityTea.stuId.length() > 0){
                    suiji_qiangda_flag = 1; //选中了一个学生
                    stuName_selected = AnswerActivityTea.stuName;
                    stuId_selected = AnswerActivityTea.stuId;
                    Log.e("选中学生姓名" , stuName_selected);
                    Log.e("选中学生id" , stuId_selected);
                    System.out.println("选中的学生信息！！！！！！！！！！！！！！！！！！！！！！！！" + stuName_selected + stuId_selected);
                }
            }
        }).start();
    }

    //每隔800毫秒获取随机或者抢答的学生答案
    private void getSelectedStuAnswer(View v){
        if(mTimer != null){
            mTimer.cancel();
            mTimer = null;
        }

        //延迟delay毫秒后，执行第一次task，然后每隔period毫秒执行一次task
        mTimer = new Timer();
        mTimer.schedule(new TimerTask() {
            @Override
            public void run() {
//                    Toast.makeText(getActivity(),"选人2",Toast.LENGTH_SHORT).show();
                //请求接口，是否有学生提交了答案!!!!!!！！！！！！！！！！！！！！！！
                getStuAnswer();
                //学生提交了答案
                if(stuAnswer_selected != null && stuAnswer_selected.length() > 0){
                    System.out.println("学生答案222222！！！！！！！！！！！！！！！！！！！！！！！！" + stuAnswer_selected);
                    mTimer.cancel();
                    getActivity().runOnUiThread(new Runnable() {
                        public void run() {  //|| isClick_btClose == false
                            if (txModle_luru.isSelected()) { //主观题，激活”点赞“，不激活”设置答案“
                                btSingle.setTextColor(Color.parseColor("#FFFFFFFF"));
                                btAnswers.setTextColor(Color.parseColor("#80000000"));
                                btSingle.setBackground(getResources().getDrawable((R.drawable.btn_begin_enable)));
                                btAnswers.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                            } else { //客观题，激活”点赞“”设置答案“
                                btSingle.setTextColor(Color.parseColor("#FFFFFFFF"));
                                btAnswers.setTextColor(Color.parseColor("#FFFFFFFF"));
                                btSingle.setBackground(getResources().getDrawable((R.drawable.btn_begin_enable)));
                                btAnswers.setBackground(getResources().getDrawable((R.drawable.btn_begin_enable)));
                            }
                            jishiqi.stop();   //停止计时
                            //主观题：答案弹窗 ， 客观题：直接答案回显
                            if(txModle_luru.isSelected()){
                                tx_tishi.setTextColor(Color.parseColor("#555D6D"));
                                tx_tishi.setText("点击此处查看答案");
                                //自动弹出学生答案
                                View view_stuAnswer = View.inflate(getActivity() , R.layout.suiji_qiangda_stuanswer , null);
                                //显示随机或抢答学生的答案
                                showPopupWindow_suiji_qiangda_stuAnswer(view_stuAnswer);
                            }else{
                                tx_tishi.setTextColor(Color.parseColor("#ffe600"));
                                tx_tishi.setText(stuAnswer_selected);
                            }

                            if (answer_sq != null && answer_sq.length() > 0 && stuAnswer_selected.equals(answer_sq)) {
                                //学生回答正确
                                img_zan.setVisibility(View.VISIBLE);
                            } else { //未设置答案或学生答案错误
                                img_zan.setVisibility(View.INVISIBLE);
                            }
                        }
                    });
                }
            }
        } , 800 , 800);
    }


    //调取接口，请求学生答案
    private void getStuAnswer(){
        new Thread(new Runnable() {
            @Override
            public void run() {
                AnswerActivityTea.answer_sjOrQd = "";
                Http_HuDongActivityTea.getSjOrQdAnswer();
                if(AnswerActivityTea.answer_sjOrQd != null && AnswerActivityTea.answer_sjOrQd.length() > 0){
                    suiji_qiangda_flag = 2; //学生发送了答案
                    stuAnswer_selected = AnswerActivityTea.answer_sjOrQd;
                    System.out.println("学生答案11111！！！！！！！！！！！！！！！！！！！！！！！！" + stuAnswer_selected);
                }
            }
        }).start();
    }

    /**
     * 设备类型判断
     *
     * @param context 上下文
     * @return true表示设备为平板 false表示设备为手机
     */
    public boolean isTabletDevice() {
        return (getActivity().getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK)>= Configuration.SCREENLAYOUT_SIZE_LARGE;
    }


    //显示已选择学生信息
    private void showSelectedStu(View view_selectStu){
        System.out.println("显示学生信息！！！！！！！！！！！！！！！！！！！！！！！！");
        //Android禁止在非UI线程更新UI
        getActivity().runOnUiThread(new Runnable() {
            public void run() {
                if(pw_selectStu != null){
                    System.out.println("显示学生信息11111！！！！！！！！！！！！！！！！！！！！！！！！");
                    suiji_qiangda_flag = 1;
                    pw_selectStu.dismiss();
                }
                pw_selectStu = null;
                System.out.println("显示学生信息222222！！！！！！！！！！！！！！！！！！！！！！！！");
                getScreenProps();
                //将popupWindow将要展示的弹窗内容view放入popupWindow中
                if(screenWidth <= 0){
                    getScreenProps();
                }
                pw_selectStu = new PopupWindow(view_selectStu , (int)(screenWidth * 0.17) , (int)(screenWidth * 0.17) , false);
//                pw_selectStu = new PopupWindow(view_selectStu , 200, 200, false);
                //弹框展示在屏幕中间Gravity.CENTER,x和y是相对于Gravity.CENTER的偏移
//                pw_selectStu.showAtLocation(view_selectStu , Gravity.TOP | Gravity.RIGHT , (int)(screenWidth * 0.26) , (int)(screenHeight * 0.47));
//                pw_selectStu.showAsDropDown(btSingle , -(pw_selectStu.getWidth() + 35) , 0);

                float scale = getActivity().getResources().getDisplayMetrics().density;
                int pw_width = 0;
                if(isTabletDevice()){ //平板
                    pw_width = (int)(screenWidth * 0.25);
                }else{ //手机
                    pw_width = (int) (160 * scale + 0.5f);
                }
                int pw_height = (int) (32 * scale + 0.5f) + (int)(screenHeight * 0.07) + 20;
                pw_selectStu.showAtLocation(view_selectStu , Gravity.RIGHT | Gravity.BOTTOM , pw_width , pw_height);
//                pw_selectStu.showAtLocation(view_selectStu , Gravity.RIGHT | Gravity.BOTTOM , (int)(screenWidth * 0.2) , 200);

                img_zan = view_selectStu.findViewById(R.id.img_zan);
                if(answer_sq != null && answer_sq.length() > 0 && stuAnswer_selected.equals(answer_sq)){
                    //学生回答正确
                    img_zan.setVisibility(View.VISIBLE);
                }else{ //未设置答案或学生答案错误
                    img_zan.setVisibility(View.INVISIBLE);
                }

                tx_stuname = view_selectStu.findViewById(R.id.tx_stu_name);
                tx_stuname.setText(stuName_selected);

                tx_tishi = view_selectStu.findViewById(R.id.tx_tishi);
                if(txModle_luru.isSelected()){
                    tx_tishi.setTextColor(Color.parseColor("#555D6D"));
                    if(suiji_qiangda_flag == 2 || stuAnswer_selected.length() > 0){
                        tx_tishi.setText("点击此处查看答案");
                    }else{
                        tx_tishi.setText("请回答问题");
                    }
                }else{
                    if(suiji_qiangda_flag == 2 || stuAnswer_selected.length() > 0){
                        tx_tishi.setTextColor(Color.parseColor("#ffe600"));
                        tx_tishi.setText(stuAnswer_selected);
                    }else{
                        tx_tishi.setTextColor(Color.parseColor("#555D6D"));
                        tx_tishi.setText("请回答问题");
                    }
                }


                tx_tishi.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View view) {
                        if(txModle_luru.isSelected()){
                            if(suiji_qiangda_flag == 2 || stuAnswer_selected.length() > 0){
//                            Toast.makeText(getActivity(),"点击了查看答案",Toast.LENGTH_SHORT).show();
                                View view_stuAnswer = View.inflate(getActivity() , R.layout.suiji_qiangda_stuanswer , null);
                                //显示随机或抢答学生的答案
                                showPopupWindow_suiji_qiangda_stuAnswer(view_stuAnswer);
                            }
                        }
                    }
                });
            }
        });
    }

    //显示随机或抢答学生的答案
    private void showPopupWindow_suiji_qiangda_stuAnswer(View v){
        if(pw_selectStuAnswer != null){
            suiji_qiangda_flag = 2;
            pw_selectStuAnswer.dismiss();
            pw_selectStuAnswer = null;
        }
        if(screenWidth <= 0){
            getScreenProps();
        }
        pw_selectStuAnswer = new PopupWindow(v , (int)(screenWidth * 0.7) , (int)(screenHeight * 0.8) , false);
        pw_selectStuAnswer.showAtLocation(v , Gravity.CENTER , 0 , 0);

        LinearLayout linear_webview = v.findViewById(R.id.linear_webview);
        linear_webview.removeAllViews();

        WebView answer_webView = new WebView(getActivity());
        LinearLayout.LayoutParams webView_params = new LinearLayout.LayoutParams(
                LinearLayout.LayoutParams.MATCH_PARENT,
                LinearLayout.LayoutParams.MATCH_PARENT);
        answer_webView.setLayoutParams(webView_params);

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) { //不安全站点资源http等
            answer_webView.getSettings().setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);
        }
        answer_webView.getSettings().setBlockNetworkImage(false); //解除数据阻止
        answer_webView.setHorizontalScrollBarEnabled(false);  //不显示水平滚动条
        answer_webView.setVerticalScrollBarEnabled(false);//不显示垂直滚动条

        answer_webView.getSettings().setUseWideViewPort(true);//设定支持 viewport
        answer_webView.getSettings().setLoadWithOverviewMode(true);   //自适应屏幕  缩放至屏幕的大小
        answer_webView.getSettings().setBuiltInZoomControls(true);  //是否使用内置的缩放机制
        answer_webView.getSettings().setDisplayZoomControls(false); //隐藏缩放控件
        answer_webView.getSettings().setSupportZoom(true);//设定支持缩放
        answer_webView.getSettings().setDefaultTextEncodingName("UTF-8");

        String unEncodedHtml = stuAnswer_selected.toString();
        answer_webView.loadDataWithBaseURL(null , unEncodedHtml , "text/html",  "utf-8", null);

        linear_webview.addView(answer_webView);

        TextView tx_who = v.findViewById(R.id.tx_who);
        tx_who.setText(stuName_selected);

        TextView tx_close = v.findViewById(R.id.tx_close);
        tx_close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                suiji_qiangda_flag = 2;
                pw_selectStuAnswer.dismiss();
            }
        });
    }


    //单选图标状态
    public void setDanxuanImgStatus_sq(){
        a_sq.setImageDrawable(getResources().getDrawable((R.mipmap.a)));
        b_sq.setImageDrawable(getResources().getDrawable((R.mipmap.b)));
        c_sq.setImageDrawable(getResources().getDrawable((R.mipmap.c)));
        d_sq.setImageDrawable(getResources().getDrawable((R.mipmap.d)));
        e_sq.setImageDrawable(getResources().getDrawable((R.mipmap.e)));
        f_sq.setImageDrawable(getResources().getDrawable((R.mipmap.f)));
        g_sq.setImageDrawable(getResources().getDrawable((R.mipmap.g)));
        h_sq.setImageDrawable(getResources().getDrawable((R.mipmap.h)));
        a_sq.setSelected(false);
        b_sq.setSelected(false);
        c_sq.setSelected(false);
        d_sq.setSelected(false);
        e_sq.setSelected(false);
        f_sq.setSelected(false);
        g_sq.setSelected(false);
        h_sq.setSelected(false);
    }


    //随机或抢答设置答案
    private void showPopupWindow_suiji_qiangda_setAnswer(View v){
        if(pw_setAnswer != null){
            pw_setAnswer.dismiss();
            pw_setAnswer = null;
        }
        if(screenWidth <= 0){
            getScreenProps();
        }
        pw_setAnswer = new PopupWindow(v , (int)(screenWidth * 0.45) , (int)(screenHeight * 0.4) , false);
//        pw_setAnswer = new PopupWindow(v , 800 , 400 , false);
        pw_setAnswer.showAtLocation(v , Gravity.CENTER , 0 , 0);

        ImageView img_close = v.findViewById(R.id.imgClose);
        img_close.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                pw_setAnswer.dismiss();
            }
        });

        //单选UI
        linear_danxuan_sq = v.findViewById(R.id.linearImg1);
        a_sq = v.findViewById(R.id.a);
        b_sq = v.findViewById(R.id.b);
        c_sq = v.findViewById(R.id.c);
        d_sq = v.findViewById(R.id.d);
        e_sq = v.findViewById(R.id.e);
        f_sq = v.findViewById(R.id.f);
        g_sq = v.findViewById(R.id.g);
        h_sq = v.findViewById(R.id.h);
        //多选UI
        linear_duoxuan_sq = v.findViewById(R.id.linearImg2);
        a1_sq = v.findViewById(R.id.a1);
        b1_sq = v.findViewById(R.id.b1);
        c1_sq = v.findViewById(R.id.c1);
        d1_sq = v.findViewById(R.id.d1);
        e1_sq = v.findViewById(R.id.e1);
        f1_sq = v.findViewById(R.id.f1);
        g1_sq = v.findViewById(R.id.g1);
        h1_sq = v.findViewById(R.id.h1);
        //判断UI
        linear_panduan_sq = v.findViewById(R.id.linearImg3);
        right_sq = v.findViewById(R.id.right);
        error_sq = v.findViewById(R.id.error);

        int count = chooseNum; //选项个数
//        Toast.makeText(getActivity(),"选项个数是" + count,Toast.LENGTH_SHORT).show();

        //2-4个选项
        LinearLayout.LayoutParams lps1 = new LinearLayout.LayoutParams(90, 90);
        lps1.setMargins(3 , 3 , 3 , 3);
        //5个选项
        LinearLayout.LayoutParams lps2 = new LinearLayout.LayoutParams(70, 70);
        lps2.setMargins(3 , 3 , 3 , 3);
        //6个选项
        LinearLayout.LayoutParams lps3 = new LinearLayout.LayoutParams(65, 65);
        lps3.setMargins(3 , 3 , 3 , 3);
        //7个选项
        LinearLayout.LayoutParams lps4 = new LinearLayout.LayoutParams(55, 55);
        lps4.setMargins(3 , 3 , 3 , 3);
        //8个选项
        LinearLayout.LayoutParams lps5 = new LinearLayout.LayoutParams(49, 49);
        lps5.setMargins(3 , 3 , 3 , 3);
        //单选(图标）
        if(txModle_danxuan.isSelected()){
            linear_danxuan_sq.setVisibility(View.VISIBLE);
            linear_duoxuan_sq.setVisibility(View.GONE);
            linear_panduan_sq.setVisibility(View.GONE);

            if(count == 2){
                a_sq.setLayoutParams(lps1);
                b_sq.setLayoutParams(lps1);
                c_sq.setVisibility(View.GONE);
                d_sq.setVisibility(View.GONE);
                e_sq.setVisibility(View.GONE);
                f_sq.setVisibility(View.GONE);
                g_sq.setVisibility(View.GONE);
                h_sq.setVisibility(View.GONE);
            }else if(count == 3){
                a_sq.setLayoutParams(lps1);
                b_sq.setLayoutParams(lps1);
                c_sq.setLayoutParams(lps1);
                d_sq.setVisibility(View.GONE);
                e_sq.setVisibility(View.GONE);
                f_sq.setVisibility(View.GONE);
                g_sq.setVisibility(View.GONE);
                h_sq.setVisibility(View.GONE);
            }else if(count == 4){
                a_sq.setLayoutParams(lps1);
                b_sq.setLayoutParams(lps1);
                c_sq.setLayoutParams(lps1);
                d_sq.setLayoutParams(lps1);
                e_sq.setVisibility(View.GONE);
                f_sq.setVisibility(View.GONE);
                g_sq.setVisibility(View.GONE);
                h_sq.setVisibility(View.GONE);
            }else if(count == 5){
                a_sq.setLayoutParams(lps2);
                b_sq.setLayoutParams(lps2);
                c_sq.setLayoutParams(lps2);
                d_sq.setLayoutParams(lps2);
                e_sq.setLayoutParams(lps2);
                f_sq.setVisibility(View.GONE);
                g_sq.setVisibility(View.GONE);
                h_sq.setVisibility(View.GONE);
            }else if(count == 6){
                a_sq.setLayoutParams(lps3);
                b_sq.setLayoutParams(lps3);
                c_sq.setLayoutParams(lps3);
                d_sq.setLayoutParams(lps3);
                e_sq.setLayoutParams(lps3);
                f_sq.setLayoutParams(lps3);
                g_sq.setVisibility(View.GONE);
                h_sq.setVisibility(View.GONE);
            }else if(count == 7){
                a_sq.setLayoutParams(lps4);
                b_sq.setLayoutParams(lps4);
                c_sq.setLayoutParams(lps4);
                d_sq.setLayoutParams(lps4);
                e_sq.setLayoutParams(lps4);
                f_sq.setLayoutParams(lps4);
                g_sq.setLayoutParams(lps4);
                h_sq.setVisibility(View.GONE);
            }else if(count == 8){
                a_sq.setLayoutParams(lps5);
                b_sq.setLayoutParams(lps5);
                c_sq.setLayoutParams(lps5);
                d_sq.setLayoutParams(lps5);
                e_sq.setLayoutParams(lps5);
                f_sq.setLayoutParams(lps5);
                g_sq.setLayoutParams(lps5);
                h_sq.setLayoutParams(lps5);
            }
        }
        //多选(图标）
        if(txModle_duoxuan.isSelected()){
            linear_danxuan_sq.setVisibility(View.GONE);
            linear_panduan_sq.setVisibility(View.GONE);
            linear_duoxuan_sq.setVisibility(View.VISIBLE);
            if(count == 2){
                a1_sq.setLayoutParams(lps1);
                b1_sq.setLayoutParams(lps1);
                c1_sq.setVisibility(View.GONE);
                d1_sq.setVisibility(View.GONE);
                e1_sq.setVisibility(View.GONE);
                f1_sq.setVisibility(View.GONE);
                g1_sq.setVisibility(View.GONE);
                h1_sq.setVisibility(View.GONE);
            }else if(count == 3){
                a1_sq.setLayoutParams(lps1);
                b1_sq.setLayoutParams(lps1);
                c1_sq.setLayoutParams(lps1);
                d1_sq.setVisibility(View.GONE);
                e1_sq.setVisibility(View.GONE);
                f1_sq.setVisibility(View.GONE);
                g1_sq.setVisibility(View.GONE);
                h1_sq.setVisibility(View.GONE);
            }else if(count == 4){
                a1_sq.setLayoutParams(lps1);
                b1_sq.setLayoutParams(lps1);
                c1_sq.setLayoutParams(lps1);
                d1_sq.setLayoutParams(lps1);
                e1_sq.setVisibility(View.GONE);
                f1_sq.setVisibility(View.GONE);
                g1_sq.setVisibility(View.GONE);
                h1_sq.setVisibility(View.GONE);
            }else if(count == 5){
                a1_sq.setLayoutParams(lps2);
                b1_sq.setLayoutParams(lps2);
                c1_sq.setLayoutParams(lps2);
                d1_sq.setLayoutParams(lps2);
                e1_sq.setLayoutParams(lps2);
                f1_sq.setVisibility(View.GONE);
                g1_sq.setVisibility(View.GONE);
                h1_sq.setVisibility(View.GONE);
            }else if(count == 6){
                a1_sq.setLayoutParams(lps3);
                b1_sq.setLayoutParams(lps3);
                c1_sq.setLayoutParams(lps3);
                d1_sq.setLayoutParams(lps3);
                e1_sq.setLayoutParams(lps3);
                f1_sq.setLayoutParams(lps3);
                g1_sq.setVisibility(View.GONE);
                h1_sq.setVisibility(View.GONE);
            }else if(count == 7){
                a1_sq.setLayoutParams(lps4);
                b1_sq.setLayoutParams(lps4);
                c1_sq.setLayoutParams(lps4);
                d1_sq.setLayoutParams(lps4);
                e1_sq.setLayoutParams(lps4);
                f1_sq.setLayoutParams(lps4);
                g1_sq.setLayoutParams(lps4);
                h1_sq.setVisibility(View.GONE);
            }else if(count == 8){
                a1_sq.setLayoutParams(lps5);
                b1_sq.setLayoutParams(lps5);
                c1_sq.setLayoutParams(lps5);
                d1_sq.setLayoutParams(lps5);
                e1_sq.setLayoutParams(lps5);
                f1_sq.setLayoutParams(lps5);
                g1_sq.setLayoutParams(lps5);
                h1_sq.setLayoutParams(lps5);
            }
        }
        //判断(图标）
        if(txModle_panduan.isSelected()){
            linear_danxuan_sq.setVisibility(View.GONE);
            linear_duoxuan_sq.setVisibility(View.GONE);
            linear_panduan_sq.setVisibility(View.VISIBLE);
        }

        //点击事件（单选）
        a_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                a_sq.setSelected(true);
                a_sq.setImageDrawable(getResources().getDrawable((R.mipmap.a_select)));
            }
        });
        b_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                b_sq.setSelected(true);
                b_sq.setImageDrawable(getResources().getDrawable((R.mipmap.b_select)));
            }
        });
        c_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                c_sq.setSelected(true);
                c_sq.setImageDrawable(getResources().getDrawable((R.mipmap.c_select)));
            }
        });
        d_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                d_sq.setSelected(true);
                d_sq.setImageDrawable(getResources().getDrawable((R.mipmap.d_select)));
            }
        });
        e_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                e_sq.setSelected(true);
                e_sq.setImageDrawable(getResources().getDrawable((R.mipmap.e_select)));
            }
        });
        f_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                f_sq.setSelected(true);
                f_sq.setImageDrawable(getResources().getDrawable((R.mipmap.f_select)));
            }
        });
        g_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                g_sq.setSelected(true);
                g_sq.setImageDrawable(getResources().getDrawable((R.mipmap.g_select)));
            }
        });
        h_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setDanxuanImgStatus_sq();
                h_sq.setSelected(true);
                h_sq.setImageDrawable(getResources().getDrawable((R.mipmap.h_select)));
            }
        });
        //点击事件（多选）
        a1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //判断当前imageView是否为某一图片（可用来判断imageview是否被选中）
                if((a1_sq.getDrawable().getCurrent().getConstantState()).equals(
                        ContextCompat.getDrawable(getActivity(), R.mipmap.ad_select).getConstantState())
                ) {
                    a1_sq.setSelected(false);
                    a1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.ad)));
                }else {
                    a1_sq.setSelected(true);
                    a1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.ad_select)));
                }

            }
        });
        b1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((b1_sq.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.bd_select).getConstantState())){
                    b1_sq.setSelected(false);
                    b1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.bd)));
                }else{
                    b1_sq.setSelected(true);
                    b1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.bd_select)));
                }
            }
        });
        c1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((c1_sq.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.cd_select).getConstantState())){
                    c1_sq.setSelected(false);
                    c1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.cd)));
                }else{
                    c1_sq.setSelected(true);
                    c1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.cd_select)));
                }
            }
        });
        d1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((d1_sq.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.dd_select).getConstantState())){
                    d1_sq.setSelected(false);
                    d1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.dd)));
                }else{
                    d1_sq.setSelected(true);
                    d1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.dd_select)));
                }
            }
        });
        e1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((e1_sq.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.ed_select).getConstantState())){
                    e1_sq.setSelected(false);
                    e1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.ed)));
                }else{
                    e1_sq.setSelected(true);
                    e1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.ed_select)));
                }
            }
        });
        f1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((f1_sq.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.fd_select).getConstantState())){
                    f1_sq.setSelected(false);
                    f1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.fd)));
                }else{
                    f1_sq.setSelected(true);
                    f1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.fd_select)));
                }
            }
        });
        g1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((g1_sq.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.gd_select).getConstantState())){
                    g1_sq.setSelected(false);
                    g1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.gd)));
                }else{
                    g1_sq.setSelected(true);
                    g1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.gd_select)));
                }
            }
        });
        h1_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if((h1_sq.getDrawable().getCurrent().getConstantState()).equals(ContextCompat.getDrawable(getActivity(), R.mipmap.hd_select).getConstantState())){
                    h1_sq.setSelected(false);
                    h1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.hd)));
                }else{
                    h1_sq.setSelected(true);
                    h1_sq.setImageDrawable(getResources().getDrawable((R.mipmap.hd_select)));
                }
            }
        });
        //点击事件（判断）
        right_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                right_sq.setSelected(true);
                error_sq.setSelected(false);
                right_sq.setImageDrawable(getResources().getDrawable((R.mipmap.right_select)));
                error_sq.setImageDrawable(getResources().getDrawable((R.mipmap.error)));
            }
        });
        error_sq.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                right_sq.setSelected(false);
                error_sq.setSelected(true);
                right_sq.setImageDrawable(getResources().getDrawable((R.mipmap.right)));
                error_sq.setImageDrawable(getResources().getDrawable((R.mipmap.error_select)));
            }
        });

        Button bt_save = v.findViewById(R.id.btSave);
        bt_save.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(txModle_danxuan.isSelected()){
                    answer_sq = "";
                    if(a_sq.isSelected()){
                        answer_sq = "A";
                    }else if(b_sq.isSelected()){
                        answer_sq = "B";
                    }else if(c_sq.isSelected()){
                        answer_sq = "C";
                    }else if(d_sq.isSelected()){
                        answer_sq = "D";
                    }else if(e_sq.isSelected()){
                        answer_sq = "E";
                    }else if(f_sq.isSelected()){
                        answer_sq = "F";
                    }else if(g_sq.isSelected()){
                        answer_sq = "G";
                    }else if(h_sq.isSelected()){
                        answer_sq = "H";
                    }else{
                        answer_sq = "";
                    }
//                    Toast.makeText(getActivity(),"单选答案是：" + answer_sq,Toast.LENGTH_SHORT).show();
                }else if(txModle_duoxuan.isSelected()){
                    answer_sq = "";
                    if(a1_sq.isSelected()){ answer_sq = answer_sq + "A"; }
                    if(b1_sq.isSelected()){ answer_sq = answer_sq + "B"; }
                    if(c1_sq.isSelected()){ answer_sq = answer_sq + "C"; }
                    if(d1_sq.isSelected()){ answer_sq = answer_sq + "D"; }
                    if(e1_sq.isSelected()){ answer_sq = answer_sq + "E"; }
                    if(f1_sq.isSelected()){ answer_sq = answer_sq + "F"; }
                    if(g1_sq.isSelected()){ answer_sq = answer_sq + "G"; }
                    if(h1_sq.isSelected()){ answer_sq = answer_sq + "H"; }
//                    Toast.makeText(getActivity(),"多选答案是：" + answer_sq,Toast.LENGTH_SHORT).show();
                }else if(txModle_panduan.isSelected()){
                    answer_sq = "";
                    if(right_sq.isSelected()){
                        answer_sq = "对";
                    }else if(error_sq.isSelected()){
                        answer_sq = "错";
                    }else{
                        answer_sq = "";
                    }
//                    Toast.makeText(getActivity(),"判断答案是：" + answer_sq,Toast.LENGTH_SHORT).show();
                }

                if(answer_sq.length() > 0){
                    if((txModle_duoxuan.isSelected() && answer_sq.length() >= 2)
                            || txModle_panduan.isSelected()
                            || txModle_danxuan.isSelected()
                    ){
                        setAnswer_sq(AnswerActivityTea.currentketangId);
                        //当前线程暂停wait 500ms
                        synchronized (Thread.currentThread()){
                            try {
                                Thread.currentThread().wait(500);
                            } catch (InterruptedException ex) {
                                ex.printStackTrace();
                            }
                        }
                        System.out.println("设置完答案了！！！！！！！");
                        if(setAnswer_status_sq){
                            Toast.makeText(getActivity(),"答案设置成功",Toast.LENGTH_SHORT).show();
                            suiji_qiangda_flag = 3;
                            pw_setAnswer.dismiss(); //关掉“设置答案”页面的popupwindow
                            //调取设置答案接口！！！！！！！！！！！！！！！
                            if(answer_sq.equals(stuAnswer_selected)){
                                img_zan.setVisibility(View.VISIBLE);
                            }else{
                                img_zan.setVisibility(View.INVISIBLE);
                            }
                            Toast.makeText(getActivity(),"答案是" + answer_sq ,Toast.LENGTH_SHORT).show();
                        }else{
                            answer_sq = "";
                            Toast.makeText(getActivity(),"答案设置失败",Toast.LENGTH_SHORT).show();
                        }
                    }else{
                        Toast.makeText(getActivity(),"请设置答案",Toast.LENGTH_SHORT).show();
                    }
                }else{
                    Toast.makeText(getActivity(),"请设置答案",Toast.LENGTH_SHORT).show();
                }
            }
        });
    }

    //设置客观题答案（随机或抢答）
    private void setAnswer_sq(String ketangId){
        new Thread(new Runnable() {
            @Override
            public void run() {
                setAnswer_status_sq = Http_HuDongActivityTea.setAnswer(ketangId , answer_sq);
            }
        }).start();
    }

    //显示选项数弹框
    private void showChooseNum_pw(View v){
        View chooseNum_list = View.inflate(getActivity() , R.layout.choosenum_list , null);
        pw_chooseNum = new PopupWindow(chooseNum_list , v.getWidth() , v.getHeight() * 7 , true);
        pw_chooseNum.showAsDropDown(v , 0 , 0);

        tx_2 = chooseNum_list.findViewById(R.id.tx_2);
        tx_2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setChooseStatus();
                tx_2.setBackgroundColor(Color.parseColor("#FFBB86FC"));
                tx_choosenum.setText("2");
                chooseNum = 2;
//                Toast.makeText(getActivity(),"选项个数" + chooseNum,Toast.LENGTH_SHORT).show();
                pw_chooseNum.dismiss();
            }
        });
        tx_3 = chooseNum_list.findViewById(R.id.tx_3);
        tx_3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setChooseStatus();
                tx_3.setBackgroundColor(Color.parseColor("#FFBB86FC"));
                chooseNum = 3;
//                Toast.makeText(getActivity(),"选项个数" + chooseNum,Toast.LENGTH_SHORT).show();
                tx_choosenum.setText("3");
                pw_chooseNum.dismiss();
            }
        });
        tx_4 = chooseNum_list.findViewById(R.id.tx_4);
        tx_4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setChooseStatus();
                tx_4.setBackgroundColor(Color.parseColor("#FFBB86FC"));
                chooseNum = 4;
//                Toast.makeText(getActivity(),"选项个数" + chooseNum,Toast.LENGTH_SHORT).show();
                tx_choosenum.setText("4");
                pw_chooseNum.dismiss();
            }
        });
        tx_5 = chooseNum_list.findViewById(R.id.tx_5);
        tx_5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setChooseStatus();
                tx_5.setBackgroundColor(Color.parseColor("#FFBB86FC"));
                tx_choosenum.setText("5");
                chooseNum = 5;
//                Toast.makeText(getActivity(),"选项个数" + chooseNum,Toast.LENGTH_SHORT).show();
                pw_chooseNum.dismiss();
            }
        });
        tx_6 = chooseNum_list.findViewById(R.id.tx_6);
        tx_6.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setChooseStatus();
                tx_6.setBackgroundColor(Color.parseColor("#FFBB86FC"));
                tx_choosenum.setText("6");
                chooseNum = 6;
//                Toast.makeText(getActivity(),"选项个数" + chooseNum,Toast.LENGTH_SHORT).show();
                pw_chooseNum.dismiss();
            }
        });
        tx_7 = chooseNum_list.findViewById(R.id.tx_7);
        tx_7.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setChooseStatus();
                tx_7.setBackgroundColor(Color.parseColor("#FFBB86FC"));
                tx_choosenum.setText("7");
                chooseNum = 7;
//                Toast.makeText(getActivity(),"选项个数" + chooseNum,Toast.LENGTH_SHORT).show();
                pw_chooseNum.dismiss();
            }
        });
        tx_8 = chooseNum_list.findViewById(R.id.tx_8);
        tx_8.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                setChooseStatus();
                tx_8.setBackgroundColor(Color.parseColor("#FFBB86FC"));
                tx_choosenum.setText("8");
                chooseNum = 8;
//                Toast.makeText(getActivity(),"选项个数" + chooseNum,Toast.LENGTH_SHORT).show();
                pw_chooseNum.dismiss();
            }
        });

        setChooseStatus();
        if(chooseNum == 2){
            tx_2.setBackgroundColor(Color.parseColor("#FFBB86FC"));
        }else if(chooseNum == 3){
            tx_3.setBackgroundColor(Color.parseColor("#FFBB86FC"));
        }else if(chooseNum == 4){
            tx_4.setBackgroundColor(Color.parseColor("#FFBB86FC"));
        }else if(chooseNum == 5){
            tx_5.setBackgroundColor(Color.parseColor("#FFBB86FC"));
        }else if(chooseNum == 6){
            tx_6.setBackgroundColor(Color.parseColor("#FFBB86FC"));
        }else if(chooseNum == 7){
            tx_7.setBackgroundColor(Color.parseColor("#FFBB86FC"));
        }else if(chooseNum == 8){
            tx_8.setBackgroundColor(Color.parseColor("#FFBB86FC"));
        }
    }

    //设置选项数item状态
    private void setChooseStatus(){
        tx_2.setBackgroundColor(Color.parseColor("#FFFFFF"));
        tx_3.setBackgroundColor(Color.parseColor("#FFFFFF"));
        tx_4.setBackgroundColor(Color.parseColor("#FFFFFF"));
        tx_5.setBackgroundColor(Color.parseColor("#FFFFFF"));
        tx_6.setBackgroundColor(Color.parseColor("#FFFFFF"));
        tx_7.setBackgroundColor(Color.parseColor("#FFFFFF"));
        tx_8.setBackgroundColor(Color.parseColor("#FFFFFF"));
    }


    //轮训，每隔1s获取已做答学生人数
    private void getSubmitAnswerStuNum(){
        if(mTimer_stuNum != null){
            mTimer_stuNum.cancel();
            mTimer_stuNum = null;
        }

        //延迟delay毫秒后，执行第一次task，然后每隔period毫秒执行一次task
        mTimer_stuNum = new Timer();
        mTimer_stuNum.schedule(new TimerTask() {
            @Override
            public void run() {
                System.out.println("获取已做答学生人数！！！！！！！！！！！！！！！！！！！！！！！！");
                Http_HuDongActivityTea.getSubmitAnswerStuNum(); //调接口
                getActivity().runOnUiThread(new Runnable() {
                    public void run() {
                        int stuNum = AnswerActivityTea.answerNum;
                        initJoinClassInformation();
                        int allNum = getJoinClassAllStuNum();
                        tx_answers_sum.setText(stuNum + "/" + allNum + "位同学已提交");
                    }
                });
            }
        } , 1000 , 1000);
    }

    //点击开始按钮，生成uuid（answerQuestionId）、全局变量重新初始化
    private void initData(){
        chooseNum = Integer.valueOf((String) tx_choosenum.getText());
        suiji_qiangda_flag = 0;
        if(mTimer != null){
            mTimer.cancel();
            mTimer = null;
        }else{
            mTimer = null;
        }
        if(mTimer_stuNum != null){
            mTimer_stuNum.cancel();
            mTimer_stuNum = null;
        }else{
            mTimer_stuNum = null;
        }
        answer = "";
        setAnswer_status = false;
        answer_sq = "";
        setAnswer_status_sq = false;
        isSelect_huizong = true;
        selectedIndex = 0;
        selectStuAnswerIndex = 0;
        stuName_selected = "";
        stuId_selected = "";
        stuAnswer_selected = "";
    }

    //请求接口2 开始答题、结束答题等
    private void beginOrEndQueAction(String actionName){
        System.out.println("开始请求接口2，动作类型是!!!!!!!!!!!: " + actionName);
        new Thread(new Runnable() {
            @Override
            public void run() {
                if(actionName.indexOf("start") >= 0 && !actionName.equals("startAnswerQiangDa")){
                    getUUID();//获取uuid
                    getActivity().runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            MainActivity_tea activity = (MainActivity_tea) getActivity();
                            activity.ScreenShotBoard(getContext(),AnswerActivityTea.answerQuestionId,activity.getmBoard());
                        }
                    });
                }
                int questionAnswerType = 0;  //答题类型
                if(txType_tiwen.isSelected()){
                    questionAnswerType = 1;
                }else if(txType_suiji.isSelected()){
                    questionAnswerType = 2;
                }else if(txType_qiangda.isSelected()){
                    questionAnswerType = 3;
                }

                int questionSubNum = chooseNum; //选项个数

                int questionBaseTypeId = 101; //试题基类型
                if(txModle_danxuan.isSelected()){
                    questionBaseTypeId = 101;
                }else if(txModle_duoxuan.isSelected()){
                    questionBaseTypeId = 102;
                }else if(txModle_panduan.isSelected()){
                    questionBaseTypeId = 103;
                }else if(txModle_luru.isSelected()){
                    questionBaseTypeId = 104;
                }

                String questionAction = actionName; //答题动作
                //请求接口2
                AnswerActivityTea.isSuccess = Http_HuDongActivityTea.saveQueHdAction(
                        questionAnswerType ,
                        questionSubNum ,
                        questionBaseTypeId ,
                        questionAction,
                        AnswerActivityTea.answerQuestionId
                );
            }
        }).start();
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
//        handleSSLHandshake();

        // 设置布局文件
        View contentView = inflater.inflate(R.layout.answer_question, container, false);
        FcontentView = contentView;

        txType_tiwen = (TextView) contentView.findViewById(R.id.txt_tiwen);
        txType_suiji = (TextView) contentView.findViewById(R.id.txt_suiji);
        txType_qiangda = (TextView) contentView.findViewById(R.id.txt_qiangda);

        img_tiwen = (ImageView) contentView.findViewById(R.id.img_tiwen);
        img_suiji = (ImageView) contentView.findViewById(R.id.img_suiji);
        img_qiangda = (ImageView) contentView.findViewById(R.id.img_qiangda);

        txModle_danxuan = (TextView) contentView.findViewById(R.id.txt_danxuan);
        txModle_duoxuan = (TextView) contentView.findViewById(R.id.txt_duoxuan);
        txModle_panduan = (TextView) contentView.findViewById(R.id.txt_panduan);
        txModle_luru = (TextView) contentView.findViewById(R.id.txt_luru);

        imgdanxuan = (ImageView) contentView.findViewById(R.id.imgdanxuan);
        imgduoxuan = (ImageView) contentView.findViewById(R.id.imgduoxuan);
        imgpanduan = (ImageView) contentView.findViewById(R.id.imgpanduan);
        imgluru = (ImageView) contentView.findViewById(R.id.imgluru);

//        spinner = (TextView) contentView.findViewById(R.id.tx_choosenum);
        linear_choose = (LinearLayout) contentView.findViewById(R.id.linear_choose);
        txChoose = (TextView) contentView.findViewById(R.id.txChoose);
        tx_choosenum = (TextView) contentView.findViewById(R.id.tx_choosenum);
        img_choose = (ImageView) contentView.findViewById(R.id.img_choose);

        linear_choose.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //                Toast.makeText(getActivity(),"选择选项个数",Toast.LENGTH_SHORT).show();
                if(pw_chooseNum != null && pw_chooseNum.isShowing()){
                    pw_chooseNum.dismiss();
                }else{
                    showChooseNum_pw(view);
                }
            }
        });

//        img_choose.setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
////                Toast.makeText(getActivity(),"选择选项个数",Toast.LENGTH_SHORT).show();
//                if(pw_chooseNum != null && pw_chooseNum.isShowing()){
//                    pw_chooseNum.dismiss();
//                }else{
//                    showChooseNum_pw(view);
//                }
//            }
//        });

        jishiqi = (Chronometer) contentView.findViewById(R.id.id_jishiqi);
        tx_answers_sum = (TextView) contentView.findViewById(R.id.tx_answers_sum);

        btBegin1 = (Button) contentView.findViewById(R.id.btBegin1);
        btBegin2 = (Button) contentView.findViewById(R.id.btBegin2);

        btBegin2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                initData();
//                answer = "";
//                answer_sq = "";
//                chooseNum = Integer.valueOf((String) tx_choosenum.getText());
                btBegin2.setVisibility(View.GONE);
                linear1.setVisibility(View.VISIBLE);
                linear2.setVisibility(View.VISIBLE);
                if(txType_tiwen.isSelected()){
                    if(txModle_luru.isSelected() || imgluru.isSelected()){
                        btSingle.setText("答案内容");
                    }else{
                        btSingle.setText("单题详情");
                    }
                    btAnswers.setText("答题详情");
                    btEnd.setText("结束作答");
                    btClosed.setText("关闭提问");

                    btSingle.setTextColor(Color.parseColor("#FFFFFFFF"));
                    btAnswers.setTextColor(Color.parseColor("#FFFFFFFF"));
                    btEnd.setTextColor(Color.parseColor("#FFFFFFFF"));
                    btSingle.setBackground(getResources().getDrawable((R.drawable.btn_begin_enable)));
                    btAnswers.setBackground(getResources().getDrawable((R.drawable.btn_begin_enable)));
                    btEnd.setBackground(getResources().getDrawable((R.drawable.btn_begin_enable)));

                    tx_answers_sum.setVisibility(View.VISIBLE);
                    tx_answers_sum.setText("0/60位同学已提交");
                    jishiqi.setVisibility(View.VISIBLE);
                    jishiqi.setBase(SystemClock.elapsedRealtime());  //设置起始时间 ，这里是从0开始
                    jishiqi.start();   //开始计时

                    //调开始答题接口，“提问开始答题”
                    beginOrEndQueAction("startAnswer");

                    //开启轮训任务，每隔1s获取已做答学生人数
                    getSubmitAnswerStuNum();
                }else if(txType_suiji.isSelected()){
                    //调开始答题接口，“开始随机作答”
                    beginOrEndQueAction("startAnswerSuiji");

                    btSingle.setText("点赞");
                    btAnswers.setText("设置答案");
                    btEnd.setText("重新随机");
                    btClosed.setText("关闭随机");
                    tx_answers_sum.setVisibility(View.VISIBLE);
                    tx_answers_sum.setText("学生正在随机中");
                    jishiqi.setVisibility(View.INVISIBLE);
                    //点赞、设置答案、重新随机不可点
                    btSingle.setTextColor(Color.parseColor("#80000000"));
                    btAnswers.setTextColor(Color.parseColor("#80000000"));
                    btEnd.setTextColor(Color.parseColor("#80000000"));
                    btSingle.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                    btAnswers.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                    btEnd.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));

                    View view_selectStu = LayoutInflater.from(getActivity()).inflate(R.layout.suiji_qiangda_selectstu, null, false);
                    //开启轮训任务，获取随机/抢答学生信息
                    getSuijiOrQiangdaStu(view_selectStu);
                }else if(txType_qiangda.isSelected()){
                    //调开始答题接口，“开始抢答”
                    beginOrEndQueAction("startQiangDa");

                    btSingle.setText("点赞");
                    btAnswers.setText("设置答案");
                    btEnd.setText("重新抢答");
                    btClosed.setText("关闭抢答");
                    tx_answers_sum.setVisibility(View.VISIBLE);
                    tx_answers_sum.setText("学生正在抢答中");
                    jishiqi.setVisibility(View.INVISIBLE);
                    //点赞、设置答案、重新随机不可点
                    btSingle.setTextColor(Color.parseColor("#80000000"));
                    btAnswers.setTextColor(Color.parseColor("#80000000"));
                    btEnd.setTextColor(Color.parseColor("#80000000"));
                    btSingle.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                    btAnswers.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                    btEnd.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));

//                    isClick_btClose = false;
//                    Toast.makeText(getActivity(),"开始抢答",Toast.LENGTH_SHORT).show();
                    View view_selectStu = LayoutInflater.from(getActivity()).inflate(R.layout.suiji_qiangda_selectstu, null, false);
                    //开启轮训任务，获取随机/抢答学生信息
                    getSuijiOrQiangdaStu(view_selectStu);
                }
            }
        });

        linear1 = (LinearLayout) contentView.findViewById(R.id.linear1);
        linear2 = (LinearLayout) contentView.findViewById(R.id.linear2);

        btSingle = (Button) contentView.findViewById(R.id.btSingle);
        btAnswers = (Button) contentView.findViewById(R.id.btAnswers);
        btEnd = (Button) contentView.findViewById(R.id.btEnd);
        btClosed = (Button) contentView.findViewById(R.id.btClosed);

        //单题分析（客观题）、答案内容（主观题）
        btSingle.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                View view = inflater.inflate(R.layout.single_question_analysis , null , false);
                if(txType_tiwen.isSelected()){
                    if(!imgluru.isSelected()){ //客观题：单选、多选、判断
                        View view = LayoutInflater.from(getActivity()).inflate(R.layout.single_question_analysis, null, false);
                        showPopupWindow(view , 1);
                    }else{ //主观题：录入
                        View view = LayoutInflater.from(getActivity()).inflate(R.layout.luru_question_analysis, null, false);
                        showPopupWindow_luru(view , 1);
                    }
                }else{
                    //学生回答题目之后激活设置答案、点赞
                    if(stuAnswer_selected.length() > 0) {
                        //主观题点赞
                        if (txModle_luru.isSelected()) {
                            img_zan.setVisibility(View.VISIBLE); //显示点赞图标
                        } else {//客观题点赞
                            answer_sq = stuAnswer_selected;
                            //调取设置答案接口！！！！！！！！！！！！！！！
                            setAnswer_sq(AnswerActivityTea.currentketangId);
                            //当前线程暂停wait 500ms
                            synchronized (Thread.currentThread()){
                                try {
                                    Thread.currentThread().wait(500);
                                } catch (InterruptedException ex) {
                                    ex.printStackTrace();
                                }
                            }
                            System.out.println("设置完答案了！！！！！！！");
                            if(setAnswer_status_sq){
                                Toast.makeText(getActivity(),"答案设置成功",Toast.LENGTH_SHORT).show();
                                suiji_qiangda_flag = 3;
                                if(answer_sq.equals(stuAnswer_selected)){
                                    img_zan.setVisibility(View.VISIBLE);
                                }else{
                                    img_zan.setVisibility(View.INVISIBLE);
                                }
                                Toast.makeText(getActivity(),"答案是" + answer_sq ,Toast.LENGTH_SHORT).show();
                            }else{
                                answer_sq = "";
                                Toast.makeText(getActivity(),"答案设置失败",Toast.LENGTH_SHORT).show();
                            }
                        }
                    }else{
                        Toast.makeText(getActivity(),"学生还未回答问题",Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });
        //答题详情（主客观题）
        btAnswers.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
//                View view = inflater.inflate(R.layout.single_question_analysis , null , false);
                if(txType_tiwen.isSelected()){
                    if(!imgluru.isSelected()) { //客观题：单选、多选、判断
                        View view = LayoutInflater.from(getActivity()).inflate(R.layout.single_question_analysis, null, false);
                        showPopupWindow(view, 2);
                    }else{  //主观题：录入
                        View view = LayoutInflater.from(getActivity()).inflate(R.layout.luru_question_analysis, null, false);
                        showPopupWindow_luru(view , 2);
                    }
                }else{
                    //主观题不激活设置答案
                    if(!txModle_luru.isSelected() || !imgluru.isSelected()){
                        //学生回答题目之后激活设置答案
                        if(stuAnswer_selected.length() > 0){
//                            Toast.makeText(getActivity(),"设置答案",Toast.LENGTH_SHORT).show();
                            View view = LayoutInflater.from(getActivity()).inflate(R.layout.suiji_qiangda_setanswer, null, false);
                            showPopupWindow_suiji_qiangda_setAnswer(view);
                        }else{
                            Toast.makeText(getActivity(),"学生还未回答问题",Toast.LENGTH_SHORT).show();
                        }
                    }
                }
            }
        });

        //结束作答/重新作答  重新随机   重新抢答
        btEnd.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(txType_tiwen.isSelected()){
                    if(btEnd.getText().equals("结束作答")){
                        //调开始答题接口，“提问结束答题”
                        beginOrEndQueAction("stopAnswer");
                        btEnd.setText("重新作答");
//                        linear2.setVisibility(View.INVISIBLE);
                        jishiqi.stop();
                        if(mTimer_stuNum != null){
                            mTimer_stuNum.cancel();
                            mTimer_stuNum = null;
                        }
                    }else{
                        //调开始答题接口，“提问开始答题”
                        beginOrEndQueAction("startAnswer");
                        btEnd.setText("结束作答");
                        linear2.setVisibility(View.VISIBLE);
                        tx_answers_sum.setText("0/60位同学已提交");
                        jishiqi.setBase(SystemClock.elapsedRealtime());  //设置起始时间 ，这里是从0开始
                        jishiqi.start();   //开始计时
                        //重新开启轮训，定时获取作答学生人数
                        getSubmitAnswerStuNum();
                    }
                }else if(txType_suiji.isSelected()){
                    //重新随机可点时(选中学生)
//                    if(btEnd.getBackground().equals(getResources().getDrawable(R.drawable.btn_begin_enable))){
                    if(stuName_selected != null && stuName_selected.length() > 0){
                        //先将数据恢复默认值，然后重新开始随机，还需要将点赞、设置答案、重新随机设置为不可点
                        initData();
                        beginOrEndQueAction("startAnswerSuiji");

                        btSingle.setTextColor(Color.parseColor("#80000000"));
                        btAnswers.setTextColor(Color.parseColor("#80000000"));
                        btEnd.setTextColor(Color.parseColor("#80000000"));
                        btSingle.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                        btAnswers.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                        btEnd.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));

                        jishiqi.stop();
                        if(mTimer != null){
                            suiji_qiangda_flag = 0;
                            mTimer.cancel();
                        }
                        if(pw_selectStu != null){
                            suiji_qiangda_flag = 0;
                            pw_selectStu.dismiss();
                        }

                        linear2.setVisibility(View.VISIBLE);
                        jishiqi.setVisibility(View.INVISIBLE);
                        tx_answers_sum.setVisibility(View.VISIBLE);
                        tx_answers_sum.setText("学生正在随机中");

                        View view_selectStu = LayoutInflater.from(getActivity()).inflate(R.layout.suiji_qiangda_selectstu, null, false);
                        //开启轮训任务，获取随机/抢答学生信息
                        getSuijiOrQiangdaStu(view_selectStu);
                    }else{
                        Toast.makeText(getActivity(),"重新随机不可点" + answer_sq,Toast.LENGTH_SHORT).show();
                    }
                }else if(txType_qiangda.isSelected()){
                    //重新抢答可点时
//                    if(btEnd.getBackground().equals(getResources().getDrawable(R.drawable.btn_begin_enable))){
                    if(stuName_selected != null && stuName_selected.length() > 0){
                        //先将数据恢复默认值，然后重新开始抢答，还需要将点赞、设置答案、重新抢答设置为不可点
                        initData();
                        beginOrEndQueAction("startQiangDa");

                        btSingle.setTextColor(Color.parseColor("#80000000"));
                        btAnswers.setTextColor(Color.parseColor("#80000000"));
                        btEnd.setTextColor(Color.parseColor("#80000000"));
                        btSingle.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                        btAnswers.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));
                        btEnd.setBackground(getResources().getDrawable((R.drawable.btn_begin_unenable)));

                        jishiqi.stop();
                        if(mTimer != null){
                            suiji_qiangda_flag = 0;
                            mTimer.cancel();
                        }
                        if(pw_selectStu != null){
                            suiji_qiangda_flag = 0;
                            pw_selectStu.dismiss();
                        }

                        linear2.setVisibility(View.VISIBLE);
                        jishiqi.setVisibility(View.INVISIBLE);
                        tx_answers_sum.setVisibility(View.VISIBLE);
                        tx_answers_sum.setText("学生正在抢答中");

                        View view_selectStu = LayoutInflater.from(getActivity()).inflate(R.layout.suiji_qiangda_selectstu, null, false);
                        //开启轮训任务，获取随机/抢答学生信息
                        getSuijiOrQiangdaStu(view_selectStu);
                    }else{
                        Toast.makeText(getActivity(),"重新抢答不可点" + answer_sq,Toast.LENGTH_SHORT).show();
                    }
                }
            }
        });

        //结束作答（主客观题）
        btClosed.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(txType_suiji.isSelected() || txType_qiangda.isSelected()){
//                    isClick_btClose = true;
                    if(mTimer != null){
                        suiji_qiangda_flag = 0;
                        mTimer.cancel();
                    }
                    if(pw_selectStu != null){
                        suiji_qiangda_flag = 0;
                        pw_selectStu.dismiss();
                    }

                    if(txType_suiji.isSelected()){
                        //请求接口，结束随机作答
                        beginOrEndQueAction("stopAnswerSuiji");
                    }else{
                        if(stuName_selected != null && stuAnswer_selected.length() > 0){
                            //未请求到学生回答问题
                            //请求接口，结束抢答
                            beginOrEndQueAction("stopQiangDa");
                        }else{
                            //请求接口，结束抢答作答
                            beginOrEndQueAction("stopAnswerQiangDa");
                        }
                    }
                }else{
                    //提问还在进行中，需要先结束提问，再修改样式
                    if(btEnd.getText().equals("结束作答")){
                        beginOrEndQueAction("stopAnswer");
                    }
                    if(mTimer_stuNum != null){
                        mTimer_stuNum.cancel();
                        mTimer_stuNum = null;
                    }
                }
                //数据以及ui都恢复为初始状态
                initData();
                setSelected1();
                setSelected2();
                txType_tiwen.setSelected(true);
                img_tiwen.setSelected(true);
                txChoose.setVisibility(View.INVISIBLE);
                linear_choose.setVisibility(View.INVISIBLE);
                linear1.setVisibility(View.GONE);
                jishiqi.stop();
                linear2.setVisibility(View.INVISIBLE);
            }
        });

        bindViews(); //UI组件事件绑定
        txType_tiwen.performClick();   //（主动调用组件的点击事件）模拟一次点击，既进去后选择第一项
        img_tiwen.performClick();

//        //调整”互动答题“中”互动类型“的图片大小
//        Drawable[] drawable1 = txType_tiwen.getCompoundDrawables();
//        // 数组下表0~3,依次是:左上右下
//        drawable1[1].setBounds(0, 0, 45, 45);
//        txType_tiwen.setCompoundDrawables(null, drawable1[1], null, null);
//
//        Drawable[] drawable2 = txType_suiji.getCompoundDrawables();
//        drawable2[1].setBounds(0, 0, 45, 45);
//        txType_suiji.setCompoundDrawables(null, drawable2[1], null, null);
//
//        Drawable[] drawable3 = txType_qiangda.getCompoundDrawables();
//        drawable3[1].setBounds(0, 0, 45, 45);
//        txType_qiangda.setCompoundDrawables(null, drawable3[1], null, null);

        // Inflate the layout for this fragment
        return contentView;
    }

    @Override
    public void onClick(View v) {
//        jishiqi.stop();
        initData();
        chooseNum = 4;
        tx_choosenum.setText(chooseNum + "");
        if(mTimer != null){
            suiji_qiangda_flag = 0;
            mTimer.cancel();
        }
        if(pw_selectStu != null){
            suiji_qiangda_flag = 0;
            pw_selectStu.dismiss();
        }
        if(mTimer_stuNum != null){
            mTimer_stuNum.cancel();
            mTimer_stuNum = null;
        }
        if(v.getId() == txType_tiwen.getId() || v.getId() == img_tiwen.getId()) {
            setSelected1();
            txType_tiwen.setSelected(true);
            img_tiwen.setSelected(true);
        }else if(v.getId() == txType_suiji.getId() || v.getId() == img_suiji.getId()){
            setSelected1();
            txType_suiji.setSelected(true);
            img_suiji.setSelected(true);
        }else if(v.getId() == txType_qiangda.getId() || v.getId() == img_qiangda.getId()){
            setSelected1();
            txType_qiangda.setSelected(true);
            img_qiangda.setSelected(true);
        }else if(v.getId() == txModle_danxuan.getId() || v.getId() == imgdanxuan.getId()){
            txChoose.setVisibility(View.VISIBLE);
            linear_choose.setVisibility(View.VISIBLE);
            setSelected2();
            txModle_danxuan.setSelected(true);
            imgdanxuan.setSelected(true);
            btSingle.setText("单题分析");
        }else if(v.getId() == txModle_duoxuan.getId() || v.getId() == imgduoxuan.getId()){
            txChoose.setVisibility(View.VISIBLE);
            linear_choose.setVisibility(View.VISIBLE);
            setSelected2();
            txModle_duoxuan.setSelected(true);
            imgduoxuan.setSelected(true);
            btSingle.setText("单题分析");
        }else if(v.getId() == txModle_panduan.getId() || v.getId() == imgpanduan.getId()){
            txChoose.setVisibility(View.GONE);
            linear_choose.setVisibility(View.GONE);
            setSelected2();
            txModle_panduan.setSelected(true);
            imgpanduan.setSelected(true);
            btSingle.setText("单题分析");
        }else if(v.getId() == txModle_luru.getId() || v.getId() == imgluru.getId()){
            txChoose.setVisibility(View.GONE);
            linear_choose.setVisibility(View.GONE);
            setSelected2();
            txModle_luru.setSelected(true);
            imgluru.setSelected(true);
            btSingle.setText("答案内容");
        }

        //互动类型和互动模式都已选
        if(isSelected()){
            btBegin1.setVisibility(View.GONE);
            btBegin2.setVisibility(View.VISIBLE);
            linear1.setVisibility(View.GONE);
            linear2.setVisibility(View.INVISIBLE);
        }else{
            txChoose.setVisibility(View.GONE);
            linear_choose.setVisibility(View.GONE);
            btBegin1.setVisibility(View.VISIBLE);
            btBegin2.setVisibility(View.GONE);
            linear1.setVisibility(View.GONE);
            linear2.setVisibility(View.INVISIBLE);
        }
    }
}