import { Button, Card, Layout, Modal } from "@ui-kitten/components";
import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    ScrollView,
    TouchableOpacity,
} from "react-native";
import { screenHeight, screenWidth } from "../../../utils/Screen/GetSize";
import { styles } from "../styles";
import { Icon } from "react-native-elements";
import WebView from "react-native-webview";
import ZoomPictureModel from "../../../utils/ZoomPictureModel/ZoomPictureModel";

export default class ShareStuAnswer extends Component {
    constructor(props) {
        console.log("ShareConstructor====================================");
        console.log(props);
        const { messageList } = props;
        const event = messageList[0];
        const periodList = event.periodList;
        console.log(periodList);
        super(props);
        this.state = {
            periodList: periodList ? periodList : [],
            visible: false,
            showImageLayer: false,
            zoomImageIndexNow: 0,
            zoomImages: [],
        };
    }
    //将html代码里面的 url 提取出来，存在一个数组里,返回一个对象，对象包含两个数组 imgarr（图片数组）   urlarr（图片的url数组）
    AnalysisAnswerImgUrl(str) {
        // 先把返回的＂转义 \"
        var str = str.replace('"', '"'); //1，匹配出图片img标签（即匹配出所有图片），过滤其他不需要的字符 //2.从匹配出来的结果（img标签中）循环匹配出图片地址（即src属性）
        var imgReg = /<img.*?(?:>|\/>)/gi; //匹配src属性
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = [];
        arr = str.match(imgReg); //console.log('所有已成功匹配图片的数组：'+arr);
        if (arr != null) {
            var newsrcarr = [];
            for (var i = 0; i < arr.length; i++) {
                let srcarr = [];
                srcarr = arr[i].match(srcReg);
                newsrcarr.push({ url: srcarr[1], index: i });
            }
            return {
                imgarr: arr,
                urlarr: newsrcarr,
            };
        } else {
            return {
                imgarr: [],
                urlarr: [],
            };
        }
    }
    handlePressImage = (index, zoomImages) => {
        console.log("PressImage====================================");
        console.log(index);
        console.log(zoomImages);
        console.log("====================================");
        this.setState({
            // showZoomImage,
            showImageLayer: true,
            // zoomImageListIndex:
            //     indexRow * 2 + indexCol,
            zoomImageIndexNow: index,
            zoomImages,
        });
    };
    handleStuAnswer = (indexRow, indexCol, stuAnswer) => {
        const { zoomImageIndexNow } = this.state;
        let str = stuAnswer.questionAnswerStr;
        let { imgarr, urlarr } = this.AnalysisAnswerImgUrl(str);
        for (let i = 0; i < imgarr.length; i++) {
            str = str.replace(imgarr[i], "<img>!imgReplace!<img>");
        }
        let textSeq = str.split("<img>");
        let imgIndex = 0;
        let urlObjectAry = [];
        for (let i = 0; i < urlarr.length; i++) {
            urlObjectAry.push({ url: urlarr[i].url, props: {} });
        }
        return (
            <Text style="padding: 5">
                {textSeq.map((item, index) => {
                    console.log(
                        "handleStuAnswer===================================="
                    );
                    console.log(indexRow * 2 + indexCol);
                    console.log(imgIndex);
                    console.log("====================================");
                    if (item === "!imgReplace!") {
                        console.log("replace!");
                        let picNow = urlarr[imgIndex].index;
                        let img = (
                            <TouchableOpacity
                                onPress={() => {
                                    this.handlePressImage(picNow, urlObjectAry);
                                }}
                            >
                                <Image
                                    style={{ width: 150, height: 100 }}
                                    key={`message-${
                                        indexRow * 2 + indexCol
                                    }-image-${index}`}
                                    source={{ uri: urlarr[imgIndex].url }}
                                />
                            </TouchableOpacity>
                        );
                        console.log("Hell0o");
                        console.log(urlarr[imgIndex]);
                        imgIndex = imgIndex + 1;
                        return img;
                    } else {
                        return (
                            <Text
                                key={`message-${
                                    indexRow * 2 + indexCol
                                }-text-${index}`}
                            >
                                {item}
                            </Text>
                        );
                    }
                })}
            </Text>
        );
    };
    _renderStuAnswer = () => {
        const { periodList } = this.state;
        let sliceSeq = [];
        // <Layout style={styles.body_webview}>
        //                 {this.state.periodList.map((item) => {
        //                     console.log(
        //                         "render map of periodList===================================="
        //                     );
        //                     console.log(item.questionAnswerStr);
        //                     console.log("====================================");
        //                     return (
        //                     );
        //                 })}
        //             </Layout>
        for (let i = 0; i < periodList.length; i += 2) {
            sliceSeq.push(periodList.slice(i, i + 2));
        }
        console.log("renderStuAnswer====================================");
        console.log(sliceSeq);
        console.log("====================================");
        return (
            <Layout style={styles.body_webview}>
                {sliceSeq.map((item, index) => {
                    return (
                        <Layout
                            key={`webView-row-${index}`}
                            style={styles.body_webview_row}
                        >
                            {item.map((item2, index2) => {
                                return (
                                    <Layout
                                        style={{
                                            flex: 1,
                                            flexDirection: "column",
                                            borderColor: "#3675A1",
                                            borderWidth: 1,
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#3675A1",
                                            }}
                                        >
                                            {item2.name}
                                        </Text>
                                        <ScrollView
                                            horizontal={true}
                                            key={`webView-row-${index}-col-${index2}`}
                                        >
                                            {this.handleStuAnswer(
                                                index,
                                                index2,
                                                item2
                                            )}
                                        </ScrollView>
                                        {/* <WebView
                                            scalesPageToFit={false}
                                            key={`webView-row-${index}-col-${index2}`}
                                            source={{
                                                html: item2.questionAnswerStr,
                                            }}
                                        ></WebView> */}
                                    </Layout>
                                );
                            })}
                        </Layout>
                    );
                })}
            </Layout>
        );
    };
    render() {
        const { userName, introduction, imgURL } = this.props;
        const { zoomImageIndexNow, zoomImages, showImageLayer } = this.state;
        return (
            <Layout style={styles.mainContainer}>
                <Layout style={styles.header}>
                    <Layout style={styles.header_left}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        >
                            <Image
                                source={require("../../../assets/classImg/subj.png")}
                                style={styles.smallImg}
                            />
                        </TouchableOpacity>
                    </Layout>
                    <Layout style={styles.header_middle}></Layout>
                    <Layout style={styles.header_right}>
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                </Layout>
                <Layout style={styles.body}>{this._renderStuAnswer()}</Layout>
                <Modal
                    visible={this.state.visible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({ visible: false })}
                >
                    <Card disabled={true}>
                        <Image
                            style={styles.QRCode}
                            source={{ uri: imgURL }}
                        ></Image>
                    </Card>
                </Modal>
                <ZoomPictureModel
                    isShowImage={showImageLayer}
                    zoomImages={zoomImages}
                    currShowImgIndex={zoomImageIndexNow}
                    callBack={() => {
                        this.setState({ showImageLayer: false });
                    }}
                />
            </Layout>
        );
    }
}
