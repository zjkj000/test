package com.navigationdemo;

public class Chat_Msg {
    private String name;  //姓名
    private String date;  //发送时间
    private String content;//消息内容
    private String url;
    private Integer type;  // 1 主讲人  2  听课端


    public Chat_Msg(String name, String date, String content, Integer type,String url) {
        this.name = name;
        this.date = date;
        this.content = content;
        this.url = url;
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }


    public Integer getType() {
        return type;
    }

    public void setType(Integer type) {
        this.type = type;
    }
}
