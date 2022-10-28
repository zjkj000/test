import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
} from "react-native";
import http from "../../../../utils/http/request";
import {
    Button,
    Layout,
    Modal,
    Card,
    OverflowMenu,
    MenuItem,
    Input,
} from "@ui-kitten/components";
import { styles } from "../../styles";
import Toast from "../../../../utils/Toast/Toast";
import { Icon } from "react-native-elements";
import ImageHandler from "../../../../utils/Camera/Camera";
import WebView from "react-native-webview";
import SpliteLine from "../../../../utils/SpliteLine/SpliteLine";
import AskAndMark from "./AskAndMark";

export default class Picture extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flgVisible: false,
            askVisible: false,
        };
    }
    getHTML = (period, ipAddress) => {
        let resURL = "http://" + ipAddress + ":8901" + "/html" + period.links;
        return resURL;
    };

    render() {
        return (
            <>
                <Layout style={styles.body}>
                    <Layout style={styles.body_webview}>
                        <WebView
                            source={{
                                uri: this.getHTML(
                                    this.props.periodNow,
                                    this.props.ipAddress
                                ),
                            }}
                        />
                    </Layout>
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
                    ></Layout>
                    <Layout style={styles.bottomRight}>
                        <AskAndMark {...this.props} />
                    </Layout>
                </Layout>
            </>
        );
    }
}
