package com.navigationdemo.setBoardFragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.CompoundButton;
import android.widget.Switch;

import androidx.fragment.app.Fragment;

import com.navigationdemo.MainActivity_stu;
import com.navigationdemo.R;
import com.tencent.teduboard.TEduBoardController;


public class Set_more_Fragment_Stu extends Fragment {


private Switch sw01,sw02,sw03;



    public static Set_more_Fragment_Stu newInstance(String param1, String param2) {
        Set_more_Fragment_Stu fragment = new Set_more_Fragment_Stu();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view=  inflater.inflate(R.layout.set_more_fragment, container, false);
        MainActivity_stu activity = (MainActivity_stu) getActivity();
        sw01=view.findViewById(R.id.sw01);
        sw02=view.findViewById(R.id.sw02);
        sw03=view.findViewById(R.id.sw03);


        sw01.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                activity.getmBoard().setHandwritingEnable(isChecked);
                System.out.println("+++是否开启笔锋"+isChecked);
                sw01.setChecked(isChecked);
            }
        });
        sw02.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                System.out.println("+++是否开启远端画笔"+isChecked);
                activity.getmBoard().setRemoteCursorVisible(isChecked, TEduBoardController.TEduBoardRemoteCursorAction.DRAWING);
                sw02.setChecked(isChecked);
            }
        });
        sw03.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                System.out.println("+++是否开启多点触控"+isChecked);
                activity.getmBoard().enableMultiTouch(isChecked);
                sw03.setChecked(isChecked);
            }
        });


        if(activity.getmBoard()!=null){
            if(activity.getmBoard().getBrushThin()==40){
                sw01.setChecked(activity.getmBoard().isHandwritingEnable());
            }
        }
        return view;
    }
}