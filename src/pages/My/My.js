import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableWithoutFeedback,
    TouchableOpacity,
} from "react-native";
// import { Avatar } from "react-native-elements";
import {
    Avatar,
    Layout,
    Button,
    Divider,
    Input,
    Icon,
    OverflowMenu,
    MenuItem,
    Modal,
    Card,
} from "@ui-kitten/components";
import http from "../../utils/http/request";
import ImageHandler from "../../utils/Camera/Camera";
import { styles } from "./styles";

const AlertIcon = (props) => <Icon {...props} name="alert-circle-outline" />;
import { useNavigation } from "@react-navigation/native";

export default function MyPage() {
    const navigation = useNavigation();
    return <MyPageComponent navigation={navigation} />;
}

class MyPageComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imgURL: "",
            value: "",
            hasAvatar: false,
            userName: "小明",
            userCn: "",
            selectedTitle: "No items selected",
            moduleVisible: false,
            fullModuleVisible: false,
            password: "",
            secureTextEntry: true,
        };
    }
    setValue = (value) => {
        this.setState({
            value,
        });
    };

    UNSAFE_componentWillMount() {
        this.setState({
            userName: global.constants.userName,
            userCn: global.constants.userCn,
        });
    }
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
                            : require("../../assets/image/bottomWave.jpg")
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

    toggleSecureEntry = () => {
        this.setState({ secureTextEntry: !this.state.secureTextEntry });
    };

    //密码显隐图标
    renderEyeIcon = (props) => (
        <TouchableWithoutFeedback onPress={this.toggleSecureEntry}>
            <Icon
                {...props}
                name={this.state.secureTextEntry ? "eye-off" : "eye"}
            />
        </TouchableWithoutFeedback>
    );

    //提示密码alert
    renderPasswordCaption = () => {
        return (
            <View style={styles.captionContainer}>
                {AlertIcon(styles.captionIcon)}
                <Text style={styles.captionText}>请输入密码 </Text>
            </View>
        );
    };
    logout = () => {
        const { navigation } = this.props;
        navigation.navigate("Login");
    };

    handleCamera = () => {
        ImageHandler.handleCamera().then((res) => {
            if (res) {
                this.setState({
                    imgURL: res.uri,
                    hasAvatar: true,
                    moduleVisible: false,
                });
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
                    hasAvatar: true,
                    moduleVisible: false,
                });
            } else {
                // TODO: 获取图像失败
            }
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
                            {this.state.userCn +
                                "(" +
                                this.state.userName +
                                ")"}
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
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ fullModuleVisible: true });
                    }}
                >
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
                <TouchableOpacity
                    onPress={() => {
                        this.props.navigation.navigate({
                            name: "Select_subject",
                            params: {
                                type: "new", //区别是新进去的还是选完进去的
                            },
                        });
                    }}
                >
                    <View style={styles.alternativeContainer}>
                        <Text style={styles.textLeft}>选科中心</Text>
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
                <Button
                    style={styles.button}
                    status="danger"
                    onPress={this.logout}
                >
                    退出当前账号
                </Button>

                {/* 修改密码弹出框 */}
                <Modal
                    visible={this.state.fullModuleVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => {
                        this.setState({ fullModuleVisible: false });
                    }}
                >
                    <Card style={styles.myCard} disabled={true}>
                        <Input
                            label={<Text>原密码</Text>}
                            style={styles.cardInput}
                            value={this.state.password}
                            placeholder="请输入原密码"
                            accessoryLeft={<Icon name="lock" />}
                            accessoryRight={this.renderEyeIcon}
                            secureTextEntry={this.state.secureTextEntry}
                            onChangeText={(nextValue) =>
                                this.setState({ password: nextValue })
                            }
                        />
                        <Input
                            label={<Text>新密码</Text>}
                            style={styles.cardInput}
                            value={this.state.password}
                            placeholder="请输入新密码"
                            accessoryLeft={<Icon name="lock" />}
                            accessoryRight={this.renderEyeIcon}
                            secureTextEntry={this.state.secureTextEntry}
                            onChangeText={(nextValue) =>
                                this.setState({ password: nextValue })
                            }
                        />
                        <Input
                            label={<Text>确认密码</Text>}
                            style={styles.cardInput}
                            value={this.state.password}
                            placeholder="请确认新密码"
                            accessoryLeft={<Icon name="lock" />}
                            accessoryRight={this.renderEyeIcon}
                            secureTextEntry={this.state.secureTextEntry}
                            onChangeText={(nextValue) =>
                                this.setState({ password: nextValue })
                            }
                        />
                        <Layout style={styles.buttonContainer}>
                            <Button
                                style={styles.cardButton}
                                status="danger"
                                onPress={() => {
                                    this.setState({ fullModuleVisible: false });
                                }}
                            >
                                取 消
                            </Button>
                            <Button
                                style={styles.cardButton}
                                status="primary"
                                onPress={() => {}}
                            >
                                确认修改
                            </Button>
                        </Layout>
                    </Card>
                </Modal>
            </Layout>
        );
    }
}
