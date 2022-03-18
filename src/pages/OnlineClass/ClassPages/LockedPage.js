import React, { Component } from "react";
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    TextInput,
} from "react-native";
import http from "../../../utils/http/request";
import RenderHTML from "react-native-render-html";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import Answer_single from "./Answer_type/Answer_single";
import RadioList from "./Utils/RadioList";
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
import Checkbox from "./Utils/Checkbox";
import HTMLView from "react-native-htmlview";
import { Icon } from "react-native-elements";
import ImageHandler from "../../../utils/Camera/Camera";

export default class LockedPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            html: {
                html: `
            <p style='text-align:center;'>
                Hello World!
            </p>`,
            },
            visible: false,
            msg: "",
            moduleVisible: false,
        };
    }
    componentDidMount() {
        this.getHTML();
    }
    getHTML = () => {
        const { messageList, ipAddress } = this.props;
        const event = messageList[0];
        const { period } = event;
        let resURL =
            "http://" +
            ipAddress +
            ":8901" +
            "/html" +
            period.links +
            "/" +
            period.resourceId +
            "Show.html";
        console.log(resURL);
        console.log(period);
        http.get(resURL)
            .then((resStr) => {
                // Toast.showDangerToast(resStr);
                this.setState({ html: { html: resStr } });
                // console.log(resJson);
            })
            .catch((error) => {
                Toast.showDangerToast(error.toString());
            });
    };

    //默认弹框不显示，以及需要把弹窗效果加在的地方的  相机图片  显示
    renderAvatar = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ moduleVisible: true });
                }}
            >
                <Image
                    style={{ width: 30, height: 30 }}
                    source={require("../../../assets/image3/camera.png")}
                ></Image>
            </TouchableOpacity>
        );
    };

    renderInputArea = () => {
        return (
            <View>
                <View
                    style={{
                        backgroundColor: "#000000",
                        height: 1,
                        width: "100%",
                    }}
                ></View>
                <View style={styles.inputArea}>
                    <Text
                        onPress={() => this.setState({ msg: "" })}
                        style={{ color: "#B68459" }}
                    >
                        删除
                    </Text>
                    <TextInput
                        placeholder="请输入答案！"
                        multiline
                        style={{
                            width: 500,
                            backgroundColor: "#FFFFFF",
                            height: 40,
                        }}
                        value={this.state.msg}
                        onChangeText={(text) => this.setState({ msg: text })}
                    ></TextInput>
                    {/* 拍照答题功能弹窗 */}
                    <OverflowMenu
                        anchor={this.renderAvatar}
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
                    <Button
                        title="保存"
                        onPress={() => alert("点了保存")}
                        style={{ width: 100, height: 35 }}
                    ></Button>
                </View>
            </View>
        );
    };

    renderOption = () => {
        const { messageList } = this.props;
        const event = messageList[0];
        const { period } = event;
        let optionBar = <RadioList ChoiceList={period.questionValueList} />;
        if (period.questionTypeName === "多项选择题") {
            optionBar = <Checkbox ChoiceList={period.questionValueList} />;
        } else if (period.questionTypeName === "填空题") {
            optionBar = this.renderInputArea();
        }
        return optionBar;
    };

    renderSAQ = () => {
        const { messageList, userName, introduction, imgURL } = this.props;
        const event = messageList[0];
        const { period } = event;
        const questionParams = {
            numid: "",
            questionTypeName: "单选题",
            questionId: "PRQUI9001144045",
            baseTypeId: "",
            questionName: "", //题目名称
            questionChoiceList: period.questionValueList, //题目选项
            questionContent: "", //题目内容
            answer: "B",
        };
        return (
            <Layout style={styles.mainContainer}>
                <Layout style={styles.header}>
                    <Layout style={styles.header_left}>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({ visible: true });
                            }}
                        >
                            <Icon name="cast" />
                        </TouchableOpacity>
                    </Layout>
                    <Layout style={styles.header_middle}>
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                    <Layout style={styles.header_right}>
                        <Button>提交</Button>
                    </Layout>
                </Layout>
                <Layout style={styles.body}>
                    <ScrollView>
                        <HTMLView value={this.state.html.html} />
                    </ScrollView>
                </Layout>
                <Layout style={styles.bottom}>{this.renderOption()}</Layout>

                <Modal
                    visible={this.state.visible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setVisible(false)}
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
        return (
            <View>{this.renderSAQ()}</View>
            // <ScrollView>
            //     <HTMLView value={this.state.html.html} />
            //     {/* <RenderHTML
            //         contentWidth={screenWidth}
            //         source={this.state.html}
            //     /> */}
            // </ScrollView>
        );
    }
}
