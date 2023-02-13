package com.navigationdemo;


import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.ListView;
import android.widget.Switch;
import android.widget.TextView;

import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.navigationdemo.adapter.ChatMsgAdapter;
import com.navigationdemo.adapter.ChatMsgAdapter_tea;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


public class ChatRoomFragment extends Fragment {
    private List<Chat_Msg> data= new ArrayList<Chat_Msg>();
    private ChatMsgAdapter_tea chatMsgAdapter_tea;

    public ChatMsgAdapter_tea getChatMsgAdapter_tea() {
        return chatMsgAdapter_tea;
    }

    public void setChatMsgAdapter_tea(ChatMsgAdapter_tea chatMsgAdapter_tea) {
        this.chatMsgAdapter_tea = chatMsgAdapter_tea;
    }

    private ListView chatlv;

    public ListView getChatlv() {
        return chatlv;
    }

    public void setChatlv(ListView chatlv) {
        this.chatlv = chatlv;
    }

    public void setData(Chat_Msg msg){
        data.add(msg);
    }

    @Override
    public void onResume() {
        super.onResume();
        getChatlv().setSelection(getChatlv().getBottom());
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container, Bundle savedInstanceState) {
        View view = inflater.inflate(R.layout.chat_room, container, false);
        chatlv =  view.findViewById(R.id.chatlv);

        chatMsgAdapter_tea=new ChatMsgAdapter_tea(view.getContext(), R.layout.item_response_tea,data);

        chatlv.setAdapter(chatMsgAdapter_tea);

        TextView cleanall = view.findViewById(R.id.cleanall);
        cleanall.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                data.clear();
                chatMsgAdapter_tea.notifyDataSetChanged();
            }
        });

        Switch sw = view.findViewById(R.id.stopchat);
        sw.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(CompoundButton buttonView, boolean isChecked) {
                MainActivity_tea activity = (MainActivity_tea) getActivity();
                activity.stopAllchat(isChecked);
            }
        });

        EditText edtext = view.findViewById(R.id.inputtext);
        Button subtext = view.findViewById(R.id.subtext);
        subtext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                if(edtext.getText().length()==0){
                    //提示请先输入消息
                    edtext.setHint("请先输入要讨论的内容");
                }else {
                    //创建消息
                    SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
                    Chat_Msg msg = new Chat_Msg(MainActivity_tea.userCn,sdf.format(new Date()),edtext.getText().toString(),1,MainActivity_tea.userHead);  //type 1 主讲人  2  听课端
                    //发送给别人
                    MainActivity_tea activity = (MainActivity_tea) getActivity();
                    activity.sendMsg(msg);//activity中的方法
                    //自己这里显示
                    data.add(msg);
                    chatlv.setSelection(chatlv.getBottom());
                    //清空输入框
                    edtext.setText("");
                    edtext.setHint("请输入讨论的内容");
                }

            }
        });
        return view;
    }

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }


}
