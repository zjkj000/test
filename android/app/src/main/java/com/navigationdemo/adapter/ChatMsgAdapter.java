package com.navigationdemo.adapter;

import android.content.Context;
import android.graphics.Color;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ArrayAdapter;
import android.widget.LinearLayout;
import android.widget.TextView;
import com.navigationdemo.R;

import androidx.annotation.NonNull;

import com.navigationdemo.Chat_Msg;

import com.navigationdemo.utils.MyChatHead_ImageView;
import java.util.List;

public class ChatMsgAdapter extends ArrayAdapter {
    private int resourceId;
    public ChatMsgAdapter(@NonNull Context context, int resource, @NonNull List objects) {
        super(context, resource, objects);
        this.resourceId=resource;
    }

    @Override
    public void notifyDataSetChanged() {
        super.notifyDataSetChanged();
    }

    public View getView(int position, View convertView, ViewGroup parent)
    {
        Chat_Msg mMsg = (Chat_Msg)getItem(position);
        getItem(position);
        View mView;
        ViewHolder mViewHolder;
        if(convertView == null) {
            mView = LayoutInflater.from(getContext()).inflate(resourceId, null);
            mViewHolder = new ViewHolder();
            mViewHolder.Layout = (LinearLayout) mView.findViewById(R.id.msg);
            mViewHolder.Layout1 = (LinearLayout) mView.findViewById(R.id.sender);
            mViewHolder.Msgname = (TextView) mView.findViewById(R.id.name);
            mViewHolder.Msgdate = (TextView) mView.findViewById(R.id.date);
            mViewHolder.Msgcontent = (TextView) mView.findViewById(R.id.msgcontent);
            mViewHolder.msg_head = (MyChatHead_ImageView) mView.findViewById(R.id.msg_head);

            mView.setTag(mViewHolder);
        }else {
            mView = convertView;
            mViewHolder = (ViewHolder) mView.getTag();
        }
        mViewHolder.Msgname.setText(mMsg.getName());
        mViewHolder.Msgdate.setText(mMsg.getDate());
        mViewHolder.Msgcontent.setText(mMsg.getContent());
        mViewHolder.msg_head.setImageURL(mMsg.getUrl());
        //设置格式
        if(mMsg.getType() == 2)      //  接受  听课端的
        {
            mViewHolder.Layout.setLayoutDirection(View.LAYOUT_DIRECTION_LTR);
            mViewHolder.Layout1.setLayoutDirection(View.LAYOUT_DIRECTION_LTR);
            mViewHolder.Msgname.setTextColor(Color.WHITE);
            mViewHolder.Msgcontent.setTextColor(Color.WHITE);

        }else if(mMsg.getType() == 1)  //  发送的消息  主讲人
        {
            mViewHolder.Layout.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
            mViewHolder.Layout1.setLayoutDirection(View.LAYOUT_DIRECTION_RTL);
            mViewHolder.Msgname.setTextColor(Color.YELLOW);
            mViewHolder.Msgcontent.setTextColor(Color.YELLOW);
        }
        return mView;
    }

    class ViewHolder{
        LinearLayout Layout;
        LinearLayout Layout1;
        TextView Msgname;
        TextView Msgdate;
        TextView Msgcontent;
        MyChatHead_ImageView msg_head;
    }

}
