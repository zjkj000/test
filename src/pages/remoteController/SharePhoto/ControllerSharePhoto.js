import { useNavigation, useRoute } from "@react-navigation/native";
import { Button, Icon, Layout } from "@ui-kitten/components";
import React, { Component } from "react";
import { Image, TouchableOpacity, View, Text } from "react-native";
import { styles } from "./styles";
import ImageHandler from "../../../utils/Camera/Camera";
import http from "../../../utils/http/request";
import Loading from "../../../utils/loading/Loading";

export default function ControllerSharePhoto(props) {
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <SharePhotoComponent
            navigation={navigation}
            route={route}
        ></SharePhotoComponent>
    );
}

class SharePhotoComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgURL: "",
            buttonDisable1: true,
            buttonDisable2: true,
            showLoading: false,
        };
    }
    componentDidUpdate(preProps, preState) {
        if (preState.imgURL !== this.state.imgURL) {
            console.log("imgURLUpdate====================================");
            console.log(this.state.imgURL);
            console.log("====================================");
            if (this.state.imgURL !== "") {
                this.setState({ buttonDisable1: false });
            }
        }
    }
    handleCamera = () => {
        ImageHandler.handleCamera().then((res) => {
            if (res) {
                // this.setState({ imgURL: res.uri });
                this.saveImage(res.uri);
            } else {
                // TODO: 获取图像失败
            }
        });
    };
    handleLibrary = () => {
        ImageHandler.handleLibrary().then((res) => {
            if (res) {
                this.setState({
                    imgURL: res.uri,
                });
            } else {
                // TODO: 获取图像失败
            }
        });
    };
    remoteControl = (action, actionType, resId = "", desc = "") => {
        const { ipAddress, resPath, learnPlanId, resRootPath } = this.props;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_sendMessageByRn.do";
        let params = {
            type: 0,
            userType: "teacher",
            userNum: "one",
            source: this.props.userName,
            target: 0,
            messageType: 0,
            action,
            actionType,
            resId: resId ? resId : "",
            resPath: resPath ? resPath : null,
            learnPlanId: learnPlanId ? learnPlanId : null,
            resRootPath: resRootPath
                ? resRootPath
                : "C:/ZJKJ/SKYDT/zhihuiketang",
            desc: desc,
        };
        this.setState({ showLoading: true });
        // params = { messageJson: JSON.stringify(params) };
        http.post(url, params)
            .then((res) => {
                console.log("ModuleSender====================================");
                console.log(url);
                console.log(params);
                // console.log(this.props);
                console.log("actionType: " + actionType);
                console.log("action: " + action);
                console.log(res);
                console.log("Success!");
                console.log("====================================");
                this.setState({ showLoading: false });
            })
            .catch((error) => {
                console.log("ModuleSender====================================");
                console.log(params);
                console.log("actionType: " + actionType);
                console.log("action: " + action);
                console.log("Failed Because: " + error.toString);
                console.log("====================================");
            });
    };
    saveImage = (baseCode) => {
        const { ipAddress, userName, learnPlanId } = this.props.route.params;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_saveBase64Image.do";
        const params = {
            baseCode,
            learnPlanId,
            userId: userName,
        };
        this.setState({ showLoading: true });
        http.post(url, params)
            .then((res) => {
                console.log("saveImage====================================");
                console.log(res);
                console.log("====================================");
                if (res.status === "success") {
                    this.setState({ imgURL: res.url, showLoading: false });
                } else {
                    console.log(
                        "saveImageError===================================="
                    );
                    console.log(res);
                    console.log("====================================");
                }
                // this.setState({ imgURL: res });
            })
            .catch((error) => {
                console.log(
                    "saveImageServiceError===================================="
                );
                console.log(error);
                console.log("====================================");
            });
    };
    handleShare = () => {
        this.remoteControl("open", "shareImage", this.state.imgURL);
        this.setState({ buttonDisable2: false });
        this.remoteControl("open", "shareImage", this.state.imgURL);
        this.setState({ buttonDisable1: true });
    };
    handleCloseShare = () => {
        this.remoteControl("close", "shareImage");
        this.setState({ buttonDisable1: false });
        this.remoteControl("close", "shareImage");
        this.setState({ buttonDisable2: true });
    };
    render() {
        return (
            <Layout style={styles.mainContainer}>
                <Loading show={this.state.showLoading}></Loading>
                <Layout style={styles.header}>
                    <TouchableOpacity
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >
                        <Icon
                            name={"arrow-ios-back"}
                            fill="gray"
                            style={{ width: 32, height: 32 }}
                        />
                        <Text style={styles.headerText}>返回遥控器</Text>
                    </TouchableOpacity>
                </Layout>
                <Layout style={styles.mainBody}>
                    {this.state.imgURL === "" ? (
                        <TouchableOpacity onPress={this.handleCamera}>
                            <View style={styles.bodyCard}>
                                <Icon
                                    name="square-outline"
                                    fill="gray"
                                    style={{ width: 32, height: 32 }}
                                ></Icon>
                                <Text>点击相机拍照片</Text>
                            </View>
                        </TouchableOpacity>
                    ) : (
                        <View style={styles.ImageBlock}>
                            <Image
                                style={styles.shareImage}
                                source={{ uri: this.state.imgURL }}
                            ></Image>
                        </View>
                    )}
                </Layout>
                <Layout style={styles.buttonBar}>
                    <Button
                        onPress={this.handleCamera}
                        accessoryLeft={<Icon name="camera"></Icon>}
                    />
                    <Button
                        onPress={this.handleShare}
                        disabled={this.state.buttonDisable1}
                    >
                        <Text>分享到大屏幕</Text>
                    </Button>
                    <Button
                        onPress={this.handleCloseShare}
                        disabled={this.state.buttonDisable2}
                    >
                        <Text>关闭分享</Text>
                    </Button>
                </Layout>
            </Layout>
        );
    }
}
