import {
    Text,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    FlatList,
    Alert,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import http from "../../../utils/http/request";
import { Button } from "@ui-kitten/components";
import { useNavigation } from "@react-navigation/native";
import { Flex } from "@ant-design/react-native";
import Toast from "../../../utils/Toast/Toast";
import { SearchBar } from "@ant-design/react-native";
import { OverflowMenu, MenuItem } from "@ui-kitten/components";
import { screenHeight, screenWidth } from "../../../utils/Screen/GetSize";
let SearchText = "";
export default function PaperList(props) {
    const [data, setdata] = useState([]);
    const [success, setsuccess] = useState(false);
    const [status, setstatus] = useState("0"); //记录批改状态  2未批改；4以批改，空或者0代表全部
    const [isRefresh, setisRefresh] = useState(false);
    const navigation = useNavigation();
    const [CorrectAllQuestion, setCorrectAllQuestion] = useState(); //记录是否批改的时候显示全部试题
    const [CorrectmoduleVisible, setCorrectmoduleVisible] = useState(false);
    const [AllmoduleVisible, setAllmoduleVisible] = useState(false);
    useEffect(() => {
        if (props.route.params.whohassubmit != null) {
            setdata([]);
            fetchData((isRefreshing = false), (statusa = "0"));
        } else {
            get_CorrectAllQuestion();
            if (!success) {
                fetchData((isRefreshing = false), (statusa = "0"));
            }
        }
        return () => {
            SearchText = "";
        };
    }, [props.route.params.whohassubmit]);

    function fetchData(isRefreshing = false, statusa = "0") {
        const url =
            global.constants.baseUrl + "teacherApp_getSubmitHomeworkStuList.do";
        const params = {
            taskId: props.route.params.taskId, //作业id或者导学案id
            teacherId: global.constants.userName, // 老师登录名
            type: props.route.params.type, //  paper,表示作业；learnPlan表示导学案
            status: statusa, //  2未批改；4以批改，空或者0代表全部
            searchStr: SearchText,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            setdata(resJson.data);
            setsuccess(resJson.success);
            if (resJson.success) {
                if (isRefreshing) {
                    Toast.showSuccessToast("刷新成功！", 200);
                }
                setisRefresh(false);
            } else {
                setisRefresh(false);
                Toast.showSuccessToast("刷新失败！", 200);
            }
        });
    }

    function Submit_CorrectAllQuestion(CorrectAllQuestionstatus) {
        const url = global.constants.baseUrl + "teacherApp_saveCoorectMode.do";
        const params = {
            userName: global.constants.userName,
            mode: CorrectAllQuestionstatus ? "1" : "2", //  1逐题批阅；(true)    2只显示需手工批阅试题 (false)
        };
        http.get(url, params).then((resStr) => {});
    }

    //是否模式为  批阅全部试题
    function get_CorrectAllQuestion() {
        const url = global.constants.baseUrl + "teacherApp_getCoorectMode.do";
        const params = {
            userName: global.constants.userName,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            setCorrectAllQuestion(resJson.data == "1" ? true : false);
        });
    }

    function _renderItemView(dataItem) {
        return (
            <Paper_List_Details
                navigation={navigation}
                source={dataItem}
                type={props.route.params.type}
                CorrectAllQuestion={CorrectAllQuestion}
            />
        );
    }

    function _onRefresh() {
        setdata([]);
        setisRefresh(true);
        fetchData((isRefreshing = true));
    }

    function renderAvatarAll() {
        return (
            <TouchableOpacity
                style={{ position: "absolute", right: 50 }}
                onPress={() => {
                    setAllmoduleVisible(true);
                }}
            >
                <Image
                    style={{ width: 30, height: 30 }}
                    source={require("../../../assets/teacherLatestPage/set.png")}
                />
            </TouchableOpacity>
        );
    }

    function renderAvatarCorrect() {
        return (
            <TouchableOpacity
                style={{ position: "absolute", right: 15 }}
                onPress={() => {
                    setCorrectmoduleVisible(true);
                }}
            >
                <Image
                    style={{ width: 30, height: 30 }}
                    source={require("../../../assets/teacherLatestPage/search.png")}
                />
            </TouchableOpacity>
        );
    }

    return (
<<<<<<< HEAD
        <View
            style={{
                backgroundColor: "#FFFFFF",
                height: "100%",
                flexDirection: "column",
            }}
        >
            <View
                style={{
                    height: 60,
                    flexDirection: "row",
                    alignItems: "center",
                    borderBottomWidth: 0.5,
                    borderColor: "#CBCBCB",
                }}
            >
                <TouchableOpacity
                    style={{ marginLeft: 10, marginRight: 10 }}
                    onPress={() => {
                        navigation.goBack({
                            name: "CorrectPaperList",
                            params: {
                                taskId: props.route.params.taskId,
                                type: props.route.params.type,
                            },
                        });
                    }}
                >
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require("../../../assets/teacherLatestPage/goback.png")}
                    ></Image>
                </TouchableOpacity>
=======
      
        <View style={{backgroundColor:'#FFFFFF',height:"100%",flexDirection:'column'}}>
          <View style={{height:60,flexDirection:'row',alignItems:'center',borderBottomWidth:0.5,borderColor:'#CBCBCB'}}>
              <TouchableOpacity style={{marginLeft:10,marginRight:10}} 
                                onPress={()=>{navigation.goBack({
                                            name: 'CorrectPaperList',
                                            params:{ 
                                                taskId:props.route.params.taskId,
                                                type:props.route.params.type
                                                  }
                                        })
            }}>
                <Image style={{width:30,height:30}} source={require('../../../assets/teacherLatestPage/goBack.png')} ></Image>
              </TouchableOpacity>
>>>>>>> 168413b3ca8a405caa8e12d049f7a60663bb5011

                <View style={{ width: "62%" }}>
                    <SearchBar
                        style={{ width: "100%" }}
                        value={{ SearchText }}
                        placeholder="学生姓名"
                        // ref={(ref) => (setSearchText(ref))}
                        onCancel={() => {
                            setdata([]);
                            fetchData(
                                (isRefreshing = false),
                                (statusa = status)
                            );
                        }}
                        onChange={(value) => {
                            SearchText = value;
                        }}
                        onBlur={() => {
                            setdata([]);
                            fetchData(
                                (isRefreshing = false),
                                (statusa = status)
                            );
                        }}
                        cancelText="搜索"
                        // showCancelButton
                    />
                </View>

                <OverflowMenu
                    style={{ width: 200 }}
                    anchor={renderAvatarAll}
                    visible={AllmoduleVisible}
                    onBackdropPress={() => {
                        setAllmoduleVisible(false);
                    }}
                >
                    <MenuItem
                        title={"只显示需要手工批阅试题"}
                        key={1}
                        onPress={() => {
                            if (CorrectAllQuestion) {
                                setCorrectAllQuestion(false);
                                Submit_CorrectAllQuestion(false);
                            }

                            Toast.showSuccessToast(
                                "设置批改模式为:只显示需手工批阅试题",
                                1000
                            );
                            Alert.alert("设置批改模式为:只显示需手工批阅试题");
                            setAllmoduleVisible(false);
                        }}
                    />
                    <MenuItem
                        title={"显示全部试题"}
                        key={2}
                        onPress={() => {
                            if (!CorrectAllQuestion) {
                                setCorrectAllQuestion(true);
                                Submit_CorrectAllQuestion(true);
                            }

                            Toast.showSuccessToast(
                                "设置批改模式为:显示全部",
                                1000
                            );
                            Alert.alert("设置批改模式为:显示全部");
                            setAllmoduleVisible(false);
                        }}
                    />
                </OverflowMenu>
                <OverflowMenu
                    style={{ width: 80 }}
                    anchor={renderAvatarCorrect}
                    visible={CorrectmoduleVisible}
                >
                    <MenuItem
                        title={"已批改"}
                        key={3}
                        onPress={() => {
                            setdata([]);
                            setstatus("4");
                            fetchData((isRefreshing = true), (statusa = "4"));
                            setCorrectmoduleVisible(false);
                        }}
                    />
                    <MenuItem
                        title={"未批改"}
                        key={4}
                        onPress={() => {
                            setdata([]);
                            setstatus("2");
                            fetchData((isRefreshing = true), (statusa = "2"));
                            setCorrectmoduleVisible(false);
                        }}
                    />
                </OverflowMenu>
            </View>

            {data.length > 0 ? (
                <View
                    style={{
                        alignItems: "center",
                        paddingBottom: 10,
                        flex: 1,
                        backgroundColor: "#FFFFFF",
                        borderColor: "#000000",
                        borderTopWidth: 0.5,
                    }}
                >
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        //定义数据显示效果
                        data={data}
                        renderItem={_renderItemView.bind(this)}
                        //下拉刷新相关
                        onRefresh={() => _onRefresh()}
                        refreshing={isRefresh}
                    />
                </View>
            ) : (
                <View style={{ width: "100%", alignItems: "center", flex: 1 }}>
                    <Text style={{ marginTop: 20, fontSize: 15 }}>
                        暂时没有学生提交答案
                    </Text>
                </View>
            )}

            <View
                style={{
                    alignItems: "center",
                    backgroundColor: "#FFFFFF",
                    height: 60,
                }}
            >
                <Button
                    appearance={data.length > 0 ? "filled" : "outline"}
                    onPress={() => {
                        data.length > 0
                            ? navigation.navigate({
                                  name: "LookCorrectDetails",
                                  params: {
                                      taskId: props.route.params.taskId,
                                      type: props.route.params.type,
                                  },
                              })
                            : "";
                    }}
                    style={{ position: "relative", width: "80%" }}
                >
                    查看报告
                </Button>
            </View>
        </View>
    );
}
class Paper_List_Details extends Component {
    constructor(props) {
        super(props);
        this.state = {
            CorrectAllQuestion: "",
            type: "",

            teaPreview: "",
            time: "",
            paperId: "",
            scoreCount: "",
            status: "", // 2未批改；4以批改，5代表已批改已阅
            optionTimeStr: "",
            score: "",
            userPhoto: "",
            userName: "",
            userCn: "",
            description: "",
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({
            CorrectAllQuestion: this.props.CorrectAllQuestion,
            type: this.props.type,
            ...this.props.source.item,
        });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        this.setState({ ...nextProps });
    }

    render() {
        return (
            <TouchableOpacity
                onPress={() => {
                    //检查权限
                    const url =
                        global.constants.baseUrl +
                        "studentApp_checkTaskStatus.do";
                    const params = {
                        taskId: this.state.paperId,
                        userName: this.state.userName,
                        userType: "teacher",
                        teacherId: global.constants.userName,
                    };
                    http.get(url, params).then((resStr) => {
                        let resJson = JSON.parse(resStr);
                        if (resJson.data) {
                            this.props.navigation.navigate({
                                name: "Correcting_Paper",
                                params: {
                                    CorrectAllQuestion:
                                        this.props.CorrectAllQuestion,
                                    taskId: this.state.paperId,
                                    userCn: this.state.userCn,
                                    userName: this.state.userName,
                                    selectedindex: 0,
                                    type: this.props.type,
                                    correctingstatus: this.state.status, //  2 未批改     4   已批改
                                },
                            });
                        } else {
                            Alert.alert("", resJson.message, [
                                {},
                                {},
                                { text: "确定", onPress: () => {} },
                            ]);
                        }
                    });
                }}
            >
                <View
                    style={{
                        borderBottomColor: "#000000",
                        borderBottomWidth: 0.5,
                        flexDirection: "row",
                        height: 80,
                        padding: 15,
                    }}
                >
                    <View>
                        <Image
                            style={{ height: 50, width: 50, borderRadius: 25 }}
                            source={{ uri: this.state.userPhoto }}
                        ></Image>
                    </View>

                    <View
                        style={{
                            paddingLeft: 15,
                            width: "90%",
                            justifyContent: "center",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                marginBottom: 8,
                                marginRight: 5,
                            }}
                        >
                            <Text style={{ width: "25%" }}>
                                {this.state.userCn}
                            </Text>

                            {this.state.status == "4" ||
                            this.state.status == "5" ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        width: "25%",
                                    }}
                                >
                                    <Text style={{ color: "#FF0000" }}>
                                        已批改
                                    </Text>
                                    <Image
                                        style={{
                                            width: 17,
                                            height: 17,
                                            marginLeft: 5,
                                        }}
                                        source={require("../../../assets/teacherLatestPage/hasCheck.png")}
                                    ></Image>
                                </View>
                            ) : this.state.status == "2" ? (
                                <View
                                    style={{
                                        flexDirection: "row",
                                        width: "25%",
                                    }}
                                >
                                    <Text style={{ color: "#008000" }}>
                                        未批改
                                    </Text>
                                    <Image
                                        style={{
                                            width: 17,
                                            height: 17,
                                            marginLeft: 5,
                                        }}
                                        source={require("../../../assets/teacherLatestPage/noCheck.png")}
                                    ></Image>
                                </View>
                            ) : (
                                <Text></Text>
                            )}

                            <Text style={{ width: "25%" }}>
                                {this.state.description}
                            </Text>
                            <Text>{this.state.optionTimeStr}</Text>
                        </View>

                        {/* 已批改的作业才会展示分数 */}
                        {this.state.status == "4" ||
                        this.state.status == "5" ? (
                            <View style={{ flexDirection: "row" }}>
                                <Text style={{ marginRight: 20 }}>得分:</Text>
                                <Text>{this.state.score}</Text>
                                <Text> 分 / </Text>
                                <Text>{this.state.scoreCount} 分</Text>
                            </View>
                        ) : (
                            <View></View>
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
