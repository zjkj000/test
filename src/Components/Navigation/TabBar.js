import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { Icon, SearchBar, TabBar } from "@ant-design/react-native";
import Loading from "../../utils/loading/Loading";
import MyPage from "../../pages/My/My";
<<<<<<< HEAD
import Wrongbook from "../../pages/Wrongbook/Wrongbook";
=======
import LatestTask from "../../pages/LatestTask/LatestTask";
>>>>>>> e5928c0fa68cced17f6a20b6680a94b524861482
import {
    bindBackExitApp,
    removeBackExitApp,
} from "../../utils/TwiceTap/TwiceTap";
import ConnectClass from "../../pages/OnlineClass/ConnectClass";

export default class MyTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "home",
            isLoading: false,
        };
    }
    componentDidMount() {
        bindBackExitApp();
    }
    componentWillUnmount() {
        removeBackExitApp();
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
    renderMy = () => {
        return <MyPage />;
    };
    renderOnlineClass = () => {
        return <ConnectClass />;
    };
    renderWrongTopic = () => {
        return (
            <View>
                <Wrongbook/>
                
            </View>
        );
    };
    render() {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="#f5f5f5"
            >
                <TabBar.Item
                    title="首页"
                    icon={<Icon name="home" />}
                    selected={this.state.selectedTab === "home"}
                    onPress={(e) => this.onChangeTab("home")}
                >
                    {this.renderHome()}
                </TabBar.Item>
                <TabBar.Item
                    icon={<Icon name="schedule" />}
                    title="线上课程"
                    selected={this.state.selectedTab === "onlineClass"}
                    onPress={() => this.onChangeTab("onlineClass")}
                >
                    {this.renderOnlineClass()}
                </TabBar.Item>
                <TabBar.Item
                    icon={<Icon name="book" />}
                    title="错题本"
                    selected={this.state.selectedTab === "wrongTopic"}
                    onPress={() => this.onChangeTab("wrongTopic")}
                >
                    {this.renderWrongTopic()}
                </TabBar.Item>
                <TabBar.Item
                    icon={<Icon name="user" />}
                    title="我的"
                    selected={this.state.selectedTab === "my"}
                    onPress={() => this.onChangeTab("my")}
                >
                    {this.renderMy()}
                </TabBar.Item>
            </TabBar>
        );
    }
}
