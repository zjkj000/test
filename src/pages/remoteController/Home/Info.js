import { Icon, Layout, Modal, Button } from "@ui-kitten/components";
import React, { Component } from "react";
import { View, Text, Image, Dimensions, StatusBar } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "./styles";
import http from "../../../utils/http/request";
import Toast from "../../../utils/Toast/Toast";
import Img_arr from "./Img_arr";

export default class Info extends Component {
    constructor(props) {
        super(props);
        this.state = {
            infoButtonTouchable: [
                [
                    { touchable: 1, status: "" },
                    { touchable: 1, status: "obj" },
                ],
                [
                    { touchable: 1, status: "" },
                    { touchable: 1, status: "" },
                ],
            ],
            infoMessage: "请在左侧选择互动模式",
            questionAnalysisVisible: false,
        };
    }
    // componentDidMount = () => {
    //     const width = Dimensions.get("window").height;
    //     const width2 = Dimensions.get("screen").height;
    //     const width3 = StatusBar.currentHeight;
    //     console.log("屏幕高度", width, width2, width3);
    // };
    setInfoButton = (row, col, touchable = 1, status = "") => {
        let { infoButtonTouchable } = this.state;
        infoButtonTouchable[row][col].touchable = touchable;
        infoButtonTouchable[row][col].status = status;
        // console.log("SetInfoButton====================================");
        // console.log(infoButtonTouchable);
        // console.log("====================================");
        this.setState({ infoButtonTouchable });
    };
    setInfoMessage = (str) => {
        this.setState({ infoMessage: str });
    };
    componentDidUpdate(preProps, preState) {
        if (preProps.action !== this.props.action) {
            switch (this.props.action) {
                case "AnswerTogetherStartObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 1, "obj");
                            this.setInfoButton(1, 0, 1, "");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("正在作答中");
                            break;
                    }
                    this.props.setInfoButtonType(0);
                    break;
                case "AnswerTogetherStopObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "re");
                            this.setInfoButton(0, 1, 1, "obj");
                            this.setInfoButton(1, 0, 1, "");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("作答结束");
                            break;
                    }
                    this.props.setInfoButtonType(0);
                    break;
                case "AnswerTogetherStartHand":
                case "AnswerTogetherStartSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 1, "sub");
                            this.setInfoButton(1, 0, 1, "");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("正在作答中");
                            break;
                    }
                    this.props.setInfoButtonType(0);
                    break;
                case "AnswerTogetherStopHand":
                case "AnswerTogetherStopSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "re");
                            this.setInfoButton(0, 1, 1, "sub");
                            this.setInfoButton(1, 0, 1, "");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("作答结束");
                            break;
                    }
                    this.props.setInfoButtonType(0);
                    break;
                case "RandomObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "obj");
                            this.setInfoButton(1, 1, 0, "");
                            this.setInfoMessage("正在随机...");
                            break;
                    }
                    this.props.setInfoButtonType(1);
                    break;
                case "RandomPeopleObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "obj");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage(`${this.props.desc}`);
                            break;
                    }
                    this.props.setInfoButtonType(1);
                    break;
                case "RandomAnswerObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 1, "");
                            this.setInfoButton(1, 0, 1, "obj");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage(
                                `回显学生答案${this.props.desc}`
                            );
                            break;
                    }
                    this.props.setInfoButtonType(1);
                    break;
                case "RandomHand":
                case "RandomSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "sub_open");
                            this.setInfoButton(1, 1, 0, "");
                            this.setInfoMessage("正在随机...");
                            break;
                    }
                    this.props.setInfoButtonType(1);
                    break;
                case "RandomPeopleHand":
                case "RandomPeopleSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "sub_open");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage(`${this.props.desc}`);
                            break;
                    }
                    this.props.setInfoButtonType(1);
                    break;
                case "RandomAnswerSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 1, "");
                            this.setInfoButton(1, 0, 1, "sub_open");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("学生答案以提交");
                            break;
                    }
                    this.props.setInfoButtonType(1);
                    break;
                case "RandomPeopleHandShowStuAnswer":
                case "RandomAnswerSubjectiveShowStuAnswer":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 1, "sub_close");
                            this.setInfoButton(1, 1, 0, "");
                            this.setInfoMessage("学生答案以提交");
                            break;
                    }
                    this.props.setInfoButtonType(1);
                    break;
                case "ResponderReadyObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "obj");
                            this.setInfoButton(1, 1, 0, "");
                            this.setInfoMessage("正在抢答...");
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "obj");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("正在抢答...");
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderPeopleObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "obj");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage(`${this.props.desc}`);
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderAnswerObjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 1, "");
                            this.setInfoButton(1, 0, 1, "obj");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage(
                                `回显学生答案${this.props.desc}`
                            );
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderReadyHand":
                case "ResponderReadySubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "sub_open");
                            this.setInfoButton(1, 1, 0, "");
                            this.setInfoMessage("正在抢答...");
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderHand":
                case "ResponderSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "sub_open");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("正在抢答...");
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderPeopleHand":
                case "ResponderPeopleSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 0, "sub_open");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage(`${this.props.desc}`);
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderAnswerSubjective":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 1, "");
                            this.setInfoButton(0, 1, 1, "");
                            this.setInfoButton(1, 0, 1, "sub_open");
                            this.setInfoButton(1, 1, 1, "");
                            this.setInfoMessage("学生答案以提交");
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
                case "ResponderPeopleHandShowStuAnswer":
                case "ResponderAnswerSubjectiveShowStuAnswer":
                    switch (this.props.resId) {
                        default:
                            this.setInfoButton(0, 0, 0, "");
                            this.setInfoButton(0, 1, 0, "");
                            this.setInfoButton(1, 0, 1, "sub_close");
                            this.setInfoButton(1, 1, 0, "");
                            this.setInfoMessage("学生答案以提交");
                            break;
                    }
                    this.props.setInfoButtonType(2);
                    break;
            }
        }
    }
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
            resId: "",
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
                console.log(
                    "ControllerSender===================================="
                );
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
                console.log(
                    "ControllerSender===================================="
                );
                console.log(params);
                console.log("actionType: " + actionType);
                console.log("action: " + action);
                console.log("Failed Because: " + error.toString);
                console.log("====================================");
            });
    };
    //NormalQuestion Controller
    stopQuestion = () => {
        this.remoteControl("stopAnswer", "questionAnswer");
        this.setInfoButton(0, 0, 1, "re");
    };
    restartQuestion = () => {
        this.remoteControl("answerAgain", "questionAnswer");
        this.setInfoButton(0, 0, 1, "");
    };
    analysisObject = () => {
        this.remoteControl("dtfx", "questionAnswer");
        // this.setState({ questionAnalysisVisible: true });
    };
    analysisSubject = () => {
        this.remoteControl("dtxq", "questionAnswer");
        // this.setState({ questionAnalysisVisible: true });
    };
    showAnswer = () => {
        this.remoteControl("danr", "questionAnswer");
    };
    closeQuestion = () => {
        this.remoteControl("closeAnswerWindow", "questionAnswer");
    };

    //RandomQuestion Controller
    reRandom = () => {
        this.remoteControl("randomAgain", "questionAnswer");
    };
    thumbUp = () => {
        this.remoteControl("dz", "questionAnswer");
    };
    // closeQuestion
    openStuAnswer = () => {
        this.remoteControl("openStuAnswer", "questionAnswer");
    };
    closeStuAnswer = () => {
        this.remoteControl("closeStuAnswer", "questionAnswer");
    };
    setAnswer = () => {
        const { ipAddress } = this.props;
        // 第一步：获取题目类型以及选项个数
        const url =
            "http://" + ipAddress + "/KeTangServer/ajax/hwp_getQueInfo.do";
        http.get(url)
            .then((res) => {
                console.log("setAnswerRes====================================");
                console.log(res);
                console.log("====================================");
            })
            .catch((error) => {
                console.log(
                    "setAnswerError===================================="
                );
                console.log(error);
                console.log("====================================");
            });
    };

    //RushQuestion Controller
    reRush = () => {
        this.remoteControl("responderAgain", "questionAnswer");
    };
    //thumbUp
    //closeQuestion
    //openStuAnswer
    //closeStuAnswer
    //setAnswer

    handlePress = (row, col) => {
        let { infoButtonType } = this.props;
        let { infoButtonTouchable } = this.state;
        if (row === 0 && col === 0) {
            switch (infoButtonType) {
                case "normalQuestion":
                    if (infoButtonTouchable[row][col].status === "re")
                        this.restartQuestion();
                    else this.stopQuestion();
                    break;
                case "randomQuestion":
                    if (infoButtonTouchable[row][col].status === "re")
                        this.reRandom();
                    else this.stopQuestion();
                    break;
                case "rushQuestion":
                    if (infoButtonTouchable[row][col].status === "re")
                        this.reRush();
                    else this.stopQuestion();
                    break;
            }
        } else if (row === 0 && col === 1) {
            switch (infoButtonType) {
                case "normalQuestion":
                    if (infoButtonTouchable[row][col].status === "obj")
                        this.analysisObject();
                    else this.analysisSubject();
                    break;
                case "randomQuestion":
                    this.thumbUp();
                    break;
                case "rushQuestion":
                    this.thumbUp();
                    break;
            }
        } else if (row === 1 && col === 0) {
            switch (infoButtonType) {
                case "normalQuestion":
                    this.showAnswer();
                    break;
                case "randomQuestion":
                    if (infoButtonTouchable[row][col].status === "obj")
                        this.showAnswer();
                    else if (
                        infoButtonTouchable[row][col].status === "sub_open"
                    )
                        this.openStuAnswer();
                    else this.closeStuAnswer();
                    break;
                case "rushQuestion":
                    if (infoButtonTouchable[row][col].status === "obj")
                        this.showAnswer();
                    else if (
                        infoButtonTouchable[row][col].status === "sub_open"
                    )
                        this.openStuAnswer();
                    else this.closeStuAnswer();
                    break;
            }
        } else if (row === 1 && col === 1) {
            this.closeQuestion();
        }
    };
    // renderQuestionAnalysis = () => {
    //     return (
    //         <View style={styles.signPageMainContainer}>
    //             <TouchableOpacity>
    //                 <Image source={Img_arr["openWord"]["png0"]}></Image>
    //             </TouchableOpacity>
    //             <TouchableOpacity>
    //                 <Image source={Img_arr["openWord"]["png1"]}></Image>
    //             </TouchableOpacity>
    //             <TouchableOpacity>
    //                 <Image source={Img_arr["openWord"]["png2"]}></Image>
    //             </TouchableOpacity>
    //         </View>
    //     );
    // };
    renderInfo = () => {
        const { infoButtonTouchable, infoMessage } = this.state;
        const { infoButtonType } = this.props;
        if (infoButtonType === "default") {
            return (
                <Layout style={styles.infoZone}>
                    <Layout style={styles.infoZone_text}>
                        <Text style={{ fontSize: 18 }}>
                            请在左侧选择互动模式
                        </Text>
                    </Layout>
                </Layout>
            );
        } else {
            return (
                <Layout style={styles.infoZone}>
                    {infoButtonTouchable.map((item1, index1) => {
                        return (
                            <Layout
                                key={`infoRow-${index1}`}
                                style={styles.infoZone_row}
                            >
                                {item1.map((item2, index2) => {
                                    // console.log(
                                    //     "renderInfoButton===================================="
                                    // );
                                    // console.log(
                                    //     `png${index1 * 2 + index2}_${
                                    //         item2.touchable +
                                    //         (item2.status === ""
                                    //             ? ""
                                    //             : "_" + item2.status)
                                    //     }`
                                    // );
                                    // console.log(
                                    //     "===================================="
                                    // );
                                    const renderImg =
                                        Img_arr["infoImg"][infoButtonType][
                                            `png${index1 * 2 + index2}_${
                                                item2.touchable +
                                                (item2.status === ""
                                                    ? ""
                                                    : "_" + item2.status)
                                            }`
                                        ];
                                    if (item2) {
                                        return (
                                            <View
                                                style={styles.infoZone_button}
                                                key={`infoButton${index2}`}
                                            >
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.handlePress(
                                                            index1,
                                                            index2
                                                        );
                                                    }}
                                                >
                                                    <Image
                                                        style={
                                                            styles.infoZone_img
                                                        }
                                                        source={renderImg}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        );
                                    } else {
                                        return (
                                            <View
                                                style={styles.infoZone_button}
                                                key={`infoButton${index2}`}
                                            >
                                                <Image
                                                    style={styles.infoZone_img}
                                                    source={renderImg}
                                                />
                                            </View>
                                        );
                                    }
                                })}
                            </Layout>
                        );
                    })}
                    <Layout style={styles.infoZone_text}>
                        <Text style={{ fontSize: 18 }}>{infoMessage}</Text>
                    </Layout>
                    {/* <Modal visible={this.state.questionAnalysisVisible}>
                        {this.renderQuestionAnalysis()}
                    </Modal> */}
                </Layout>
            );
        }
    };
    render() {
        return this.renderInfo();
    }
}
