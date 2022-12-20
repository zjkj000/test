package com.navigationdemo.setBoardFragment;

import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageButton;
import android.widget.LinearLayout;

import androidx.fragment.app.Fragment;

import com.navigationdemo.MainActivity_stu;
import com.navigationdemo.R;


public class Set_eraser_Fragment_Stu extends Fragment {

    private String erasersize="4";


    private LinearLayout seterasersize1,seterasersize2,seterasersize3,seterasersize4,seterasersize5,seterasersize6;
    private ImageButton eraser1,eraser2,eraser3,eraser4,eraser5,eraser6;


    public Set_eraser_Fragment_Stu(String erasersize) {
        this.erasersize= erasersize;
    }


    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        View view =  inflater.inflate(R.layout.set_eraser_fragment, container, false);
        MainActivity_stu activity = (MainActivity_stu) getActivity();
         eraser1 = view.findViewById(R.id.erasersize1);
         eraser2 = view.findViewById(R.id.erasersize2);
         eraser3 = view.findViewById(R.id.erasersize3);
         eraser4 = view.findViewById(R.id.erasersize4);
         eraser5 = view.findViewById(R.id.erasersize5);
         eraser6 = view.findViewById(R.id.erasersize6);
        seterasersize1= view.findViewById(R.id.seterasersize1);
        seterasersize2= view.findViewById(R.id.seterasersize2);
        seterasersize3= view.findViewById(R.id.seterasersize3);
        seterasersize4= view.findViewById(R.id.seterasersize4);
        seterasersize5= view.findViewById(R.id.seterasersize5);
        seterasersize6= view.findViewById(R.id.seterasersize6);

        eraser1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setEraserSize(Integer.parseInt("8"));
                seterasersize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        eraser2.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setEraserSize(Integer.parseInt("12"));
                seterasersize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        eraser3.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setEraserSize(Integer.parseInt("16"));
                seterasersize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        eraser4.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setEraserSize(Integer.parseInt("20"));
                seterasersize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        eraser5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setEraserSize(Integer.parseInt("24"));
                seterasersize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        eraser6.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                setLinstatus();
                activity.getmBoard().setEraserSize(Integer.parseInt("30"));
                seterasersize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        });
        if(activity.getmBoard()!=null){
            if(activity.getmBoard().getEraserSize()==8){
                seterasersize1.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getEraserSize()==12){
                seterasersize2.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getEraserSize()==16){
                seterasersize3.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getEraserSize()==20){
                seterasersize4.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getEraserSize()==24){
                seterasersize5.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }else if(activity.getmBoard().getEraserSize()==30){
                seterasersize6.setBackground(getContext().getResources().getDrawable(R.color.blue_white));
            }
        }
        return view;
    }
    public void setLinstatus(){
        seterasersize1.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        seterasersize2.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        seterasersize3.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        seterasersize4.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        seterasersize5.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));
        seterasersize6.setBackground(getContext().getResources().getDrawable(R.color.bg_select_shadow));

    }
}