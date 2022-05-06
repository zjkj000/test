import React, { Component } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    TextInput,
    ImageBackground,
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
    Icon,
} from "@ui-kitten/components";
import { styles } from "../styles";
import Toast from "../../../utils/Toast/Toast";
import ImageHandler from "../../../utils/Camera/Camera";
import WebView from "react-native-webview";
import Question from "./resources/Qustion";
import PPT from "./resources/PPT";
import Picture from "./resources/Picture";
import Document from "./resources/Document";
import StorageUtil from "../../../utils/Storage/Storage";
import { ScrollView } from "react-native-gesture-handler";
import ZoomPictureModel from "../../../utils/ZoomPictureModel/ZoomPictureModel";

export default class FreePage extends Component {
    constructor(props) {
        const { messageList } = props;
        const event = messageList[0];
        // const event = {
        //     action: "AnonymousCorrecting",
        //     actionType: null,
        //     bagBean: null,
        //     desc: "2.  单项选择题、单项选择题、3单项 选择题、4填空题、《圆柱的认识》教学反思、圆柱展开图下发到卢文静。",
        //     learnPlanId: "68b544ab-2aff-494b-bb6b-a29309250a19",
        //     messageType: 1,
        //     period: null,
        //     periodList: [
        //         {
        //             anchor: null,
        //             anchorType: null,
        //             answer: null,
        //             id: "PRQUI9001144050",
        //             imgSource: null,
        //             links: null,
        //             name: null,
        //             optionCount: null,
        //             questionAnswerStr: null,
        //             questionAnswerText: null,
        //             questionId: null,
        //             questionScore: null,
        //             questionSource: null,
        //             questionType: null,
        //             questionTypeName: null,
        //             questionValueList: null,
        //             resourceFormat: null,
        //             resourceId: null,
        //             resourceNote: null,
        //             resourceParentid: null,
        //             score: null,
        //             type: null,
        //         },
        //     ],
        //     resId: "ming6003",
        //     resPath: "卢文静",
        //     resRootPath: "http://10.121.27.16:8901",
        //     source: "mingming",
        //     target: "ming6003",
        //     treeBean: null,
        //     type: 0,
        //     userNum: "one",
        //     userType: "teacher",
        // };
        const { periodList } = event;
        let resStateList = [];
        console.log(
            "AnonymousCorrectingConstructor===================================="
        );
        console.log(event);
        console.log(periodList);
        console.log("====================================");
        for (let i = 0; i < periodList.length; i++) {
            resStateList[i] = false;
        }
        super(props);
        this.state = {
            event: event,
            checked: false,
            visible: false,
            pageNow: 0,
            pageLength: periodList.length,
            periodList: periodList,
            answer: "",
            questionNow: null,
            questionAnswer: "",
            stuAnswer: "",
            showImageLayer: false,
            zoomImages: [],
            zoomImageIndexNow: 0,
            isFinish: false,
        };
    }
    componentDidMount() {
        if (!this.state.questionNow) {
            this.getQuestion();
        }
    }
    componentDidUpdate(prevProps, prevState) {
        if (prevState.pageNow != this.state.pageNow) {
            this.getQuestion();
        }
        if (prevState.questionNow != this.state.questionNow) {
            console.log(
                "questionNowUpdated===================================="
            );
            console.log(this.state.questionNow);
            console.log("====================================");
        }
    }

    getQuestion = () => {
        // const res = {
        //     data: [
        //         {
        //             correctScore: "",
        //             correctStuId: "",
        //             correctStuName: "",
        //             correctTime: null,
        //             id: "",
        //             questionAnswer: "28",
        //             questionId: "PRQUI9001144050",
        //             questionScore: "1",
        //             questionType: "3",
        //             questionTypeName: "填空题",
        //             stuAnswer:
        //                 'Gg<img src="http://172.20.10.5:8901/html/image/020436af-9bf2-44bd-9b25-9b0137bfd732/20220428/ming6003_163308856.png" />',
        //             stuId: "ming6003",
        //             stuName: "卢文静",
        //             taskId: "431f6e55-a6dc-46cc-81e5-3b414bc76093",
        //             taskName:
        //                 "17.  单项选择题、单项选择题、3单项选择题、4填空题、《圆柱的认识》教学反思、圆柱展开图下发到索夏利、卢文静。",
        //         },
        //     ],
        //     message: "获取成功！",
        //     success: true,
        // };
        // this.setState({
        //     questionNow: res.data[0],
        //     questionAnswer: res.data[0].questionAnswer,
        //     stuAnswer: res.data[0].stuAnswer,
        // });
        const { ipAddress, messageList, introduction, userName } = this.props;
        const event = messageList[0];
        const { period } = event;
        const { periodList, pageNow } = this.state;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_getExploreCorrectingQue.do";
        const params = {
            questionId: periodList[pageNow].id,
            stuId: event.resId,
            taskId: event.learnPlanId,
        };
        http.post(url, params)
            .then((res) => {
                console.log("getQuestion====================================");
                console.log(params);
                console.log(res);
                console.log("====================================");
                if (res.success) {
                    if (res.data.length !== 0) {
                        this.setState({
                            questionNow: res.data[0],
                            questionAnswer: res.data[0].questionAnswer,
                            stuAnswer: res.data[0].stuAnswer,
                        });
                    } else {
                        Toast.showInfoToast("该学生未作答", 5000);
                    }
                } else {
                    Toast.showInfoToast(res.message);
                }
            })
            .catch((error) => {
                console.log(
                    "getQuestionError===================================="
                );
                console.log(error);
                console.log("====================================");
            });
    };
    //将html代码里面的 url 提取出来，存在一个数组里,返回一个对象，对象包含两个数组 imgarr（图片数组）   urlarr（图片的url数组）
    AnalysisAnswerImgUrl(str) {
        // 先把返回的＂转义 \"
        var str = str.replace('"', '"'); //1，匹配出图片img标签（即匹配出所有图片），过滤其他不需要的字符 //2.从匹配出来的结果（img标签中）循环匹配出图片地址（即src属性）
        var imgReg = /<img.*?(?:>|\/>)/gi; //匹配src属性
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = [];
        arr = str.match(imgReg); //console.log('所有已成功匹配图片的数组：'+arr);
        if (arr != null) {
            var newsrcarr = [];
            for (var i = 0; i < arr.length; i++) {
                let srcarr = [];
                srcarr = arr[i].match(srcReg);
                newsrcarr.push({ url: srcarr[1], index: i });
            }
            return {
                imgarr: arr,
                urlarr: newsrcarr,
            };
        } else {
            return {
                imgarr: [],
                urlarr: [],
            };
        }
    }
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
    handleStuAnswer = (answer) => {
        console.log("handleStuAnswer====================================");
        console.log(answer);
        console.log("====================================");
        let { imgarr, urlarr } = this.AnalysisAnswerImgUrl(answer);
        for (let i = 0; i < imgarr.length; i++) {
            answer = answer.replace(imgarr[i], "<img>!imgReplace!<img>");
        }
        let textSeq = answer.split("<img>");
        let imgIndex = 0;
        let urlObjectAry = [];
        for (let i = 0; i < urlarr.length; i++) {
            urlObjectAry.push({ url: urlarr[i].url, props: {} });
        }
        return (
            <Text style="padding: 5">
                {textSeq.map((item, index) => {
                    console.log(
                        "handleStuAnswer===================================="
                    );
                    console.log(imgIndex);
                    console.log("====================================");
                    if (item === "!imgReplace!") {
                        console.log("replace!");
                        let picNow = urlarr[imgIndex].index;
                        let img = (
                            <TouchableOpacity
                                onPress={() => {
                                    this.handlePressImage(picNow, urlObjectAry);
                                }}
                            >
                                <Image
                                    style={{ width: 150, height: 100 }}
                                    key={`image-${index}`}
                                    source={{ uri: urlarr[imgIndex].url }}
                                />
                            </TouchableOpacity>
                        );
                        console.log("Hell0o");
                        console.log(urlarr[imgIndex]);
                        imgIndex = imgIndex + 1;
                        return img;
                    } else {
                        return <Text key={`text-${index}`}>{item}</Text>;
                    }
                })}
            </Text>
        );
    };
    nextPage = (step) => {
        let { pageLength, pageNow } = this.state;
        console.log(pageNow);
        pageNow += step;
        if (pageNow < 0) {
            Toast.showInfoToast("当前是第一题", 500);
        } else if (pageNow >= pageLength) {
            Toast.showInfoToast("当前是最后一题", 500);
        } else {
            this.setState({ pageNow });
        }
    };
    setAnswer = (str) => {
        this.setState({ answer: str });
    };

    renderOption = () => {
        return (
            <RadioList
                checkedindexID={this.state.answer}
                getstuanswer={this.setAnswer}
                ChoiceList={"对,错"}
            />
        );
    };

    renderBody = () => {
        return (
            <>
                <Layout style={styles.body}>
                    <Layout style={styles.body_side}>
                        <Text style={styles.answer_title}>标准答案</Text>
                        <ScrollView horizontal={true}>
                            {this.handleStuAnswer(this.state.questionAnswer)}
                        </ScrollView>
                    </Layout>
                    <Layout style={styles.body_side}>
                        <Text style={styles.answer_title}>学生答案</Text>
                        <ScrollView horizontal={true}>
                            {this.handleStuAnswer(this.state.stuAnswer)}
                        </ScrollView>
                    </Layout>
                </Layout>
                <Layout style={styles.bottom}>
                    <Layout style={styles.bottomLeft}>
                        <TouchableOpacity
                            onPress={() => {
                                this.nextPage(-1);
                            }}
                        >
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../assets/classImg/last.png")}
                            ></Image>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.nextPage(1);
                            }}
                        >
                            <Image
                                style={{ width: 30, height: 30 }}
                                source={require("../../../assets/classImg/next.png")}
                            ></Image>
                        </TouchableOpacity>
                    </Layout>
                    {this.renderOption()}
                    <Layout style={styles.bottomRight}>
                        <Button
                            style={{ width: 80, height: "100%" }}
                            onPress={this.handleSubmit}
                        >
                            提交
                        </Button>
                    </Layout>
                </Layout>
            </>
        );
    };
    formatDateNow() {
        //dataString是整数，否则要parseInt转换
        var time = new Date();
        var year = time.getFullYear();
        var month = time.getMonth() + 1;
        var day = time.getDate();
        var hour = time.getHours();
        var minute = time.getMinutes();
        var second = time.getSeconds();
        return (
            year +
            "-" +
            (month < 10 ? "0" + month : month) +
            "-" +
            (day < 10 ? "0" + day : day) +
            " " +
            (hour < 10 ? "0" + hour : hour) +
            ":" +
            (minute < 10 ? "0" + minute : minute) +
            ":" +
            (second < 10 ? "0" + second : second)
        );
    }
    handleSubmit = () => {
        const strDate = this.formatDateNow();
        const { ipAddress, messageList, userName, introduction } = this.props;
        const event = messageList[0];
        // const { event } = this.state;
        const { questionNow } = this.state;
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_saveExploreCorrectingResultByRN.do";
        // const params = {
        //     correctScore: "1",
        //     correctStuId: "ming6003",
        //     correctStuName: "卢文静",
        //     correctTime: "2022-04-29 14:07:06",
        //     questionAnswer:
        //         "(1)2 太阳(2)火星　木星(3)同向　平面　大小行星各行其道，互不干扰，使地球处于一个较安全的宇宙环境(4)存在生命　充足的水分，适于生物呼吸的大气，适宜的太阳光照和温度范围。",
        //     questionId: "PRQUI9000310305",
        //     questionScore: "1",
        //     questionType: "5",
        //     questionTypeName: "综合题",
        //     stuAnswer: "L",
        //     stuId: "ming6003",
        //     stuName: "卢文静",
        //     taskId: "60a40048-9700-45f8-bdaf-6f2a7a96785f",
        //     taskName:
        //         "5.  1综合题、2综合题、6、3、人教版-语文-五年级上册-《师恩难 忘》教学课件、《彩色的翅膀》同步练习及答案解析下发到索夏利、卢文静。",
        //     version: 3,
        // };
        const params = {
            stuId: questionNow.stuId,
            stuName: questionNow.stuName,
            taskId: event.learnPlanId,
            taskName: event.desc,
            questionId: questionNow.questionId,
            questionTypeId: questionNow.questionType,
            questionTypeName: questionNow.questionTypeName,
            questionAnswer: this.state.questionAnswer,
            questionScore: questionNow.questionScore,
            stuAnswer: this.state.stuAnswer,
            correctStuId: userName,
            correctStuName: introduction,
            correctTime: strDate,
            correctScore:
                this.state.answer === "错" ? 0 : questionNow.questionScore,
            version: 3,
        };
        console.log("handleSubmit====================================");
        console.log(url);
        console.log(params);
        http.post(url, params)
            .then((res) => {
                console.log(res);
                if (res.success) {
                    Toast.showSuccessToast(res.message);
                } else {
                    Toast.showWarningToast(res.message);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("提交失败：" + error.toString());
            });
        console.log("====================================");
    };

    handleFinish = () => {
        const { ipAddress, messageList, userName } = this.props;
        const event = messageList[0];
        const url =
            "http://" +
            ipAddress +
            ":8901" +
            "/KeTangServer/ajax/ketang_getCorrectStatus.do";
        let params = {
            stuId: userName,
            taskId: event.learnPlanId,
        };
        console.log("handleFinish====================================");
        console.log(url);
        console.log(params);
        http.post(url, params, true, true)
            .then((res) => {
                console.log(res);
                if (res.success) {
                    Toast.showSuccessToast(res.message);
                    this.setState({ isFinish: true });
                } else {
                    Toast.showWarningToast(res.message);
                }
            })
            .catch((error) => {
                Toast.showDangerToast("保存失败: " + error.toString());
            });
        console.log("====================================");
    };

    renderSAQ = () => {
        const { userName, introduction, imgURL } = this.props;
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
                                style={styles.smallImg}
                                source={require("../../../assets/classImg/subj.png")}
                            />
                        </TouchableOpacity>
                        <Text>{introduction + "(" + userName + ")"}</Text>
                    </Layout>
                    <Layout style={styles.header_middle}>
                        <Text>探究活动批改</Text>
                    </Layout>
                    <Layout style={styles.header_right}>
                        <Text>{`${this.state.pageNow + 1}/${
                            this.state.pageLength
                        }`}</Text>
                        <TouchableOpacity onPress={this.handleFinish}>
                            <Image
                                source={
                                    this.state.isFinish
                                        ? require("../../../assets/classImg/endCheck.png")
                                        : require("../../../assets/classImg/endCheck1.png")
                                }
                            />
                        </TouchableOpacity>
                    </Layout>
                </Layout>
                {this.renderBody()}
                {/* 课堂二维码 */}
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
                    isShowImage={this.state.showImageLayer}
                    zoomImages={this.state.zoomImages}
                    currShowImgIndex={this.state.zoomImageIndexNow}
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
