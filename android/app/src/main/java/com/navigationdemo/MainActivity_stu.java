package com.navigationdemo;


import static android.view.View.GONE;
import com.navigationdemo.AnswerQuestionFragment;
import android.Manifest;
import android.annotation.SuppressLint;
import android.app.Activity;
import android.content.ContentUris;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.content.res.Configuration;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Point;
import android.graphics.drawable.Drawable;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.SystemClock;
import android.preference.PreferenceManager;
import android.provider.DocumentsContract;
import android.provider.MediaStore;
import android.text.Spannable;
import android.text.SpannableString;
import android.text.format.Time;
import android.text.style.ImageSpan;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Gravity;
import android.view.KeyEvent;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.view.Window;
import android.view.WindowManager;
import android.view.inputmethod.EditorInfo;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.CheckBox;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.ListView;
import android.widget.PopupWindow;
import android.widget.ProgressBar;
import android.widget.RelativeLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TableLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.constraintlayout.widget.Group;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;
import androidx.core.content.FileProvider;
import androidx.fragment.app.Fragment;
import androidx.viewpager.widget.ViewPager;

import com.navigationdemo.adapter.HandsUpListViewAdapter;
import com.navigationdemo.adapter.MemberListViewAdapter;
import com.navigationdemo.adapter.SetBrd_TabBarAdapter;
import com.navigationdemo.adapter.TabBarAdapter_stu;
import com.navigationdemo.setBoardFragment.Set_Highlighter_Fragment;
import com.navigationdemo.setBoardFragment.Set_bg_Fragment;
import com.navigationdemo.setBoardFragment.Set_eraser_Fragment;
import com.navigationdemo.setBoardFragment.Set_geometry_Fragment;
import com.navigationdemo.setBoardFragment.Set_more_Fragment;
import com.navigationdemo.setBoardFragment.Set_paint_Fragment;
import com.navigationdemo.setBoardFragment.Set_text_Fragment;
import com.navigationdemo.MyEvent;
import com.navigationdemo.setBoardFragment.Set_Highlighter_Fragment_Stu;
import com.navigationdemo.setBoardFragment.Set_bg_Fragment_Stu;
import com.navigationdemo.setBoardFragment.Set_eraser_Fragment_Stu;
import com.navigationdemo.setBoardFragment.Set_geometry_Fragment_Stu;
import com.navigationdemo.setBoardFragment.Set_more_Fragment_Stu;
import com.navigationdemo.setBoardFragment.Set_paint_Fragment_Stu;
import com.navigationdemo.setBoardFragment.Set_text_Fragment_Stu;
import com.navigationdemo.utils.UriUtils;
import com.google.android.material.tabs.TabLayout;
import com.tencent.cos.xml.CosXmlService;
import com.tencent.cos.xml.CosXmlServiceConfig;
import com.tencent.cos.xml.exception.CosXmlClientException;
import com.tencent.cos.xml.exception.CosXmlServiceException;
import com.tencent.cos.xml.listener.CosXmlProgressListener;
import com.tencent.cos.xml.listener.CosXmlResultListener;
import com.tencent.cos.xml.model.CosXmlRequest;
import com.tencent.cos.xml.model.CosXmlResult;
import com.tencent.cos.xml.transfer.COSXMLUploadTask;
import com.tencent.cos.xml.transfer.TransferConfig;
import com.tencent.cos.xml.transfer.TransferManager;
import com.tencent.cos.xml.transfer.TransferState;
import com.tencent.cos.xml.transfer.TransferStateListener;
import com.tencent.imsdk.v2.V2TIMAdvancedMsgListener;
import com.tencent.imsdk.v2.V2TIMCallback;
import com.tencent.imsdk.v2.V2TIMConversation;
import com.tencent.imsdk.v2.V2TIMGroupInfo;
import com.tencent.imsdk.v2.V2TIMManager;
import com.tencent.imsdk.v2.V2TIMMessage;
import com.tencent.imsdk.v2.V2TIMMessageReceipt;
import com.tencent.imsdk.v2.V2TIMSDKConfig;
import com.tencent.imsdk.v2.V2TIMSDKListener;
import com.tencent.imsdk.v2.V2TIMSendCallback;
import com.tencent.imsdk.v2.V2TIMValueCallback;
import com.tencent.liteav.TXLiteAVCode;
import com.tencent.liteav.device.TXDeviceManager;
import com.tencent.qcloud.core.auth.QCloudCredentialProvider;
import com.tencent.qcloud.core.auth.ShortTimeCredentialProvider;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.teduboard.TEduBoardController;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;
import com.tencent.trtc.TRTCCloudListener;
import com.tencent.trtc.debug.Constant;
import com.tencent.trtc.debug.GenerateTestUserSig;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.lang.ref.WeakReference;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.Vector;

public class MainActivity_stu extends AppCompatActivity implements View.OnClickListener {

    //TRTC   SDKAPPID
    private  int TRTCSDKAPPID = 1400772698;
    private  String TRTCSECRETKEY = "f13ab8df0cb5d17c8582f78fe4d4627f87df224dfda7c2062e9cb7368c0cac1a";

    //即时通信SDKAPPID
    private  int IMSDKAPPID = 1400791138;
    private  String IMSECRETKEY = "ff24b7cf67098baab5ee002c904ffd1d985d1f34ce858086d9c9ab9c515a53df";

    //白板SDKAPPID
    private  int BOARDSDKAPPID = 1400791138;
    private  String BOARDSECRETKEY = "ff24b7cf67098baab5ee002c904ffd1d985d1f34ce858086d9c9ab9c515a53df";

    private static Timer timer;

    private static Handler handlerCount = new Handler();
    private static Runnable runnablere_mBoardaddResouce;
    private static Timer Boardtimer = new Timer();  // 白板定时任务  用于获取转码进度
    private static Timer handsTimer = null;  // 举手倒计时
    private static int handsUpTime = 20; // 举手最长时间

    //Tabbar三个Fragment
    public List<Fragment> mFragmenglist = new ArrayList<>();
    public List<Fragment> getmFragmenglist() {
        return mFragmenglist;
    }
    public void setmFragmenglist(List<Fragment> mFragmenglist) {this.mFragmenglist = mFragmenglist;}

    public final static String TAG = "Ender_MainActivity_stu";
    public static TRTCCloud mTRTCCloud;
    public static TRTCCloudDef.TRTCParams myTRTCParams;
    public static TRTCCloudDef.TRTCRenderParams trtcRenderParams = new TRTCCloudDef.TRTCRenderParams();
    public static TXCloudVideoView mTXCVVTeacherPreviewView;  //教师视频
    public static TXDeviceManager mTXDeviceManager; // TRTC摄像头管理
    public static RelativeLayout teacherTRTCBackground;   //教师视频背景
    public static TXCloudVideoView mTeacherShare;    // 共享屏幕

    public static TXCloudVideoView mTXCVVStudentPreviewView;  //学生视频
    public static RelativeLayout studentTRTCBackground;   //学生视频背景

    public static ImageView boardBtn;     //白板按钮
    public static ImageView canvasBtn;    //文件 按钮  现在是画笔按钮

    public static ImageView contentBtn;  //文件夹按钮  现在是授课内容
    public static ImageView memberBtn;
    public static ImageView handBtn;
    public static ImageView cameraBtn;   //关闭摄像头按钮
    public static ImageView audioBtn;
    public static boolean mIsFrontCamera = true; // 摄像头前后标志位

    public static ImageView class_over_btn;     //下课按钮
    public static TextView teacher_name_view; //显示教师名称
    public static TextView student_name_view; //显示本人名称
    public static ImageView overClassBtn;
    public static Group group_btn;
    public static Timer UIListener;

    public static String mTeacherId;

    public static boolean musicOn = true;
    public static boolean cameraOn = true;


    // 监听用户进入房间
    public static ArrayList<String> mUserList = new ArrayList<String>();
    public static ArrayList<String> mCameraUserList = new ArrayList<String>();
    public static ArrayList<String> mMicrophoneUserList = new ArrayList<String>();
    public static int mUserCount = 0;

    private String MRegion="ap-guangzhou"	;                                          //存储桶配置的大区 	ap-guangzhou
    private String Mbucket = "zjkj-1305170119";                                        //存储桶名称   由bucketname-appid 组成，appid必须填入
    private String MsecretId = "AKIDwjMo371g8MNCpMzZxAHDTagdOxJQIzVr";                 //存储桶   永久密钥 secretId
    private String MsecretKey = "Cev068GOOBqKeolMn095oVFoz5A7xnT3";                    //存储桶    永久密钥 secretKey
    private int bucketSDKappID = 1400791138;  //这里应该是BOARDSDKAPPID


    private  String UserSig ="";                                                        //腾讯服务签名
//  private  String UserSig =GenerateTestUserSig.genTestUserSig(UserId);




    public static String teacherName = "";
    public static String teacherId = "";
    public static String roomid  = "";                                                                              //房间号     自己填写
    public static String roomName ="";                                                                              //房间名称    自己填写
    public static String userId = "";                                                                               //用户ID     mingming
    public static String userCn="";                                                                                 //中文名      明茗
    public static String keTangId = "";                                                                             //课堂id      4193
    public static String keTangName="";                                                                             //课堂名称     明茗初一语文60人班
    public static String userHead = "";     //用户头像
    public static String subjectId = "";                                                                   //学科ID     10007
    public static String cameraState = "";
    public static String microphoneState = "";
    private static String handsState = "down"; //举手状态，up为正在举手，down为手已放下，off为禁止举手
    public String classAlreadtStartTime = "";                                                       //当前课堂已经开始的时间


    private  int SDKappID =GenerateTestUserSig.SDKAPPID;                                                  //SDKAppID

    public static String teaName = "";
    public static String teaHead = "";

    //即时通信相关
    private V2TIMManager v2TIMManager;                                        //IM实例
    private boolean IMLoginresult;                                            //IM登录结果

    //白板左侧菜单栏
    private Boolean menu_l_status=true;                                       //左侧工具栏状态   true 代表展开
    private ImageButton menu01,menu02,menu03,menu04,menu05,menu06,menu07,menu08,menu09,menu10,menu11,menu12; //左侧工具栏图标 按钮
    //白板底部菜单栏
    private Boolean menu_b_status=true;                                        //底部工具栏状态  true 代表展开
    private TextView b_size,b_cur,b_sum,b_chu,b_per;                           //底部工具栏中显示的文字  当前白板缩放比例  当前页数  总页数
    private ImageButton menub01,menub02,menub03,menub04,menub05,menub06,menub07,menub08,menub09,menub10,menub11,menub02_1,menub05_1;
        //聊天消息列表
    private List<Chat_Msg> data = new ArrayList<>();

    //互动白板相关
    private TextView alert_text, upload_btn;                                    //提示白板当前的状态
    private View boardview;                                                     //白板的view
    public static TEduBoardController mBoard;                                  //白板实例
    public TEduBoardController getmBoard() {return this.mBoard;}                //获取到白班实例
    private Boolean BoardStatus=false;                                          //记录白板初始化 状态
    private Boolean addBoardtoFragmentstatus=false;                             //记录白板是否添加到了父容器中
    private FrameLayout.LayoutParams addBoardlayoutParams;                      //添加白板的时候用到的参数
    private FrameLayout Board_container;                                        //显示白板的Fragment
    private ConstraintLayout rf_leftmenu;                                       //白板左侧菜单栏
    private RelativeLayout rf_bottommenu,rf_shoukeneirong,select_resources;     //白板底部菜单栏   中间默认状态布局    选择授课资源布局
    private TEduBoardController.TEduBoardCallback mBoardCallback;               //白板回调
    private ImageButton geometry11,geometry12,geometry13,geometry14,geometry21,geometry22,geometry23,geometry24,geometry31,geometry32,geometry33,geometry34,geometry41,geometry42,geometry43,geometry44,geometry51,geometry52,geometry53,geometry61,geometry62,geometry63;
    private ImageButton teachingtools1,teachingtools2,teachingtools3,teachingtools4,teachingtools5;
    public static Integer cur_paintsize=100,cur_Highlighterpaintsize=450;  //记录当前 画笔 荧光笔粗细用的

    //几何工具和画笔当前颜色控制
    public static Integer  CurPaintColor =-65536;
    public static Integer  CurGeometryColor =-65536;
    public static Integer  CurGeometrySize= 100;

    private PopupWindow pw_selectpaint;                                 //选择画笔 一级弹窗
    private PopupWindow pw_selecgeometry;                               //选择 几何工具  一级弹窗
    private PopupWindow pw_selectteachingtools;                         //选择教学工具   一级弹窗
    private PopupWindow pw_selecteraser;                                //选择橡皮   一级弹窗
    private List<Fragment>  mTabFragmenList = new ArrayList<>();        // 右侧 视频列表 聊天列表  互动课堂  三个tabbar
    private ImageView menu02color,menu03color,menu04color;              // 笔  文字   几何工具  显示右下角选择的颜色
    private TableLayout select_menu_top ,select_menu;
    private RelativeLayout menu01RL,menu02RL,menu03RL,menu04RL,menu05RL,menu06RL,menu07RL,menu08RL,menu09RL,menu10RL,menu11RL,menu12RL;

    private TextView classTitle;
    private TextView classTime;
    private long baseTimer;
    private CosXmlService cosXmlService;                                //初始化 COS Service，获取实例

    // 记录当前文件ID 文件当前页ID，  白板页ID
    private String FileID=null;                     //当前文件ID
    private String CurFileID=null;                  //当前文件页面ID
    private String BoardID="#DEFAULT";              //当前文件ID
    private String CurBoardID=null;                 //当前白板页ID
    private String CurType=null;                    // 初试为空   两种类型  Board和File
    private static Boolean isquestion=false;        //用于记录是不是  题目保存调用快照

    private Button choosefile,uploadfile;                       //选择文件弹窗  选择文件  上传文件 按钮
    private TextView msgTips,filename;                          //选择文件弹窗  提示当前文件名称  提示当前文件状态
    private ProgressBar  proBar;                                //上传文件 进度条
    private ImageView close_select_resources,resupload;         //关闭选择文件弹窗  右上角本地上传
    private Boolean isincludeType  = false;                     //判断文件格式是否上传
    private String curfilepath,curfilename;                     //记录当前文件路径   当前文件名称
    private LinearLayout uploadprogress;                        //选择文件弹窗布局  用来设置Visiable

    //TabBarFragment
    private final ChatRoomFragmentStu chatRoomFragment = new ChatRoomFragmentStu();                       //右侧聊天的Fragment实例
    private final VideoListFragment videoListFragment =  new VideoListFragment();                   //右侧视频列表的Fragment实例
    private final AnswerQuestionFragment answerQuestionFragment = new AnswerQuestionFragment();     //右侧互动答题的Fragment实例

    // 成员列表
    private static View memberPopupView;
    private static ImageView memberPopupCloseBtn;
    private static ListView memberList;
    private static MemberListViewAdapter listViewAdapter;
    private static TextView memberListCountString;
    private Vector<MemberItem> memberDataList;

    // 举手列表
    private View handsUpPopupView;
    private static ImageView handsUpPopupCloseBtn;
    private ListView handsUpList;
    public HandsUpListViewAdapter handsUpListViewAdapter;
    public List<HandsUpItem> handsUpItemList = new ArrayList<>();
    private TextView handBtnBadge;
    public TextView handsUpTimeView;

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
    public static HashMap<Integer,String> base64id_url;
    public static SharedPreferences pref;
    public static SharedPreferences.Editor editor;
    public static ConstraintLayout current_answer;//当前答题界面
    public static Boolean openWords_flag=false;

    public static int TAKE_PHOTO = 1;
    public static final int CHOOSE_PHOTO = 2;
    private String imgP;
    private EditText picture;
    private Uri imageUri;

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

    //进房间逻辑
    public static Boolean teacher_enable=true;


    // UI消息监听器
    public  static Handler UIhandler;
    public  static Handler handler;

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 321) {
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                //如果用户选择禁止，此时程序没有相应权限，执行相应操作
                if (grantResults[0] != PackageManager.PERMISSION_GRANTED) {
                    //如果没有获取权限，那么可以提示用户去设置界面--->应用权限开启权限
                    Toast toast = Toast.makeText(this, "设置界面获取权限", Toast.LENGTH_LONG);
                    toast.setGravity(Gravity.CENTER, 0, 0);
                    toast.show();
                } else {
                    //如果用户同意，此时程序获取到需要的权限，执行希望的操作
                    enterLiveRoom();
                }
            }
        }
    }

    @SuppressLint("HandlerLeak")

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        // 隐藏标题栏 
        requestWindowFeature(Window.FEATURE_NO_TITLE);
        // 隐藏状态栏 
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN,
            WindowManager.LayoutParams.FLAG_FULLSCREEN);
//        多条权限动态获取
        String[] PM_MULTIPLE={
                Manifest.permission.ACCESS_COARSE_LOCATION,Manifest.permission.CAMERA,Manifest.permission.WRITE_CONTACTS
        };

        if(Build.VERSION.SDK_INT>=23) {
            ArrayList<String> pmList = new ArrayList<>();
            //获取当前未授权的权限列表
            for (String permission : PM_MULTIPLE) {
                int nRet = ContextCompat.checkSelfPermission(this, permission);
                if (nRet != PackageManager.PERMISSION_GRANTED) {
                    pmList.add(permission);
                }
            }
            if (pmList.size() > 0) {
                String[] sList = pmList.toArray(new String[0]);
                ActivityCompat.requestPermissions(this, sList, 10000);
            }
        }

       //初始化测试参数
        handleIntent();

        List<MemberDataBean> testList1 = new ArrayList<>();
        mFragmenglist.add(videoListFragment);
        mFragmenglist.add(chatRoomFragment);

        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main_stu);

        TextView class_id_text_view = findViewById(R.id.class_id);
        class_id_text_view.setText("课堂号：" + roomid);

        // 获取CameraView
        mTXCVVTeacherPreviewView = findViewById(R.id.teacher_camera);
        teacherTRTCBackground = findViewById(R.id.teacher_background);

        // 获取StudentCameraView
        mTXCVVStudentPreviewView = findViewById(R.id.student_camera);
        studentTRTCBackground = findViewById(R.id.student_background);

        // 获取ShareView
        mTeacherShare = (TXCloudVideoView)findViewById(R.id.teacher_share);
        mTeacherShare.setOnClickListener(this);
        //白板按钮
        b_size = findViewById(R.id.board_size);
        b_cur =  findViewById(R.id.board_curpage);
        b_sum =  findViewById(R.id.board_sumpage);
        b_chu =  findViewById(R.id.b_chu);
        b_per =  findViewById(R.id.b_per);
        menu01RL = findViewById(R.id.menu01RL);
        menu02RL = findViewById(R.id.menu02RL);
        menu03RL = findViewById(R.id.menu03RL);
        menu04RL = findViewById(R.id.menu04RL);
        menu05RL = findViewById(R.id.menu05RL);
        menu06RL = findViewById(R.id.menu06RL);
        menu07RL = findViewById(R.id.menu07RL);
        menu08RL = findViewById(R.id.menu08RL);
        menu09RL = findViewById(R.id.menu09RL);
        menu10RL = findViewById(R.id.menu10RL);
        menu11RL = findViewById(R.id.menu11RL);
        menu12RL = findViewById(R.id.menu12RL);
        menu02color= findViewById(R.id.menu02color);
        menu03color= findViewById(R.id.menu03color);
        menu04color= findViewById(R.id.menu04color);
        select_menu = findViewById(R.id.select_menu);
        select_menu_top = findViewById(R.id.select_menu_top);

        alert_text = findViewById(R.id.alert_text);


        classTime = findViewById(R.id.class_time);
        classTitle = findViewById(R.id.class_title);

        // 获取底部按钮

        handsUpPopupView = getLayoutInflater().inflate(R.layout.hands_up_pop_window, null);
        handsUpPopupCloseBtn = handsUpPopupView.findViewById(R.id.hands_up_list_pop_close);
        handsUpList = handsUpPopupView.findViewById(R.id.hands_up_list);
        memberPopupView = getLayoutInflater().inflate(R.layout.member_list_pop_window, null);
        memberListCountString = memberPopupView.findViewById(R.id.member_list_pop_title);
        memberPopupCloseBtn = memberPopupView.findViewById(R.id.member_list_pop_close);
        memberList = memberPopupView.findViewById(R.id.member_list);
        group_btn = findViewById(R.id.group_buttons);
        canvasBtn = findViewById(R.id.canvas_btn); //现在是文件图标
        handBtnBadge = findViewById(R.id.hand_btn_badge);
        handsUpTimeView = findViewById(R.id.hand_time);

        boardBtn = findViewById(R.id.board_btn);
        contentBtn = findViewById(R.id.content_btn);
        memberBtn = findViewById(R.id.member_btn);
        handBtn = findViewById(R.id.hand_btn);
        audioBtn = findViewById(R.id.mic_btn);
        cameraBtn = findViewById(R.id.camera_btn);

        teacher_name_view = findViewById(R.id.teacher_name);
        student_name_view = findViewById(R.id.student_name);
        // 初始化布局
        RelativeLayout scroll_block = findViewById(R.id.stroll);
        ViewGroup.LayoutParams scroll_block_params = scroll_block.getLayoutParams();
        if(isTabletDevice(this)) {
            scroll_block_params.width = UtilTools.dip2px(this, 0);
        } else {
            scroll_block_params.width = UtilTools.dip2px(this, 160);
        }
        scroll_block.setLayoutParams(scroll_block_params);

        MainActivity_stu that = this;

        handBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(handsState.equals("down")) {
                    HttpActivityStu.handsUp(userId, roomid, "up", that);
                    handsState = "up";
                    startHandsTimer();
                } else if (handsState.equals("up")) {
                    Log.e(TAG, "----------xgy----------onHandsBtnClick: 手放下被点击了");
                    HttpActivityStu.handsUp(userId, roomid, "down", that);
                    handsState = "down";
                    stopHandsTimer();
                }
            }
        });


        teacher_name_view.setText(teacherName+"老师");
        student_name_view.setText(userCn);
        //文件上传部分按钮
        proBar = findViewById(R.id.proBar);
        msgTips = findViewById(R.id.msgTips);
        filename = findViewById(R.id.filename);



        ImageView exit_btn = findViewById(R.id.exit_btn);
        exit_btn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                exitRoom();
                destroyBoard();
                stopTime();
                finish();
            }
        });


        //白板需要用到的一些组件 初始化
        addBoardlayoutParams  = new FrameLayout.LayoutParams(FrameLayout.LayoutParams.MATCH_PARENT, FrameLayout.LayoutParams.MATCH_PARENT);

//         // 为了 适配屏幕  白板需要用到的参数 初始化

         Board_container = findViewById(R.id.teachingcontent);


         rf_leftmenu = findViewById(R.id.menu_left);
         rf_bottommenu = findViewById(R.id.menu_bottom);
         rf_leftmenu.setVisibility(GONE);
         rf_bottommenu.setVisibility(GONE);

         rf_shoukeneirong = findViewById(R.id.bg_shoukeneirong);

         initTIM();
         initBoard();

        if(menu02!=null&&mBoard!=null&&menu02color!=null){
            menu02.setBackgroundResource(R.mipmap.menu_02_paint1);
            menu02color.setBackground(getResources().getDrawable(R.color.bg_selected_menu));
            menu02color.setImageResource(R.mipmap.text_red);
        }


        // 用于更新UI的handler
        UIhandler = new Handler();
        handler = new Handler() {
            @Override
            public void handleMessage(@NonNull Message msg) {
                super.handleMessage(msg);
                int position = -1;
                switch (msg.what) {
                    case MyEvent.UPDATE_HANDS_UP_TIME:
                        setHandsUpData(String.valueOf(handsUpTime) + "秒后手自动放下");
                        break;
                    case MyEvent.UPDATE_AUDIO_ICON:
                        position = msg.getData().getInt("position");
                        switchMemberListAudioIcon(position);
                        break;
                    case MyEvent.UPDATE_CHAT_ICON:
                        position = msg.getData().getInt("position");
                        switchMemberListChatIcon(position);
                        break;
                    case 4:
                        break;
                    case MyEvent.UPDATE_SPEAKER_ICON:
                        position = msg.getData().getInt("position");
                        switchSpeakerIcon(position);
                        break;
                    case MyEvent.UPDATE_CLASS_TIME:
                        setClassTime((String) msg.obj);
                        break;
                    case MyEvent.UPDATE_MEMBER_LIST:
                        updateMemberList();
                        break;
                    case MyEvent.WHITEBOARD_ADD_RESOURCE:  //处理  白板添加资源 任务
                        Integer type = msg.getData().getInt("type");
                        String url = msg.getData().getString("url");
                        String name = msg.getData().getString("name");
                        break;
                    case MyEvent.WHITEBOARD_ADD_PAGE:  //处理  白板添加资源 任务
                        String title = msg.getData().getString("title");
                        String ResultUrl = msg.getData().getString("url");
                        Integer page = msg.getData().getInt("page");
                        String Resolution = msg.getData().getString("Resolution");
                        TEduBoardController.TEduBoardTranscodeFileResult config = new TEduBoardController.TEduBoardTranscodeFileResult(title,ResultUrl,page,Resolution);
                        mBoard.addTranscodeFile(config,true);
                        break;
                    case MyEvent.STOP_HANDS_UP_TIME:    // 结束计时器
                        HttpActivityStu.handsUp(userId, roomid, "down", that);
                        stopHandsTimer();
                        break;
                    default:
                        break;
                }
            }
        };
        setClassTitle(keTangName);
        // 初始化答题参数
        initQuestionData();
        //初始化存储桶服务
        initViewAnswer();
//        initHandsUpList();
//        initMemberList();
        initTabBarNavigation();
        enterLiveRoom();
        getter();
        // 开启计时器
        startTime();
    }

    @Override
    public void onBackPressed() {
        return;
    }


    public void initQuestionData() {
        last_actiontime_answer = "";
        last_actiontime_mic = "";
        last_actiontime_camera = "";
        last_actiontime_words = "";
        last_actiontime_chat = "0000000000000";
        last_platformUserId = "";
        last_actiontime_startqd = "";
        last_actiontime_stopqd = "";
        base64_index = 0;
    }

    public static void closeUIListener() {
        if(UIListener != null)
            UIListener.cancel();
    }

    public void getter() {
        UIListener = new Timer();
        UIListener.schedule(new TimerTask() {
            @Override
            public void run() {
                handler.post(runnableUi);
                if(!teacher_enable){
                    Log.e(TAG, "run: 监听到老师下课");
                    exitRoom();
                    finish();
                    teacher_enable=true;
                }
            }
        }, 10, 300);
    }

    // 构建Runnable对象，在runnable中更新界�?
    Runnable runnableUi = new Runnable() {
        @Override
        public void run(){
            try{
                //更新互动答题界面
                getteacher();
            }
            catch(NullPointerException e){
                System.out.println("item null");
            }

        }

    };



    //初始化互动答题界面：判断、单选、多选、主�?

    /**
     * 初始化答题界面
     */
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



    /**
     * 接受RN传递的参数
     */
    private void handleIntent() {
        Intent intent = getIntent();
        String params = intent.getStringExtra("params");
        String[] strArr = params.split("-@-");
        userId = strArr[0];
        userCn = strArr[1];
        roomid = strArr[2];
        roomName = strArr[3];
        subjectId = strArr[4];
        keTangId = strArr[5];
        keTangName = strArr[6];
        userHead = strArr[7];
        teacherId = strArr[8];
        teacherName = strArr[9];
        cameraState = strArr[10];
        microphoneState = strArr[11];
        classAlreadtStartTime = strArr[12];
        if (null != intent) {
            if (intent.getStringExtra(Constant.USER_ID) != null) {
                MainActivity_stu.userId = intent.getStringExtra(Constant.USER_ID);
            }
            if (intent.getStringExtra(Constant.ROOM_ID) != null) {
                MainActivity_stu.roomid = intent.getStringExtra(Constant.ROOM_ID);
            }
        }
    }



    /**
     * 设备类型判断
     *
     * @param context 上下文
     * @return true表示设备为平板 false表示设备为手机
     */
    public boolean isTabletDevice(Context context) {
        return (context.getResources().getConfiguration().screenLayout & Configuration.SCREENLAYOUT_SIZE_MASK)>= Configuration.SCREENLAYOUT_SIZE_LARGE;
    }

    public void startTime() {
        MainActivity_stu that = this;
        baseTimer = Long.parseLong(classAlreadtStartTime);
        timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                int time = (int)((System.currentTimeMillis() - that.baseTimer) / 1000);
                if(time < 0) {
                    time = 0;
                }
                String hh = new DecimalFormat("00").format(time / 3600);
                String mm = new DecimalFormat("00").format(time % 3600 / 60);
                String ss = new DecimalFormat("00").format(time % 60);
                String timeFormat = new String(hh + ":" + mm + ":" + ss);
                Message msg = new Message();
                msg.what = MyEvent.UPDATE_CLASS_TIME;
                msg.obj = "已上课 " + timeFormat;
                that.handler.sendMessage(msg);
            }
        }, 0, 1000L);
    }

    public static void stopTime() {
        if(timer != null)
            timer.cancel();
    }

    public void setClassTitle(String title) {
        classTitle.setText(title);
    }

    public void setClassTime(String time) {
        classTime.setText(time);
    }

    public TRTCCloud getmTRTCCloud() {
        return mTRTCCloud;
    }

    public void setHandBtnBadge(int num) {
        if(num > 0) {
            handBtnBadge.setVisibility(View.VISIBLE);
            if(num > 99)
                handBtnBadge.setText("99+");
            else
                handBtnBadge.setText(String.valueOf(num));
        } else {
            handBtnBadge.setText("0");
            handBtnBadge.setVisibility(View.INVISIBLE);
        }
    }

    public void setHandsUpData(String text) {
        handsUpTimeView.setText(text);
    }

    public void switchMemberListAudioIcon(int position) {
        MemberItem item = listViewAdapter.getItem(position);
        if(item != null){
            Log.e(TAG, "switchMemberListAudioIcon: 获取用户item " + item.getName());
            item.setAudioControl(!item.getAudioControl());
//            Toast.makeText(MainActivity_stu.this, "成员 " + position + " 禁音按钮被点击", Toast.LENGTH_SHORT).show();
            listViewAdapter.notifyDataSetChanged();
        } else {
//            Toast.makeText(MainActivity_stu.this, "成员 " + position + " 非法", Toast.LENGTH_SHORT).show();
        }
    }

    public void switchMemberListVideoIcon(int position) {
        MemberItem item = listViewAdapter.getItem(position);
        if(item != null){
            Log.e(TAG, "switchMemberListAudioIcon: 获取用户item " + item.getName());
            item.setVideoControl(!item.getVideoControl());
            listViewAdapter.notifyDataSetChanged();
        } else {
//            Toast.makeText(MainActivity_stu.this, "成员 " + position + " 非法", Toast.LENGTH_SHORT).show();
        }
    }

    public void switchMemberListChatIcon(int position) {
        MemberItem item = listViewAdapter.getItem(position);
        if(item != null){
            item.setChatControl(!item.getChatControl());
//            Toast.makeText(MainActivity_stu.this, "成员 " + position + " 禁言按钮被点击", Toast.LENGTH_SHORT).show();
            listViewAdapter.notifyDataSetChanged();
        } else {
//            Toast.makeText(MainActivity_stu.this, "成员 " + position + " 非法", Toast.LENGTH_SHORT).show();
        }
    }

    public void switchSpeakerIcon(int position) {
        MemberItem item = listViewAdapter.getItem(position);
        if(item != null){
//            this.videoListFragment.setVideo(item.getUserId(),item.getAudioControl(),this, mTRTCCloud );
            item.setSpeakControl(!item.getSpeakControl());
//            Toast.makeText(MainActivity_stu.this, "成员 " + position + " 上讲台按钮被点击", Toast.LENGTH_SHORT).show();
            listViewAdapter.notifyDataSetChanged();
        } else {
//            Toast.makeText(MainActivity_stu.this, "成员 " + position + " 非法", Toast.LENGTH_SHORT).show();
        }
    }

    // 初始化举手列表
    public void initHandsUpList() {
        if(AnswerActivityTea.handsUpList != null) {
            for (int i = 0; i < AnswerActivityTea.handsUpList.size(); i++) {
                handsUpItemList.add(new HandsUpItem(AnswerActivityTea.handsUpList.get(i).getUserType() , AnswerActivityTea.handsUpList.get(i).getName(), AnswerActivityTea.handsUpList.get(i).getUserId(), false));
                Log.e(TAG, "initHandsUpList: "  + AnswerActivityTea.handsUpList.get(i).toString());
            }

        }
        handsUpListViewAdapter = new HandsUpListViewAdapter(this, handsUpList, handsUpItemList);
        handsUpList.setAdapter(handsUpListViewAdapter);

        handsUpListViewAdapter.setOnSpeakerControllerClickListener(new HandsUpListViewAdapter.onSpeakerControllerListener() {
            @Override
            public void onSpeakControllerClick(int i) {
                upToSpeaking(i);
            }
        });
    }


    // 上讲台处理
    public void upToSpeaking(int position) {
        HandsUpItem item = handsUpListViewAdapter.getItem(position);
        // 将消息从请求列表中移除
        handsUpItemList.remove(position);
        // 更新小红点
        setHandBtnBadge(handsUpItemList.size());
        handsUpListViewAdapter.notifyDataSetChanged();

        // 更改MemberList中的状态
        int memberPosition = listViewAdapter.getItemPositionById(item.getUserId());


        if(memberPosition != -1){
            MemberItem memberNow = listViewAdapter.getItem(memberPosition);
//            HttpActivityTea.speakerController(memberNow.getUserId(), item.getName(), "up", position, this);
            memberNow.setUserType(0);
            listViewAdapter.notifyDataSetChanged();
        }
        this.videoListFragment.addCameraView(item.getUserId(), item.getName(), mTRTCCloud);
        this.videoListFragment.changeSpeaker(item.getUserId(), "up");

//        Toast.makeText(this, "举手成员 " + position + " 上讲台被点击了", Toast.LENGTH_SHORT).show();
    }


    // 更新成员列表
    public void updateMemberList() {
        memberDataList.clear();
        if(AnswerActivityTea.joinList != null) {
            for (int i = 0; i < AnswerActivityTea.joinList.size(); i++) {
                memberDataList.addElement(new MemberItem(AnswerActivityTea.joinList.get(i).getName(), AnswerActivityTea.joinList.get(i).getUserId(), 1 ,true, false, true, false, true));
                Log.e(TAG, "initMemberList: " + AnswerActivityTea.joinList.get(i).toString());
            }
        }
        if(AnswerActivityTea.ketangList != null) {
            for (int i = 0; i < AnswerActivityTea.ketangList.size(); i++) {
//                Log.e(TAG, "updateMemberList: get No . " + AnswerActivityTea.ketangList.get(i).toString() + " from size " + AnswerActivityTea.ketangList.size());
                MemberItem memberItemNew = new MemberItem(AnswerActivityTea.ketangList.get(i).getName(), AnswerActivityTea.ketangList.get(i).getUserId(), 0, true, false, true, false, true);
                memberDataList.addElement(memberItemNew);
                Log.e(TAG, "initMemberList: " + AnswerActivityTea.ketangList.get(i).toString());
                if(!videoListFragment.findUserInUserList(AnswerActivityTea.ketangList.get(i).getUserId())) {
                    videoListFragment.addCameraView(AnswerActivityTea.ketangList.get(i).getUserId(),AnswerActivityTea.ketangList.get(i).getName(), mTRTCCloud);
                }
            }
        }
        listViewAdapter.notifyDataSetChanged();
    }

    // 初始化成员列表
    public void initMemberList() {
        Log.e(TAG, "initMemberList: hahahahhahaah");
        memberDataList = new Vector<>();
//        HttpActivityTea.getMemberList(this);

        MainActivity_stu that = this;
        listViewAdapter = new MemberListViewAdapter(this, memberList, memberDataList);
        memberList.setAdapter(listViewAdapter);
//        HttpActivityTea.getMemberList(this);
    }

    public void initTabBarNavigation() {

        //使用适配器将ViewPager与Fragment绑定在一起
        ViewPager viewPager = findViewById(R.id.tar_bar_view_page);
        TabBarAdapter_stu tabBarAdapter_stu = new TabBarAdapter_stu(getSupportFragmentManager());
        if(!isTabletDevice(this)) {
            String[] mTitlesMobile = new String[]{"视频", "聊天"};
            tabBarAdapter_stu.setTitle(mTitlesMobile);
        }
        tabBarAdapter_stu.setmFragment(mFragmenglist);
        viewPager.setAdapter(tabBarAdapter_stu);

        //设置ViewPager的最大缓存数
        viewPager.setOffscreenPageLimit(3);
        //将TabLayout与ViewPager绑定在一起
        TabLayout mTabLayout = findViewById(R.id.tab_bar_table_layout);
        mTabLayout.setupWithViewPager(viewPager,true);

        //指定Tab的位置
        TabLayout.Tab videoList = mTabLayout.getTabAt(0);
        TabLayout.Tab chatRoom = mTabLayout.getTabAt(1);
        TabLayout.Tab answerQuestion = mTabLayout.getTabAt(2);
    }

    // 退出房间
    public static void exitRoom() {
        if (mTRTCCloud != null) {
            mTRTCCloud.stopLocalAudio();
            mTRTCCloud.stopLocalPreview();
            mTRTCCloud.exitRoom();
            mTRTCCloud.setListener(null);
            mTRTCCloud.exitRoom();
        }
        mTRTCCloud = null;
        TRTCCloud.destroySharedInstance();
        HttpActivityStu.stopGetControlMessageTimer();
        MainActivity_stu.stopTime();
        MainActivity_stu.closeUIListener();
        HttpActivityStu.leaveOrJoinClass(userId, roomid, "leave", null);
//        HttpActivityTea.stopHandsUpTimer();



    }

    public static class MyTRTCCloudListener extends TRTCCloudListener {
        private WeakReference<MainActivity_stu> mContext;

        public MyTRTCCloudListener(MainActivity_stu activity) {
            super();
            mContext = new WeakReference<>(activity);
        }

        @Override
        public void onEnterRoom(long result) {
            MainActivity_stu activity = mContext.get();
            if(result > 0) {
                activity.initMemberList();
                Log.e(TAG, "onEnterRoom: 进入房间成功，耗时: " + result);
                Toast.makeText(activity, "进入房间成功，耗时: " + "[" + result+ "]" , Toast.LENGTH_SHORT).show();
            } else {
                Log.e(TAG, "onEnterRoom: 进入房间失败，错误代码：" + result);
                Toast.makeText(activity, "进入房间失败，错误代码: " + "[" + result+ "]" , Toast.LENGTH_SHORT).show();
            }
        }


        @Override
        public void onUserAudioAvailable(String userId, boolean available) {
            MainActivity_stu activity = mContext.get();
            Log.d(TAG, "onUserAudioAvailable userId " + userId + ", mUserCount " + userId + ",available " + available);
            System.out.println("onUserAudioAvailable userId " + userId + ", mUserCount " + userId + ",available " + available);
            System.out.println("onUserVideoAvailable:"+userId);
            Toast.makeText(activity, userId + " 的音频发生了变化", Toast.LENGTH_SHORT).show();
            if(available) {
                if (userId.equals(teacherId+"_camera")) {
                    Toast.makeText(activity, userId + " 用户的音频现在可用", Toast.LENGTH_SHORT).show();
//                    mTRTCCloud.muteRemoteAudio(userId, false);
                    @SuppressLint("UseCompatLoadingForDrawables") Drawable teacher_name_mic_icon = activity.getResources().getDrawable(R.drawable.mic_on);
                    teacher_name_mic_icon.setBounds(0,0,20,20);
                    teacher_name_view.setCompoundDrawables(teacher_name_mic_icon, null, null, null);
                } else {
                    activity.videoListFragment.setAudio(userId, true, activity.mTRTCCloud);
                    int userPosition = listViewAdapter.getItemPositionById(userId);
                    activity.switchMemberListAudioIcon(userPosition);
                }
            }
            else {
                if (userId.equals(teacherId+"_camera")) {
                    Toast.makeText(activity, userId + " 用户的音频现在禁用", Toast.LENGTH_SHORT).show();
//                    mTRTCCloud.muteRemoteAudio(userId, true);
                    @SuppressLint("UseCompatLoadingForDrawables") Drawable teacher_name_mic_icon = activity.getResources().getDrawable(R.drawable.mic_off);
                    teacher_name_mic_icon.setBounds(0,0,20,20);
                    teacher_name_view.setCompoundDrawables(teacher_name_mic_icon, null, null, null);
                } else {
                    mUserList.remove(userId);
                }
            }
        }
        @Override
        public void onUserSubStreamAvailable(String userId, boolean available) {
            MainActivity_stu activity = mContext.get();
//            Toast.makeText(activity, userId + " 的子视频流现在 " + available, Toast.LENGTH_SHORT).show();
            if(available){
                mTeacherShare.bringToFront();
                mTeacherShare.setVisibility(View.VISIBLE);
                mTRTCCloud.setRemoteRenderParams(userId,TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FIT,trtcRenderParams);
                mTRTCCloud.startRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB,mTeacherShare);
            } else {
                mTRTCCloud.stopRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SUB);
                mTeacherShare.setVisibility(View.INVISIBLE);
            }
        }

        @Override
        public void onUserVideoAvailable(String userId, boolean available) {
            MainActivity_stu activity = mContext.get();
            Log.d(TAG, "onUserVideoAvailable userId " + userId + ", mUserCount " + mUserCount + ",available " + available);
//            Toast.makeText(activity, "onUserVideoAvailable userId " + userId + ", mUserCount " + mUserCount + ",available " + available , Toast.LENGTH_SHORT).show();
            System.out.println("onUserVideoAvailable userId " + userId + ", mUserCount " + mUserCount + ",available " + available);
            System.out.println("onUserVideoAvailable:"+userId);
//            if (userId.equals(mTeacherId+"_camera")&&!available){
//                System.out.println("mingming_camera exit room");
//                exitRoom();
//                teacher_enable=false;
//                return;
//            }
//            Toast.makeText(activity, userId + " 的子视频流现在 " + available, Toast.LENGTH_SHORT).show();
            if(available) {
                if(userId.contains("_share")){
                    mTeacherShare.bringToFront();
                    mTeacherShare.setVisibility(View.VISIBLE);
                    mTRTCCloud.setRemoteRenderParams(userId,TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FIT,trtcRenderParams);
                    mTRTCCloud.startRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG,mTeacherShare);
                }
                else if (userId.equals(teacherId+"_camera")) {
                    Toast.makeText(activity, userId + " 的视频现在可以使用了", Toast.LENGTH_SHORT).show();
                    mTRTCCloud.muteRemoteVideoStream(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, false);
                    teacherTRTCBackground.setVisibility(View.INVISIBLE);
                } else {
                    mUserList.add(userId);
                }
            }
            else {
                if(userId.contains("_share")){
                    mTRTCCloud.stopRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
                    mTeacherShare.setVisibility(View.INVISIBLE);
                }
                else if (userId.equals(teacherId+"_camera")) {
                    Toast.makeText(activity, userId + " 的视频现在停止使用了", Toast.LENGTH_SHORT).show();
                    mTRTCCloud.muteRemoteVideoStream(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, true);
                    teacherTRTCBackground.setVisibility(View.VISIBLE);
                } else {
                    mUserList.remove(userId);
                }
            }
//            int userPosition = listViewAdapter.getItemPositionById(userId);
//            activity.switchMemberListVideoIcon(userPosition);
            activity.videoListFragment.setVideo(userId, available, mTRTCCloud);

        }

        @Override
        public void onRemoteUserEnterRoom(String userId){
            MainActivity_stu activity = mContext.get();
//            HttpActivityTea.getMemberList(activity);
            Log.e(TAG, "onRemoteUserEnterRoom: userId" + userId );
            System.out.println("onRemoteUserEnterRoom userId " + userId );
//            Toast.makeText(activity, "onRemoteUserEnterRoom userId " + userId , Toast.LENGTH_SHORT).show();
            if (userId.equals(teacherId+"_camera")) {
                mTRTCCloud.startRemoteView(teacherId + "_camera", TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, activity.mTXCVVTeacherPreviewView);
                Toast.makeText(activity, "老师进入教师", Toast.LENGTH_SHORT).show();
                teacherTRTCBackground.setVisibility(View.INVISIBLE);
            } else {
                if(AnswerActivityTea.findMemberInKetangList(userId) != null)
                    activity.videoListFragment.addCameraView(userId, AnswerActivityTea.findMemberInKetangList(userId).getName(), activity.mTRTCCloud);
            }
        }

        @Override
        public void onRemoteUserLeaveRoom(String userId, int reason){
            MainActivity_stu activity = mContext.get();
            System.out.println("onRemoteUserLeaveRoom userId " + userId );
            if (userId.equals(teacherId +"_camera")){
                HttpActivityTea.speakerController(activity.userId, userCn, "down", activity );
                activity.drawAuthority("drawAuthority", "no", userId);
                System.out.println("teacher exit room");
                teacher_enable=false;
                return;
            }
            activity.videoListFragment.leaveRoom(userId, reason, activity, mTRTCCloud);
//            HttpActivityStu.getMemberList(activity);
            Toast.makeText(activity, "onRemoteUserLeaveRoom userId " + userId , Toast.LENGTH_SHORT).show();
        }

        @Override
        public void onError(int errCode, String errMsg, Bundle extraInfo) {
            Log.d(TAG, "sdk callback onError");
            MainActivity_stu activity = mContext.get();
            if (activity != null) {
                Toast.makeText(activity, "onError: " + errMsg + "[" + errCode+ "]" , Toast.LENGTH_SHORT).show();
                Log.e(TAG, "onError: " + errMsg + "[" + errCode+ "]");
                if (errCode == TXLiteAVCode.ERR_ROOM_ENTER_FAIL) {
                    activity.exitRoom();
                }
            }
        }
    }

    public void enterLiveRoom() {

//        Log.e(TAG, "enterLiveRoom: ");

        // 进入教室
        HttpActivityStu.leaveOrJoinClass(userId, roomid, "join", this);

        mTRTCCloud = TRTCCloud.sharedInstance(getApplicationContext());
        mTRTCCloud.setListener(new MyTRTCCloudListener(MainActivity_stu.this));
        mTXDeviceManager = mTRTCCloud.getDeviceManager();

        // 组装TRTC进房参数
//        String userId = "mingming";
        myTRTCParams = new TRTCCloudDef.TRTCParams();
//        myTRTCParams.sdkAppId = GenerateTestUserSig.SDKAPPID;
        myTRTCParams.sdkAppId = TRTCSDKAPPID;
        myTRTCParams.userId = userId;
        myTRTCParams.roomId = Integer.parseInt(roomid);
//        myTRTCParams.userSig = GenerateTestUserSig.genTestUserSig(myTRTCParams.userId);
        GenerateTestUserSig.SDKAPPID = TRTCSDKAPPID;
        GenerateTestUserSig.SECRETKEY = TRTCSECRETKEY;
        myTRTCParams.userSig = GenerateTestUserSig.genTestUserSig(myTRTCParams.userId);
//        myTRTCParams.userSig = "eJwtzMEKgkAUheF3mXXI9eoMKbTQiFoE4WQQ7dSZ4jY0mVoa0btn6vJ8B-4PS7d756UrFjJ0gM2GTUrbhs40cEfZHdzpqZXJypIUC10fQCAEyMdHdyVVunfOOQLAqA3d-iYE*p6HPJgqdOnD-ukooyQNjELZbeQhf7ytKAp7Xc7XBmFXJzxvoyes4nbBvj8x1DFE";


        // 设置订阅模式，SDK将默认不拉取远端的用户声音，但会拉取远端用户视频
        mTRTCCloud.setDefaultStreamRecvMode(false,true);
        // 进入房间
         mTRTCCloud.enterRoom(myTRTCParams, TRTCCloudDef.TRTC_APP_SCENE_VIDEOCALL);


        // 开启音量检测
        mTRTCCloud.enableAudioVolumeEvaluation(300,true);

        // 发布音视频流

        // 设置本地画面的预览模式：设置画面为填充；开启左右镜像
        TRTCCloudDef.TRTCRenderParams myTRTCRenderParams = new TRTCCloudDef.TRTCRenderParams();
        myTRTCRenderParams.fillMode = TRTCCloudDef.TRTC_VIDEO_RENDER_MODE_FILL;
        myTRTCRenderParams.mirrorType = TRTCCloudDef.TRTC_VIDEO_MIRROR_TYPE_AUTO;
        mTRTCCloud.setLocalRenderParams(myTRTCRenderParams);

        // 开启本地摄像头预览
        if(ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
            while (ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVStudentPreviewView);
            }
        } else {
            mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVStudentPreviewView);
        }
        // 开启本地语音频道
        mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);



        if(cameraState.toLowerCase().equals("true")) {
            mTRTCCloud.muteLocalVideo(TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, false);
            cameraOn = true;
            studentTRTCBackground.setVisibility(View.INVISIBLE);
            cameraBtn.getDrawable().setLevel(5);
        } else if (cameraState.toLowerCase().equals("false")){
            mTRTCCloud.muteLocalVideo(TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, true);
            cameraOn = false;
            studentTRTCBackground.setVisibility(View.VISIBLE);
            cameraBtn.getDrawable().setLevel(10);
        }


        // 开启本地麦克风
        if(microphoneState.toLowerCase().equals("true")) {
            mTRTCCloud.muteLocalAudio(false);
            musicOn = true;
            audioBtn.getDrawable().setLevel(5);
        } else if (microphoneState.toLowerCase().equals("false")) {
            mTRTCCloud.muteLocalAudio(true);
            musicOn = false;
            audioBtn.getDrawable().setLevel(10);
        }

//        teacherTRTCBackground.bringToFront();

        // 设置姓名旁的静音标记

        @SuppressLint("UseCompatLoadingForDrawables") Drawable teacher_name_mic_icon = getResources().getDrawable(R.drawable.mic_off);
        teacher_name_mic_icon.setBounds(0,0,20,20);
        teacher_name_view.setCompoundDrawables(teacher_name_mic_icon, null, null, null);

        @SuppressLint("UseCompatLoadingForDrawables") Drawable student_name_mic_icon = getResources().getDrawable(R.drawable.mic_on);
        if(microphoneState.toLowerCase().equals("false")) {
            student_name_mic_icon = getResources().getDrawable(R.drawable.mic_off);
        }
        student_name_mic_icon.setBounds(0,0,20,20);
        student_name_view.setCompoundDrawables(teacher_name_mic_icon, null, null, null);

        // 初始化教师视频
        mTRTCCloud.startRemoteView(teacherId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG,mTXCVVTeacherPreviewView);
        teacherTRTCBackground.setVisibility(View.VISIBLE);

        // 初始化房间信息
        DisplayMetrics dm = new DisplayMetrics();
        getWindowManager().getDefaultDisplay().getMetrics(dm);
        int screenWidth = dm.widthPixels;
        int screenHeight = dm.heightPixels;

        // 开启学生消息监听事件
        HttpActivityStu.startGetControlMessageTimer(roomid, userId, this);
    }


    public void handleOpenCamera(View view) {
        Log.e(TAG, "switchCamera: switchCamera" );
        if(mTRTCCloud!=null){
            if(cameraOn) {
                Log.e(TAG, "switchCamera: close");
//                mTRTCCloud.stopLocalPreview();
                studentTRTCBackground.setVisibility(View.VISIBLE);
                mTRTCCloud.muteLocalVideo(TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, true);
                cameraOn = false;
                cameraBtn.getDrawable().setLevel(10);
            } else {
                Log.e(TAG, "switchCamera: open");
//                mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVStudentPreviewView);
                studentTRTCBackground.setVisibility(View.INVISIBLE);
                mTRTCCloud.muteLocalVideo(TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, false);
                cameraOn = true;
                cameraBtn.getDrawable().setLevel(5);
            }
        }
    }

    public void handleSwitchCamera(View view) {
        mIsFrontCamera = !mIsFrontCamera;
        mTXDeviceManager.switchCamera(mIsFrontCamera);
    }

    public void switchMusic(View view) {
        if(musicOn) {
            mTRTCCloud.muteLocalAudio(true);
//            mTRTCCloud.stopLocalAudio();
            musicOn = false;
            audioBtn.getDrawable().setLevel(10);

            // 设置图标
            @SuppressLint("UseCompatLoadingForDrawables") Drawable teacher_name_mic_icon = getResources().getDrawable(R.drawable.mic_off);
            teacher_name_mic_icon.setBounds(0,0,20,20);
            student_name_view.setCompoundDrawables(teacher_name_mic_icon, null, null, null);
        } else {
//            mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
            mTRTCCloud.muteLocalAudio(false);
            musicOn = true;
            audioBtn.getDrawable().setLevel(5);
            // 设置图标
            @SuppressLint("UseCompatLoadingForDrawables") Drawable teacher_name_mic_icon = getResources().getDrawable(R.drawable.mic_on);
            teacher_name_mic_icon.setBounds(0,0,20,20);
            student_name_view.setCompoundDrawables(teacher_name_mic_icon, null, null, null);
        }
    }

    public void sentToVideoList(Bundle bundle) {
    }

    public void showMemberListBtn(View view) {
        Point point = new Point();
        this.getWindowManager().getDefaultDisplay().getSize(point);
        int popUpWindowWidth = (int) (point.x*0.5);
        int popUpWindowHeight = (int) (point.y * 0.7);
        PopupWindow popupWindow = new PopupWindow(memberPopupView, popUpWindowWidth, popUpWindowHeight, true);
        memberPopupCloseBtn.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                popupWindow.dismiss();
            }
        });
        memberPopupView.measure(View.MeasureSpec.UNSPECIFIED, View.MeasureSpec.UNSPECIFIED);
        int offsetX = - popUpWindowWidth / 4;
        int offsetY = - popUpWindowHeight - (view.getHeight()) - 10;
        popupWindow.showAsDropDown(view, offsetX, offsetY, Gravity.START);
    }

    public void startHandsTimer() {
        MainActivity_stu that = this;
        // 更改按钮图标
//        handBtn.setImageResource(R.drawable.bottom_stuhand_down);
        handBtn.getDrawable().setLevel(5);
        handsUpTimeView.setVisibility(View.VISIBLE);
        handsTimer = new Timer();
        handsTimer.schedule(new TimerTask() {
            @Override
            public void run() {
                Message updateHandsUpTimeMessage = Message.obtain();
                updateHandsUpTimeMessage.what = MyEvent.UPDATE_HANDS_UP_TIME;
                handler.sendMessage(updateHandsUpTimeMessage);
                handsUpTime--;
                if(handsUpTime == 0) {
                    Log.e(TAG, "------xgy-----hansDown: 手放下被触发");
                    handsState = "down";
                    updateHandsUpTimeMessage = Message.obtain();
                    updateHandsUpTimeMessage.what = MyEvent.STOP_HANDS_UP_TIME;
                    handler.sendMessage(updateHandsUpTimeMessage);
                    return;
                }
            }
        }, 0, 1000);
    }

    public void stopHandsTimer() {
//        handBtn.setImageResource(R.drawable.bottom_stuhand_up);
        handBtn.getDrawable().setLevel(10);
        // Timer只能schedule一次，重复使用需要先销毁线程
        if(handsTimer != null) {
            handsUpTime = 20;
            // 更改按钮图标
            handsUpTimeView.setVisibility(View.INVISIBLE);
            handsTimer.cancel();
            handsTimer.purge();
            handsTimer = null;
        }
    }

    //初始化白板
    public void initBoard(){
        // 创建并初始化白板控制器
        //（1）鉴权配置
        System.out.println("+++开始初始化白板");
        mBoard=null;
        mBoardCallback=null;
        GenerateTestUserSig.SDKAPPID = BOARDSDKAPPID;
        GenerateTestUserSig.SECRETKEY = BOARDSECRETKEY;
        TEduBoardController.TEduBoardAuthParam authParam = new TEduBoardController.TEduBoardAuthParam(
                BOARDSDKAPPID , userId, GenerateTestUserSig.genTestUserSig(userId));
        //（2）白板默认配置
        TEduBoardController.TEduBoardInitParam initParam = new TEduBoardController.TEduBoardInitParam();
        initParam.timSync=false;
        mBoard = new TEduBoardController(this);
        //（3）添加白板事件回调 实现TEduBoardCallback接口
        mBoardCallback = new TEduBoardController.TEduBoardCallback(){
            @Override
            public void onTEBError(int code, String msg) {
                System.out.println("onTEBError"+"+++++++++++++code"+code+msg);
                alert_text.setText("白板加载失败！重新加载");
            }
            @Override
            public void onTEBWarning(int code, String msg) {
                System.out.println("onTEBWarning"+"+++++++++++++code:"+code);
                if(code==7){  //VIDEO_ALREADY_EXISTS
                    System.out.println("onTEBWarning"+"+++++++++++++VIDEO已经存在了:");
                    mBoard.gotoBoard(msg);
                }else if(code==3){  //H5PPT_ALREADY_EXISTS
                    System.out.println("onTEBWarning"+"+++++++++++++H5PPT已经存在了:");
                    mBoard.gotoBoard(msg);
                }else if(code==6){  //H5PPT_ALREADY_EXISTS
                    System.out.println("onTEBWarning"+"+++++++++++++H5FILE已经存在了:");
                    mBoard.gotoBoard(msg);
                }
//                TEduBoardController.TEduBoardWarningCode.TEDU_BOARD_WARNING_IMAGE_MEDIA_BITRATE_TOO_LARGE
            }
            @Override
            public void onTEBInit() {
                System.out.println("onTEBInit"+"++++白板初始化完成了");
                    dealStopDraw();
                ConstraintLayout.LayoutParams params= new ConstraintLayout.LayoutParams(ConstraintLayout.LayoutParams.MATCH_PARENT, ConstraintLayout.LayoutParams.MATCH_PARENT);
                if(findViewById(R.id.boardcontent).getMeasuredWidth()>findViewById(R.id.boardcontent).getMeasuredHeight()){
                    params.setMargins((findViewById(R.id.boardcontent).getMeasuredWidth()-findViewById(R.id.boardcontent).getMeasuredHeight()*16/9)/2,0,(findViewById(R.id.boardcontent).getMeasuredWidth()-findViewById(R.id.boardcontent).getMeasuredHeight()*16/9)/2,0);
                }else {
                    params.setMargins(0,(findViewById(R.id.boardcontent).getMeasuredHeight()-findViewById(R.id.boardcontent).getMeasuredWidth()*9/16)/2,0,(findViewById(R.id.boardcontent).getMeasuredHeight()-findViewById(R.id.boardcontent).getMeasuredWidth()*9/16)/2);
                }
                Board_container.setLayoutParams(params);
                findViewById(R.id.bg_shoukeneirong).setVisibility(View.GONE);
                BoardStatus=true;
                boardview = mBoard.getBoardRenderView();
                initBoardMenu();
                alert_text.setText("白板加载完成！");
                if(!addBoardtoFragmentstatus){
                    addBoardtoFragmentstatus =  mBoard.addBoardViewToContainer(Board_container,boardview,addBoardlayoutParams);
                    mBoard.setToolType(0);
                    rf_shoukeneirong.setVisibility(View.GONE);//默认图片那个消失
                }
            }
            @Override
            public void onTEBHistroyDataSyncCompleted() {
                System.out.println("onTEBHistroyDataSyncCompleted"+"+++++++++++++");
            }
            @Override
            public void onTEBSyncData(String data) {
                final V2TIMMessage Board_message = V2TIMManager.getMessageManager().createCustomMessage(
                        data.getBytes(),                   //data
                        "",                             //description
                        "TXWhiteBoardExt".getBytes());     //extension
                V2TIMManager.getInstance().getConversationManager().getConversation(roomid, new V2TIMValueCallback<V2TIMConversation>() {
                    @Override
                    public void onError(int i, String s) {
                        // 获取回话失败
                        System.out.println("+++获取会话失败"+s+i);
                    }
                    @Override
                    public void onSuccess(V2TIMConversation v2TIMConversation) {
                        V2TIMManager.getInstance().getMessageManager().sendMessage(Board_message, null, roomid, 1, false, null,  new V2TIMSendCallback<V2TIMMessage>() {
                            @Override
                            public void onSuccess(V2TIMMessage v2TIMMessage) {
                                // 发送 IM 消息成功
                                System.out.println("+++发送白板数据成功"+v2TIMMessage.getCustomElem().toString());
                                if(findViewById(R.id.setBoardWindow).getVisibility()==View.VISIBLE){findViewById(R.id.setBoardWindow).setVisibility(View.GONE);}
                            }
                            @Override
                            public void onError(int i, String s) {
                                // 发送 IM 消息失败，建议进行重试
                                System.out.println("+++发送 IM 消息失败，建议进行重试"+s+i);
                                mBoard.syncAndReload();
                            }
                            @Override
                            public void onProgress(int i) {
                            }
                        });
                    }
                });
            }

            @Override
            public void onTEBUndoStatusChanged(boolean canUndo) {
                System.out.println("onTEBUndoStatusChanged"+"+++"+canUndo);

            }

            @Override
            public void onTEBRedoStatusChanged(boolean canRedo) {
                System.out.println("onTEBRedoStatusChanged"+"++++++"+canRedo);
                if(mBoard.getCurrentFile()!=null&&mBoard.getCurrentBoard()!=null&&mBoard.getFileBoardList(mBoard.getCurrentFile())!=null&&mBoard.getFileBoardList(mBoard.getCurrentFile()).size()>1){
                    b_cur.setText((mBoard.getFileBoardList(mBoard.getCurrentFile()).indexOf(mBoard.getCurrentBoard())+1)+"");

                    b_sum.setText(mBoard.getFileBoardList(mBoard.getCurrentFile()).size()+"");
                }
            }

            @Override
            public void onTEBImageStatusChanged(String boardId, String url, int status) {
                System.out.println("onTEBImageStatusChanged"+"+++");

            }

            @Override
            public void onTEBSetBackgroundImage(String url) {
                System.out.println("onTEBSetBackgroundImage"+"+++");
            }

            @Override
            public void onTEBAddImageElement(String url) {
                System.out.println("onTEBAddImageElement"+"+++");
            }

            @Override
            public void onTEBAddElement(String id, int type, String url) {
                System.out.println("onTEBAddElement"+"+++");
            }

            @Override
            public void onTEBDeleteElement(List<String> id) {
                System.out.println("onTEBDeleteElement"+"+++");
            }

            @Override
            public void onTEBSelectElement(List<TEduBoardController.ElementItem> elementItemList) {
                System.out.println("onTEBSelectElement"+"+++");
            }

            @Override
            public void onTEBMathGraphEvent(int code, String boardId, String graphId, String message) {
                System.out.println("onTEBMathGraphEvent"+"+++");
            }

            @Override
            public void onTEBZoomDragStatus(String fid, int scale, int xOffset, int yOffset) {
                //远端白板缩放移动状态回调
                if( mBoard.getBoardScale()>300){
                    mBoard.setBoardScale(300);
                    b_size.setText("300");
                }else {
                    b_size.setText(mBoard.getBoardScale()+"");
                }

            }

            @Override
            public void onTEBBackgroundH5StatusChanged(String boardId, String url, int status) {
                System.out.println("onTEBBackgroundH5StatusChanged"+"+++");
            }

            @Override
            public void onTEBTextElementWarning(String code, String message) {
                System.out.println("onTEBTextElementWarning"+"++++");
            }

            @Override
            public void onTEBImageElementStatusChanged(int status, String currentBoardId, String imgUrl, String currentImgUrl) {
                System.out.println("onTEBImageElementStatusChanged"+"++");
            }

            @Override
            public void onTEBAddBoard(List<String> boardList, String fileId) {
                if(!"#DEFAULT".equals(fileId)){
                    FileID=fileId;
                    CurFileID=null;
                }
            }

            @Override
            public void onTEBDeleteBoard(List<String> boardList, String fileId) {

            }

            @Override
            public void onTEBGotoBoard(String boardId, String fileId) {
                if(BoardID.equals(fileId)){
                    CurType="Board";
                    CurBoardID = boardId;
                }else {
                    CurType="File";
                    CurFileID = boardId;
                }
                b_cur.setText((mBoard.getFileBoardList(fileId).indexOf(boardId)+1)+"");
                b_sum.setText(mBoard.getFileBoardList(fileId).size()+"");
            }

            @Override
            public void onTEBGotoStep(int currentStep, int totalStep) {
                System.out.println("onTEBGotoStep"+"+++++");
            }

            @Override
            public void onTEBRectSelected() {
                System.out.println("onTEBRectSelected"+"++++");
            }

            @Override
            public void onTEBRefresh() {
                System.out.println("onTEBRefresh"+"++++");
            }

            @Override
            public void onTEBOfflineWarning(int count) {
                System.out.println("onTEBOfflineWarning"+"+++");
            }
            @Override
            public void onTEBAddTranscodeFile(String fileId) {
                System.out.println("onTEBAddTranscodeFile"+fileId);
            }
            @Override
            public void onTEBDeleteFile(String fileId) {
                System.out.println("onTEBDeleteFile"+"+++:删除了文件的ID："+fileId);
            }
            @Override
            public void onTEBSwitchFile(String fileId) {
                if(fileId.equals("#DEFAULT")){
 //                 当是白板的时候就要 跳转到之前相应页码数
                    CurType="Board";
                    CurBoardID = mBoard.getCurrentBoard();
                }else {
 //                 当不是白板的时候 记录一下  打开的文件ID
                    CurType="File";
                    if(!fileId.equals(FileID)){
                        //打开的文件不是上一次打开的文件就需要存起来文件ID了
                        FileID=fileId;
                    }
                    CurFileID = mBoard.getCurrentBoard();
                }
            }

            @Override
            public void onTEBFileUploadProgress(String path, int currentBytes, int totalBytes, int uploadSpeed, float percent) {
                System.out.println("onTEBFileUploadProgress"+"+++++");
            }

            @Override
            public void onTEBFileUploadStatus(String path, int status, int errorCode, String errorMsg) {
                System.out.println("onTEBFileUploadStatus"+"++++");
            }

            @Override
            public void onTEBFileTranscodeProgress(String file, String errorCode, String errorMsg, TEduBoardController.TEduBoardTranscodeFileResult result) {
                System.out.println("onTEBFileTranscodeProgress"+"+++++FileTranscodeProgress");
            }

            @Override
            public void onTEBH5FileStatusChanged(String fileId, int status) {
                System.out.println("onTEBH5FileStatusChanged"+"+++++++");
            }

            @Override
            public void onTEBAddImagesFile(String fileId) {
                System.out.println("onTEBAddImagesFile"+"++++++");
            }

            @Override
            public void onTEBVideoStatusChanged(String fileId, int status, float progress, float duration) {
            }

            @Override
            public void onTEBAudioStatusChanged(String elementId, int status, float progress, float duration) {
                System.out.println("onTEBAudioStatusChanged"+"+++++");
            }

            @Override
            public void onTEBSnapshot(String path, int code, String msg) {
                System.out.println("onTEBSnapshot"+"++++白板快照"+path+msg+code);
            }

            @Override
            public void onTEBH5PPTStatusChanged(int statusCode, String fid, String describeMsg) {
                System.out.println("onTEBH5PPTStatusChanged"+"+++");
            }

            @Override
            public void onTEBTextElementStatusChange(String status, String id, String value, int left, int top) {
                System.out.println("onTEBTextElementStatusChange"+"+++++");
            }

            @Override
            public void onTEBScrollChanged(String boardId, int trigger, double scrollLeft, double scrollTop, double scale) {
                System.out.println("onTEBScrollChanged"+"+++");
            }

            @Override
            public void onTEBClassGroupStatusChanged(boolean enable, String classGroupId, int operationType, String message) {
                System.out.println("onTEBClassGroupStatusChanged"+"++");
            }

            @Override
            public void onTEBCursorPositionChanged(Point point) {
                System.out.println("onTEBCursorPositionChanged"+"+++");
            }

            @Override
            public void onTEBElementPositionChange(List<TEduBoardController.ElementItem> elementItemList) {
                System.out.println("onTEBElementPositionChange"+"++++");
            }

            @Override
            public void onTEBPermissionChanged(List<String> permissions, Map<String, List<String>> filters) {
                System.out.println("onTEBPermissionChange"+"++++");
            }

            @Override
            public void onTEBPermissionDenied(String permission) {
                System.out.println("onTEBPermissionDenied"+"++++");
            }
        };


        mBoard.addCallback(mBoardCallback);
        //（4）进行初始化
        mBoard.init(authParam,  Integer.parseInt(roomid), initParam);
        //（2）获取白板 View
        // 初始化白板的按钮功能
        initBoardMenu();
    }

    public void initTIM(){
        System.out.println("++++++初始化IM");
        //初始化 IMSDK
        V2TIMSDKConfig timSdkConfig = new V2TIMSDKConfig();
        IMLoginresult = V2TIMManager.getInstance().initSDK(this, IMSDKAPPID, timSdkConfig, new V2TIMSDKListener() {
            @Override
            public void onConnecting() {
                super.onConnecting();
                System.out.println("+++onConnecting");
            }
            @Override
            public void onConnectSuccess() {
                super.onConnectSuccess();
                System.out.println("+++onConnectSuccess");
                //初始化成功 登录TIM
                LoginTIM();
            }
            @Override
            public void onConnectFailed(int code, String error) {
                super.onConnectFailed(code, error);
                System.out.println("+++onConnectFailed");
            }

            @Override
            public void onKickedOffline() {
                super.onKickedOffline();
                System.out.println("+++onKickedOffline");
            }

            @Override
            public void onUserSigExpired() {
                super.onUserSigExpired();
                System.out.println("+++onUserSigExpired");
            }
        });

    }
    public void LoginTIM(){
        GenerateTestUserSig.SDKAPPID = IMSDKAPPID;
        GenerateTestUserSig.SECRETKEY = IMSECRETKEY;
        V2TIMManager.getInstance().login(userId, GenerateTestUserSig.genTestUserSig(userId), new V2TIMCallback() {
            @Override
            public void onError(int i, String s) {
                System.out.println("++++++登陆失败"+s);
                alert_text.setText("白板加载失败,请重新加载！");
            }
            @Override
            public void onSuccess() {
                System.out.println("++++++登陆IM成功");
                //高级消息监听器
                V2TIMManager.getMessageManager().addAdvancedMsgListener(new V2TIMAdvancedMsgListener() {
                    @Override
                    public void onRecvNewMessage(V2TIMMessage msg) {
                        String Msg_Extension = new String(msg.getCustomElem().getExtension());
                        String Msg_Description = msg.getCustomElem().getDescription();
                        String Msg_Data = new String(msg.getCustomElem().getData());
                        super.onRecvNewMessage(msg);
                        System.out.println("+++学生端收到了消息"+Msg_Extension+"**"+Msg_Description+"**"+Msg_Data);
                        if("TXWhiteBoardExt".equals(Msg_Extension)){
                            //白板消息
                            if(mBoard!=null){
                                mBoard.addSyncData(new String(msg.getCustomElem().getData()));
                            }

                        }else if("TBKTExt".equals(Msg_Extension)){
                            //文本消息
                            System.out.println("+++收到了消息"+Msg_Description);
                            SimpleDateFormat format = new SimpleDateFormat("HH:mm:ss");
                            Chat_Msg msg_rec = new Chat_Msg(Msg_Description.split("@#@")[1],format.format(new Date(msg.getTimestamp()*1000)),new String(msg.getCustomElem().getData()),2,userHead);// type  2 别人 1 自己

                            ChatRoomFragmentStu f = (ChatRoomFragmentStu)getmFragmenglist().get(1);
                            f.setData(msg_rec);

                            f.getChatMsgAdapter().notifyDataSetChanged();
                            f.getChatlv().setSelection(f.getChatlv().getBottom());
                        }else if("drawAuthority".equals(Msg_Extension)){
                            //文本消息
                            System.out.println("+++收到了教师控制学生白板消息"+Msg_Data+Msg_Description+Msg_Extension);
                            if(Msg_Description.startsWith(userId)){
                                if(Msg_Data.equals("yes")){
                                    dealAllowDraw();
                                }else  if(Msg_Data.equals("no")){
                                    dealStopDraw();
                                }
                            }
                        }
                    }
                    @Override
                    public void onRecvC2CReadReceipt(List<V2TIMMessageReceipt> receiptList) {
                        super.onRecvC2CReadReceipt(receiptList);
                    }
                    @Override
                    public void onRecvMessageRevoked(String msgID) {
                        super.onRecvMessageRevoked(msgID);
                    }
                });
                //登陆成功  创建群组
                createGroup();
            }
        });

        //简单消息监听器  弃用  因为要根据 Extension 判断是白板消息 还是 聊天消息
//        V2TIMManager.getInstance().addSimpleMsgListener(new V2TIMSimpleMsgListener() {

    };

    public void createGroup(){
        V2TIMManager.getInstance().createGroup(V2TIMManager.GROUP_TYPE_MEETING, roomid, roomid, new V2TIMValueCallback<String>() {
            @Override
            public void onSuccess(String s) {
                // 创建群组成功
                initBoard();
            }
            @Override
            public void onError(int code, String desc) {
                // 创建群组失败
                if(10021==code){
                    V2TIMManager.getInstance().joinGroup(roomid, roomid, new V2TIMCallback() {
                        @Override
                        public void onSuccess() {
                            // 加群成功
                            initBoard();
                        }
                        @Override
                        public void onError(int i, String s) {
                            // 加群失败
                            if(10013==i){
                                //已经是组员了
                                initBoard();
                            }else {
                                System.out.println("+++++加群失败"+s+i);
                            }
                        }
                    });
                }else if(10025==code){
                    //你创建的群组，已经是组员了
                    initBoard();
                }else {
                    System.out.println("+++创建群组失败！"+desc+"    code："+code);
                }
            }
        });

    }

    //初始化白板的 左侧  底部按钮
    public void initBoardMenu(){

        b_size.setText(mBoard.getBoardScale()+"");
            dealStopDraw();
        //左侧功能栏  第一个按钮  鼠标按钮
        menu01 = findViewById(R.id.menu01);
        menu01.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.setToolType(0);
                setLeftmenustatus(true);
                menu01.setBackgroundResource(R.mipmap.menu_01_mouse1);
            }
        });
        //左侧功能栏  第2个按钮  画笔按钮
        menu02 = findViewById(R.id.menu02);
        menu02.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //设置点击效果
                mBoard.setBrushColor(new TEduBoardController.TEduBoardColor(CurPaintColor));
                mBoard.setBrushThin(cur_paintsize);
                mBoard.setPenAutoFittingMode(TEduBoardController.TEduBoardPenFittingMode.NONE);
                mBoard.setToolType(1);

                setLeftmenustatus(true);
                menu02.setBackgroundResource(R.mipmap.menu_02_paint1);
                menu02color.setBackground(getResources().getDrawable(R.color.bg_selected_menu));
                menu04color.setImageResource(R.color.bg_select_menu);
                menu03color.setImageResource(R.color.bg_select_menu);
                if(mBoard.getBrushColor().toInt()==-7829368){
                    menu02color.setImageResource(R.mipmap.text_gray);
                }else if(mBoard.getBrushColor().toInt()==-16777216){
                    menu02color.setImageResource(R.mipmap.text_black);
                }else if(mBoard.getBrushColor().toInt()==-16776961){
                    menu02color.setImageResource(R.mipmap.text_blue);
                }else if(mBoard.getBrushColor().toInt()==-16711936){
                    menu02color.setImageResource(R.mipmap.text_green);
                }else if(mBoard.getBrushColor().toInt()==-256){
                    menu02color.setImageResource(R.mipmap.text_yellow);
                }else if(mBoard.getBrushColor().toInt()==-65536) {
                    menu02color.setImageResource(R.mipmap.text_red);
                }

                //开启画笔弹窗
                View v_selectpaint = getLayoutInflater().inflate(R.layout.pw_selectpaint,null);
                pw_selectpaint  = new PopupWindow(v_selectpaint,ViewGroup.LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT,true);
                pw_selectpaint.showAsDropDown(findViewById(R.id.menu02),(select_menu.getWidth()+menu02.getWidth())/2+5,-menu02.getHeight());
                ImageButton paint1 = v_selectpaint.findViewById(R.id.paint1);
                ImageButton paint2 = v_selectpaint.findViewById(R.id.paint2);
                ImageButton paint3 = v_selectpaint.findViewById(R.id.paint3);
                paint1.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        mBoard.setToolType(1);
                        mBoard.setBrushThin(cur_paintsize);
                        //默认改变当前右下角颜色
                        if(mBoard.getBrushColor().toInt()==-7829368){
                            menu02color.setImageResource(R.mipmap.text_gray);
                        }else if(mBoard.getBrushColor().toInt()==-16777216){
                            menu02color.setImageResource(R.mipmap.text_black);
                        }else if(mBoard.getBrushColor().toInt()==-16776961){
                            menu02color.setImageResource(R.mipmap.text_blue);
                        }else if(mBoard.getBrushColor().toInt()==-16711936){
                            menu02color.setImageResource(R.mipmap.text_green);
                        }else if(mBoard.getBrushColor().toInt()==-256){
                            menu02color.setImageResource(R.mipmap.text_yellow);
                        }else if(mBoard.getBrushColor().toInt()==-65536) {
                            menu02color.setImageResource(R.mipmap.text_red);
                        }
                        pw_selectpaint.dismiss();
                    }
                });
                paint2.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        mBoard.setToolType(19);
                        mBoard.setHighlighterColor(new TEduBoardController.TEduBoardColor(Color.GREEN));
                        mBoard.setBrushThin(cur_Highlighterpaintsize);  //选了荧光笔就要  设置之前荧光笔  默认的大小
                        menu02color.setBackground(getResources().getDrawable(R.color.bg_selected_menu));

                        //选择荧光笔的时候  默认改变当前右下角颜色     当前SDK版本有问题  后续会更改这个bug
                        if(mBoard.getHighlighterColor().toInt()==2139654280){
                            menu02color.setImageResource(R.mipmap.text_gray);
                        }else if(mBoard.getHighlighterColor().toInt()==2130706432){
                            menu02color.setImageResource(R.mipmap.text_black);
                        }else if(mBoard.getHighlighterColor().toInt()==2130706687){
                            menu02color.setImageResource(R.mipmap.text_blue);
                        }else if(mBoard.getHighlighterColor().toInt()==2130771712){
                            menu02color.setImageResource(R.mipmap.text_green);
                        }else if(mBoard.getHighlighterColor().toInt()==2147483392){
                            menu02color.setImageResource(R.mipmap.text_yellow);
                        }else if(mBoard.getHighlighterColor().toInt()==2147418112) {
                            menu02color.setImageResource(R.mipmap.text_red);
                        }

                        pw_selectpaint.dismiss();
                    }
                });
                paint3.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
//                        松手拟合几何图形
                        mBoard.setBrushThin(cur_paintsize);
                        mBoard.setPenAutoFittingMode(TEduBoardController.TEduBoardPenFittingMode.AUTO);
                        //默认改变当前右下角颜色
                        if(mBoard.getBrushColor().toInt()==-7829368){
                            menu02color.setImageResource(R.mipmap.text_gray);
                        }else if(mBoard.getBrushColor().toInt()==-16777216){
                            menu02color.setImageResource(R.mipmap.text_black);
                        }else if(mBoard.getBrushColor().toInt()==-16776961){
                            menu02color.setImageResource(R.mipmap.text_blue);
                        }else if(mBoard.getBrushColor().toInt()==-16711936){
                            menu02color.setImageResource(R.mipmap.text_green);
                        }else if(mBoard.getBrushColor().toInt()==-256){
                            menu02color.setImageResource(R.mipmap.text_yellow);
                        }else if(mBoard.getBrushColor().toInt()==-65536) {
                            menu02color.setImageResource(R.mipmap.text_red);
                        }
                        pw_selectpaint.dismiss();
                    }
                });
            }
        });
        //左侧功能栏  第3个按钮  文本 按钮
        menu03 = findViewById(R.id.menu03);
        menu03.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.setToolType(11);
                setLeftmenustatus(true);
                if(mBoard.getTextColor().toInt()==-7829368){
                    menu03color.setImageResource(R.mipmap.text_gray);
                }else if(mBoard.getTextColor().toInt()==-16777216){
                    menu03color.setImageResource(R.mipmap.text_black);
                }else if(mBoard.getTextColor().toInt()==-16776961){
                    menu03color.setImageResource(R.mipmap.text_blue);
                }else if(mBoard.getTextColor().toInt()==-16711936){
                    menu03color.setImageResource(R.mipmap.text_green);
                }else if(mBoard.getTextColor().toInt()==-256){
                    menu03color.setImageResource(R.mipmap.text_yellow);
                }else if(mBoard.getTextColor().toInt()==-65536) {
                    menu03color.setImageResource(R.mipmap.text_red);
                }
                menu03.setBackgroundResource(R.mipmap.menu_03_text1);
                menu03color.setBackground(getResources().getDrawable(R.color.bg_selected_menu));
                menu02color.setImageResource(R.color.bg_select_menu);
                menu04color.setImageResource(R.color.bg_select_menu);
            }
        });
        //左侧功能栏  第4个按钮  选择几何图形按钮
        menu04 = findViewById(R.id.menu04);
        menu04.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //开启 几何图形弹窗
                mBoard.setBrushColor(new TEduBoardController.TEduBoardColor(CurGeometryColor));
                mBoard.setBrushThin(CurGeometrySize);

                mBoard.setToolType(6);
                setLeftmenustatus(true);
                menu04.setBackgroundResource(R.mipmap.menu_04_jihe1);
                menu04color.setBackground(getResources().getDrawable(R.color.bg_selected_menu));
                menu02color.setImageResource(R.color.bg_select_menu);
                menu03color.setImageResource(R.color.bg_select_menu);
                if(mBoard.getBrushColor().toInt()==8947848){
                    menu04color.setImageResource(R.mipmap.text_gray);
                }else if(mBoard.getBrushColor().toInt()==0){
                    menu04color.setImageResource(R.mipmap.text_black);
                }else if(mBoard.getBrushColor().toInt()==255){
                    menu04color.setImageResource(R.mipmap.text_blue);
                }else if(mBoard.getBrushColor().toInt()==65280){
                    menu04color.setImageResource(R.mipmap.text_green);
                }else if(mBoard.getBrushColor().toInt()==16776960){
                    menu04color.setImageResource(R.mipmap.text_yellow);
                }else if(mBoard.getBrushColor().toInt()==-65536) {
                    menu04color.setImageResource(R.mipmap.text_red);
                }
                //开启 几何图形弹窗
                View v_selectgeometry = getLayoutInflater().inflate(R.layout.pw_selectgeometry,null);
                if(pw_selecgeometry==null){
                    pw_selecgeometry  = new PopupWindow(v_selectgeometry,ViewGroup.LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT,true);
                }
                pw_selecgeometry.showAsDropDown(findViewById(R.id.menu04),(select_menu.getWidth()+menu04.getWidth())/2+5,-menu04.getHeight());
                 geometry11 = v_selectgeometry.findViewById(R.id.geometry11);
                 geometry12 = v_selectgeometry.findViewById(R.id.geometry12);
                 geometry13 = v_selectgeometry.findViewById(R.id.geometry13);
                 geometry14 = v_selectgeometry.findViewById(R.id.geometry14);
                 geometry21 = v_selectgeometry.findViewById(R.id.geometry21);
                 geometry22 = v_selectgeometry.findViewById(R.id.geometry22);
                 geometry23 = v_selectgeometry.findViewById(R.id.geometry23);
                 geometry24 = v_selectgeometry.findViewById(R.id.geometry24);
                 geometry31 = v_selectgeometry.findViewById(R.id.geometry31);
                 geometry32 = v_selectgeometry.findViewById(R.id.geometry32);
                 geometry33 = v_selectgeometry.findViewById(R.id.geometry33);
                 geometry34 = v_selectgeometry.findViewById(R.id.geometry34);
                 geometry41 = v_selectgeometry.findViewById(R.id.geometry41);
                 geometry42 = v_selectgeometry.findViewById(R.id.geometry42);
                 geometry43 = v_selectgeometry.findViewById(R.id.geometry43);
                 geometry44 = v_selectgeometry.findViewById(R.id.geometry44);
                 geometry51 = v_selectgeometry.findViewById(R.id.geometry51);
                 geometry52 = v_selectgeometry.findViewById(R.id.geometry52);
                 geometry53 = v_selectgeometry.findViewById(R.id.geometry53);
                 geometry61 = v_selectgeometry.findViewById(R.id.geometry61);
                 geometry62 = v_selectgeometry.findViewById(R.id.geometry62);
                 geometry63 = v_selectgeometry.findViewById(R.id.geometry63);

                geometry11.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry11.setImageResource(R.mipmap.selectgeometry111);
                        setgeometrystatus();
                        mBoard.setToolType(4);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry12.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry12.setImageResource(R.mipmap.selectgeometry121);
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_DOTTED; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(4);
                        setgeometrystatus();
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry13.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry13.setImageResource(R.mipmap.selectgeometry131);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.endArrowType = TEduBoardController.TEduBoardArrowType.TEDU_BOARD_ARROW_TYPE_NORMAL;//开始箭头 实心箭头TEDU_BOARD_ARROW_TYPE_SOLID 普通箭头 TEDU_BOARD_ARROW_TYPE_NORMAL 无箭头 TEDU_BOARD_ARROW_TYPE_NONE
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(4);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry14.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry14.setImageResource(R.mipmap.selectgeometry141);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.startArrowType = TEduBoardController.TEduBoardArrowType.TEDU_BOARD_ARROW_TYPE_NORMAL;//开始箭头 实心箭头TEDU_BOARD_ARROW_TYPE_SOLID 普通箭头 TEDU_BOARD_ARROW_TYPE_NORMAL 无箭头 TEDU_BOARD_ARROW_TYPE_NONE
                        style.endArrowType = TEduBoardController.TEduBoardArrowType.TEDU_BOARD_ARROW_TYPE_NORMAL;//开始箭头 实心箭头TEDU_BOARD_ARROW_TYPE_SOLID 普通箭头 TEDU_BOARD_ARROW_TYPE_NORMAL 无箭头 TEDU_BOARD_ARROW_TYPE_NONE
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(4);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry21.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry21.setImageResource(R.mipmap.selectgeometry211);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(6);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry22.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry22.setImageResource(R.mipmap.selectgeometry221);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(13);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry23.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry23.setImageResource(R.mipmap.selectgeometry231);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(5);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry24.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry24.setImageResource(R.mipmap.selectgeometry241);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(15);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry31.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry31.setImageResource(R.mipmap.selectgeometry311);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeSOLID;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(6);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry32.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry32.setImageResource(R.mipmap.selectgeometry321);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeSOLID;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(13);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry33.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry33.setImageResource(R.mipmap.selectgeometry331);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeSOLID;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(5);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry34.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry34.setImageResource(R.mipmap.selectgeometry341);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeSOLID;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(15);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry41.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry41.setImageResource(R.mipmap.selectgeometry411);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(20);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry42.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry42.setImageResource(R.mipmap.selectgeometry421);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(21);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry43.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry43.setImageResource(R.mipmap.selectgeometry431);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(22);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry44.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry44.setImageResource(R.mipmap.selectgeometry441);
                        setgeometrystatus();
                        mBoard.setToolType(TEduBoardController.TEduBoardToolType.TEDU_BOARD_TOOL_TYPE_COORDINATE);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry51.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry51.setImageResource(R.mipmap.selectgeometry511);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeSOLID;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(20);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry52.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry52.setImageResource(R.mipmap.selectgeometry521);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeSOLID;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(21);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry53.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeSOLID;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(22);
                        geometry53.setImageResource(R.mipmap.selectgeometry531);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry61.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry61.setImageResource(R.mipmap.selectgeometry611);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(23);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry62.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry62.setImageResource(R.mipmap.selectgeometry621);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(24);
                        pw_selecgeometry.dismiss();
                    }
                });
                geometry63.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        geometry63.setImageResource(R.mipmap.selectgeometry631);
                        setgeometrystatus();
                        TEduBoardController.TEduBoardGraphStyle style = new TEduBoardController.TEduBoardGraphStyle();
                        style.lineType = TEduBoardController.TEduBoardLineType.TEDU_BOARD_LINE_TYPE_SOLID; //线类型，即虚实线  实线TEDU_BOARD_LINE_TYPE_SOLID = 1  虚线TEDU_BOARD_LINE_TYPE_DOTTED=2
                        style.fillType = TEduBoardController.TEduBoardFillType.TEduBoardFillTypeNONE;//填充类型, 即实心空心，只对平面几何图形有效   不填充TEduBoardFillTypeNONE = 1 填充TEduBoardFillTypeSOLID=2
                        mBoard.setGraphStyle(style);
                        mBoard.setToolType(25);
                        pw_selecgeometry.dismiss();
                    }
                });

            }
        });
        //左侧功能栏  第5个按钮  框选工具按钮
        menu05 = findViewById(R.id.menu05);
        menu05.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.setToolType(9);
                setLeftmenustatus(true);
                menu05.setBackgroundResource(R.mipmap.menu_05_select1);
            }
        });
        //左侧功能栏  第6个按钮  选择教学工具按钮
        menu06 = findViewById(R.id.menu06);
        menu06.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                //开启教学工具弹窗
                View v_selectteachingtools = getLayoutInflater().inflate(R.layout.pw_select_teachingtools,null);
                if(pw_selectteachingtools==null){
                    pw_selectteachingtools  = new PopupWindow(v_selectteachingtools,ViewGroup.LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT,true);
                }
                pw_selectteachingtools.showAsDropDown(findViewById(R.id.menu06),(select_menu.getWidth()+menu06.getWidth())/2+5,-menu06.getHeight());
                 teachingtools1 = v_selectteachingtools.findViewById(R.id.teachingtools1);
                 teachingtools2 = v_selectteachingtools.findViewById(R.id.teachingtools2);
                 teachingtools3 = v_selectteachingtools.findViewById(R.id.teachingtools3);
                 teachingtools4 = v_selectteachingtools.findViewById(R.id.teachingtools4);
                 teachingtools5 = v_selectteachingtools.findViewById(R.id.teachingtools5);
                teachingtools1.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        mBoard.useMathTool(1);
                        teachingtools1.setImageResource(R.mipmap.selectteachingtools11);
                        pw_selectteachingtools.dismiss();
                    }
                });
                teachingtools2.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        mBoard.useMathTool(2);
                        teachingtools2.setImageResource(R.mipmap.selectteachingtools21);
                        pw_selectteachingtools.dismiss();
                    }
                });
                teachingtools3.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        mBoard.useMathTool(3);
                        teachingtools3.setImageResource(R.mipmap.selectteachingtools31);
                        pw_selectteachingtools.dismiss();
                    }
                });
                teachingtools4.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        mBoard.useMathTool(4);
                        teachingtools4.setImageResource(R.mipmap.selectteachingtools41);
                        pw_selectteachingtools.dismiss();
                    }
                });
                teachingtools5.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        mBoard.useMathTool(5);
                        teachingtools5.setImageResource(R.mipmap.selectteachingtools51);
                        pw_selectteachingtools.dismiss();
                    }
                });
            }
        });
        //左侧功能栏  第7个按钮  移动缩放按钮
        menu07 = findViewById(R.id.menu07);
        menu07.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.setToolType(12);
                b_size.setText(mBoard.getBoardScale()+"");
                setLeftmenustatus(true);
                menu07.setBackgroundResource(R.mipmap.menu_07_move1);
            }
        });
        //左侧功能栏  第8个按钮  橡皮擦按钮
        menu08 = findViewById(R.id.menu08);
        menu08.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.setToolType(2);
                setLeftmenustatus(true);
                menu08.setBackgroundResource(R.mipmap.menu_08_earsea1);
                //开启橡皮擦弹窗
                View v_selecteraser = getLayoutInflater().inflate(R.layout.pw_selecteraser,null);
                if(pw_selecteraser==null){
                    pw_selecteraser  = new PopupWindow(v_selecteraser,ViewGroup.LayoutParams.WRAP_CONTENT,ViewGroup.LayoutParams.WRAP_CONTENT,true);
                }
                pw_selecteraser.showAsDropDown(findViewById(R.id.menu08),(select_menu.getWidth()+menu08.getWidth())/2+5,-menu08.getHeight());
                ImageButton eraser1 = v_selecteraser.findViewById(R.id.eraser1);
                ImageButton eraser2 = v_selecteraser.findViewById(R.id.eraser2);
                eraser1.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                         if(mBoard.isPiecewiseErasureEnable()){
                             mBoard.setPiecewiseErasureEnable(false);
                         }
                        eraser1.setImageResource(R.mipmap.selecteraser11);
                        pw_selecteraser.dismiss();
                    }
                });
                eraser2.setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        if(!mBoard.isPiecewiseErasureEnable()){
                            mBoard.setEraserSize(4);
                            mBoard.setPiecewiseErasureEnable(true);
                        }
                        eraser2.setImageResource(R.mipmap.selecteraser21);
                        pw_selecteraser.dismiss();
                    }
                });
            }
        });
        //左侧功能栏  第9个按钮  清空按钮
        menu09 = findViewById(R.id.menu09);
        menu09.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.clear(false);
            }
        });
        //左侧功能栏  第10个按钮  激光笔 按钮
        menu10 = findViewById(R.id.menu10);
        menu10.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.setToolType(3);
                setLeftmenustatus(true);
                menu10.setBackgroundResource(R.mipmap.menu_101);
            }
        });

        //左侧功能栏  第11个按钮  设置 按钮
        menu11 = findViewById(R.id.menu11);
        menu11.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RelativeLayout setBoardWindow = findViewById(R.id.setBoardWindow);
                if(setBoardWindow.getVisibility()==View.VISIBLE){
                    setBoardWindow.setVisibility(View.GONE);
                    //为了解决 输入Text的bug
                    if (mBoard.getToolType() == 11) {
                        mBoard.setToolType(11);
                    }
                }else {
                    setBoardWindow.setVisibility(View.VISIBLE);
                    //使用适配器将ViewPager与Fragment绑定在一起
                    ViewPager setboardviewPager = findViewById(R.id.set_board_tar_bar_viewpage);
                    setboardviewPager.setOffscreenPageLimit(3);
                    //构造参数
                    Set_eraser_Fragment_Stu set_eraser_fragment = new Set_eraser_Fragment_Stu("4");
                    Set_geometry_Fragment_Stu set_geometry_fragment = new Set_geometry_Fragment_Stu();
                    Set_text_Fragment_Stu set_text_fragment = new Set_text_Fragment_Stu();
                    Set_paint_Fragment_Stu set_paint_fragment = new Set_paint_Fragment_Stu();
                    Set_bg_Fragment_Stu set_bg_fragment = new Set_bg_Fragment_Stu();
                    Set_more_Fragment_Stu set_more_fragment = new Set_more_Fragment_Stu();
                    Set_Highlighter_Fragment_Stu set_highlighter_fragment = new Set_Highlighter_Fragment_Stu();
//                设置弹窗  四种状态   画笔设置|文本设置|几何图形设置|板擦设置 +  背景设置  +  更多设置
                    String[] sl=null;
                    mTabFragmenList.clear();
                    if (mBoard.getToolType() == 1) {
                        sl = new String[]{"画笔设置", "背景设置", "更多设置"};
                        mTabFragmenList.add(set_paint_fragment);
                    } else if (mBoard.getToolType() == 11) {
                        sl = new String[]{"文本设置", "背景设置", "更多设置"};
                        mTabFragmenList.add(set_text_fragment);
                    } else if (mBoard.getToolType() == 4||  mBoard.getToolType()==5
                            ||  mBoard.getToolType()==6  ||  mBoard.getToolType()==13
                            ||  mBoard.getToolType()==15  ||  mBoard.getToolType()==20
                            ||  mBoard.getToolType()==21  ||  mBoard.getToolType()==22
                            ||  mBoard.getToolType()==23  ||  mBoard.getToolType()==24
                            ||  mBoard.getToolType()==25  ||  mBoard.getToolType()==26) {
                        sl = new String[]{"几何图形设置", "背景设置", "更多设置"};
                        mTabFragmenList.add(set_geometry_fragment);
                    } else if (mBoard.getToolType() == 2) {
                        sl = new String[]{"板擦设置", "背景设置", "更多设置"};
                        mTabFragmenList.add(set_eraser_fragment);
                    } else if (mBoard.getToolType() == 19) {   //这里是荧光笔设置
                        sl = new String[]{"画笔设置", "背景设置", "更多设置"};
                        mTabFragmenList.add(set_highlighter_fragment);
                    }else {
                        sl = new String[]{"背景设置", "更多设置"};
                    }

                    mTabFragmenList.add(set_bg_fragment);
                    mTabFragmenList.add(set_more_fragment);

                    SetBrd_TabBarAdapter setBrd_tabBarAdapter = new SetBrd_TabBarAdapter(getSupportFragmentManager());

                    setBrd_tabBarAdapter.setmTitles(sl);
                    setBrd_tabBarAdapter.setmFragment(mTabFragmenList);
                    //改变Fragment管理器里面的Tag值，让他每次都重新创建新的Fragment  达到动态切换的效果
                    setBrd_tabBarAdapter.changeId();
                    setBrd_tabBarAdapter.notifyDataSetChanged();
                    setboardviewPager.setAdapter(setBrd_tabBarAdapter);
                    TabLayout mTabLayout = findViewById(R.id.setboard_tar_bar);
                    mTabLayout.setupWithViewPager(setboardviewPager);

                }

            }
        });

        //左侧功能栏  第12个按钮  状态栏 收起 展开按钮
        menu12 = findViewById(R.id.menu12);
        menu12.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                findViewById(R.id.setBoardWindow).setVisibility(View.GONE);
//                收起来
                if(menu_l_status){
                    select_menu_top.setVisibility(View.VISIBLE);
                    menu03RL.setVisibility(View.GONE);
                    menu04RL.setVisibility(View.GONE);
                    menu05RL.setVisibility(View.GONE);
                    menu06RL.setVisibility(View.GONE);
                    menu07RL.setVisibility(View.GONE);
                    menu09RL.setVisibility(View.GONE);
                    menu10RL.setVisibility(View.GONE);
                    menu12.setBackgroundResource(R.mipmap.menu_12_up);
                    menu_l_status=false;
                }else {
                    select_menu_top.setVisibility(View.GONE);
                    menu03RL.setVisibility(View.VISIBLE);
                    menu04RL.setVisibility(View.VISIBLE);
                    menu05RL.setVisibility(View.VISIBLE);
                    menu06RL.setVisibility(View.VISIBLE);
                    menu07RL.setVisibility(View.VISIBLE);
                    menu09RL.setVisibility(View.VISIBLE);
                    menu10RL.setVisibility(View.VISIBLE);
                    menu12.setBackgroundResource(R.mipmap.menu_12_down);
                    menu_l_status=true;
                }
            }
        });

//        b_size.setText(mBoard.getBoardRatio());

        //底部功能栏  第1个按钮  撤销按钮
        menub01 = findViewById(R.id.menub01);
        menub01.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub01.setBackgroundResource(R.mipmap.menu_b011);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub01.setBackgroundResource(R.mipmap.menu_b01); //改为抬起时的图片
                }
                return false;
            }
        });
        menub01.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.undo();
            }
        });
        //底部功能栏  第2个按钮  重做按钮
        menub02 = findViewById(R.id.menub02);
        menub02.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub02.setBackgroundResource(R.mipmap.menu_b021);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub02.setBackgroundResource(R.mipmap.menu_b02); //改为抬起时的图片
                }
                return false;
            }
        });
        menub02.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.redo();}
        });
        //底部功能栏  第3个按钮  归位 按钮（缩放比例 成100%）
        menub03 = findViewById(R.id.menub03);
        menub03.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub03.setBackgroundResource(R.mipmap.menu_b031);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub03.setBackgroundResource(R.mipmap.menu_b03); //改为抬起时的图片
                }
                return false;
            }
        });
        menub03.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mBoard.setBoardScale(100);
                b_size.setText("100");
            }
        });
        //底部功能栏  第4个按钮  缩小显示比例 按钮
        menub04 = findViewById(R.id.menub04);
        menub04.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub04.setBackgroundResource(R.mipmap.menu_b041);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub04.setBackgroundResource(R.mipmap.menu_b04); //改为抬起时的图片
                }
                return false;
            }
        });
        menub04.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if( Integer.parseInt(b_size.getText().toString())-10>=100){
                    mBoard.setBoardScale( Integer.parseInt(b_size.getText().toString())-10);
                    b_size.setText(mBoard.getBoardScale()+"");
                }else {
                    mBoard.setBoardScale(100);
                    b_size.setText("100");
                }
            }
        });
        //底部功能栏  第5个按钮  放大显示比例 按钮
        menub05 = findViewById(R.id.menub05);
        menub05.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub05.setBackgroundResource(R.mipmap.menu_b051);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub05.setBackgroundResource(R.mipmap.menu_b05); //改为抬起时的图片
                }
                return false;
            }
        });
        menub05.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if( Integer.parseInt(b_size.getText().toString())+10<=300){
                    mBoard.setBoardScale( Integer.parseInt(b_size.getText().toString())+10);
                    b_size.setText(mBoard.getBoardScale()+"");
                }else{
                    mBoard.setBoardScale(300);
                    b_size.setText("300");
                }
            }
        });
        //底部功能栏  第6个按钮  向前翻页 按钮
        menub06= findViewById(R.id.menub06);
        menub06.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub06.setBackgroundResource(R.mipmap.menu_b061);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub06.setBackgroundResource(R.mipmap.menu_b06); //改为抬起时的图片
                }
                return false;
            }
        });
        //底部功能栏  第7个按钮  向后翻页 按钮
        menub07 = findViewById(R.id.menub07);
        menub07.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub07.setBackgroundResource(R.mipmap.menu_b071);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub07.setBackgroundResource(R.mipmap.menu_b07); //改为抬起时的图片
                }
                return false;
            }
        });
        //底部功能栏  第8个按钮  新增一页 按钮
        menub08 = findViewById(R.id.menub08);
        menub08.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub08.setBackgroundResource(R.mipmap.menu_b081);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub08.setBackgroundResource(R.mipmap.menu_b08); //改为抬起时的图片
                }
                return false;
            }
        });
        //底部功能栏  第9个按钮  删除当前页 按钮
        menub09 = findViewById(R.id.menub09);
        menub09.setOnTouchListener(new View.OnTouchListener() {
            @Override
            public boolean onTouch(View v, MotionEvent event) {
                if(event.getAction() == MotionEvent.ACTION_DOWN){
                    menub09.setBackgroundResource(R.mipmap.menu_b091);//更改为按下时的背景图片
                }else if(event.getAction() == MotionEvent.ACTION_UP){
                    menub09.setBackgroundResource(R.mipmap.menu_b09); //改为抬起时的图片
                }
                return false;
            }
        });

        //底部功能栏  第10个按钮  折叠展开底部菜单栏 按钮
        menub10 = findViewById(R.id.menub10);
        menub02_1 = findViewById(R.id.menub02_1);
        menub05_1 = findViewById(R.id.menub05_1);
        menub10.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(menu_b_status){
                    menub02_1.setVisibility(View.GONE);
                    menub05_1.setVisibility(View.GONE);
                    menub03.setVisibility(View.GONE);
                    menub04.setVisibility(View.GONE);
                    menub05.setVisibility(View.GONE);
                    menub06.setVisibility(View.GONE);
                    menub07.setVisibility(View.GONE);
                    menub08.setVisibility(View.GONE);
                    menub09.setVisibility(View.GONE);
                    b_cur.setVisibility(View.GONE);
                    b_sum.setVisibility(View.GONE);
                    b_size.setVisibility(View.GONE);
                    b_per.setVisibility(View.GONE);
                    b_chu.setVisibility(View.GONE);
                    menub10.setBackgroundResource(R.mipmap.menu_b11);
                    menu_b_status=false;
                }else {
                    menub02_1.setVisibility(View.VISIBLE);
                    menub05_1.setVisibility(View.VISIBLE);
                    menub03.setVisibility(View.VISIBLE);
                    menub04.setVisibility(View.VISIBLE);
                    menub05.setVisibility(View.VISIBLE);
                    menub06.setVisibility(View.VISIBLE);
                    menub07.setVisibility(View.VISIBLE);
                    menub08.setVisibility(View.VISIBLE);
                    menub09.setVisibility(View.VISIBLE);
                    b_cur.setVisibility(View.VISIBLE);
                    b_sum.setVisibility(View.VISIBLE);
                    b_size.setVisibility(View.VISIBLE);
                    b_per.setVisibility(View.VISIBLE);
                    b_chu.setVisibility(View.VISIBLE);
                    menub10.setBackgroundResource(R.mipmap.menu_b10);
                    menu_b_status=true;
                }
            }
        });
    }

    //设置菜单  一级弹窗 的  默认显示状态
    public void setLeftmenustatus(Boolean issetbg){
        menu01.setBackgroundResource(R.mipmap.menu_01_mouse);
        menu02.setBackgroundResource(R.mipmap.menu_02_paint);
        menu02color.setBackground(getResources().getDrawable(R.color.bg_select_menu));
        menu03.setBackgroundResource(R.mipmap.menu_03_text);
        menu03color.setBackground(getResources().getDrawable(R.color.bg_select_menu));
        menu04.setBackgroundResource(R.mipmap.menu_04_jihe);
        menu04color.setBackground(getResources().getDrawable(R.color.bg_select_menu));
        menu05.setBackgroundResource(R.mipmap.menu_05_select);
        menu06.setBackgroundResource(R.mipmap.menu_06_tools);
        menu07.setBackgroundResource(R.mipmap.menu_07_move);
        menu08.setBackgroundResource(R.mipmap.menu_08_earsea);
        menu10.setBackgroundResource(R.mipmap.menu_10);
        if(issetbg&&findViewById(R.id.setBoardWindow).getVisibility()==View.VISIBLE){
            findViewById(R.id.setBoardWindow).setVisibility(View.GONE);
        }
    }
    /**
     * 白板控制
     * @param extension 消息类型  @param action    操作动作  @param id        操作对象ID
     */
    public void drawAuthority(String extension, String action, String id) {
        // 发送关闭学生操作白板 消息
        final V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createCustomMessage(
                action.getBytes(),       //data
                id+"_WhiteBoard",     //descripition
                extension.getBytes());   //extension
        V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, null,roomid, V2TIMMessage.V2TIM_PRIORITY_HIGH, false, null, new V2TIMSendCallback<V2TIMMessage>() {
            @Override
            public void onProgress(int progress) {
            }
            @Override
            public void onSuccess(V2TIMMessage message) {
                System.out.println("+++发送关闭学生操作白板消息发送成功了");
            }
            @Override
            public void onError(int code, String desc) {
                System.out.println("+++发送关闭学生操作白板消息发送失败"+desc);
            }
        });
    }

    public void sendMsg(Chat_Msg msg){
        // 发送聊天消息
        final V2TIMMessage v2TIMMessage_chat = V2TIMManager.getMessageManager().createCustomMessage(
                msg.getContent().getBytes(),       //data
                ("2@#@"+userCn+"@#@"+userHead),  //descripition
                "TBKTExt".getBytes());             //extension
        V2TIMManager.getMessageManager().sendMessage(v2TIMMessage_chat, null,roomid, V2TIMMessage.V2TIM_PRIORITY_NORMAL, false, null, new V2TIMSendCallback<V2TIMMessage>() {
            @Override
            public void onProgress(int progress) {
            }
            @Override
            public void onSuccess(V2TIMMessage message) {
                System.out.println("+++文本消息发送成功了");
            }
            @Override
            public void onError(int code, String desc) {
                System.out.println("+++文本消息发送失败"+code+desc);
            }
        });
    }


    public void onExitLiveRoom() {
//        HttpActivityTea.overClass("leave", "skydt", this);
        final V2TIMMessage v2TIMMessage = V2TIMManager.getMessageManager().createCustomMessage(
                "finish".getBytes(),       //data
                "all"+"_WhiteBoard",     //descripition
                "exitRoomNotice".getBytes());   //extension
        V2TIMManager.getMessageManager().sendMessage(v2TIMMessage, null,roomid, V2TIMMessage.V2TIM_PRIORITY_HIGH, false, null, new V2TIMSendCallback<V2TIMMessage>() {
            @Override
            public void onProgress(int progress) {
            }
            @Override
            public void onSuccess(V2TIMMessage message) {
                System.out.println("+++发送下课消息发送成功了");
            }
            @Override
            public void onError(int code, String desc) {
                System.out.println("+++发送下课发送失败"+desc);
            }
        });
        stopTime();
        mTRTCCloud.exitRoom();
    }

    //下课 销毁白板实例
    public void destroyBoard() {
        System.out.println("+++执行了销毁函数");
        CurType=null;
        if(mBoard!=null){
            mBoard.removeCallback(mBoardCallback);
            mBoard.uninit();
            mBoard=null;
            BoardStatus=false;
            addBoardtoFragmentstatus=false;
        }

    }

    @Override
    protected void onDestroy() {
        exitRoom();
        V2TIMManager.getInstance().logout(new V2TIMCallback() {
            @Override
            public void onError(int i, String s) {
                System.out.println("+++IM登出错误"+s);
            }

            @Override
            public void onSuccess() {
                System.out.println("+++IM登出成功");
            }
        });

        V2TIMManager.getInstance().unInitSDK();
        super.onDestroy();
    }


    //打开手机文件管理器
    private void intoFileManager() {
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("*/*");//无类型限制
        intent.addCategory(Intent.CATEGORY_OPENABLE);
        startActivityForResult(intent, 12); //requestCode==1   用来记录是这里的操作
    }



    //为了 接口获取到的数据（字符串）转成JSON格式
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

    //创建转码任务 （pdf  doc   docx）
    private void CreateTranscode(String slink) {
        //开始创建转码任务
        new Thread(new Runnable() {
            @Override
            public void run() {
                try{
                    String SecretId  = MsecretId;
                    String SecretKey = MsecretKey;
                    String Region    = MRegion;
                    String SdkAppId  = bucketSDKappID+"";
                    String link      = slink;
                    URL url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_CreateTranscode.do?"
                            + "SecretId=" + SecretId + "&SecretKey=" + SecretKey + "&Region=" + Region
                            + "&SdkAppId="+ SdkAppId   + "&link="+ link);

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

                    try{
                        String backLogJsonStr = buffer.toString();
                        JSONObject json = stringToJson(backLogJsonStr);
                        String status = json.get("Status").toString();
                        if(status.equals("success")){
                            System.out.println("+++转码接口任务成功：返回了taskId:;"+json.get("TaskId"));
//                          上传任务创建成功 就要调用查看转码状态
                            proBar.setProgress(0);
                            msgTips.setText("文件正在转码：");
                            uploadfile.setText("正在转码");
                            DescribeTranscodehandler(MsecretId,MsecretKey,Region,SdkAppId,json.get("TaskId").toString(),mBoard,proBar);
                        }else {
//                            失败，页面提示“创建文件转换任务失败，请稍后重试。”
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


    //创建 转码任务 定时请求器
    public static void DescribeTranscodehandler(String secretId,String secretKey,String region,String sdkAppId,String taskId,TEduBoardController mBoard,ProgressBar progressBar) {
        Boardtimer.schedule(new TimerTask() {
            @Override
            public void run() {
                DescribeTranscode(secretId,secretKey,region,sdkAppId,taskId,mBoard,progressBar);
            }
        },500,500);
    }

    //获取转码进度
    private static void DescribeTranscode(String secretId,String secretKey,String region,String sdkAppId,String taskId,TEduBoardController mBoard,ProgressBar progressBar) {
        new Thread(new Runnable() {
            String ResultUrl =null;
            @Override
            public void run() {
                try{
                    String SecretId  = secretId;
                    String SecretKey = secretKey;
                    String Region    = region;
                    String SdkAppId  = sdkAppId;
                    String TaskId    = taskId;
                    URL url = new URL("http://www.cn901.com/ShopGoods/ajax/livePlay_DescribeTranscode.do?"
                            + "SecretId=" + SecretId + "&SecretKey=" + SecretKey + "&Region=" + Region
                            + "&SdkAppId="+ SdkAppId  + "&TaskId="+ TaskId);
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
//        "Status": "PROCESSING",  "Progress": "10",//转码进度，区间0--100 "ResultUrl": "",//装换成功之后的预览路径  "Pages": "3", "Title": "七年级测试卷", "Resolution": "1280*800"
//        其中Status包含  - QUEUED: 正在排队等待转换  - PROCESSING: 转换中 - FINISHED: 转换完成 - fail:装换异常，需要提示“文件转换任务失败，请稍后重试”（自定义提示）
                    try{
                        String backLogJsonStr = buffer.toString();
                        System.out.println("+++转码任务接口返回数据："+backLogJsonStr);
                        JSONObject json = stringToJson(backLogJsonStr);
                        System.out.println("+++转码任务接口返回状态："+json.get("Status"));
                        String status = json.get("Status").toString();
                        if(status.equals("FINISHED")){
                            ResultUrl =  json.get("ResultUrl").toString();
                            Boardtimer.cancel();

                            Message msg = Message.obtain();
                            msg.what = MyEvent.WHITEBOARD_ADD_PAGE;
                            Bundle bundle = new Bundle();
                            bundle.putString("title", json.get("Title").toString());
                            bundle.putString("url", json.get("ResultUrl").toString());
                            bundle.putInt("page", Integer.parseInt(json.get("Pages").toString()));
                            bundle.putString("Resolution", json.get("Resolution").toString());
                            msg.setData(bundle);
                            handler.sendMessage(msg);

                        }else if(status.equals("fail")){
                            Boardtimer.cancel();
                            System.out.println("+++查询转码进度任务失败：");
//                            装换异常，需要提示“文件转换任务失败，请稍后重试”（自定义提示）
                        }else if(status.equals("PROCESSING")){
                            progressBar.setProgress(Integer.parseInt(json.get("Progress").toString()));
                            System.out.println("+++查询转码进度任务进行中......："+json.get("Progress"));
//                            json.get("PROCESSING").toString();设置进度条
                        }else if(status.equals("QUEUED")){
                            System.out.println("+++查询转码进度任务队列中......："+json.get("Progress"));
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


//白板快照   王璐瑶调用
    public static void ScreenShotBoard(Context context,String answerQuestionId,TEduBoardController mBoard){
        isquestion=true;//调用的时候把这个值设置为true  后面改变存储的路径
        //白板快照
        TEduBoardController.TEduBoardSnapshotInfo path = new TEduBoardController.TEduBoardSnapshotInfo();
        path.path=context.getCacheDir()+"/"+answerQuestionId+".png";
        mBoard.snapshot(path);
        // class/年/月/日/subjectId/roomId/question/questionId.png   王璐瑶那块
    }

    // 清空 几何工具 弹窗  左侧的选中状态
    private void setgeometrystatus() {
        geometry11.setImageResource(R.mipmap.selectgeometry11);
        geometry12.setImageResource(R.mipmap.selectgeometry12);
        geometry13.setImageResource(R.mipmap.selectgeometry13);
        geometry14.setImageResource(R.mipmap.selectgeometry14);
        geometry21.setImageResource(R.mipmap.selectgeometry21);
        geometry22.setImageResource(R.mipmap.selectgeometry22);
        geometry23.setImageResource(R.mipmap.selectgeometry23);
        geometry24.setImageResource(R.mipmap.selectgeometry24);
        geometry31.setImageResource(R.mipmap.selectgeometry31);
        geometry32.setImageResource(R.mipmap.selectgeometry32);
        geometry33.setImageResource(R.mipmap.selectgeometry33);
        geometry34.setImageResource(R.mipmap.selectgeometry34);
        geometry41.setImageResource(R.mipmap.selectgeometry41);
        geometry42.setImageResource(R.mipmap.selectgeometry42);
        geometry43.setImageResource(R.mipmap.selectgeometry43);
        geometry44.setImageResource(R.mipmap.selectgeometry44);
        geometry51.setImageResource(R.mipmap.selectgeometry51);
        geometry52.setImageResource(R.mipmap.selectgeometry52);
        geometry53.setImageResource(R.mipmap.selectgeometry53);
        geometry61.setImageResource(R.mipmap.selectgeometry61);
        geometry62.setImageResource(R.mipmap.selectgeometry62);
        geometry63.setImageResource(R.mipmap.selectgeometry63);
    }

    //用来设置颜色的时候  控制菜单一栏  画笔 文本  几何工具右下角的小颜色显示   为了给设置的fragment调用
    public void forSetFragmentSet(String item,String params){
        if(item=="geometrycolor"){
            if(params=="gray"){
                menu04color.setImageResource(R.mipmap.text_gray);
            }else if(params=="black"){
                menu04color.setImageResource(R.mipmap.text_black);
            }else if(params=="blue"){
                menu04color.setImageResource(R.mipmap.text_blue);
            }else if(params=="green"){
                menu04color.setImageResource(R.mipmap.text_green);
            }else if(params=="yellow"){
                menu04color.setImageResource(R.mipmap.text_yellow);
            }else if(params=="red"){
                menu04color.setImageResource(R.mipmap.text_red);
            }
        }else if(item=="paintcolor"){
            if(params=="gray"){
                menu02color.setImageResource(R.mipmap.text_gray);
            }else if(params=="black"){
                menu02color.setImageResource(R.mipmap.text_black);
            }else if(params=="blue"){
                menu02color.setImageResource(R.mipmap.text_blue);
            }else if(params=="green"){
                menu02color.setImageResource(R.mipmap.text_green);
            }else if(params=="yellow"){
                menu02color.setImageResource(R.mipmap.text_yellow);
            }else if(params=="red") {
                menu02color.setImageResource(R.mipmap.text_red);
            }
        }else if(item=="textcolor"){
            if(params=="gray"){
                menu03color.setImageResource(R.mipmap.text_gray);
            }else if(params=="black"){
                menu03color.setImageResource(R.mipmap.text_black);
            }else if(params=="blue"){
                menu03color.setImageResource(R.mipmap.text_blue);
            }else if(params=="green"){
                menu03color.setImageResource(R.mipmap.text_green);
            }else if(params=="yellow"){
                menu03color.setImageResource(R.mipmap.text_yellow);
            }else if(params=="red"){
                menu03color.setImageResource(R.mipmap.text_red);
            }
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

//    @Override
//    protected void onPermissionGranted() {
//        initView();
//        enterLiveRoom();
//    }

    @Override
    public void onClick(View v) {
        int id = v.getId();
        //返回上级页面
//        if (id == R.id.iv_back) {
//            finish();
//        }
        if (id == R.id.exitroom) {
            stopTime();
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
            BottomButtonActivity.qiangDa(this);
        }
//
//        //举手上讲�?
//        else if(id == R.id.hands){
//            BottomButtonActivity.muteHand();
//        }
//
//        //开闭聊天室
//        else if (id == R.id.message) {
//            BottomButtonActivity.muteMessage();
//        }
//
//        //开闭摄像头
//        else if (id == R.id.btn_mute_video) {
//            BottomButtonActivity.muteVideo();
//        }
//
//        //开闭麦
//        else if (id == R.id.btn_mute_audio) {
//            BottomButtonActivity.muteAudio();
//        }
//
//        //前置后置摄像�?
//        else if (id == R.id.btn_switch_camera) {
//            BottomButtonActivity.switchCamera();
//        }
//
//        //刷新
//        else if (id == R.id.refresh){
//            BottomButtonActivity.remoteRefresh();
////            new Thread(new Runnable() {//创建子线�?
////                public void run() {
////                @Override
////                    getwebinfo();//把路径选到MainActivity�?
////                }
////            }).start();//启动子线�?
//        }
//
//        //全屏
//        else if (id == R.id.fullscreen){
//            BottomButtonActivity.fullscreen();
//        }
//
//        //点击教师分享流隐藏顶部底部按�?
//        else if(id == R.id.teacher_share){
//            //BottomButtonActivity.touchTeachershare();
//        }

        //判断
        else if(id == R.id.tfyes ||id == R.id.tfno
                ||id == R.id.tfsubmit){
            // 显示选中项�?
            if(id == R.id.tfsubmit){
                String checkedValues = SelectUtil.getOne(radios_tf);
                System.out.println("判断选中了：" + checkedValues);
                HttpActivityStu.saveAnswer(checkedValues, userId, userCn, this);

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
                System.out.println("单选选中了：" + checkedValues+"id:"+HttpActivityStu.questionId);
                HttpActivityStu.saveAnswer(checkedValues, userId, userCn, this);

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
                HttpActivityStu.saveAnswer(checkedValues, userId, userCn, this);

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
                    editoneValue = editoneValue.replace("'"+i+"'","<img src=\""+base64id_url.get(i)+"\">");
                }
                System.out.println("editoneValue i:"+editoneValue);
                HttpActivityStu.saveAnswer(editoneValue, userId, userCn, this);

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
                if (ContextCompat.checkSelfPermission(MainActivity_stu.this,
                        Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED){
                    ActivityCompat.requestPermissions(MainActivity_stu.this,new
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
                imageUri = FileProvider.getUriForFile(MainActivity_stu.this,
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
    }

    private void openAlbum(){
        Intent intent = new Intent(Intent.ACTION_GET_CONTENT);
        intent.setType("image/*");
        intent.setFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
        startActivityForResult(intent,CHOOSE_PHOTO);    //打开相册
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
        String httpreturn = HttpActivityStu.readContentFromPost(bitmap);

        System.out.println("httpreturn:"+ httpreturn);
        return bihuanbmp;
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

    @SuppressLint("Range")
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
//            Toast.makeText(this,"fail to get image",Toast.LENGTH_SHORT).show();
        }
    }

    //更新互动答题界面
    private void getteacher(){
//        Toast.makeText(this, "更新互动答题UI", Toast.LENGTH_SHORT).show();
        if(AnswerActivityStu.allHandAction!=null) {
            if(AnswerActivityStu.allHandAction.equals("handAllYes")) {
                if(handsState.equals("up")) {
//                    MainActivity_stu.handBtn.setImageResource(R.drawable.bottom_stuhand_down);
                    MainActivity_stu.handBtn.getDrawable().setLevel(5);
                } else if (handsState.equals("down")) {
//                    MainActivity_stu.handBtn.setImageResource(R.drawable.bottom_stuhand_up);
                    MainActivity_stu.handBtn.getDrawable().setLevel(10);
                }
            } else if(AnswerActivityStu.allHandAction.equals("handAllNo")) {
//                MainActivity_stu.handBtn.setImageResource(R.drawable.bottom_stuhand_no);
                MainActivity_stu.handBtn.getDrawable().setLevel(20);
            }
        }
        if(AnswerActivityStu.questionAction!=null){
            Log.e(TAG, "getteacher: 答题操作" + AnswerActivityStu.questionAction + " " + AnswerActivityStu.questionBaseTypeId);
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

            if(last_actiontime_answer.equals(AnswerActivityStu.questionTime)){
                Log.e(TAG, "getteacher: 判断时间" + AnswerActivityStu.questionTime + " " + AnswerActivityStu.questionBaseTypeId);
                return;
            }
            else{
                Log.e(TAG, "getteacher: 设置时间" + AnswerActivityStu.questionTime + " " + AnswerActivityStu.questionBaseTypeId);
                last_actiontime_answer=AnswerActivityStu.questionTime;
            }
            Log.e(TAG, "准备更新UI " + AnswerActivityStu.questionAction.equals("startAnswer"));
            switch (AnswerActivityStu.questionAction) {
                case "startAnswer":
                    Log.e(TAG, "准备更新UI" + AnswerActivityStu.questionAction);
                case "startAnswerSuiji":
                case "startAnswerQiangDa":
                    mQiangda.setSelected(false);
                    BottomButtonActivity.qiangDa(this);
//                MainActivity_stu.mMessageInput.setVisibility(GONE);

                    Log.e(TAG, "getteacher: " + "answer over a");

                    if (AnswerActivityStu.questionBaseTypeId.equals("101")) {
                        Log.e(TAG, "getteacher: 显示题目类型101");
                        current_answer = group_singleanswer;
//                        LaunchActivity.group_tfanswer.setVisibility(View.GONE);
                        MainActivity_stu.group_singleanswer.setVisibility(View.VISIBLE);
//                        LaunchActivity.group_multianswer.setVisibility(View.GONE);
//                        LaunchActivity.group_subjectiveanswer.setVisibility(View.GONE);

//                    MainActivity_stu.mGroupButtons.setVisibility(GONE);
                        int index = 0;
                        int sub_num = Integer.parseInt(AnswerActivityStu.questionSubNum);
                        for (CheckBox item : radios_single) {
                            if (index < sub_num) {
                                item.setChecked(false);
                                item.setVisibility(View.VISIBLE);
                            } else {
                                item.setChecked(false);
                                item.setVisibility(GONE);
                            }
                            index++;
                        }
                    } else if (AnswerActivityStu.questionBaseTypeId.equals("102")) {
                        current_answer = group_multianswer;
//                        LaunchActivity.group_tfanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_singleanswer.setVisibility(View.GONE);
                        MainActivity_stu.group_multianswer.setVisibility(View.VISIBLE);
//                        LaunchActivity.group_subjectiveanswer.setVisibility(View.GONE);
//                    MainActivity_stu.mGroupButtons.setVisibility(GONE);
                        int index = 0;
                        int sub_num = Integer.parseInt(AnswerActivityStu.questionSubNum);
                        for (CheckBox item : radios_multi) {
                            if (index < sub_num) {
                                item.setChecked(false);
                                item.setVisibility(View.VISIBLE);
                            } else {
                                item.setChecked(false);
                                item.setVisibility(GONE);
                            }
                            index++;
                        }
                    } else if (AnswerActivityStu.questionBaseTypeId.equals("103")) {
                        current_answer = group_tfanswer;
                        MainActivity_stu.group_tfanswer.setVisibility(View.VISIBLE);
//                        LaunchActivity.group_singleanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_multianswer.setVisibility(View.GONE);
//                        LaunchActivity.group_subjectiveanswer.setVisibility(View.GONE);
//                    MainActivity_stu.mGroupButtons.setVisibility(GONE);
                        int index = 0;
                        //int sub_num = Integer.parseInt(AnswerActivity.questionSubNum);
                        int sub_num = 2;
                        for (CheckBox item : radios_tf) {
                            if (index < sub_num) {
                                item.setChecked(false);
                                item.setVisibility(View.VISIBLE);
                            } else {
                                item.setChecked(false);
                                item.setVisibility(GONE);
                            }
                            index++;
                        }
                    } else if (AnswerActivityStu.questionBaseTypeId.equals("104")) {
                        current_answer = group_subjectiveanswer;
//                        LaunchActivity.group_tfanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_singleanswer.setVisibility(View.GONE);
//                        LaunchActivity.group_multianswer.setVisibility(View.GONE);
                        MainActivity_stu.group_subjectiveanswer.setVisibility(View.VISIBLE);
//                    MainActivity_stu.mGroupButtons.setVisibility(GONE);
                    }
                    break;
                case "startQiangDa":
//                MainActivity_stu.mGroupButtons.setVisibility(View.VISIBLE);
//                MainActivity_stu.mMessageInput.setVisibility(GONE);
                    MainActivity_stu.group_tfanswer.setVisibility(View.INVISIBLE);
                    MainActivity_stu.group_singleanswer.setVisibility(View.INVISIBLE);
                    MainActivity_stu.group_multianswer.setVisibility(View.INVISIBLE);
                    MainActivity_stu.group_subjectiveanswer.setVisibility(View.INVISIBLE);
                    mQiangda.setSelected(true);
                    BottomButtonActivity.qiangDa(this);
                    System.out.println("answer over c");
                    break;
                case "stopAnswer":
                case "stopAnswerSuiji":
                case "stopAnswerQiangDa":
                    current_answer = null;

                    MainActivity_stu.group_tfanswer.setVisibility(View.INVISIBLE);
                    MainActivity_stu.group_singleanswer.setVisibility(View.INVISIBLE);
                    MainActivity_stu.group_multianswer.setVisibility(View.INVISIBLE);
                    MainActivity_stu.group_subjectiveanswer.setVisibility(View.INVISIBLE);

                    subjective_answer.setText("");
                    subjective_echo.setText("");
                    subjective_scroll.setVisibility(View.INVISIBLE);

                    mQiangda.setSelected(false);
                    BottomButtonActivity.qiangDa(this);
                    initQuestionData();

//                    LaunchActivity.mMessageInput.setVisibility(View.VISIBLE);
//                MainActivity_stu.mGroupButtons.setVisibility(View.VISIBLE);
                    System.out.println("answer over b");
                    break;
                default:

                    BottomButtonActivity.qiangDa(this);
                    System.out.println("answer over f" + AnswerActivityStu.questionAction);
                    break;
            }
        }
        if(AnswerActivityStu.deviceMicAction!=null){
            if(last_actiontime_mic.equals(AnswerActivityStu.deviceMicTime)){
                return;
            }
            else{
                last_actiontime_mic=AnswerActivityStu.deviceMicTime;
            }
//            if(AnswerActivity.deviceMicAction.equals("openMic")){
//                boolean isSelected = mButtonMuteAudio.isSelected();
//                if (isSelected){
//                    BottomButtonActivity.muteAudio();
//                }
//            }
//            else if(AnswerActivity.deviceMicAction.equals("closeMic")){
//                boolean isSelected = mButtonMuteAudio.isSelected();
//                if (!isSelected){
//                    BottomButtonActivity.muteAudio();
//                }
//            }
        }
        if(AnswerActivityStu.deviceCameraAction!=null){
            if(last_actiontime_camera.equals(AnswerActivityStu.deviceCameraTime)){
                return;
            }
            else{
                last_actiontime_camera=AnswerActivityStu.deviceCameraTime;
            }
//            if(AnswerActivity.deviceCameraAction.equals("openCamera")){
//                boolean isSelected = mButtonMuteVideo.isSelected();
//                if (isSelected){
//                    BottomButtonActivity.muteVideo();
//                }
//            }
//            else if(AnswerActivity.deviceCameraAction.equals("closeCamera")){
//                boolean isSelected = mButtonMuteVideo.isSelected();
//                if (!isSelected){
//                    BottomButtonActivity.muteVideo();
//                }
//            }
        }
        if(AnswerActivityStu.deviceWordsAction!=null){
            System.out.println("last_actiontime_words:"+last_actiontime_words);
            System.out.println("AnswerActivity.deviceWordsTime:"+AnswerActivityStu.deviceWordsTime);
            if(last_actiontime_words.equals(AnswerActivityStu.deviceWordsTime)){
                System.out.println("actiontime return");
                return;
            }
            else{
                System.out.println("actiontime change");
                last_actiontime_words=AnswerActivityStu.deviceWordsTime;
            }
            if(AnswerActivityStu.deviceWordsAction.equals("openWords")&&!openWords_flag){
                openWords_flag = true;
                //mMessageInput.setFocusable(true);
//                mMessageInput.setText("");
                //
//                mMessageInput.setEnabled(true);
                System.out.println("openWords!!!!!!!");
//                mMessageSubmit.setEnabled(true);
//                    boolean isSelected = mButtonMuteVideo.isSelected();
//                    if (isSelected){
//                        BottomButtonActivity.muteVideo();
//                    }
            }
            else if(AnswerActivityStu.deviceWordsAction.equals("closeWords")){
                openWords_flag = false;
                //mMessageInput.setFocusable(false);
//                mMessageInput.setEnabled(false);
//                mMessageInput.setText("您当前已被教师禁言");

//                mMessageSubmit.setEnabled(false);
//                    boolean isSelected = mButtonMuteVideo.isSelected();
//                    if (!isSelected){
//                        BottomButtonActivity.muteVideo();
//                    }
            }
        }
    }

    //处理允许聊天
    public void  dealAllowChat(){
        System.out.println("执行了处理允许聊天函数+++");
        chatRoomFragment.allowchat();



    }
    //处理禁止聊天
    public void   dealStopChat(){
        System.out.println("执行了处理禁止聊天函数+++");
        chatRoomFragment.stopchat();
    }



    //处理禁止涂鸦啊
     public void   dealStopDraw(){
        if(rf_bottommenu!=null&&rf_leftmenu!=null){
            rf_leftmenu.setVisibility(GONE);
            rf_bottommenu.setVisibility(GONE);
        }
         if(mBoard!=null){
            mBoard.setDrawEnable(false);
            mBoard.setMouseToolBehavior(false,false,false,false);
         }else {
             initBoard();
             mBoard.setDrawEnable(false);
             mBoard.setMouseToolBehavior(false,false,false,false);
         }
     }
     //处理允许涂鸦
     public void  dealAllowDraw(){

        System.out.println("+++处理允许绘画"+rf_leftmenu.getVisibility());
        if(rf_bottommenu!=null&&rf_leftmenu!=null) {
            rf_leftmenu.setVisibility(View.VISIBLE);
            rf_bottommenu.setVisibility(View.VISIBLE);
        }
         rf_leftmenu.bringToFront();
         rf_bottommenu.bringToFront();

         if(mBoard!=null){
            mBoard.setToolType(1);
            menu02color.setBackground(getResources().getDrawable(R.color.bg_selected_menu));
            menu02color.setImageResource(R.mipmap.text_red);
            mBoard.setDrawEnable(true);
            mBoard.setMouseToolBehavior(true,true,true,true);
        }else {
            initBoard();
            mBoard.setToolType(1);
            menu02color.setBackground(getResources().getDrawable(R.color.bg_selected_menu));
            menu02color.setImageResource(R.mipmap.text_red);
            mBoard.setDrawEnable(true);
            mBoard.setMouseToolBehavior(true,true,true,true);
        }
    }


}

