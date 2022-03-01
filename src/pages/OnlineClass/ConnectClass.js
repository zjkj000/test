import { useNavigation } from "@react-navigation/native";
import React, { Component, useState } from "react";
import {
    TouchableWithoutFeedback,
    TouchableOpacity,
    StyleSheet,
    View,
    Image,
    Alert,
    ImageBackground,
    ScrollView,
} from "react-native";
import {
    Icon,
    Input,
    Text,
    Button,
    Layout,
    Autocomplete,
    AutocompleteItem,
} from "@ui-kitten/components";
import http from "../../utils/http/request";
import HistoryInput from "./HistoryInput";
import { styles } from "./styles";

export default ConnectClass = () => {
    const historyListRemote = [
        { title: "192.168.1.81" },
        { title: "192.168.1.124" },
        { title: "192.168.1.126" },
    ];
    const navigation = useNavigation();
    const [ipAddress, setIpAddress] = useState("");
    const [Name, setName] = React.useState("ming6002");
    const [Password, setPassword] = React.useState("2020");
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
            Password: Password,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            navigation.navigate("OnlineClassTemp", { ...resJson });
        });
    };

    return (
        <View style={styles.View}>
            <Layout style={styles.Layout}>
                <Image
                    source={require("../../assets/image/bottomWave.jpg")}
                    style={styles.ImageBottom}
                />
            </Layout>
            <TouchableOpacity style={styles.iconContainer}>
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
        </View>
    );
};
