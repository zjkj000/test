import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { screenHeight, screenWidth } from "../utils/Screen/GetSize";
import { styles } from "./styles";
import WebCanvas from "./WebCanvas";
import http from "../utils/http/request";
var imagebase64=''
var url =
    "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F21031FKU44S6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660123240&t=70bf04c04f065c75c8676c464dd360c6";
export default class TestPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showNum: 0,
            imgState: 1,
            flag: "yidong",
            url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%2Fallimg%2Ftp09%2F21031FKU44S6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1660123240&t=70bf04c04f065c75c8676c464dd360c6"
        };
    }
    saveimage_base64(base64) {
        const urla = global.constants.baseUrl + "studentApp_uploadUserPhoto.do";
        const params = {
            userId: global.constants.userName,
            baseCode: base64,
        };
        // http.post(urla, params, false).then((res) => {
        //     if(res.success){
        //       url=res.data
        //     }
        // })
    }
    UNSAFE_componentWillMount(){
        console.log('this',this.props.route.params.url)
        this.setState({
        // url:'http://www.cn901.com/res/studentAnswerImg/AppImage/2022/06/30/ming6056_115050504.png' 
        url:"https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fimg.jj20.com%2Fup%"  +
            "2Fallimg%2Ftp09%2F21031FKU44S6-0-lp.jpg&refer=http%3A%2F%2Fimg.jj20.com&app=2002&size=f9999,100"+
            "00&q=a80&n=0&g=0n&fmt=auto?sec=1660123240&t=70bf04c04f065c75c8676c464dd360c6"   
        })
    }

    _pen() {
        this.canvas._pen();
        this.setState({ flag: "pigai" });
    }

    _clean() {
        this.canvas._clean();
        this.setState({ flag: "qingkong" });
    }
    // 以url的形式添加背景
    _addImageUrl() {
        this.canvas._addImageUrl(url);
    }
    // 以base64的形式添加背景
    _addImageBase64(base64) {
        this.canvas._addImageBase64(base64);
    }
    _cUndo() {
        // this.setState({ flag: "yidong" });
        this.canvas._cUndo();
    }
    // 得到图片的base64形式
    _getBase64() {
        this.canvas._getBase64(base64);
    }
    // 保存base64
    _handleBase64(data) {
        imagebase64 = data;
    }
    _handleUrl(data) {
        imagebase64 =data.substring(22)
        // this.saveimage_base64(data.substring(22))
        // this.canvas.webview.reload()
        // this._addImageBase64(imagebase64)
        // this.canvas._addImage(url)
        // this.canvas._addImageBase64(data.substring(22))
    }
    _destoryDraw() {
        this.setState({ flag: "yidong" });
        this.canvas._destoryDraw();
    }
    // 图片右转
    _rotateRight() {
        this.canvas._rotateRight();
    }

    render() {
        return (
            <View
                style={{
                    height: screenHeight,
                    flexDirection: "column",
                }}
            >
                {/* <View
                    style={{
                        height: 50,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        justifyContent: "center",
                        borderBottomWidth: 0.5,
                        borderColor: "#CBCBCB",
                    }}
                >
                    <TouchableOpacity
                        style={{ position: "absolute", left: 10 }}
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require("../assets/teacherLatestPage/goback.png")}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{ color: "#59B9E0", fontSize: 20 }}>
                        批改作业
                    </Text>
                </View> */}
                <View style={{ height: screenHeight - 80 }}>
                    <WebCanvas
                        handleBase64={this._handleBase64.bind(this)}
                        handleUrl={this._handleUrl.bind(this)}
                        ref={(ref) => (this.canvas = ref)}
                        url={this.state.url}
                        height={screenWidth}
                        width={screenWidth}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-around",
                        height: 70,
                        alignItems: "center",
                    }}
                >
                    <TouchableOpacity onPress={this._pen.bind(this)}>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={
                                this.state.flag == "pigai"
                                    ? require("../assets/correctpaper/pigaia.png")
                                    : require("../assets/correctpaper/pigai.png")
                            }
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._destoryDraw.bind(this)}
                    >
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={
                                this.state.flag == "yidong"
                                    ? require("../assets/correctpaper/yidonga.png")
                                    : require("../assets/correctpaper/yidong.png")
                            }
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            url = url;
                            this.canvas.webview.reload();
                            this.setState({ flag: "yidong" });
                        }}
                    >
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require("../assets/correctpaper/qingkong.png")}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={this._cUndo.bind(this)}
                    >
                        <Image
                            source={require("../assets/correctpaper/chexiao.png")}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._rotateRight.bind(this)}>
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require("../assets/correctpaper/xuanzhuan.png")}
                        ></Image>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
