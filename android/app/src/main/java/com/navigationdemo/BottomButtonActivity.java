package com.navigationdemo;

import android.view.View;
import android.view.ViewGroup;

import com.tencent.rtmp.ui.TXCloudVideoView;
import com.tencent.trtc.TRTCCloudDef;

public class BottomButtonActivity extends LaunchActivity implements View.OnClickListener{
    public static ViewGroup.LayoutParams oldparams;
    //举手
    public static void muteHand() {
        boolean isSelected = mButtonHand.isSelected();
        if (!isSelected) {
            HttpActivity.testRaiseHandAction("up");//举手上讲台
        }
        else{
            HttpActivity.testRaiseHandAction("down");//放手下讲台
        }
        mButtonHand.setSelected(!isSelected);
    }

    //开闭聊天室
    public static void muteMessage() {
        boolean isSelected = mButtonMessage.isSelected();
        if (!isSelected) {
            recyclerView.setVisibility(View.GONE);
        } else {
            recyclerView.setVisibility(View.VISIBLE);
        }
        mButtonMessage.setSelected(!isSelected);
    }

    //开闭麦
    public static void muteAudio() {
        boolean isSelected = mButtonMuteAudio.isSelected();
        if (!isSelected) {
            //mTRTCCloud.startLocalAudio(16);
            mTRTCCloud.muteLocalAudio(true);
        } else {
            //mTRTCCloud.stopLocalAudio();
            mTRTCCloud.muteLocalAudio(false);
        }
        mButtonMuteAudio.setSelected(!isSelected);
    }

    //开闭摄像头
    public static void muteVideo() {
        boolean isSelected = mButtonMuteVideo.isSelected();
        if (!isSelected) {
            mTRTCCloud.stopLocalPreview();
            mTXCVVLocalPreviewView.setVisibility(View.VISIBLE);
            mTXCVVLocalPreviewView_background.setVisibility(View.VISIBLE);
            mTXCVVLocalPreviewView_background.bringToFront();

            System.out.println("refreshRemoteVideoViews:"+AnswerActivity.platformUserId);
            String[] ids = null;
            int flagp = 0;
            if(HttpActivity.platformUserId!=null){
                ids = AnswerActivity.platformUserId.split(",");
                for(int i=0;i<ids.length;i++){
                    System.out.println("name:"+ids[i].split("_")[0]);

                    if(HttpActivity.platformUserId!=null && mUserId.equals(ids[i].split("_")[0])){
                        flagp = 1;

                        //mTXCVVLocalPreviewView.setVisibility(GONE);
                        //mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
                        //mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
                    }
                }
                if(flagp==1){
                    mPlatform.bringToFront();
                    mPlatform.setVisibility(View.VISIBLE);
                }
                else{
                    mPlatform.setVisibility(View.GONE);
                }
            }

        } else {
            mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
            //mTXCVVLocalPreviewView.setVisibility(View.VISIBLE);
            //mTXCVVLocalPreviewView_background.br;
            mTXCVVLocalPreviewView.bringToFront();

            System.out.println("refreshRemoteVideoViews:"+AnswerActivity.platformUserId);
            String[] ids = null;
            int flagp = 0;
            if(HttpActivity.platformUserId!=null){
                ids = AnswerActivity.platformUserId.split(",");
                for(int i=0;i<ids.length;i++){
                    System.out.println("name:"+ids[i].split("_")[0]);

                    if(HttpActivity.platformUserId!=null && mUserId.equals(ids[i].split("_")[0])){
                        flagp = 1;

                        //mTXCVVLocalPreviewView.setVisibility(GONE);
                        //mTRTCCloud.startLocalPreview(mIsFrontCamera, mTXCVVLocalPreviewView);
                        //mTRTCCloud.startLocalAudio(TRTCCloudDef.TRTC_AUDIO_QUALITY_SPEECH);
                    }
                }
                if(flagp==1){
                    mPlatform.bringToFront();
                    mPlatform.setVisibility(View.VISIBLE);
                }
                else{
                    mPlatform.setVisibility(View.GONE);
                }
            }
        }
        mButtonMuteVideo.setSelected(!isSelected);
    }

    //前后摄像头转换
    public static void switchCamera() {
        mIsFrontCamera = !mIsFrontCamera;
        mTXDeviceManager.switchCamera(mIsFrontCamera);
    }

    //刷新
    public static void remoteRefresh() {
        System.out.println("remoteRefresh");

        stu_index = 0;
        for (int i = 0; i < mRemoteViewList.size(); i++) {
            if (i < mRemoteUidList.size()) {
                System.out.println("mRemoteViewList["+i+"]"+mRemoteViewList.get(i));
                System.out.println("mRemoteUidList["+i+"]"+mRemoteUidList.get(i));
                String remoteUid = mRemoteUidList.get(i);

                //teacher-share
                if(remoteUid.contains("share")){
                    //mTeacherShare.setVisibility(View.VISIBLE);
                    mTRTCCloud.startRemoteView(remoteUid, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL,mTeacherShare);
                }

                //teacher-camera
                else if(remoteUid.contains("_camera")){
                    //mTeacherCamera.setVisibility(View.VISIBLE);
                    mTRTCCloud.startRemoteView(remoteUid, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL,mTeacherCamera);
                }

                //student_1/2/3/4/5/6
                else{
                    TXCloudVideoView temp =stu_map.get(stu_index++);
                    //temp.setVisibility(View.VISIBLE);
                    mTRTCCloud.startRemoteView(remoteUid, TRTCCloudDef.TRTC_VIDEO_STREAM_TYPE_SMALL,temp);
                }
            }
//            else {
//                mRemoteViewList.get(i).setVisibility(View.GONE);
//            }
        }
    }

    //全屏
    public static void fullscreen(){
        boolean isSelected = mFullScreen.isSelected();
        if (isSelected) {
            mTextTitle.setVisibility(View.VISIBLE);
            mImageBack.setVisibility(View.VISIBLE);
            mstroll.setVisibility(View.VISIBLE);
            ViewGroup.LayoutParams params = mTeacherShare.getLayoutParams();
            params.width = 0;
            params.height = 0;
            //System.out.println("params.width:"+params.width);
            //params.height = params.height * 8 / 10;
            mTeacherShare.setLayoutParams(params);
        }
        else {
            mTextTitle.setVisibility(View.GONE);
            mImageBack.setVisibility(View.GONE);
            mstroll.setVisibility(View.GONE);
            ViewGroup.LayoutParams params = mTeacherShare.getLayoutParams();
            params.width = ViewGroup.LayoutParams.MATCH_PARENT;
            params.height = ViewGroup.LayoutParams.MATCH_PARENT;//
            System.out.println("params.width:"+params.width);
            mTeacherShare.setLayoutParams(params);
        }
        mFullScreen.setSelected(!isSelected);
    }

    //点击教师共享屏幕、隐藏底部一排按钮
    public static void touchTeachershare(){
        boolean isSelected = mTeacherShare.isSelected();
        if(current_answer!=null){
            if (!isSelected) {
                current_answer.setVisibility(View.VISIBLE);
                //顶部消失
                //mImageBack.setVisibility(View.GONE);
                //mTextTitle.setVisibility(View.GONE);
                //底部消失
                mGroupButtons.setVisibility(View.GONE);
            }
            else {
                current_answer.setVisibility(View.GONE);
                //顶部出现
                //mTextTitle.setVisibility(View.VISIBLE);
                //mImageBack.setVisibility(View.VISIBLE);
                //底部出现
                mGroupButtons.setVisibility(View.VISIBLE);

            }
        }
        else{
            if (!isSelected) {
                //顶部出现
                mTextTitle.setVisibility(View.VISIBLE);
                mImageBack.setVisibility(View.VISIBLE);
                //底部出现
                mGroupButtons.setVisibility(View.VISIBLE);
            }
            else {
                //顶部消失
                mImageBack.setVisibility(View.GONE);
                mTextTitle.setVisibility(View.GONE);
                //底部消失
                mGroupButtons.setVisibility(View.GONE);
            }
        }

        mTeacherShare.setSelected(!isSelected);
    }
}
