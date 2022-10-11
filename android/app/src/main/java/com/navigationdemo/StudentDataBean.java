package com.navigationdemo;

import androidx.annotation.NonNull;

public class StudentDataBean extends MemberDataBean {

    public StudentDataBean(String name, String id) {
        super(1, name, id);
    }

    @NonNull
    @Override
    public String toString() {
        return "StudentDataBean{" +
                "name='" + super.getName() + '\'' +
                ", id='" + super.getUserId() + '\'' +
                '}';
    }
}
