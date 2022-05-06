import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import {
    bindBackExitApp,
    removeBackExitApp,
} from "../../../utils/TwiceTap/TwiceTap";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@ui-kitten/components";
import { useNavigation, useRoute } from "@react-navigation/native";
import MyPage from "../../My/My";

import LatestPage from "../../TeacherLatestPage/LatestPage";
import TeachingContentPage from "../../TeacheringContent/TeachingContentPage";
import StatisticalForm from '../../TeacherStatisticalForm/StatisticalForm'
const Tab = createBottomTabNavigator();

export default function TeacherTabBar() {
    const navigation = useNavigation();
    const route = useRoute();
    return <TeacherTabBarComponent navigation={navigation} route={route} />;
}

class TeacherTabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
        };
    }
    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribeNavigationFocusEvent = navigation.addListener(
            "focus",
            () => {
                bindBackExitApp();
            }
        );
        this._unsubscribeNavigationBlurEvent = navigation.addListener(
            "blur",
            () => {
                removeBackExitApp();
            }
        );
    }
    componentWillUnmount() {
        this._unsubscribeNavigationBlurEvent();
        this._unsubscribeNavigationFocusEvent();
    }
    renderHome = () => {
        return (
            <View>
                {/* <Text>我是教师端首页</Text> */}
                <LatestPage />
            </View>
        );
    };
    renderStatistic = () => {
        return (
            <StatisticalForm />
        );
    };
    renderStudyTask = () => {
        return (
            <View>
                {/* <Text>我是教师端教学内容</Text> */}
                <TeachingContentPage />
            </View>
        );
    };
    renderNotice = () => {
        return (
            <View>
                <Text>我是教师端通知公共</Text>
            </View>
        );
    };
    renderMy = () => {
        return <MyPage />;
    };
    render() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case "最新":
                                iconName = "grid";
                                break;
                            case "统计报告":
                                iconName = "bar-chart-2";
                                break;
                            case "教学内容":
                                iconName = "file-text";
                                break;
                            case "通知公告":
                                iconName = "bell";
                                break;
                            case "我的":
                                iconName = "person";
                            default:
                                break;
                        }
                        if (!focused) {
                            iconName += "-outline";
                        }
                        return (
                            <Icon
                                style={{ width: 20, height: 20 }}
                                name={iconName}
                                fill={color}
                            />
                        );
                    },
                    tabBarActiveTintColor: "#6CC1E0",
                    tabBarInactiveTintColor: "#949494",
                    headerShown: false,
                })}
            >
                <Tab.Screen name="最新" component={this.renderHome} />
                <Tab.Screen name="统计报告" component={this.renderStatistic} />
                <Tab.Screen name="教学内容" component={this.renderStudyTask} />
                <Tab.Screen name="通知公告" component={this.renderNotice} />
                <Tab.Screen name="我的" component={this.renderMy} />
            </Tab.Navigator>
        );
    }
}
