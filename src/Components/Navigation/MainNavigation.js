import React, { Component } from "react";
import { useNavigation } from "@react-navigation/native";
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
import Correct_img from '../../TestPage/Correct_img'
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
import CreateHomeworkFrame from "../../pages/TeacherLatestPage/CreateAndPubTasks/Homework/CreateHomeworkFrame";
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
import TestPage1 from "../../TestPage/TestPage1";
import testheight from "../../TestPage/testheight";
import { Alert, Image, TouchableOpacity } from "react-native";
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
                    headerTintColor: "#59B9E0", // ??????????????????????????? ???????????????headerTitleStyle????????????????????????
                    statusBarStyle: "light", //"inverted" | "auto" | "light" | "dark" | undefined ???????????????
                    headerLeft: React.ReactNode, //?????????????????????????????? ??????????????????????????????????????????
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
                    <Stack.Screen name="?????????" component={PackagesPage} />
                    <Stack.Screen name="Todo" component={Todo} />
                    <Stack.Screen name="??????" component={Inform} />
                    <Stack.Screen name="??????" component={Notice} />
                    <Stack.Screen name="??????" component={Videos} />
                    <Stack.Screen name="??????" component={Voice} />
                    <Stack.Screen name="PPT" component={PptRescouce} />
                    <Stack.Screen name="??????" component={WordOrPdfRescouce} />

                    {/* ??????????????? */}
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
                    {/* ?????????????????? */}
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
                    <Stack.Screen
                        name="Correct_img"
                        component={Correct_img}
                        options={{
                            headerShown: false,
                        }}
                    />
                </Stack.Group>

                <Stack.Screen
                    name="LiveingLession"
                    component={LiveingLessonInfo}
                    options={{
                        title: "???????????????",
                    }}
                />

                {/* ???????????? */}
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
                    <Stack.Screen name="??????" component={QRCodeScanner} />
                </Stack.Group>

                {/* ???????????????????????? */}
                <Stack.Screen
                    name="WrongSee"
                    component={WrongSee}
                    options={{
                        headerRight: () => <WrongRecycleButtoContainer />,
                        title: "?????????",
                    }}
                />

                <Stack.Group>
                    <Stack.Screen
                        name="WrongRecycle"
                        component={WrongRecycle}
                        options={{
                            title: "???????????????",
                        }}
                    />
                    <Stack.Screen
                        name="WrongDetails"
                        component={WrongDetails}
                        options={{
                            title: "????????????",
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
                {/**??????????????? */}
                <Stack.Group>
                    <Stack.Screen
                        name="??????????????????"
                        component={HomeworkPropertyContainer}
                        options={{
                            // headerShown: true,
                            headerLeft: () => {
                                const navigation = useNavigation();
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.canGoBack()
                                                ? navigation.goBack()
                                                : Alert.alert("", "????????????", [
                                                      {},
                                                      {
                                                          text: "??????",
                                                          onPress: () => {},
                                                      },
                                                  ]);
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height: 30,
                                                width: 30,
                                                left: 10,
                                            }}
                                            source={require("../../assets/teacherLatestPage/goback.png")}
                                        />
                                    </TouchableOpacity>
                                );
                            },
                        }}
                    />
                    <Stack.Screen
                        name="????????????"
                        component={CreateHomework}
                        // component={CreateHomeworkFrame}
                        options={{
                            headerShown: false,
                        }}
                    />
                    {/* <Stack.Screen
                        name="????????????"
                        component={CreateHomework}
                        options={{
                            headerShown: false,
                        }}
                    /> */}
                    <Stack.Screen
                        name="AssignPaper"
                        component={AssignPaperContainer}
                        options={{
                            title: "????????????",
                        }}
                    />
                    <Stack.Screen
                        name="?????????????????????"
                        component={LearnCasePropertyContainer}
                        options={{
                            // headerShown: true,
                            headerLeft: () => {
                                const navigation = useNavigation();
                                return (
                                    <TouchableOpacity
                                        onPress={() => {
                                            navigation.canGoBack()
                                                ? navigation.goBack()
                                                : Alert.alert("", "????????????", [
                                                      {},
                                                      {
                                                          text: "??????",
                                                          onPress: () => {},
                                                      },
                                                  ]);
                                        }}
                                    >
                                        <Image
                                            style={{
                                                height: 30,
                                                width: 30,
                                                left: 10,
                                            }}
                                            source={require("../../assets/teacherLatestPage/goback.png")}
                                        />
                                    </TouchableOpacity>
                                );
                            },
                        }}
                    />
                    <Stack.Screen
                        name="???????????????"
                        component={CreateLearnCaseFrame}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="CreateInform"
                        component={Tea_CreateInform}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="CreateNotice"
                        component={Tea_CreateNotice}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="LookInform"
                        component={Tea_Inform}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="LookNotice"
                        component={Tea_Notice}
                        options={{
                            headerShown: false,
                        }}
                    />
                    <Stack.Screen
                        name="AssignLearnPlan"
                        component={AssignLearnPlanContainer}
                        options={{
                            title: "???????????????",
                        }}
                    />
                </Stack.Group>
                <Stack.Group>
                    <Stack.Screen
                        name="Select_subject"
                        component={Select_Subject}
                        options={{
                            title: "????????????",
                        }}
                    />
                    <Stack.Screen
                        name="Selectsubject_Submit"
                        component={Select_Subject_SubmitContainer}
                        options={{
                            title: "????????????",
                        }}
                    />
                </Stack.Group>

                {/* ??????????????????/????????? */}
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

                {/* ?????????????????? */}
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
                            title: "????????????",
                        }}
                    />
                </Stack.Group>

                {/* ????????? */}
                <Stack.Group>
                    <Stack.Screen
                        name="ControllerLogin"
                        component={ControllerLogin}
                        options={{ title: "???????????????" }}
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
            </Stack.Navigator>
        );
    }
}
