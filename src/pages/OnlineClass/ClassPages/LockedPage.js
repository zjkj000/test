import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    TextInput,Keyboard
} from "react-native";
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
import ZoomPictureModel from "../../../utils/ZoomPictureModel/ZoomPictureModel";

export default class LockedPage extends Component {
    constructor(props) {
        const { messageList } = props;
        const event = messageList[0];
        const { period } = event;
        const subjective =
            period.questionType == "3" || period.questionType == "5";
        super(props);
        this.state = {
            postHtml: "",
            html: "",
            visible: false,
            msg: "",
            moduleVisible: false,
            answer: "",
            showSideBox: false,
            questionType: period.questionType ? period.questionType : "1",
            subjective: subjective,
            imgURL: [],
            htmlURL: "",
            showImageLayer: false,
            zoomImageIndexNow: 0,
            zoomImages: [],
        };
    }
    componentDidMount() {
        this.getHTML();
    }
    setAnswer = (str) => {
        let { html, answer, postHtml } = this.state;
        this.setState({
            html: html + str,
            answer: answer + str,
            postHtml: postHtml + str,
        });
    };
    setSingleAnswer = (str) => {
        // let { html, answer } = this.state;
        console.log("setSingleAnswer====================================");
        console.log(str);
        console.log("====================================");
        this.setState({ html: str, postHtml: str, answer: str });
    };
    imageUpload = (base64) => {
        const { messageList, ipAddress, userName } = this.props;
        const event = messageList[0];
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_saveBase64Image.do";
        // const url =
        //     "http://192.168.1.81:8222/AppServer/ajax/studentApp_saveBase64Image.do";
        console.log(userName);
        const params = {
            baseCode: base64,
            learnPlanId: event.learnPlanId,
            userId: userName,
        };
        http.post(url, params, false)
            .then((res) => {
                if (res.status === "success") {
                    let { imgURL, html, postHtml } = this.state;
                    let imgLength = imgURL.length;
                    this.setState({
                        imgURL: [...imgURL, { url: res.url, index: imgLength }],
                        html: html + "<img>!imgReplace!<img>",
                        postHtml: postHtml + `<img src= "${res.url}" \/>`,
                    });
                    console.log(
                        "handleImage===================================="
                    );
                    console.log(this.state.html);
                    console.log("====================================");
                }
            })
            .catch((error) => {
                console.log(error);
            });
    };
    handleCamera = () => {
        ImageHandler.handleCamera()
            .then((res) => {
                if (res) {
                    this.setState({
                        moduleVisible: false,
                    });
                    this.imageUpload(res.base64);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("获取图片失败:" + error.toString());
            });
    };
    handleLibrary = () => {
        ImageHandler.handleLibrary()
            .then((res) => {
                if (res) {
                    this.setState({
                        moduleVisible: false,
                    });
                    this.imageUpload(res.base64);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("获取图片失败:" + error.toString());
            });
    };
    handleSubmit = () => {
        const { messageList, ipAddress, userName, introduction } = this.props;
        const event = messageList[0];
        const { period } = event;
        const { subjective } = this.state;
        let url =
            "http://" +
            ipAddress +
            ":8901" +
            (subjective
                ? "/KeTangServer/ajax/ketang_saveStuSubjectiveAnswerFromApp.do"
                : "/KeTangServer/ajax/ketang_saveStuAnswerFromApp.do");
        // let url =
        //     "http://" +
        //     "192.168.1.81" +
        //     ":8222" +
        //     (subjective
        //         ? "/KeTangServer/ajax/ketang_saveStuSubjectiveAnswerFromApp.do"
        //         : "/KeTangServer/ajax/ketang_saveStuAnswerFromApp.do");
        console.log(event.learnPlanId);
        let params = {
            userName: userName,
            realName: introduction,
            learnPlanId: event.learnPlanId,
            interactionType: period.questionType,
            questionScore: period.questionScore,
            resourceID: period.resourceId,
            questionAnswer: period.questionAnswerStr
                ? period.questionAnswerStr
                : "",
            content: subjective ? this.state.postHtml : this.state.answer,
            learnPlanName: "",
            answerTime: event.desc,
        };
        http.post(url, params)
            .then((res) => {
                console.log(params);
                // const resJson = JSON.parse(res);
                if (res.status === "success") {
                    Toast.showSuccessToast(res.message);
                } else {
                    Toast.showDangerToast(res.message);
                }
            })
            .catch((error) => {
                // console.log("====================================");
                // console.log(error);
                // console.log("====================================");
                Toast.showDangerToast("提交失败: ", error.toString());
            });
        // Toast.showInfoToast(this.state.answer);
    };
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
        this.setState({ htmlURL: resURL });
    };
    handlePressImage = (index, zoomImages) => {
        console.log("PressImage====================================");
        console.log(index);
        console.log(zoomImages);
        console.log("====================================");
        this.setState({
            // showZoomImage,
            showImageLayer: true,
            // zoomImageListIndex:
            //     indexRow * 2 + indexCol,
            zoomImageIndexNow: index,
            zoomImages,
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

    renderAnswerBox = () => {
        const { subjective, html, imgURL } = this.state;
        if (subjective && html !== "") {
            let textSeq = html.split("<img>");
            let imgIndex = 0;
            let urlObjectAry = [];
            for (let i = 0; i < imgURL.length; i++) {
                urlObjectAry.push({ url: imgURL[i].url, props: {} });
            }
            return (
                <Layout style={styles.body_answerBox}>
                    <ScrollView horizontal={true}>
                        {textSeq.map((item, index) => {
                            if (item === "!imgReplace!") {
                                let picNow = imgURL[imgIndex].index;
                                let img = (
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.handlePressImage(
                                                picNow,
                                                urlObjectAry
                                            );
                                        }}
                                    >
                                        <Image
                                            style={{ width: 150, height: 100 }}
                                            key={`image-${index}`}
                                            source={{
                                                uri: imgURL[imgIndex].url,
                                            }}
                                        />
                                    </TouchableOpacity>
                                );
                                imgIndex = imgIndex + 1;
                                return img;
                            } else {
                                return (
                                    <Text key={`text-${index}`}>{item}</Text>
                                );
                            }
                        })}
                    </ScrollView>
                </Layout>
            );
        }
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
                        onPress={() =>
                            this.setState({
                                answer: "",
                                imgURL: [],
                                html: "",
                                postHtml: "",
                            })
                        }
                        style={{ color: "#B68459" }}
                    >
                        删除
                    </Text>
                    <TextInput
                        ref={(ref) => this.mytextinput = ref}
                        onBlur={()=>{}}
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
                        onPress={() => {
                            this.setAnswer(this.state.msg);
                            this.setState({ msg: "" }); 
                            this.mytextinput.onBlur
                            Keyboard.dismiss()
                        }}
                        style={{
                            width: 100,
                            height: "100%",
                            backgroundColor: "#59B9E0",
                        }}
                    >
                        保存
                    </Button>
                </View>
            </View>
        );
    };

    renderOption = () => {
        const { messageList } = this.props;
        const event = messageList[0];
        const { period } = event;
        const { questionType, subjective } = this.state;
        let optionBar = (
            <RadioList
                checkedindexID={this.state.answer}
                getstuanswer={this.setSingleAnswer}
                ChoiceList={period.questionValueList}
            />
        );
        if (subjective) {
            optionBar = this.renderInputArea();
        } else if (questionType === "2") {
            optionBar = (
                <Checkbox
                    checkedlist={this.state.answer}
                    getstuanswer={this.setSingleAnswer}
                    ChoiceList={period.questionValueList}
                />
            );
        }
        return optionBar;
    };

    renderSAQ = () => {
        const { userName, introduction, imgURL } = this.props;
        const { zoomImageIndexNow, zoomImages, showImageLayer } = this.state;
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
                                source={require("../../../assets/classImg/subj.png")}
                                style={styles.smallImg}
                            />
                        </TouchableOpacity>
                    </Layout>
                    <Layout style={styles.header_middle}>
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                    <Layout style={styles.header_right}>
                        <Button
                            appearance="ghost"
                            size="medium"
                            onPress={this.handleSubmit}
                            disabled={this.props.buttonDisable}
                        >
                            提交
                        </Button>
                    </Layout>
                </Layout>
                <Layout style={styles.body}>
                    <Layout style={styles.body_webview}>
                        <WebView source={{ uri: this.state.htmlURL }} />
                    </Layout>
                    {this.renderAnswerBox()}
                </Layout>
                <Layout style={styles.bottom}>{this.renderOption()}</Layout>
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
                <ZoomPictureModel
                    isShowImage={showImageLayer}
                    zoomImages={zoomImages}
                    currShowImgIndex={zoomImageIndexNow}
                    callBack={() => {
                        this.setState({ showImageLayer: false });
                    }}
                />
            </Layout>
        );
    };

    render() {
        return <View>{this.renderSAQ()}</View>;
    }
}
