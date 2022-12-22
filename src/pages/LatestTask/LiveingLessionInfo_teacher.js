import {
    Text,
    View,
    Image,
    ScrollView,
    FlatList,
    TouchableOpacity,
    Alert,
    NativeModules,
    Modal,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import {
    CheckBox,
    Layout,
    OverflowMenu,
    MenuItem,
    Button,
} from "@ui-kitten/components";

import { screenHeight } from "../../utils/Screen/GetSize";
import { SearchBar } from "@ant-design/react-native";
import http from "../../utils/http/request";
import Toast from "../../utils/Toast/Toast";
import Clipboard from "@react-native-community/clipboard";
let SearchText = "";
let currentPage = 1;
export default function LiveingLessionInfo_teacher(props) {
    const navigation = useNavigation();
    const [data, setdata] = useState([]);
    const [type, settype] = useState("All");
    const [moduleVisible, setmoduleVisible] = useState(false);
    const [isRefresh, setisRefresh] = useState(false);
    const [chooseClassCamera, setchooseClassCamera] = useState(true); //代表开启摄像头
    const [chooseClassMicrophone, setchooseClassMicrophone] = useState(false); //代表开启麦克风
    const [chooseClassName, setchooseClassName] = useState("");
    const [chooseClassroomId, setchooseClassroomId] = useState("");
    const [chooseClasstitle, setchooseClasstitle] = useState("");
    const [chooseClasssubjectId, setchooseClasssubjectId] = useState("");
    const [chooseClassketangId, setchooseClassketangId] = useState("");

    const [chooseClassmodalVisible, setchooseClassmodalVisible] =
        useState(false);
    const [showFoot, setshowFoot] = useState("0"); //0代表还可以加载  1代表没数据了
    useEffect(() => {
        const timer = setInterval(() => {
            console.log("刷新");
            currentPage = 1;
            setisRefresh(true);
            setdata([]);
            fetchData(type, 1, true);
        }, 30000);

        if (props.route.params.flag == "refresh") {
            setdata([]);
            fetchData("0", 1);
        }

        fetchData("0", 1);
        return () => {
            SearchText = "";
            clearInterval(timer);
        };
    }, []);

    function fetchData(newtype, newcurrentPage, isRefreshing = false) {
        const url = global.constants.baseUrl + "teacherApp_getZBLiveList.do";
        const params = {
            userId: global.constants.userName,
            currentRole: "1", //1我讲的直播课；2我听得直播课
            type: newtype, //默认传  0全部，1未开始2直播中3已结束
            searchStr: SearchText, //搜索字段加码
            currentPage: newcurrentPage, //当前页，第一页传1
            userCn: global.constants.userCn, //教师真实姓名加码
            userPhoto: global.constants.userPhoto, //教师头像路径
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            console.log("请求到的直播课数据列表");
            if (newcurrentPage == 1) {
                setshowFoot("0"); //第一页还可以请求
                setdata(resJson.list);
            } else {
                setdata(data.concat(resJson.list));
            }
            if (resJson.list.length < 30) {
                setshowFoot("1"); //数据<30  就代表没有了
            }

            if (isRefreshing) {
                Toast.showSuccessToast("刷新成功", 500);
                setisRefresh(false);
            }
        });
    }

    function renderAvatar() {
        return (
            <TouchableOpacity onPress={() => setmoduleVisible(true)}>
                <Text style={{ fontSize: 15, color: "#87CEFA" }}>
                    {type == "2"
                        ? "未开始"
                        : type == "1"
                        ? "直播中"
                        : type == "3"
                        ? "已结束"
                        : "全部"}
                </Text>
                <Text style={{ position: "absolute", right: 5 }}>▼</Text>
            </TouchableOpacity>
        );
    }
    function _renderItemView(dataItem) {
        return (
            <LiveingLessonContent_teacher
                navigation={navigation}
                source={dataItem}
                setchooseClassmodalVisible={setchooseClassmodalVisible}
                setchooseClassName={setchooseClassName}
                setchooseClassketangId={setchooseClassketangId}
                setchooseClasstitle={setchooseClasstitle}
                setchooseClasssubjectId={setchooseClasssubjectId}
                setchooseClassroomId={setchooseClassroomId}
            />
        );
    }

    function _onRefresh() {
        currentPage = 1;
        setisRefresh(true);
        fetchData(type, 1, true);
    }

    function _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (showFoot == 0) {
            fetchData(type, currentPage + 1);
            currentPage = currentPage + 1; //如果还有 页码要+1
        }
    }

    function _renderFooter() {
        if (showFoot == "1") {
            return (
                <View>
                    <View
                        style={{
                            height: 30,
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                color: "#999999",
                                fontSize: 14,
                                marginTop: 5,
                                marginBottom: 5,
                            }}
                        >
                            没有更多数据了
                        </Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View
                    style={{
                        height: 24,
                        justifyContent: "center",
                        alignItems: "center",
                        marginBottom: 10,
                    }}
                >
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        }
    }

    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={chooseClassmodalVisible}
                onRequestClose={() => {
                    setchooseClassmodalVisible(false);
                }}
            >
                <View style={{ backgroundColor: "#000000", opacity: 0.6 }}>
                    <View
                        style={{
                            height: "100%",
                            alignItems: "center",
                            backgroundColor: "#FFFFFF",
                        }}
                    >
                        <View
                            style={{
                                backgroundColor: "#FFFFFF",
                                marginTop: "60%",
                            }}
                        >
                            <View
                                style={{
                                    justifyContent: "center",
                                    backgroundColor: "#FFFFFF",
                                    padding: 10,
                                    alignItems: "center",
                                }}
                            >
                                <View style={{ margin: 20 }}>
                                    <Text
                                        style={{ fontSize: 20, color: "red" }}
                                    >
                                        {chooseClasstitle}
                                    </Text>
                                </View>
                                {/* 选择是否开启  摄像头   麦克风 */}
                                <Layout style={{ flexDirection: "row" }}>
                                    <CheckBox
                                        checked={chooseClassCamera}
                                        onChange={() => {
                                            setchooseClassCamera(
                                                !chooseClassCamera
                                            );
                                        }}
                                    >
                                        开启摄像头
                                    </CheckBox>
                                    <CheckBox
                                        checked={chooseClassMicrophone}
                                        onChange={() => {
                                            setchooseClassMicrophone(
                                                !chooseClassMicrophone
                                            );
                                        }}
                                    >
                                        开启麦克风
                                    </CheckBox>
                                </Layout>

                                <View
                                    style={{
                                        flexDirection: "row",
                                        width: "50%",
                                        justifyContent: "space-between",
                                        marginBottom: 20,
                                        marginTop: 50,
                                    }}
                                >
                                    <TouchableOpacity
                                        onPress={() => {
                                            setchooseClassmodalVisible(false);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#59B9E0",
                                                fontSize: 18,
                                            }}
                                        >
                                            取消
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            // 跳转教师端直播页面
                                            NativeModules.IntentMoudle.startActivityFromJS(
                                                "MainActivity_tea",
                                                global.constants.userName +
                                                    "-@-" + //userid id
                                                    global.constants.userCn +
                                                    "-@-" + //usercn 中文名
                                                    chooseClassroomId +
                                                    "-@-" + //roomid 直播房间号
                                                    chooseClasstitle +
                                                    "-@-" + //直播房间名称
                                                    chooseClasssubjectId +
                                                    "-@-" + //学科ID
                                                    chooseClassketangId +
                                                    "-@-" + //课堂ID
                                                    chooseClassName +
                                                    "-@-" + //课堂名称
                                                    global.constants.userPhoto +
                                                    "-@-" +
                                                    chooseClassCamera +
                                                    "-@-" +
                                                    chooseClassMicrophone
                                            );
                                            setchooseClassmodalVisible(false);
                                        }}
                                    >
                                        <Text
                                            style={{
                                                color: "#59B9E0",
                                                fontSize: 18,
                                            }}
                                        >
                                            上课
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

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
                        navigation.goBack();
                    }}
                >
                    <Image
                        style={{ width: 30, height: 30 }}
                        source={require("../../assets/teacherLatestPage/goBack.png")}
                    ></Image>
                </TouchableOpacity>
                <Text style={{ color: "#59B9E0", fontSize: 20 }}>
                    我讲的直播课
                </Text>
                <TouchableOpacity
                    style={{ position: "absolute", right: 10 }}
                    onPress={() => {
                        navigation.navigate("LiveingLession_add", {
                            type: "save",
                            roomId: "", //新建直播课   没有roomid
                        });
                    }}
                >
                    {/* 新建直播课按钮 */}
                    <Image
                        style={{ width: 20, height: 20 }}
                        source={require("../../assets/teacherLatestPage/create2.png")}
                    ></Image>
                </TouchableOpacity>
            </View>
            <View style={{ padding: 10, paddingBottom: 0 }}>
                {/* 筛选框    搜索框 */}
                <View style={{ flexDirection: "row", margin: 5 }}>
                    <View
                        style={{
                            width: 80,
                            height: 40,
                            padding: 10,
                            paddingRight: 0,
                            backgroundColor: "#fff",
                            marginTop: 2,
                        }}
                    >
                        <OverflowMenu
                            style={{
                                borderColor: "#000",
                                borderWidth: 0.8,
                                width: 80,
                            }}
                            anchor={renderAvatar}
                            visible={moduleVisible}
                            onBackdropPress={() => {
                                setmoduleVisible(false);
                            }}
                        >
                            <MenuItem
                                title={"全部"}
                                key={0}
                                onPress={() => {
                                    setdata([]);
                                    setmoduleVisible(false);
                                    settype("0");
                                    currentPage = 1;
                                    fetchData("0", 1);
                                }}
                            />
                            <MenuItem
                                title={"未开始"}
                                key={1}
                                onPress={() => {
                                    setdata([]);
                                    setmoduleVisible(false);
                                    settype("2");
                                    currentPage = 1;
                                    fetchData("2", 1);
                                }}
                            />
                            <MenuItem
                                title={"直播中"}
                                key={2}
                                onPress={() => {
                                    setdata([]);
                                    setmoduleVisible(false);
                                    settype("1");
                                    currentPage = 1;
                                    fetchData("1", 1);
                                }}
                            />
                            <MenuItem
                                title={"已结束"}
                                key={3}
                                onPress={() => {
                                    setdata([]);
                                    setmoduleVisible(false);
                                    settype("3");
                                    currentPage = 1;
                                    fetchData("3", 1);
                                }}
                            />
                        </OverflowMenu>
                    </View>
                    {/* 搜索框 */}
                    <View style={{ width: "80%" }}>
                        <SearchBar
                            style={{ height: 40 }}
                            value={{ SearchText }}
                            placeholder="请输入课程名称或课堂号搜索"
                            onCancel={() => {
                                setdata([]);
                                fetchData(type, 1);
                            }}
                            onChange={(value) => {
                                SearchText = value;
                            }}
                            onBlur={() => {
                                setdata([]);
                                fetchData(type, 1);
                            }}
                            cancelText="搜索"
                            //showCancelButton
                        />
                    </View>
                </View>
                {/* 展示直播课数据 */}
                <FlatList
                    style={{ height: screenHeight - 120 }}
                    showsVerticalScrollIndicator={false}
                    //定义数据显示效果
                    data={data}
                    renderItem={_renderItemView.bind(this)}
                    //下拉刷新相关
                    onRefresh={() => _onRefresh()}
                    refreshing={isRefresh}
                    ListFooterComponent={_renderFooter.bind(this)}
                    onEndReached={_onEndReached.bind(this)}
                    onEndReachedThreshold={0.5}
                />
            </View>
        </>
    );
}

class LiveingLessonContent_teacher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            title: "", //名称//直播页面需要传递的参数
            roomId: "", //课堂号//直播页面需要传递的参数
            hour: "", //课节时长
            subjectName: "", //学科名称
            minutes: "", //授课对象
            showStrTop: "", //顶部时间  //status==1,此处显示进入课堂按钮   2 则顶部时间位置显示按钮，提示”进入教室
            showStrBottom: "", //底部时间
            status: "", //1直播中  2未开始  3已结束

            className: "",
            hostUserId: "", //主讲人登录名，需要传递的参数
            ketangId: "", //直播页面需要传递的参数
            ketangName: "", //直播页面需要传递的参数
            stuNum: "",
            phone: "", //直播页面需要传递的参数
            teacherId: "", //直播页面需要传递的参数
            hostUserName: "", //主讲人姓名，直播页面需要传递的参
            teacherName: "",
            subjectId: "", //直播页面需要传递的参数
        };
    }

    UNSAFE_componentWillMount() {
        this.setState({ ...this.props.source.item });
    }

    // 删除直播课
    DeleteLivingLession(rommid) {
        const url =
            "http://www.cn901.com/ShopGoods/ajax/livePlay_deleteZbLive.do";
        const params = {
            roomId: rommid, //房间号
        };
        http.get(url, params).then((resStr) => {
            console.log(resStr);
            let resJson = JSON.parse(resStr);
            if ("success" == resJson.status) {
                Alert.alert("", "刪除成功", [
                    {},
                    {
                        text: "确定",
                        onPress: () => {
                            this.props.navigation.navigate({
                                name: "LiveingLessionInfo_teacher",
                                params: {
                                    flag: "refresh",
                                },
                                merge: true,
                            });
                        },
                    },
                ]);
                this.props.navigation.navigate({
                    name: "LiveingLessionInfo_teacher",
                    params: {
                        flag: "refresh",
                    },
                    merge: true,
                });
            }
        });
    }

    //    copyToClipboard = () => {
    //        Clipboard.setString('hello world');
    //      };

    render() {
        return (
            <View
                style={{
                    flexDirection: "row",
                    paddingLeft: 10,
                    paddingBottom: 10,
                    paddingTop: 10,
                    backgroundColor: "#fff",
                    marginBottom: 10,
                }}
            >
                {/* 右侧直播课 状态 图标 */}
                {this.state.status == "1" ? (
                    <Image
                        style={{
                            position: "absolute",
                            right: 0,
                            width: 40,
                            height: 40,
                        }}
                        source={require("../../assets/teacherLatestPage/tea_ing.png")}
                    ></Image>
                ) : this.state.status == "2" ? (
                    <Image
                        style={{
                            position: "absolute",
                            right: 0,
                            width: 40,
                            height: 40,
                        }}
                        source={require("../../assets/teacherLatestPage/tea_new.png")}
                    ></Image>
                ) : this.state.status == "3" ? (
                    <Image
                        style={{
                            position: "absolute",
                            right: 0,
                            width: 40,
                            height: 40,
                        }}
                        source={require("../../assets/teacherLatestPage/tea_ed.png")}
                    ></Image>
                ) : (
                    <></>
                )}

                {/* 第一列  名称 时间 信息 */}
                <View
                    style={{
                        flexDirection: "column",
                        width: "70%",
                        paddingLeft: 10,
                    }}
                >
                    {/* 第一行  学科图标 +名称 */}
                    <View
                        style={{
                            flexDirection: "row",
                            justifyItem: "center",
                            alignItems: "center",
                        }}
                    >
                        {this.state.subjectName.indexOf("语文") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/yuwen.png")}
                            />
                        ) : this.state.subjectName.indexOf("数学") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/shuxue.png")}
                            />
                        ) : this.state.subjectName.indexOf("英语") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/yingyu.png")}
                            />
                        ) : this.state.subjectName.indexOf("物理") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/wuli.png")}
                            />
                        ) : this.state.subjectName.indexOf("化学") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/huaxue.png")}
                            />
                        ) : this.state.subjectName.indexOf("政治") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/zhengzhi.png")}
                            />
                        ) : this.state.subjectName.indexOf("历史") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/lishi.png")}
                            />
                        ) : this.state.subjectName.indexOf("地理") > 0 ? (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/dili.png")}
                            />
                        ) : (
                            <Image
                                style={{ width: 40, height: 40 }}
                                source={require("../../assets/errorQue/other.png")}
                            />
                        )}

                        <View
                            style={{
                                flexWrap: "nowrap",
                                width: "80%",
                                flexDirection: "row",
                                alignItems: "center",
                            }}
                        >
                            <Text style={{ fontSize: 18, fontWeight: "600" }}>
                                {this.state.title}
                            </Text>

                            {this.state.status == "2" ? ( //未开始的直播课才有编辑和删除
                                <>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.props.navigation.navigate({
                                                name: "LiveingLession_add",
                                                params: {
                                                    type: "update",
                                                    roomId: this.state.roomId,
                                                },
                                            });
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 13,
                                                height: 13,
                                                marginLeft: 3,
                                            }}
                                            source={require("../../assets/teacherLatestPage/tea_edit.png")}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.DeleteLivingLession(
                                                this.state.roomId
                                            );
                                        }}
                                    >
                                        <Image
                                            style={{
                                                width: 13,
                                                height: 13,
                                                marginLeft: 3,
                                            }}
                                            source={require("../../assets/teacherLatestPage/tea_delete.png")}
                                        />
                                    </TouchableOpacity>
                                </>
                            ) : (
                                <></>
                            )}
                        </View>
                    </View>

                    {/* 第二行 课程时长 课堂号 */}
                    <View
                        style={{
                            flexDirection: "row",
                            marginTop: 10,
                            alignItems: "center",
                        }}
                    >
                        <Text style={{ fontSize: 10 }}>课程时长:</Text>
                        <Text style={{ fontSize: 10 }}>{this.state.hour}</Text>
                        <Text style={{ marginLeft: 5, fontSize: 10 }}>
                            课堂号:
                        </Text>
                        <Text style={{ fontSize: 10 }}>
                            {this.state.roomId}
                        </Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.copyToClipboard;
                            }}
                        >
                            <Image
                                style={{ width: 10, height: 10, marginLeft: 3 }}
                                source={require("../../assets/teacherLatestPage/tea_copy.png")}
                            />
                        </TouchableOpacity>
                    </View>
                    {/* 第三行  授课对象 */}
                    <View style={{ flexDirection: "row", marginTop: 5 }}>
                        <Text style={{ fontSize: 10 }}>授课对象: </Text>
                        <Text style={{ fontSize: 10 }}>
                            {this.state.minutes}
                        </Text>
                    </View>
                </View>

                {/* 第二列 开始时间  进入课堂 信息 */}
                <View
                    style={{
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    {
                        // 直播中 状态
                        this.state.status == "1" ? (
                            <>
                                {this.state.showStrTop == "" ? (
                                    <TouchableOpacity
                                        style={{
                                            backgroundColor: "#66B878",
                                            width: 75,
                                            height: 33,
                                            justifyContent: "center",
                                            alignItems: "center",
                                            margin: 3,
                                        }}
                                        onPress={() => {
                                            this.props.setchooseClassmodalVisible(
                                                true
                                            );
                                            this.props.setchooseClassName(
                                                this.state.ketangName
                                            );
                                            this.props.setchooseClassroomId(
                                                this.state.roomId
                                            );
                                            this.props.setchooseClasstitle(
                                                this.state.title
                                            );
                                            this.props.setchooseClasssubjectId(
                                                this.state.subjectId
                                            );
                                            this.props.setchooseClassketangId(
                                                this.state.ketangId
                                            );
                                        }}
                                    >
                                        <Text
                                            style={{
                                                fontSize: 12,
                                                color: "white",
                                            }}
                                        >
                                            进入课堂
                                        </Text>
                                    </TouchableOpacity>
                                ) : (
                                    <Text
                                        style={{
                                            color: "#7CA78B",
                                            fontSize: 30,
                                        }}
                                    >
                                        {this.state.showStrTop}
                                    </Text>
                                )}
                                <Text>{this.state.showStrBottom}</Text>
                            </>
                        ) : // 未开始 状态
                        this.state.status == "2" ? (
                            <>
                                <Text
                                    style={{ fontSize: 30, color: "#66B878" }}
                                >
                                    {this.state.showStrTop}
                                </Text>
                                <Text style={{ fontSize: 13 }}>
                                    {this.state.showStrBottom}
                                </Text>
                            </>
                        ) : // 已结束状态
                        this.state.status == "3" ? (
                            <>
                                <Text
                                    style={{ color: "#949494", fontSize: 30 }}
                                >
                                    {this.state.showStrTop}
                                </Text>
                                <Text style={{ color: "#949494" }}>
                                    {this.state.showStrBottom}
                                </Text>
                            </>
                        ) : (
                            <></>
                        )
                    }
                </View>
            </View>
        );
    }
}
