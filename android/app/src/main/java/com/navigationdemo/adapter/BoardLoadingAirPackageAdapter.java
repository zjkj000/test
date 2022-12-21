package com.navigationdemo.adapter;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.TextView;

import com.navigationdemo.BoardRescourseBean;
import com.navigationdemo.R;

import java.util.List;


//载入  云端资源使用到的
public class BoardLoadingAirPackageAdapter extends BaseAdapter {
    private List<BoardRescourseBean> data;

    public void setData(List<BoardRescourseBean> data) {
        this.data = data;
    }

    private Context context;
    private BoardLoadingAirPackageAdapter.OnChoosePackageClickListener mOnChoosePackageClickListener;

    public BoardLoadingAirPackageAdapter(List<BoardRescourseBean> data, Context context) {
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

    public void setOnSpeakerControllerClickListener(BoardLoadingAirPackageAdapter.OnChoosePackageClickListener mOnChoosePackageClickListener) {
        this.mOnChoosePackageClickListener = mOnChoosePackageClickListener;
    }


    public interface OnChoosePackageClickListener {
        void OnChoosePackageClick(BoardRescourseBean item);
    }


    public static class ViewHolder{
        public TextView tx_name;
        public ImageView img;
        public TextView tx_datetime;
        public TextView zairu;
    }

    @Override
    public View getView(int position, View convertView, ViewGroup parent) {
        ViewHolder viewHolder ;
        if(convertView == null){
            //获取list_item.xml页面
            viewHolder = new ViewHolder();
            convertView = LayoutInflater.from(context).inflate(R.layout.boardresources_package_item,parent,false);
            viewHolder.img =  convertView.findViewById(R.id.package_type);
            viewHolder.tx_name = convertView.findViewById(R.id.package_name);
            viewHolder.tx_datetime = convertView.findViewById(R.id.package_datetime);
            viewHolder.zairu = convertView.findViewById(R.id.packagezairu);
            convertView.setTag(viewHolder);
        }else{
            //第一次以后
            viewHolder = (ViewHolder)convertView.getTag();
        }
        //textView里面放置bean的数据
        viewHolder.tx_name.setText(data.get(position).getPname());
        viewHolder.tx_datetime.setText(data.get(position).getPdate());
//        根据类型判断
            viewHolder.img.setImageResource(R.mipmap.type_skb);
        viewHolder.zairu.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                mOnChoosePackageClickListener.OnChoosePackageClick(data.get(position));
            }
        });
        return convertView;
    }


}
