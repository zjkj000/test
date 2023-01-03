package com.navigationdemo.adapter;

import com.navigationdemo.R;
import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.navigationdemo.BoardRescourseBean;


import java.util.List;


//载入  云端资源使用到的
public class BoardLoadingAirRescourseAdapter extends BaseAdapter {
    private List<BoardRescourseBean> data;

    public void setData(List<BoardRescourseBean> data) {
        this.data = data;
    }

    private Context context;
    private BoardLoadingAirRescourseAdapter.OnChooseFileClickListener mOnChooseFileClickListener;

    public BoardLoadingAirRescourseAdapter(List<BoardRescourseBean> data, Context context) {
        this.data = data;
        this.context = context;
    }

    @Override
    public int getCount() {
        if (data != null) {
            return data.size();
        }
        return 0;
    }

    @Override
    public BoardRescourseBean getItem(int position) {
        if (data != null) {
            return data.get(position);
        }
        return null;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    //设置行不可点击
    @Override
    public boolean isEnabled(int position) {
        return false;
    }

    public void setOnSpeakerControllerClickListener(BoardLoadingAirRescourseAdapter.OnChooseFileClickListener mOnChooseFileClickListener) {
        this.mOnChooseFileClickListener = mOnChooseFileClickListener;
    }


    public interface OnChooseFileClickListener {
        void OnChooseFileClick(BoardRescourseBean item);
    }


    public static class ViewHolder{
        public TextView tx_name;
        public ImageView img;
        public TextView tx_date;
        public TextView zairu;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder ;
        if(convertView == null){
            //获取list_item.xml页面
            viewHolder = new ViewHolder();
            convertView = LayoutInflater.from(context).inflate(R.layout.boardresources_item,parent,false);
            viewHolder.img =  convertView.findViewById(R.id.packageitem_type);
            viewHolder.tx_name = convertView.findViewById(R.id.packageitem_name);
            viewHolder.tx_date = convertView.findViewById(R.id.packageitem_date);
            viewHolder.zairu = convertView.findViewById(R.id.zairu);
            convertView.setTag(viewHolder);
        }else{
            //第一次以后
            viewHolder = (ViewHolder)convertView.getTag();
        }
        //textView里面放置bean的数据
        viewHolder.tx_name.setText(data.get(position).getPname());
        viewHolder.tx_date.setText(data.get(position).getPdate());
        viewHolder.tx_date.setTextColor(Color.rgb(180,180,180));
//        根据类型判断
        if(data.get(position).getStyle().equals("ppt")||data.get(position).getStyle().equals("pptx")){
            viewHolder.img.setImageResource(R.mipmap.type_ppt);
        }else if(data.get(position).getStyle().equals("doc")||data.get(position).getStyle().equals("docx")){
            viewHolder.img.setImageResource(R.mipmap.type_word);
        }else if(data.get(position).getStyle().equals("pdf")){
            viewHolder.img.setImageResource(R.mipmap.type_pdf);
        }else if(data.get(position).getStyle().equals("mp4")){
            viewHolder.img.setImageResource(R.mipmap.type_mp4);
        }else if(data.get(position).getStyle().equals("mp3")){
            viewHolder.img.setImageResource(R.mipmap.type_mp3);
        }else if(data.get(position).getStyle().equals("img")||data.get(position).getStyle().equals("jpg")||data.get(position).getStyle().equals("png")){
            viewHolder.img.setImageResource(R.mipmap.type_img);
        }else {
            viewHolder.img.setImageResource(R.mipmap.type_other);
        }
        viewHolder.zairu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mOnChooseFileClickListener.OnChooseFileClick(data.get(position));
            }
        });
        return convertView;
    }


}
