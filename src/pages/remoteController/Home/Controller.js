import { Layout } from "@ui-kitten/components";
import React, { Component } from "react";
import { View, Image, PixelRatio } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styles } from "./styles";
import http from "../../../utils/http/request";
import Toast from "../../../utils/Toast/Toast";
import Img_arr from "./Img_arr";
import { GetSize } from "../../../utils/Screen/GetSize";

export default class Controller extends Component {
    constructor(props) {
        super(props);
        const zoom = 1.1;
        this.state = {
            buttonArray: [
                {
                    imgList: [
                        {
                            index: "0",
                            blockStyles: {
                                ...styles.controllerBlock,
                                justifyContent: "flex-start",
                                alignItems: "flex-start",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(295 * zoom),
                                height: GetSize(165 * zoom),
                            },
                        },
                        {
                            index: "1",
                            blockStyles: {
                                ...styles.controllerBlock,
                                flex: 1,
                                justifyContent: "flex-end",
                                alignItems: "center",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(376 * zoom),
                                height: GetSize(177 * zoom),
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
                                alignItems: "flex-end",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(295 * zoom),
                                height: GetSize(255 * zoom),
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
                                width: GetSize(93 * zoom),
                                height: GetSize(236 * zoom),
                            },
                        },
                        {
                            index: "4",
                            blockStyles: {
                                ...styles.controllerBlock,
                                alignItems: "flex-end",
                                // flex: 2,
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(177 * zoom),
                                height: GetSize(376 * zoom),
                            },
                        },
                        {
                            index: "5",
                            blockStyles: {
                                ...styles.controllerBlock,
                                // flex: 2,
                                alignItems: "center",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(242 * zoom),
                                height: GetSize(242 * zoom),
                            },
                        },
                        {
                            index: "6",
                            blockStyles: {
                                ...styles.controllerBlock,
                                alignItems: "flex-start",
                                // flex: 3,
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(177 * zoom),
                                height: GetSize(376 * zoom),
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
                                alignItems: "flex-start",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(295 * zoom),
                                height: GetSize(165 * zoom),
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
                                width: GetSize(376 * zoom),
                                height: GetSize(177 * zoom),
                            },
                        },
                        {
                            index: "9",
                            blockStyles: {
                                ...styles.controllerBlock,
                                justifyContent: "flex-end",
                                alignItems: "flex-end",
                            },
                            styles: {
                                ...styles.controllerImg,
                                width: GetSize(295 * zoom),
                                height: GetSize(255 * zoom),
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
        const renderList = [
            buttonArray[0].imgList[1],
            buttonArray[1].imgList[1],
            buttonArray[1].imgList[2],
            buttonArray[1].imgList[3],
            buttonArray[2].imgList[1],
            buttonArray[0].imgList[0],
            buttonArray[0].imgList[2],
            buttonArray[1].imgList[0],
            buttonArray[2].imgList[0],
            buttonArray[2].imgList[2],
        ];
        console.log("renderTest====================================");
        console.log(renderList);
        console.log(PixelRatio.get());
        console.log("====================================");
        return (
            <Layout style={styles.controllerBox}>
                <Layout style={{ ...styles.controllerRow, zIndex: 10 }}>
                    <View style={{ ...renderList[5].blockStyles }}>
                        <TouchableOpacity
                            disabled={
                                Img_arr[
                                    this.props.buttonType
                                        ? this.props.buttonType
                                        : "default"
                                ][`png${renderList[5].index}`][0] === 0
                            }
                            onPress={() => {
                                this.handlePress(0, 0);
                            }}
                        >
                            <Image
                                source={
                                    Img_arr[
                                        this.props.buttonType
                                            ? this.props.buttonType
                                            : "default"
                                    ][`png${renderList[5].index}`][1]
                                }
                                style={{ ...renderList[5].styles }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ ...renderList[6].blockStyles }}>
                        <TouchableOpacity
                            disabled={
                                Img_arr[
                                    this.props.buttonType
                                        ? this.props.buttonType
                                        : "default"
                                ][`png${renderList[6].index}`][0] === 0
                            }
                            onPress={() => {
                                this.handlePress(0, 2);
                            }}
                        >
                            <Image
                                source={
                                    Img_arr[
                                        this.props.buttonType
                                            ? this.props.buttonType
                                            : "default"
                                    ][`png${renderList[6].index}`][1]
                                }
                                style={{ ...renderList[6].styles }}
                            />
                        </TouchableOpacity>
                    </View>
                </Layout>
                <Layout
                    style={{
                        ...styles.controllerRow,
                        flex: 25,
                        flexDirection: "column",
                    }}
                >
                    <Layout style={styles.controllerRow}>
                        <View style={{ ...renderList[0].blockStyles }}></View>
                        <View
                            style={{
                                ...renderList[0].blockStyles,
                                flex: 6,
                                flexDirection: "row",
                            }}
                        >
                            <View
                                style={{ ...renderList[0].blockStyles }}
                            ></View>
                            <View style={{ ...renderList[0].blockStyles }}>
                                <TouchableOpacity
                                    disabled={
                                        Img_arr[
                                            this.props.buttonType
                                                ? this.props.buttonType
                                                : "default"
                                        ][`png${renderList[0].index}`][0] === 0
                                    }
                                    onPress={() => {
                                        this.handlePress(0, 1);
                                    }}
                                >
                                    <Image
                                        source={
                                            Img_arr[
                                                this.props.buttonType
                                                    ? this.props.buttonType
                                                    : "default"
                                            ][`png${renderList[0].index}`][1]
                                        }
                                        style={{ ...renderList[0].styles }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{ ...renderList[0].blockStyles }}
                            ></View>
                        </View>
                        <View style={{ ...renderList[0].blockStyles }}></View>
                    </Layout>
                    <Layout style={styles.controllerRow}>
                        <View style={{ ...renderList[7].blockStyles }}>
                            <TouchableOpacity
                                disabled={
                                    Img_arr[
                                        this.props.buttonType
                                            ? this.props.buttonType
                                            : "default"
                                    ][`png${renderList[7].index}`][0] === 0
                                }
                                onPress={() => {
                                    this.handlePress(1, 0);
                                }}
                            >
                                <Image
                                    source={
                                        Img_arr[
                                            this.props.buttonType
                                                ? this.props.buttonType
                                                : "default"
                                        ][`png${renderList[7].index}`][1]
                                    }
                                    style={{ ...renderList[7].styles }}
                                />
                            </TouchableOpacity>
                        </View>
                        <View
                            style={{
                                ...renderList[0].blockStyles,
                                flex: 6,
                                flexDirection: "row",
                            }}
                        >
                            <View style={{ ...renderList[1].blockStyles }}>
                                <TouchableOpacity
                                    disabled={
                                        Img_arr[
                                            this.props.buttonType
                                                ? this.props.buttonType
                                                : "default"
                                        ][`png${renderList[1].index}`][0] === 0
                                    }
                                    onPress={() => {
                                        this.handlePress(1, 1);
                                    }}
                                >
                                    <Image
                                        source={
                                            Img_arr[
                                                this.props.buttonType
                                                    ? this.props.buttonType
                                                    : "default"
                                            ][`png${renderList[1].index}`][1]
                                        }
                                        style={{ ...renderList[1].styles }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...renderList[2].blockStyles }}>
                                <TouchableOpacity
                                    disabled={
                                        Img_arr[
                                            this.props.buttonType
                                                ? this.props.buttonType
                                                : "default"
                                        ][`png${renderList[2].index}`][0] === 0
                                    }
                                    onPress={() => {
                                        this.handlePress(1, 2);
                                    }}
                                >
                                    <Image
                                        source={
                                            Img_arr[
                                                this.props.buttonType
                                                    ? this.props.buttonType
                                                    : "default"
                                            ][`png${renderList[2].index}`][1]
                                        }
                                        style={{ ...renderList[2].styles }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View style={{ ...renderList[3].blockStyles }}>
                                <TouchableOpacity
                                    disabled={
                                        Img_arr[
                                            this.props.buttonType
                                                ? this.props.buttonType
                                                : "default"
                                        ][`png${renderList[3].index}`][0] === 0
                                    }
                                    onPress={() => {
                                        this.handlePress(1, 3);
                                    }}
                                >
                                    <Image
                                        source={
                                            Img_arr[
                                                this.props.buttonType
                                                    ? this.props.buttonType
                                                    : "default"
                                            ][`png${renderList[3].index}`][1]
                                        }
                                        style={{ ...renderList[3].styles }}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{ ...renderList[0].blockStyles }}></View>
                    </Layout>
                    <Layout style={styles.controllerRow}>
                        <View style={{ ...renderList[0].blockStyles }}></View>
                        <View
                            style={{
                                ...renderList[0].blockStyles,
                                flex: 6,
                                flexDirection: "row",
                            }}
                        >
                            <View
                                style={{ ...renderList[4].blockStyles }}
                            ></View>
                            <View style={{ ...renderList[4].blockStyles }}>
                                <TouchableOpacity
                                    disabled={
                                        Img_arr[
                                            this.props.buttonType
                                                ? this.props.buttonType
                                                : "default"
                                        ][`png${renderList[4].index}`][0] === 0
                                    }
                                    onPress={() => {
                                        this.handlePress(2, 1);
                                    }}
                                >
                                    <Image
                                        source={
                                            Img_arr[
                                                this.props.buttonType
                                                    ? this.props.buttonType
                                                    : "default"
                                            ][`png${renderList[4].index}`][1]
                                        }
                                        style={{ ...renderList[4].styles }}
                                    />
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{ ...renderList[4].blockStyles }}
                            ></View>
                        </View>
                        <View style={{ ...renderList[0].blockStyles }}></View>
                    </Layout>
                </Layout>
                <Layout style={{ ...styles.controllerRow, zIndex: 10 }}>
                    <View style={{ ...renderList[8].blockStyles }}>
                        <TouchableOpacity
                            disabled={
                                Img_arr[
                                    this.props.buttonType
                                        ? this.props.buttonType
                                        : "default"
                                ][`png${renderList[8].index}`][0] === 0
                            }
                            onPress={() => {
                                this.handlePress(2, 0);
                            }}
                        >
                            <Image
                                source={
                                    Img_arr[
                                        this.props.buttonType
                                            ? this.props.buttonType
                                            : "default"
                                    ][`png${renderList[8].index}`][1]
                                }
                                style={{ ...renderList[8].styles }}
                            />
                        </TouchableOpacity>
                    </View>
                    <View style={{ ...renderList[9].blockStyles }}>
                        <TouchableOpacity
                            disabled={
                                Img_arr[
                                    this.props.buttonType
                                        ? this.props.buttonType
                                        : "default"
                                ][`png${renderList[9].index}`][0] === 0
                            }
                            onPress={() => {
                                this.handlePress(2, 2);
                            }}
                        >
                            <Image
                                source={
                                    Img_arr[
                                        this.props.buttonType
                                            ? this.props.buttonType
                                            : "default"
                                    ][`png${renderList[9].index}`][1]
                                }
                                style={{ ...renderList[9].styles }}
                            />
                        </TouchableOpacity>
                    </View>
                </Layout>
            </Layout>
        );
        // return buttonArray.map((item1, index1) => {
        //     return (
        //         <Layout
        //             key={`controllerRow-${index1}`}
        //             style={styles.controllerRow}
        //         >
        //             {item1.imgList.map((item2, index2) => {
        //                 // console.log(item2);
        //                 const renderImg =
        //                     Img_arr[
        //                         this.props.buttonType
        //                             ? this.props.buttonType
        //                             : "default"
        //                     ][`png${item2.index}`];
        //                 if (renderImg[0] === 0) {
        //                     return (
        //                         <View
        //                             key={`controllerBlock-${index2}`}
        //                             style={{ ...item2.blockStyles }}
        //                         >
        //                             <Image
        //                                 style={{ ...item2.styles }}
        //                                 source={renderImg[1]}
        //                             ></Image>
        //                         </View>
        //                     );
        //                 } else {
        //                     return (
        //                         <View
        //                             key={`controllerBlock-${index2}`}
        //                             style={{ ...item2.blockStyles }}
        //                         >
        //                             <TouchableOpacity
        //                                 onPress={() => {
        //                                     this.handlePress(index1, index2);
        //                                 }}
        //                             >
        //                                 <Image
        //                                     style={{ ...item2.styles }}
        //                                     source={renderImg[1]}
        //                                 ></Image>
        //                             </TouchableOpacity>
        //                         </View>
        //                     );
        //                 }
        //             })}
        //         </Layout>
        //     );
        // });
    };
    render() {
        return (
            <Layout style={styles.controllerContainer}>
                {this.renderButton()}
            </Layout>
        );
    }
}
