import React from "react";
import { Text, View, ActivityIndicator, Image, ScrollView } from "react-native";
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
        // ??????
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

        // ???????????????
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
                {/* <Text>?????????????????????</Text> */}
                <LatestPage fresh={this.props.type} />
            </View>
        );
    };
    renderStatistic = () => {

        return (<View >
               <StatisticalForm></StatisticalForm>
        </View>
                );
    };
    renderStudyTask = () => {
        return (
            <View>
                {/* <Text>???????????????????????????</Text> */}
                <TeachingContentPage type={this.props.type} />
            </View>
        );
    };
    renderNotice = () => {
        return (
            <View>
                {/* <Text>???????????????????????????</Text> */}
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
        // console.log('================????????????======??????==============',screenHeight,screenWidth);
        return (
            //View style={{height: 105,}}
            <>
                <Tab.Navigator
                    screenOptions={({ route }) => ({
                        tabBarIcon: ({ focused, color, size }) => {
                            let iconName;
                            switch (route.name) {
                                case "??????":
                                    iconName = "grid";
                                    break;
                                case "????????????":
                                    iconName = "bar-chart-2";
                                    break;
                                case "????????????":
                                    iconName = "file-text";
                                    break;
                                case "????????????":
                                    iconName = "bell";
                                    break;
                                case "??????":
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
                    <Tab.Screen name="??????" component={this.renderHome} />
                    <Tab.Screen
                        name="????????????"
                        component={this.renderStatistic}
                    />
                    <Tab.Screen
                        name="????????????"
                        component={this.renderStudyTask}
                    />
                    <Tab.Screen name="????????????" component={this.renderNotice} />
                    <Tab.Screen name="??????" component={this.renderMy} />
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
