package com.navigationdemo;

//要分析的课堂信息（肖先把数据传递过来）
public class KeTangBean {
    String ketangId;
    String keTangName;
    int stuNum;

    public KeTangBean(){
    }

    public KeTangBean(String ketangId , String keTangName , int stuNum){
        this.ketangId = ketangId;
        this.keTangName = keTangName;
        this.stuNum = stuNum;
    }

    public String getKetangId() {
        return ketangId;
    }

    public void setKetangId(String ketangId) {
        this.ketangId = ketangId;
    }

    public String getKeTangName() {
        return keTangName;
    }

    public void setKeTangName(String keTangName) {
        this.keTangName = keTangName;
    }

    public int getStuNum() {
        return stuNum;
    }

    public void setStuNum(int stuNum) {
        this.stuNum = stuNum;
    }
}
