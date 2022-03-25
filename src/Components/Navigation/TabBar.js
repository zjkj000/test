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
    renderContent = (pageText) => {
        return (
            <View
                style={{
                    flex: 1,
                    alignItems: "center",
                    backgroundColor: "white",
                }}
            >
                <Text style={{ margin: 50 }}>{pageText}</Text>
            </View>
        );
    };
    onChangeTab = (tabName) => {
        this.setState({
            selectedTab: tabName,
            isLoading: true,
        });
        // Loading.show();
        setTimeout(() => {
            this.setState({
                isLoading: false,
            });
            // Loading.hide();
        }, 1000);
    };
    renderHome = () => {
        return (
            /*
            <View>
                <Text>我是首页</Text>
            </View>*/
            <LatestTask />
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
                />
                <Tab.Screen name="错题本" component={this.renderWrongTopic} />
                <Tab.Screen name="我的" component={this.renderMy} />
            </Tab.Navigator>
            // <TabBar
            //     unselectedTintColor="#949494"
            //     tintColor="#33A3F4"
            //     barTintColor="#f5f5f5"
            // >
            //     <TabBar.Item
            //         title="首页"
            //         icon={<Icon name="home" />}
            //         selected={this.state.selectedTab === "home"}
            //         onPress={(e) => this.onChangeTab("home")}
            //     >
            //         {this.renderHome()}
            //     </TabBar.Item>
            //     <TabBar.Item
            //         icon={<Icon name="file" />}
            //         title="学习"
            //         selected={this.state.selectedTab === "study"}
            //         onPress={() => this.onChangeTab("study")}
            //     >
            //         {this.renderStudy()}
            //     </TabBar.Item>
            //     <TabBar.Item
            //         icon={<Icon name="schedule" />}
            //         title="线上课程"
            //         selected={this.state.selectedTab === "onlineClass"}
            //         onPress={() => this.onChangeTab("onlineClass")}
            //     >
            //         {this.renderOnlineClass()}
            //     </TabBar.Item>
            //     <TabBar.Item
            //         icon={<Icon name="book" />}
            //         title="错题本"
            //         selected={this.state.selectedTab === "wrongTopic"}
            //         onPress={() => this.onChangeTab("wrongTopic")}
            //     >
            //         {this.renderWrongTopic()}
            //     </TabBar.Item>
            //     <TabBar.Item
            //         icon={<Icon name="user" />}
            //         title="我的"
            //         selected={this.state.selectedTab === "my"}
            //         onPress={() => this.onChangeTab("my")}
            //     >
            //         {this.renderMy()}
            //     </TabBar.Item>
            // </TabBar>
        );
    }
}
