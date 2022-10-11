package com.navigationdemo;

public class StuAnswerBean {
    String questionId;
    String name;
    String userId;
    String stuAnswer;
    Long stuAnswerTime;
    Long startAnswerTime;

    public StuAnswerBean(){}

    public StuAnswerBean(
            String questionId ,
            String name ,
            String userId ,
            String stuAnswer ,
            Long stuAnswerTime ,
            Long startAnswerTime
    ){
        this.questionId = questionId;
        this.name = name;
        this.userId = userId;
        this.stuAnswer = stuAnswer;
        this.stuAnswerTime = stuAnswerTime;
        this.startAnswerTime = startAnswerTime;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
        this.questionId = questionId;
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

    public String getStuAnswer() {
        return stuAnswer;
    }

    public void setStuAnswer(String stuAnswer) {
        this.stuAnswer = stuAnswer;
    }

    public Long getStuAnswerTime() {
        return stuAnswerTime;
    }

    public void setStuAnswerTime(Long stuAnswerTime) {
        this.stuAnswerTime = stuAnswerTime;
    }

    public Long getStartAnswerTime() {
        return startAnswerTime;
    }

    public void setStartAnswerTime(Long startAnswerTime) {
        this.startAnswerTime = startAnswerTime;
    }

    @Override
    public String toString(){
        return ("questionId: " + questionId
                + " , userId: " +  userId
                + " , name: " + name
                + " , stuAnswer: " + stuAnswer
                + " , stuAnswerTime: " + stuAnswerTime
                + " , startAnswerTime: " + startAnswerTime);
    }
}

