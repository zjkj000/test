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


public class Set_geometry_Fragment extends Fragment {


    private LinearLayout setgeometrysize1,setgeometrysize2,setgeometrysize3,setgeometrysize4,setgeometrysize5,setgeometrysize6,setgeometrygray,setgeometryblack,setgeometryblue,setgeometrygreen,setgeometryyellow,setgeometryred;
    private ImageButton geometrysize1,geometrysize2,geometrysize3,geometrysize4,geometrysize5,geometrysize6,geometrygray,geometryblack,geometryblue,geometrygreen,geometryyellow,geometryred;

    public static Set_geometry_Fragment newInstance(String param1, String param2) {
        Set_geometry_Fragment fragment = new Set_geometry_Fragment();
        Bundle args = new Bundle();
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.set_geometry_fragment, container, false);
        MainActivity_tea activity = (MainActivity_tea) getActivity();

        geometrysize1 = view.findViewById(R.id.geometrysize1);
        setgeometrysize1 = view.findViewById(R.id.setgeometrysize1);
        geometrysize2 = view.findViewById(R.id.geometrysize2);
        setgeometrysize2 = view.findViewById(R.id.setgeometrysize2);
        geometrysize3 = view.findViewById(R.id.geometrysize3);
        setgeometrysize3 = view.findViewById(R.id.setgeometrysize3);
        geometrysize4 = view.findViewById(R.id.geometrysize4);
        setgeometrysize4 = view.findViewById(R.id.setgeometrysize4);
        geometrysize5 = view.findViewById(R.id.geometrysize5);
        setgeometrysize5 = view.findViewById(R.id.setgeometrysize5);
        geometrysize6 = view.findViewById(R.id.geometrysize6);
        setgeometrysize6 = view.findViewById(R.id.setgeometrysize6);


        geometrysize1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(40);
                setgeometrysize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        geometrysize2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(70);
                setgeometrysize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        geometrysize3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();

                activity.getmBoard().setBrushThin(100);
                setgeometrysize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        geometrysize4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(150);
                setgeometrysize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        geometrysize5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                activity.getmBoard().setBrushThin(200);
                setgeometrysize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        geometrysize6.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinSizestatus();
                activity.getmBoard().setBrushThin(250);
                setgeometrysize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        geometrygray = view.findViewById(R.id.geometrygray);
        setgeometrygray = view.findViewById(R.id.setgeometrygray);
        geometrygray.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("geometrycolor","gray");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.GRAY));
                setgeometrygray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        geometryblack = view.findViewById(R.id.geometryblack);
        setgeometryblack = view.findViewById(R.id.setgeometryblack);
        geometryblack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("geometrycolor","black");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.BLACK));
                setgeometryblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        geometryblue = view.findViewById(R.id.geometryblue);
        setgeometryblue = view.findViewById(R.id.setgeometryblue);
        geometryblue.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("geometrycolor","blue");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.BLUE));
                setgeometryblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        geometrygreen = view.findViewById(R.id.geometrygreen);
        setgeometrygreen = view.findViewById(R.id.setgeometrygreen);
        geometrygreen.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("geometrycolor","green");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.GREEN));
                setgeometrygreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        geometryyellow = view.findViewById(R.id.geometryyellow);
        setgeometryyellow = view.findViewById(R.id.setgeometryyellow);
        geometryyellow.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("geometrycolor","yellow");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.YELLOW));
                setgeometryyellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        geometryred = view.findViewById(R.id.geometryred);
        setgeometryred = view.findViewById(R.id.setgeometryred);
        geometryred.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinColorstatus();
                activity.forSetFragmentSet("geometrycolor","red");
                activity.getmBoard().setBrushColor(new TEduBoardController.TEduBoardColor(Color.RED));
                setgeometryred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });

        if(activity.getmBoard()!=null){
            if(activity.getmBoard().getBrushThin()==40){
                setgeometrysize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==70){
                setgeometrysize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==100){
                setgeometrysize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==150){
                setgeometrysize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==200){
                setgeometrysize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushThin()==250){
                setgeometrysize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
            if(activity.getmBoard().getBrushColor().toInt()==8947848){
                setgeometrygray.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==0){
                setgeometryblack.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==255){
                setgeometryblue.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==65280){
                setgeometrygreen.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==16776960){
                setgeometryyellow.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getBrushColor().toInt()==16711680){
                setgeometryred.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        }


        return view;
    }

    public void setLinSizestatus(){
        setgeometrysize1.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometrysize2.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometrysize3.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometrysize4.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometrysize5.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometrysize6.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
    }
    public void setLinColorstatus(){
        setgeometrygray.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometryblack.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometryblue.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometrygreen.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometryyellow.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        setgeometryred.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
    }
}