package com.navigationdemo.setBoardFragment;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.SeekBar;
import android.widget.TextView;

import androidx.fragment.app.Fragment;

import com.navigationdemo.MainActivity_stu;
import com.navigationdemo.R;
import com.tencent.teduboard.TEduBoardController;


public class Set_text_Fragment_Stu extends Fragment {

    private LinearLayout settextgray,settextblack,settextblue,settextgreen,settextyellow,settextred;
    private ImageButton textgray,textblack,textblue,textgreen,textyellow,textred;
    private SeekBar seekBar;
    private TextView setText_textsize;
    public Set_text_Fragment_Stu() {

    }


    public static Set_text_Fragment_Stu newInstance(String param1, String param2) {
        Set_text_Fragment_Stu fragment = new Set_text_Fragment_Stu();
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
        View view= inflater.inflate(R.layout.set_text_fragment, container, false);
        MainActivity_stu activity = (MainActivity_stu) getActivity();

        seekBar =view.findViewById(R.id.selectTextSize);
        seekBar.setOnSeekBarChangeListener(new SeekBar.OnSeekBarChangeListener() {
            @Override
            public void onProgressChanged(SeekBar seekBar, int progress, boolean fromUser) {
                System.out.println("+++proccess"+progress);
                if(progress<=1){
                    //1号字体
                    setText_textsize.setText("超小");
                    activity.getmBoard().setTextSize(240);
                }else if(progress<=2){
                    //2号字体
                    setText_textsize.setText("小号");
                    activity.getmBoard().setTextSize(320);
                }else if(progress<=3){
                    //3号字体
                    setText_textsize.setText("标准");
                    activity.getmBoard().setTextSize(700);
                }else if(progress<=4){
                    //4号字体
                    setText_textsize.setText("大号");
                    activity.getmBoard().setTextSize(1000);
                }else if(progress<=5){
                    //5号字体
                    setText_textsize.setText("超大");
                    activity.getmBoard().setTextSize(1300);
                }else {
                    //6号字体
                    setText_textsize.setText("特大");
                    activity.getmBoard().setTextSize(1600);
                }
            }

            @Override
            public void onStartTrackingTouch(SeekBar seekBar) {
            }

            @Override
            public void onStopTrackingTouch(SeekBar seekBar) {
            }
        });
        setText_textsize=view.findViewById(R.id.setText_textsize);

        textgray = view.findViewById(R.id.textgray);
        settextgray = view.findViewById(R.id.settextgray);
        textgray.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("textcolor","gray");
                activity.getmBoard().setTextColor(new TEduBoardController.TEduBoardColor(Color.GRAY));
                settextgray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        textblack = view.findViewById(R.id.textblack);
        settextblack = view.findViewById(R.id.settextblack);
        textblack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("textcolor","black");
                activity.getmBoard().setTextColor(new TEduBoardController.TEduBoardColor(Color.BLACK));
                settextblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        textblue = view.findViewById(R.id.textblue);
        settextblue = view.findViewById(R.id.settextblue);
        textblue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("textcolor","blue");
                activity.getmBoard().setTextColor(new TEduBoardController.TEduBoardColor(Color.BLUE));
                settextblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        textgreen = view.findViewById(R.id.textgreen);
        settextgreen = view.findViewById(R.id.settextgreen);
        textgreen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("textcolor","green");
                activity.getmBoard().setTextColor(new TEduBoardController.TEduBoardColor(Color.GREEN));
                settextgreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        textyellow = view.findViewById(R.id.textyellow);
        settextyellow = view.findViewById(R.id.settextyellow);
        textyellow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("textcolor","yellow");
                activity.getmBoard().setTextColor(new TEduBoardController.TEduBoardColor(Color.YELLOW));
                settextyellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        textred = view.findViewById(R.id.textred);
        settextred = view.findViewById(R.id.settextred);
        textred.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("textcolor","red");
                activity.getmBoard().setTextColor(new TEduBoardController.TEduBoardColor(Color.RED));
                settextred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        System.out.println("+++荧光笔颜色"+activity.getmBoard().getTextColor().toInt());
        if(activity.getmBoard()!=null){
            if(activity.getmBoard().getTextColor().toInt()==-7829368){
                settextgray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getTextColor().toInt()==-16777216){
                settextblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getTextColor().toInt()==-16776961){
                settextblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getTextColor().toInt()==-16711936){
                settextgreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getTextColor().toInt()==-256){
                settextyellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getTextColor().toInt()==-65536){
                settextred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }


            if(activity.getmBoard().getTextSize()<=240){
                seekBar.setProgress(1);
                setText_textsize.setText("超小");
            }else if(activity.getmBoard().getTextSize()<=320){
                seekBar.setProgress(2);
                setText_textsize.setText("小");
            }else if(activity.getmBoard().getTextSize()<=700){
                seekBar.setProgress(3);
                setText_textsize.setText("标准");
            }else if(activity.getmBoard().getTextSize()<=1000){
                seekBar.setProgress(4);
                setText_textsize.setText("大");
            }else if(activity.getmBoard().getTextSize()<=1300){
                seekBar.setProgress(5);
                setText_textsize.setText("超大");
            }else if(activity.getmBoard().getTextSize()<=1600){
                seekBar.setProgress(6);
                setText_textsize.setText("特大");
            }
        }
        return view;
    }

    public void setLinColorstatus(){
        settextgray.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        settextblack.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        settextblue.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        settextgreen.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        settextyellow.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        settextred.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
    }
}