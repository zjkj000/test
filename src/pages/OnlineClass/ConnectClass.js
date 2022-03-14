import {
    useFocusEffect,
    useNavigation,
    useRoute,
} from "@react-navigation/native";
import React, { Component, useRef, useState } from "react";
import { TouchableOpacity, View, Image } from "react-native";
import { Icon, Button, Layout } from "@ui-kitten/components";
import http from "../../utils/http/request";
import HistoryInput from "./HistoryInput";
import { styles } from "./styles";
import Toast from "../../utils/Toast/Toast";
import Loading from "../../utils/loading/Loading";
import StorageUtil from "../../utils/Storage/Storage";

export default ConnectClass = () => {
    let historyListRemote = StorageUtil.get("historyListRemote");
    // let historyListRemote = [];
    console.log(historyListRemote);
    const navigation = useNavigation();
    const route = useRoute();

    const [ipAddress, setIpAddress] = useState(
        route.params?.ipAddress ? route.params.ipAddress : ""
    );
    const [showLoading, setShowLoading] = React.useState(false);
    const [Name, setName] = React.useState("ming6002");
    const [Password, setPassword] = React.useState("2020");
    const [scanIpAddress, setScanIpAddress] = React.useState("");
    const [historyList, setHistoryList] = React.useState(historyListRemote);

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
                console.log(typeof resStr);
                if (typeof resStr === "undefined") {
                    Toast.showWarningToast("暂无课程开始");
                } else {
                    // Toast.showDangerToast(resStr);
                    let resJson = JSON.parse(resStr);
                    historyListRemote.push(ipAddress);
                    StorageUtil.save("historyList", historyList);
                    navigation.navigate("OnlineClassTemp", {
                        ...resJson,
                        ipAddress: ipAddress,
                        userName: Name,
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
                setScanIpAddress(ipAddress);
                setIpAddress(ipAddress);
            }
        }
    }, [route]);

    const handleScan = () => {
        navigation.navigate("QRCodeScanner");
        // Toast.showSuccessToast(route.params);
    };

    const handleLiveClass = () => {};
    return (
        <View style={styles.View}>
            <Layout style={styles.Layout}>
                <Image
                    source={require("../../assets/image/bottomWave.jpg")}
                    style={styles.ImageBottom}
                />
            </Layout>
            <TouchableOpacity style={styles.iconContainer} onPress={handleScan}>
                <Icon
                    style={styles.icon}
                    fill="#8F9BB3"
                    name="camera-outline"
                />
            </TouchableOpacity>
            <HistoryInput
                icon={<Icon name="globe-outline" />}
                style={styles.Input}
                historyList={historyListRemote}
                value={ipAddress}
                setValue={setIpAddress}
            ></HistoryInput>
            <Button onPress={handleLogin} style={styles.Button}>
                连接
            </Button>
            <Button onPress={handleLiveClass} style={styles.Button}>
                直播课程
            </Button>
            <Loading show={showLoading}></Loading>
        </View>
    );
};
