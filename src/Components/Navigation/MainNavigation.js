import React, { Component } from "react";
import { Button, Text, View, TouchableOpacity, Image } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabBar from "./TabBar";
import Details from "../../pages/Details/Details";
import Information from "../../pages/Inf/Inf";
import Login from "../../pages/Login/Login";
import PackagesPage from "../../pages/LatestTask/PackagesPage";
import Todo from "../../pages/LatestTask/Todo";
import InformOrNotice from "../../pages/LatestTask/InformOrNotice";
import { Icon, SearchBar, TabBar } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";

import Menu from "../../pages/LatestTask/DoWork/Utils/Menu";
import ViewPager_ToDo from "../../pages/LatestTask/DoWork/ViewPager_ToDo";
import OnlineClassTempPage from "../../pages/OnlineClass";
import QRCodeScanner from "../../utils/QRCode/QRCodeScanner";
import ConnectClass from "../../pages/OnlineClass/ConnectClass";
import WrongSee from '../../pages/Wrongbook/WrongSee'
import Wrongbook from "../../pages/Wrongbook/Wrongbook";
import WrongDetails from'../../pages/Wrongbook/WrongDetails';
import WrongRecycleButton from "../../pages/Wrongbook/WrongRecycleButton";

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
                    <Stack.Screen name="InformOrNotice" component={InformOrNotice} />
                    <Stack.Screen
                        name="做作业"
                        component={ViewPager_ToDo}
                        options={{
                            headerRight: () => (
                                <Menu learnPlanId="1b2a59d2-8990-4672-a97b-124a96a7f8c8" />
                            ),
                        }}
                    />
                </Stack.Group>
                <Stack.Group>
                    <Stack.Screen
                        name="ConnectClass"
                        component={ConnectClass}
                    />
                    <Stack.Screen
                        name="OnlineClassTemp"
                        component={OnlineClassTempPage}
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
                            headerRight:() => (
                                <WrongRecycleButton/>),
                            title: '错题本'
                        }}
                    />
                    <Stack.Screen
                        name="WrongDetails"
                        component={WrongDetails}
                        options={{
                            
                            title: '错题详情'
                        }}
                    />
                    <Stack.Screen
                        name="Wrongbook"
                        component={Wrongbook}
                    />
            </Stack.Navigator>
        );
    }
}
