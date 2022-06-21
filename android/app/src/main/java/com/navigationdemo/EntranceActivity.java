package com.navigationdemo;

import android.content.Intent;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;

import com.tencent.trtc.debug.Constant;

/**
 * TRTC API-Example 主页面
 *
 * 其中包含
 * 基础功能模块如下：
 * - 视频通话模块{@link LaunchActivity}
 *
 */
public class EntranceActivity extends AppCompatActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        //super.onCreate(savedInstanceState);
        //setContentView(R.layout.activity_main);
        //getSupportActionBar().hide();
//        super.onCreate(null);
//        Intent intent = new Intent(EntranceActivity.this, LaunchActivity.class);
//        startActivity(intent);
        //super.onCreate(null);
        super.onCreate(savedInstanceState);
        handleIntent();
        Intent intent = new Intent(EntranceActivity.this, LaunchActivity.class);
        startActivity(intent);

//        new Handler().postDelayed(new Runnable() {
//            @Override
//            public void run() {
//                findViewById(R.id.launch_view).setVisibility(View.GONE);
//            }
//        }, 1000);


//        findViewById(R.id.ll_video_call).setOnClickListener(new View.OnClickListener() {
//            @Override
//            public void onClick(View view) {
//                //Intent intent = new Intent(EntranceActivity.this, VideoCallingEnterActivity.class);
//                Intent intent = new Intent(EntranceActivity.this, LaunchActivity.class);
//                startActivity(intent);
//            }
//        });


    }

    private void handleIntent() {
        Intent intent = getIntent();
        String params = intent.getStringExtra("params");
        System.out.println("EntranceActivity-params:"+params);
        String[] strArr = params.split("-");
        LaunchActivity.mUserId = strArr[0];
        LaunchActivity.mUserCn = strArr[1];
        LaunchActivity.mRoomId = strArr[2];
        System.out.println("EntranceActivity-userinit:"+LaunchActivity.mUserId);
        System.out.println("EntranceActivity-usercninit:"+LaunchActivity.mUserCn);
        System.out.println("EntranceActivity-roominit:"+LaunchActivity.mRoomId);

        if (null != intent) {
            if (intent.getStringExtra(Constant.USER_ID) != null) {
                LaunchActivity.mUserId = intent.getStringExtra(Constant.USER_ID);
            }
            if (intent.getStringExtra(Constant.ROOM_ID) != null) {
                LaunchActivity.mRoomId = intent.getStringExtra(Constant.ROOM_ID);
            }
        }
    }

    @Override
    protected void onStop() {
        super.onStop();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

}
