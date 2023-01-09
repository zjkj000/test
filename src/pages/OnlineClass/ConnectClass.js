import {
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import React, { Component, useRef, useState } from "react";
import { TouchableOpacity, View, Image, NativeModules } from "react-native";
import { Icon, Button, Layout, Input } from "@ui-kitten/components";
import http from "../../utils/http/request";
import HistoryInput from "./HistoryInput";
import { styles } from "./styles";
import Toast from "../../utils/Toast/Toast";
import Loading from "../../utils/loading/Loading";
import StorageUtil from "../../utils/Storage/Storage";

export default ConnectClass = () => {
    // StorageUtil.clear();

    const navigation = useNavigation();
    const route = useRoute();
    const [ipAddress, setIpAddress] = useState(
        route.params?.ipAddress ? route.params.ipAddress : ""
    );
    const [showLoading, setShowLoading] = React.useState(false);
    const [Name, setName] = React.useState(global.constants.userName);
    const [Password, setPassword] = React.useState(global.constants.passWord);
    // const [historyList, setHistoryList] = React.useState([]);

    const handleLogin = () => {
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_clientKeTangPlayByStu.do";
        const params = {
            userName: Name,
            password: Password,
        };
        setShowLoading(true);
        http.get(url, params)
            .then((resStr) => {
                setShowLoading(false);
                // console.log("ConnectClass====================================");
                // console.log(resStr);
                // console.log("====================================");
                if (typeof resStr === "undefined") {
                    Toast.showWarningToast("暂无课程开始");
                } else {
                    // Toast.showDangerToast(resStr);
                    let resJson = JSON.parse(resStr);
                    if (resJson.learnPlan.introduction === "unExist") {
                        Toast.showInfoToast(
                            "您不是该课堂学生；或账户填写错误，请检查",
                            2000
                        );
                        return;
                    } else if (resJson.learnPlan.introduction === "noKetang") {
                        Toast.showInfoToast("请等待教师打开课堂", 2000);
                        return;
                    }
                    StorageUtil.get("historyListRemote").then((res) => {
                        res = res ? res : [];
                        let storageFlag = true;
                        for (let item in res) {
                            // console.log(res[item]);
                            if (res[item].title === ipAddress) {
                                storageFlag = false;
                            }
                        }
                        if (storageFlag) {
                            res.push({ title: ipAddress });
                            StorageUtil.save("historyListRemote", res);
                        }
                    });
                    let imgURL =
                        "http://" +
                        ipAddress +
                        ":8901" +
                        "/KeTangServer/ajax/ketang_getQRcodeUrl.do";
                    http.get(imgURL)
                        .then((resStr) => {
                            let imgResJson = JSON.parse(resStr);
                            navigation.navigate("OnlineClassTemp", {
                                ...resJson,
                                ipAddress: ipAddress,
                                userName: Name,
                                imgURL: imgResJson.url,
                            });
                        })
                        .catch((error) => {
                            Toast.showWarningToast(
                                "IP二维码请求失败:",
                                error.toString
                            );
                        });
                }
            })
            .catch((error) => {
                setShowLoading(false);
                Toast.showDangerToast(error.toString());
            });
    };
    React.useEffect(() => {
        if (route.params?.ipAddress) {
            if (typeof route.params.ipAddress == "string") {
                let ipAddress = route.params.ipAddress;
                setIpAddress(ipAddress);
            }
        }
    }, [route]);

    const handleScan = () => {
        navigation.navigate({
            name: "扫码",
            params: { backPage: { name: "线上课程" } },
            merge: true,
        });
    };

    const handleLiveClass = () => {
        NativeModules.IntentMoudle.startActivityFromJS(
            "LaunchActivity",
            userId + "-" + userCn + "-" + roomId
        );
    };

    return (
        <View style={styles.View}>
            <Layout style={styles.Layout}>
                <Image
                    source={require("../../assets/image/bottomWave.jpg")}
                    style={styles.ImageBottom}
                />
            </Layout>
            <TouchableOpacity style={styles.iconContainer} onPress={handleScan}>
                <Image
                    source={require("../../assets/classImg/barcode.png")}
                    style={styles.bigImg}
                />
                {/* <Icon
                    style={styles.icon}
                    fill="#8F9BB3"
                    name="camera-outline"
                /> */}
            </TouchableOpacity>
            <HistoryInput
                icon={<Icon name="globe-outline" />}
                style={styles.Input}
                value={ipAddress}
                setValue={setIpAddress}
                storageName="historyListRemote"
            ></HistoryInput>
            {/* <HistoryInput
                icon={<Icon name="person" />}
                style={styles.Input}
                value={userId}
                setValue={setUserId}
            ></HistoryInput>
            <HistoryInput
                icon={<Icon name="person" />}
                style={styles.Input}
                value={userCn}
                setValue={setuserCn}
            ></HistoryInput>
            <HistoryInput
                icon={<Icon name="lock" />}
                style={styles.Input}
                value={roomId}
                setValue={setRoomId}
            ></HistoryInput> */}

            <Button onPress={handleLogin} style={styles.Button}>
                连接
            </Button>
            <Loading show={showLoading}></Loading>
        </View>
    );
};
