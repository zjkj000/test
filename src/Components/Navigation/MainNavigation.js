import React, { Component } from "react";
import { Button, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import MyTabBar from "./TabBar";
import Details from "../../pages/Details/Details";
import Information from "../../pages/Inf/Inf";
import Login from "../../pages/Login/Login";
import PackagesPage from "../../pages/LatestTask/PackagesPage";
import Todo from "../../pages/LatestTask/Todo";
import { Icon, SearchBar, TabBar } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";

import ViewPager_ToDo from "../../pages/LatestTask/DoWork/ViewPager_ToDo";
import Answer_judgment from "../../pages/LatestTask/DoWork/Answer_type/Answer_judgment";
import Answer_subjective from "../../pages/LatestTask/DoWork/Answer_type/Answer_subjective";
import Answer_read from "../../pages/LatestTask/DoWork/Answer_type/Answer_read";
import Answer_multiple from "../../pages/LatestTask/DoWork/Answer_type/Answer_multiple";
import Answer_single from "../../pages/LatestTask/DoWork/Answer_type/Answer_single";
import Submit from "../../pages/LatestTask/DoWork/Answer_type/Submit";
import OnlineClassTempPage from "../../pages/OnlineClass";
import QRCodeScanner from "../../utils/QRCode/QRCodeScanner";

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
                        color: "#333333",
                        fontFamily: "PingFangSC-Semibold",
                        fontWeight: "700",
                    },
                    headerTintColor: "red", // 导航栏字体颜色设置 如果设置了headerTitleStyle则此处设置不生效
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
                        name="ViewPager_ToDo"
                        component={ViewPager_ToDo}
                    />
                    <Stack.Screen
                        name="Answer_single"
                        component={Answer_single}
                    />
                    <Stack.Screen
                        name="Answer_multiple"
                        component={Answer_multiple}
                    />
                    <Stack.Screen
                        name="Answer_judgment"
                        component={Answer_judgment}
                    />
                    <Stack.Screen
                        name="Answer_subjective"
                        component={Answer_subjective}
                    />
                    <Stack.Screen name="Answer_read" component={Answer_read} />
                    <Stack.Screen name="交作业" component={Submit} />
                </Stack.Group>

                <Stack.Group>
                    <Stack.Screen
                        name="OnlineClassTemp"
                        component={OnlineClassTempPage}
                    />
                    <Stack.Screen
                        name="QRCodeScanner"
                        component={QRCodeScanner}
                    />
                </Stack.Group>
            </Stack.Navigator>
        );
    }
}
