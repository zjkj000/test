import React, { Component, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";

import { Button } from "@ui-kitten/components";
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import "../../utils/global/constants";
import { useNavigation } from "@react-navigation/native";

export default function Tea_Inform(props) {
    const navigation = useNavigation();
    const taskId = props.route.params.taskId;
    const type = props.route.params.type;
    const data = props.route.params.data;
    const fNumber = props.route.params.fNumber; //  0已读  1 未读
    useEffect(() => {
        if (fNumber == "1") {
            readInform();
        }
    }, []);

    function readInform() {
        const url = global.constants.baseUrl + "studentApp_readNotice.do";
        const params = {
            type: type, //类型：3  通知  4  公告
            userName: global.constants.userName,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
        });
    }
    return (
        <Tea_Informcontent
            navigation={navigation}
            type={type}
            taskId={taskId}
            data={data}
        />
    );
}

class Tea_Informcontent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            classTimeId: "",
            type: "",
            author: "",
            content: "",
            title: "",
            noticeId: "",
            num: "",
            readNum: "",
            readList: [],
            noReadNum: "",
            noreadList: [],
            selectReadStuListType: "", //  0 都没选   1 查看已读    2 查看未读
            isAuthor: false, //true，则显示修改与撤回按钮，false不显示
            isUpdate: false, //true,则修改按钮可以点击，false不可点击
        };
    }

    //http://192.168.1.57:8080/AppServer/ajax/studentApp_readNotice.do?userName=UN97221&type=3&classTimeId=13033&callback=ha

    deleteInform(classTimeId) {
        const url = global.constants.baseUrl + "teacherApp_deleteNotice.do";
        const params = {
            noticeId: classTimeId,
            token: global.constants.token,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if (resJson.success) {
                Alert.alert("", "撤回成功！", [
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

    fetchData(fid, type) {
        const url = global.constants.baseUrl + "teacherApp_lookNotice.do";
        const params = {
            classTimeId: fid,
            type: type,
            userName: global.constants.userName,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if (resJson.success) {
                this.setState({
                    content: resJson.data.content,
                    title: resJson.data.title,
                    num: resJson.data.num,
                    readList: resJson.data.readList,
                    readNum: resJson.data.readNum,
                    noReadNum: resJson.data.noReadNum,
                    noreadList: resJson.data.noreadList,
                    isAuthor: resJson.data.isAuthor,
                    isUpdate: resJson.data.isUpdate,
                    author: resJson.data.author,
                });
            }
        });
    }

<<<<<<< HEAD
    UNSAFE_componentWillMount() {
        this.setState({
            classTimeId: this.props.taskId,
            type: this.props.type,
        });
        this.fetchData(this.props.taskId, this.props.type);
    }
=======
  UNSAFE_componentWillMount(){
    this.setState({classTimeId:this.props.taskId,type:this.props.type})
    this.fetchData(this.props.taskId,this.props.type)
  }
  
  render() {
    return (
      <View style={{backgroundColor:'#fff',height:'100%'}}>
            <View style={{height:50,flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',justifyContent:"center",borderBottomWidth:0.5,borderColor:"#CBCBCB"}}>
                  <TouchableOpacity style={{position:'absolute',left:10}} 
                                    onPress={()=>{this.props.navigation.goBack()
                }}>
                    <Image style={{width:30,height:30}} source={require('../../assets/teacherLatestPage/goBack.png')} ></Image>
                  </TouchableOpacity>
                  <Text style={{color:'#59B9E0',fontSize:20}}>通知</Text>
            </View>
            <ScrollView style={{width:screenWidth}}>
                {/* *未读的通知或公告将调用Api修改状态 */}
                {/* {(status == 5)? (this.updateStatus(status , type , learnId)) : null} */}
                <View style={{paddingBottom:20,borderBottomWidth:0.5}}>
                    <Text style={styles.title}>{this.state.title}</Text>
                    <Flex style={styles.flexContent}>
                        <Flex.Item style={styles.createrNameImg}>
                            <Image source={require('../../assets/LatestTaskImages/teName.png')} />
                        </Flex.Item>
                        <Flex.Item style={styles.createrNameText}>
                            <Text>{this.state.author}</Text>
                        </Flex.Item>
                        <Flex.Item style={styles.timeImg}>
                            <Image source={require('../../assets/LatestTaskImages/timeClock.png')} />
                        </Flex.Item>
                        <Flex.Item style={styles.timeText}>
                            <Text>{this.props.data.fTime}</Text>
                        </Flex.Item>
                    </Flex>
                    <Text style={styles.content}>{this.state.content}</Text>
                </View> 
>>>>>>> 168413b3ca8a405caa8e12d049f7a60663bb5011

    render() {
        return (
            <View style={{ backgroundColor: "#fff", height: "100%" }}>
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
                    <Text style={{ color: "#59B9E0", fontSize: 20 }}>通知</Text>
                </View>
                <ScrollView style={{ width: screenWidth }}>
                    {/* *未读的通知或公告将调用Api修改状态 */}
                    {/* {(status == 5)? (this.updateStatus(status , type , learnId)) : null} */}
                    <View style={{ paddingBottom: 20, borderBottomWidth: 0.5 }}>
                        <Text style={styles.title}>{this.state.title}</Text>
                        <Flex style={styles.flexContent}>
                            <Flex.Item style={styles.createrNameImg}>
                                <Image
                                    source={require("../../assets/LatestTaskImages/teName.png")}
                                />
                            </Flex.Item>
                            <Flex.Item style={styles.createrNameText}>
                                <Text>{this.state.author}</Text>
                            </Flex.Item>
                            <Flex.Item style={styles.timeImg}>
                                <Image
                                    source={require("../../assets/LatestTaskImages/timeClock.png")}
                                />
                            </Flex.Item>
                            <Flex.Item style={styles.timeText}>
                                <Text>{this.props.data.fTime}</Text>
                            </Flex.Item>
                        </Flex>
                        <Text style={styles.content}>{this.state.content}</Text>
                    </View>

                    <View style={{ paddingTop: 20 }}>
                        <View style={{ flexDirection: "row" }}>
                            <View
                                style={{
                                    width: "50%",
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    padding: 10,
                                    backgroundColor:
                                        this.state.selectReadStuListType == "1"
                                            ? "#C0C0C0"
                                            : "#fff",
                                }}
                            >
                                <Text>已读学生:(</Text>
                                <Text style={{ color: "#59B9E0" }}>
                                    {this.state.readNum}
                                </Text>
                                <Text style={{ marginRight: 10 }}>
                                    /{this.state.num})
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (
                                            this.state.selectReadStuListType ==
                                            "1"
                                        ) {
                                            this.setState({
                                                selectReadStuListType: "0",
                                            });
                                        } else {
                                            this.setState({
                                                selectReadStuListType: "1",
                                            });
                                        }
                                    }}
                                >
                                    {this.state.selectReadStuListType == "1" ? (
                                        <Image
                                            style={{ width: 20, height: 20 }}
                                            source={require("../../assets/photoImage/top.png")}
                                        ></Image>
                                    ) : (
                                        <Image
                                            style={{ width: 20, height: 20 }}
                                            source={require("../../assets/photoImage/bot.png")}
                                        ></Image>
                                    )}
                                </TouchableOpacity>
                            </View>
                            <View
                                style={{
                                    width: "50%",
                                    justifyContent: "center",
                                    flexDirection: "row",
                                    padding: 10,
                                    backgroundColor:
                                        this.state.selectReadStuListType == "2"
                                            ? "#C0C0C0"
                                            : "#fff",
                                }}
                            >
                                <Text>未读学生:(</Text>
                                <Text style={{ color: "#59B9E0" }}>
                                    {this.state.noReadNum}
                                </Text>
                                <Text style={{ marginRight: 10 }}>
                                    /{this.state.num})
                                </Text>
                                <TouchableOpacity
                                    onPress={() => {
                                        if (
                                            this.state.selectReadStuListType ==
                                            "2"
                                        ) {
                                            this.setState({
                                                selectReadStuListType: "0",
                                            });
                                        } else {
                                            this.setState({
                                                selectReadStuListType: "2",
                                            });
                                        }
                                    }}
                                >
                                    {this.state.selectReadStuListType == "2" ? (
                                        <Image
                                            style={{ width: 20, height: 20 }}
                                            source={require("../../assets/photoImage/top.png")}
                                        ></Image>
                                    ) : (
                                        <Image
                                            style={{ width: 20, height: 20 }}
                                            source={require("../../assets/photoImage/bot.png")}
                                        ></Image>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                        {this.state.selectReadStuListType == "1" ? (
                            <View
                                style={{
                                    padding: 15,
                                    backgroundColor: "#C0C0C0",
                                }}
                            >
                                <Text style={{ fontSize: 15 }}>
                                    {this.state.readList.join()}
                                </Text>
                            </View>
                        ) : this.state.selectReadStuListType == "2" ? (
                            <View
                                style={{
                                    padding: 15,
                                    backgroundColor: "#C0C0C0",
                                }}
                            >
                                <Text style={{ fontSize: 15 }}>
                                    {this.state.noreadList.join()}
                                </Text>
                            </View>
                        ) : (
                            <></>
                        )}
                    </View>
                </ScrollView>
                {/* 是否显示两个按钮 */}
                {this.state.isAuthor ? (
                    <View
                        style={{
                            width: "100%",
                            paddingBottom: 10,
                            flexDirection: "row",
                            justifyContent: "space-around",
                            backgroundColor: "#fff",
                        }}
                    >
                        <Button
                            accessible={this.state.isUpdate}
                            onPress={() => {
                                if (this.state.isUpdate) {
                                    //可以修改
                                    this.props.navigation.navigate({
                                        name: "CreateInform",
                                        params: {
                                            noticeId: this.state.classTimeId,
                                            type: this.state.type,
                                        },
                                    });
                                }
                            }}
                            style={{
                                backgroundColor: this.state.isUpdate
                                    ? "#62C3E4"
                                    : "#A9A9A9",
                                width: "40%",
                            }}
                        >
                            修改
                        </Button>
                        <Button
                            style={{ width: "40%" }}
                            onPress={() => {
                                //可以撤回
                                this.deleteInform(this.state.classTimeId);
                            }}
                        >
                            撤回
                        </Button>
                    </View>
                ) : (
                    <View style={{ backgroundColor: "#fff" }}></View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    title: {
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
        marginTop: 10,
        marginBottom: 20,
    },
    flexContent: {
        paddingLeft: screenWidth * 0.25,
        paddingRight: screenWidth * 0.25,
        marginBottom: 20,
    },
    createrNameImg: {
        flex: 1,
    },
    createrNameText: {
        flex: 2,
    },
    timeImg: {
        flex: 1,
    },
    timeText: {
        flex: 2,
    },
    content: {
        fontSize: 16,
        marginRight: 20,
        marginLeft: 20,
    },
});
