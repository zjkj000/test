import { useNavigation } from "@react-navigation/native";
import React, { Component, useState } from "react";
import {
    TouchableWithoutFeedback,
    StyleSheet,
    View,
    Image,
    Alert,
    ImageBackground,
} from "react-native";
import { Icon, Input, Text, Button, Layout } from "@ui-kitten/components";
import http from "../../utils/http/request";

export default ConnectClass = () => {
    const navigation = useNavigation();
    const [ipAddress, setIpAddress] = useState("192.168.1.243");
    const [Name, setName] = React.useState("ming6002");
    const [Password, setPassword] = React.useState("2020");
    const [secureTextEntry, setSecureTextEntry] = React.useState(true);

    const toggleSecureEntry = () => {
        setSecureTextEntry(!secureTextEntry);
    };
    // let messageUrl =
    //     "http://" +
    //     ip +
    //     "/html" +
    //     period.links +
    //     "/" +
    //     period.resourceId +
    //     "Show.html";
    //密码显隐图标
    const renderEyeIcon = (props) => (
        <TouchableWithoutFeedback onPress={toggleSecureEntry}>
            <Icon {...props} name={secureTextEntry ? "eye-off" : "eye"} />
        </TouchableWithoutFeedback>
    );
    //提示密码alert
    const renderPasswordCaption = () => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>请输入密码 </Text>
            </View>
        );
    };
    //提示用户名alert
    const renderNameCaption = () => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>请输入用户名</Text>
            </View>
        );
    };
    const handleLogin = () => {
        const url =
            ipAddress +
            ":8000" +
            "/KeTangServer/ajax/ketang_clientKeTangPlayByStu.do";
        const params = {
            userName: Name,
            password: Password,
        };
        http.get(url, params).then((res) => {
            Alert.alert(res);
            navigation.navigate("OnlineClassTemp");
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
            <Image
                source={require("../../assets/image/91.png")}
                style={styles.Image}
            />
            <Input
                value={Name}
                placeholder="请输入用户名"
                //caption={renderNameCaption}
                accessoryLeft={<Icon name="person" />}
                onChangeText={(nextValue) => setName(nextValue)}
                style={styles.Input}
            />

            <Input
                value={Password}
                placeholder="请输入密码"
                //caption={renderPasswordCaption}
                accessoryLeft={<Icon name="lock" />}
                accessoryRight={renderEyeIcon}
                secureTextEntry={secureTextEntry}
                onChangeText={(nextValue) => setPassword(nextValue)}
                style={styles.Input}
            />
            <Input
                value={ipAddress}
                placeholder="请输入IP"
                //caption={renderPasswordCaption}
                accessoryLeft={<Icon name="globe-2-outline" />}
                onChangeText={(nextValue) => setIpAddress(nextValue)}
                style={styles.Input}
            />
            <Button onPress={handleLogin} style={styles.Button}>
                登 录
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    View: {
        flex: 1,
        backgroundColor: "#fff",
        alignItems: "center",
    },
    captionContainer: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
    },
    captionIcon: {
        width: 10,
        height: 10,
        marginRight: 5,
    },
    captionText: {
        fontSize: 12,
        fontWeight: "400",
        fontFamily: "opensans-regular",
        color: "#8F9BB3",
    },
    Image: {
        alignItems: "center",
        margin: 20,
    },
    Input: {
        alignItems: "center",
        width: "80%",
        paddingTop: 15,
        backgroundColor: "#fff",
        fontStyle: {
            color: "#000",
        },
    },
    Button: {
        margin: 20,
        width: "70%",
    },
    Layout: {
        position: "absolute",
        bottom: 0,
    },
    ImageBottom: {
        position: "relative",
        flex: 1,
    },
});
