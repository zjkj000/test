import React, { Component } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabBar from "./TabBar";
import Login from "../../pages/Login/Login";
import PackagesPage from "../../pages/LatestTask/PackagesPage";
import Todo from "../../pages/LatestTask/Todo";
import InformOrNotice from "../../pages/LatestTask/InformOrNotice";

import Menu from "../../pages/LatestTask/DoWork/Utils/Menu";
import Paper_ToDo from "../../pages/LatestTask/DoWork/Paper_ToDo";
import Paper_ShowCorrected from "../../pages/LatestTask/DoWork/Paper_ShowCorrected";
import Paper_SubmitContainer from "../../pages/LatestTask/DoWork/Paper_Submit";
import OnlineClassTempPage from "../../pages/OnlineClass";
import QRCodeScanner from "../../utils/QRCode/QRCodeScanner";
import ConnectClass from "../../pages/OnlineClass/ConnectClass";
import WrongSee from "../../pages/Wrongbook/WrongSee";
import Wrongbook from "../../pages/Wrongbook/Wrongbook";
import WrongDetails from "../../pages/Wrongbook/wrongDetails";

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
                    <Stack.Screen
                        name="PackagesPage"
                        component={PackagesPage}
                    />
                    <Stack.Screen name="Todo" component={Todo} />
                    <Stack.Screen
                        name="InformOrNotice"
                        component={InformOrNotice}
                    />
                    <Stack.Screen
                        name="DoPaper"
                        component={Paper_ToDo}
                       
                    />
                    <Stack.Screen
                        name="SubmitPaper"
                        component={Paper_SubmitContainer}
                    />
                    <Stack.Screen
                        name="ShowCorrected"
                        component={Paper_ShowCorrected}
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
                <Stack.Group>
                    <Stack.Screen name="错题本" component={WrongSee} />
                    <Stack.Screen name="Wrongbook" component={Wrongbook} />
                    <Stack.Screen
                        name="WrongDetails"
                        component={WrongDetails}
                    />
                </Stack.Group>
            </Stack.Navigator>
        );
    }
}
