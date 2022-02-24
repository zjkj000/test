import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SearchBar } from "@ant-design/react-native";
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
//import { Container , Header , Item , Input , Icon , Button } from 'native-base';

import TodoList from "./TodoList";

export default function LatestTaskContainer() {
    const navigation = useNavigation();
    //将navigation传给LatestTask组件，防止路由出错
    return <LatestTask navigation={navigation}></LatestTask>;
}

class LatestTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    //点击文件夹图标跳转
    packagesPage = () => {
        console.log("文件夹页面跳转");
        this.props.navigation.navigate("PackagesPage", {});
    };
    //点击选择过滤图标，显示todo类型（全部、作业、导学案等)
    filterList = () => {
        return <Text>ggg</Text>;
    };

    render() {
        //console.log('navigation' , this.props.navigation);
        return (
            <View>
                <View style={styles.header}>
                    <Flex style={styles.flexNew}>
                        {/*<Flex.Item style={styles.flexItem2}><Icon name="folder" size="lg" /></Flex.Item>*/}
                        {/*<View style={styles.packagesView} onPress={this.packagesPage}>*/}
                        <TouchableOpacity
                            style={styles.packagesView}
                            onPress={this.packagesPage}
                        >
                            <Image
                                source={require("../../assets/LatestTaskImages/packages.png")}
                                style={styles.packagesImg}
                            />
                        </TouchableOpacity>
                        {/*</View>*/}
                        <View style={styles.searchView}>
                            <SearchBar
                                placeholder="学案/作业"
                                style={styles.searchBar}
                            />
                        </View>
                        {/*<View style={styles.filterView}>*/}
                        <TouchableOpacity
                            style={styles.filterView}
                            onPress={this.filterList}
                        >
                            <Image
                                source={require("../../assets/LatestTaskImages/filter.png")}
                                style={styles.filterImg}
                            />
                        </TouchableOpacity>
                        {/*</View>*/}
                        {/*<Flex.Item style={styles.flexItem2}><Icon name="filter" size="lg" /></Flex.Item>*/}
                    </Flex>
                </View>
                <View style={styles.todoList}>
                    <TodoList />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: screenHeight * 0.1,
        backgroundColor: "#6CC5CB",
    },
    todoList: {
        height: screenHeight * 0.9,
    },
    flexNew: {
        paddingTop: 0,
        paddingLeft: 8,
    },
    packagesImg: {
        height: "100%",
        width: "55%",
        resizeMode: "contain",
    },
    packagesView: {
        width: screenWidth * 0.1,
    },
    filterImg: {
        height: "100%",
        width: "80%",
        resizeMode: "contain",
    },
    filterView: {
        width: screenWidth * 0.1,
    },
    searchView: {
        width: screenWidth * 0.8,
        //backgroundColor:'red',
        //borderWidth: 10,
        //borderColor: 'red',
        opacity: 1,
    },
    searchBar: {
        backgroundColor: "white",
        borderRadius: 40,
        height: screenHeight * 0.07,
        borderWidth: 2,
        //paddingTop: 0,
        fontSize: 15,
        paddingLeft: 50,
    },
});
