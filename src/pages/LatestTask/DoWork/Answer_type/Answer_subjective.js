import {Text,StyleSheet,View,ScrollView,Image,TextInput,Button,Alert,TouchableOpacity,Modal,Dimensions, Keyboard,} from "react-native";
import React, { Component, useState } from "react";
import RenderHtml from "react-native-render-html";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import { OverflowMenu, MenuItem } from "@ui-kitten/components";
import ImageViewer from "react-native-image-zoom-viewer";
import ImageHandler from "../../../../utils/Camera/Camera";
import http from "../../../../utils/http/request";
import { useNavigation } from "@react-navigation/native";
import Toast from '../../../../utils/Toast/Toast';
import { Waiting, WaitLoading } from "../../../../utils/WaitLoading/WaitLoading";
export default function Answer_subjectiveContainer(props) {
    const navigation = useNavigation();
    const paperId = props.paperId;
    const submit_status = props.submit_status;
    const startdate = props.startdate;
    const papername = props.papername;
    const sum = props.sum;
    const num = props.num;

    const datasource = props.datasource;
    const oldAnswer_data = props.oldAnswer_data;
    const [ischange, setischange] = useState();
    props.getischange(ischange);
    const [Stu_answer, setStu_answer] = useState();
    props.getStu_answer(Stu_answer);
    return (
        <Answer_subjective
            navigation={navigation}
            papername={papername}
            submit_status={submit_status}
            startdate={startdate}
            paperId={paperId}
            getischange={setischange}
            getStu_answer={setStu_answer}
            sum={sum}
            num={num}
            isallObj={props.isallObj}
            datasource={datasource}
            oldAnswer_data={oldAnswer_data}
        />
    );
}

// 主观题 模板页面
//  使用时 需要传入参数：   sum   总题目数量：                 选传 不传默认总数题   会显示1/1题
//                         num   这是第几个题目               选传 不传默认num  0   会显示1/1题
//                         datasource                        必须传  试题的内容
//                         paperId                           必须传  用于提交作业时候用到
//                         oldAnswer_data                    选择传递   是否有历史作答记录  一般是通过api获取的历史答案。否则不建议传
//                         getischange={setischange}         传递一个函数  用于向做作业的页面传递 是否改变了答案，便于判断是否要提交  setischange函数要自己写在做作业页面
//                         getStu_answer={setStu_answer_i}   传递一个函数  用于获得阅读题得到的作答结果  setStu_answer_i函数要自己写在做作业页面 代表设置第几道题的答案。
class Answer_subjective extends Component {
    constructor(props) {
        super(props);
        //传给每道题目，用于让题目告诉这个页面 他们的答案是什么，会在这个页面记录他们的答案。
        this.stuAnswer = this.stuAnswer.bind(this);
        //这个页面用到的状态
        this.state = {
            paperId: "",
            textinputAnswer: "", //输入文本框输入的内容
            isLongarea: false,
            hasImage: false, //控制下方题目是否有照片
            moduleVisible: false, //用于控制点击拍照图片，弹出选择  拍照或者从相册选取
            numid: "", //题目在试题集中的索引
            questionTypeName: "主观题",
            questionId: "",
            baseTypeId: "",
            questionName: "", //题目名称
            questionChoiceList: "",
            questionContent: "", //题目内容
            answer: "",
            imgURLArray: [], //拍照或本地选择照片的uri数组
            value: "",
            baseCode: "", //拍照或本地选择照片的baseCode64码
            stuAnswer: " ", //学生现在答案
            oldStuAnswer: "", //历史学生作答结果
        };
    }

    //用于将本道题写的答案  传给 Todo页面，用于提交
    stuAnswer(str) {
        // console.log("主观题写了答案", str);
        this.setState({ stuAnswer: str });
        // 把结果传给ToDO，并且告诉有改变  只要作答就有改变
        this.props.getStu_answer(str);
        this.props.getischange(true);
    }

    UNSAFE_componentWillMount() {
        //解析旧的答案html里面的图片的url  设置到state里面的imgURLArray
        const imgurlarr = this.AnalysisAnswerImgUrl(
            this.props.oldAnswer_data ? this.props.oldAnswer_data : ""
        ).urlarr;
        var newimgurlarr = [];
        if (imgurlarr != null) {
            for (var i = 0; i < imgurlarr.length; i++) {
                newimgurlarr.push({ url: imgurlarr[i] });
            }
        }
        //把接到的参数全部设置到state里
        this.setState({
            paperId: this.props.paperId,
            imgURLArray: newimgurlarr,
            stuAnswer: this.props.oldAnswer_data
                ? this.props.oldAnswer_data
                : "",
            oldStuAnswer: this.props.oldAnswer_data,
            numid: this.props.num ? this.props.num : 0,
            ...this.props.datasource,
        });
    }

    //用于将学生的答案（html）转成RN里面的格式显示出来
    showStuAnswer() {
        // 将学生的答案 按照RN里面的方式展示出来
        //stuAnswer是  html 标签的
        // 如果为空，什么也不做
        var imgarr = this.AnalysisAnswerImgUrl(
            this.state.stuAnswer ? this.state.stuAnswer : ""
        ).imgarr;
        var urlarr = this.AnalysisAnswerImgUrl(
            this.state.stuAnswer ? this.state.stuAnswer : ""
        ).urlarr;
        var str = this.state.stuAnswer;
        var showhtmlarr = [];
        if (imgarr == null) {
            //不存在图片的情况;
            showhtmlarr.push(<Text>{this.state.stuAnswer}</Text>);
        } else {
            // 存在照片，在数组中遍历  替换成RN表示的类型
            imgarr.map(function (item, index) {
                var newstr = "has1imageistruehas1image";
                str = str.replace(item, newstr);
            });
            var htmlarr = str.split("has1image");
            var imgnum = 0;
            htmlarr.forEach(function (item, index) {
                if (item == "istrue") {
                    let nowimage = 0;
                    nowimage = imgnum;
                    showhtmlarr.push(
                        <View>
                            {/* <TouchableOpacity key={index} onPress={()=>{
                                // alert('想查看照片')
                                if(imgarr.length>0){this.setState({moduleVisible:true})};
                                console.log('+++--+++',urlarr[nowimage])
                            }}> */}
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={{ uri: urlarr[imgnum] }}
                            />
                            {/* </TouchableOpacity> */}
                        </View>
                    );
                    imgnum += 1;
                } else {
                    showhtmlarr.push(
                        <View>
                            <Text multiline={true}>{item}</Text>
                        </View>
                    );
                }
            });
        }
        return showhtmlarr;
    }

    //将html代码里面的 url 提取出来，存在一个数组里,返回一个对象，对象包含两个数组 imgarr（图片数组）   urlarr（图片的url数组）
    AnalysisAnswerImgUrl(str) {
        // 先把返回的＂转义 \"
        var str = str.replace('"', '"');
        //1，匹配出图片img标签（即匹配出所有图片），过滤其他不需要的字符
        //2.从匹配出来的结果（img标签中）循环匹配出图片地址（即src属性）
        var imgReg = /<img.*?(?:>|\/>)/gi;
        //匹配src属性
        var srcReg = /src=[\'\"]?([^\'\"]*)[\'\"]?/i;
        var arr = [];
        arr = str.match(imgReg);
        if (arr != null) {
            var newsrcarr = [];
            for (var i = 0; i < arr.length; i++) {
                let srcarr = [];
                srcarr = arr[i].match(srcReg);
                newsrcarr.push(srcarr[1]);
            }
            return {
                imgarr: arr,
                urlarr: newsrcarr,
            };
        } else
            return {
                imgarr: arr,
                urlarr: [],
            };
    }

    //拍照调用的函数
    handleCamera = () => {
        ImageHandler.handleCamera().then((res) => {
            if (res!=null) {
                const url = global.constants.baseUrl+"studentApp_saveBase64Image.do";
                const params = {
                    baseCode: res.base64,
                    learnPlanId: this.state.paperId,
                    userId: global.constants.userName,
                };
                WaitLoading.show('照片提交中...',-1)
                http.post(url, params,false).then((resStr) => {
                    // console.log('结果：',resStr,typeof(resStr))
                    let resJson = resStr;
                    if (resJson.success) {
                        WaitLoading.dismiss()
                        var newurl = resJson.data;
                        var newimageArray = this.state.imgURLArray;
                        if (newurl != "") {
                            newimageArray.push({ url: newurl });
                            var newstuanswer = this.state.stuAnswer;
                            //拼接之后便于之前的APP能用
                            newstuanswer += `<img onclick='bigimage(this)' onclick='bigimage(this)' onclick='bigimage(this)' onclick=\"bigimage(this)\" src=\"${newurl}\" style=\"max-width:80px\">`;
                            this.setState({
                                stuAnswer: newstuanswer,
                                imgURLArray: newimageArray,
                            });
                        }
                        this.stuAnswer(newstuanswer);
                        this.setState({ hasImage: true });
                    } else {
                        WaitLoading.dismiss()
                        Toast.showSuccessToast("照片提交失败！！", 3000);
                    }
                });
            }
        });
    };

    //从本地选择照片需要的函数
    handleLibrary = () => {
        ImageHandler.handleLibrary().then((res) => {
            if (res!=null) {
                WaitLoading.show('照片提交中...',-1)
                const url = global.constants.baseUrl+"studentApp_saveBase64Image.do";
                const params = {
                    baseCode: res.base64,
                    learnPlanId: this.state.paperId,
                    userId: global.constants.userName,
                };
                http.post(url, params,false).then((resStr) => {
                    let resJson = resStr
                    // let resJson = JSON.parse(resStr);
                    // console.log('照片提交结果',resStr)
                    if (resJson.success) {
                        var newurl = resJson.data;
                        WaitLoading.dismiss()
                        var newimageArray = this.state.imgURLArray;
                        if (newurl != "") {
                            newimageArray.push({ url: newurl });
                            var newstuanswer = this.state.stuAnswer;
                            //拼接之后便于之前的APP能用
                            newstuanswer += `<img onclick='bigimage(this)' onclick='bigimage(this)' onclick='bigimage(this)' onclick=\"bigimage(this)\" src=\"${newurl}\" style=\"max-width:80px\">`;
                            this.setState({
                                stuAnswer: newstuanswer,
                                imgURLArray: newimageArray,
                                hasImage: true,
                            });
                        }
                        // console.log('新答案',newstuanswer)
                        this.stuAnswer(newstuanswer);
                    } else {
                        WaitLoading.dismiss()
                        Toast.showSuccessToast("照片提交失败！！", 3000);
                    }
                });
            }
        });
    };

    render() {
        const HTML = this.state.questionContent;
        const width = Dimensions.get("window").width;
        var questionHTML = []; //用于接收  html解析之后添加到数组中
        questionHTML = this.showStuAnswer();
        // console.log('答案要显示的内容：',questionHTML)
        return (
            <View
                style={{
                    backgroundColor: "#FFFFFF",
                    borderTopColor: "#000000",
                    borderTopWidth: 0.5,
                }}
            >
                {/* 第一行显示 第几题  题目类型 */}
                <View style={styles.answer_title}>
                    <Text style={{ color: "#59B9E0" }}>
                        {(this.state.numid ? this.state.numid : 0) + 1}
                    </Text>
                    <Text>/{this.props.sum ? this.props.sum : 1}题 </Text>
                    <Text style={{ marginLeft: 20 }}>
                        {this.state.questionTypeName}
                    </Text>
                    {/* <TouchableOpacity
                        style={{ position: "absolute", right: 20, top: 10 }}
                        onPress={() => {
                            //导航跳转
                            this.props.navigation.navigate("SubmitPaper", {
                                paperId: this.props.paperId,
                                submit_status: this.props.submit_status,
                                startdate: this.props.startdate,
                                papername: this.props.papername,
                                isallObj: this.props.isallObj,
                            });
                        }}
                    >
                        <Image
                            source={require("../../../../assets/image3/look.png")}
                        ></Image>
                    </TouchableOpacity> */}
                </View>

                {/* 题目展示区域 */}
                <ScrollView
                    style={
                        this.state.isLongarea
                            ? styles.answer_area_Long
                            : styles.answer_area
                    }
                >
                    <RenderHtml contentWidth={width} source={{ html: HTML }} />
                    <Text style={{ height: 50 }}></Text>
                </ScrollView>

                {/* 答案预览区域 */}
                <View
                    style={
                        this.state.isLongarea
                            ? styles.answer_preview_Long
                            : styles.answer_preview
                    }
                >
                    <Waiting/>
                    {/* 这个是控制主观题预览    改变上下部分区域高度的  +   删除文本的 */}
                    <TouchableOpacity
                        style={{ flexDirection: "row-reverse" }}
                        onPress={() => {
                            this.setState({
                                isLongarea: !this.state.isLongarea,
                            });
                        }}
                    >
                        <Text
                            style={{
                                margin: 10,
                                marginRight: 20,
                                marginLeft: 5,
                                color: "#B68459",
                            }}
                            onPress={() => {
                                this.setState({
                                    imgURLArray: [],
                                    hasImage: false,
                                });
                                this.stuAnswer("");
                            }}
                        >
                            删除
                        </Text>

                        {this.state.isLongarea ? (
                            <Image
                                style={{ marginTop: 5 }}
                                source={require("../../../../assets/image3/bot.png")}
                            ></Image>
                        ) : (
                            <Image
                                style={{ marginTop: 5 }}
                                source={require("../../../../assets/image3/top.png")}
                            ></Image>
                        )}
                    </TouchableOpacity>

                    <View>
                        {/* 用于放大显示图片   后续所有的点击都是用过这个组件显示的   */}
                        <Modal visible={this.state.moduleVisible}>
                            <ImageViewer
                                style={{ width: "100%" }}
                                imageUrls={this.state.imgURLArray}
                                onClick={() =>
                                    this.setState({ moduleVisible: false })
                                }
                            />
                        </Modal>
                    </View>

                    {/* 图片文字展示区域 */}
                    <ScrollView>
                        <TouchableOpacity
                            style={{
                                padding: 20,
                                paddingTop: 10,
                                width: width,
                                flexDirection: "row",
                                alignItems: "center",
                                flexWrap: "wrap",
                            }}
                            onPress={() => {
                                if (this.state.imgURLArray.length > 0) {
                                    this.setState({ moduleVisible: true });
                                }
                            }}
                        >
                            {/* <View style={{padding:20,paddingTop:10,width:width,flexDirection:'row',alignItems:'center',flexWrap:'wrap'}}> */}
                            {questionHTML}
                            {/* </View>  */}
                        </TouchableOpacity>
                    </ScrollView>
                </View>

                {/* 书写答案，选择照片 区域 */}
                <View style={styles.content}>
                    {/* 文本框+保存按钮区域 */}
                    <View
                        style={{
                            borderColor: "#000000",
                            borderWidth: 1,
                            flexDirection: "row",
                        }}
                    >
                        <TextInput
                             ref={(ref) => this.mytextinput = ref}
                            placeholder="请输入答案"
                            multiline
                            value={this.state.textinputAnswer}
                            onChangeText={(text) => {
                                this.setState({ textinputAnswer: text });
                            }}
                            onBlur={()=>{}}
                            style={{
                                width: 200,
                                backgroundColor: "#FFFFFF",
                                height: 40,
                            }}
                        ></TextInput>
                        {/* 保存按钮将文本输入框的内容传到学生作答答案里面 */}
                        <Button
                            title="保存"
                            onPress={() => {
                                var newanswer = this.state.stuAnswer;
                                newanswer += this.state.textinputAnswer;
                                this.setState({ textinputAnswer: "" });
                                this.stuAnswer(newanswer);
                                this.mytextinput.onBlur
                                Keyboard.dismiss()
                            }}
                            style={{
                                width: 100,
                                height: 35,
                                backgroundColor: "#59B9E0",
                            }}
                        ></Button>
                    </View>

                    {/* 相机拍照 */}
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("点了图片");
                            this.handleCamera();
                        }}
                    >
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require("../../../../assets/image3/camera.png")}
                        ></Image>
                    </TouchableOpacity>

                    {/* 从相册选择照片 */}
                    <TouchableOpacity
                        onPress={() => {
                            // console.log("点了相册");
                            this.handleLibrary();
                        }}
                    >
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require("../../../../assets/image3/photoalbum.png")}
                        ></Image>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    answer_title: { padding: 10, paddingLeft: 30, flexDirection: "row" },
    answer_area: { height: "65%", padding: 20 },
    answer_preview: {
        borderTopWidth: 1,
        borderTopColor: "#000000",
        height: "20%",
        backgroundColor: "#FFFFFF",
    },
    answer_area_Long: { height: "2%", padding: 20 },
    answer_preview_Long: {
        borderTopWidth: 1,
        borderTopColor: "#000000",
        height: "78%",
        backgroundColor: "#FFFFFF",
    },
    backdrop: {
        backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    content: {
        borderTopWidth: 0.5,
        borderTopColor: "#000000",
        width: "100%",
        flexDirection: "row",
        justifyContent: "space-around",
        backgroundColor: "#E6DDD6",
        padding: 10,
        alignItems: "center",
    },
});
