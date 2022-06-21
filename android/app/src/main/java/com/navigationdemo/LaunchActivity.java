package com.navigationdemo;

import static android.view.View.GONE;

import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.os.Bundle;
import android.os.Handler;
import android.text.TextUtils;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.ScrollView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.Group;
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

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Timer;
import java.util.TimerTask;

//import callvideo.AnswerActivity;
//import callvideo.BottomButtonActivity;
//import callvideo.ChatBean;
//import callvideo.HttpActivity;
//import callvideo.SelectUtil;

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
    public static String                          mTeacherCn;

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
    public static Button tf_submit,single_submit,multi_submit,subjective_submit;
    public static ConstraintLayout current_answer;//当前答题界面
    public static Boolean openWords_flag=false;

    public static Handler handler;
    //public static Runnable runnableUi;
    public static String last_actiontime_answer = "";
    public static String last_actiontime_mic = "";
    public static String last_actiontime_camera = "";
    public static String last_actiontime_words = "";
    public static String last_actiontime_chat = "0000000000000";
    public static String last_platformUserId = "";


    //聊天�?
    public static RecyclerView recyclerView;
    public static int refreshChatFlag=1;

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

        if (checkPermission()) {
            initView();
            initViewBottomButton();
            initViewAnswer();
            initChatRoom();
            enterRoom();
        }

        //先进房间，才能进行举手请�?
        HttpActivity.testJoinOrLeaveRoom("join");

        //按时间间隔捕获教师端消息
        HttpActivity.timer();

        //按时间间隔刷新原生ui界面
        getter();
        //先固定一下聊天室信息内容
        //getchatroom();
    }

    public void getter() {
        Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                handler.post(runnableUi);
            }
        },300,300);
    }

    // 构建Runnable对象，在runnable中更新界�?
    Runnable runnableUi = new Runnable() {
        @Override
        public void run(){
            //更新上下讲台逻辑
            getview();
            //更新互动答题界面
            getteacher();
            //更新聊天室界�?
            getchatroom();
        }

    };
    //更新上下讲台逻辑
    private static void getview(){
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
                if(last_actiontime_answer.equals(AnswerActivity.questionTime)){
                    return;
                }
                else{
                    last_actiontime_answer=AnswerActivity.questionTime;
                }
                if(AnswerActivity.questionAction.equals("startAnswer")) {
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
                else if(AnswerActivity.questionAction.equals("stopAnswer")){
                    current_answer = null;
                    LaunchActivity.group_tfanswer.setVisibility(GONE);
                    LaunchActivity.group_singleanswer.setVisibility(GONE);
                    LaunchActivity.group_multianswer.setVisibility(GONE);
                    LaunchActivity.group_subjectiveanswer.setVisibility(GONE);
                    LaunchActivity.mGroupButtons.setVisibility(View.VISIBLE);
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
//        if(last_actiontime_chat.compareTo(AnswerActivity.chatTime)<0){
//            last_actiontime_chat=AnswerActivity.chatTime;
//            return;
//        }
//        //1、设置布局管理�?
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
        String[] strArr = params.split("-");
        LaunchActivity.mUserId = strArr[0];
        LaunchActivity.mUserCn = strArr[1];
        LaunchActivity.mRoomId = strArr[2];
        LaunchActivity.mTeacherCn = strArr[3];
        System.out.println("LaunchActivity-userinit:"+LaunchActivity.mUserId);
        System.out.println("LaunchActivity-usercninit:"+LaunchActivity.mUserCn);
        System.out.println("LaunchActivity-roominit:"+LaunchActivity.mRoomId);
        System.out.println("LaunchActivity-mTeacherCn:"+LaunchActivity.mTeacherCn);

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
    }

    //初始化顶部、底部按�?
    private void initViewBottomButton(){
        mTextTitle = findViewById(R.id.tv_room_number);
        //mImageBack = findViewById(R.id.iv_back);
        mExitBack = findViewById(R.id.exitroom);
        mTXCVVLocalPreviewView = findViewById(R.id.myself_camera);//自己摄像�?
        mTXCVVLocalPreviewView_background = findViewById(R.id.myself_background);//自己摄像�?
        mButtonHand = findViewById(R.id.hands);
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

        subjective_answer = findViewById(R.id.tiankong);
        subjective_answer.setOnClickListener(this);
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

        TRTCCloudDef.TRTCParams trtcParams = new TRTCCloudDef.TRTCParams();
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

    private void exitRoom() {
        if (mTRTCCloud != null) {
            mTRTCCloud.stopLocalAudio();
            mTRTCCloud.stopLocalPreview();
            mTRTCCloud.exitRoom();
            mTRTCCloud.setListener(null);
        }
        mTRTCCloud = null;
        TRTCCloud.destroySharedInstance();
        //退出房�?
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
            BottomButtonActivity.touchTeachershare();
        }

        //判断
        else if(id == R.id.tfyes ||id == R.id.tfno
              ||id == R.id.tfsubmit){
            // 显示选中项�?
            if(id == R.id.tfsubmit){
                String checkedValues = SelectUtil.getOne(radios_tf);
                System.out.println("判断选中了：" + checkedValues);
                HttpActivity.stuSaveAnswer(checkedValues);
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
            EditText editone = findViewById(R.id.tiankong);
            String editoneValue = editone.getText().toString();
            System.out.println("填空的内�?:"+editoneValue);
            HttpActivity.stuSaveAnswer(editoneValue);
        }

        //消息�?
        else if(id == R.id.submit_mess){
            //显示选中�?
            EditText editone = findViewById(R.id.message_input);
            String editoneValue = editone.getText().toString();
            System.out.println("聊天打出的内�?:"+editoneValue);
            if(editoneValue.length()==0||editoneValue.equals("消息不允许为�?")){
                mMessageInput.setEnabled(false);
                mMessageInput.setText("消息不允许为�?");
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
                //mTRTCCloud.stopRemoteView(userId);
                mRemoteUidList.remove(index);
                refreshRemoteVideoViews();
            }
            for(int i =0;i<mRemoteUidList.size();i++){
                System.out.println(mRemoteUidList.get(i)+" : "+mRemoteViewList.get(i));
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
            String[] ids = null;
            mCamera_name.setText(mUserCn);
            mCamera_name.bringToFront();
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
                            mPlatform.bringToFront();
                            mPlatform.setVisibility(View.VISIBLE);
                            mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
                            mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
                            HttpActivity.testRaiseHandAction("down");//放手下讲�?
                            mButtonHand.setSelected(false);
                        }
                    }
                }
                if(flagp==0){
//                    mPlatform.bringToFront();
//                    mPlatform.setVisibility(View.VISIBLE);
//                    mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
//                    mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
                    mPlatform.setVisibility(View.GONE);
//                    mTRTCCloud.stopLocalPreview();
//                    mTRTCCloud.stopLocalAudio();
//                    BottomButtonActivity.muteVideo();
                }
//                else{
//                    mPlatform.setVisibility(View.GONE);
//                    mTRTCCloud.stopLocalPreview();
//                    mTRTCCloud.stopLocalAudio();
//                }
            }

            stu_index = 0;
            for (int i = 0; i < mRemoteViewList.size(); i++) {
                if (i < mRemoteUidList.size()) {
                    System.out.println("mRemoteViewList["+i+"]"+mRemoteViewList.get(i));
                    System.out.println("mRemoteUidList["+i+"]"+mRemoteUidList.get(i));
                    String remoteUid = mRemoteUidList.get(i);

                    //teacher-share  "xxx_share" "share_xxx"
                    if(remoteUid.contains("share")){
                        mTeacherShare.setVisibility(View.VISIBLE);
                        mTRTCCloud.startRemoteView(remoteUid, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL,mTeacherShare);
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
                        if(flag==1){
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
                        else{
                            TXCloudVideoView temp =stu_map.get(stu_index);
                            temp.setVisibility(View.GONE);
                            TextView temp_name = stu_name_map.get(stu_index);
                            temp_name.setText(" ");
                            System.out.println("mRemoteUidList is on----"+ i + "-------"+ mRemoteUidList.get(i));
                            mTRTCCloud.stopRemoteView(remoteUid,TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL);
                            mTRTCCloud.muteRemoteAudio(remoteUid,true);
                        }


                    }

                    //System.out.println("aaaaaaaaaaaaaa"+remoteUid);
                } else {
                    mRemoteViewList.get(i).setVisibility(GONE);
                    mTeacherCamera_name.bringToFront();


                }
            }



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
                holder.ivSend.setImageDrawable(chatBeanList.get(position).getDrawable());
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

}
