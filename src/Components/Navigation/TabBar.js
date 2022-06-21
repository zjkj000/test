import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { SearchBar, TabBar } from "@ant-design/react-native";
import Loading from "../../utils/loading/Loading";
// import Wrongbook from '../../pages/Wrongbook/Wrongbook'
import MyPage from "../../pages/My/My";
import Wrongbook from "../../pages/Wrongbook/Wrongbook";
import LatestTask from "../../pages/LatestTask/LatestTask";
import Study from "../../pages/Study/Study";
import {
    bindBackExitApp,
    removeBackExitApp,
} from "../../utils/TwiceTap/TwiceTap";
import ConnectClass from "../../pages/OnlineClass/ConnectClass";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "@ui-kitten/components";
import { useNavigation, useRoute } from "@react-navigation/native";

const Tab = createBottomTabNavigator();

export default function MyTabBar() {
    const navigation = useNavigation();
    const route = useRoute();
    return <MyTabBarComponent navigation={navigation} route={route} />;
}

class MyTabBarComponent extends React.Component {
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
                //console.log('%%%%TabBar%%%' , navigation.getState().routes);
                this.renderHome();
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
        const { navigation } = this.props;
        console.log('----TabBar-renderHome----' , navigation.getState().routes);
        const paramsData = navigation.getState().routes[1].params;
        const learnId = paramsData != null ? paramsData.learnId : '' ;
        const status = paramsData != null ? paramsData.status : '';
        //this.navigation.getState().routes[1].params = null;
        console.log('-----tabbar--------learnId-----------status---------',learnId , status);
        return (
            /*
            <View>
                <Text>我是首页</Text>
            </View>*/          
            <LatestTask learnId={learnId} status={status}/>
        );
    };
    renderStudy = () => {
        return <Study />;
    };
    renderMy = () => {
        return <MyPage />;
    };
    renderOnlineClass = () => {
        return <ConnectClass />;
    };
    renderWrongTopic = () => {
        return (
            <View>
                <Wrongbook />
                {/* <Wrongbook/>    */}
            </View>
        );
    };
    render() {
        return (
            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        switch (route.name) {
                            case "首页":
                                iconName = "home";
                                break;
                            case "学习":
                                iconName = "book-open";
                                break;
                            case "线上课程":
                                iconName = "book";
                                break;
                            case "错题本":
                                iconName = "bookmark";
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
                <Tab.Screen name="首页" component={this.renderHome} />
                <Tab.Screen name="学习" component={this.renderStudy} />
                <Tab.Screen
                    name="线上课程"
                    component={this.renderOnlineClass}
                    option={{
                        unmountOnBlur: true,
                    }}
                />
                <Tab.Screen name="错题本" component={this.renderWrongTopic} />
                <Tab.Screen name="我的" component={this.renderMy} />
            </Tab.Navigator>
        );
    }
}
