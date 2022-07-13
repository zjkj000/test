import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabBar from "./TabBar";
import Login from "../../pages/Login/Login";
import PackagesPage from "../../pages/LatestTask/PackagesPage";
import Todo from "../../pages/LatestTask/Todo";
import Inform from "../../pages/LatestTask/Inform";
import Notice from "../../pages/LatestTask/Notice";
import Videos from "../../pages/LatestTask/Resource/Videos";
import Voice from "../../pages/LatestTask/Resource/Voice";
import PptRescouce from "../../pages/LatestTask/Resource/PptResource";
import WordOrPdfRescouce from "../../pages/LatestTask/Resource/WordOrPdfRescouce";
import Select_Subject from "../../pages/My/Select_Subject";
import Select_Subject_SubmitContainer from "../../pages/My/Select_Subject_Submit";
import Paper_ToDo from "../../pages/LatestTask/DoWork/Paper_ToDo";
import Paper_ShowCorrected from "../../pages/LatestTask/DoWork/Paper_ShowCorrected";
import Paper_SubmitContainer from "../../pages/LatestTask/DoWork/Paper_Submit";
import Learningguide_ToDo from "../../pages/LatestTask/LearningGuide/Learningguide_ToDo";
import Learningguide_ShowCorrected from "../../pages/LatestTask/LearningGuide/Learningguide_ShowCorrected";
import Learningguide_SubmitContainer from "../../pages/LatestTask/LearningGuide/Learningguide_Submit";

import OnlineClassTempPage from "../../pages/OnlineClass";
import QRCodeScanner from "../../utils/QRCode/QRCodeScanner";
import ConnectClass from "../../pages/OnlineClass/ConnectClass";
import WrongSee from "../../pages/Wrongbook/WrongSee";
import Wrongbook from "../../pages/Wrongbook/Wrongbook";
import WrongDetails from "../../pages/Wrongbook/wrongDetails";
import WrongRecycleButtoContainer from "../../pages/Wrongbook/WrongRecycleButton";
import WrongRecycle from "../../pages/Wrongbook/WrongRecycle";

import TeacherTabBar from "../../pages/Teacher/TabBar/TeacherTabBar";
import { Icon } from "react-native-elements";
import HomeworkPropertyContainer from "../../pages/TeacherLatestPage/CreateAndPubTasks/Homework/HomeworkProperty";
import CreateHomework from "../../pages/TeacherLatestPage/CreateAndPubTasks/Homework/CreateHomework";
import CreateHomeworkFrame from "../../pages/TeacherLatestPage/CreateAndPubTasks/Homework/CreateHomeworkFrame"
import LearnCasePropertyContainer from "../../pages/TeacherLatestPage/CreateAndPubTasks/LearnCase/LearnCaseProperty";
import CreateLearnCaseFrame from "../../pages/TeacherLatestPage/CreateAndPubTasks/LearnCase/CreateLearnCaseFrame";

import LiveingLessonInfo from "../../pages/LatestTask/LiveingLessonInfo";

import PaperListContainer from "../../pages/Teacher/CorrectPaper/PaperList";
import CorrectingPaper from "../../pages/Teacher/CorrectPaper/CorrectingPaper";
import LookCorrectDetails from "../../pages/Teacher/CorrectPaper/LookCorrectDetails";
import CreateWorkContainer from "../../pages/Teacher/TakePicturesAndAssignWork/CreateWork";
import EditWorkContioner from "../../pages/Teacher/TakePicturesAndAssignWork/EditWork";
import AssignPicturesWorkContainer from "../../pages/Teacher/TakePicturesAndAssignWork/AssignPicturesWork";
import Tea_CreateInform from "../../pages/Teacher/Tea_CreateInform";
import Tea_CreateNotice from "../../pages/Teacher/Tea_CreateNotice";
import Tea_Inform from "../../pages/Teacher/Tea_Inform";
import Tea_Notice from "../../pages/Teacher/Tea_Notice";
import AssignPaperContainer from "../../pages/TeacheringContent/AssignPaper";
import AssignLearnPlanContainer from "../../pages/TeacheringContent/AssignLearnPlan";
import ControllerLogin from "../../pages/remoteController/Login/ControllerLogin";
import ControllerHome from "../../pages/remoteController/Home/ControllerHome";
import ControllerSharePhoto from "../../pages/remoteController/SharePhoto/ControllerSharePhoto";
import TestPage from "../../TestPage/TestPage";
const Stack = createStackNavigator();

export default class MainNavigation extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Stack.Navigator
                initialRouteName="Login"
                screenOptions={{
                    headerShadowVisible: false,
                    headerTitleAlign: "center",
                    headerTitleStyle: {
                        fontSize: 17,
                        color: "#59B9E0",
                        fontFamily: "PingFangSC-Semibold",
                        fontWeight: "700",
                    },
                    headerTintColor: "#59B9E0", // 导航栏字体颜色设置 如果设置了headerTitleStyle则此处设置不生效
                    statusBarStyle: "light", //"inverted" | "auto" | "light" | "dark" | undefined 状态栏配置
                    headerLeft: React.ReactNode, //导航左侧区域按钮配置 不配置默认展示左箭头返回图标
                }}
            >
                <Stack.Screen
                    name="Login"
                    component={Login}
                    options={{ headerShown: false }}
                />
                <Stack.Screen
                    name="Home"
                    component={MyTabBar}
                    options={{
                        header: () => {},
                    }}
                />

                <Stack.Group>
                    <Stack.Screen name="资料夹" component={PackagesPage} />
                    <Stack.Screen name="Todo" component={Todo} />
                    <Stack.Screen name="通知" component={Inform} />
                    <Stack.Screen name="公告" component={Notice} />
                    <Stack.Screen name="视频" component={Videos} />
                    <Stack.Screen name="音频" component={Voice} />
                    <Stack.Screen name="PPT" component={PptRescouce} />
                    <Stack.Screen name="文档" component={WordOrPdfRescouce} />

                    {/* 做作业部分 */}
                    <Stack.Screen
                        name="DoPaper"
                        component={Paper_ToDo}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SubmitPaper"
                        component={Paper_SubmitContainer}
                    />
                    <Stack.Screen
                        name="ShowCorrected"
                        component={Paper_ShowCorrected}
                    />
                    {/* 做导学案部分 */}
                    <Stack.Screen
                        name="DoLearningGuide"
                        component={Learningguide_ToDo}
                        options={{ headerShown: false }}
                    />
                    <Stack.Screen
                        name="SubmitLearningGuide"
                        component={Learningguide_SubmitContainer}
                    />
                    <Stack.Screen
                        name="ShowCorrected_LearningGuide"
                        component={Learningguide_ShowCorrected}
                    />
                </Stack.Group>

                <Stack.Screen
                    name="LiveingLession"
                    component={LiveingLessonInfo}
                    options={{
                        title: "直播公开课",
                    }}
                />

                {/* 在线课堂 */}
                <Stack.Group>
                    <Stack.Screen
                        name="ConnectClass"
                        component={ConnectClass}
                    />
                    <Stack.Screen
                        name="OnlineClassTemp"
                        component={OnlineClassTempPage}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen name="扫码" component={QRCodeScanner} />
                </Stack.Group>

                {/* 错题本模块的导航 */}
                <Stack.Screen
                    name="WrongSee"
                    component={WrongSee}
                    options={{
                        headerRight: () => <WrongRecycleButtoContainer />,
                        title: "错题本",
                    }}
                />

                <Stack.Group>
                    <Stack.Screen
                        name="WrongRecycle"
                        component={WrongRecycle}
                        options={{
                            title: "错题回收站",
                        }}
                    />
                    <Stack.Screen
                        name="WrongDetails"
                        component={WrongDetails}
                        options={{
                            title: "错题详情",
                        }}
                    />
                    <Stack.Screen name="Wrongbook" component={Wrongbook} />
                </Stack.Group>
                <Stack.Group>
                    <Stack.Screen
                        name="Teacher_Home"
                        component={TeacherTabBar}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Group>
                {/**教师端首页 */}
                <Stack.Group>
                    <Stack.Screen
                        name="设置作业属性"
                        component={HomeworkPropertyContainer}
                        options={{
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="创建作业"
                        component={CreateHomework}
                        // component={CreateHomeworkFrame}
                        options={{
                            headerShown: false,
                        }}
                    />
                    {/* <Stack.Screen
                        name="创建作业"
                        component={CreateHomework}
                        options={{
                            headerShown: false,
                        }}
                    /> */}
                    <Stack.Screen
                        name="AssignPaper"
                        component={AssignPaperContainer}
                        options={{
                            title: "布置作业",
                        }}
                    />
                    <Stack.Screen
                        name="设置导学案属性"
                        component={LearnCasePropertyContainer}
                        options={{
                            headerShown: true,
                        }}
                    />
                    <Stack.Screen
                        name="创建导学案"
                        component={CreateLearnCaseFrame}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="CreateInform"
                        component={Tea_CreateInform}
                        options={{
                            title: "发布通知",
                        }}
                    />
                    <Stack.Screen
                        name="CreateNotice"
                        component={Tea_CreateNotice}
                        options={{
                            title: "发布公告",
                        }}
                    />
                    <Stack.Screen
                        name="LookInform"
                        component={Tea_Inform}
                        options={{
                            title: "通知",
                        }}
                    />
                    <Stack.Screen
                        name="LookNotice"
                        component={Tea_Notice}
                        options={{
                            title: "公告",
                        }}
                    />
                    <Stack.Screen
                        name="AssignLearnPlan"
                        component={AssignLearnPlanContainer}
                        options={{
                            title: "布置导学案",
                        }}
                    />
                </Stack.Group>
                <Stack.Group>
                    <Stack.Screen
                        name="Select_subject"
                        component={Select_Subject}
                        options={{
                            title: "高考选科",
                        }}
                    />
                    <Stack.Screen
                        name="Selectsubject_Submit"
                        component={Select_Subject_SubmitContainer}
                        options={{
                            title: "高考选科",
                        }}
                    />
                </Stack.Group>

                {/* 老师批改作业/导学案 */}
                <Stack.Group>
                    <Stack.Screen
                        name="CorrectPaperList"
                        component={PaperListContainer}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="Correcting_Paper"
                        component={CorrectingPaper}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="LookCorrectDetails"
                        component={LookCorrectDetails}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Group>

                {/* 拍照布置作业 */}
                <Stack.Group>
                    <Stack.Screen
                        name="CreatePicturePaperWork"
                        component={CreateWorkContainer}
                    />
                    <Stack.Screen
                        name="EditPicturePaperWork"
                        component={EditWorkContioner}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="AssignPicturePaperWork"
                        component={AssignPicturesWorkContainer}
                        options={{
                            title: "布置作业",
                        }}
                    />
                </Stack.Group>

                {/* 遥控器 */}
                <Stack.Group>
                    <Stack.Screen
                        name="ControllerLogin"
                        component={ControllerLogin}
                        options={{ title: "遥控器登录" }}
                    />
                    <Stack.Screen
                        name="ControllerHome"
                        component={ControllerHome}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="ControllerSharePhoto"
                        component={ControllerSharePhoto}
                        options={{ headerShown: false }}
                    />
                </Stack.Group>

                {/* 测试 */}
                <Stack.Group>
                    <Stack.Screen
                        name="TestPage"
                        component={TestPage}
                    ></Stack.Screen>
                </Stack.Group>
            </Stack.Navigator>
        );
    }
}
