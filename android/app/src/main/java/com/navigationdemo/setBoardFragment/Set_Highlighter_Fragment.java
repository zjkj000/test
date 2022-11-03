package com.navigationdemo.setBoardFragment;

import android.graphics.Color;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import com.navigationdemo.R;

import androidx.fragment.app.Fragment;

import com.navigationdemo.MainActivity_tea;

import com.tencent.teduboard.TEduBoardController;


public class Set_Highlighter_Fragment extends Fragment {

    private LinearLayout sethihtlightersize1,sethihtlightersize2,sethihtlightersize3,sethihtlightersize4,sethihtlightersize5,sethihtlightersize6,sethihtlightergray,sethihtlighterblack,sethihtlighterblue,sethihtlightergreen,sethihtlighteryellow,sethihtlighterred;
    private ImageButton hihtlightersize1,hihtlightersize2,hihtlightersize3,hihtlightersize4,hihtlightersize5,hihtlightersize6,hihtlightergray,hihtlighterblack,hihtlighterblue,hihtlightergreen,hihtlighteryellow,hihtlighterred;


    public Set_Highlighter_Fragment() {
    }


    public static Set_Highlighter_Fragment newInstance(String param1, String param2) {
        Set_Highlighter_Fragment fragment = new Set_Highlighter_Fragment();
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

        // Inflate the layout for this fragment
        View view =  inflater.inflate(R.layout.set__highlighter_fragment, container, false);
        MainActivity_tea activity = (MainActivity_tea) getActivity();
        System.out.println("+++当前画笔粗细"+activity.getmBoard().getBrushThin());
        hihtlightersize1 = view.findViewById(R.id.hihtlightersize1);
        sethihtlightersize1 = view.findViewById(R.id.sethihtlightersize1);
        hihtlightersize1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(100);
                MainActivity_tea.cur_Highlighterpaintsize=100;
                sethihtlightersize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlightersize2 = view.findViewById(R.id.hihtlightersize2);
        sethihtlightersize2 = view.findViewById(R.id.sethihtlightersize2);
        hihtlightersize2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(150);
                MainActivity_tea.cur_Highlighterpaintsize=150;
                sethihtlightersize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlightersize3 = view.findViewById(R.id.hihtlightersize3);
        sethihtlightersize3 = view.findViewById(R.id.sethihtlightersize3);
        hihtlightersize3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(200);
                MainActivity_tea.cur_Highlighterpaintsize=200;
                sethihtlightersize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlightersize4 = view.findViewById(R.id.hihtlightersize4);
        sethihtlightersize4 = view.findViewById(R.id.sethihtlightersize4);
        hihtlightersize4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(250);
                MainActivity_tea.cur_Highlighterpaintsize=250;
                sethihtlightersize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlightersize5 = view.findViewById(R.id.hihtlightersize5);
        sethihtlightersize5 = view.findViewById(R.id.sethihtlightersize5);
        hihtlightersize5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(350);
                MainActivity_tea.cur_Highlighterpaintsize=350;
                sethihtlightersize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlightersize6 = view.findViewById(R.id.hihtlightersize6);
        sethihtlightersize6 = view.findViewById(R.id.sethihtlightersize6);
        hihtlightersize6.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(450);
                MainActivity_tea.cur_Highlighterpaintsize=450;
                sethihtlightersize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        hihtlightergray = view.findViewById(R.id.hihtlightergray);
        sethihtlightergray = view.findViewById(R.id.sethihtlightergray);
        hihtlightergray.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","gray");
                activity.getmBoard().setHighlighterColor(new TEduBoardController.TEduBoardColor(Color.GRAY));
                sethihtlightergray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlighterblack = view.findViewById(R.id.hihtlighterblack);
        sethihtlighterblack = view.findViewById(R.id.sethihtlighterblack);
        hihtlighterblack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","black");
                activity.getmBoard().setHighlighterColor(new TEduBoardController.TEduBoardColor(Color.BLACK));
                sethihtlighterblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlighterblue = view.findViewById(R.id.hihtlighterblue);
        sethihtlighterblue = view.findViewById(R.id.sethihtlighterblue);
        hihtlighterblue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","blue");
                activity.getmBoard().setHighlighterColor(new TEduBoardController.TEduBoardColor(Color.BLUE));
                sethihtlighterblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlightergreen = view.findViewById(R.id.hihtlightergreen);
        sethihtlightergreen = view.findViewById(R.id.sethihtlightergreen);
        hihtlightergreen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","green");
                activity.getmBoard().setHighlighterColor(new TEduBoardController.TEduBoardColor(Color.GREEN));
                sethihtlightergreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlighteryellow = view.findViewById(R.id.hihtlighteryellow);
        sethihtlighteryellow = view.findViewById(R.id.sethihtlighteryellow);
        hihtlighteryellow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","yellow");
                activity.getmBoard().setHighlighterColor(new TEduBoardController.TEduBoardColor(Color.YELLOW));
                sethihtlighteryellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        hihtlighterred = view.findViewById(R.id.hihtlighterred);
        sethihtlighterred = view.findViewById(R.id.sethihtlighterred);
        hihtlighterred.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("paintcolor","red");
                activity.getmBoard().setHighlighterColor(new TEduBoardController.TEduBoardColor(Color.RED));
                sethihtlighterred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        if(activity.getmBoard()!=null){
            System.out.println("+++荧光笔颜色"+activity.getmBoard().getHighlighterColor().toInt()+"---"+activity.getmBoard().getBrushColor().toInt());
            if(activity.getmBoard().getBrushThin()==100){
                sethihtlightersize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==150){
                sethihtlightersize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==200){
                sethihtlightersize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==250){
                sethihtlightersize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==350){
                sethihtlightersize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==450){
                sethihtlightersize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
            if(activity.getmBoard().getHighlighterColor().toInt()==2139654280){
                sethihtlightergray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getHighlighterColor().toInt()==2130706432){
                sethihtlighterblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getHighlighterColor().toInt()==2130706687){
                sethihtlighterblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getHighlighterColor().toInt()==2130771712){
                sethihtlightergreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getHighlighterColor().toInt()==2147483392){
                sethihtlighteryellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getHighlighterColor().toInt()==2147418112){
                sethihtlighterred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        }

        return view;
    }

    public void setLinSizestatus(){
        sethihtlightersize1.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlightersize2.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlightersize3.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlightersize4.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlightersize5.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlightersize6.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
    }
    public void setLinColorstatus(){
        sethihtlightergray.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlighterblack.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlighterblue.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlightergreen.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlighteryellow.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        sethihtlighterred.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
    }
}