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

export default ConnectClass = () => {
    const historyListRemote = [
        { title: "192.168.1.81" },
        { title: "192.168.1.124" },
        { title: "192.168.1.126" },
    ];
    const navigation = useNavigation();
    const route = useRoute();

    const [ipAddress, setIpAddress] = useState(
        route.params?.ipAddress ? route.params.ipAddress : ""
    );

    // if (route.params?.ipAddress) {
    //     let scanIpAddress = route.params.ipAddress;
    //     if (ipAddress !== scanIpAddress) {
    //         setIpAddress(scanIpAddress);
    //     }
    //     Toast.showSuccessToast(scanIpAddress);
    //     // setIpAddress(scanIpAddress);
    // }
    const [Name, setName] = React.useState("ming6002");
    const [Password, setPassword] = React.useState("2020");
    const [scanIpAddress, setScanIpAddress] = React.useState("");
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);
    const [moduleVisible, setModuleVisible] = React.useState(false);
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
            callback: "ha",
        };

        http.get(url, params)
            .then((resStr) => {
                console.log(resStr);
                // Toast.showDangerToast(resStr);
                let resJson = JSON.parse(resStr);
                navigation.navigate("OnlineClassTemp", { ...resJson });
            })
            .catch((error) => {
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
        </View>
    );
};
