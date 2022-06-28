import {Button,ScrollView,Text,View,StyleSheet,Alert,TouchableOpacity,Dimensions,} from "react-native";
import React, { Component, useState } from "react";
import http from "../../../utils/http/request";
import RenderHtml from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";
import Loading from "../../../utils/loading/Loading";
import Toast from "../../../utils/Toast/Toast";
import { Waiting, WaitLoading } from '../../../utils/WaitLoading/WaitLoading'
// 提交作业页面
export default function Paper_SubmitContainer(props) {
    const start_date = props.route.params.startdate;
    const navigation = useNavigation();
    navigation.setOptions({ title: props.route.params.papername });
    const paperId = props.route.params.paperId;
    const submit_status = props.route.params.submit_status;
    const papername = props.route.params.papername;
    const isallObj = props.route.params.isallObj;
    return (
        <Paper_Submit
            navigation={navigation}
            startdate={start_date}
            paperId={paperId}
            submit_status={submit_status}
            papername={papername}
            isallObj={isallObj}
        />
    );
}

class Paper_Submit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isallObjective: true, //用于记录是否全是客观题
            paperId: "",
            success: false,
            data: [],
            submit_status: "", //记录当前的提交状态
            startdate: "",
        };
    }
    
    //页面加载在render之前
    UNSAFE_componentWillMount() {
        let bool =
            this.props.isallObj.indexOf("104") > -1 ||     //判断是否存在104类型  若存在就有主观题
            this.props.isallObj.indexOf("106") > -1        //判断是否存在106类型  若存在就有主观题  
                ? false
                : true;
        this.setState({
            start_date: this.props.startdate
                ? this.props.startdate
                : this.getDate(),
            paperId: this.props.paperId,
            submit_status: this.props.submit_status,
            isallObjective: bool,                      //设置是否全是客观题
        });

        //先将接收到的 paperId  submit_tatus参数接收赋值进去
        //根据作业ID  和用户姓名  请求  答题的内容
        const url = global.constants.baseUrl+"studentApp_getStudentAnswerList.do";
        const params = {
            paperId: this.props.paperId,
            userName: global.constants.userName,
        };
        //用于获取答案
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
        const url = global.constants.baseUrl+"studentApp_saveStudentHomeWork.do";
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

        let noSubmitID = "";
        this.state.data.map(function (item) {
            if (item.stuAnswer == "未答" || item.stuAnswer == "") {
                noSubmitID += noSubmitID + item.questionId + ",";
            }
        });

        if (noSubmitID == "未答" || noSubmitID == "") {
            noSubmitID = "-1";
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
            paperId: this.state.paperId,
            userName: global.constants.userName,
            status: newsub_status,
            noAnswerQueId: noSubmitID,
        };

        if(noSubmitID!='-1'){
            Alert.alert('','有题目未作答,是否提交？',[{text:'取消',onPress:()=>{}},{},{
                text:'确定',onPress:()=>{
                    WaitLoading.show('作业提交中...',-1)
                    http.get(url, params).then((resStr) => {
                        let resJson = JSON.parse(resStr);
                        if(resJson.success){
                            WaitLoading.dismiss()
                            Toast.showSuccessToast('作业提交成功！',1000)
                            // Alert.alert('','作业提交成功！',[{},
                            //     {text:'ok',onPress:()=>this.props.navigation.navigate({
                            //         name: "Home",
                            //         params: {
                            //             learnId: this.state.paperId,
                            //             status: change_status,
                            //         },
                            //     })}
                            //   ])
                            // this.props.navigation.navigate({
                            //     name: "Home",
                            //     params: {
                            //         learnId: this.state.paperId,
                            //         status: change_status,
                            //     },
                            // })
                            
                            this.props.navigation.navigate({
                                name: "Home",
                                params: {
                                    screen: "首页",
                                    params: {
                                        learnId: this.state.paperId,
                                        status: change_status,
                                    },
                                },
                                merge: true,
                            });
                        }else{
                            WaitLoading.show_false()
                        }
                    });
                }
            }])
        }else{
            WaitLoading.show('作业提交中...',-1)
            http.get(url, params).then((resStr) => {
                let resJson = JSON.parse(resStr);
                if(resJson.success){
                    WaitLoading.dismiss()
                    Toast.showSuccessToast('作业提交成功！',1000)
                    this.props.navigation.navigate({
                        name: "Home",
                        params: {
                            learnId: this.state.paperId,
                            status: change_status,
                        },
                    })
                }else{
                    WaitLoading.show_false()
                }
            });
        }
         

        ;
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
                        this.props.navigation.navigate({
                            name: "DoPaper",
                            params: {
                                learnId: this.props.paperId,
                                status: this.props.submit_status, //作业状态
                                selectedindex: result_Item,
                                papername: this.props.papername,
                            },
                            megre: true,
                        });
                    }}
                >
                    <View key={result_Item} style={styles.result}>
                        {/* 序号 */}
                        <Text style={{ marginRight: 10 }}>
                            ({this.state.data[result_Item].order})
                        </Text>
                        {/* 具体答案  or   红色的未答 */}
                        {this.state.data[result_Item].stuAnswer != "" ? (
                            <RenderHtml
                                contentWidth={width}
                                source={{
                                    html: this.state.data[result_Item]
                                        .stuAnswer,
                                }}
                            />
                        ) : (
                            <Text style={{ color: "red" }}>未答</Text>
                        )}
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
                    {/* 提交作业按钮区域 */}
                    <View style={styles.submit_area}>
                        <Button
                            onPress={() => {
                                this.submit_answer();
                            }}
                            style={styles.bt_submit}
                            title="交作业"
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
        paddingRight: 20,
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
