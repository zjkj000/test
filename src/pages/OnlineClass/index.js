import { useNavigation, useRoute } from "@react-navigation/native";
import React, { Component } from "react";
import { View, Text, Image, BackHandler } from "react-native";
import Orientation from "react-native-orientation";
import { styles } from "./styles";
import http from "../../utils/http/request";
import Toast from "../../utils/Toast/Toast";

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
                // Toast.showDangerToast(error.toString());
            });
    }

    componentDidMount() {
        Orientation.lockToLandscape();
        if (Platform.OS === "android") {
            BackHandler.addEventListener(
                "hardwareBackPress",
                this.onBackAndroid
            );
        }

        // 轮询
        this.timerId = setInterval(() => {
            this.getInfo();
            const { resJson } = this.state;
            if (resJson) {
                messageList = resJson.messageList;
                if (messageList.length !== 0) {
                    let action = messageList[0];
                    console.log(action);
                }
            }
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
        return false;
    }

    render() {
        const routeParams = this.props.route.params;
        // const { courseName, introduction, teacherName } = routeParams.learnPlan;
        return (
            <View style={styles.mainContainer}>
                <Image source={require("../../assets/image/music.png")}></Image>
                <Text>课堂:{routeParams.learnPlan.courseName}</Text>
                <Text>教师:{routeParams.learnPlan.teacherName}</Text>
                <Text>学生:{routeParams.learnPlan.introduction}</Text>
            </View>
        );
    }
}
