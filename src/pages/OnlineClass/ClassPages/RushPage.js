import { Layout, Button } from "@ui-kitten/components";
import React, { Component } from "react";
import { Image, Text, View, TouchableOpacity } from "react-native";
import { styles } from "../styles";

export default class RushPage extends Component {
    handlePress = () => {
        const { ipAddress, userName } = this.props;
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
    };
    render() {
        const { userName, introduction } = this.props;
        console.log("RushPage====================================");
        console.log(this.props);
        console.log("====================================");
        return (
            <View style={styles.mainContainer}>
                <Layout style={styles.header}>
                    <Layout style={styles.header_left}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        >
                            <Image
                                source={require("../../../assets/classImg/subj.png")}
                                style={styles.smallImg}
                            />
                        </TouchableOpacity>
                    </Layout>
                    <Layout style={styles.header_middle}></Layout>
                    <Layout
                        style={{
                            ...styles.header_right,
                            alignItems: "center",

                            justifyContent: "center",
                        }}
                    >
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                </Layout>
                <Layout style={{ ...styles.body, flexDirection: "column" }}>
                    {this.props.isReady ? (
                        <TouchableOpacity onPress={() => {}}>
                            <Image
                                source={require("../../../assets/classImg/qiangDaButton.png")}
                            />
                        </TouchableOpacity>
                    ) : (
                        <Image
                            source={require("../../../assets/classImg/readyQiangda.png")}
                        />
                    )}
                    {/* <Image
                        source={require("../../../assets/stuImg/qing.png")}
                    />{" "} */}
                </Layout>
            </View>
        );
    }
}
