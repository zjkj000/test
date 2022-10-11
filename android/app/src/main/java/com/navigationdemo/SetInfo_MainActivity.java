package com.navigationdemo;


import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;

import androidx.appcompat.app.AppCompatActivity;

public class SetInfo_MainActivity extends AppCompatActivity {

    private EditText userid,roomid,subjectid,ketangid,userCn,roomname,ketangname;
    private Button login;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_set_info_main);
        userid= findViewById(R.id.userid);
        userCn= findViewById(R.id.userCn);

        roomid= findViewById(R.id.roomid);
        roomid.setHint("房间号必须为数字");
        roomname= findViewById(R.id.roomname);
        ketangname= findViewById(R.id.ketangname);

        subjectid= findViewById(R.id.subjectid);
        ketangid= findViewById(R.id.ketangid);
        login= findViewById(R.id.login);
        login.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent();
                intent.setClass(SetInfo_MainActivity.this, MainActivity_tea.class);
                intent.putExtra("userid",userid.getText().toString());
                intent.putExtra("userCn",userCn.getText().toString());
                intent.putExtra("roomid",roomid.getText().toString());
                intent.putExtra("roomname",roomid.getText().toString());

                intent.putExtra("subjectid",subjectid.getText().toString());
                intent.putExtra("ketangid",ketangid.getText().toString());
                intent.putExtra("ketangname",ketangname.getText().toString());

                if(userid.getText().length()>0&&roomid.getText().length()>0&&subjectid.getText().length()>0&&userCn.getText().length()>0&&roomname.getText().length()>0&&ketangid.getText().length()>0&&ketangname.getText().length()>0){
                    startActivity(intent);
                }

            }
        });
    }

}