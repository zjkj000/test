package com.navigationdemo.setBoardFragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import androidx.fragment.app.Fragment;

import com.navigationdemo.MainActivity_stu;
import com.navigationdemo.R;
import com.tencent.teduboard.TEduBoardController;


public class Set_bg_Fragment_Stu extends Fragment {


private View bg01,bg02,bg03,bg04,bg05,bg06;
private RelativeLayout bg01RL,bg02RL,bg03RL,bg04RL,bg05RL,bg06RL;

    public static Set_bg_Fragment_Stu newInstance(String param1, String param2) {
        Set_bg_Fragment_Stu fragment = new Set_bg_Fragment_Stu();
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

        View view = inflater.inflate(R.layout.set_bg_fragment, container, false);
        MainActivity_stu activity = (MainActivity_stu) getActivity();
        bg01 = view.findViewById(R.id.bg01);
        bg01RL  = view.findViewById(R.id.bg01RL);
        bg02 = view.findViewById(R.id.bg02);
        bg02RL  = view.findViewById(R.id.bg02RL);
        bg03 = view.findViewById(R.id.bg03);
        bg03RL  = view.findViewById(R.id.bg03RL);
        bg04 = view.findViewById(R.id.bg04);
        bg04RL  = view.findViewById(R.id.bg04RL);
        bg05 = view.findViewById(R.id.bg05);
        bg05RL  = view.findViewById(R.id.bg05RL);
        bg06 = view.findViewById(R.id.bg06);
        bg06RL  = view.findViewById(R.id.bg06RL);
        bg01.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setBackgroundColor(new TEduBoardController.TEduBoardColor("#DD3232"));
                bg01RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        bg02.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setBackgroundColor(new TEduBoardController.TEduBoardColor("#FFFFFF"));
                bg02RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        bg03.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setBackgroundColor(new TEduBoardController.TEduBoardColor("#000000"));
                bg03RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        bg04.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setBackgroundColor(new TEduBoardController.TEduBoardColor("#234B37"));
                bg04RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        bg05.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setBackgroundColor(new TEduBoardController.TEduBoardColor("#B8631E"));
                bg05RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        bg06.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setBackgroundColor(new TEduBoardController.TEduBoardColor("#21439A"));
                bg06RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        if(activity.getmBoard()!=null){
            if(activity.getmBoard().getBackgroundColor().toInt()==14496306){
                bg01RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBackgroundColor().toInt()==16777215){
                bg02RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBackgroundColor().toInt()==0){
                bg03RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBackgroundColor().toInt()==2313015){
                bg04RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBackgroundColor().toInt()==12083998){
                bg05RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBackgroundColor().toInt()==2179994){
                bg06RL.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        }
        return view;
    }
    public void setLinstatus(){
        bg01RL.setBackground(getContext().getResources().getDrawable(R.color.bg_select_menu));
        bg02RL.setBackground(getContext().getResources().getDrawable(R.color.bg_select_menu));
        bg03RL.setBackground(getContext().getResources().getDrawable(R.color.bg_select_menu));
        bg04RL.setBackground(getContext().getResources().getDrawable(R.color.bg_select_menu));
        bg05RL.setBackground(getContext().getResources().getDrawable(R.color.bg_select_menu));
        bg06RL.setBackground(getContext().getResources().getDrawable(R.color.bg_select_menu));

    }
}