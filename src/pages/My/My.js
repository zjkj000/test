import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";
import { screenHeight, screenWidth } from "../../utils/Screen/GetSize";
// import { Avatar } from "react-native-elements";
import { TouchableOpacity } from "react-native-gesture-handler";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import {
    Avatar,
    Layout,
    Button,
    Divider,
    Input,
    Icon,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";

export default class MyPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgURL: "",
            value: "",
            hasAvatar: false,
            userName: "小明",
            selectedTitle: "No items selected",
            moduleVisible: false,
        };
    }
    setValue = (value) => {
        this.setState({
            value,
        });
    };
    handleCamera = () => {
        const option = {
            title: "请选择",
            cancelButtonTitle: "取消",
            takePhotoButtonTitle: "拍照",
            chooseFromLibraryButtonTitle: "选择照片",
            includeBase64: true, // 拍照后生成base64字串
            quality: 1.0,
            allowsEditing: true,
            maxWidth: 500,
            maxHeight: 500,
            saveToPhotos: true,
            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        };
        launchCamera(option, (response) => {
            console.log(response);
            if (response.didCancel) {
                return;
            }
            response = response.assets[0];
            console.log(response.base64);
            this.setState({
                imgURL: response.uri,
                hasAvatar: true,
                moduleVisible: false,
            });
        });

        // launchImageLIbrary(option, (response) => {
        //     console.log("Response = ", response);

        //     console.log(response);
        // });
    };
    handleLibrary = () => {
        const option = {
            title: "请选择",
            chooseFromLibraryButtonTitle: "选择照片",
            includeBase64: true, // 拍照后生成base64字串
            quality: 1.0,
            allowsEditing: true,
            maxWidth: 500,
            maxHeight: 500,
            saveToPhotos: true,
            storageOptions: {
                skipBackup: true,
                path: "images",
            },
        };
        launchImageLibrary(option, (response) => {
            console.log(response);
            if (response.didCancel) {
                return;
            }
            response = response.assets[0];
            console.log(response.base64);
            this.setState({
                imgURL: response.uri,
                hasAvatar: true,
                moduleVisible: false,
            });
        });
    };

    renderAvatar = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ moduleVisible: true });
                }}
            >
                <Avatar
                    size={"giant"}
                    shape={"round"}
                    source={
                        this.state.hasAvatar
                            ? { uri: this.state.imgURL }
                            : require("../../../images/1.png")
                    }
                />
            </TouchableOpacity>
        );
    };
    onItemSelect = (index) => {
        this.setState({
            selectedIndex: index,
            moduleVisible: false,
        });
    };

    render() {
        return (
            <Layout style={styles.container}>
                <Layout style={styles.header}>
                    <Text>我的</Text>
                </Layout>
                <Layout style={styles.avatar}>
                    <OverflowMenu
                        anchor={this.renderAvatar}
                        backdropStyle={styles.backdrop}
                        visible={this.state.moduleVisible}
                        onBackdropPress={() => {
                            this.setState({ moduleVisible: false });
                        }}
                    >
                        <MenuItem title="拍照" onPress={this.handleCamera} />
                        <MenuItem
                            title="从相册中选择"
                            onPress={this.handleLibrary}
                        />
                        <MenuItem
                            title="取消"
                            onPress={() => {
                                this.setState({ moduleVisible: false });
                            }}
                        />
                    </OverflowMenu>
                </Layout>

                <Divider />
                <TouchableOpacity>
                    <View style={styles.alternativeContainer}>
                        <Text style={styles.textLeft}>账号信息</Text>
                        <Text style={styles.textRight}>
                            {this.state.userName}
                        </Text>
                    </View>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity>
                    <View style={styles.alternativeContainer}>
                        <Text style={styles.textLeft}>关于我们</Text>
                        <Text style={styles.textRight}>
                            <Icon
                                style={styles.icon}
                                fill="#8F9BB3"
                                name="arrow-ios-forward-outline"
                            />
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Divider />
                    <View style={styles.alternativeContainer}>
                        <Text style={styles.textLeft}>检测更新</Text>
                        <Text style={styles.textRight}>
                            {" "}
                            <Icon
                                style={styles.icon}
                                fill="#8F9BB3"
                                name="arrow-ios-forward-outline"
                            />
                        </Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity>
                    <Divider />
                    <View style={styles.alternativeContainer}>
                        <Text style={styles.textLeft}>我要选课</Text>
                        <Text style={styles.textRight}>
                            {" "}
                            <Icon
                                style={styles.icon}
                                fill="#8F9BB3"
                                name="arrow-ios-forward-outline"
                            />
                        </Text>
                    </View>
                </TouchableOpacity>
                <Divider />
                <TouchableOpacity>
                    <View style={styles.alternativeContainer}>
                        <Text style={styles.textLeft}>修改密码</Text>
                        <Text style={styles.textRight}>
                            {" "}
                            <Icon
                                style={styles.icon}
                                fill="#8F9BB3"
                                name="arrow-ios-forward-outline"
                            />
                        </Text>
                    </View>
                </TouchableOpacity>

                <Divider />

                <Button style={styles.button} status="danger">
                    退出当前账号
                </Button>
            </Layout>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        width: screenWidth,
        height: screenHeight / 16,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: { width: 4, height: 4 },
        shadowOpacity: 0.8,
        shadowRadius: 600,
        elevation: 10,
        textAlign: "center",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    avatar: {
        width: screenWidth,
        height: screenHeight / 6,
        alignItems: "center",
        justifyContent: "center",
    },
    container: {
        flex: 1,
        flexDirection: "column",
    },
    layout: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    avatarImg: {
        width: 100,
        height: 100,
    },
    button: {
        margin: 2,
        borderBottomWidth: 1,
        borderTopWidth: 1,
    },
    alternativeContainer: {
        borderRadius: 4,
        marginVertical: 2,
        padding: 5,
        flexDirection: "row",
    },
    textLeft: {
        margin: 2,
        fontSize: 18,
        flex: 1,
        textAlign: "left",
    },
    textRight: {
        margin: 2,
        fontSize: 18,
        flex: 1,
        textAlign: "right",
    },
    icon: {
        width: 16,
        height: 16,
    },
    button: {
        borderRadius: 0,
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
});
