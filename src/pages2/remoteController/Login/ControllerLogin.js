import {
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import React, { Component, useRef, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Icon, Button, Layout } from "@ui-kitten/components";
import http from "../../../utils/http/request";
import HistoryInput from "../../OnlineClass/HistoryInput";
import { styles } from "./styles";
import Toast from "../../../utils/Toast/Toast";
import Loading from "../../../utils/loading/Loading";
import StorageUtil from "../../../utils/Storage/Storage";
import "../../../utils/global/constants.js";

export default ControllerLogin = () => {
    // StorageUtil.clear();

    const navigation = useNavigation();
    const route = useRoute();
    const [ipAddress, setIpAddress] = useState(
        route.params?.ipAddress ? route.params.ipAddress : ""
    );
    const [showLoading, setShowLoading] = React.useState(false);
    // const [Name, setName] = React.useState(global.constants.userName);
    // const [Password, setPassword] = React.useState(global.constants.passWord);
    // const [historyList, setHistoryList] = React.useState([]);

    const handleLogin = () => {
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_clientKeTangPlayByTea.do";

        setShowLoading(true);
        http.get(url, {})
            .then((resStr) => {
                setShowLoading(false);
                console.log(
                    "ConnectController===================================="
                );
                console.log(resStr);
                console.log("====================================");
                if (typeof resStr === "undefined") {
                    Toast.showWarningToast("暂无课程开始");
                } else {
                    // Toast.showDangerToast(resStr);
                    let resJson = JSON.parse(resStr);
                    StorageUtil.get("controllerHistoryIP").then((res) => {
                        res = res ? res : [];
                        let storageFlag = true;
                        for (let item in res) {
                            console.log(res[item]);
                            if (res[item].title === ipAddress) {
                                storageFlag = false;
                            }
                        }
                        if (storageFlag) {
                            res.push({ title: ipAddress });
                            StorageUtil.save("controllerHistoryIP", res);
                        }
                        navigation.navigate("ControllerHome", {
                            // ...resJson,
                            learnPlanId: resJson.learnPlanId,
                            ipAddress: ipAddress,
                            userName: resJson.teacherId,
                            // imgURL: imgResJson.url,
                        });
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
            params: { backPage: { name: "ControllerLogin" } },
            merge: true,
        });
    };
    return (
        <View style={styles.View}>
            <TouchableOpacity style={styles.iconContainer} onPress={handleScan}>
                <Image
                    source={require("../../../assets/classImg/barcode.png")}
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
                storageName="controllerHistoryIP"
            ></HistoryInput>
            <Button onPress={handleLogin} style={styles.Button}>
                连接
            </Button>
            <Loading show={showLoading}></Loading>
        </View>
    );
};
