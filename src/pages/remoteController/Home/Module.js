import { Icon, Layout, Modal, Button } from "@ui-kitten/components";
import React, { Component } from "react";
import { TouchableOpacity, View, Text, Image } from "react-native";
// import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "./styles";
import http from "../../../utils/http/request";
import Toast from "../../../utils/Toast/Toast";
import Img_arr from "./Img_arr";
import theme from "../../../theme/custom-theme.json";
import { GetSize } from "../../../utils/Screen/GetSize";

export default class Module extends Component {
    constructor(props) {
        super(props);
        this.state = {
            questionModalVisible: false,
            singleQuestionNum: 4,
            mulQuestionNum: 4,
            questionOption: [
                [0, 0],
                [0, 0],
            ],
            pressIndex: -1,
            questionTypeIndex: -1,
        };
    }
    handlePress = (index) => {
        // moduleButton = [0, 0, 0];
        // moduleButton[index] = 1;
        this.props.setModuleButton(index, 1);
        this.setState({ pressIndex: index });
        this.setState({ questionModalVisible: true });
    };
    handleQuestionChange = (option, optionNum) => {
        // console.log("handleQuestionChange====================================");
        // console.log(option);
        let x =
            optionNum === "single"
                ? this.state.singleQuestionNum
                : this.state.mulQuestionNum;
        x += option;
        if (optionNum === "single") {
            if (x < 2) x = 2;
        } else if (optionNum === "mul") if (x < 3) x = 3;
        if (x > 6) x = 6;
        // console.log(x);
        // console.log("====================================");
        if (optionNum === "single") {
            this.setState({ singleQuestionNum: x });
        } else {
            this.setState({ mulQuestionNum: x });
        }
    };
    remoteControl = (action, actionType, desc = "") => {
        const { ipAddress, resId, resPath, learnPlanId, resRootPath } =
            this.props;
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
        // params = { messageJson: JSON.stringify(params) };
        http.post(url, params, false, false)
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
    handleConfirm = (index = -1) => {
        const {
            questionTypeIndex,
            singleQuestionNum,
            mulQuestionNum,
            pressIndex,
        } = this.state;
        let desc = "";
        let actionType = "questionAnswer";
        let action =
            pressIndex === 0
                ? "answerTogether"
                : pressIndex === 1
                ? "answerRandom"
                : "answerResponder";

        switch (questionTypeIndex) {
            case 0:
                desc = `1_${singleQuestionNum}`;
                break;
            case 1:
                desc = `2_${mulQuestionNum}`;
                break;
            case 2:
                desc = `3_0`;
                break;
            case 3:
                desc = `4_0`;
                break;
        }
        if (this.props.buttonType === "openQuestion") {
            desc = `1_4`;
            if (index !== -1) {
                this.props.setModuleButton(index, 1);
                this.setState({ pressIndex: index });
                action =
                    index === 0
                        ? "answerTogether"
                        : pressIndex === 1
                        ? "answerRandom"
                        : "answerResponder";
            }
        }
        this.setState({ questionModalVisible: false });
        this.props.setInfoButtonType(pressIndex);
        this.remoteControl(action, actionType, desc);
    };
    renderQuestionOption = () => {
        const { questionOption, singleQuestionNum, mulQuestionNum } =
            this.state;
        return questionOption.map((item1, index1) => {
            return (
                <>
                    <View
                        key={`questionRow-${index1}`}
                        style={styles.questionOptionRow}
                    >
                        {item1.map((item2, index2) => {
                            return (
                                <View
                                    key={`questionOption-${index2}`}
                                    style={styles.questionOption}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            let { questionOption } = this.state;
                                            questionOption = [
                                                [0, 0],
                                                [0, 0],
                                            ];
                                            questionOption[index1][index2] = 1;
                                            this.setState({
                                                questionTypeIndex:
                                                    index1 * 2 + index2,
                                                questionOption: questionOption,
                                            });
                                        }}
                                    >
                                        <Image
                                            style={styles.questionOptionImg}
                                            source={
                                                Img_arr["questionOption"][
                                                    `png${
                                                        index1 * 2 + index2
                                                    }_${item2}`
                                                ]
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                            );
                        })}
                    </View>
                    {index1 === 0 ? (
                        <View style={styles.questionNumRow}>
                            <View style={styles.questionNumBlock}>
                                <TouchableOpacity
                                    onPress={() => {
                                        // console.log("我被点了");
                                        // console.log(
                                        //     "ModuleRender===================================="
                                        // );
                                        // console.log(this.props);
                                        // console.log(
                                        //     "===================================="
                                        // );
                                        this.handleQuestionChange(-1, "single");
                                    }}
                                >
                                    <View style={styles.questionButton}>
                                        <Icon
                                            style={{
                                                height: GetSize(32),
                                                width: GetSize(32),
                                            }}
                                            fill={theme["color-primary-500"]}
                                            name={"minus"}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.questionNum}>
                                    {singleQuestionNum}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.handleQuestionChange(1, "single");
                                    }}
                                >
                                    <View style={styles.questionButton}>
                                        <Icon
                                            style={{
                                                height: GetSize(32),
                                                width: GetSize(32),
                                            }}
                                            fill={theme["color-primary-500"]}
                                            name={"plus"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styles.questionNumBlock}>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.handleQuestionChange(-1, "mul");
                                    }}
                                >
                                    <View style={styles.questionButton}>
                                        <Icon
                                            style={{
                                                height: GetSize(32),
                                                width: GetSize(32),
                                            }}
                                            fill={theme["color-primary-500"]}
                                            name={"minus"}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <Text style={styles.questionNum}>
                                    {mulQuestionNum}
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        this.handleQuestionChange(1, "mul");
                                    }}
                                >
                                    <View style={styles.questionButton}>
                                        <Icon
                                            style={{
                                                height: GetSize(32),
                                                width: GetSize(32),
                                            }}
                                            fill={theme["color-primary-500"]}
                                            name={"plus"}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) : (
                        <>
                            <View style={styles.questionNumRow}>
                                <View
                                    style={{
                                        ...styles.questionNumBlock,
                                        justifyContent: "space-around",
                                    }}
                                >
                                    <Text style={styles.questionNum}>判断</Text>
                                    <Text style={styles.questionNum}>录入</Text>
                                </View>
                            </View>
                            <View style={styles.questionNumRow}>
                                <View
                                    style={{
                                        ...styles.questionNumBlock,
                                        justifyContent: "space-around",
                                    }}
                                >
                                    <Button
                                        size={"small"}
                                        style={{
                                            borderRadius: 15,
                                            borderWidth: 0,
                                            backgroundColor:
                                                theme["color-primary-500"],
                                        }}
                                        onPress={() => {
                                            this.handleConfirm();
                                        }}
                                    >
                                        开始作答
                                    </Button>
                                    <Button
                                        size={"small"}
                                        style={{
                                            borderRadius: 15,
                                            borderWidth: 0,
                                            backgroundColor: "gray",
                                        }}
                                        onPress={() => {
                                            this.props.setModuleButton(-1);
                                            this.setState({
                                                questionModalVisible: false,
                                                pressIndex: -1,
                                            });
                                        }}
                                    >
                                        取消
                                    </Button>
                                </View>
                            </View>
                        </>
                    )}
                </>
            );
        });
    };
    renderModuleButton = () => {
        const { moduleButton } = this.props;
        return (
            <Layout style={styles.buttonZone}>
                {moduleButton.map((item, index) => {
                    return (
                        <TouchableOpacity
                            key={`moduleButton${index}`}
                            onPress={() => {
                                if (this.props.buttonType === "openQuestion") {
                                    this.handleConfirm(index);
                                } else {
                                    this.handlePress(index);
                                }
                            }}
                        >
                            <Image
                                style={styles.buttonImg}
                                source={
                                    Img_arr["moduleButton"][
                                        `png${index}_${item}`
                                    ]
                                }
                            />
                        </TouchableOpacity>
                    );
                })}
                <Modal
                    visible={this.state.questionModalVisible}
                    backdropStyle={styles.backdrop}
                >
                    <View style={styles.questionCard}>
                        {this.renderQuestionOption()}
                    </View>
                </Modal>
            </Layout>
        );
    };
    render() {
        return this.renderModuleButton();
    }
}
