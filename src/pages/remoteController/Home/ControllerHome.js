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
import DeviceInfo from "react-native-device-info";

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
            action: "",
            event: {},
            exitModalVisible: false,
            classListVisible: false,
            questionAnalysisVisible: false,
            moduleButton: [0, 0, 0],
            // showLoading: false,
        };
        const apkVersion = DeviceInfo.getVersion();
        // console.log("HomeComponent====================================");
        // console.log(apkVersion);
        // console.log("====================================");
    }
    setModuleButton = (index, status) => {
        let { moduleButton } = this.state;
        moduleButton = [0, 0, 0];
        if (index !== -1) {
            moduleButton[index] = status;
        }
        this.setState({ moduleButton: [...moduleButton] });
    };
    componentDidMount() {
        // 开启轮询任务
        this.timerId = setInterval(() => {
            this.getMessage();
        }, 500);
    }
    componentWillUnmount() {
        // 结束轮询任务
        clearInterval(this.timerId);
        this.setState({ exitModalVisible: false });
    }
    setInfoButtonType = (index) => {
        switch (index) {
            case 0:
                this.setState({ infoButtonType: "normalQuestion" });
                this.setModuleButton(0, 1);
                break;
            case 1:
                this.setState({ infoButtonType: "randomQuestion" });
                this.setModuleButton(1, 1);
                break;
            case 2:
                this.setState({ infoButtonType: "rushQuestion" });
                this.setModuleButton(2, 1);
                break;
            default:
                this.setState({
                    infoButtonType: "default",
                    moduleButton: [0, 0, 0],
                });
                break;
        }
    };
    setButton = (str) => {
        // console.log("====================setButton=====================");
        this.setState({ buttonType: str });
    };
    handleMessageQueue(resJson) {
        // console.log("轮询====================================");
        // console.log(resJson);
        // console.log("====================================");
        // const { resJson } = this.state;
        if (
            resJson !== null &&
            resJson.hasOwnProperty("messageList") &&
            resJson.messageList.length !== 0
        ) {
            console.log(
                "handleMessageQueue===================================="
            );
            console.log(resJson);
            console.log("====================================");
            let messageList = resJson.messageList;
            let event = messageList[messageList.length - 1];
            console.log("messageList===========================");
            for (let i = 0; i < messageList.length; i++) {
                console.log(messageList[i]);
            }
            console.log("===========================");
            console.log(event);
            const { actionType, action } = event;
            this.setState({ actionType, event });
            switch (action) {
                case "openQuestion":
                    this.setInfoButtonType("default");
                    this.setState({ buttonType: action });
                    break;
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
                            this.setState({ action: action });
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
        // this.setState({ showLoading: true });
        http.get(url, params)
            .then((resStr) => {
                resJson = JSON.parse(resStr);
                // console.log("GetMessage====================================");
                // console.log(resJson);
                // console.log("====================================");
                this.handleMessageQueue(resJson);
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
        // this.setState({ showLoading: true });
        http.post(url, params, false, false)
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
                // this.setState({ showLoading: false });
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
        const { userName } = this.props.route.params;
        this.remoteControl("toScan", "toScan");
        this.props.navigation.navigate({
            name: "Teacher_Home",
            params: { userName: userName },
        });
    };
    handleClassOver = () => {};
    handleQuestionAnalysis = () => {
        this.remoteControl("openAllAnalysis", "allAnalysis");
        this.setState({ questionAnalysisVisible: true });
    };

    render() {
        const { ipAddress, userName, learnPlanId } = this.props.route.params;
        const { action } = this.state.event;
        const { moduleButton } = this.state;
        return (
            <Layout style={styles.mainContainer}>
                {/* <Loading show={this.state.showLoading} /> */}
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
                        moduleButton={moduleButton}
                        setModuleButton={this.setModuleButton}
                        ipAddress={ipAddress}
                        actionType={this.state.actionType}
                        userName={userName}
                        setInfoButtonType={this.setInfoButtonType}
                        buttonType={this.state.buttonType}
                    />
                    <Info
                        resId={this.state.event.resId}
                        action={action}
                        ipAddress={ipAddress}
                        actionType={this.state.actionType}
                        userName={userName}
                        infoButtonType={this.state.infoButtonType}
                        setInfoButtonType={this.setInfoButtonType}
                    />
                </Layout>
                <Layout style={styles.controllerContainer}>
                    <Controller
                        {...this.state.event}
                        ipAddress={ipAddress}
                        actionType={this.state.actionType}
                        userName={userName}
                        buttonType={this.state.buttonType}
                    />
                </Layout>
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
                                <TouchableOpacity
                                    onPress={() => {
                                        this.remoteControl(
                                            "do:goBackFromSign",
                                            "sign"
                                        );
                                        this.setState({
                                            signModalVisible: false,
                                        });
                                    }}
                                >
                                    <Image
                                        style={styles.questionAnalysisImage}
                                        source={require("../../../assets/image2/bottom/closedm.png")}
                                    ></Image>
                                </TouchableOpacity>
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
                                    source={require("../../../assets/image2/bottom/ztfx.png")}
                                    style={styles.questionAnalysisImage}
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
                                    source={require("../../../assets/image2/bottom/qsfx.png")}
                                    style={styles.questionAnalysisImage}
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
                                    source={require("../../../assets/image2/bottom/tcxq.png")}
                                    style={styles.questionAnalysisImage}
                                ></Image>
                            </TouchableOpacity>
                        </View>
                    </Modal>
                </Layout>
            </Layout>
        );
    }
}
