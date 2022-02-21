import React from "react";
import { Text, View, ActivityIndicator } from "react-native";
import { Icon, SearchBar, TabBar } from "@ant-design/react-native";
import Calculator from "../../pages/Calculator/Calculator";
import MyTabs from "../../pages/Home/Tabs";
import Loading from "../loading/Loading";

export default class MyTabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: "home",
            isLoading: true,
        };
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
        }, 2000);
    };
    getHome = () => {
        return <MyTabs />;
    };
    getMy = () => {
        return <Calculator />;
    };
    render() {
        return (
            <TabBar
                unselectedTintColor="#949494"
                tintColor="#33A3F4"
                barTintColor="#f5f5f5"
            >
                <TabBar.Item
                    title="Home"
                    icon={<Icon name="home" />}
                    selected={this.state.selectedTab === "home"}
                    onPress={(e) => this.onChangeTab("home")}
                >
                    <Loading
                        show={this.state.isLoading}
                        list={this.getHome}
                        color={"red"}
                    />
                </TabBar.Item>
                <TabBar.Item
                    icon={<Icon name="user" />}
                    title="My"
                    selected={this.state.selectedTab === "calculator"}
                    onPress={() => this.onChangeTab("calculator")}
                >
                    <Loading show={this.state.isLoading} list={this.getMy} />
                </TabBar.Item>
            </TabBar>
        );
    }
}
