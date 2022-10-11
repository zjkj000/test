package com.navigationdemo;

public class MemberDataBean {
    private int userType;
    private String name;
    private String userId;

    public MemberDataBean(int userType, String name, String userId) {
        this.userType = userType;
        this.name = name;
        this.userId = userId;
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
}
