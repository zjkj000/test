package com.navigationdemo;

public class ClassDataBean extends MemberDataBean {
    private int num;


    public ClassDataBean(String name, String id, int num) {
        super(0, name, id);
        this.num = num;
    }

    public int getNum() {
        return num;
    }

    public void setNum(int num) {
        this.num = num;
    }

    @Override
    public String toString() {
        return "ClassDataBean{" +
                "name='" + super.getName() + '\'' +
                ", id='" + super.getUserId() + '\'' +
                ", num=" + num +
                '}';
    }
}
