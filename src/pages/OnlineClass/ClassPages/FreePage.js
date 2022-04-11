import React, { Component } from "react";
import { View, Text, TouchableOpacity, Image, TextInput } from "react-native";
import http from "../../../utils/http/request";
import RadioList from "../../LatestTask/DoWork/Utils/RadioList";
import Checkbox from "../../LatestTask/DoWork/Utils/Checkbox";
import {
    Button,
    Layout,
    Modal,
    Card,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";
import { styles } from "../styles";
import Toast from "../../../utils/Toast/Toast";
import { Icon } from "react-native-elements";
import ImageHandler from "../../../utils/Camera/Camera";
import WebView from "react-native-webview";
import Question from "./resources/Qustion";
import PPT from "./resources/PPT";
import Picture from "./resources/Picture";
import Document from "./resources/Document";

export default class FreePage extends Component {
    constructor(props) {
        const { messageList } = props;
        const event = messageList[0];
        const { periodList } = event;
        super(props);
        this.state = {
            visible: false,
            pageNow: 0,
            pageLength: periodList.length,
            periodList: periodList,
            moduleVisible: false,
        };
    }

    nextPage = (step) => {
        let { pageLength, pageNow } = this.state;
        console.log(pageNow);
        pageNow += step;
        if (pageNow < 0) {
            Toast.showInfoToast("当前是第一题", 1000);
        } else if (pageNow >= pageLength) {
            Toast.showInfoToast("当前是最后一题", 1000);
        } else {
            this.setState({ pageNow });
        }
    };

    renderBody = () => {
        const { periodList, pageNow, pageLength } = this.state;
        const { ipAddress } = this.props;
        let period = periodList[pageNow];
        console.log("RenderBody====================================");
        console.log(period);
        console.log("====================================");
        let bodyContent = <></>;
        switch (period.type) {
            case "question":
                bodyContent = (
                    <Question
                        period={period}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                    />
                );
                break;
            case "ppt":
                bodyContent = (
                    <PPT
                        period={period}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                    />
                );
                break;
            case "document":
                bodyContent = (
                    <Document
                        period={period}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                    />
                );
                break;
            case "picture":
                bodyContent = (
                    <Picture
                        period={period}
                        ipAddress={ipAddress}
                        nextPage={this.nextPage}
                    />
                );
                break;
            default:
                break;
        }
        return <>{bodyContent}</>;
    };

    renderAvatar = () => {
        return (
            <TouchableOpacity>
                <Image source={require("../../../assets/classImg/menu.png")} />
            </TouchableOpacity>
        );
    };

    renderMenuItem = () => {
        const { periodList } = this.state;
        return periodList.map((item, index) => {
            return (
                <MenuItem
                    title={item.name}
                    onPress={this.setState({ pageNow: index })}
                />
            );
        });
    };

    renderSAQ = () => {
        const { userName, introduction, imgURL } = this.props;
        return (
            <Layout style={styles.mainContainer}>
                <Layout style={styles.header}>
                    <Layout style={styles.header_left}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        >
                            <Image
                                style={styles.smallImg}
                                source={require("../../../assets/classImg/subj.png")}
                            />
                        </TouchableOpacity>
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                    <Layout style={styles.header_middle}>
                        <Text>探究活动学习</Text>
                    </Layout>
                    <Layout style={styles.header_right}>
                        <Text>{`${this.state.pageNow + 1}/${
                            this.state.pageLength
                        }`}</Text>
                        <TouchableOpacity>
                            <Image
                                source={require("../../../assets/classImg/endCheck1.png")}
                            />
                        </TouchableOpacity>
                        <OverflowMenu
                            anchor={this.renderAvatar}
                            visible={this.state.moduleVisible}
                            onBackdropPress={() => {
                                this.setState({ moduleVisible: false });
                            }}
                        >
                            {this.renderMenuItem()}
                        </OverflowMenu>
                    </Layout>
                </Layout>
                {this.renderBody()}

                <Modal
                    visible={this.state.visible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({ visible: false })}
                >
                    <Card disabled={true}>
                        <Image
                            style={styles.QRCode}
                            source={{ uri: imgURL }}
                        ></Image>
                    </Card>
                </Modal>
            </Layout>
        );
    };

    render() {
        return <View>{this.renderSAQ()}</View>;
    }
}
