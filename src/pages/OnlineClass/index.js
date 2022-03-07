import { useNavigation, useRoute } from "@react-navigation/native";
import React, { Component, useState } from "react";
import { View, Text, Image, BackHandler } from "react-native";
import Orientation from "react-native-orientation";
import { styles } from "./styles";
import http from "../../utils/http/request";
import Toast from "../../utils/Toast/Toast";
import {
    bindBackExitApp,
    removeBackExitApp,
} from "../../utils/TwiceTap/TwiceTap";

export default function OnlineClassTempPage() {
    const navigation = useNavigation();
    const route = useRoute();
    return <OnlineClassTemp navigation={navigation} route={route} />;
}

class OnlineClassTemp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            resJson: null,
            pageRender: 0,
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
        if (resJson) {
            messageList = resJson.messageList;
            if (messageList.length !== 0) {
                let events = messageList[0];
                const { action } = events;
                console.log(action);
                switch (action) {
                    case "toScan":
                        this.props.navigation.goBack();
                        break;
                    case "read-lock":
                        console.log("单题模式");
                    // TODO: 渲染单题组件
                    case "no-lock":
                        console.log("多题模式");
                    // TODO: 渲染多题组件
                    case "lock":
                        console.log("结束答题");
                    default:
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

        // 轮询
        this.timerId = setInterval(() => {
            this.handleMessageQueue();
        }, 500);
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
    onBackAndroid() {
        // console.log("hardware back button pressed!");
        return true;
    }

    pageRender = () => {
        const { pageRender } = this.state;
        console.log(pageRender);
        switch (pageRender) {
            case 0:
                return this._renderIndex();
            case 1:
                return this._renderLockedPage();
            case 2:
                return this._renderFreePage();
            case 3:
                return this._renderTempPage();
            default:
                break;
        }
    };

    _renderIndex() {
        const routeParams = this.props.route.params;
        // const { courseName, introduction, teacherName } = routeParams.learnPlan;
        return (
            <view>
                <Image source={require("../../assets/image/music.png")}></Image>
                <Text>课堂:{routeParams.learnPlan.courseName}</Text>
                <Text>教师:{routeParams.learnPlan.teacherName}</Text>
                <Text>学生:{routeParams.learnPlan.introduction}</Text>
            </view>
        );
    }

    _renderLockedPage() {
        return (
            <View>
                <Text>我是受控页面</Text>
            </View>
        );
    }

    _renderFreePage() {
        return (
            <View>
                <Text>我是自由页面</Text>
            </View>
        );
    }

    _renderTempPage() {
        return (
            <View>
                <Text>我是空页面</Text>
            </View>
        );
    }

    render() {
        return <View style={styles.mainContainer}>{this.pageRender()}</View>;
    }
}
