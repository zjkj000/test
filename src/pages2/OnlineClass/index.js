import { useNavigation, useRoute } from "@react-navigation/native";
import React, { Component, useState } from "react";
import { View, Text, Image, BackHandler, ScrollView } from "react-native";
import Orientation from "react-native-orientation";
import { styles } from "./styles";
import http from "../../utils/http/request";
import Toast from "../../utils/Toast/Toast";
import { shallowEqual } from "../../utils/Compare/Compare";
import {
    bindBackExitApp,
    removeBackExitApp,
} from "../../utils/TwiceTap/TwiceTap";
import TempPage from "./ClassPages/TempPage";
import FreePage from "./ClassPages/FreePage";
import LockedPage from "./ClassPages/LockedPage";
import HTML from "react-native-render-html";
import ShareStuAnswer from "./ClassPages/ShareStuAnswer";
import AnonymousCorrecting from "./ClassPages/AnonymousCorrecting";
import RushPage from "./ClassPages/RushPage";
import { TouchableOpacity } from "react-native-gesture-handler";
import theme from "../../theme/custom-theme.json";
import { Layout } from "@ui-kitten/components";
import { ScreenHeight, ScreenWidth } from "react-native-elements/dist/helpers";

export default function OnlineClassTempPage() {
    const navigation = useNavigation();
    const route = useRoute();
    return <OnlineClassTemp navigation={navigation} route={route} />;
}

class OnlineClassTemp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resJson: {},
            pageRender: 0,
            isRushReady: 0,
            rushListening: 500,
            buttonDisable: false,
        };
    }

    getInfo() {
        const { ipAddress, userName } = this.props.route.params;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_getMessageListByStu.do";
        const params = {
            userId: userName,
        };
        http.get(url, params)
            .then((resStr) => {
                // Toast.showDangerToast(resStr);
                resJson = JSON.parse(resStr);
                this.setState({
                    resJson,
                });
                // console.log(resJson);
            })
            .catch((error) => {
                Toast.showDangerToast(error.toString());
            });
    }

    handleMessageQueue() {
        this.getInfo();
        const { resJson } = this.state;
        if (resJson.hasOwnProperty("messageList")) {
            messageList = resJson.messageList;
            if (messageList.length !== 0) {
                let events = messageList[messageList.length - 1];
                // console.log("====================================");
                // console.log(events);
                // console.log("====================================");
                const { action, period } = events;
                switch (action) {
                    case "toScan":
                        this.props.navigation.goBack();
                        break;
                    case "read-lock":
                        console.log("单题模式");
                        this.setState({ pageRender: 1, buttonDisable: false });
                        // TODO: 渲染单题组件
                        break;
                    case "no-lock":
                        console.log("多题模式");
                        this.setState({ pageRender: 2 });
                        // TODO: 渲染多题组件
                        break;
                    case "lock":
                        console.log("结束答题");
                        if (period !== null) {
                            this.setState({ buttonDisable: true });
                        } else {
                            this.setState({ pageRender: 5 });
                        }
                        break;
                    case "ShareStuAnswer":
                        console.log("分享答案");
                        this.setState({ pageRender: 3 });
                        break;
                    case "AnonymousCorrecting":
                        console.log("匿名评分");
                        this.setState({ pageRender: 4 });
                        break;
                    case "readyResponder":
                        this.setState({
                            pageRender: 6,
                            isRushReady: 0,
                            rushListening: 200,
                        });
                        break;
                    case "startResponder":
                        this.setState({ isRushReady: 1, rushListening: 1000 });
                        break;
                    case "stopResponder":
                        console.log("抢到了！");
                        break;
                    case "QuitTask":
                    default:
                        console.log("结束答题");
                        this.setState({ pageRender: 5 });
                        break;
                }
            }
        }
    }

    componentDidMount() {
        Orientation.lockToLandscape(); // 强制横屏
        if (Platform.OS === "android") {
            // 判断系统类型
            BackHandler.addEventListener(
                // 注册'hardwareBackPress'监听事件
                "hardwareBackPress",
                this.onBackAndroid
            );
        }

        // // 轮询
        this.timerId = setInterval(() => {
            this.handleMessageQueue();
        }, this.state.rushListening);
    }

    componentWillUnmount() {
        Orientation.lockToPortrait();
        if (Platform.OS === "android") {
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.onBackAndroid
            );
        }
        // 清空定时器
        clearInterval(this.timerId);
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (shallowEqual(this.state.resJson, nextState.resJson)) {
            console.log(nextState.resJson);
            return true;
        }
        return false;
    }
    onBackAndroid() {
        // console.log("hardware back button pressed!");
        return true;
    }

    pageRender = () => {
        const { pageRender, resJson, isRushReady, buttonDisable } = this.state;
        const { ipAddress, userName, imgURL } = this.props.route.params;
        const { introduction } = this.props.route.params.learnPlan;
        switch (pageRender) {
            case 0:
                return this._renderIndex();
            case 1:
                return this._renderLockedPage({
                    ...resJson,
                    ipAddress,
                    introduction,
                    userName,
                    imgURL,
                    buttonDisable,
                });
            case 2:
                return this._renderFreePage({
                    ...resJson,
                    ipAddress,
                    introduction,
                    userName,
                    imgURL,
                    // touchable,
                });
            case 3:
                return this._renderShareStuAnswer({
                    ...resJson,
                    ipAddress,
                    introduction,
                    userName,
                    imgURL,
                });
            case 4:
                return this._renderAnonymousCorrecting({
                    ...resJson,
                    ipAddress,
                    introduction,
                    userName,
                    imgURL,
                });
            case 5:
                return this._renderTempPage({
                    ...resJson,
                    ipAddress,
                    introduction,
                    userName,
                    imgURL,
                });
            case 6:
                return this._renderRushPage({
                    ...resJson,
                    ipAddress,
                    introduction,
                    userName,
                    imgURL,
                    isReady: isRushReady,
                });
            default:
                break;
        }
    };

    _renderIndex() {
        const routeParams = this.props.route.params;
        // const { courseName, introduction, teacherName } = routeParams.learnPlan;
        return (
            <ScrollView
                style={{
                    width: "100%",
                    height: "100%",
                    backgroundColor: "#fff",
                }}
            >
                <View
                    style={{
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <Image
                        source={require("../../assets/classImg/ready.jpg")}
                    ></Image>
                    <Text style={styles.infoText}>
                        课堂:{routeParams.learnPlan.courseName}
                    </Text>
                    <Text style={styles.infoText}>
                        教师:{routeParams.learnPlan.teacherName}
                    </Text>
                    <Text style={styles.infoText}>
                        学生:{routeParams.learnPlan.introduction}
                    </Text>
                    <TouchableOpacity
                        style={{ marginTop: 10 }}
                        onPress={() => {
                            this.props.navigation.navigate({
                                name: "Home",
                                params: { screen: "线上课程" },
                                merge: true,
                            });
                        }}
                    >
                        <Text
                            style={{
                                color: theme["color-primary-600"],
                                fontSize: 20,
                            }}
                        >
                            退出课堂
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }

    _renderLockedPage(props) {
        return <LockedPage {...props} />;
    }

    _renderFreePage(props) {
        return <FreePage {...props} />;
    }

    _renderShareStuAnswer(props) {
        return <ShareStuAnswer {...props} />;
    }

    _renderAnonymousCorrecting(props) {
        return <AnonymousCorrecting {...props} />;
    }

    _renderTempPage(props) {
        return <TempPage {...props} />;
    }

    _renderRushPage(props) {
        return <RushPage {...props} />;
    }

    render() {
        return <View style={styles.mainContainer}>{this.pageRender()}</View>;
    }
}
