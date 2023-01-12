package com.navigationdemo;


import android.annotation.SuppressLint;
import android.graphics.drawable.Drawable;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.tencent.liteav.TXLiteAVCode;
import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloud;
import com.tencent.trtc.TRTCCloudDef;
import com.tencent.trtc.TRTCCloudListener;
import com.tencent.trtc.debug.GenerateTestUserSig;

public class CameraFragment  extends Fragment {

    private final String TAG = "Ender_MainActivity";
    private TXCloudVideoView videoView;
    private RelativeLayout cameraBackgroundView;
    private TextView userNameView;
    private ImageView speakerIcon;

//    private TRTCCloud mTRTCCloud;
//
//    private TRTCCloudDef.TRTCParams myTRTCParams;
//    private TXCloudVideoView mTXCVVTeacherPreviewView;
//    private RelativeLayout teacherTRTCBackground;

    @Nullable
    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.camera_fragment,container, false);
        initView(view);
        initAudioIcon();
//        Bundle bundle = getArguments();
//        String userNameString = "";
//        if(bundle != null) {
//            userNameString = bundle.getString("userName");
//            Toast.makeText(getActivity(), "get UserName " + userNameString, Toast.LENGTH_SHORT).show();
//        }
//        userNameView.setText(userNameString);
        return view;
    }

    @Override
    public void onViewCreated(@NonNull View view, @Nullable Bundle savedInstanceState) {
        super.onViewCreated(view, savedInstanceState);

    }
    public void initView(View view) {
        videoView = view.findViewById(R.id.camera_view);
        cameraBackgroundView = view.findViewById(R.id.teacher_background);
        userNameView = view.findViewById(R.id.teacher_name);
        speakerIcon = view.findViewById(R.id.speaker_icon);
    }

    public void initAudioIcon() {
        @SuppressLint("UseCompatLoadingForDrawables") Drawable teacher_name_mic_icon = getResources().getDrawable(R.drawable.mic_on);
        teacher_name_mic_icon.setBounds(0,0,20,20);
        userNameView.setCompoundDrawables(teacher_name_mic_icon, null, null, null);
    }
    public void setUserName(String userName) {
        userNameView.setText(userName);
    }

    public void showVideo(TRTCCloud mTRTCCloud, String userId) {
        mTRTCCloud.startRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG, getVideoView());
        getVideoBackground().setVisibility(View.INVISIBLE);
    }

    public void startAudio(TRTCCloud mTRTCCloud, String userId) {
        @SuppressLint("UseCompatLoadingForDrawables") Drawable user_name_mic_icon = getResources().getDrawable(R.drawable.mic_on);
        user_name_mic_icon.setBounds(0,0,20,20);
        getUserNameView().setCompoundDrawables(user_name_mic_icon, null, null, null);
    }

    public void stopAudio(TRTCCloud mTRTCCloud, String userId) {
        @SuppressLint("UseCompatLoadingForDrawables") Drawable user_name_mic_icon = getResources().getDrawable(R.drawable.mic_off);
        user_name_mic_icon.setBounds(0,0,20,20);
        getUserNameView().setCompoundDrawables(user_name_mic_icon, null, null, null);
    }

    public void showSpeakerIcon() {
        speakerIcon.setVisibility(View.VISIBLE);
    }
    public void hideSpeakerIcon() {
        speakerIcon.setVisibility(View.INVISIBLE);
    }

    public void hideVideo(TRTCCloud mTRTCCloud, String userId) {
        mTRTCCloud.stopRemoteView(userId, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_BIG);
        getVideoBackground().setVisibility(View.VISIBLE);
    }

    public RelativeLayout getVideoBackground() {
        return cameraBackgroundView;
    }

    public TXCloudVideoView  getVideoView() {
        return videoView;
    }
    public TextView  getUserNameView() {
        return userNameView;
    }
}
