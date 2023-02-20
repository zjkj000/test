package com.navigationdemo;


import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.Toast;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;
import androidx.fragment.app.FragmentTransaction;

import com.tencent.trtc.TRTCCloud;

import java.util.ArrayList;
import java.util.Stack;
import java.util.TreeMap;

public class VideoListFragment extends Fragment {

    public static String TAG = "Ender_VideoListFragment";

    public static ArrayList<String> mUserList = new ArrayList<>();
    public static ArrayList<String> mCameraUserList = new ArrayList<>();
    public static TreeMap<String, CameraFragment> mCameraFragmentMap = new TreeMap<String, CameraFragment>();
    public static Stack<Integer> availableFragment = new Stack<>();
    public static TreeMap<String, Integer> occupiedFragment = new TreeMap<>();

    public static ArrayList<CameraFragment> videoFragmentList = new ArrayList<>();

    public static LinearLayout ScrollContainer;

    // Fragment管理

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.video_list, container, false);

//        mTRTCCloud = TRTCCloud.sharedInstance(getActivity().getApplicationContext());
//        mTRTCCloud.setListener(new MyTRTCCloudListener(VideoListFragment.this));

        initView(view);
        return view;
    }

    public boolean findUserInUserList(String userId) {
        for (int i = 0; i < mUserList.size(); i++){
            if(mUserList.get(i).equals(userId)){
                return true;
            }
        }
        return false;
    }

    public void initView(View view) {

        FragmentManager fragmentManager = getChildFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        videoFragmentList = new ArrayList<>();

        videoFragmentList.add((CameraFragment) fragmentManager.findFragmentById(R.id.camera_1));
        this.hideFragment(fragmentTransaction,videoFragmentList.get(0));
        availableFragment.push(0);
        videoFragmentList.add((CameraFragment) fragmentManager.findFragmentById(R.id.camera_2));
        this.hideFragment(fragmentTransaction,videoFragmentList.get(1));
        availableFragment.push(1);
        videoFragmentList.add((CameraFragment) fragmentManager.findFragmentById(R.id.camera_3));
        this.hideFragment(fragmentTransaction,videoFragmentList.get(2));
        availableFragment.push(2);
        videoFragmentList.add((CameraFragment) fragmentManager.findFragmentById(R.id.camera_4));
        this.hideFragment(fragmentTransaction,videoFragmentList.get(3));
        availableFragment.push(3);
        videoFragmentList.add((CameraFragment) fragmentManager.findFragmentById(R.id.camera_5));
        this.hideFragment(fragmentTransaction,videoFragmentList.get(4));
        availableFragment.push(4);
        videoFragmentList.add((CameraFragment) fragmentManager.findFragmentById(R.id.camera_6));
        this.hideFragment(fragmentTransaction,videoFragmentList.get(5));
        availableFragment.push(5);
        ScrollContainer = view.findViewById(R.id.ll_content);
        fragmentTransaction.commit();
    }

    public void hideFragment(FragmentTransaction mTransaction, CameraFragment fragment) {
        if(fragment != null) {
            mTransaction.hide(fragment);
        }
    }

    public void hideFragment(CameraFragment fragment) {
        if(fragment != null) {
            FragmentManager fragmentManager = getChildFragmentManager();
            FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
            fragmentTransaction.hide(fragment);
            fragmentTransaction.commit();
        }
   }

    public void addCameraView(String userId, String userName, TRTCCloud mTRTCCloud) {
        FragmentManager fragmentManager = getChildFragmentManager();
        FragmentTransaction fragmentTransaction = fragmentManager.beginTransaction();
        Integer mUserCount = availableFragment.pop();
        CameraFragment cameraFragmentNow = videoFragmentList.get(mUserCount);
        mUserList.add(userId);
        mCameraFragmentMap.put(userId, cameraFragmentNow);
        occupiedFragment.put(userId, mUserCount);
        cameraFragmentNow.setUserName(userName);
        fragmentTransaction.show(cameraFragmentNow);
        cameraFragmentNow.showVideo(mTRTCCloud, userId);
        fragmentTransaction.commit();
    }

    public void changeSpeaker(String userId, String action) {
        CameraFragment cameraFragment = mCameraFragmentMap.get(userId);
        if(cameraFragment != null) {
            if(action.equals("up")) {
                cameraFragment.showSpeakerIcon();
            } else if (action.equals("down")) {
                cameraFragment.hideSpeakerIcon();
            }
        }
    }

    public void setAudio(String userId, boolean available,TRTCCloud mTRTCCloud) {
        CameraFragment cameraFragment = mCameraFragmentMap.get(userId);
        if(cameraFragment != null) {
            if (available) {
                cameraFragment.startAudio(mTRTCCloud, userId);
            } else {
                cameraFragment.stopAudio(mTRTCCloud, userId);
            }
        } else {
//            Toast.makeText(activity, "未找到用户", Toast.LENGTH_SHORT).show();
        }
    }

    public void setVideo(String userId, boolean available, TRTCCloud mTRTCCloud) {
        CameraFragment cameraFragment = mCameraFragmentMap.get(userId);
        if(cameraFragment != null) {
            if (available) {
                cameraFragment.showVideo(mTRTCCloud, userId);
            } else {
                cameraFragment.hideVideo(mTRTCCloud, userId);
            }
        } else {
//            Toast.makeText(activity, "未找到用户", Toast.LENGTH_SHORT).show();
        }
    }

    public void stopVideo(String userId, TRTCCloud mTRTCCloud) {
        CameraFragment cameraFragment = mCameraFragmentMap.get(userId);
        if(cameraFragment != null) {
            cameraFragment.hideVideo(mTRTCCloud, userId);
        }
    }

    public void leaveRoom(String userId, int reason, MainActivity_tea activity, TRTCCloud mTRTCCloud){
        CameraFragment cameraFragment = mCameraFragmentMap.get(userId);
        if(cameraFragment != null) {
            cameraFragment.hideVideo(mTRTCCloud, userId);
            availableFragment.push(occupiedFragment.get(userId));
        }
        this.hideFragment(cameraFragment);
        mUserList.remove(userId);
        if(reason != 12580)
            Toast.makeText(activity, "用户 " + userId + " 退出房间: " + reason, Toast.LENGTH_SHORT).show();
    }

    public void leaveRoom(String userId, int reason, MainActivity_stu activity, TRTCCloud mTRTCCloud){
        CameraFragment cameraFragment = mCameraFragmentMap.get(userId);
        if(cameraFragment != null) {
            cameraFragment.hideVideo(mTRTCCloud, userId);
            availableFragment.push(occupiedFragment.get(userId));
        }
        this.hideFragment(cameraFragment);
        mUserList.remove(userId);
        if(reason != 12580)
            Toast.makeText(activity, "用户 " + userId + " 退出房间: " + reason, Toast.LENGTH_SHORT).show();
    }

}
