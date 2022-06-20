import React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Modal,
    Platform,
    ScrollView,
} from "react-native";
import { Button } from "@ui-kitten/components";
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import http from "../../../../utils/http/request";
import DateTime from "./DateTime";

import { WebView } from "react-native-webview";
import RenderHtml from "react-native-render-html";

import Toast from "../../../../utils/Toast/Toast";
import {
    Waiting,
    WaitLoading,
} from "../../../../utils/WaitLoading/WaitLoading";

export default function PushOrSaveContentPageContainer(props) {
    const navigation = useNavigation();
    // console.log('-------------------------');
    // console.log('props.paramsData' , props.paramsData.learnDiff);
    // console.log('-------------------------');

    //将navigation传给HomeworkProperty组件，防止路由出错
    return (
        <PushOrSaveContentPage
            navigation={navigation}
            createType={props.createType}
            actionType={props.actionType}
            learnPlanId={props.learnPlanId}
            selectContentList={props.selectContentList}
            paramsData={props.paramsData}
        />
    );
}

class PushOrSaveContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //布置作业小页面
            startTime: "", //开始时间
            endTime: "", //结束时间

            className: "", //选择课堂
            classNameList: [], //班级列表
            classNameVisibility: false, //是否显示课堂列表

            assigntoWho: "0", //布置作业对象 0:班级 1：小组 2:个人

            class: {}, //所选中的课堂对应的班级信息
            classFlag: false, //是否选中班级

            groupList: [], //小组列表
            groupSelected: [], //被选中的小组

            studentsList: [], //个人列表（接口返回的classList、学生信息由字符串拼接）
            studentsListTrans: [], //studentsList中拼接的学生信息挨个提取出
            studentSelected: [], //被选中的学生

            contentObjList: {}, //生成的导学案数组对象
        };
    }

    UNSAFE_componentWillMount() {
        console.log("---------push----willMount-------------------");
        console.log(
            "----------push----learnPlanId----------",
            this.props.learnPlanId
        );
        console.log(
            "----------push----learnPlanId----------",
            this.props.selectContentList.length
        );
        this.createContentObjList(); //生成试卷对象
    }

    //生成导学案数组对象
    createContentObjList = () => {
        const selectContentList = this.props.selectContentList;
        let content = []; //
        //console.log('**********createContentObjList********', Date.parse(new Date()));
        for (let i = 0; i < selectContentList.length; i++) {
            content.push({
                id: selectContentList[i].id,
                name:
                    selectContentList[i].type == "question"
                        ? ""
                        : selectContentList[i].name,
                type: selectContentList[i].type,
                format: "",
                shitiShow: "",
                shitiAnswer: "",
                shitiAnalysis: "",
                baseTypeId: "",
                baseTypeName: "",
                typeId: "",
                typeName: "",
                url: "",
                pptList: "",
                filePath: selectContentList[i].filePath,
                previewPath: selectContentList[i].previewPath,
                linkName: "默认环节",
                linkOrder: 1,
                activityName: "默认活动",
                activityOrder: 1,
                resourceOrder: i + 1,
            });
        }
        console.log("*************content****type***", typeof content);
        console.log("*******导学案内容***********");
        for (let i = 0; i < content.length; i++) {
            console.log(content[i]);
        }
        console.log("**************************");
        this.setState({ contentObjList: content });
    };

    //布置导学案 设置接口参数
    setPushLearnPlanParams = () => {
        const { assigntoWho, groupSelected, studentSelected, studentsList } =
            this.state;
        const classSecleted = this.state.class;
        var keTangId = classSecleted.keTangId; //课堂id
        var keTangName = classSecleted.keTangName; //课堂名
        var classIdOrGroupId = classSecleted.classId; //班级id
        var classOrGroupName = classSecleted.className; //班级名(接口返回的班级名后面自带一个逗号,)
        var roomType = ""; //作业布置方式 班级、个人50、小组70

        var stuIds = "";
        var stuNames = "";

        var startTime = this.state.startTime;
        var endTime = this.state.endTime;

        if (assigntoWho == "0") {
            //布置给班级 （有对应的学生信息需要拼装吗，接口传空值？）
            roomType = "50";
            stuIds = studentsList[0].ids;
            stuNames = studentsList[0].name;
            console.log("**********studentsList******", stuIds);
            console.log("**********studentsList******", stuNames);
            console.log(
                "**********studentsList.length******",
                studentsList.length
            );
        } else if (assigntoWho == "1") {
            //布置给小组 拼装小组id、小组名 学生id、学生姓名
            roomType = "70";
            // classIdOrGroupId = groupSelected[0].id;
            // classOrGroupName = groupSelected[0].value;

            // stuIds = groupSelected[0].ids;
            // stuNames = groupSelected[0].name;

            for (let i = 0; i < groupSelected.length; i++) {
                classIdOrGroupId = classIdOrGroupId + ";" + groupSelected[i].id;
                classOrGroupName =
                    classOrGroupName + ";" + groupSelected[i].value;

                stuIds = stuIds + "," + groupSelected[i].ids;
                stuNames = stuNames + "," + groupSelected[i].name;
            }
        } else {
            //布置给个人
            roomType = "50";
            // stuIds = groupSelected[0].ids;
            // stuNames = groupSelected[0].name;

            for (let i = 0; i < studentSelected.length; i++) {
                stuIds = stuIds + "," + studentSelected[i].id;
                stuNames = stuNames + "," + studentSelected[i].name;
            }
        }
        return {
            startTime: startTime,
            endTime: endTime,
            keTangId: keTangId,
            classIds: classIdOrGroupId,
            stuIds: stuIds,
            stuNames: stuNames,
            roomType: roomType,
            keTangName: keTangName,
            className: classOrGroupName,
        };
    };

    //保存导学案 设置接口参数
    setSaveLearnPlanParams = () => {
        const paramsData = this.props.paramsData;
        const { contentObjList } = this.state;
        var JsonStr = JSON.stringify(contentObjList); //js数组转化为json字符串
        console.log("*********JsonStr*********", typeof JsonStr);
        console.log(JsonStr);
        console.log("*******************************");
        var learnPlanType;
        if (paramsData.useAim == "all") {
            learnPlanType = 0;
        } else if (paramsData.useAim == "before") {
            learnPlanType = 1;
        } else if (paramsData.useAim == "mid") {
            learnPlanType = 2;
        } else if (paramsData.useAim == "after") {
            learnPlanType = 3;
        }
        var createTypeTemp = 1;
        if (this.props.createType == "learnCase") {
            createTypeTemp = 1;
        } else if (this.props.createType == "weiKe") {
            createTypeTemp = 2;
        } else {
            createTypeTemp = 3;
        }
        return {
            jsonStr: JsonStr,
            channelCode: paramsData.studyRankId,
            channelName: paramsData.studyRank,
            subjectCode: paramsData.studyClassId,
            subjectName: paramsData.studyClass,
            textBookCode: paramsData.editionId,
            textBookName: paramsData.edition,
            gradeLevelCode: paramsData.bookId,
            gradeLevelName: paramsData.book,
            pointCode: paramsData.knowledgeCode,
            pointName: paramsData.knowledge,
            type: createTypeTemp,
            learnPlanType: learnPlanType,
            classHours: paramsData.learnSumTime,
            studyHours: paramsData.studyTime,
            Introduce: paramsData.introduction,
            Goal: paramsData.learnAim,
            Emphasis: paramsData.learnPoint,
            Difficulty: paramsData.learnDiff,
            Summary: paramsData.courseSummary,
            Extension: paramsData.courseExpansion,
        };
    };

    //点击“布置”页面的确定按钮，即保存且布置导学案
    pushAndSaveLearnPlan = () => {
        var pushParamsObj = this.setPushLearnPlanParams();
        var saveParamsObj = this.setSaveLearnPlanParams();
        var allParams = {
            ...pushParamsObj,
            ...saveParamsObj,
            token: global.constants.token,
            assignType: 1, //表示保存+布置
            userName: global.constants.userName,
            learnPlanName: this.props.paramsData.name,
            learnPlanId: this.props.learnPlanId,
            flag: this.props.actionType == "create" ? "save" : "edit",
        };
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_releaseLearnPlan.do";
        const params = {
            ...allParams,
            // callback:'ha',
        };
        // console.log('*****************http******************************')
        // console.log(url , params)
        // console.log('***********************************************')
        // console.log('-----pushAndSaveLearnPlan-----', Date.parse(new Date()))
        WaitLoading.show("保存中...", -1);
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('****************resJson.success*********', resJson);
                if (resJson.success) {
                    // this.props.navigation.navigate({name: 'Teacher_Home'});
                    Alert.alert(this.props.paramsData.name, "导学案布置成功", [
                        {},
                        {
                            text: "ok",
                            onPress: () => {
                                WaitLoading.dismiss();
                                this.props.navigation.navigate({
                                    name: "Teacher_Home",
                                    params: {
                                        type: "fresh",
                                    },
                                });
                            },
                        },
                    ]);
                } else {
                    WaitLoading.show_false();
                    // Alert.alert(resJson.message);
                }
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //点击“布置”页面的保存按钮，即保存但不布置导学案
    saveLearnPlan = () => {
        var saveParamsObj = this.setSaveLearnPlanParams();
        console.log("---------saveParamsObj--------");
        console.log(saveParamsObj);
        console.log("------------------------------");
        var allParams = {
            ...saveParamsObj,
            token: global.constants.token,
            assignType: 3, //表示只保存，不布置
            userName: global.constants.userName,
            learnPlanName: this.props.paramsData.name,
            learnPlanId: this.props.learnPlanId,
            flag: this.props.actionType == "create" ? "save" : "edit",
        };
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_releaseLearnPlan.do";
        const params = {
            ...allParams,
            //callback:'ha',
        };
        console.log("-----saveLearnPlan-----", Date.parse(new Date()));
        WaitLoading.show("保存中...", -1);
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log(
                    "****************resJson.success*********",
                    resJson,
                    typeof resJson
                );
                console.log("*************************");
                // console.log('****************resJson.success***Type******', resJson.success);

                if (resJson.success) {
                    Alert.alert(
                        this.props.paramsData.name,
                        this.props.createType == "learnCase"
                            ? "导学案保存成功"
                            : this.props.createType == "weiKe"
                            ? "微课保存成功"
                            : "授课包保存成功",
                        [
                            {},
                            {
                                text: "ok",
                                onPress: () => {
                                    WaitLoading.dismiss();
                                    this.props.navigation.navigate({
                                        name: "Teacher_Home",
                                        params: {
                                            screen: "最新",
                                            params: {
                                                isRefresh: true,
                                                type: "fresh",
                                            },
                                        },
                                    });
                                },
                            },
                        ]
                    );
                } else {
                    WaitLoading.show_false();
                    // Alert.alert(resJson.message);
                }
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //设置开始时间
    setStartTime = (time) => {
        this.setState({ startTime: time, endTime: time });
    };
    //设置结束时间
    setEndTime = (time) => {
        this.setState({ endTime: time });
    };

    //修改“选择课堂”列表是否显示标识
    updateClassNameVisibility = () => {
        if (this.state.classNameVisibility) {
            this.setState({ classNameVisibility: false });
        } else {
            this.setState({ classNameVisibility: true });
        }
    };

    //请求课堂列表
    fetchClassNameList = () => {
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getKeTangList.do";
        const params = {
            userName: userId,
            //callback:'ha',
        };

        console.log("-----fetchClassNameList-----", Date.parse(new Date()));
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('------------------');
                this.setState({ classNameList: resJson.data });
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //显示“选择课堂”列表
    showClassNameList = () => {
        const { classNameList } = this.state;
        const content = classNameList.map((item, index) => {
            return (
                <View
                    style={{
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                    }}
                >
                    <View
                        key={index}
                        style={
                            this.state.className == item.keTangName
                                ? styles.classNameViewSelected
                                : styles.classNameView
                        }
                    >
                        <Text
                            style={styles.classNameText}
                            onPress={() => {
                                // console.log('---showClassNameList----' , item.keTangId , item.keTangName)
                                if (this.state.className != item.keTangName) {
                                    //更新选择的课堂以及布置对象
                                    this.setState({
                                        className: item.keTangName,
                                        class: item,
                                        classFlag: false,
                                        groupList: [],
                                        studentsList: [],
                                        studentsListTrans: [],
                                        groupSelected: [],
                                        studentSelected: [],
                                    });
                                }
                            }}
                        >
                            {item.keTangName}
                        </Text>
                    </View>
                    <View style={{ height: 5 }}></View>
                </View>
            );
        });
        return content;
    };

    //请求小组以及学生信息
    fetchGroupAndStudentList = (classId) => {
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getClassStudentList.do";
        const params = {
            keTangId: classId,
            //callback:'ha',
        };

        console.log(
            "-----fetchGroupAndStudentList-----",
            Date.parse(new Date())
        );
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({
                    groupList: resJson.data.groupList,
                    studentsList: resJson.data.classList,
                });
            })
            .catch((error) => {
                console.log("******catch***error**", error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    };

    //分割获取到的学生信息字符串（个人列表中的学生信息)
    splitStudents = () => {
        const { studentsList, studentsListTrans } = this.state;
        if (studentsList.length > 0 && studentsListTrans.length <= 0) {
            let studentsNameList = [];
            let studentsIdList = [];
            let students = [];

            console.log("*****studentsList.length**", studentsList.length);
            console.log("*****classList**", studentsList);
            for (let i = 0; i < studentsList.length; i++) {
                let names = studentsList[i].name.split(","); //姓名分割
                names.map((item, index) => {
                    studentsNameList.push(item);
                });
                console.log("*****names**", names);
                let Ids = studentsList[i].ids.split(","); //id分割
                Ids.map((item, index) => {
                    studentsIdList.push(item);
                });
                console.log("*****Ids**", Ids);
            }
            for (let i = 0; i < studentsNameList.length; i++) {
                //组装分割的姓名+id
                students.push({
                    id: studentsIdList[i],
                    name: studentsNameList[i],
                });
            }
            this.setState({ studentsListTrans: students });
        }
    };

    //修改布置对象
    updateAssign = (type) => {
        if (type == "0") {
            if (this.state.assigntoWho != "0") {
                this.setState({
                    assigntoWho: "0",
                    classFlag: false,
                    groupSelected: [], //被选中的小组
                    studentSelected: [], //被选中的学生
                });
            }
        } else if (type == "1") {
            if (this.state.assigntoWho != "1") {
                this.setState({
                    assigntoWho: "1",
                    classFlag: false,
                    groupSelected: [], //被选中的小组
                    studentSelected: [], //被选中的学生
                });
            }
        } else {
            if (this.state.assigntoWho != "2") {
                this.setState({
                    assigntoWho: "2",
                    classFlag: false,
                    groupSelected: [], //被选中的小组
                    studentSelected: [], //被选中的学生
                });
            }
        }
    };

    //查看小组是否在已选择的小组列表中
    IsInGroupSelected = (groupItem) => {
        const { groupSelected } = this.state;
        for (let i = 0; i < groupSelected.length; i++) {
            if (groupSelected[i].id == groupItem.id) {
                return true;
            }
        }
        return false;
    };

    //更新已选择的小组列表
    updateGroupSelected = (groupItem) => {
        const { groupSelected } = this.state;
        let groups = [];
        let flag = this.IsInGroupSelected(groupItem);
        if (flag == true) {
            //在则删除
            for (let i = 0; i < groupSelected.length; i++) {
                if (groupSelected[i].id != groupItem.id) {
                    groups.push(groupSelected[i]);
                }
            }
            this.setState({ groupSelected: groups });
        } else {
            //不在则添加
            groups = groupSelected;
            groups.push(groupItem);
            this.setState({ groupSelected: groups });
        }
    };

    //查看学生是否在已选择的学生列表中
    IsInStudentSelected = (studentItem) => {
        const { studentSelected } = this.state;
        // console.log('-------studentSelected------',studentSelected.length);
        for (let i = 0; i < studentSelected.length; i++) {
            if (studentSelected[i].id == studentItem.id) {
                return true;
            }
        }
        return false;
    };

    //更新已选择的学生列表
    updateStudentSelected = (studentItem) => {
        const { studentSelected } = this.state;
        let students = [];
        let flag = this.IsInStudentSelected(studentItem);
        if (flag == true) {
            //在则删除
            for (let i = 0; i < studentSelected.length; i++) {
                if (studentSelected[i].id != studentItem.id) {
                    students.push(studentSelected[i]);
                }
            }
            this.setState({ studentSelected: students });
        } else {
            //不在则添加
            students = studentSelected;
            students.push(studentItem);
            this.setState({ studentSelected: students });
        }
    };

    //布置对象列表
    showAssignToWho = () => {
        const { assigntoWho } = this.state;
        const assignList = [];
        if (this.state.className == "") {
            return (
                <View
                    style={{ justifyContent: "center", alignItems: "center" }}
                >
                    <Text
                        style={{
                            fontSize: 16,
                            color: "black",
                            fontWeight: "400",
                            paddingTop: 10,
                        }}
                    >
                        请先选择课堂
                    </Text>
                </View>
            );
        } else {
            if (assigntoWho == "0") {
                //班级
                return (
                    <View
                        style={
                            this.state.classFlag == false
                                ? {
                                      width: screenWidth * 0.4,
                                      height: 35,
                                      marginTop: 10,
                                      marginLeft: 20,
                                      backgroundColor: "#DCDCDC",
                                  }
                                : {
                                      width: screenWidth * 0.4,
                                      height: 35,
                                      marginTop: 10,
                                      marginLeft: 20,
                                      backgroundColor: "#fff",
                                      borderWidth: 1,
                                      borderColor: "red",
                                  }
                        }
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: "black",
                                fontWeight: "400",
                                paddingTop: 5,
                                textAlign: "center",
                            }}
                            onPress={() => {
                                if (
                                    this.state.groupList.length <= 0 &&
                                    this.state.studentsList.length <= 0
                                ) {
                                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                                    if (this.state.class != null) {
                                        //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                                        this.fetchGroupAndStudentList(
                                            this.state.class.keTangId
                                        );
                                    }
                                }
                                this.splitStudents(); //分割获取到的学生信息
                                if (this.state.classFlag) {
                                    this.setState({ classFlag: false });
                                } else {
                                    this.setState({ classFlag: true });
                                }
                            }}
                        >
                            {this.state.class.className.substring(
                                0,
                                this.state.class.className.length - 1
                            )}
                        </Text>
                    </View>
                );
            } else if (assigntoWho == "1") {
                //小组
                console.log(
                    "***group**student**",
                    this.state.groupList.length,
                    this.state.studentsList.length
                );
                if (
                    this.state.groupList.length <= 0 &&
                    this.state.studentsList.length <= 0
                ) {
                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                    if (this.state.class != null) {
                        //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                        this.fetchGroupAndStudentList(
                            this.state.class.keTangId
                        );
                    }
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                if (this.state.groupList.length > 0) {
                    content = this.state.groupList.map((item, index) => {
                        return (
                            <View
                                style={{
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center",
                                }}
                            >
                                <View
                                    key={index}
                                    style={
                                        this.IsInGroupSelected(item)
                                            ? styles.groupViewSelected
                                            : styles.groupView
                                    }
                                >
                                    <Text
                                        style={styles.groupItem}
                                        onPress={() => {
                                            this.updateGroupSelected(item);
                                        }}
                                    >
                                        {item.value}
                                    </Text>
                                </View>
                                <View style={{ height: 5 }}></View>
                            </View>
                        );
                    });
                }
                return this.state.groupList.length > 0 ? (
                    content
                ) : (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: "black",
                                fontWeight: "400",
                                paddingTop: 10,
                            }}
                        >
                            您还没有创建小组，可以前往电脑端进行创建
                        </Text>
                    </View>
                );
            } else {
                //个人
                if (
                    this.state.groupList.length <= 0 &&
                    this.state.studentsList.length <= 0
                ) {
                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                    if (this.state.class != null) {
                        //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                        this.fetchGroupAndStudentList(
                            this.state.class.keTangId
                        );
                    }
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                const { studentsListTrans } = this.state;
                if (studentsListTrans.length > 0) {
                    content = studentsListTrans.map((item, index) => {
                        return (
                            <View
                                key={index}
                                style={
                                    this.IsInStudentSelected(item)
                                        ? {
                                              width: screenWidth * 0.3,
                                              height: 35,
                                              fontSize: 15,
                                              color: "black",
                                              backgroundColor: "#fff",
                                              fontWeight: "300",
                                              margin: 3,
                                              borderWidth: 2,
                                              borderColor: "red",
                                              textAlign: "center",
                                          }
                                        : {
                                              width: screenWidth * 0.3,
                                              height: 35,
                                              fontSize: 15,
                                              color: "black",
                                              backgroundColor: "#DCDCDC",
                                              fontWeight: "300",
                                              margin: 3,
                                              borderWidth: 2,
                                              borderColor: "#fff",
                                              textAlign: "center",
                                          }
                                }
                            >
                                <Text
                                    style={styles.classNameText}
                                    onPress={() => {
                                        this.updateStudentSelected(item);
                                    }}
                                >
                                    {item.name}
                                </Text>
                            </View>
                        );
                    });
                }
                return studentsListTrans.length > 0 ? (
                    <View
                        style={{
                            flexDirection: "row",
                            flexWrap: "wrap", //自动换行
                            backgroundColor: "#fff",
                            left: screenWidth * 0.025,
                            marginBottom: 10,
                        }}
                    >
                        {content}
                    </View>
                ) : (
                    <View
                        style={{
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Text
                            style={{
                                fontSize: 16,
                                color: "black",
                                fontWeight: "400",
                                paddingTop: 10,
                            }}
                        >
                            当前班级没有学生信息
                        </Text>
                    </View>
                );
            }
        }
    };

    //布置或保存导学案页面
    showPushOrSaveContent = () => {
        return (
            <View style={{ ...styles.bodyView, height: "82%" }}>
                {/**布置 保存 */}
                <View
                    style={{
                        ...styles.paperSelectNumView,
                        justifyContent: "space-around",
                    }}
                >
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: "#4DC7F8",
                            top: 10,
                        }}
                        onPress={() => {
                            Alert.alert("点击下方确定按钮可布置");
                        }}
                    >
                        布置
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            fontWeight: "500",
                            color: "black",
                            top: 10,
                        }}
                        onPress={() => {
                            this.saveLearnPlan();
                        }}
                    >
                        保存
                    </Text>
                </View>
                <ScrollView style={{ height: "100%" }}>
                    {/**开始时间 */}
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Text style={styles.title}>开始时间:</Text>
                        <Text
                            style={{
                                ...styles.title,
                                width: screenWidth * 0.6,
                            }}
                        >
                            {this.state.startTime}
                        </Text>
                        <View style={{ right: 10, position: "absolute" }}>
                            <DateTime
                                setDateTime={this.setStartTime}
                                selectedDateTime={this.state.startTime}
                            />
                        </View>
                    </View>

                    {/**分割线 */}
                    <View
                        style={{
                            paddingLeft: 0,
                            width: screenWidth,
                            height: 1,
                            backgroundColor: "#DCDCDC",
                        }}
                    />

                    {/**结束时间 */}
                    <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                    >
                        <Text style={styles.title}>结束时间:</Text>
                        <Text
                            style={{
                                ...styles.title,
                                width: screenWidth * 0.6,
                            }}
                        >
                            {this.state.endTime}
                        </Text>
                        <View style={{ right: 10, position: "absolute" }}>
                            <DateTime
                                setDateTime={this.setEndTime}
                                selectedDateTime={this.state.endTime}
                            />
                        </View>
                    </View>

                    {/**分割线 */}
                    <View
                        style={{
                            paddingLeft: 0,
                            width: screenWidth,
                            height: 1,
                            backgroundColor: "#DCDCDC",
                        }}
                    />

                    {/**选择课堂 */}
                    <View style={{ flexDirection: "row", width: screenWidth }}>
                        <TouchableOpacity
                            style={{ flexDirection: "row", width: screenWidth }}
                            onPress={() => {
                                this.updateClassNameVisibility();
                            }}
                        >
                            <Text style={styles.title}>选择课堂:</Text>
                            <Text
                                style={{
                                    ...styles.title,
                                    width: screenWidth * 0.6,
                                }}
                            >
                                {this.state.className}
                            </Text>
                            <TouchableOpacity
                                style={{
                                    flexDirection: "row",
                                    position: "absolute",
                                    right: 20,
                                }}
                                onPress={() => {
                                    this.updateClassNameVisibility();
                                }}
                            >
                                <Image
                                    style={{ top: 10, width: 20, height: 20 }}
                                    source={
                                        this.state.classNameVisibility
                                            ? require("../../../../assets/teacherLatestPage/top.png")
                                            : require("../../../../assets/teacherLatestPage/bot.png")
                                    }
                                ></Image>
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    {/**可选课堂列表 */}
                    {this.state.classNameVisibility ? (
                        <View>
                            {this.state.classNameList.length <= 0
                                ? this.fetchClassNameList()
                                : null}
                            {this.state.classNameList.length > 0 ? (
                                this.showClassNameList()
                            ) : (
                                <Text>课堂列表未获取到或者为空</Text>
                            )}
                        </View>
                    ) : null}

                    {/**分割线 */}
                    <View
                        style={{
                            paddingLeft: 0,
                            width: screenWidth,
                            height: 2,
                            backgroundColor: "#DCDCDC",
                        }}
                    />

                    {/**布置 */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            borderBottomWidth: 0.5,
                        }}
                    >
                        <Text style={styles.title}>布置给:</Text>
                        {/**班级 小组  个人 */}
                        <View
                            style={
                                this.state.assigntoWho == "0"
                                    ? styles.assignViewSelected
                                    : styles.assignView
                            }
                        >
                            <Text
                                style={styles.assignText}
                                onPress={() => {
                                    this.updateAssign(0);
                                }}
                            >
                                班级
                            </Text>
                        </View>
                        <View
                            style={
                                this.state.assigntoWho == "1"
                                    ? styles.assignViewSelected
                                    : styles.assignView
                            }
                        >
                            <Text
                                style={styles.assignText}
                                onPress={() => {
                                    this.updateAssign(1);
                                }}
                            >
                                小组
                            </Text>
                        </View>
                        <View
                            style={
                                this.state.assigntoWho == "2"
                                    ? styles.assignViewSelected
                                    : styles.assignView
                            }
                        >
                            <Text
                                style={styles.assignText}
                                onPress={() => {
                                    this.updateAssign(2);
                                }}
                            >
                                个人
                            </Text>
                        </View>
                    </View>

                    {/**分割线 */}
                    <View
                        style={{
                            paddingLeft: 0,
                            width: screenWidth,
                            height: 1,
                            backgroundColor: "#DCDCDC",
                        }}
                    />
                    {/**布置对象列表 */}
                    {this.showAssignToWho()}
                </ScrollView>
            </View>
        );
    };

    //布置或保存导学案页面底部按钮
    showPushOrSaveContentBottom = () => {
        return (
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    backgroundColor: "#fff",
                }}
            >
                <Button
                    style={{ width: "40%" }}
                    onPress={() => {
                        this.setState({
                            startTime: "",
                            endTime: "",
                            className: "", //选择课堂
                            //classNameList: [], //班级列表
                            classNameVisibility: false, //是否显示课堂列表

                            assigntoWho: "0", //布置作业对象 0:班级 1：小组 2:个人

                            class: {}, //所选中的课堂对应的班级信息
                            classFlag: false, //是否选中班级

                            //groupList: [], //小组列表
                            groupSelected: [], //被选中的小组

                            // studentsList: [], //个人列表（接口返回的classList、学生信息由字符串拼接）
                            //studentsListTrans: [], //studentsList中拼接的学生信息挨个提取出
                            studentSelected: [], //被选中的学生
                        });
                    }}
                >
                    重置
                </Button>
                <Button
                    style={{ width: "40%" }}
                    onPress={() => {
                        const { startTime, endTime } = this.state;
                        const { className } = this.state;
                        const { assigntoWho } = this.state;
                        const { classFlag } = this.state;
                        const { groupSelected, studentSelected } = this.state;
                        if (
                            startTime == "" ||
                            endTime == "" ||
                            className == "" ||
                            (assigntoWho == "0" && !classFlag) ||
                            (assigntoWho == "1" && groupSelected.length == 0) ||
                            (assigntoWho == "2" && studentSelected.length == 0)
                        ) {
                            Alert.alert("请选择以上属性");
                        } else {
                            this.pushAndSaveLearnPlan();
                        }
                    }}
                >
                    确定
                </Button>
            </View>
        );
    };

    render() {
        if (this.props.createType == "TeachingPackages") {
            this.saveLearnPlan();
            return (
                <View style={{ ...styles.bodyView, height: screenHeight }}>
                    <View>
                        <Text
                            style={{
                                fontSize: 18,
                                color: "black",
                                paddingTop: 40,
                                textAlign: "center",
                            }}
                        >
                            正在保存授课包，请耐心等待
                        </Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.bodyView}>
                    {this.showPushOrSaveContent()}
                    {this.showPushOrSaveContentBottom()}
                </View>
            );
        }
    }
}

const styles = StyleSheet.create({
    bodyView: {
        height: screenHeight * 0.9,
        flexDirection: "column",
    },
    paperSelectNumView: {
        height: screenHeight * 0.06,
        flexDirection: "row",
        backgroundColor: "#EBEDEC",
    },
    title: {
        fontSize: 15,
        color: "black",
        fontWeight: "500",
        width: screenWidth * 0.2,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        //height:'100%',
    },
    classNameView: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: "#DCDCDC",
        borderWidth: 2,
        borderColor: "#fff",
    },
    classNameViewSelected: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: "#fff",
        borderWidth: 2,
        borderColor: "red",
    },
    classNameText: {
        fontSize: 15,
        color: "black",
        fontWeight: "300",
        paddingTop: 8,
        textAlign: "center",
    },
    assignView: {
        width: screenWidth * 0.15,
        height: 30,
        backgroundColor: "#fff",
    },
    assignViewSelected: {
        width: screenWidth * 0.15,
        height: 30,
        backgroundColor: "#4DC7F8",
        borderRadius: 5,
    },
    assignText: {
        fontSize: 15,
        color: "black",
        fontWeight: "300",
        textAlign: "center",
        paddingTop: 3,
    },
    groupView: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: "#DCDCDC",
        marginTop: 3,
        borderWidth: 2,
        borderColor: "#fff",
    },
    groupViewSelected: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: "#fff",
        marginTop: 3,
        borderWidth: 2,
        borderColor: "red",
    },
    groupItem: {
        fontSize: 15,
        color: "black",
        fontWeight: "300",
        paddingTop: 8,
        textAlign: "center",
    },
});
