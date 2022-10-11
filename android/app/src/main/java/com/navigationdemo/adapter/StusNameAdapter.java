package com.navigationdemo.adapter;

import com.navigationdemo.R;
import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;



import java.util.List;

public class StusNameAdapter extends BaseAdapter {
    private Context mContext;  //上下文
    private List<String> mData;  //listview的数据

    public StusNameAdapter() {
    }

    public StusNameAdapter(List<String> mData, Context mContext) {
        this.mData = mData;
        this.mContext = mContext;
    }


    @Override
    public int getCount() {
        return mData.size();
    }

    @Override
    public Object getItem(int i) {
        return mData.get(i);
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder holder = null;
        if (convertView == null) {
            convertView = LayoutInflater.from(mContext).inflate(R.layout.stusnamelist_item, parent, false);
            holder = new ViewHolder();
            holder.txt_stuname = (TextView) convertView.findViewById(R.id.stusname);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        holder.txt_stuname.setBackgroundColor(Color.parseColor("#007947"));
        holder.txt_stuname.setTextColor(Color.parseColor("#FFFFFF"));
        holder.txt_stuname.setText(mData.get(position));
        return convertView;
    }

    private class ViewHolder {
        TextView txt_stuname;
    }
}
