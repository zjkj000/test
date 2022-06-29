import {
    Button,
    ScrollView,
    Text,
    View,
    StyleSheet,
    Alert,
    TouchableOpacity,
    Dimensions,
} from "react-native";
import React, { Component, useState } from "react";
import http from "../../../utils/http/request";
import RenderHtml from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../../utils/loading/Loading";
import Toast from "../../../utils/Toast/Toast";
import { Waiting, WaitLoading } from "../../../utils/WaitLoading/WaitLoading";
// 提交导学案页面
export default function Learningguide_SubmitContainer(props) {
    const start_date = props.route.params.startdate;
    const navigation = useNavigation();
    navigation.setOptions({ title: props.route.params.papername });
    const learnPlanId = props.route.params.learnPlanId;
    const submit_status = props.route.params.submit_status;
    const papername = props.route.params.papername;
    const isallObj = props.route.params.isallObj;
    return (
        <Learningguide_Submit
            navigation={navigation}
            startdate={start_date}
            learnPlanId={learnPlanId}
            submit_status={submit_status}
            papername={papername}
            isallObj={isallObj}
        />
    );
}

class Learningguide_Submit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isallObjective: true, //用于记录是否全是客观题
            learnPlanId: "",
            success: false,
            data: [],
            submit_status: "",
            startdate: "",
        };
    }

    //页面加载在render之前
    UNSAFE_componentWillMount() {
        let bool = false;
        this.setState({
            start_date: this.props.startdate
                ? this.props.startdate
                : this.getDate(),
            learnPlanId: this.props.learnPlanId,
            submit_status: this.props.submit_status,
            isallObjective: bool,
        });

        //先将接收到的 learnPlanId  submit_tatus参数接收赋值进去
        //根据导学案ID  和用户姓名  请求  答题的内容
        const url = global.constants.baseUrl+"studentApp_getstuAnswerLearnPlanList.do";
        const params = {
            learnPlanId: this.props.learnPlanId,
            userName: global.constants.userName,
        };
        //用于获取
        if (!this.state.success) {
            http.get(url, params).then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ success: resJson.success, data: resJson.data });
            });
        }
    }

    //获取时间
    getDate() {
        var date = new Date();
        var hour = date.getHours().toString();
        var minute = date.getMinutes().toString();
        var seconds = date.getSeconds();
        return hour + ":" + minute + ":" + seconds;
    }

    submit_answer() {
        const url = global.constants.baseUrl+"studentApp_savestuAnswerFromLearnPlan.do";
        let change_status = 0; //记录返回的状态
        let newsub_status = 0; // 记录提交的状态
        //接收到的是状态是：1  新作业
        if (this.state.submit_status == "1") {
            //收到的状态是1     提交的状态就是1
            newsub_status = 1;
            //再去判断返回的状态
            if (this.state.isallObjective) {
                //全是客观题   就直接批阅
                //返回的状态是2
                change_status = 2;
            } else {
                change_status = 3;
            }
        } else {
            //收到的状态是3   提交的状态就是 3
            newsub_status = 3;
            //在判断返回的状态
            if (this.state.isallObjective) {
                //全是客观题   就直接批阅
                //返回的状态是2
                change_status = 2;
            } else {
                change_status = 3;
            }
        }

        var answerdate = 0;
        var nowdate = this.getDate();
        var startdatearr = this.props.startdate.split(":");
        var nowdatearr = nowdate.split(":");
        if (parseInt(nowdatearr[0]) < parseInt(startdatearr[0]))
            nowdatearr[0] = parseInt(nowdatearr[0]) + 24;
        var answerdate_minute =
            (parseInt(nowdatearr[0]) - parseInt(startdatearr[0])) * 60 +
            (parseInt(nowdatearr[1]) - parseInt(startdatearr[1]));
        if (parseInt(nowdatearr[2]) < parseInt(startdatearr[2]))
            answerdate_minute = parseInt(answerdate_minute) - 1;
        if (parseInt(nowdatearr[2]) < parseInt(startdatearr[2]))
            nowdatearr[2] = parseInt(nowdatearr[2]) + 60;
        var answerdate_seconds =
            parseInt(nowdatearr[2]) - parseInt(startdatearr[2]);
        answerdate = answerdate_minute + ":" + answerdate_seconds;

        const params = {
            answerTime: answerdate,
            learnPlanId: this.state.learnPlanId,
            learnPlanName: this.props.papername,
            userName: global.constants.userName,
            userCn: global.constants.userCn,
            status: newsub_status,
        };

        let noSubmitID = "-1";
        this.state.data.map(function (item) {
            if (item.stuAnswer == "未答" || item.stuAnswer == ""||item.stuAnswer == "未学") {
                noSubmitID='1';  //1记录有未学的
            }
        });
        if(noSubmitID=='-1'){   //代表都作答了
            WaitLoading.show('提交中...',-1)
            http.get(url, params).then((resStr) => {
                let resJson = JSON.parse(resStr);
                if (resJson.success) {
                    WaitLoading.dismiss()
                    Toast.showSuccessToast("导学案提交成功了!", 1000);
                    this.props.navigation.navigate({
                        name: "Home",
                        params: {
                            screen: "首页",
                            params: {
                                learnId: this.state.learnPlanId,
                                status: change_status,
                            },
                        },
                        merge: true,
                    });
                }else{
                    WaitLoading.show_false()
                }
                
            });
        }else{
            Alert.alert('','有题目未作答,是否提交？',[{text:'取消',onPress:()=>{}},{},{
                text:'确定',onPress:()=>{
                    WaitLoading.show('提交中...',-1)
                    http.get(url, params).then((resStr) => {
                        let resJson = JSON.parse(resStr);
                        if (resJson.success) {
                            WaitLoading.dismiss()
                            Toast.showSuccessToast("导学案提交成功了!", 1000);
                            this.props.navigation.navigate({
                                name: "Home",
                                params: {
                                    screen: "首页",
                                    params: {
                                        learnId: this.state.learnPlanId,
                                        status: change_status,
                                    },
                                },
                                merge: true,
                            });
                        }else{
                            WaitLoading.show_false()
                        }
                        
                    });
                }}])
        }
        
        
    }

    render() {
        const data = this.state.data;
        const width = Dimensions.get("window").width;
        //动态拼接已经作答的题目答案
        var result = [];
        for (let result_Item = 0; result_Item < data.length; result_Item++) {
            result.push(
                <TouchableOpacity
                    key={result_Item}
                    //设置一个函数  传递一个index参数控制跳转做题第几题。
                    //onPress={this.props.navigation.getState().routes[2].getSelectIndex()}
                    onPress={() => {
                        // if (this.state.data[result_Item].type == "01") {
                            this.props.navigation.navigate({
                                name: "DoLearningGuide",
                                params: {
                                    learnId: this.state.learnPlanId,
                                    status: this.props.submit_status, //导学案状态
                                    selectedindex:result_Item,
                                    papername: this.props.papername,
                                },
                                megre: true,
                            });
                        // }
                        // else{
                        //     Alert.alert('需要跳转')
                        // }
                    }}
                >
                    <View key={result_Item} style={styles.result}>
                        {/* 序号 */}
                        <Text style={{ marginRight: 10 }}>
                            ({this.state.data[result_Item].order})
                        </Text>
                        {/* 具体答案  or   红色的未答 */}
                        {this.state.data[result_Item].stuAnswer != ""? (
                            <RenderHtml
                                contentWidth={width}
                                source={{
                                    html: this.state.data[result_Item]
                                        .stuAnswer,
                                }}
                            />
                        ) :this.state.data[result_Item].type=='01'? (
                            <Text style={{ color: "red" }}>未答</Text>
                        ):(<Text style={{ color: "red" }}>未学</Text>)}
                    </View>
                </TouchableOpacity>
            );
        }
        if (this.state.success) {
            return (
                <View
                    style={{
                        backgroundColor: "#FFFFFF",
                        borderTopColor: "#000000",
                        borderTopWidth: 0.5,
                    }}
                >
                    <Waiting/>
                    {/* 答案预览区域 */}
                    <ScrollView style={styles.preview_area}>
                        {/* 题目展示内容：序号 + 答案 */}
                        {result}
                    </ScrollView>
                    {/* 提交导学案按钮区域 */}
                    <View style={styles.submit_area}>
                        <Button
                            onPress={() => {
                                this.submit_answer();
                            }}
                            style={styles.bt_submit}
                            title="交导学案"
                        ></Button>
                    </View>
                </View>
            );
        } else {
            return (
                <View>
                    <Loading show={true} />
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    preview_area: { height: "90%", paddingBottom: 50, paddingTop: 10 },
    result: {
        paddingLeft: 20,
        paddingRight: 40,
        paddingTop: 10,
        paddingBottom: 10,
        flexDirection: "row",
        borderColor: "#000000",
        borderBottomWidth: 0.5,
    },
    bt_submit: { marginRight: 20 },
    submit_area: {
        paddingLeft: 30,
        paddingTop: 20,
        paddingBottom: 20,
        paddingRight: 30,
    },
});
