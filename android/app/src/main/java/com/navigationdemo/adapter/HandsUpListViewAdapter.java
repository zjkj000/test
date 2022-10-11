package com.navigationdemo.adapter;

import android.content.Context;
import android.media.Image;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageView;
import android.widget.ListView;
import android.widget.TextView;
import com.navigationdemo.R;

import androidx.constraintlayout.widget.ConstraintLayout;

import com.navigationdemo.HandsUpItem;
import com.navigationdemo.MemberItem;


import java.util.List;

public class HandsUpListViewAdapter extends BaseAdapter {

    private ListView handsUpList;
    private List<HandsUpItem> list;
    private LayoutInflater inflater;
    private onSpeakerControllerListener mOnSpeakerControllerListener;

    public HandsUpListViewAdapter(Context context, ListView handsUpList, List<HandsUpItem> list) {
        this.list = list;
        this.handsUpList = handsUpList;
        inflater = LayoutInflater.from(context);
    }

    public interface onSpeakerControllerListener {
        void onSpeakControllerClick(int i);
    }

    public int getItemPositionById(String userId) {
        for (int i = 0; i < list.size(); i++){
            HandsUpItem itemNow = list.get(i);
            if(itemNow.getUserId().equals(userId)) {
                return i;
            }
        }
        return -1;
    }

    public void setOnSpeakerControllerClickListener(onSpeakerControllerListener mOnSpeakerControllerListener) {
        this.mOnSpeakerControllerListener = mOnSpeakerControllerListener;
    }

    @Override
    public int getCount() {
        if(list != null){
            return list.size();
        }
        return 0;
    }

    @Override
    public HandsUpItem getItem(int i) {
        if(list != null){
            return list.get(i);
        }
        return null;
    }

    @Override
    public long getItemId(int i) {
        return i;
    }

    //设置行不可点击
    @Override
    public boolean isEnabled(int position) {
        return true;
    }


    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {
        HandsUpItem item = (HandsUpItem) this.getItem(i);
        ViewHolder viewHolder;

        if(view == null) {
            viewHolder = new ViewHolder();
            view = inflater.inflate(R.layout.hands_up_list_item, null);
            viewHolder.userType = view.findViewById(R.id.hand_up_list_user_type);
            viewHolder.userName = (TextView) view.findViewById(R.id.hand_up_list_user_name);
            viewHolder.speakerController = (ImageView) view.findViewById(R.id.hands_up_speaker_controller);
            viewHolder.speakerControllerContainer = (ConstraintLayout) view.findViewById(R.id.hands_up_speaker_controller_container);
            view.setTag(viewHolder);
        } else {
            viewHolder = (ViewHolder) view.getTag();
        }

        // 点击事件
        viewHolder.speakerControllerContainer.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                mOnSpeakerControllerListener.onSpeakControllerClick(i);
            }
        });

        viewHolder.userType.setImageResource(item.getUserType() == 0 ? R.drawable.user_type_pc : R.drawable.user_type_mobile);

        viewHolder.userName.setText(item.getName());
        viewHolder.userName.setTextSize(13);
        return view;
    }

    public static class ViewHolder{
        public ImageView userType;
        public TextView userName;
        public ImageView speakerController;
        public ConstraintLayout speakerControllerContainer;
    }

}
