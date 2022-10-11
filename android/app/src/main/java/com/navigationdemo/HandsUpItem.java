package com.navigationdemo;

public class HandsUpItem {
    private int userType;
    private String name;
    private String userId;
    private boolean speakControl;

    public HandsUpItem(int userType, String name, String userId, boolean speakControl) {
        this.userType = userType;
        this.name = name;
        this.userId = userId;
        this.speakControl = speakControl;
    }

    public int getUserType() {
        return userType;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean getSpeakControl() {
        return speakControl;
    }

    public void setSpeakControl(boolean speakControl) {
        this.speakControl = speakControl;
    }
}
