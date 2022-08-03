import React from "react";
import { Text, View, ActivityIndicator, Image } from "react-native";
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
import StatisticalForm from "../../TeacherStatisticalForm/StatisticalForm";
import http from "../../../utils/http/request";
import ActionButton from "react-native-action-button";
import { styles } from "./styles";
import Toast from "../../../utils/Toast/Toast";
import InformAndNticePage from "../Tea_InformAndNotice/InformAndNoticePage";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
const Tab = createBottomTabNavigator();

export default function TeacherTabBar(props) {
    // console.log(props.route);
    const type = props.route.params
        ? props.route.params.type
            ? props.route.params.type
            : ""
        : "";
    const navigation = useNavigation();
    const route = useRoute();
    return (
        <TeacherTabBarComponent
            navigation={navigation}
            route={route}
            type={type}
        />
    );
}

class TeacherTabBarComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            showBubble: false,
        };
    }
    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribeNavigationFocusEvent = navigation.addListener(
            "focus",
            () => {
                // console.log('#############tabTeacher###############', this.props.route);
                // this.renderHome();
                bindBackExitApp();
            }
        );
        this._unsubscribeNavigationBlurEvent = navigation.addListener(
            "blur",
            () => {
                // console.log('#############tabTeacher######blur#########', this.props.route);
                removeBackExitApp();
            }
        );
        // 轮询
        this.timerId = setInterval(() => {
            this.getClassStatus();
        }, 500);
    }

    componentDidUpdate() {
        // console.log('#############tabTeacher#######222########', this.props.route);
    }

    componentWillUnmount() {
        this._unsubscribeNavigationBlurEvent();
        this._unsubscribeNavigationFocusEvent();

        // 清空定时器
        clearInterval(this.timerId);
    }
    getClassStatus = () => {
        const { userName } = this.props.route.params;
        const { showBubble } = this.state;
        const url =
            global.constants.baseUrl +
            "/AppServer/ajax/teacherApp_getSkydtStatus.do";
        const params = {
            userId: userName,
        };
        http.get(url, params)
            .then((resStr) => {
                // console.log("ClassStatus====================================");
                // console.log(resStr);
                // console.log("====================================");
                // Toast.showDangerToast(resStr);
                let resJson = JSON.parse(resStr);
                this.setState({
                    resJson,
                });
                if (resJson.success) {
                    if (resJson.data !== showBubble)
                        this.setState({ showBubble: resJson.data });
                }
                // console.log("====================================");
            })
            .catch((error) => {
                Toast.showDangerToast(error.toString());
            });
    };
    renderHome = () => {
        // console.log('###########renderHome####################',this.props.route);
        // console.log('---teacher-TabBar-renderHome----' , this.props.navigation.getState().routes);
        return (
            <View>
                {/* <Text>我是教师端首页</Text> */}
                <LatestPage fresh={this.props.type} />
            </View>
        );
    };
    renderStatistic = () => {
        return <StatisticalForm />;
    };
    renderStudyTask = () => {
        return (
            <View>
                {/* <Text>我是教师端教学内容</Text> */}
                <TeachingContentPage type={this.props.type} />
            </View>
        );
    };
    renderNotice = () => {
        return (
            <View>
                {/* <Text>我是教师端通知公共</Text> */}
                <InformAndNticePage />
            </View>
        );
    };
    renderMy = () => {
        return <MyPage />;
    };
    // render(){
    //     return(
    //         <LatestPage fresh={this.props.type} />
    //     )
    // }
    render() {
        // console.log('================屏幕高度======宽度==============',screenHeight,screenWidth);
        return (
            //View style={{height: 105,}}
            <>
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
                    <Tab.Screen
                        name="统计报告"
                        component={this.renderStatistic}
                    />
                    <Tab.Screen
                        name="教学内容"
                        component={this.renderStudyTask}
                    />
                    <Tab.Screen name="通知公告" component={this.renderNotice} />
                    <Tab.Screen name="我的" component={this.renderMy} />
                </Tab.Navigator>
                {this.state.showBubble ? (
                    <ActionButton
                        renderIcon={() => {
                            return (
                                <Image
                                    source={require("../../../assets/classImg/sjBubble.png")}
                                />
                            );
                        }}
                        buttonColor="rgba(0,0,10,0.3)"
                        onPress={() => {
                            this.props.navigation.navigate("ControllerLogin");
                        }}
                        offsetY={100}
                        offsetX={10}
                    ></ActionButton>
                ) : (
                    <></>
                )}
            </>
        );
    }
}
