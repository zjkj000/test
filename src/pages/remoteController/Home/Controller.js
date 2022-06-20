import { Layout } from "@ui-kitten/components";
import React, { Component } from "react";
import { View, Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "./styles";
import http from "../../../utils/http/request";
import Toast from "../../../utils/Toast/Toast";
import Img_arr from "./Img_arr";

export default class Controller extends Component {
    constructor(props) {
        super(props);
        const scaleSize = 0.51;
        const scaleSizeBig = 0.54;

        this.state = {
            buttonArray: [
                {
                    imgList: [
                        {
                            index: "0",
                            blockStyles: {
                                ...styles.controllerBlock,
                                justifyContent: "flex-start",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 295 * scaleSizeBig,
                                height: 165 * scaleSizeBig,
                            },
                        },
                        {
                            index: "1",
                            blockStyles: {
                                ...styles.controllerBlock,
                                flex: 1,
                                justifyContent: "flex-end",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 376 * scaleSize,
                                height: 177 * scaleSize,
                            },
                        },
                        {
                            index: "2",
                            blockStyles: {
                                ...styles.controllerBlock,
                            },
                            blockStyles: {
                                ...styles.controllerBlock,
                                justifyContent: "flex-start",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 295 * scaleSizeBig,
                                height: 255 * scaleSizeBig,
                            },
                        },
                    ],
                },
                {
                    imgList: [
                        {
                            index: "3",
                            blockStyles: {
                                ...styles.controllerBlock,
                                flex: 1,
                                alignItems: "flex-start",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 93 * scaleSizeBig,
                                height: 236 * scaleSizeBig,
                            },
                        },
                        {
                            index: "4",
                            blockStyles: {
                                ...styles.controllerBlock,
                                alignItems: "flex-end",
                                flex: 2,
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 177 * scaleSize,
                                height: 376 * scaleSize,
                            },
                        },
                        {
                            index: "5",
                            blockStyles: {
                                ...styles.controllerBlock,
                                flex: 2,
                                alignItems: "center",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 242 * scaleSize,
                                height: 242 * scaleSize,
                            },
                        },
                        {
                            index: "6",
                            blockStyles: {
                                ...styles.controllerBlock,
                                alignItems: "flex-start",
                                flex: 3,
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 177 * scaleSize,
                                height: 376 * scaleSize,
                            },
                        },
                    ],
                },
                {
                    rowStyles: {},
                    imgList: [
                        {
                            index: "7",
                            blockStyles: {
                                ...styles.controllerBlock,
                                justifyContent: "flex-end",
                                alignItems: "center",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 295 * scaleSizeBig,
                                height: 165 * scaleSizeBig,
                            },
                        },
                        {
                            index: "8",
                            blockStyles: {
                                ...styles.controllerBlock,
                                flex: 1,
                                justifyContent: "flex-start",
                                alignItems: "center",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 376 * scaleSize,
                                height: 177 * scaleSize,
                            },
                        },
                        {
                            index: "9",
                            blockStyles: {
                                ...styles.controllerBlock,
                                justifyContent: "flex-end",
                                alignItems: "center",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: 295 * scaleSizeBig,
                                height: 255 * scaleSizeBig,
                            },
                        },
                    ],
                },
            ],
        };
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
            resId: resId ? resId : "",
            resPath: resPath ? resPath : null,
            learnPlanId: learnPlanId ? learnPlanId : null,
            resRootPath: resRootPath
                ? resRootPath
                : "C:/ZJKJ/SKYDT/zhihuiketang",
            desc: desc,
        };
        // params = { messageJson: JSON.stringify(params) };
        http.post(url, params)
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

    //Normal Controller
    getPreResource = (actionType) => {
        this.remoteControl("resUp", actionType);
    };
    getNextResource = (actionType) => {
        this.remoteControl("resDown", actionType);
    };
    closeResource = (actionType) => {
        this.remoteControl("close", actionType);
    };

    //Question Controller
    zoomQuestion = () => {
        this.remoteControl("changeSizeBig", "question");
    };
    narrowQuestion = () => {
        this.remoteControl("changeSizeSmall", "question");
    };
    showAnswer = () => {
        this.remoteControl("lookAnswer", "question");
    };
    hideAnswer = () => {
        this.remoteControl("lookAnswer", "question");
    };

    //PPt Controller
    prePagePPT = () => {
        this.remoteControl("prePage", "ppt");
    };
    nextPagePPT = () => {
        this.remoteControl("nextPage", "ppt");
    };
    playPPT = () => {
        this.remoteControl("play", "ppt");
    };
    exitPPT = () => {
        this.remoteControl("exit", "ppt");
    };
    preAction = () => {
        this.remoteControl("pre", "ppt");
    };
    nextAction = () => {
        this.remoteControl("next", "ppt");
    };

    //Word Controller
    zoomWord = () => {
        this.remoteControl("changeSizeUp", "word");
    };
    narrowWord = () => {
        this.remoteControl("changeSizeDown", "word");
    };
    prePageWord = () => {
        this.remoteControl("prePage", "word");
    };
    nextPageWord = () => {
        this.remoteControl("nextPage", "word");
    };
    mouseUp = () => {
        this.remoteControl("pre", "word");
    };
    mouseDown = () => {
        this.remoteControl("next", "word");
    };

    //VideoAndSound Controller
    forward = () => {
        this.remoteControl("go", "videoAndSound");
    };
    back = () => {
        this.remoteControl("back", "videoAndSound");
    };
    play = () => {
        this.remoteControl("start", "videoAndSound");
    };
    pause = () => {
        this.remoteControl("stop", "videoAndSound");
    };

    handlePress = (rowNum, colNum) => {
        const { actionType, buttonType } = this.props;
        switch (colNum) {
            case 0:
                switch (rowNum) {
                    case 0:
                        this.getPreResource(actionType);
                        break;
                    case 1:
                        this.closeResource(actionType);
                        break;
                    case 2:
                        this.getNextResource(actionType);
                        break;
                    default:
                        break;
                }
                break;
            case 1:
                switch (rowNum) {
                    case 0:
                        switch (actionType) {
                            case "ppt":
                                this.prePagePPT();
                                break;
                            case "word":
                                this.prePageWord();
                                break;
                            default:
                                break;
                        }
                        break;
                    case 1:
                        switch (actionType) {
                            case "ppt":
                                this.preAction();
                                break;
                            case "word":
                                this.mouseUp();
                                break;
                            case "videoAndSound":
                                this.back();
                                break;
                            default:
                                break;
                        }
                        break;
                    case 2:
                        switch (actionType) {
                            case "ppt":
                                this.nextPagePPT();
                                break;
                            case "word":
                                this.nextPageWord();
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                break;
            case 2:
                switch (rowNum) {
                    case 0:
                        switch (actionType) {
                            case "question":
                                this.zoomQuestion();
                                break;
                            case "word":
                                this.zoomWord();
                                break;
                            default:
                                break;
                        }
                        break;
                    case 1:
                        switch (actionType) {
                            case "question":
                                if (buttonType === "openQuestion")
                                    this.showAnswer();
                                else if (buttonType === "showQuestionAnswer")
                                    this.hideAnswer();
                                break;
                            case "ppt":
                                if (buttonType === "openPPT") this.playPPT();
                                else if (buttonType === "playPPT")
                                    this.exitPPT();
                                break;
                            case "videoAndSound":
                                if (buttonType === "play") this.play();
                                else if (buttonType === "pause") this.pause();
                                break;
                            default:
                                break;
                        }
                        break;
                    case 2:
                        switch (actionType) {
                            case "question":
                                this.narrowQuestion();
                                break;
                            case "word":
                                this.narrowWord();
                                break;
                            default:
                                break;
                        }
                    default:
                        break;
                }
                break;
            case 3:
                switch (rowNum) {
                    case 1:
                        switch (actionType) {
                            case "ppt":
                                this.nextAction();
                                break;
                            case "word":
                                this.mouseDown();
                                break;
                            case "videoAndSound":
                                this.forward();
                                break;
                            default:
                                break;
                        }
                        break;
                    default:
                        break;
                }
                break;
            default:
                break;
        }
    };

    renderButton = () => {
        // console.log("renderButton====================================");
        // console.log(this.props.buttonType);
        // console.log("================================================");
        const { buttonArray } = this.state;
        return buttonArray.map((item1, index1) => {
            return (
                <Layout
                    key={`controllerRow-${index1}`}
                    style={styles.controllerRow}
                >
                    {item1.imgList.map((item2, index2) => {
                        // console.log(item2);
                        const renderImg =
                            Img_arr[
                                this.props.buttonType
                                    ? this.props.buttonType
                                    : "default"
                            ][`png${item2.index}`];
                        if (renderImg[0] === 0) {
                            return (
                                <View
                                    key={`controllerBlock-${index2}`}
                                    style={{ ...item2.blockStyles }}
                                >
                                    <Image
                                        style={{ ...item2.styles }}
                                        source={renderImg[1]}
                                    ></Image>
                                </View>
                            );
                        } else {
                            return (
                                <View
                                    key={`controllerBlock-${index2}`}
                                    style={{ ...item2.blockStyles }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.handlePress(index1, index2);
                                        }}
                                    >
                                        <Image
                                            style={{ ...item2.styles }}
                                            source={renderImg[1]}
                                        ></Image>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    })}
                </Layout>
            );
        });
    };
    render() {
        return (
            <Layout style={styles.controllerContainer}>
                {this.renderButton()}
            </Layout>
        );
    }
}
