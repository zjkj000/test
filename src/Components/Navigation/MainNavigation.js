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

import ViewPager_ToDo from '../../pages/LatestTask/DoWork/ViewPager_ToDo'
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
                        backgroundColor: "red",
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
                <Stack.Screen name="PackagesPage" component={PackagesPage} />
                <Stack.Screen name="Todo" component={Todo} />
                <Stack.Screen name="ViewPager_ToDo" component={ViewPager_ToDo} />
            </Stack.Navigator>
        );
    }
}
