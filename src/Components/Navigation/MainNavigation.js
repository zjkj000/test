import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabBar from "./TabBar";
import Login from "../../pages/Login/Login";
import PackagesPage from "../../pages/LatestTask/PackagesPage";
import Todo from "../../pages/LatestTask/Todo";
import Inform from "../../pages/LatestTask/Inform";
import Notice from "../../pages/LatestTask/Notice";

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
                <Stack.Screen name="Login" component={Login} />
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
                    <Stack.Screen name="DoPaper" component={Paper_ToDo} />
                    <Stack.Screen
                        name="SubmitPaper"
                        component={Paper_SubmitContainer}
                    />
                    <Stack.Screen
                        name="ShowCorrected"
                        component={Paper_ShowCorrected}
                    />
                    <Stack.Screen
                        name="DoLearningGuide"
                        component={Learningguide_ToDo}
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
                    <Stack.Screen
                        name="QRCodeScanner"
                        component={QRCodeScanner}
                    />
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
            </Stack.Navigator>
        );
    }
}
