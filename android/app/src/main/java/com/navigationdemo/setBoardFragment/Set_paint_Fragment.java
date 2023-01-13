package com.navigationdemo.setBoardFragment;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import androidx.fragment.app.Fragment;
import com.navigationdemo.R;

import com.navigationdemo.MainActivity_tea;

import com.tencent.teduboard.TEduBoardController;


public class Set_paint_Fragment extends Fragment {

    private LinearLayout setpaintsize1,setpaintsize2,setpaintsize3,setpaintsize4,setpaintsize5,setpaintsize6,setpaintgray,setpaintblack,setpaintblue,setpaintgreen,setpaintyellow,setpaintred;
    private ImageButton paintsize1,paintsize2,paintsize3,paintsize4,paintsize5,paintsize6,paintgray,paintblack,paintblue,paintgreen,paintyellow,paintred;


    public static Set_paint_Fragment newInstance(String param1, String param2) {
        Set_paint_Fragment fragment = new Set_paint_Fragment();
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
        View view =  inflater.inflate(R.layout.set_paint_fragment, container, false);
        MainActivity_tea activity = (MainActivity_tea) getActivity();

        System.out.print("+++当前几何工具的颜色" +activity.getmBoard().getBrushColor().toInt());
        System.out.print("+++当前几何工具的大小" + activity.getmBoard().getBrushThin());


        paintsize1 = view.findViewById(R.id.paintsize1);
        setpaintsize1 = view.findViewById(R.id.setpaintsize1);
        paintsize1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(25);
                MainActivity_tea.cur_paintsize=25;
                setpaintsize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintsize2 = view.findViewById(R.id.paintsize2);
        setpaintsize2 = view.findViewById(R.id.setpaintsize2);
        paintsize2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(50);
                MainActivity_tea.cur_paintsize=50;
                setpaintsize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintsize3 = view.findViewById(R.id.paintsize3);
        setpaintsize3 = view.findViewById(R.id.setpaintsize3);
        paintsize3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(75);
                MainActivity_tea.cur_paintsize=75;
                setpaintsize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintsize4 = view.findViewById(R.id.paintsize4);
        setpaintsize4 = view.findViewById(R.id.setpaintsize4);
        paintsize4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(100);
                MainActivity_tea.cur_paintsize=100;
                setpaintsize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintsize5 = view.findViewById(R.id.paintsize5);
        setpaintsize5 = view.findViewById(R.id.setpaintsize5);
        paintsize5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(125);
                MainActivity_tea.cur_paintsize=125;
                setpaintsize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintsize6 = view.findViewById(R.id.paintsize6);
        setpaintsize6 = view.findViewById(R.id.setpaintsize6);
        paintsize6.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(250);
                MainActivity_tea.cur_paintsize=250;
                setpaintsize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        paintgray = view.findViewById(R.id.paintgray);
        setpaintgray = view.findViewById(R.id.setpaintgray);
        paintgray.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","gray");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.GRAY));
                setpaintgray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintblack = view.findViewById(R.id.paintblack);
        setpaintblack = view.findViewById(R.id.setpaintblack);
        paintblack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","black");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.BLACK));
                MainActivity_tea.CurPaintColor=activity.getmBoard().getBrushColor().toInt();
                setpaintblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintblue = view.findViewById(R.id.paintblue);
        setpaintblue = view.findViewById(R.id.setpaintblue);
        paintblue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","blue");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.BLUE));
                MainActivity_tea.CurPaintColor=activity.getmBoard().getBrushColor().toInt();
                setpaintblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintgreen = view.findViewById(R.id.paintgreen);
        setpaintgreen = view.findViewById(R.id.setpaintgreen);
        paintgreen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","green");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.GREEN));
                MainActivity_tea.CurPaintColor=activity.getmBoard().getBrushColor().toInt();
                setpaintgreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintyellow = view.findViewById(R.id.paintyellow);
        setpaintyellow = view.findViewById(R.id.setpaintyellow);
        paintyellow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","yellow");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.YELLOW));
                MainActivity_tea.CurPaintColor=activity.getmBoard().getBrushColor().toInt();
                setpaintyellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        paintred = view.findViewById(R.id.paintred);
        setpaintred = view.findViewById(R.id.setpaintred);
        paintred.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","red");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.RED));
                MainActivity_tea.CurPaintColor=activity.getmBoard().getBrushColor().toInt();
                setpaintred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        System.out.println("+++画笔颜色"+activity.getmBoard().getBrushColor().toInt());
        if(activity.getmBoard()!=null){
            if(activity.getmBoard().getBrushThin()==25){
                setpaintsize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==50){
                setpaintsize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==75){
                setpaintsize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==100){
                setpaintsize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==125){
                setpaintsize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==250){
                setpaintsize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
            if(activity.getmBoard().getBrushColor().toInt()==-7829368){
                setpaintgray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==-16777216){
                setpaintblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==-16776961){
                setpaintblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==-16711936){
                setpaintgreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==-256){
                setpaintyellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==-65536){
                setpaintred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }


        }

        return view;
    }

    public void setLinSizestatus(){
        setpaintsize1.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintsize2.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintsize3.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintsize4.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintsize5.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintsize6.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
    }
    public void setLinColorstatus(){
        setpaintgray.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintblack.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintblue.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintgreen.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintyellow.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setpaintred.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
    }

}