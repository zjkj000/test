import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ScrollView,
} from "react-native";
import {
    Button,
    Layout,
    Modal,
    Card,
    OverflowMenu,
    MenuItem,
    Input,
} from "@ui-kitten/components";
import SpliteLine from "../../../../utils/SpliteLine/SpliteLine";
import { styles } from "../../styles";
import Item from "@ant-design/react-native/lib/list/ListItem";
import { Badge } from "react-native-elements/dist/badge/Badge";
import http from "../../../../utils/http/request";
import Toast from "../../../../utils/Toast/Toast";

export default class AskAndMark extends Component {
    constructor(props) {
        super(props);
        this.state = {
            flgVisible: false,
            askVisible: false,
            flagList: [],
            askList: [],
            askValue: "",
            flagValue: "",
        };
        this.getAskFlag(1);
        this.getAskFlag(2);
    }
    componentDidUpdate(prevProps) {
        if (
            prevProps.resId !== this.props.resId ||
            prevProps.taskId !== this.props.taskId
        ) {
            this.getAskFlag(1);
            this.getAskFlag(2);
        }
    }
    handleSaveAskFlag = (type) => {
        // type 为1 表示保存flag， 为2 表示ask
        const { ipAddress, messageList, introduction, userName, periodNow } =
            this.props;
        const event = messageList[0];
        const { period } = event;
        const { askValue, flagValue, askList, flagList } = this.state;
        console.log("handleSaveAskFlag====================================");
        console.log(period);
        console.log(periodNow);
        console.log("====================================");
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_saveExploreStuRecordByRN.do";
        // const url =
        //     "http://" +
        //     "192.168.1.81" +
        //     ":8222" +
        //     "/KeTangServer/ajax/ketang_saveExploreStuRecordByRN.do";
        let params = {
            stuId: userName,
            stuName: introduction,
            taskId: period.id,
            taskName: period.name,
            resourceId: periodNow.resourceId,
            resourceName: periodNow.name,
            type: type,
            content: type === 1 ? flagValue : askValue,
            version: 3,
        };
        console.log(url);
        console.log(params);
        http.post(url, params)
            .then((res) => {
                if (res.success) {
                    Toast.showSuccessToast("保存成功", 500);
                    if (type === 1) {
                        this.setState({
                            flagList: [...flagList, flagValue],
                            flagValue: "",
                        });
                    } else {
                        this.setState({
                            askList: [...askList, askValue],
                            askValue: "",
                        });
                    }
                } else {
                    Toast.showWarningToast(res.message);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("保存失败：" + error.toString());
            });
    };
    getAskFlag = (type) => {
        // type 为1 表示获取flag， 为2 表示ask
        const { ipAddress, userName, periodNow, messageList } = this.props;
        const event = messageList[0];
        const { period } = event;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_getExploreStuRecordList.do";
        const params = {
            stuId: userName,
            resId: periodNow.resourceId,
            taskId: period.id,
            type: type,
            version: 3,
        };
        console.log("getAskFlag====================================");
        console.log(url);
        console.log(params);
        console.log("====================================");
        http.post(url, params).then((res) => {
            if (!res.success) {
                Toast.showWarningToast(res.message, 1000);
            } else {
                let flagList = res.data.map((item) => item.content);
                let askList = res.data.map((item) => item.content);
                if (type === 1) {
                    this.setState({ flagList });
                } else {
                    this.setState({ askList });
                }
            }
        });
    };
    render() {
        return (
            <>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ flgVisible: true });
                    }}
                >
                    <Text style={styles.myBadge}>
                        {this.state.flagList.length}
                    </Text>
                    <Image
                        style={styles.flgImg}
                        source={require("../../../../assets/classImg/flag.png")}
                    />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => {
                        this.setState({ askVisible: true });
                    }}
                >
                    <Text style={styles.myBadge}>
                        {this.state.askList.length}
                    </Text>
                    <Image
                        style={styles.askImg}
                        source={require("../../../../assets/classImg/ask.png")}
                    />
                </TouchableOpacity>
                <Modal
                    visible={this.state.flgVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({ flgVisible: false })}
                >
                    <View style={styles.myCard}>
                        <Text style={styles.cardTitle}>添加标记</Text>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Input
                                style={styles.cardInput}
                                value={this.state.flagValue}
                                onChangeText={(nextValue) => {
                                    this.setState({ flagValue: nextValue });
                                }}
                            ></Input>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <ScrollView style={styles.cardHistoryList}>
                                {this.state.flagList.map((item, index) => {
                                    return (
                                        <Text key={`flg-${index}`}>{`${
                                            index + 1
                                        }. ${item}`}</Text>
                                    );
                                })}
                            </ScrollView>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Button
                                onPress={() =>
                                    this.setState({ flgVisible: false })
                                }
                                appearance={"ghost"}
                            >
                                取消
                            </Button>
                            <Button
                                onPress={() => this.handleSaveAskFlag(1)}
                                appearance={"ghost"}
                            >
                                保存
                            </Button>
                        </Layout>
                    </View>
                </Modal>
                <Modal
                    visible={this.state.askVisible}
                    backdropStyle={styles.backdrop}
                    onBackdropPress={() => this.setState({ askVisible: false })}
                >
                    <View style={styles.myCard}>
                        <Text style={styles.cardTitle}>添加问题</Text>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Input
                                style={styles.cardInput}
                                value={this.state.askValue}
                                onChangeText={(nextValue) => {
                                    this.setState({ askValue: nextValue });
                                }}
                            ></Input>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <ScrollView style={styles.cardHistoryList}>
                                {this.state.askList.map((item, index) => {
                                    return (
                                        <Text key={`ask-${index}`}>{`${
                                            index + 1
                                        }. ${item}`}</Text>
                                    );
                                })}
                            </ScrollView>
                        </Layout>
                        <SpliteLine lineHeight={1} style={{ margin: 2 }} />
                        <Layout style={styles.cardBar}>
                            <Button
                                onPress={() =>
                                    this.setState({ askVisible: false })
                                }
                                appearance={"ghost"}
                            >
                                取消
                            </Button>
                            <Button
                                onPress={() => this.handleSaveAskFlag(2)}
                                appearance={"ghost"}
                            >
                                保存
                            </Button>
                        </Layout>
                    </View>
                </Modal>
            </>
        );
    }
}
