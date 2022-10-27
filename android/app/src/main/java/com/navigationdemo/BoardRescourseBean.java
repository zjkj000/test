package com.navigationdemo;

public class BoardRescourseBean {

        String style;
        String pname;
        String pdate;
        String path;
        String previewUrl;
        String id;

    public String getPath() {
        return path;
    }

    public String getPreviewUrl() {
        return previewUrl;
    }

    public String getId() {
        return id;
    }




    public BoardRescourseBean(String style,String pname,String pdate){
        this.style=style;
        this.pdate=pdate;
        this.pname=pname;
    }

    public BoardRescourseBean(String style,String pname,String pdate,String path,String previewUrl,String id){
        this.style=style;
        this.pdate=pdate;
        this.pname=pname;
        this.path=path;
        this.previewUrl=previewUrl;
        this.id=id;
    }

    @Override
    public String toString() {
        return "BoardRescourseBean{" +
                "style='" + style + '\'' +
                ", pname='" + pname + '\'' +
                ", pdate='" + pdate + '\'' +
                ", path='" + path + '\'' +
                ", previewUrl='" + previewUrl + '\'' +
                ", id='" + id + '\'' +
                '}';
    }

    public BoardRescourseBean(){

    }

        public String getStyle() {
            return style;
        }

        public void setStyle(String style) {
            this.style = style;
        }

        public String getPname() {
            return pname;
        }

        public void setPname(String pname) {
            this.pname = pname;
        }

        public String getPdate() {
            return pdate;
        }

        public void setPdate(String pdate) {
            this.pdate = pdate;
        }

}
