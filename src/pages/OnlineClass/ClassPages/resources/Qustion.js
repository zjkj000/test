import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
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
import { Icon } from "react-native-elements";
import ImageHandler from "../../../../utils/Camera/Camera";
import WebView from "react-native-webview";
import { styles } from "../../styles";

export default class Question extends Component {
    constructor(props) {
        const { period } = props;
        const subjective =
            period.questionType == "3" || period.questionType == "5";
        super(props);
        this.state = {
            html: {
                html: "",
            },
            questionType: period.questionType ? period.questionType : "1",
            subjective: subjective,
            msg: "",
            moduleVisible: false,
            answer: "",
            showSideBox: false,
            imgURL: [],
            htmlURL: "",
        };
    }
    renderInputArea = () => {
        return (
            <View style={styles.inputArea}>
                <Text
                    onPress={() => this.setState({ answer: "", imgURL: [] })}
                    style={{ color: "#B68459" }}
                >
                    删除
                </Text>
                <TextInput
                    placeholder="请输入答案！"
                    multiline
                    style={{
                        width: 200,
                        backgroundColor: "#FFFFFF",
                        height: 40,
                    }}
                    value={this.state.msg}
                    onChangeText={(text) => this.setState({ msg: text })}
                ></TextInput>
                {/* 拍照答题功能弹窗 */}
                <OverflowMenu
                    anchor={this.renderAvatar}
                    visible={this.state.moduleVisible}
                    onBackdropPress={() => {
                        this.setState({ moduleVisible: false });
                    }}
                >
                    <MenuItem title="拍照" onPress={this.handleCamera} />
                    <MenuItem
                        title="从相册中选择"
                        onPress={this.handleLibrary}
                    />
                    <MenuItem
                        title="取消"
                        onPress={() => {
                            this.setState({ moduleVisible: false });
                        }}
                    />
                </OverflowMenu>
                <Button
                    onPress={() => {
                        let newAnswer = this.state.answer;
                        newAnswer += this.state.msg;
                        this.setState({ msg: "" });
                        this.setAnswer(newAnswer);
                    }}
                    style={{
                        width: 80,
                        height: "100%",
                        backgroundColor: "#59B9E0",
                    }}
                >
                    保存
                </Button>
            </View>
        );
    };
    imageUpload = (base64) => {
        const { messageList, ipAddress, userName } = this.props;
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
        http.post(url, params)
            .then((resStr) => {
                const resJson = JSON.parse(resStr);
                console.log(resJson);
                if (resJson.status === "success") {
                    let { imgURL, html } = this.state;
                    let newHTML = {
                        html: html.html + `<img src= "${resJson.url}" \/>`,
                    };
                    this.setState({
                        imgURL: [...imgURL, resJson.url],
                        html: newHTML,
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
                        imgURL: [...this.state.imgURL, res.uri],
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
                        imgURL: [...this.state.imgURL, res.uri],
                        moduleVisible: false,
                    });
                    this.imageUpload(res.base64);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("获取图片失败:" + error.toString());
            });
    };
    handleSubmit = () => {};

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

    renderOption = (period) => {
        let questionType = period.questionType;
        let subjective = questionType === "3" || questionType === "5";
        let optionBar = (
            <RadioList
                checkedindexID={this.state.answer}
                getstuanswer={this.setAnswer}
                ChoiceList={period.questionValueList}
            />
        );
        if (subjective) {
            optionBar = this.renderInputArea();
        } else if (questionType === "2") {
            optionBar = (
                <Checkbox
                    checkedlist={this.state.answer}
                    getstuanswer={this.setAnswer}
                    ChoiceList={period.questionValueList}
                />
            );
        }
        return optionBar;
    };
    setAnswer = (str) => {
        let { html } = this.state;
        let newHTML = { html: html.html + str };
        this.setState({ html: newHTML, answer: str });
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
        const { html } = this.state;
        if (subjective && html.html !== "") {
            return (
                <Layout style={styles.body_answerBox}>
                    <WebView
                        scalesPageToFit={Platform.OS === "ios" ? true : false}
                        source={this.state.html}
                    />
                </Layout>
            );
        }
    };

    render() {
        return (
            <>
                <Layout style={styles.body}>
                    <Layout style={styles.body_webview}>
                        <WebView
                            source={{
                                uri: this.getHTML(
                                    this.props.period,
                                    this.props.ipAddress
                                ),
                            }}
                        />
                    </Layout>
                    {this.renderAnswerBox(this.props.period.questionType)}
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
                    {this.renderOption(this.props.period)}
                    <Layout style={styles.bottomRight}>
                        <Button style={{ width: 80, height: "100%" }}>
                            提交
                        </Button>
                    </Layout>
                </Layout>
            </>
        );
    }
}
