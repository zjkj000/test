package com.navigationdemo;

public class MemberItem {
    private String name;
    private String userId;
    private int userType;           // 用户类型，1表示学生，0表示课堂
    private boolean chatControl;
    private boolean speakControl;
    private boolean audioControl;
    private boolean videoControl;
    private boolean boardControl;

    public MemberItem(String name, String userId, int userType, boolean chatControl, boolean speakControl, boolean audioControl, boolean boardControl, boolean videoControl) {
        this.name = name;
        this.userId = userId;
        this.userType = userType;
        this.chatControl = chatControl;
        this.speakControl = speakControl;
        this.audioControl = audioControl;
        this.videoControl = videoControl;
        this.boardControl = boardControl;
    }

    public int getUserType() {
        return userType;
    }

    public void setUserType(int userType) {
        this.userType = userType;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }


    public void setName(String name) {
        this.name = name;
    }

    public boolean getChatControl() {
        return chatControl;
    }

    public void setChatControl(boolean chatControl) {
        this.chatControl = chatControl;
    }

    public boolean getSpeakControl() {
        return speakControl;
    }

    public void setSpeakControl(boolean speakControl) {
        this.speakControl = speakControl;
    }

    public boolean getAudioControl() {
        return audioControl;
    }

    public void setAudioControl(boolean audioControl) {
        this.audioControl = audioControl;
    }

    public boolean getVideoControl() {
        return videoControl;
    }

    public void setVideoControl(boolean videoControl) {
        this.videoControl = videoControl;
    }

    public boolean getBoardControl() {
        return boardControl;
    }

    public void setBoardControl(boolean boardControl) {
        this.boardControl = boardControl;
    }
}
