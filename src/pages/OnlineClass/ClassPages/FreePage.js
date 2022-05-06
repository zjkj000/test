import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
} from "react-native";
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
    Icon,
} from "@ui-kitten/components";
import { styles } from "../styles";
import Toast from "../../../utils/Toast/Toast";
import ImageHandler from "../../../utils/Camera/Camera";
import WebView from "react-native-webview";
import Question from "./resources/Qustion";
import PPT from "./resources/PPT";
import Picture from "./resources/Picture";
import Document from "./resources/Document";
import StorageUtil from "../../../utils/Storage/Storage";
import { ScrollView } from "react-native-gesture-handler";

export default class FreePage extends Component {
    constructor(props) {
        const { messageList } = props;
        const event = messageList[0];
        const { periodList } = event;
        let resStateList = [];
        for (let i = 0; i < periodList.length; i++) {
            resStateList[i] = false;
        }
        super(props);
        this.state = {
            visible: false,
            pageNow: 0,
            pageLength: periodList.length,
            periodList: periodList,
            menuVisible: false,
            prevStartTime: -1,
            prevResourceId: -1,
            resStateList: resStateList,
            finishVisible: false,
            confirmVisible: false,
        };

        // 进入探究活动时，清除上次作答的结果
        this.initAnswerStorage();
    }
    initAnswerStorage = () => {
        StorageUtil.delete("tjAnswer");
        const { periodList } = this.state;
        let tjAnswer = {};
        for (let i = 0; i < periodList.length; i++) {
            const element = periodList[i];
            if (element.type === "question") {
                tjAnswer[element.id] = {
                    answer: "",
                    html: { html: "" },
                    imgURL: [],
                };
            }
        }
        StorageUtil.save("tjAnswer", tjAnswer);
    };
    componentDidMount() {
        // 特殊处理第一道题的进度上传
        if (this.state.prevResourceId === -1) {
            const { pageNow, periodList } = this.state;
            const period = periodList[pageNow];
            let timeNow = new Date().getTime();
            let type = period.type === "question" ? "que" : "res";
            this.saveQuestionState(
                period.resourceId,
                period.name,
                timeNow,
                type,
                null,
                null,
                true
            );
        }
    }

    nextPage = (step) => {
        let { pageLength, pageNow } = this.state;
        console.log(pageNow);
        pageNow += step;
        if (pageNow < 0) {
            Toast.showInfoToast("当前是第一题", 500);
        } else if (pageNow >= pageLength) {
            Toast.showInfoToast("当前是最后一题", 500);
        } else {
            this.setState({ pageNow });
        }
    };
    componentDidUpdate(prevProps, prevState) {
        if (prevState.pageNow !== this.state.pageNow) {
            const nowPeriod = this.state.periodList[this.state.pageNow];
            const { resStateList } = this.state;
            console.log("pageNowUpdate====================================");
            console.log(resStateList);
            console.log("====================================");
            // 使用毫秒计时
            let timeNow = new Date().getTime();
            let type = nowPeriod.type === "question" ? "que" : "res";
            let first = this.state.prevStartTime === -1;
            this.saveQuestionState(
                nowPeriod.resourceId,
                nowPeriod.name,
                timeNow,
                type,
                this.state.prevResourceId,
                this.state.prevStartTime,
                first
            );
        }
    }

    saveQuestionState = (
        id,
        name,
        timeNow,
        type,
        prevId,
        prevStartTime,
        first
    ) => {
        const { ipAddress, messageList, introduction, userName } = this.props;
        const event = messageList[0];
        const { period } = event;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_ExploreStuStudying.do";
        // const url =
        //     "http://" +
        //     "192.168.1.81" +
        //     ":8222" +
        //     "/KeTangServer/ajax/ketang_ExploreStuStudying.do";
        let params = {
            stuId: userName,
            stuName: introduction,
            startTime: timeNow,
            type: type,
            contentId: id,
            contentName: name,
            taskId: period.id,
            taskName: period.name,
            id: first ? "" : prevId,
            lastStartTime: first ? "" : prevStartTime,
            lastEndTime: first ? "" : timeNow,
            version: 2,
        };
        http.post(url, params)
            .then((res) => {
                if (res.success) {
                    const data = res.data.split(",");
                    this.setState({
                        prevStartTime: timeNow,
                        prevResourceId: data[0] ? data[0] : -1,
                    });
                    if (type === "res") {
                        this.changeResState(this.state.pageNow);
                    }
                } else {
                    Toast.showWarningToast("进度保存失败");
                }
            })
            .catch((error) => {
                Toast.showWarningToast("请检查您的网络：" + error.toString());
            });
    };

    renderBody = () => {
        const { periodList, pageNow, pageLength } = this.state;
        const { ipAddress } = this.props;
        let periodNow = periodList[pageNow];
        let bodyContent = <></>;
        switch (periodNow.type) {
            case "question":
                bodyContent = (
                    <Question
                        periodNow={periodNow}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                        indexNow={pageNow}
                        handleChangeState={this.changeResState}
                        {...this.props}
                    />
                );
                break;
            case "ppt":
                bodyContent = (
                    <PPT
                        periodNow={periodNow}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                        {...this.props}
                    />
                );
                break;
            case "document":
                bodyContent = (
                    <Document
                        periodNow={periodNow}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                        {...this.props}
                    />
                );
                break;
            case "picture":
                bodyContent = (
                    <Picture
                        periodNow={periodNow}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                        {...this.props}
                    />
                );
                break;
            default:
                break;
        }
        return <>{bodyContent}</>;
    };

    renderAvatar = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ menuVisible: true });
                }}
            >
                <Image source={require("../../../assets/classImg/menu.png")} />
            </TouchableOpacity>
        );
    };
    changeResState = (index) => {
        let { resStateList } = this.state;
        resStateList[index] = true;
        this.setState({ resStateList: resStateList });
    };

    renderCheckImage = (props) => {
        return (
            <Image
                // {...props}
                style={{
                    height: 14,
                    marginHorizontal: 8,
                    tintColor: "#8F9BB3",
                    width: 22,
                }}
                // key={`image-${index}`}
                source={require("../../../assets/classImg/cloud.png")}
                // name="checkmark-circle-outline"
            />
        );
    };

    renderMenuItem = () => {
        const { periodList, resStateList } = this.state;
        return periodList.map((item, index) => {
            return (
                <MenuItem
                    style={{
                        width: "100%",
                    }}
                    key={`menuItem-${index}`}
                    title={`${index + 1} - ${item.name}`}
                    onPress={() => this.setState({ pageNow: index })}
                    accessoryLeft={
                        resStateList[index] ? this.renderCheckImage : null
                    }
                />
            );
        });
    };

    handleFinish = () => {
        const { resStateList } = this.state;
        let flg = true;
        for (let i = 0; i < resStateList.length; i++) {
            if (!resStateList[i]) {
                flg = false;
                break;
            }
        }
        if (flg) {
            const { ipAddress, messageList, userName } = this.props;
            const event = messageList[0];
            const { period } = event;
            const url =
                "http://" +
                ipAddress +
                ":8901" +
                "/KeTangServer/ajax/ketang_ExploreStopStudy.do";
            let params = {
                stuId: userName,
                taskId: period.id,
            };
            console.log(url);
            console.log(params);
            http.post(url, params)
                .then((res) => {
                    console.log(res);
                    if (res.success) {
                        Toast.showSuccessToast("保存成功！");
                        this.setState({ finishVisible: true });
                    } else {
                        Toast.showWarningToast(res.message);
                    }
                })
                .catch((error) => {
                    Toast.showDangerToast("保存失败: " + error.toString());
                });
        } else this.setState({ confirmVisible: true });
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
                            <Image
                                style={styles.smallImg}
                                source={require("../../../assets/classImg/subj.png")}
                            />
                        </TouchableOpacity>
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                    <Layout style={styles.header_middle}>
                        <Text>探究活动学习</Text>
                    </Layout>
                    <Layout style={styles.header_right}>
                        <Text>{`${this.state.pageNow + 1}/${
                            this.state.pageLength
                        }`}</Text>
                        <TouchableOpacity onPress={this.handleFinish}>
                            <Image
                                source={require("../../../assets/classImg/endstart.png")}
                            />
                        </TouchableOpacity>
                        <OverflowMenu
                            style={{
                                width: 300,
                                backgroundColor: "rgba(0, 0, 0, 0.5)",
                            }}
                            anchor={this.renderAvatar}
                            visible={this.state.menuVisible}
                            onBackdropPress={() => {
                                this.setState({ menuVisible: false });
                            }}
                        >
                            {this.renderMenuItem()}
                        </OverflowMenu>
                    </Layout>
                </Layout>
                {this.renderBody()}
                {/* 课堂二维码 */}
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
                {/* 提交后的页面 */}
                <Modal
                    visible={this.state.finishVisible}
                    backdropStyle={styles.backdrop}
                    style={styles.default}
                >
                    <ImageBackground
                        style={{ ...styles.default }}
                        source={require("../../../assets/classImg/backImage.png")}
                    >
                        <ScrollView
                            style={{
                                height: "100%",
                                width: "100%",
                                flexDirection: "column",
                            }}
                            contentContainerStyle={{
                                justifyContent: "center",
                                alignItems: "center",
                                paddingVertical: 10,
                            }}
                        >
                            {this.state.periodList.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        style={{
                                            flexDirection: "row",
                                            flex: 1,
                                            marginTop: 12,
                                            padding: 10,
                                            width: "50%",
                                            backgroundColor: "#6CC1E0",
                                            borderRadius: 5,
                                        }}
                                        key={`finishMenuItem-${index}`}
                                        onPress={() =>
                                            this.setState({
                                                pageNow: index,
                                                finishVisible: false,
                                            })
                                        }
                                    >
                                        {this.state.resStateList[index] ? (
                                            <Image
                                                style={{
                                                    height: 14,
                                                    marginHorizontal: 8,
                                                    tintColor: "#8F9BB3",
                                                    width: 22,
                                                }}
                                                key={`image-${index}`}
                                                source={require("../../../assets/classImg/cloud.png")}
                                            />
                                        ) : (
                                            <View
                                                key={`block-${index}`}
                                                style={{
                                                    height: 14,
                                                    marginHorizontal: 8,
                                                    width: 22,
                                                }}
                                            ></View>
                                        )}
                                        <Text
                                            style={{
                                                width: "100%",
                                                color: "white",
                                            }}
                                        >
                                            {`${index + 1} - ${item.name}`}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                    </ImageBackground>
                </Modal>
                {/* 提示还有题目没有提交 */}
                <Modal
                    visible={this.state.confirmVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() =>
                        this.setState({ confirmVisible: false })
                    }
                    style={styles.default}
                >
                    <View
                        style={{
                            width: "70%",
                            height: "70%",
                            flexDirection: "row",
                            backgroundColor: "#6CC1E0",
                            borderRadius: 20,
                        }}
                    >
                        <ScrollView
                            style={{
                                height: "100%",
                                flex: 1,
                                flexDirection: "column",
                                borderRightColor: "white",
                                borderRightWidth: 1,
                            }}
                            contentContainerStyle={{
                                paddingVertical: 20,
                            }}
                        >
                            {this.state.periodList.map((item, index) => {
                                return (
                                    <TouchableOpacity
                                        key={`checkMenuItem-${index}`}
                                        style={{
                                            flexDirection: "row",
                                            flex: 1,
                                            paddingTop: 12,
                                        }}
                                        onPress={() =>
                                            this.setState({
                                                pageNow: index,
                                                confirmVisible: false,
                                            })
                                        }
                                    >
                                        {this.state.resStateList[index] ? (
                                            <Image
                                                style={{
                                                    height: 14,
                                                    marginHorizontal: 8,
                                                    tintColor: "#8F9BB3",
                                                    width: 22,
                                                }}
                                                key={`image-${index}`}
                                                source={require("../../../assets/classImg/cloud.png")}
                                            />
                                        ) : (
                                            <View
                                                style={{
                                                    height: 14,
                                                    marginHorizontal: 8,
                                                    width: 22,
                                                }}
                                                key={`block-${index}`}
                                            ></View>
                                        )}
                                        <Text
                                            style={{
                                                width: "100%",
                                                color: "white",
                                            }}
                                        >
                                            {`${index + 1} - ${item.name}`}
                                        </Text>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <View
                            style={{
                                height: "100%",
                                flex: 1,
                                flexDirection: "column",
                                padding: 20,
                            }}
                        >
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <Text>您还有资源未学习，确认提交吗</Text>
                            </View>
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: "center",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <Button
                                    style={{ backgroundColor: "#3675A1" }}
                                    onPress={() => {
                                        const {
                                            ipAddress,
                                            messageList,
                                            userName,
                                        } = this.props;
                                        const event = messageList[0];
                                        const { period } = event;
                                        const url =
                                            "http://" +
                                            ipAddress +
                                            ":8901" +
                                            "/KeTangServer/ajax/ketang_ExploreStopStudy.do";
                                        let params = {
                                            stuId: userName,
                                            taskId: period.id,
                                        };
                                        console.log(url);
                                        console.log(params);
                                        http.post(url, params)
                                            .then((res) => {
                                                console.log(res);
                                                if (res.success) {
                                                    Toast.showSuccessToast(
                                                        "保存成功！"
                                                    );
                                                    this.setState({
                                                        finishVisible: true,
                                                        confirmVisible: false,
                                                    });
                                                } else {
                                                    Toast.showWarningToast(
                                                        res.message
                                                    );
                                                }
                                            })
                                            .catch((error) => {
                                                Toast.showDangerToast(
                                                    "保存失败: " +
                                                        error.toString()
                                                );
                                            });
                                    }}
                                >
                                    继续提交
                                </Button>
                                <Button
                                    style={{ backgroundColor: "gray" }}
                                    onPress={() => {
                                        this.setState({
                                            confirmVisible: false,
                                        });
                                    }}
                                >
                                    不提交
                                </Button>
                            </View>
                        </View>
                    </View>
                </Modal>
            </Layout>
        );
    };

    render() {
        return <View>{this.renderSAQ()}</View>;
    }
}
