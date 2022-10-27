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

export default class Document extends Component {
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
        let patten = /(.docx)|(.doc)/;
        if (patten.test(resURL)) {
            resURL = resURL.replace(patten, ".html");
            return resURL;
        }
        return null;
    };
    handleDownload = (period, ipAddress) => {
        let resURL = "http://" + ipAddress + ":8901" + "/html" + period.links;
        let pattenDocx = /(.docx)/;
        let pattenDoc = /(.doc)/;
        // console.log("====================================");
        // console.log(resURL);
        // console.log("====================================");
        let fileType = "pdf";
        if (pattenDocx.test(period.links)) {
            fileType = "docx";
        } else if (pattenDoc.test(period.links)) {
            fileType = "doc";
        }
        http.download(resURL, fileType, period.name, this.setProgress);
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
                    <View
                        style={{ ...styles.inputArea, backgroundColor: "#fff" }}
                    >
                        <TouchableOpacity
                            style={{ flexDirection: "row" }}
                            onPress={() => {
                                this.handleDownload(
                                    this.props.periodNow,
                                    this.props.ipAddress
                                );
                            }}
                        >
                            {/* {this.state.showDownloadProgress !== -1 ? (
                                <Text>{this.state.showDownloadProgress} %</Text>
                            ) : (
                                <></>
                            )} */}
                            <Image
                                style={{ width: 100, height: 30 }}
                                source={require("../../../../assets/classImg/downloadStudy.png")}
                            />
                        </TouchableOpacity>
                    </View>

                    <Layout style={styles.bottomRight}>
                        <AskAndMark {...this.props} />
                    </Layout>
                </Layout>
            </>
        );
    }
}
