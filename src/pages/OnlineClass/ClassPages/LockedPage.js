import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import http from "../../../utils/http/request";
import RadioList from "../../LatestTask/DoWork/Utils/RadioList";
import Checkbox from "../../LatestTask/DoWork/Utils/Checkbox";
import {
    Button,
    Layout,
    Modal,
    Card,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";
import { styles } from "../styles";
import Toast from "../../../utils/Toast/Toast";
import { Icon } from "react-native-elements";
import ImageHandler from "../../../utils/Camera/Camera";
import WebView from "react-native-webview";

export default class LockedPage extends Component {
    constructor(props) {
        const { messageList } = props;
        const event = messageList[0];
        const { period } = event;
        const subjective =
            period.questionType == "3" || period.questionType == "5";
        super(props);
        this.state = {
            html: {
                html: "",
            },
            visible: false,
            msg: "",
            moduleVisible: false,
            answer: "",
            showSideBox: false,
            questionType: period.questionType ? period.questionType : "1",
            subjective: subjective,
            imgURL: [],
            htmlURL: "",
        };
    }
    componentDidMount() {
        this.getHTML();
    }
    setAnswer = (str) => {
        let { html } = this.state;
        let newHTML = { html: html.html + str };
        this.setState({ html: newHTML, answer: str });
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
    handleSubmit = () => {
        const { messageList, ipAddress, userName, introduction } = this.props;
        const event = messageList[0];
        const { period } = event;
        const { subjective } = this.state;
        let url =
            "http://" +
            ipAddress +
            ":8901" +
            (subjective
                ? "/KeTangServer/ajax/ketang_saveStuSubjectiveAnswerFromApp.do"
                : "/KeTangServer/ajax/ketang_saveStuAnswerFromApp.do");
        console.log(event.learnPlanId);
        let params = {
            userName: userName,
            realName: introduction,
            learnPlanId: event.learnPlanId,
            interactionType: period.questionType,
            questionScore: period.questionScore,
            resourceID: period.resourceId,
            questionAnswer: period.questionAnswerStr
                ? period.questionAnswerStr
                : "",
            content: subjective ? this.state.html.html : this.state.answer,
            learnPlanName: "",
            answerTime: event.desc,
        };
        http.get(url, params, true)
            .then((resStr) => {
                console.log(params);
                // console.log("====================================");
                // console.log(resStr);
                // console.log("====================================");
                const resJson = JSON.parse(resStr);
                if (resJson.status === "success") {
                    Toast.showSuccessToast("提交成功");
                } else {
                    Toast.showDangerToast(resJson.message);
                }
            })
            .catch((error) => {
                // console.log("====================================");
                // console.log(error);
                // console.log("====================================");
                Toast.showDangerToast("提交失败");
            });
        // Toast.showInfoToast(this.state.answer);
    };
    getHTML = () => {
        const { messageList, ipAddress } = this.props;
        const event = messageList[0];
        const { period } = event;
        let resURL =
            "http://" +
            ipAddress +
            ":8901" +
            "/html" +
            period.links +
            "/" +
            period.resourceId +
            "Show.html";
        console.log(resURL);
        this.setState({ htmlURL: resURL });
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
                    source={require("../../../assets/image3/camera.png")}
                ></Image>
            </TouchableOpacity>
        );
    };

    renderAnswerBox = () => {
        const { subjective, html } = this.state;
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

    renderInputArea = () => {
        return (
            <View>
                <View
                    style={{
                        backgroundColor: "#000000",
                        height: 1,
                        width: "100%",
                    }}
                ></View>
                <View style={styles.inputArea}>
                    <Text
                        onPress={() =>
                            this.setState({ answer: "", imgURL: [] })
                        }
                        style={{ color: "#B68459" }}
                    >
                        删除
                    </Text>
                    <TextInput
                        placeholder="请输入答案！"
                        multiline
                        style={{
                            width: 500,
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
                            width: 100,
                            height: "100%",
                            backgroundColor: "#59B9E0",
                        }}
                    >
                        保存
                    </Button>
                </View>
            </View>
        );
    };

    renderOption = () => {
        const { messageList } = this.props;
        const event = messageList[0];
        const { period } = event;
        const { questionType, subjective } = this.state;
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

    renderSAQ = () => {
        const { userName, introduction, imgURL } = this.props;
        return (
            <Layout style={styles.mainContainer}>
                <Layout style={styles.header}>
                    <Layout style={styles.header_left}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        >
                            <Icon name="cast" />
                        </TouchableOpacity>
                    </Layout>
                    <Layout style={styles.header_middle}>
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                    <Layout style={styles.header_right}>
                        <Button onPress={this.handleSubmit}>提交</Button>
                    </Layout>
                </Layout>
                <Layout style={styles.body}>
                    <Layout style={styles.body_webview}>
                        <WebView source={{ uri: this.state.htmlURL }} />
                    </Layout>
                    {this.renderAnswerBox()}
                </Layout>

                <Layout style={styles.bottom}>{this.renderOption()}</Layout>

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
            </Layout>
        );
    };

    render() {
        return <View>{this.renderSAQ()}</View>;
    }
}
