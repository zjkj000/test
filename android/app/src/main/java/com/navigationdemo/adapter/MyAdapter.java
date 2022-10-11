package com.navigationdemo.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.TextView;
import com.navigationdemo.R;



import java.util.List;

public class MyAdapter extends BaseAdapter {
    private Context mContext;  //上下文
    private List<String> mData;  //listview的数据
    private int mSelect = 0;  //当前选中的index
    private boolean isSelect = true;  //汇总数据是否被选中

    public MyAdapter() {
    }

    public MyAdapter(List<String> mData, Context mContext , int mSelect , boolean isSelect) {
        this.mData = mData;
        this.mContext = mContext;
        this.mSelect = mSelect;
        this.isSelect = isSelect;
    }

    public void changeSelected(int positon){ //刷新方法
        if(positon != this.mSelect){
            this.mSelect = positon;
            notifyDataSetChanged();
        }
    }

    public void setmSelect(int mSelect) {
        this.mSelect = mSelect;
    }

    public int getmSelect(){
        return mSelect;
    }

    public boolean isSelect() {
        return isSelect;
    }

    public void setSelect(boolean select) {
        isSelect = select;
        notifyDataSetChanged();
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
            convertView = LayoutInflater.from(mContext).inflate(R.layout.classlist_item, parent, false);
            holder = new ViewHolder();
            holder.txt_classname = (TextView) convertView.findViewById(R.id.classname);
            convertView.setTag(holder);
        } else {
            holder = (ViewHolder) convertView.getTag();
        }
        if(isSelect == true){
//            System.out.println("listItem都没选中，选中了汇总数据");
            holder.txt_classname.setBackgroundColor(Color.parseColor("#FFFFFF"));
            holder.txt_classname.setTextColor(Color.parseColor("#FF000000"));
        }else{
            if(mSelect == position){  //选中的item样式
//                System.out.println("isSelect: " + isSelect + "     mSelect: " + mSelect + "   position: " + position);
                holder.txt_classname.setBackgroundColor(Color.parseColor("#007947"));
                holder.txt_classname.setTextColor(Color.parseColor("#FFFFFF"));
            }else{
                holder.txt_classname.setBackgroundColor(Color.parseColor("#FFFFFF"));
//                holder.txt_classname.setTextColor(Color.parseColor("#828798"));
                holder.txt_classname.setTextColor(Color.parseColor("#FF000000"));
            }
        }

        holder.txt_classname.setText(mData.get(position));
        return convertView;
    }

    private class ViewHolder {
        TextView txt_classname;
    }
}
