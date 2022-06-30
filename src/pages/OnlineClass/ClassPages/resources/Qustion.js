import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
} from "react-native";
import http from "../../../../utils/http/request";
import RadioList from "../../../LatestTask/DoWork/Utils/RadioList";
import Checkbox from "../../../LatestTask/DoWork/Utils/Checkbox";
import {
    Button,
    Layout,
    Modal,
    Card,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";
import Toast from "../../../../utils/Toast/Toast";
import ImageHandler from "../../../../utils/Camera/Camera";
import WebView from "react-native-webview";
import { styles } from "../../styles";
import { deepEqual } from "../../../../utils/Compare/Compare";
import StorageUtil from "../../../../utils/Storage/Storage";
import ZoomPictureModel from "../../../../utils/ZoomPictureModel/ZoomPictureModel";
import theme from "../../../../theme/custom-theme.json";

export default class Question extends Component {
    constructor(props) {
        const { periodNow } = props;
        const subjective =
            periodNow.questionType == "3" || periodNow.questionType == "5";
        super(props);
        this.state = {
            html: "",
            questionType: periodNow.questionType ? periodNow.questionType : "1",
            questionValueList: periodNow.questionValueList,
            subjective: subjective,
            msg: "",
            moduleVisible: false,
            answer: "",
            showSideBox: false,
            imgURL: [],
            showImageLayer: false,
            zoomImageIndexNow: 0,
            zoomImages: [],
            postHtml: "",
        };
        this.initAnswerState();
    }
    initAnswerState = () => {
        let { periodNow } = this.props;
        const subjective =
            periodNow.questionType == "3" || periodNow.questionType == "5";
        this.setState({ subjective });
        StorageUtil.get("tjAnswer").then((res) => {
            console.log("initAnswerState====================================");
            console.log(res);
            console.log("====================================");
            if (res) {
                let tjAnswer = res[periodNow.id];
                if (tjAnswer) {
                    this.setState({
                        html: tjAnswer.html ? tjAnswer.html : "",
                        postHtml: tjAnswer.postHtml ? tjAnswer.postHtml : "",
                        answer: tjAnswer.answer ? tjAnswer.answer : "",
                        imgURL: tjAnswer.imgURL ? tjAnswer.imgURL : [],
                    });
                } else {
                    this.setState({
                        html: "",
                        postHtml: "",
                        answer: "",
                        imgURL: [],
                    });
                }
            } else {
                this.setState({
                    html: "",
                    postHtml: "",
                    answer: "",
                    imgURL: [],
                });
            }
        });
    };
    componentDidUpdate(prevProps, prevState) {
        if (!deepEqual(prevProps.periodNow, this.props.periodNow)) {
            this.initAnswerState();
            this.setState({
                questionType: this.props.periodNow.questionType,
                questionValueList: this.props.periodNow.questionValueList,
            });
        }
        if (
            prevState.answer !== this.state.answer ||
            prevState.html !== this.state.html ||
            !deepEqual(prevState.imgURL, this.state.imgURL) ||
            prevProps.postHtml !== this.state.postHtml
        ) {
            const { periodNow } = this.props;
            StorageUtil.get("tjAnswer").then((res) => {
                if (res) {
                    let tjAnswer = res;
                    tjAnswer[periodNow.id].answer = this.state.answer;
                    tjAnswer[periodNow.id].postHtml = this.state.postHtml;
                    tjAnswer[periodNow.id].html = this.state.html;
                    tjAnswer[periodNow.id].imgURL = this.state.imgURL;
                    StorageUtil.save("tjAnswer", tjAnswer);
                }
            });
        }
    }
    renderInputArea = () => {
        return (
            <View style={styles.inputArea}>
                <Text
                    onPress={() =>
                        this.setState({
                            answer: "",
                            imgURL: [],
                            html: "",
                            postHtml: "",
                        })
                    }
                    style={{ color: "#B68459" }}
                >
                    删除
                </Text>
                <TextInput
                    multiline
                    style={{
                        width: 150,
                        backgroundColor: "#fff",
                        height: "80%",
                        borderRadius: 5,
                    }}
                    value={this.state.msg}
                    onChangeText={(text) => this.setState({ msg: text })}
                ></TextInput>
                {/* 拍照答题功能弹窗 */}
                <TouchableOpacity onPress={this.handleCamera}>
                    <Image
                        style={styles.smallImg}
                        source={require("../../../../assets/image3/camera.png")}
                    ></Image>
                </TouchableOpacity>
                <TouchableOpacity onPress={this.handleLibrary}>
                    <Image
                        style={styles.smallImg}
                        source={require("../../../../assets/image3/photoalbum.png")}
                    ></Image>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => {
                        this.setAnswer(this.state.msg);
                        this.setState({ msg: "" });
                    }}
                    style={{
                        width: 100,
                        height: "80%",
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "#59B9E0",
                        borderRadius: 5,
                    }}
                >
                    <Text style={{ color: "#fff" }}>保存</Text>
                </TouchableOpacity>
            </View>
        );
    };
    imageUpload = (base64) => {
        const { messageList, ipAddress, userName, periodNow } = this.props;
        const event = messageList[0];
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_saveBase64Image.do";
        // const url =
        //     "http://192.168.1.81:8222/AppServer/ajax/studentApp_saveBase64Image.do";
        console.log(userName);
        const params = {
            baseCode: base64,
            learnPlanId: event.learnPlanId,
            userId: userName,
        };
        http.post(url, params, false)
            .then((res) => {
                if (res.status === "success") {
                    let { imgURL, html, postHtml } = this.state;
                    let imgLength = imgURL.length;
                    this.setState({
                        imgURL: [...imgURL, { url: res.url, index: imgLength }],
                        html: html + "<img>!imgReplace!<img>",
                        postHtml: postHtml + `<img src= "${res.url}" \/>`,
                    });
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    handleCamera = () => {
        ImageHandler.handleCamera()
            .then((res) => {
                if (res) {
                    this.setState({
                        moduleVisible: false,
                    });
                    this.imageUpload(res.base64);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("获取图片失败:" + error.toString());
            });
    };
    handleLibrary = () => {
        ImageHandler.handleLibrary()
            .then((res) => {
                if (res) {
                    this.setState({
                        moduleVisible: false,
                    });
                    this.imageUpload(res.base64);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("获取图片失败:" + error.toString());
            });
    };
    handleSubmit = () => {
        const { ipAddress, messageList, introduction, userName, periodNow } =
            this.props;
        const event = messageList[0];
        const { period } = event;
        const { subjective } = this.state;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_saveExploreStuAnswerByRN.do";
        // const url =
        //     "http://" +
        //     "192.168.1.81" +
        //     ":8222" +
        //     "/KeTangServer/ajax/ketang_saveExploreStuAnswerByRN.do";
        let params = {
            stuId: userName,
            stuName: introduction,
            taskId: period.id,
            taskName: period.name,
            questionId: periodNow.questionId,
            questionType: periodNow.questionType,
            questionTypeName: periodNow.questionTypeName,
            questionAnswer: periodNow.questionAnswerStr,
            questionScore: periodNow.questionScore,
            stuAnswer: subjective ? this.state.postHtml : this.state.answer,
            version: 3, //防止接口空指针
        };
        http.post(url, params)
            .then((res) => {
                if (res.success) {
                    Toast.showSuccessToast("保存成功", 500);
                    this.props.handleChangeState(this.props.indexNow);
                    this.props.nextPage(1);
                } else {
                    Toast.showWarningToast(res.message, 1000);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("请求失败: " + error.toString());
            });
    };
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

    //默认弹框不显示，以及需要把弹窗效果加在的地方的  相机图片  显示
    renderAvatar = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ moduleVisible: true });
                }}
            >
                <Image
                    style={{ width: 30, height: 30 }}
                    source={require("../../../../assets/image3/camera.png")}
                ></Image>
            </TouchableOpacity>
        );
    };

    renderOption = () => {
        const { questionType } = this.state;
        let subjective = questionType === "3" || questionType === "5";

        if (subjective) {
            return this.renderInputArea();
        } else if (questionType === "2") {
            return (
                <Checkbox
                    checkedlist={this.state.answer}
                    getstuanswer={this.setAnswer}
                    ChoiceList={this.state.questionValueList}
                />
            );
        }
        // console.log("renderOption====================================");
        // console.log(this.state.answer);
        // console.log("====================================");
        return (
            <RadioList
                checkedindexID={this.state.answer}
                getstuanswer={this.setSingleSelect}
                ChoiceList={this.state.questionValueList}
            />
        );
    };
    setSingleSelect = (str) => {
        this.setState({ answer: str, postHtml: str, html: str });
    };
    setAnswer = (str) => {
        let { html, answer, postHtml } = this.state;
        this.setState({
            html: html + str,
            answer: answer + str,
            postHtml: postHtml + str,
        });
    };
    getHTML = (period, ipAddress) => {
        let resURL =
            "http://" +
            ipAddress +
            ":8901" +
            "/html" +
            period.links +
            "/" +
            period.resourceId +
            "Show.html";
        return resURL;
    };
    renderAnswerBox = (questionType) => {
        let subjective = questionType === "3" || questionType === "5";
        const { html, imgURL } = this.state;
        const { periodNow } = this.props;
        if (subjective && html !== "") {
            let textSeq = html.split("<img>");
            let imgIndex = 0;
            let urlObjectAry = [];
            for (let i = 0; i < imgURL.length; i++) {
                urlObjectAry.push({ url: imgURL[i].url, props: {} });
            }
            return (
                <Layout style={styles.body_answerBox}>
                    <ScrollView horizontal={true}>
                        {textSeq.map((item, index) => {
                            if (item === "!imgReplace!") {
                                let picNow = imgURL[imgIndex].index;
                                let img = (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.handlePressImage(
                                                picNow,
                                                urlObjectAry
                                            );
                                        }}
                                    >
                                        <Image
                                            style={{ width: 150, height: 100 }}
                                            key={`image-${index}`}
                                            source={{
                                                uri: imgURL[imgIndex].url,
                                            }}
                                        />
                                    </TouchableOpacity>
                                );
                                imgIndex = imgIndex + 1;
                                return img;
                            } else {
                                return (
                                    <Text key={`text-${index}`}>{item}</Text>
                                );
                            }
                        })}
                    </ScrollView>
                </Layout>
            );
        }
    };

    render() {
        const { zoomImageIndexNow, zoomImages, showImageLayer } = this.state;
        return (
            <>
                <Layout style={styles.body}>
                    <Layout style={styles.body_webview}>
                        <WebView
                            source={{
                                uri: this.getHTML(
                                    this.props.periodNow,
                                    this.props.ipAddress
                                ),
                            }}
                        />
                    </Layout>
                    {this.renderAnswerBox(this.props.periodNow.questionType)}
                </Layout>
                <Layout style={styles.bottom}>
                    <Layout style={styles.bottomLeft}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nextPage(-1);
                            }}
                        >
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../../assets/classImg/last.png")}
                            ></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nextPage(1);
                            }}
                        >
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../../assets/classImg/next.png")}
                            ></Image>
                        </TouchableOpacity>
                    </Layout>
                    {this.renderOption()}
                    <Layout style={styles.bottomRight}>
                        <TouchableOpacity
                            style={{
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            // appearance="ghost"
                            // size="tiny"
                            onPress={this.handleSubmit}
                            disabled={this.props.buttonDisable}
                        >
                            <Text
                                style={{
                                    fontSize: 20,
                                    color: this.props.buttonDisable
                                        ? "gray"
                                        : theme["color-primary-600"],
                                }}
                            >
                                提交
                            </Text>
                        </TouchableOpacity>
                    </Layout>
                </Layout>
                <ZoomPictureModel
                    isShowImage={showImageLayer}
                    zoomImages={zoomImages}
                    currShowImgIndex={zoomImageIndexNow}
                    callBack={() => {
                        this.setState({ showImageLayer: false });
                    }}
                />
            </>
        );
    }
}
