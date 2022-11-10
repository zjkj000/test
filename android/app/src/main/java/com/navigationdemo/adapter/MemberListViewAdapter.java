package com.navigationdemo.adapter;

import android.annotation.SuppressLint;
import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import com.navigationdemo.R;

import com.navigationdemo.MemberItem;


import java.util.List;

public class MemberListViewAdapter extends BaseAdapter {

    private ListView memberList;
    private List<MemberItem> list;
    private LayoutInflater inflater;
    private onItemButtonListener mOnItemButtonListener;

    public MemberListViewAdapter(Context context, ListView memberList, List<MemberItem> list) {
        this.list = list;
        this.memberList = memberList;
        inflater = LayoutInflater.from(context);
    }

    public interface onItemButtonListener {
        void onMoveOutClick(int i);
        void onChatControlClick(int i);
        void onSpeakControlClick(int i);
        void onAudioControlClick(int i);
        void onVideoControlClick(int i);
        void onBoardControlClick(int i);
    }

    public int getItemPositionById(String userId) {
        for (int i = 0; i < list.size(); i++){
            MemberItem itemNow = list.get(i);
            if(itemNow.getUserId().equals(userId)) {
                return i;
            }
        }
        return -1;
    }

    public void setOnItemButtonListener(onItemButtonListener onItemButtonListener){
        this.mOnItemButtonListener = onItemButtonListener;
    }

    public static class ViewHolder{
        //public TextView diyid;
        public TextView userName;
        public ImageView chatControl;
        public ImageView speakControl;
        public ImageView audioControl;
        public ImageView videoControl;
        public ImageView boardControl;
        public TextView videoClose;
        public TextView audioClose;

    }

    @Override
    public int getCount() {
        if (list != null) {
            return list.size();
        }
        return 0;
    }

    @Override
    public MemberItem getItem(int position) {
        if (list != null && position >= 0) {
            return list.get(position);
        }
        return null;
    }

    //设置行不可点击
    @Override
    public boolean isEnabled(int position) {
        return true;
    }

    @Override
    public long getItemId(int position) {
        return position;
    }

    @SuppressLint("ResourceAsColor")
    @Override
    public View getView(int position, View convertView, ViewGroup parent) {

        MemberItem goods = (MemberItem) this.getItem(position);

        ViewHolder viewHolder;

        if(convertView == null){

            viewHolder = new ViewHolder();

            convertView = inflater.inflate(R.layout.member_list_item, null);

            viewHolder.userName = (TextView) convertView.findViewById(R.id.member_user_name);
            viewHolder.chatControl = (ImageView) convertView.findViewById(R.id.member_chat_control);
            viewHolder.speakControl = (ImageView) convertView.findViewById(R.id.member_speak_control);
            viewHolder.audioControl = (ImageView) convertView.findViewById(R.id.member_audio_control);
            viewHolder.videoControl = (ImageView) convertView.findViewById(R.id.member_video_control);
            viewHolder.boardControl = (ImageView) convertView.findViewById(R.id.member_board_control);
            viewHolder.audioClose = (TextView) convertView.findViewById(R.id.member_audio_close);
            viewHolder.videoClose = (TextView) convertView.findViewById(R.id.member_video_close);

            //批量设置各列TextView背景颜色透明
//            CommonUtil.ClearListViewOldRowBackgroundColor(viewHolder);
            convertView.setTag(viewHolder);
        }else{
            viewHolder = (ViewHolder) convertView.getTag();
        }

        //设置行新样式
        viewHolder.userName.setText(goods.getName());
        viewHolder.userName.setTextSize(13);


        viewHolder.chatControl.setImageResource(goods.getChatControl() ? R.drawable.chat_controller_on : R.drawable.chat_controller_off);
        viewHolder.speakControl.setImageResource(goods.getSpeakControl() ? R.drawable.speaker_controller_on : R.drawable.speaker_controller_off);
        if(goods.getUserType() == 0) {
            viewHolder.audioControl.setVisibility(View.VISIBLE);
            viewHolder.audioClose.setVisibility(View.INVISIBLE);
            viewHolder.audioControl.setImageResource(goods.getAudioControl() ? R.drawable.audio_controller_on : R.drawable.audio_controller_off);
        } else {
            viewHolder.audioControl.setVisibility(View.INVISIBLE);
            viewHolder.audioClose.setVisibility(View.VISIBLE);
        }
        if(goods.getUserType() == 0) {
            viewHolder.videoControl.setVisibility(View.VISIBLE);
            viewHolder.videoClose.setVisibility(View.INVISIBLE);
            viewHolder.videoControl.setImageResource(goods.getVideoControl() ? R.drawable.camera_controller_on : R.drawable.camera_controller_off);
        } else {
            viewHolder.videoControl.setVisibility(View.INVISIBLE);
            viewHolder.videoClose.setVisibility(View.VISIBLE);
        }
        viewHolder.boardControl.setImageResource(goods.getBoardControl() ? R.drawable.board_controller_on : R.drawable.board_controller_off);

        // 点击事件

        viewHolder.chatControl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mOnItemButtonListener.onChatControlClick(position);
            }
        });

        viewHolder.speakControl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mOnItemButtonListener.onSpeakControlClick(position);
            }
        });

        viewHolder.audioControl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mOnItemButtonListener.onAudioControlClick(position);
            }
        });

        viewHolder.videoControl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mOnItemButtonListener.onVideoControlClick(position);
            }
        });

        viewHolder.boardControl.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mOnItemButtonListener.onBoardControlClick(position);
            }
        });

        return convertView;
    }
}
