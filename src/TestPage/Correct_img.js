import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, Button } from "react-native";
import { screenHeight, screenWidth } from "../utils/Screen/GetSize";
import WebCanvas from "./WebCanvas";
import http from "../utils/http/request";
var imagebase64 = "";
var url = "";
var baseurl = "";
var ismove = false;
export default class Correct_img extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flag: "yidong",
        };
    }

    delect_correctimage() {
        const urla =
            global.constants.baseUrl +
            "/AppServer/ajax/userManage_deleteCanvasImageFromRn.do";
        const params = {
            imagePath: baseurl,
        };
        http.post(urla, params, false).then((res) => {
            if (res.status) {
                this.props.navigation.goBack();
            }
        });
    }
    //保存批改记录
    save_correctimage(data) {
        const urla =
            global.constants.baseUrl +
            "/AppServer/ajax/userManage_saveCanvasImageFromRn.do";
        const params = {
            type: "save",
            imagePath: baseurl,
            baseData: data,
        };
        http.post(urla, params, false).then((res) => {
            if (res.status) {
                //修改批改页面的批改结果
                this.props.route.params.updateStuAnswer(baseurl, res.url);
                this.props.navigation.goBack();
            }
        });
    }

    saveimage_base64(base64) {
        const urla =
            global.constants.baseUrl +
            "/AppServer/ajax/userManage_saveCanvasImageFromRn.do";
        const params = {
            type: "move",
            imagePath: ismove ? url : baseurl,
            baseData: base64,
        };
        http.post(urla, params, false).then((res) => {
            if (res.status) {
                url = res.url;
                ismove = true;
                this.canvas.webview.reload();
            }
        });
    }

    UNSAFE_componentWillMount() {
        url = this.props.route.params.url;
        baseurl = this.props.route.params.url;
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
        //  this.setState({ flag: "yidong" });
        this.canvas._cUndo();
    }
    // 得到图片的base64形式
    _getBase64() {
        this.canvas._getBase64();
    }
    // 保存base64
    _handleBase64(data) {
        imagebase64 = data.substring(22);
        this.save_correctimage(data.substring(22));
    }
    _handleUrl(data) {
        imagebase64 = data.substring(22);
        this.saveimage_base64(data.substring(22));
        // this.canvas.webview.reload()
        // this._addImageBase64(imagebase64)
        // this.canvas._addImage(url)
        // this.canvas._addImageBase64(data.substring(22))
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
                <View
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
                            this.delect_correctimage();
                        }}
                    >
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require("../assets/teacherLatestPage/goBack.png")}
                        ></Image>
                    </TouchableOpacity>
                    <Button
                        onPress={() => {
                            this._getBase64();
                        }}
                        title="保存批改"
                    ></Button>
                </View>
                <View style={{ flex: 1 }}>
                    <WebCanvas
                        handleBase64={this._handleBase64.bind(this)}
                        handleUrl={this._handleUrl.bind(this)}
                        ref={(ref) => (this.canvas = ref)}
                        url={url}
                        height={screenWidth}
                        width={screenWidth}
                        geturl={this.getTestPageUrl}
                    />
                </View>
                <View
                    style={{
                        flexDirection: "row",
                        width: "100%",
                        justifyContent: "space-around",
                        height: 70,
                        paddingBottom: 15,
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
                        onPress={() => {
                            if (this.state.flag != "yidong") {
                                this.canvas._destoryDraw();
                                this.setState({ flag: "yidong" });
                            }
                        }}
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
                            url = baseurl;
                            this.canvas.webview.reload();
                            this.setState({ flag: "yidong" });
                        }}
                    >
                        <Image
                            style={{ width: 50, height: 50 }}
                            source={require("../assets/correctpaper/qingkong.png")}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this._cUndo.bind(this)}>
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
