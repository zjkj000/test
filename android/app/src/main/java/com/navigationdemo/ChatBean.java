package com.navigationdemo;

import android.graphics.drawable.Drawable;

public class ChatBean {
    String messageStuget;
    String phone;
    String time;
    String timeStr;
    String nameStuget;
    String userId;
    String role;

    String content;
    Drawable drawable;//可以通过这个来修改头像
    int type;//用于标识告知Adpater应该创建的是哪一类的ItenView

    public ChatBean(){
    }

    public ChatBean(String content, Drawable drawable, int type,
    String messageStuget, String phone, String time, String timeStr,
    String nameStuget, String userId, String role) {
        this.content = content;
        this.drawable = drawable;
        this.type = type;
        this.messageStuget=messageStuget;
        this.phone=phone;
        this.time=time;
        this.timeStr=timeStr;
        this.nameStuget=nameStuget;
        this.userId=userId;
        this.role=role;
    }

    public String getMessageStuget() {
        return messageStuget;
    }

    public void setMessageStuget(String messageStuget) {
        this.messageStuget = messageStuget;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getTimeStr() {
        return timeStr;
    }

    public void setTimeStr(String timeStr) {
        this.timeStr = timeStr;
    }

    public String getNameStuget() {
        return nameStuget;
    }

    public void setNameStuget(String nameStuget) {
        this.nameStuget = nameStuget;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Drawable getDrawable() {
        return drawable;
    }

    public void setDrawable(Drawable drawable) {
        this.drawable = drawable;
    }

    public int getType() {
        return type;
    }

    public void setType(int type) {
        this.type = type;
    }
}