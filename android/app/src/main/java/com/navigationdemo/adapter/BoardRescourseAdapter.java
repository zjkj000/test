package com.navigationdemo.adapter;

import com.navigationdemo.R;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.navigationdemo.BoardRescourseBean;


import java.util.List;

public class BoardRescourseAdapter extends BaseAdapter {
    private List<BoardRescourseBean> data;
    private Context context;

    public BoardRescourseAdapter(List<BoardRescourseBean> data, Context context) {
        this.data = data;
        this.context = context;
    }

    public BoardRescourseAdapter() {

    }

    @Override
    public int getCount() {
        return data.size();
    }

    @Override
    public Object getItem(int i) {
        return null;
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        if(view==null){
            view = LayoutInflater.from(context).inflate(R.layout.boardresources_item, viewGroup,false);
        }
        ImageView img =  view.findViewById(R.id.packageitem_img);
        TextView tx_name = view.findViewById(R.id.packageitem_name);
        TextView tx_date = view.findViewById(R.id.packageitem_date);
        tx_name.setText(data.get(i).getPname());
        tx_date.setText(data.get(i).getPdate());
        return view;
    }
}
