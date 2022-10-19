import {
    ScrollView,
    Text,
    TextInput,
    View,
    Image,
    Alert,
    Keyboard,
    TouchableOpacity,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { CheckBox, Layout, Radio, Button } from "@ui-kitten/components";
import http from "../../utils/http/request";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import DateTime from "./DateTime";
//   教师端  管理员创建公告
import { useNavigation } from "@react-navigation/native";
import { Waiting, WaitLoading } from "../../utils/WaitLoading/WaitLoading";
export default function Tea_CreateNotice(props) {
    const navigation = useNavigation();
    const noticeId = props.route.params.noticeId;
    const type = props.route.params.type;
    const [data, setdata] = useState([]);
    useEffect(() => {
        if (noticeId != "" && type != "") {
            updateInform();
        }
    }, []);
    function updateInform() {
        const url = global.constants.baseUrl + "teacherApp_getNoticeInfo.do";
        const params = {
            noticeId: noticeId,
            type: type, //类型：3  通知  4  公告
            token: global.constants.token,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if (resJson.success) {
                setdata(resJson.data);
            }
        });
    }

    return (
        <Tea_CreateNoticeContent
            navigation={navigation}
            type={type}
            data={data}
            noticeId={noticeId}
        />
    );
}

class Tea_CreateNoticeContent extends Component {
    constructor(props) {
        super(props);
        this.setDateStr = this.setDateStr.bind(this);
        this.state = {
            success: false,
            stuClassList: [], //id: 162,ids: ,name: 一年级一班（2017级）, value: ''，
            AllTea: false,
            AllStu: false,
            title: "",
            titleisnull: true,
            content: "",
            contentisnull: true,
            setDateFlag: "1", //  1即时发送；2定时发送
            setDate: "", // 定时发送时，定时的时间
            setDateisnull: true,
            saveOrUpdate: "", //save新建的通知，进程保存；update保存修改的通知
            noticeId: "",
        };
    }

    UNSAFE_componentWillMount() {
        console.log("will--公告", this.props.data, this.props.type);
        this.setState({
            noticeId: this.props.noticeId,
            saveOrUpdate: this.props.data != "" ? "update" : "save",
            content: this.props.data.content,
            setDate: this.props.data.setDate,
            title: this.props.data.title,
            AllStu:
                this.props.data.type == "2" || this.props.data.type == "0"
                    ? true
                    : false,
            AllTea:
                this.props.data.type == "1" || this.props.data.type == "0"
                    ? true
                    : false,
        });
    }

    UNSAFE_componentWillUpdate(nextProps) {
        if (nextProps.type == "4" && this.state.titleisnull) {
            this.setState({
                noticeId: nextProps.noticeId,
                saveOrUpdate: "update",
                content: nextProps.data.content,
                setDate: nextProps.data.setDate,
                title: nextProps.data.title,
                titleisnull: false,
                contentisnull: false,
                setDateFlag: "2",
                setDateisnull: false,
                AllStu:
                    nextProps.data.type == "2" || nextProps.data.type == "0"
                        ? true
                        : false,
                AllTea:
                    nextProps.data.type == "1" || nextProps.data.type == "0"
                        ? true
                        : false,
            });
        }
    }

    //  是  save  或  update
    saveOrUpdateNotice() {
        const url = global.constants.baseUrl + "teacherApp_saveManageNotice.do";
        const params = {
            userName: global.constants.userName,
            userCN: global.constants.userCn,
            content: this.state.content,
            title: this.state.title,
            type: this.state.AllStu ? "2" : this.state.AllTea ? "1" : "0", //类型：0全部；1全部老师；2全部学生
            setDateFlag: this.state.setDateFlag,
            setDate: this.state.setDate,
            saveOrUpdate: this.state.saveOrUpdate,
            noticeId: this.state.noticeId,
        };
        WaitLoading.show("发布中...", -1);
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if (resJson.success) {
                WaitLoading.dismiss();
                Alert.alert("", "发布成功", [
                    {},
                    {
                        text: "确定",
                        onPress: () => {
                            this.props.navigation.navigate({
                                name: "Teacher_Home",
                                params: {
                                    screen: "通知公告",
                                    params: {
                                        isRefresh: true,
                                    },
                                },
                                merge: true,
                            });
                        },
                    },
                ]);
            }
        });
    }

    setDateStr(str) {
        this.setState({ setDate: str + ":00", setDateisnull: false });
    }

<<<<<<< HEAD
    render() {
        return (
            <View
                style={{
                    backgroundColor: "#fff",
                    height: "100%",
                    borderTopWidth: 0.5,
                }}
            >
                <Waiting />
                <View
                    style={{
                        height: 50,
                        flexDirection: "row",
                        alignItems: "center",
                        backgroundColor: "#FFFFFF",
                        justifyContent: "center",
                        borderBottomWidth: 0.5,
                        borderColor: "#CBCBCB",
                    }}
                >
                    <TouchableOpacity
                        style={{ position: "absolute", left: 10 }}
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                    >
                        <Image
                            style={{ width: 30, height: 30 }}
                            source={require("../../assets/teacherLatestPage/goback.png")}
                        ></Image>
                    </TouchableOpacity>
                    <Text style={{ color: "#59B9E0", fontSize: 20 }}>
                        发布公告
                    </Text>
                </View>
=======
  render() {
    return (
      <View style={{backgroundColor:'#fff',height:'100%',borderTopWidth:0.5}}>
        <Waiting/>
        <View style={{height:50,flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',justifyContent:"center",borderBottomWidth:0.5,borderColor:"#CBCBCB"}}>
              <TouchableOpacity style={{position:'absolute',left:10}} 
                                onPress={()=>{this.props.navigation.goBack()
            }}>
                <Image style={{width:30,height:30}} source={require('../../assets/teacherLatestPage/goBack.png')} ></Image>
              </TouchableOpacity>
              <Text style={{color:'#59B9E0',fontSize:20}}>发布公告</Text>
        </View>
>>>>>>> 168413b3ca8a405caa8e12d049f7a60663bb5011

                <ScrollView style={{ paddingBottom: 20 }}>
                    <View
                        style={{
                            flexDirection: "row",
                            borderBottomWidth: 0.5,
                            padding: 10,
                            borderColor: "#CBCBCB",
                            width: "100%",
                        }}
                    >
                        <Text style={{ marginTop: 10, width: 40 }}>标题:</Text>
                        <TextInput
                            placeholder="请输入标题"
                            value={this.state.title}
                            style={{
                                width: screenWidth - 80,
                                height: 40,
                                marginLeft: 15,
                                backgroundColor: "#fff",
                                borderColor: "#DCDCDC",
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text) => {
                                if (text == "") {
                                    this.setState({
                                        title: text,
                                        titleisnull: true,
                                    });
                                } else {
                                    this.setState({
                                        title: text,
                                        titleisnull: false,
                                    });
                                }
                            }}
                        ></TextInput>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            padding: 10,
                            height: 60,
                            borderBottomWidth: 0.5,
                            borderColor: "#CBCBCB",
                        }}
                    >
                        <Text style={{ marginTop: 5 }}>对象:</Text>
                        <Layout
                            style={{ flexDirection: "row", paddingLeft: 20 }}
                        >
                            <CheckBox
                                checked={this.state.AllTea}
                                onChange={() => {
                                    this.setState({
                                        AllTea: !this.state.AllTea,
                                    });
                                }}
                            >
                                全体教师
                            </CheckBox>
                            <CheckBox
                                checked={this.state.AllStu}
                                onChange={() => {
                                    this.setState({
                                        AllStu: !this.state.AllStu,
                                    });
                                }}
                            >
                                全体学生
                            </CheckBox>
                        </Layout>
                    </View>
                    <View
                        style={{
                            flexDirection: "row",
                            padding: 10,
                            borderBottomWidth: 0.5,
                            borderColor: "#CBCBCB",
                        }}
                    >
                        <Text style={{ marginTop: 25 }}>设置:</Text>
                        <Layout
                            style={{ flexDirection: "column", paddingLeft: 20 }}
                        >
                            <Radio
                                style={{ height: 30 }}
                                checked={this.state.setDateFlag == "1"}
                                onChange={() => {
                                    if (this.state.setDateFlag != "1") {
                                        this.setState({ setDateFlag: "1" });
                                    }
                                }}
                            >
                                即时发布
                            </Radio>
                            <View style={{ flexDirection: "row" }}>
                                <Radio
                                    checked={this.state.setDateFlag == "2"}
                                    onChange={() => {
                                        if (this.state.setDateFlag != "2") {
                                            this.setState({ setDateFlag: "2" });
                                        }
                                    }}
                                >
                                    定时发布
                                </Radio>
                                <DateTime
                                    ref={(ref) => (this.mysetdate = ref)}
                                    setDateTime={this.setDateStr}
                                    selectedDateTime={this.state.setDate}
                                ></DateTime>
                                <TextInput
                                    editable={
                                        this.state.setDateFlag == "2"
                                            ? true
                                            : false
                                    }
                                    value={this.state.setDate}
                                    onFocus={() => {
                                        Keyboard.dismiss();
                                        this.mysetdate._showDatePicker();
                                    }}
                                    style={{
                                        width: screenWidth - 180,
                                        height: 38,
                                        backgroundColor:
                                            this.state.setDateFlag == "2"
                                                ? "#fff"
                                                : "#f2f4f6",
                                        borderColor: "#DCDCDC",
                                        borderWidth: 1,
                                        borderRadius: 5,
                                    }}
                                ></TextInput>
                            </View>
                        </Layout>
                    </View>
                    <View style={{ padding: 10 }}>
                        <Text>内容: (添加文字)</Text>
                        <TextInput
                            underlineColorAndroid="transparent"
                            value={this.state.content}
                            multiline={true}
                            textAlign="left"
                            textAlignVertical="top"
                            style={{
                                marginTop: 10,
                                width: screenWidth * 0.9,
                                height: screenHeight * 0.6,
                                marginLeft: 15,
                                backgroundColor: "#fff",
                                borderColor: "#DCDCDC",
                                borderWidth: 1,
                                borderRadius: 5,
                                paddingLeft: 20,
                            }}
                            onChangeText={(text) => {
                                if (text == "") {
                                    this.setState({
                                        content: text,
                                        contentisnull: true,
                                    });
                                } else {
                                    this.setState({
                                        content: text,
                                        contentisnull: false,
                                    });
                                }
                            }}
                        ></TextInput>
                    </View>
                </ScrollView>

                <View
                    style={{
                        width: "100%",
                        marginBottom: 10,
                        flexDirection: "row",
                        justifyContent: "space-around",
                    }}
                >
                    <Button
                        onPress={() => {
                            this.props.navigation.goBack();
                        }}
                        style={{ width: "40%" }}
                    >
                        取消
                    </Button>
                    <Button
                        onPress={() => {
                            //判断是否为空
                            if (this.state.titleisnull) {
                                Alert.alert("", "请输入标题！", [
                                    {},
                                    { text: "确定", onPress: () => {} },
                                ]);
                            } else if (
                                !this.state.AllTea &&
                                !this.state.AllStu
                            ) {
                                Alert.alert("", "请选择发布对象！", [
                                    {},
                                    { text: "确定", onPress: () => {} },
                                ]);
                            } else if (this.state.contentisnull) {
                                Alert.alert("", "请先输入内容", [
                                    {},
                                    { text: "确定", onPress: () => {} },
                                ]);
                            } else if (
                                this.state.setDateFlag == "2" &&
                                this.state.setDateisnull
                            ) {
                                Alert.alert("", "请设置定时发布时间！", [
                                    {},
                                    { text: "确定", onPress: () => {} },
                                ]);
                            } else {
                                this.saveOrUpdateNotice();
                            }
                        }}
                        style={{ width: "40%" }}
                    >
                        确定
                    </Button>
                </View>
            </View>
        );
    }
}
