import React from "react";
import { SafeAreaView, StyleSheet, Button } from "react-native";
import { Tabs, SearchBar } from "@ant-design/react-native";
import Home from "./Home";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";

class MyTabsPage extends React.Component {
    constructor(props) {
        console.log(props.navigation);
        super(props);
        this.state = {
            tab: [
                { title: "1st Tab" },
                { title: "2nd Tab" },
                { title: "3rd Tab" },
                { title: "4th Tab" },
                { title: "5th Tab" },
                { title: "6th Tab" },
                { title: "7th Tab" },
                { title: "8th Tab" },
                { title: "9th Tab" },
            ],
        };
    }

    renderContent = (tab, index) => {
        const style = {
            paddingVertical: 40,
            justifyContent: "center",
            alignItems: "center",
            margin: 10,
            backgroundColor: "#ddd",
        };
        return <Home />;
    };
    render() {
        return (
            <SafeAreaView style={{ width: screenWidth, height: screenHeight }}>
                <SearchBar placeholder="Search" showCancelButton />
                <Button
                    title="Press me"
                    onPress={() => {
                        this.props.navigation.navigate("Inf");
                    }}
                />
                <Tabs
                    tabs={this.state.tab}
                    initialPage={1}
                    tabBarPosition="top"
                    animated="true"
                >
                    {this.renderContent}
                </Tabs>
            </SafeAreaView>
        );
    }
}

export default function MyTabs(props) {
    const navigation = useNavigation();

    return <MyTabsPage {...props} navigation={navigation} />;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    title: {
        fontSize: 15,
        color: "blue",
    },
    footer: {
        flexDirection: "row",
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    content: {
        fontSize: 15,
        color: "black",
    },
});
