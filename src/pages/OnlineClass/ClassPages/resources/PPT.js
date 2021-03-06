import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import http from "../../../../utils/http/request";
import RadioList from "../../../LatestTask/DoWork/Utils/RadioList";
import Checkbox from "../../../LatestTask/DoWork/Utils/Checkbox";
import {
    Button,
    Layout,
    Modal,
    Card,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";
import { styles } from "../../styles";
import Toast from "../../../../utils/Toast/Toast";
import { Icon } from "react-native-elements";
import ImageHandler from "../../../../utils/Camera/Camera";
import WebView from "react-native-webview";
import AskAndMark from "./AskAndMark";

export default class PPT extends Component {
    constructor(props) {
        super(props);
        this.state = {
            numid: "",
            resourceName: "",
            resourceId: "",
            baseTypeId: "",
            questionName: "", //题目名称
            questionChoiceList: "", //题目选项
            question: "", //题目内容

            uri: "",
            pptList: [],
            selectedindex: 0, //记录当前选中的是哪张ppt
            showDownloadProgress: -1,
        };
    }
    setProgress = (num) => {
        this.setState({
            showDownloadProgress: num,
        });
    };
    getHTML = (period, ipAddress) => {
        let resURL = "http://" + ipAddress + ":8901" + "/html" + period.links;
        let patten = /(.pptx)|(.ppt)/;
        if (patten.test(resURL)) {
            resURL = resURL.replace(patten, ".html");
            // console.log("PPTGetHtml====================================");
            // console.log(resURL);
            // console.log("====================================");
            return resURL;
        }
        return null;
    };
    handleDownload = (period, ipAddress) => {
        let resURL = "http://" + ipAddress + ":8901" + "/html" + period.links;
        // console.log("====================================");
        // console.log(resURL);
        // console.log("====================================");
        http.download(resURL, "ppt", period.name, this.setProgress);
    };
    render() {
        return (
            <>
                <Layout style={styles.body}>
                    <WebView
                        source={{
                            uri: this.getHTML(
                                this.props.periodNow,
                                this.props.ipAddress
                            ),
                        }}
                    />
                </Layout>
                <Layout style={styles.bottom}>
                    <Layout style={styles.bottomLeft}>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nextPage(-1);
                            }}
                        >
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../../assets/classImg/last.png")}
                            ></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nextPage(1);
                            }}
                        >
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../../assets/classImg/next.png")}
                            ></Image>
                        </TouchableOpacity>
                    </Layout>
                    <Layout
                        style={{ ...styles.inputArea, backgroundColor: "#fff" }}
                    >
                        <TouchableOpacity
                            style={{
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                            onPress={() => {
                                this.handleDownload(
                                    this.props.periodNow,
                                    this.props.ipAddress
                                );
                            }}
                        >
                            {this.state.showDownloadProgress !== -1 ? (
                                <Text
                                    style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                    }}
                                >
                                    {parseInt(this.state.showDownloadProgress)}%
                                </Text>
                            ) : (
                                <></>
                            )}
                            <Image
                                style={{ width: 100, height: 30 }}
                                source={require("../../../../assets/classImg/downloadStudy.png")}
                            />
                        </TouchableOpacity>
                    </Layout>

                    <Layout style={styles.bottomRight}>
                        <AskAndMark {...this.props} />
                    </Layout>
                </Layout>
            </>
        );
    }
}
