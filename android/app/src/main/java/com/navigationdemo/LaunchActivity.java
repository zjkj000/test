package com.navigationdemo;

import static android.view.View.GONE;

import static com.navigationdemo.AnswerActivity.base64url;

import android.Manifest;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.drawable.BitmapDrawable;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.TextUtils;
import android.text.style.ImageSpan;
import android.util.Log;
import android.view.KeyEvent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.Group;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
//import androidx.databinding.tool.util.FileUtil;
import androidx.recyclerview.widget.DefaultItemAnimator;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.basic.TRTCBaseActivity;
import com.tencent.liteav.TXLiteAVCode;
import com.tencent.liteav.device.TXDeviceManager;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;
import com.tencent.trtc.TRTCCloudListener;
import com.tencent.trtc.debug.Constant;
import com.tencent.trtc.debug.GenerateTestUserSig;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

public class LaunchActivity extends TRTCBaseActivity implements View.OnClickListener {

    private static final String             TAG = "LaunchActivity";
    private static final int                OVERLAY_PERMISSION_REQ_CODE = 1234;

    public static TextView                        mTextTitle;
    public static TextView                        mCamera_name;
    public static TXCloudVideoView                mTXCVVLocalPreviewView;
    public static TXCloudVideoView                mTXCVVLocalPreviewView_background;

    public static int                             mUserCount = 0;
    public static String                          mRoomId;
    public static String                          mUserId;
    public static String                          mUserCn;
    public static String                          mTeacherId;
    public static String                          mTeacherCn;
    public static String                          mUserPhoto;

    public static TRTCCloud                       mTRTCCloud;
    public static TXDeviceManager                 mTXDeviceManager;
    public static boolean                         mIsFrontCamera = true;
    public static List<String>                    mRemoteUidList;
    public static List<TXCloudVideoView>          mRemoteViewList;

    //教师流、学生流
    public static TXCloudVideoView                mTeacherCamera;
    public static TXCloudVideoView                mTeacherCamera_background;
    public static TXCloudVideoView                mTeacherShare;
    public static List<TXCloudVideoView>          mStudentsList;
    public static TXCloudVideoView                mStudent_1;
    public static TXCloudVideoView                mStudent_2;
    public static TXCloudVideoView                mStudent_3;
    public static TXCloudVideoView                mStudent_4;
    public static TXCloudVideoView                mStudent_5;
    public static TXCloudVideoView                mStudent_6;
    public static HashMap<Integer,TXCloudVideoView>       stu_map;
    public static ConstraintLayout                mStudent_1_div;
    public static ConstraintLayout                mStudent_2_div;
    public static ConstraintLayout                mStudent_3_div;
    public static ConstraintLayout                mStudent_4_div;
    public static ConstraintLayout                mStudent_5_div;
    public static ConstraintLayout                mStudent_6_div;
    public static HashMap<Integer,ConstraintLayout>       stu_map_div;
    public static int                             stu_index;
    public static ScrollView                      mstroll;

    public static TextView                        mTeacherCamera_name;
    public static TextView                        mStudent_1_name;
    public static TextView                        mStudent_2_name;
    public static TextView                        mStudent_3_name;
    public static TextView                        mStudent_4_name;
    public static TextView                        mStudent_5_name;
    public static TextView                        mStudent_6_name;
    public static HashMap<Integer,TextView>       stu_name_map;
    public static ImageView                       mPlatform;
    public static HashMap<String,String>          id_name_map;

    //底部一排button、顶部返回、教师共享点�?
    public static ImageView                       mImageBack;
    public static Button                          mExitBack;
    public static Button                          mButtonHand;
    public static Button                          mButtonHandOnPlatform;
    public static Button                          mButtonMessage;
    public static Button                          mButtonMuteVideo;
    public static Button                          mButtonMuteAudio;
    public static Button                          mButtonSwitchCamera;
    public static Button                          mRefresh;
    public static Button                          mFullScreen;
    public static Group                           mGroupButtons;
    public static EditText                        mMessageInput;
    public static Button                          mMessageSubmit;


    //答题界面，判断、单选、多选、主�?
    public static CheckBox tfyes,tfno;
    public static List<CheckBox> radios_tf;
    public static CheckBox sa,sb,sc,sd,se,sf,sg,sh;
    public static List<CheckBox> radios_single;
    public static CheckBox ma,mb,mc,md,me,mf,mg,mh;
    public static List<CheckBox> radios_multi;
    public static ConstraintLayout group_tfanswer,group_singleanswer,group_multianswer,group_subjectiveanswer;
    public static EditText subjective_answer;
    public static TextView subjective_save,subjective_echo;
    public static ScrollView subjective_scroll;
    public static Button tf_submit,single_submit,multi_submit,subjective_submit;
    public static Button mQiangda;
    public static Button xiangce,paizhao,luru,qingkong;
    public static HashMap<Integer,String>          base64id_url;
    public static SharedPreferences pref;
    public static SharedPreferences.Editor editor;
    public static ConstraintLayout current_answer;//当前答题界面
    public static Boolean openWords_flag=false;

    public static int TAKE_PHOTO = 1;
    public static final int CHOOSE_PHOTO = 2;
    private String imgP;
    private EditText picture;
    private Uri imageUri;

    public static Handler handler;
    //public static Runnable runnableUi;
    public static String last_actiontime_answer = "";
    public static String last_actiontime_mic = "";
    public static String last_actiontime_camera = "";
    public static String last_actiontime_words = "";
    public static String last_actiontime_chat = "0000000000000";
    public static String last_platformUserId = "";
    public static String last_actiontime_startqd = "";
    public static String last_actiontime_stopqd = "";
    public static int base64_index = 0;


    //聊天
    public static RecyclerView recyclerView;
    public static int refreshChatFlag=1;
    public static int mlist_size = 0;

    public static TRTCCloudDef.TRTCParams trtcParams = new TRTCCloudDef.TRTCParams();
    public static TRTCCloudDef.TRTCRenderParams trtcRenderParams = new TRTCCloudDef.TRTCRenderParams();

    //进房间逻辑
    public static Boolean teacher_enable=true;


    @Override
    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);
        setContentView(R.layout.videocall_activity_calling);
        System.out.println("LaunchActivity-userinit:"+LaunchActivity.mUserId);
        System.out.println("LaunchActivity-roominit:"+LaunchActivity.mRoomId);
        handleIntent();
        //创建属于主线程的handler
        handler = new Handler();
        AnswerActivity.messageList=new ArrayList<>();

        //checkPermission();
        if (checkPermission()) {
            initView();

        }
        initViewBottomButton();
        initViewAnswer();
        initChatRoom();
        enterRoom();


    }

    public void getter() {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                handler.post(runnableUi);
                if(!teacher_enable){
                    exitRoom();
                    finish();
                    teacher_enable=true;
                }
            }
        },300,300);
    }

    // 构建Runnable对象，在runnable中更新界�?
    Runnable runnableUi = new Runnable() {
        @Override
        public void run(){
            try{
                //更新上下讲台逻辑
                getview();
                //更新互动答题界面
                getteacher();
                //更新聊天室界�?
                getchatroom();
            }
            catch(NullPointerException e){
                System.out.println("item null");
            }

        }

    };
    //更新上下讲台逻辑
    private static void getview(){
        if(AnswerActivity.allHandAction!=null){
            if(AnswerActivity.allHandAction.equals("handAllNo")){
                mButtonHand.setEnabled(false);
                mButtonHand.setSelected(false);
            }
            else{

                mButtonHand.setEnabled(true);

                //mButtonHand.setSelected(false);
            }
        }

        if(AnswerActivity.platformUserId!=null){
            if(!last_platformUserId.equals(AnswerActivity.platformUserId)){
                TRTCCloudImplListener.refreshRemoteVideoViews();
                last_platformUserId = AnswerActivity.platformUserId;
            }
        }
    }


    //更新互动答题界面
    private static void getteacher(){
            if(AnswerActivity.questionAction!=null){
//                if(AnswerActivity.questionAction.equals("stopAnswer")
//                        ||AnswerActivity.questionAction.equals("stopAnswerSuiji")
//                        ||AnswerActivity.questionAction.equals("stopAnswerQiangDa")){
//                    current_answer = null;
//                    LaunchActivity.group_tfanswer.setVisibility(GONE);
//                    LaunchActivity.group_singleanswer.setVisibility(GONE);
//                    LaunchActivity.group_multianswer.setVisibility(GONE);
//                    LaunchActivity.group_subjectiveanswer.setVisibility(GONE);
//
//
//                    mQiangda.setSelected(false);
//                    BottomButtonActivity.qiangDa();
//
//                    LaunchActivity.mMessageInput.setVisibility(View.VISIBLE);
//                    LaunchActivity.mMessageInput.bringToFront();
//                    System.out.println("no time answer over");
//                }
                if(last_actiontime_answer.equals(AnswerActivity.questionTime)){
                    return;
                }
                else{
                    last_actiontime_answer=AnswerActivity.questionTime;
                }
                if(AnswerActivity.questionAction.equals("startAnswer")
                        ||AnswerActivity.questionAction.equals("startAnswerSuiji")
                        ||AnswerActivity.questionAction.equals("startAnswerQiangDa")) {
                    mQiangda.setSelected(false);
                    BottomButtonActivity.qiangDa();
                    LaunchActivity.mMessageInput.setVisibility(GONE);

                    System.out.println("answer over a");

                    if (AnswerActivity.questionBaseTypeId.equals("101")) {
                        current_answer = group_singleanswer;
//                        LaunchActivity.group_tfanswer.setVisibility(View.GONE);
                        LaunchActivity.group_singleanswer.setVisibility(View.VISIBLE);
//                        LaunchActivity.group_multianswer.setVisibility(View.GONE);
//                        LaunchActivity.group_subjectiveanswer.setVisibility(View.GONE);

                        LaunchActivity.mGroupButtons.setVisibility(GONE);
                        int index =0;
                        int sub_num = Integer.parseInt(AnswerActivity.questionSubNum);
                        for(CheckBox item:radios_single){
                            if(index<sub_num){
                                item.setChecked(false);
                                item.setVisibility(View.VISIBLE);
                            }
                            else{
                                item.setChecked(false);
                                item.setVisibility(GONE);
                            }
                            index++;
                        }
                    }
                    else if (AnswerActivity.questionBaseTypeId.equals("102")) {
                        current_answer = group_multianswer;
//                        LaunchActivity.group_tfanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_singleanswer.setVisibility(View.GONE);
                        LaunchActivity.group_multianswer.setVisibility(View.VISIBLE);
//                        LaunchActivity.group_subjectiveanswer.setVisibility(View.GONE);
                        LaunchActivity.mGroupButtons.setVisibility(GONE);
                        int index =0;
                        int sub_num = Integer.parseInt(AnswerActivity.questionSubNum);
                        for(CheckBox item:radios_multi){
                            if(index<sub_num){
                                item.setChecked(false);
                                item.setVisibility(View.VISIBLE);
                            }
                            else{
                                item.setChecked(false);
                                item.setVisibility(GONE);
                            }
                            index++;
                        }
                    }
                    else if (AnswerActivity.questionBaseTypeId.equals("103")) {
                        current_answer = group_tfanswer;
                        LaunchActivity.group_tfanswer.setVisibility(View.VISIBLE);
//                        LaunchActivity.group_singleanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_multianswer.setVisibility(View.GONE);
//                        LaunchActivity.group_subjectiveanswer.setVisibility(View.GONE);
                        LaunchActivity.mGroupButtons.setVisibility(GONE);
                        int index =0;
                        //int sub_num = Integer.parseInt(AnswerActivity.questionSubNum);
                        int sub_num=2;
                        for(CheckBox item:radios_tf){
                            if(index<sub_num){
                                item.setChecked(false);
                                item.setVisibility(View.VISIBLE);
                            }
                            else{
                                item.setChecked(false);
                                item.setVisibility(GONE);
                            }
                            index++;
                        }
                    }
                    else if (AnswerActivity.questionBaseTypeId.equals("104")) {
                        current_answer = group_subjectiveanswer;
//                        LaunchActivity.group_tfanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_singleanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_multianswer.setVisibility(View.GONE);
                        LaunchActivity.group_subjectiveanswer.setVisibility(View.VISIBLE);
                        LaunchActivity.mGroupButtons.setVisibility(GONE);
                    }
                }
                else if(AnswerActivity.questionAction.equals("stopAnswer")
                        ||AnswerActivity.questionAction.equals("stopAnswerSuiji")
                        ||AnswerActivity.questionAction.equals("stopAnswerQiangDa")){
                    current_answer = null;

                    LaunchActivity.group_tfanswer.setVisibility(GONE);
                    LaunchActivity.group_singleanswer.setVisibility(GONE);
                    LaunchActivity.group_multianswer.setVisibility(GONE);
                    LaunchActivity.group_subjectiveanswer.setVisibility(GONE);

                    subjective_answer.setText("");
                    subjective_echo.setText("");
                    subjective_scroll.setVisibility(GONE);

                    mQiangda.setSelected(false);
                    BottomButtonActivity.qiangDa();

//                    LaunchActivity.mMessageInput.setVisibility(View.VISIBLE);
                    LaunchActivity.mGroupButtons.setVisibility(View.VISIBLE);
                    System.out.println("answer over b");
                }
                else if(AnswerActivity.questionAction.equals("startQiangDa")){
                    LaunchActivity.mGroupButtons.setVisibility(View.VISIBLE);
                    LaunchActivity.mMessageInput.setVisibility(GONE);
                    LaunchActivity.group_tfanswer.setVisibility(GONE);
                    LaunchActivity.group_singleanswer.setVisibility(GONE);
                    LaunchActivity.group_multianswer.setVisibility(GONE);
                    LaunchActivity.group_subjectiveanswer.setVisibility(GONE);
                    mQiangda.setSelected(true);
                    BottomButtonActivity.qiangDa();
                    System.out.println("answer over c");
                }
                else if(AnswerActivity.questionAction.equals("stopAnswerQiangDa")){

                    BottomButtonActivity.qiangDa();
                    LaunchActivity.mMessageInput.setVisibility(View.VISIBLE);
                    System.out.println("answer over d");
                }
                else{

                    BottomButtonActivity.qiangDa();
                    System.out.println("answer over f"+AnswerActivity.questionAction);
                }
            }
            if(AnswerActivity.deviceMicAction!=null){
                if(last_actiontime_mic.equals(AnswerActivity.deviceMicTime)){
                    return;
                }
                else{
                    last_actiontime_mic=AnswerActivity.deviceMicTime;
                }
                if(AnswerActivity.deviceMicAction.equals("openMic")){
                    boolean isSelected = mButtonMuteAudio.isSelected();
                    if (isSelected){
                        BottomButtonActivity.muteAudio();
                    }
                }
                else if(AnswerActivity.deviceMicAction.equals("closeMic")){
                    boolean isSelected = mButtonMuteAudio.isSelected();
                    if (!isSelected){
                        BottomButtonActivity.muteAudio();
                    }
                }
            }
            if(AnswerActivity.deviceCameraAction!=null){
                if(last_actiontime_camera.equals(AnswerActivity.deviceCameraTime)){
                    return;
                }
                else{
                    last_actiontime_camera=AnswerActivity.deviceCameraTime;
                }
                if(AnswerActivity.deviceCameraAction.equals("openCamera")){
                    boolean isSelected = mButtonMuteVideo.isSelected();
                    if (isSelected){
                        BottomButtonActivity.muteVideo();
                    }
                }
                else if(AnswerActivity.deviceCameraAction.equals("closeCamera")){
                    boolean isSelected = mButtonMuteVideo.isSelected();
                    if (!isSelected){
                        BottomButtonActivity.muteVideo();
                    }
                }
            }
            if(AnswerActivity.deviceWordsAction!=null){
                System.out.println("last_actiontime_words:"+last_actiontime_words);
                System.out.println("AnswerActivity.deviceWordsTime:"+AnswerActivity.deviceWordsTime);
                if(last_actiontime_words.equals(AnswerActivity.deviceWordsTime)){
                    System.out.println("actiontime return");
                    return;
                }
                else{
                    System.out.println("actiontime change");
                    last_actiontime_words=AnswerActivity.deviceWordsTime;
                }
                if(AnswerActivity.deviceWordsAction.equals("openWords")&&!openWords_flag){
                    openWords_flag = true;
                    //mMessageInput.setFocusable(true);
                    mMessageInput.setText("");
                    //
                    mMessageInput.setEnabled(true);
                    System.out.println("openWords!!!!!!!");
                    mMessageSubmit.setEnabled(true);
//                    boolean isSelected = mButtonMuteVideo.isSelected();
//                    if (isSelected){
//                        BottomButtonActivity.muteVideo();
//                    }
                }
                else if(AnswerActivity.deviceWordsAction.equals("closeWords")){
                    openWords_flag = false;
                    //mMessageInput.setFocusable(false);
                    mMessageInput.setEnabled(false);
                    mMessageInput.setText("您当前已被教师禁言");

                    mMessageSubmit.setEnabled(false);
//                    boolean isSelected = mButtonMuteVideo.isSelected();
//                    if (!isSelected){
//                        BottomButtonActivity.muteVideo();
//                    }
                }
            }
    }

    //更新聊天室界�?
    private void getchatroom(){
        //将messageList动态渲染到聊天室当�?
        if(AnswerActivity.messageList==null||AnswerActivity.messageList.size()==0) {
            System.out.println("messagelist is null!");
            return;
        }
        if(LaunchActivity.refreshChatFlag == 0){
            System.out.println("LaunchActivity.refreshChatFlag is 0!");
            return;
        }
        System.out.print("xuanran size:");
        System.out.println(AnswerActivity.messageList.size());

        //1、设置布局管理�?
//        recyclerView.setLayoutManager(new LinearLayoutManager(this));
        //2、设置adapter
        recyclerView.setAdapter(new ChatAdapter(this, AnswerActivity.messageList));
        //3、设置默认动�?
        recyclerView.setItemAnimator(new DefaultItemAnimator());
        recyclerView.scrollToPosition(AnswerActivity.messageList.size()-1);
    }


//    private void handleIntent() {
//        Intent intent = getIntent();
//        if (null != intent) {
//            if (intent.getStringExtra(Constant.USER_ID) != null) {
//                mUserId = intent.getStringExtra(Constant.USER_ID);
//            }
//            if (intent.getStringExtra(Constant.ROOM_ID) != null) {
//                mRoomId = intent.getStringExtra(Constant.ROOM_ID);
//            }
//        }
//    }
    private void handleIntent() {
        Intent intent = getIntent();
        String params = intent.getStringExtra("params");
        System.out.println("LaunchActivity-params:"+params);
        String[] strArr = params.split("-", 6);
        LaunchActivity.mUserId = strArr[0];
        LaunchActivity.mUserCn = strArr[1];
        LaunchActivity.mRoomId = strArr[2];
        LaunchActivity.mTeacherId = strArr[3];
        LaunchActivity.mTeacherCn = strArr[4];
        LaunchActivity.mUserPhoto = strArr[5];
        System.out.println("LaunchActivity-userinit:"+LaunchActivity.mUserId);
        System.out.println("LaunchActivity-usercninit:"+LaunchActivity.mUserCn);
        System.out.println("LaunchActivity-roominit:"+LaunchActivity.mRoomId);
        System.out.println("LaunchActivity-mTeacherId:"+LaunchActivity.mTeacherId);
        System.out.println("LaunchActivity-mTeacherCn:"+LaunchActivity.mTeacherCn);
        System.out.println("LaunchActivity-mUserPhoto:"+LaunchActivity.mUserPhoto);

        if (null != intent) {
            if (intent.getStringExtra(Constant.USER_ID) != null) {
                LaunchActivity.mUserId = intent.getStringExtra(Constant.USER_ID);
            }
            if (intent.getStringExtra(Constant.ROOM_ID) != null) {
                LaunchActivity.mRoomId = intent.getStringExtra(Constant.ROOM_ID);
            }
        }

//        Intent intent = getIntent();
//        String params = intent.getStringExtra("params");
//        System.out.println("LaunchActivity-params:"+params);
//        String[] strArr = params.split("-");
//        mUserId = strArr[0];
//        mRoomId = strArr[1];
//        System.out.println("LaunchActivity-userinit:"+mUserId);
//        System.out.println("LaunchActivity-roominit:"+mRoomId);
//
//        if (null != intent) {
//            if (intent.getStringExtra(Constant.USER_ID) != null) {
//                mUserId = intent.getStringExtra(Constant.USER_ID);
//            }
//            if (intent.getStringExtra(Constant.ROOM_ID) != null) {
//                mRoomId = intent.getStringExtra(Constant.ROOM_ID);
//            }
//        }
    }

    //初始化自己摄像头、教师流、学生流
    private void initView() {
        mRemoteUidList = new ArrayList<>();
        mRemoteViewList = new ArrayList<>();
        mStudentsList = new ArrayList<>();
        mCamera_name = findViewById(R.id.myself_camera_name);
        mTeacherShare = (TXCloudVideoView)findViewById(R.id.teacher_share);
        mTeacherCamera = (TXCloudVideoView)findViewById(R.id.teacher_camera);
        mTeacherCamera_background = (TXCloudVideoView)findViewById(R.id.teacher_background);
        mStudent_1 = (TXCloudVideoView)findViewById(R.id.student_1);
        mStudent_2 = (TXCloudVideoView)findViewById(R.id.student_2);
        mStudent_3 = (TXCloudVideoView)findViewById(R.id.student_3);
        mStudent_4 = (TXCloudVideoView)findViewById(R.id.student_4);
        mStudent_5 = (TXCloudVideoView)findViewById(R.id.student_5);
        mStudent_6 = (TXCloudVideoView)findViewById(R.id.student_6);
        mTeacherCamera_name = findViewById(R.id.teacher_camera_name);
        mStudent_1_name = findViewById(R.id.student_1_name);
        mStudent_2_name = findViewById(R.id.student_2_name);
        mStudent_3_name = findViewById(R.id.student_3_name);
        mStudent_4_name = findViewById(R.id.student_4_name);
        mStudent_5_name = findViewById(R.id.student_5_name);
        mStudent_6_name = findViewById(R.id.student_6_name);
        mPlatform = findViewById(R.id.myself_platform);

        stu_map = new HashMap<>();
        stu_map.put(0,mStudent_1);
        stu_map.put(1,mStudent_2);
        stu_map.put(2,mStudent_3);
        stu_map.put(3,mStudent_4);
        stu_map.put(4,mStudent_5);
        stu_map.put(5,mStudent_6);

        mStudent_1_div = findViewById(R.id.student_1_div);
        mStudent_2_div = findViewById(R.id.student_2_div);
        mStudent_3_div = findViewById(R.id.student_3_div);
        mStudent_4_div = findViewById(R.id.student_4_div);
        mStudent_5_div = findViewById(R.id.student_5_div);
        mStudent_6_div = findViewById(R.id.student_6_div);

        stu_map_div = new HashMap<>();
        stu_map_div.put(0,mStudent_1_div);
        stu_map_div.put(1,mStudent_2_div);
        stu_map_div.put(2,mStudent_3_div);
        stu_map_div.put(3,mStudent_4_div);
        stu_map_div.put(4,mStudent_5_div);
        stu_map_div.put(5,mStudent_6_div);

        stu_name_map = new HashMap<>();
        stu_name_map.put(0,mStudent_1_name);
        stu_name_map.put(1,mStudent_2_name);
        stu_name_map.put(2,mStudent_3_name);
        stu_name_map.put(3,mStudent_4_name);
        stu_name_map.put(4,mStudent_5_name);
        stu_name_map.put(5,mStudent_6_name);
        id_name_map = new HashMap<>();

        mRemoteViewList.add(mTeacherShare);
        mRemoteViewList.add(mTeacherCamera);
        mRemoteViewList.add(mStudent_1);
        mRemoteViewList.add(mStudent_2);
        mRemoteViewList.add(mStudent_3);
        mRemoteViewList.add(mStudent_4);
        mRemoteViewList.add(mStudent_5);
        mRemoteViewList.add(mStudent_6);

        mTeacherShare.setOnClickListener(this);

        mstroll=findViewById(R.id.stroll);
        mstroll.setOnClickListener(this);

        mCamera_name.setText(mUserCn);
        mCamera_name.bringToFront();


    }

    //初始化顶部、底部按�?
    private void initViewBottomButton(){
        mTextTitle = findViewById(R.id.tv_room_number);
        //mImageBack = findViewById(R.id.iv_back);
        mExitBack = findViewById(R.id.exitroom);
        mTXCVVLocalPreviewView = findViewById(R.id.myself_camera);//自己摄像�?
        mTXCVVLocalPreviewView_background = findViewById(R.id.myself_background);//自己摄像�?
        mButtonHand = findViewById(R.id.hands);
        mButtonHandOnPlatform = findViewById(R.id.hands_onplatform);
        mButtonMessage = findViewById(R.id.message);
        mButtonMuteVideo = findViewById(R.id.btn_mute_video);
        mButtonMuteAudio = findViewById(R.id.btn_mute_audio);
        mRefresh = findViewById(R.id.refresh);
        mButtonSwitchCamera = findViewById(R.id.btn_switch_camera); //前置后置摄像头切�?
        mFullScreen = findViewById(R.id.fullscreen);
        mGroupButtons=findViewById(R.id.group_buttons);
        mMessageInput=findViewById(R.id.message_input);
        mMessageSubmit=findViewById(R.id.submit_mess);

        if (!TextUtils.isEmpty(mRoomId)) {
            //mTextTitle.setText(getString(R.string.videocall_roomid) + mRoomId);
            mTextTitle.setText( mRoomId);
        }
        //mImageBack.setOnClickListener(this);
        mExitBack.setOnClickListener(this);
        mButtonHand.setOnClickListener(this);
        mButtonMessage.setOnClickListener(this);
        mButtonMuteVideo.setOnClickListener(this);
        mButtonMuteAudio.setOnClickListener(this);
        mButtonSwitchCamera.setOnClickListener(this);
        mRefresh.setOnClickListener(this);
        mFullScreen.setOnClickListener(this);
        mMessageInput.setOnClickListener(this);
        mMessageSubmit.setOnClickListener(this);

        mButtonHandOnPlatform.setVisibility(GONE);

        mMessageInput.setImeOptions(EditorInfo.IME_ACTION_DONE);
        mMessageInput.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            public boolean onEditorAction(TextView v, int actionId,                   KeyEvent event)  {
                if (actionId==EditorInfo.IME_ACTION_DONE ||(event!=null&&event.getKeyCode()== KeyEvent.KEYCODE_ENTER))
                {
                    //do something;
                    System.out.println("edittext true!");
//                    mMessageInput.clearFocus();
//                    InputMethodManager manager = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
//                    manager.hideSoftInputFromWindow(InputMethodManager.HIDE_NOT_ALWAYS);
                    InputMethodManager im = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    im.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);

                    return true;
                }
                System.out.println("edittext false!");
                return false;
            }
        });


    }

    //初始化互动答题界面：判断、单选、多选、主�?
    private void initViewAnswer(){
        group_tfanswer = findViewById(R.id.tfanswer);
        group_tfanswer.setOnClickListener(this);
        group_singleanswer = findViewById(R.id.singleanswer);
        group_singleanswer.setOnClickListener(this);
        group_multianswer = findViewById(R.id.multianswer);
        group_multianswer.setOnClickListener(this);
        group_subjectiveanswer = findViewById(R.id.subjectiveanswer);
        group_subjectiveanswer.setOnClickListener(this);

        tfyes = findViewById(R.id.tfyes);
        tfno = findViewById(R.id.tfno);
        tfyes.setOnClickListener(this);
        tfno.setOnClickListener(this);
        radios_tf = new ArrayList<>();
        radios_tf.add(tfyes);
        radios_tf.add(tfno);

        sa = findViewById(R.id.singlea);
        sb = findViewById(R.id.singleb);
        sc = findViewById(R.id.singlec);
        sd = findViewById(R.id.singled);
        se = findViewById(R.id.singlee);
        sf = findViewById(R.id.singlef);
        sg = findViewById(R.id.singleg);
        sh = findViewById(R.id.singleh);
        sa.setOnClickListener(this);
        sb.setOnClickListener(this);
        sc.setOnClickListener(this);
        sd.setOnClickListener(this);
        se.setOnClickListener(this);
        sf.setOnClickListener(this);
        sg.setOnClickListener(this);
        sh.setOnClickListener(this);
        radios_single = new ArrayList<>();
        radios_single.add(sa);
        radios_single.add(sb);
        radios_single.add(sc);
        radios_single.add(sd);
        radios_single.add(se);
        radios_single.add(sf);
        radios_single.add(sg);
        radios_single.add(sh);

        ma = findViewById(R.id.multia);
        mb = findViewById(R.id.multib);
        mc = findViewById(R.id.multic);
        md = findViewById(R.id.multid);
        me = findViewById(R.id.multie);
        mf = findViewById(R.id.multif);
        mg = findViewById(R.id.multig);
        mh = findViewById(R.id.multih);
        ma.setOnClickListener(this);
        mb.setOnClickListener(this);
        mc.setOnClickListener(this);
        md.setOnClickListener(this);
        me.setOnClickListener(this);
        mf.setOnClickListener(this);
        mg.setOnClickListener(this);
        mh.setOnClickListener(this);
        radios_multi = new ArrayList<>();
        radios_multi.add(ma);
        radios_multi.add(mb);
        radios_multi.add(mc);
        radios_multi.add(md);
        radios_multi.add(me);
        radios_multi.add(mf);
        radios_multi.add(mg);
        radios_multi.add(mh);

        tf_submit = findViewById(R.id.tfsubmit);
        tf_submit.setOnClickListener(this);
        single_submit = findViewById(R.id.singlesubmit);
        single_submit.setOnClickListener(this);
        multi_submit = findViewById(R.id.multisubmit);
        multi_submit.setOnClickListener(this);
        subjective_submit = findViewById(R.id.subjectivesubmit);
        subjective_submit.setOnClickListener(this);

        mQiangda = findViewById(R.id.qiangda);
        mQiangda.setOnClickListener(this);

        pref = PreferenceManager.getDefaultSharedPreferences(this);
        String data = pref.getString("data","");

        xiangce = findViewById(R.id.xiangce);
        xiangce.setOnClickListener(this);
        paizhao = findViewById(R.id.paizhao);
        paizhao.setOnClickListener(this);
//        luru = findViewById(R.id.luru);
//        luru.setOnClickListener(this);

        qingkong = findViewById(R.id.qingkong);
        qingkong.setOnClickListener(this);

        //主观题输入框
        subjective_answer = findViewById(R.id.tiankong);
        subjective_answer.setOnClickListener(this);
        //主观题回显textview
        subjective_echo = findViewById(R.id.tiankong_echo);
        subjective_echo.setOnClickListener(this);
        //主观题保存textview
        subjective_save = findViewById(R.id.tiankong_save);
        subjective_save.setOnClickListener(this);

        subjective_scroll = findViewById(R.id.stroll_tiankong);
        subjective_scroll.setOnClickListener(this);

        subjective_answer.setImeOptions(EditorInfo.IME_ACTION_DONE);
        subjective_answer.setOnEditorActionListener(new TextView.OnEditorActionListener() {
            public boolean onEditorAction(TextView v, int actionId,                   KeyEvent event)  {
                if (actionId==EditorInfo.IME_ACTION_DONE ||(event!=null&&event.getKeyCode()== KeyEvent.KEYCODE_ENTER))
                {
                    //do something;
                    System.out.println("edittext true!");
                    InputMethodManager im = (InputMethodManager) getSystemService(Context.INPUT_METHOD_SERVICE);
                    im.hideSoftInputFromWindow(getCurrentFocus().getWindowToken(), InputMethodManager.HIDE_NOT_ALWAYS);

                    return true;
                }
                System.out.println("edittext false!");
                return false;
            }
        });

        base64id_url = new HashMap<>();


    }

    private CharSequence getDrawableStr(Uri picPath) {
        InputStream is;
        if (Build.VERSION.SDK_INT >= 23) {
            int REQUEST_CODE_CONTACT = 101;
            String[] permissions = {
                    Manifest.permission.WRITE_EXTERNAL_STORAGE};
            //验证是否许可权限
            for (String strper : permissions) {
                if (LaunchActivity.this.checkSelfPermission(strper) != PackageManager.PERMISSION_GRANTED) {
                    //申请权限
                    LaunchActivity.this.requestPermissions(permissions, REQUEST_CODE_CONTACT);

                } else {
                    //这里就是权限打开之后自己要操作的逻辑
                    try {
                        String str = "<img src=\"" + picPath + "\"/>";


                        is = new FileInputStream(String.valueOf(picPath));
                        BitmapFactory.Options opts = new BitmapFactory.Options();
                        opts.inTempStorage = new byte[100 * 1024];
                        opts.inPreferredConfig = Bitmap.Config.RGB_565; // 默认是Bitmap.Config.ARGB_8888
                        opts.inSampleSize = 4;
                        /* 下面两个字段需要组合使用 ，说是为了节约内存 */
                        opts.inPurgeable = true;
                        opts.inInputShareable = true;
                        Bitmap bm = BitmapFactory.decodeStream(is, null, opts);

                        final SpannableString ss = new SpannableString(str);
                        // 定义插入图片
                        Drawable drawable = new BitmapDrawable(bm);
                        drawable.setBounds(2, 0, 400, 350);
                        ImageSpan span = new ImageSpan(drawable, ImageSpan.ALIGN_BASELINE);
                        ss.setSpan(span, 0, ss.length(), Spannable.SPAN_INCLUSIVE_EXCLUSIVE);
                        return ss;

                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                        return null;
                    }
                }
            }
        }
        System.out.println("return null");
        return null;

    }

    private void initChatRoom(){
        recyclerView = (RecyclerView) findViewById(R.id.chatroom);
        //1、设置布局管理�?
        recyclerView.setLayoutManager(new LinearLayoutManager(this));
    }

    private void enterRoom() {
        mTRTCCloud = TRTCCloud.sharedInstance(getApplicationContext());
        mTRTCCloud.setListener(new TRTCCloudImplListener(LaunchActivity.this));
        mTXDeviceManager = mTRTCCloud.getDeviceManager();

        trtcParams.sdkAppId = GenerateTestUserSig.SDKAPPID;
        trtcParams.userId = mUserId;
        trtcParams.roomId = Integer.parseInt(mRoomId);
        trtcParams.userSig = GenerateTestUserSig.genTestUserSig(trtcParams.userId);


        //进入房间
        mTRTCCloud.enterRoom(trtcParams, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);


        //接通自己的视频流（可以本地看到自己
        mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
        mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);

        mTeacherCamera_background.setVisibility(View.VISIBLE);
        mTeacherCamera_background.bringToFront();

//        //上讲台：自己进入房间
//        System.out.println("before myself enterroom:"+mUserId);
//        System.out.println("before myself enterroom platformUserId:"+HttpActivity.platformUserId);
//        if(HttpActivity.platformUserId!=null && mUserId.equals(HttpActivity.platformUserId.split("_")[0])){
//            mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
//            mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
//        }
//        else{
//            mTRTCCloud.stopLocalPreview();
//            mTRTCCloud.stopLocalAudio();
//        }

        //先进房间，才能进行举手请�?
        HttpActivity.testJoinOrLeaveRoom("join");

        //按时间间隔捕获教师端消息
        HttpActivity.timer();

        //按时间间隔刷新原生ui界面
        getter();
        //先固定一下聊天室信息内容
        //getchatroom();

    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        exitRoom();
    }

    private static void exitRoom() {
        if (mTRTCCloud != null) {
            mTRTCCloud.stopLocalAudio();
            mTRTCCloud.stopLocalPreview();
            mTRTCCloud.exitRoom();
            mTRTCCloud.setListener(null);
        }
        mTRTCCloud = null;
        TRTCCloud.destroySharedInstance();
        //手放下、退出直播间
        HttpActivity.testRaiseHandAction("down");//放手下讲台
        HttpActivity.testJoinOrLeaveRoom("leave");
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onPermissionGranted() {
        initView();
        enterRoom();
    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        //返回上级页面
//        if (id == R.id.iv_back) {
//            finish();
//        }
        if (id == R.id.exitroom) {
            exitRoom();
            finish();

        }

        else if(id == R.id.tiankong_save){
            if(subjective_answer.getText().length()>0){
                System.out.println("echo"+subjective_answer.getText());
                subjective_scroll.setVisibility(View.VISIBLE);
                subjective_scroll.bringToFront();
                //subjective_echo.setText(subjective_answer.getText());
                subjective_echo.append(subjective_answer.getText());
                subjective_answer.setText("");


            }
        }

        else if(id==R.id.qiangda){
            BottomButtonActivity.qiangDa();
        }

        //举手上讲�?
        else if(id == R.id.hands){
            BottomButtonActivity.muteHand();
        }

        //开闭聊天室
        else if (id == R.id.message) {
            BottomButtonActivity.muteMessage();
        }

        //开闭摄像头
        else if (id == R.id.btn_mute_video) {
            BottomButtonActivity.muteVideo();
        }

        //开闭麦
        else if (id == R.id.btn_mute_audio) {
            BottomButtonActivity.muteAudio();
        }

        //前置后置摄像�?
        else if (id == R.id.btn_switch_camera) {
            BottomButtonActivity.switchCamera();
        }

        //刷新
        else if (id == R.id.refresh){
            BottomButtonActivity.remoteRefresh();
//            new Thread(new Runnable() {//创建子线�?
//                @Override
//                public void run() {
//                    getwebinfo();//把路径选到MainActivity�?
//                }
//            }).start();//启动子线�?
        }

        //全屏
        else if (id == R.id.fullscreen){
            BottomButtonActivity.fullscreen();
        }

        //点击教师分享流隐藏顶部底部按�?
        else if(id == R.id.teacher_share){
            //BottomButtonActivity.touchTeachershare();
        }

        //判断
        else if(id == R.id.tfyes ||id == R.id.tfno
              ||id == R.id.tfsubmit){
            // 显示选中项�?
            if(id == R.id.tfsubmit){
                String checkedValues = SelectUtil.getOne(radios_tf);
                System.out.println("判断选中了：" + checkedValues);
                HttpActivity.stuSaveAnswer(checkedValues);

//                if(AnswerActivity.questionAction.equals("startAnswerSuiji")
//                        ||AnswerActivity.questionAction.equals("startAnswerQiangDa")){
//                    current_answer = null;
//                    LaunchActivity.group_tfanswer.setVisibility(GONE);
//                    LaunchActivity.group_singleanswer.setVisibility(GONE);
//                    LaunchActivity.group_multianswer.setVisibility(GONE);
//                    LaunchActivity.group_subjectiveanswer.setVisibility(GONE);
//
//                    LaunchActivity.mGroupButtons.setVisibility(View.VISIBLE);
//                    System.out.println("answer over");
//                }
                return;
            }
            System.out.println("this box:"+id);
            CheckBox thisbox =findViewById(id);
            SelectUtil.unCheck(radios_tf);
            thisbox.setChecked(true);

        }

        //单�?
        else if(id == R.id.singlea ||id == R.id.singleb || id == R.id.singlec ||id == R.id.singled
              ||id == R.id.singlee ||id == R.id.singlef || id == R.id.singleg ||id == R.id.singleh
              ||id == R.id.singlesubmit){
            // 显示选中项�?
            if(id == R.id.singlesubmit){
                String checkedValues = SelectUtil.getOne(radios_single);
                System.out.println("单选选中了：" + checkedValues+"id:"+HttpActivity.questionId);
                HttpActivity.stuSaveAnswer(checkedValues);

//                if(AnswerActivity.questionAction.equals("startAnswerSuiji")
//                        ||AnswerActivity.questionAction.equals("startAnswerQiangDa")){
//                    current_answer = null;
//                    LaunchActivity.group_tfanswer.setVisibility(GONE);
//                    LaunchActivity.group_singleanswer.setVisibility(GONE);
//                    LaunchActivity.group_multianswer.setVisibility(GONE);
//                    LaunchActivity.group_subjectiveanswer.setVisibility(GONE);
//
//                    LaunchActivity.mGroupButtons.setVisibility(View.VISIBLE);
//                    System.out.println("answer over");
//                }
                return;
            }
            CheckBox thisbox =findViewById(id);
            SelectUtil.unCheck(radios_single);
            thisbox.setChecked(true);
        }

        //多�?
        else if(id == R.id.multia ||id == R.id.multib || id == R.id.multic ||id == R.id.multid
              ||id == R.id.multie ||id == R.id.multif || id == R.id.multig ||id == R.id.multih
              ||id == R.id.multisubmit){
            // 显示选中项�?
            if(id == R.id.multisubmit){
                String checkedValues = SelectUtil.getMany(radios_multi);
                System.out.println("多选选中�?:"+checkedValues);
                HttpActivity.stuSaveAnswer(checkedValues);

//                if(AnswerActivity.questionAction.equals("startAnswerSuiji")
//                        ||AnswerActivity.questionAction.equals("startAnswerQiangDa")){
//                    current_answer = null;
//                    LaunchActivity.group_tfanswer.setVisibility(GONE);
//                    LaunchActivity.group_singleanswer.setVisibility(GONE);
//                    LaunchActivity.group_multianswer.setVisibility(GONE);
//                    LaunchActivity.group_subjectiveanswer.setVisibility(GONE);
//
//                    LaunchActivity.mGroupButtons.setVisibility(View.VISIBLE);
//                    System.out.println("answer over");
//                }
                return;
            }
            CheckBox thisbox =findViewById(id);
            if(thisbox.isChecked()==false){
                thisbox.setChecked(false);
            }
            else{
                thisbox.setChecked(true);
            }
        }

        //主观_填空�?
        else if(id == R.id.subjectivesubmit){
            // 显示选中项�?
            TextView editone = findViewById(R.id.tiankong_echo);
            String editoneValue = editone.getText().toString();
            System.out.println("主观题答案的内容:"+editoneValue);

            if(editoneValue.length()==0||editoneValue.equals("消息不允许为空")){
                System.out.println("主观题答案不允许为空");
                subjective_answer.setEnabled(false);
                subjective_answer.setText("主观题答案不允许为空");
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        subjective_answer.setEnabled(true);
                        subjective_answer.setText("");
                    }
                }, 1000);
            }
            else{
                for(int i=0;i<base64_index;i++){
                    System.out.println("base64 i:"+i+" "+base64id_url.get(i));
                    editoneValue = editoneValue.replace("'"+i+"'","< img src=\""+base64id_url.get(i)+"\">");
                }
                System.out.println("editoneValue i:"+editoneValue);
                HttpActivity.stuSaveAnswer(editoneValue);

//                if(AnswerActivity.questionAction.equals("startAnswerSuiji")
//                        ||AnswerActivity.questionAction.equals("startAnswerQiangDa")){
//                    current_answer = null;
//                    LaunchActivity.group_tfanswer.setVisibility(GONE);
//                    LaunchActivity.group_singleanswer.setVisibility(GONE);
//                    LaunchActivity.group_multianswer.setVisibility(GONE);
//                    //LaunchActivity.group_subjectiveanswer.setVisibility(GONE);
//
//                    //LaunchActivity.mGroupButtons.setVisibility(View.VISIBLE);
//                    System.out.println("answer over");
//                }

                subjective_answer.setText("");
                subjective_echo.setText("");
                //subjective_scroll.setVisibility(GONE);

                base64_index=0;
                base64id_url=new HashMap<>();
            }

        }

        else if(id == R.id.qingkong){
            subjective_echo.setText("");

            base64_index=0;
            base64id_url=new HashMap<>();
        }

        //相册�?
        else if(id == R.id.xiangce){
            {
                if (ContextCompat.checkSelfPermission(LaunchActivity.this,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){
                    ActivityCompat.requestPermissions(LaunchActivity.this,new
                            String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE},1);
                }else {
                    openAlbum();
                    Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
                    intent.setType("image/*");
                    intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
                    handleImageOnKitKat(intent);
                }
            }
        }

        //拍照�?
        else if(id == R.id.paizhao){
            //创建File对象，用于存储拍照后的图片
            File outputImage=new File(getExternalCacheDir(),"output_image.jpg");
            try {
                if(outputImage.exists()){
                    outputImage.delete();
                }
                outputImage.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }

            if(Build.VERSION.SDK_INT >= 24){
                imageUri = FileProvider.getUriForFile(LaunchActivity.this,
                        "com.navigationdemo.fileprovider",outputImage);//查找存储在File对象中的图片URL地址
            }else {
                imageUri = Uri.fromFile(outputImage);
            }


            System.out.println("imageUri:"+imageUri);

            //启动相机程序
            Intent intent = new Intent("android.media.action.IMAGE_CAPTURE");
            intent.putExtra(MediaStore.EXTRA_OUTPUT,imageUri);
            startActivityForResult(intent,TAKE_PHOTO);

            System.out.println("imageUri2:"+imageUri);

            try {
                //将拍摄的图片显示出来
                Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver().
                        openInputStream(imageUri));
                editpic(bitmap);
            } catch (FileNotFoundException e) {
                e.printStackTrace();
                System.out.println("imageUri3333333333333:"+imageUri);
            }
        }

        //录入�?
//        else if(id == R.id.luru){
//            // 显示选中项�?
//            EditText editone = findViewById(R.id.tiankong);
//            String editoneValue = editone.getText().toString();
//            System.out.println("填空的内�?:"+editoneValue);
//            HttpActivity.stuSaveAnswer(editoneValue);
//        }


        //消息�?
        else if(id == R.id.submit_mess){
            //显示选中�?
            EditText editone = findViewById(R.id.message_input);
            String editoneValue = editone.getText().toString();
            System.out.println("聊天打出的内�?:"+editoneValue);
            if(editoneValue.length()==0||editoneValue.equals("消息不允许为空")){
                mMessageInput.setEnabled(false);
                mMessageInput.setText("消息不允许为空");
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        mMessageInput.setEnabled(true);
                        mMessageInput.setText("");
                    }
                }, 1000);
            }
            else{
                HttpActivity.saveChatRoomMessage(editoneValue);
                //mMessageInput.setText("");
            }
            if(AnswerActivity.chatStatus.equals("1")){
                mMessageInput.setEnabled(false);
                mMessageInput.setText(AnswerActivity.chatMessage);
                new Handler().postDelayed(new Runnable() {
                    @Override
                    public void run() {
                        mMessageInput.setEnabled(true);
                        mMessageInput.setText("");
                    }
                }, 1000);
            }
            else{
                mMessageInput.setText("");
            }
        }
    }


    public static class TRTCCloudImplListener extends TRTCCloudListener {

        private WeakReference<LaunchActivity> mContext;

        public TRTCCloudImplListener(LaunchActivity activity) {
            super();
            mContext = new WeakReference<>(activity);
        }


//        public static void onUserVideoAvailable_static(String userId, boolean available) {
//            Log.d(TAG, "onUserVideoAvailable_static userId " + userId + ", mUserCount " + mUserCount + ",available " + available);
//            int index = mRemoteUidList.indexOf(userId);
//            System.out.println("onUserVideoAvailable_static:"+userId);
//            if (available) {
//                if (index != -1) {
//                    return;
//                }
//                mRemoteUidList.add(userId);
//                refreshRemoteVideoViews();
//            } else {
//                if (index == -1) {
//                    return;
//                }
//                //mTRTCCloud.stopRemoteView(userId);
//                mRemoteUidList.remove(index);
//                refreshRemoteVideoViews();
//            }
//
//        }

        @Override
        public void onUserVideoAvailable(String userId, boolean available) {
            Log.d(TAG, "onUserVideoAvailable userId " + userId + ", mUserCount " + mUserCount + ",available " + available);
            System.out.println("onUserVideoAvailable userId " + userId + ", mUserCount " + mUserCount + ",available " + available);
            int index = mRemoteUidList.indexOf(userId);
            System.out.println("onUserVideoAvailable:"+userId);
//            if (userId.equals(mTeacherId+"_camera")&&!available){
//                System.out.println("mingming_camera exit room");
//                exitRoom();
//                teacher_enable=false;
//                return;
//            }
            if (available) {
                if (index != -1) {
                    return;
                }
                mRemoteUidList.add(userId);
                refreshRemoteVideoViews();
            } else {
                if (index == -1) {
                    return;
                }
                mRemoteUidList.remove(index);
                refreshRemoteVideoViews();
            }
            for(int i =0;i<mRemoteUidList.size();i++){
                System.out.println(mRemoteUidList.get(i)+" : "+mRemoteViewList.get(i));
            }

        }

        @Override
        public void onRemoteUserEnterRoom(String userId){
            System.out.println("onRemoteUserEnterRoom userId " + userId );

        }

        @Override
        public void onRemoteUserLeaveRoom(String userId, int reason){
            System.out.println("onRemoteUserLeaveRoom userId " + userId );
            if (userId.equals(mTeacherId+"_camera")){
                System.out.println("mingming_camera exit room");
                exitRoom();
                teacher_enable=false;
                return;
            }

        }

        public static void refreshPlatform(){
            System.out.println("refreshPlatform platformUserId:"+AnswerActivity.platformUserId);
            String[] ids = null;
            if(HttpActivity.platformUserId!=null){
                ids = AnswerActivity.platformUserId.split(",");
                for(int i=0;i<ids.length;i++){
                    System.out.println("name:"+ids[i].split("_")[0]);
                }
            }
            for(int i =0;i<mRemoteUidList.size();i++){
                System.out.println("mRemoteUidList["+i+"]"+mRemoteUidList.get(i));
                int flag = 0;
                int id = 0;
                if(ids!=null){
                    for(int j=0;j<ids.length;j++){
                        System.out.println("name:"+ids[j].split("_")[0]);
                        if(mRemoteUidList.get(i).equals(ids[j].split("_")[0])){
                            flag=1;
                            System.out.println("mRemoteUidList is on----"+ i + "-------"+ mRemoteUidList.get(i));

                        }
                        if(mRemoteUidList.get(i).contains("share")||mRemoteUidList.get(i).contains("_camera")){
                            System.out.println("contains!!!");
                            flag=1;
                        }
                    }
                }

                if(flag==0){
                    System.out.println("mremote is gone----"+ i + "-------"+ mRemoteUidList.get(i));
                    //mRemoteUidList.get(i).setVisibility(View.GONE);
//                    mRemoteUidList.remove(i);
//                    refreshRemoteVideoViews();
                }


            }

        }

        public static void refreshLocalVideoView() {
            //上讲台：自己进入房间
            System.out.println("before myself enterroom:"+mUserId);
            System.out.println("before myself enterroom platformUserId:"+AnswerActivity.platformUserId);

            if(HttpActivity.platformUserId!=null){
                String[] ids = AnswerActivity.platformUserId.split(",");
                for(int i=0;i<ids.length;i++){
                    System.out.println("name:"+ids[i].split("_")[0]);
                }
            }


            if(HttpActivity.platformUserId!=null && mUserId.equals(HttpActivity.platformUserId.split("_")[0])){
                mTXCVVLocalPreviewView.setVisibility(GONE);
                //mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
                //mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
            }
//            else{
//                mTRTCCloud.stopLocalPreview();
//                mTRTCCloud.stopLocalAudio();
//            }
        }

        public static void refreshRemoteVideoViews() {
            System.out.println("refreshRemoteVideoViews:"+AnswerActivity.platformUserId);
            mTeacherCamera_name.bringToFront();

            String[] ids = null;

            int flagp = 0;
            if(HttpActivity.platformUserId!=null){
                ids = AnswerActivity.platformUserId.split(",");
                for(int i=0;i<ids.length;i++){
                    if(ids[i].length()>0){
                        System.out.println("id:"+ids[i].split("_")[0]);
                        System.out.println("name:"+ids[i].split("_")[1]);
                        id_name_map.put(ids[i].split("_")[0],ids[i].split("_")[1]);
                        if(HttpActivity.platformUserId!=null && mUserId.equals(ids[i].split("_")[0])) {
                            flagp = 1;
                        }
                    }
                }
                if(flagp==0){
                    mPlatform.setVisibility(View.GONE);
                    if(mButtonHandOnPlatform!=null){
                        mButtonHandOnPlatform.setVisibility(View.GONE);
                    }
                    if(mButtonHand!=null){
                        mButtonHand.setSelected(true);
                    }
                    BottomButtonActivity.muteHand();
                }
                else{
                    mPlatform.bringToFront();
                    mPlatform.setVisibility(View.VISIBLE);
                    mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
                    mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
                    HttpActivity.testRaiseHandAction("down");//放手下讲
                    mButtonHandOnPlatform.bringToFront();
                    mButtonHandOnPlatform.setVisibility(View.VISIBLE);

                }
            }

            stu_index = 0;

            for (int i = 0; i < mRemoteViewList.size(); i++) {
                if (i < mRemoteUidList.size()) {
                    System.out.println("mRemoteViewList["+i+"]"+mRemoteViewList.get(i));
                    System.out.println("mRemoteUidList["+i+"]"+mRemoteUidList.get(i));
                    String remoteUid = mRemoteUidList.get(i);

                    //teacher-share  "xxx_share" "share_xxx"
                    if(remoteUid.contains("_share")){
                        mTeacherShare.setVisibility(View.VISIBLE);
                        mTRTCCloud.setRemoteRenderParams(remoteUid,TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FIT,trtcRenderParams);
                        mTRTCCloud.startRemoteView(remoteUid, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG,mTeacherShare);
                    }

                    //teacher-camera
                    else if(remoteUid.contains("_camera")){
                        //mTeacherCamera_name.setText(id_name_map.get(remoteUid));
                        mTeacherCamera_name.setText(mTeacherCn);
                        mTeacherCamera.setVisibility(View.VISIBLE);
                        mTRTCCloud.startRemoteView(remoteUid, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL,mTeacherCamera);
                        mTRTCCloud.muteRemoteAudio(remoteUid, false);
                        mTeacherCamera.bringToFront();
                        mTeacherCamera_name.bringToFront();
                    }

                    //student_1/2/3/4/5/6
                    else{
                        int flag = 0;
                        int id = 0;
                        if(ids!=null){
                            for(int j=0;j<ids.length;j++){
                                System.out.println("patforid:"+ids[j].split("_")[0]);
                                if(mRemoteUidList.get(i).equals(ids[j].split("_")[0])){
                                    flag=1;
                                    System.out.println("mRemoteUidList is on----"+ i + "-------"+ mRemoteUidList.get(i));

                                }
                            }
                        }
                        //该名学生在讲台上
                        if(flag==1){
                            ConstraintLayout view_temp = stu_map_div.get(stu_index);
                            view_temp.setVisibility(View.VISIBLE);

                            TXCloudVideoView temp =stu_map.get(stu_index);
                            temp.setVisibility(View.VISIBLE);

                            TextView temp_name = stu_name_map.get(stu_index);
                            //temp_name.setText(mRemoteUidList.get(i));
                            temp_name.setText(id_name_map.get(remoteUid));
                            temp_name.bringToFront();
                            stu_index++;
                            mTRTCCloud.startRemoteView(remoteUid, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL,temp);
                            mTRTCCloud.muteRemoteAudio(remoteUid,false);
                        }
                        //该名学生不在讲台上
                        else{
                            ConstraintLayout view_temp = stu_map_div.get(stu_index);
                            view_temp.setVisibility(View.GONE);

                            TXCloudVideoView temp =stu_map.get(stu_index);
                            temp.setVisibility(View.GONE);
                            TextView temp_name = stu_name_map.get(stu_index);
                            //temp_name.setText(" ");
                            System.out.println("mRemoteUidList is on----"+ i + "-------"+ mRemoteUidList.get(i));
                            mTRTCCloud.stopRemoteView(remoteUid,TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL);
                            mTRTCCloud.muteRemoteAudio(remoteUid,true);
                        }


                    }
                } else {
                    mRemoteViewList.get(i).setVisibility(GONE);
                }
                mTeacherCamera_name.bringToFront();
            }
            mTeacherCamera_name.bringToFront();



        }

        @Override
        public void onError(int errCode, String errMsg, Bundle extraInfo) {
            Log.d(TAG, "sdk callback onError");
            LaunchActivity activity = mContext.get();
            if (activity != null) {
                Toast.makeText(activity, "onError: " + errMsg + "[" + errCode+ "]" , Toast.LENGTH_SHORT).show();
                if (errCode == TXLiteAVCode.ERR_ROOM_ENTER_FAIL) {
                    activity.exitRoom();
                }
            }
        }
    }

    /*为了方便这个类是写在MainActivity里作为内部类�?*/
    class ChatAdapter extends RecyclerView.Adapter<ChatAdapter.ChatViewHolder> {
        private List<ChatBean> chatBeanList;
        private LayoutInflater inflater;

        public ChatAdapter(Context context,List<ChatBean> chatBeans){
            this.chatBeanList=chatBeans;
            this.inflater=LayoutInflater.from(context);
        }

        @Override
        //public ChatViewHolder onCreateViewHolder(ViewGroup parent, int viewType)
        public ChatViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
            ChatViewHolder holder;
            //根据ViewType值创建不同的ViewHolder
            // 1:教师
            if(viewType==1) {
                holder = new ChatViewHolder(LayoutInflater.from(
                        LaunchActivity.this).inflate(R.layout.item_response, parent,
                        false));
            }

            // 3:自己
            else if(viewType==3) {
                holder = new ChatViewHolder(LayoutInflater.from(
                        LaunchActivity.this).inflate(R.layout.item_send, parent,
                        false));
            }
            // 2:远端学生
            else{
                holder = new ChatViewHolder(LayoutInflater.from(
                        LaunchActivity.this).inflate(R.layout.item_response, parent,
                        false));
            }
            return holder;
        }

        @Override
        public int getItemViewType(int position) {
            return chatBeanList.get(position).getType();//**返回集合Bean里的值作为标记值将传递到onCreateViewHolder�?
        }

        @Override
        public void onBindViewHolder(ChatViewHolder holder, int position) {
            //这里只是简单的实现了设置聊天内容并未对头像处理
            // 1:教师
            if(chatBeanList.get(position).getType()==1) {
                System.out.println("getMessageStuget:"+chatBeanList.get(position).getMessageStuget());
                holder.tvResponse.setText(chatBeanList.get(position).getMessageStuget());
                holder.tvResopenseNameTime.setText(chatBeanList.get(position).getNameStuget()+" "+chatBeanList.get(position).getTimeStr());
                holder.ivResponse.setImageDrawable(chatBeanList.get(position).getDrawable());
                holder.tvResponse.setTextColor(Color.parseColor("#56C3EC"));
                holder.tvResopenseNameTime.setTextColor(Color.parseColor("#56C3EC"));
            }

            // 3:自己
            else if(chatBeanList.get(position).getType()==3) {
                System.out.println("getMessageStuget333:"+chatBeanList.get(position).getMessageStuget());
                holder.tvSend.setText(chatBeanList.get(position).getMessageStuget());
                holder.tvSendNameTime.setText(chatBeanList.get(position).getNameStuget()+" "+chatBeanList.get(position).getTimeStr());
                //holder.ivSend.setImageDrawable(chatBeanList.get(position).getDrawable());
                System.out.println("phone_user:"+mUserPhoto);
                holder.ivSend.setImageDrawable(HttpActivity.mydrawable);
            }
            // 2:远端学生
            else {
                System.out.println("getMessageStuget222:"+chatBeanList.get(position).getMessageStuget());
//                holder.tvResponse.setText(chatBeanList.get(position).getMessageStuget());
//                holder.tvResopenseNameTime.setText(chatBeanList.get(position).getNameStuget()+" "+chatBeanList.get(position).getTimeStr());
//                holder.ivResponse.setImageDrawable(chatBeanList.get(position).getDrawable());
                holder.tvResponse.setText(chatBeanList.get(position).getMessageStuget());
                holder.tvResopenseNameTime.setText(chatBeanList.get(position).getNameStuget()+" "+chatBeanList.get(position).getTimeStr());
                holder.ivResponse.setImageDrawable(chatBeanList.get(position).getDrawable());
//                holder.tvResponse.setTextColor(Color.parseColor("#56C3EC"));
//                holder.tvResopenseNameTime.setTextColor(Color.parseColor("#56C3EC"));
            }
        }

        @Override
        public int getItemCount() {
            return chatBeanList.size();
        }
        //简单实现的ViewHolder，开发中最好再做些优化可以参考上一�?
        class ChatViewHolder extends RecyclerView.ViewHolder {

            TextView tvResponse;
            TextView tvSend;
            TextView tvResopenseNameTime;
            TextView tvSendNameTime;
            ImageView ivResponse;
            ImageView ivSend;

            public ChatViewHolder(View view) {
                super(view);
                tvResponse = (TextView) view.findViewById(R.id.tv_resopense);
                tvSend=(TextView)view.findViewById(R.id.tv_send);
                tvResopenseNameTime=(TextView)view.findViewById(R.id.tv_resopense_name_time);
                tvSendNameTime=(TextView)view.findViewById(R.id.tv_send_name_time);
                ivResponse=(ImageView)view.findViewById(R.id.iv_response);
                ivSend=(ImageView)view.findViewById(R.id.iv_send);
            }
        }



    }


    //拍照主观题
    protected void editpic(Bitmap bitmap){
        try {
//                Field field = R.drawable.class.getDeclaredField("google_earth");
//                int resourceId = Integer.parseInt(field.get(null).toString());
//                Bitmap bitmap = BitmapFactory.decodeResource(getResources(),
//                        resourceId);
            bitmap = transbase64(bitmap);
            subjective_scroll.setVisibility(View.VISIBLE);
            subjective_scroll.bringToFront();
            ImageSpan imageSpan = new ImageSpan(bitmap);
            SpannableString spannableString = new SpannableString("'"+base64_index+"'");
            //SpannableString spannableString = new SpannableString("a");
            //SpannableString spannableString = new SpannableString("pic"+String.valueOf(base64_index));

            spannableString.setSpan(imageSpan, 0, String.valueOf(base64_index).length()+2, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            //base64_index++;
            //spannableString.setSpan(imageSpan, 0, 1, Spannable.SPAN_EXCLUSIVE_EXCLUSIVE);
            //subjective_answer.append(spannableString);
            subjective_echo.append(spannableString);
        } catch (Exception e) {
            e.printStackTrace();
        }


    }
    /*****************************************************************************************************************/
    private Bitmap transbase64(Bitmap bitmap) {
        int src_w = bitmap.getWidth();
        int src_h = bitmap.getHeight();

        int scroll_w = subjective_echo.getMeasuredWidth();
        int scroll_h = subjective_echo.getMeasuredHeight();
        //2160*1080 4608*3456
        System.out.println("src_w:"+src_w);
        System.out.println("src_h:"+src_h);

        float subjective_answer_height = subjective_answer.getMeasuredHeight()/2;
        float wh = src_w/src_h;

        float new_src_w;
        float new_src_h;

        if(src_w>scroll_w){
            new_src_w = (float) 0.3;
            new_src_h = (float) 0.3;
        }
        else if(src_h>scroll_h){
            new_src_w = (float) 0.3;
            new_src_h = (float) 0.3;
        }
        else{
            new_src_w = (float) 1.2;
            new_src_h = (float) 1.2;
        }

        Matrix matrix = new Matrix();
        matrix.postScale(new_src_w, new_src_h);
        Bitmap bihuanbmp = Bitmap.createBitmap(bitmap, 0, 0, src_w, src_h, matrix,true);

        if((src_w>2160)||(src_h>1080)){
            System.out.println("readContent small :");
            matrix = new Matrix();
            matrix.postScale((float) 0.2, (float) 0.2);
            Bitmap temp = Bitmap.createBitmap(bitmap, 0, 0, src_w, src_h, matrix,true);
            bitmap = temp;
            bihuanbmp = temp;
        }

        System.out.println("readContent:");
        String httpreturn = HttpActivity.readContentFromPost(bitmap);

        System.out.println("httpreturn:"+ httpreturn);
        return bihuanbmp;
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

    protected void onActivityResult(int requestCode,int resultCode,Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        switch (requestCode) {
            case 1:
                if (resultCode == RESULT_OK) {
                    try {
                        //将拍摄的图片显示出来
                        Bitmap bitmap = BitmapFactory.decodeStream(getContentResolver().
                                openInputStream(imageUri));
                        editpic(bitmap);
                    } catch (FileNotFoundException e) {
                        e.printStackTrace();
                    }
                }
                break;
            case 2:
                if(resultCode == RESULT_OK){
                    //判断手机系统版本号
                    if(Build.VERSION.SDK_INT >= 19){
                        //4.4以上系统使用此方法处理图片
                        handleImageOnKitKat(data);
                    }else{
                        //4.4以下系统使用此方法处理图片
                        handleImageBeforeKitKat(data);
                    }
                }
            default:
                break;
        }
    }
    /*****************************************************************************************************************/
    private void handleImageBeforeKitKat(Intent data) {
        Uri uri=data.getData();
        String imagePath = getImagePath(uri,null);
        try {
            displayImage(imagePath);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    private void handleImageOnKitKat(Intent data) {         //返回图片URL路径
        String imagePath = null;
        Uri uri = data.getData();
        if(DocumentsContract.isDocumentUri(this,uri)){
            //如果是document类型的Uri，则通过document id处理
            String docId = DocumentsContract.getDocumentId(uri);
            if("com.android.providers.media.documents".equals(uri.getAuthority())){
                String id=docId.split(":")[1];//解析出数字格式的id
                String selection=MediaStore.Images.Media._ID+"="+id;
                imagePath=getImagePath(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,selection);
            }else if("com.android.providers.downloads.documents".equals(uri.getAuthority())){
                Uri contentUri= ContentUris.withAppendedId(Uri.parse("content:" +
                        "//downloads/public_downloads"),Long.valueOf(docId));
                imagePath=getImagePath(contentUri,null);
            }else if("context".equalsIgnoreCase(uri.getScheme())){
                //如果是content类型的Uri，则用普通方式处理
                imagePath=getImagePath(uri,null);
            }else if("file".equalsIgnoreCase(uri.getScheme())){
                //如果是file类型的Uri，直接获取图片路径即可
                imagePath = uri.getPath();
            }
            try {
                displayImage(imagePath);//根据图片路径显示图片
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
    }

    private String getImagePath(Uri uri, String selection) {
        String path=null;
        //通过Uri和selection来获取真实的图片路径
        Cursor cursor = getContentResolver().query(uri,null,selection,null,null);
        if(cursor != null){
            if(cursor.moveToFirst()){
                path=cursor.getString(cursor.getColumnIndex(MediaStore.Images.Media.DATA));
            }
            cursor.close();
        }
        return path;
    }
    private void displayImage(String imagePath) throws InterruptedException {
        if(imagePath != null){
            editor=pref.edit();
            editor.putString("data",imagePath);
            imgP=imagePath;
            editor.apply();
            Bitmap bitmap = BitmapFactory.decodeFile(imagePath);
            editpic(bitmap);

        }else {
            Toast.makeText(this,"fail to get image",Toast.LENGTH_SHORT).show();
        }
    }

    private void openAlbum(){
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("image/*");
        intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivityForResult(intent,CHOOSE_PHOTO);    //打开相册
    }

    public void onRequestPermissionsResult(int requestCode,String[] permissions,int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
            case 1:
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    openAlbum();
                } else {
                    Toast.makeText(this, "You denied this permission", Toast.LENGTH_SHORT).show();
                }
                break;
            default:
        }
    }
}
