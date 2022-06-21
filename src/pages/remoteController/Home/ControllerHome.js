import { useNavigation, useRoute, useTheme } from "@react-navigation/native";
import {
    Icon,
    Layout,
    Modal,
    Button,
    OverflowMenu,
} from "@ui-kitten/components";
import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { styles } from "./styles";
import http from "../../../utils/http/request";
import Toast from "../../../utils/Toast/Toast";
import Controller from "./Controller";
import Info from "./Info";
import Module from "./Module";
import Img_arr from "./Img_arr";
import theme from "../../../theme/custom-theme.json";
import ClassList from "./ClassList";
import Loading from "../../../utils/loading/Loading";

export default ControllerHome = () => {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <HomeComponent navigation={navigation} route={route}></HomeComponent>
    );
};

class HomeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buttonSelector: 0,
            resJson: {},
            renderIndex: 0,
            signModalVisible: false,
            buttonType: "default",
            infoButtonType: "default",
            actionType: "",
            event: {},
            exitModalVisible: false,
            classListVisible: false,
            questionAnalysisVisible: false,
            showLoading: false,
        };
    }
    componentDidMount() {
        // 开启轮询任务
        this.timerId = setInterval(() => {
            this.handleMessageQueue();
        }, 200);
    }
    componentWillUnmount() {
        // 结束轮询任务
        clearInterval(this.timerId);
    }
    setInfoButtonType = (index) => {
        switch (index) {
            case 0:
                this.setState({ infoButtonType: "normalQuestion" });
                break;
            case 1:
                this.setState({ infoButtonType: "randomQuestion" });
                break;
            case 2:
                this.setState({ infoButtonType: "rushQuestion" });
                break;
            default:
                this.setState({ infoButtonType: "default" });
                break;
        }
    };
    setButton = (str) => {
        console.log("====================setButton=====================");
        this.setState({ buttonType: str });
    };
    handleMessageQueue() {
        this.getMessage();
        const { resJson } = this.state;
        if (resJson.hasOwnProperty("messageList")) {
            let messageList = resJson.messageList;
            if (messageList.length !== 0) {
                console.log(
                    "handleMessage===================================="
                );
                console.log(resJson);
                let event = messageList[0];
                console.log("messageList===========================");
                for (let i = 0; i < messageList.length; i++) {
                    console.log(messageList[i]);
                }
                console.log("===========================");
                console.log(event);
                const { actionType, action } = event;
                this.setState({ actionType, event });
                switch (action) {
                    case "closeRes":
                        this.setButton("default");
                        this.setInfoButtonType("default");
                        break;
                    case "openSign":
                        console.log("openSign");
                        this.setState({
                            signModalVisible: true,
                        });
                        break;
                    case "closeSign":
                        console.log("closeSign");
                        this.setState({
                            signModalVisible: false,
                        });
                        break;
                    case "openAllAnalysis":
                        this.setState({ questionAnalysisVisible: true });
                        // this.setButton("default");
                        // this.setInfoButtonType("default");
                        break;
                    case "closeAllAnalysis":
                        this.setState({ questionAnalysisVisible: false });
                        // this.setButton("default");
                        // this.setInfoButtonType("default");
                        break;
                    default:
                        switch (actionType) {
                            case "questionAnswer":
                                break;
                            case "toScan":
                                this.props.navigation.navigate("Login");
                                break;
                            default:
                                this.setState({ buttonType: action });
                        }
                }
            }
        }
    }
    getMessage() {
        const { ipAddress, userName } = this.props.route.params;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_getMessageListByTea.do";
        const params = {
            userId: userName,
        };
        // console.log("getMessage====================================");
        // console.log(ipAddress);
        // console.log(url);
        // console.log(params);
        // console.log("====================================");
        this.setState({ showLoading: true });
        http.get(url, params)
            .then((resStr) => {
                // console.log("getMessage====================================");
                // console.log(resStr);
                // console.log("====================================");
                // Toast.showSuccessToast(resStr);
                resJson = JSON.parse(resStr);
                this.setState({
                    showLoading: false,
                    resJson,
                });
                // console.log(resJson);
            })
            .catch((error) => {
                Toast.showDangerToast(error.toString());
            });
    }
    remoteControl = (action, actionType, desc = "") => {
        const { resId, resPath, learnPlanId, resRootPath } = this.props;
        const { ipAddress, userName } = this.props.route.params;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_sendMessageByRn.do";
        let params = {
            type: 0,
            userType: "teacher",
            userNum: "one",
            source: userName,
            target: 0,
            messageType: 0,
            action,
            actionType,
            resId: resId ? resId : "",
            resPath: resPath ? resPath : null,
            learnPlanId: learnPlanId ? learnPlanId : null,
            resRootPath: resRootPath
                ? resRootPath
                : "C:/ZJKJ/SKYDT/zhihuiketang",
            desc: desc,
        };
        // params = { messageJson: JSON.stringify(params) };
        this.setState({ showLoading: true });
        http.post(url, params)
            .then((res) => {
                console.log(
                    "ControllerSender===================================="
                );
                console.log(url);
                console.log(params);
                // console.log(this.props);
                console.log("actionType: " + actionType);
                console.log("action: " + action);
                console.log(res);
                console.log("Success!");
                this.setState({ showLoading: false });
                console.log("====================================");
            })
            .catch((error) => {
                console.log(
                    "ControllerSender===================================="
                );
                console.log(params);
                console.log("actionType: " + actionType);
                console.log("action: " + action);
                console.log("Failed Because: " + error.toString);
                console.log("====================================");
            });
    };
    handleExit = () => {
        this.remoteControl("toScan", "toScan");
        this.props.navigation.navigate("Login");
    };
    handleClassOver = () => {};
    handleQuestionAnalysis = () => {
        this.remoteControl("openAllAnalysis", "allAnalysis");
        this.setState({ questionAnalysisVisible: true });
    };

    render() {
        const { ipAddress, userName } = this.props.route.params;
        const { learnPlanId } = this.state.event;
        return (
            <Layout style={styles.mainContainer}>
                <Loading show={this.state.showLoading} />
                <Layout style={styles.header}>
                    <TouchableOpacity
                        onPress={() => {
                            this.setState({ exitModalVisible: true });
                        }}
                    >
                        <Text style={styles.headerText}>下课</Text>
                    </TouchableOpacity>
                    <ClassList ipAddress={ipAddress} />
                </Layout>
                <Layout style={styles.infoContainer}>
                    <Module
                        {...this.state.event}
                        ipAddress={ipAddress}
                        actionType={this.state.actionType}
                        userName={userName}
                        setInfoButtonType={this.setInfoButtonType}
                    />
                    <Info
                        {...this.state.event}
                        ipAddress={ipAddress}
                        actionType={this.state.actionType}
                        userName={userName}
                        infoButtonType={this.state.infoButtonType}
                    />
                </Layout>
                <Controller
                    {...this.state.event}
                    ipAddress={ipAddress}
                    actionType={this.state.actionType}
                    userName={userName}
                    buttonType={this.state.buttonType}
                />
                <Layout style={styles.bottomContainer}>
                    <TouchableOpacity
                        onPress={() => {
                            this.props.navigation.navigate(
                                "ControllerSharePhoto",
                                {
                                    learnPlanId,
                                    ipAddress,
                                    userName,
                                }
                            );
                        }}
                    >
                        <Image
                            style={styles.bottomImg}
                            source={require("../../../assets/image2/bottom/stpz.png")}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            this.remoteControl("openSign", "sign");
                            this.setState({ signModalVisible: true });
                        }}
                    >
                        <Image
                            style={styles.bottomImg}
                            source={require("../../../assets/image2/bottom/jrdm.png")}
                        ></Image>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={this.handleQuestionAnalysis}>
                        <Image
                            style={styles.bottomImg}
                            source={require("../../../assets/image2/bottom/ckxq.png")}
                        ></Image>
                    </TouchableOpacity>
                    <Modal visible={this.state.signModalVisible}>
                        <View style={styles.signPageMainContainer}>
                            <View
                                style={{
                                    alignItems: "center",
                                    justifyContent: "center",
                                    width: 200,
                                    height: 200,
                                }}
                            >
                                <Icon
                                    name="power-outline"
                                    fill="#4E9AC0"
                                    style={{ width: 64, height: 64 }}
                                />
                                <Button
                                    onPress={() => {
                                        this.remoteControl(
                                            "do:goBackFromSign",
                                            "sign"
                                        );
                                        this.setState({
                                            signModalVisible: false,
                                        });
                                    }}
                                    size="giant"
                                >
                                    退出点名
                                </Button>
                            </View>
                        </View>
                    </Modal>
                    <Modal visible={this.state.exitModalVisible}>
                        <View style={styles.exitCard}>
                            <View style={styles.questionNumRow}>
                                <Text>确认下课吗</Text>
                            </View>
                            <View
                                style={{
                                    ...styles.questionNumRow,
                                    justifyContent: "space-evenly",
                                }}
                            >
                                <Button
                                    onPress={() => {
                                        this.setState({
                                            exitModalVisible: false,
                                        });
                                    }}
                                >
                                    取消
                                </Button>
                                <Button onPress={this.handleExit}>确认</Button>
                            </View>
                        </View>
                    </Modal>
                    <Modal visible={this.state.questionAnalysisVisible}>
                        <View style={styles.questionAnalysisModal}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.remoteControl(
                                        "allQuestionAnalysis",
                                        "allAnalysis"
                                    );
                                }}
                            >
                                <Image
                                    source={
                                        Img_arr["infoImg"]["normalQuestion"][
                                            "png0_1"
                                        ]
                                    }
                                ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.remoteControl(
                                        "allQuestionAnalysisLine",
                                        "allAnalysis"
                                    );
                                }}
                            >
                                <Image
                                    source={
                                        Img_arr["infoImg"]["normalQuestion"][
                                            "png1_1_obj"
                                        ]
                                    }
                                ></Image>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    this.remoteControl(
                                        "do:goBackFromAllAnalysis",
                                        "allAnalysis"
                                    );
                                    this.setState({
                                        questionAnalysisVisible: false,
                                    });
                                }}
                            >
                                <Image
                                    source={
                                        Img_arr["infoImg"]["normalQuestion"][
                                            "png2_1"
                                        ]
                                    }
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </Layout>
            </Layout>
        );
    }
}
