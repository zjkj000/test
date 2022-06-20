import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SearchBar } from "@ant-design/react-native";
//import { SearchBar } from 'react-native-elements';
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
//import { Container , Header , Item , Input , Icon , Button } from 'native-base';
import http from "../../utils/http/request";
import {
    Avatar,
    Layout,
    Button,
    Divider,
    Input,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";

import ContentListContainer from "./ContentListContainer";

let SearchText = '';

export default function LatestPageContainer(props) {
    console.log('教学内容页面：',props)
    const navigation = useNavigation();
    //将navigation传给LatestTask组件，防止路由出错
    return <TeachingContentPage navigation={navigation}></TeachingContentPage>;
}

class TeachingContentPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resourceType: 'all', //CreateList组件所要渲染的页面内容类型 '':所有， 1：导学案,2：作业，3：通知4：公告
                                //6：授课包，7：微课，9：导学案+作业+微课+授课包 10：通知+公告
            
            createmoduleVisible: false, //创建作业等弹出框是否显示
            filtermoduleVisible: false, //筛选作业等弹出框是否显示
        };
    }

    //第一次加载页面请求资料夹是否已读api
    // UNSAFE_componentWillMount() {
        
    // }

    

    //搜索框内容改变时触发，更新value
    onChange = (value) => {
        SearchText = value;
    };
    //点击"搜索"按钮时触发
    onSearch = () => {
        console.log('*******');
        this.setState({});
    };
    
    //点击键盘中的提交按钮，光标移出搜索框，“搜索“二字消失
    onBlur = () => {
        console.log('点击了键盘中的提交按钮');
        this.setState({});
    };

    //显示filter图标
    renderAvatarFilter = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ filtermoduleVisible: true });
                }}
            >
                <Avatar
                    size={"tiny"}
                    shape={"square"}
                    source={require("../../assets/teacherLatestPage/filter1.png")}
                />
            </TouchableOpacity>
        );
    };

    //显示create图标
    renderAvatarCreate = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ createmoduleVisible: true });
                }}
            >
                <Avatar
                    size={"tiny"}
                    shape={"square"}
                    source={require("../../assets/teacherLatestPage/create1.png")}
                />
            </TouchableOpacity>
        );
    };

    //全部最新内容
    handleAll = () => {
        this.setState({ resourceType: "all",filtermoduleVisible: false});
    };
    //作业
    handleHomework = () => {
        this.setState({ resourceType: "paper",filtermoduleVisible: false});
    };
    //导学案
    handleGuidance = () => {
        this.setState({ resourceType: "learnPlan" ,filtermoduleVisible: false});
    };
    //授课包
    handleTeachingPackages = () => {
        this.setState({ resourceType: "package" ,filtermoduleVisible: false});
    };
    //微课
    handleMicroClass = () => {
        this.setState({ resourceType: "weike" ,filtermoduleVisible: false});
    };
    


    //显示筛选filter
    showFilter = () => {
        return (
            <View>
                <OverflowMenu
                    anchor={this.renderAvatarFilter}
                    //弹出项外部背景样式
                    backdropStyle={styles.backdrop}
                    visible={this.state.filtermoduleVisible}
                    onBackdropPress={() => {
                        this.setState({ filtermoduleVisible: false });
                    }}
                    style={{ width: screenWidth * 0.22 }}
                >
                    <MenuItem
                        title="全部"
                        onPress={this.handleAll}
                        style={{ fontSize: 40 }}
                    />
                    <MenuItem
                        title="试卷"
                        onPress={this.handleHomework}
                    />
                    <MenuItem
                        title="导学案"
                        onPress={this.handleGuidance}
                        style={styles.menuItem}
                    />
                    <MenuItem 
                        title = "微课"
                        onPress={this.handleMicroClass}
                        style={styles.menuItem}
                    />
                    <MenuItem
                        title="授课包"
                        onPress={this.handleTeachingPackages}
                        style={styles.menuItem}
                    />
                </OverflowMenu>
            </View>
        );
    };

    //显示创建create
    showCreate = () => {
        return (
            <View>
                <OverflowMenu
                    anchor={this.renderAvatarCreate}
                    //弹出项外部背景样式
                    backdropStyle={styles.backdrop}
                    visible={this.state.createmoduleVisible}
                    onBackdropPress={() => {
                        this.setState({ createmoduleVisible: false });
                    }}
                    style={{ width: screenWidth * 0.34 }}
                >
                    <MenuItem
                        title="创建授课包"
                        onPress={()=>{
                            this.setState({ createmoduleVisible: false });
                            Alert.alert('该部分暂时未开发！')
                        }}
                        style={{ fontSize: 40 }}
                    />
                    <MenuItem
                        title="创建导学案+布置"
                        onPress={()=>{
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate("设置导学案属性", {});
                        }}
                        style={styles.menuItem}
                    />
                    <MenuItem 
                        title = "创建微课+布置"
                        onPress={()=>{
                            this.setState({ createmoduleVisible: false });
                            Alert.alert('该部分暂时未开发！')
                        }}
                        style={styles.menuItem}
                    />
                    <MenuItem 
                        title = "创建作业+布置"
                        onPress={()=>{
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate("设置作业属性", {});
                        }}
                        style={styles.menuItem}
                    />
                    <MenuItem
                        title="拍照布置作业"
                        onPress={()=>{
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate("CreatePicturePaperWork", {});
                        }}
                        style={styles.menuItem}
                    />
                </OverflowMenu>
            </View>
        );
    };

    render() {
        return (
            <View >
                <View style={styles.header}>
                    <Flex style={styles.flexNew}>
                        <Flex style={{ width: screenWidth * 0.12 }}>
                            {/* <View style={{ width: screenWidth * 0.04 }}></View> */}
                            <TouchableOpacity style={styles.filterView}>
                                {this.showFilter()}
                            </TouchableOpacity>
                        </Flex>
                        <View style={styles.searchView}>
                            <SearchBar
                                style={styles.searchBar}
                                value={{SearchText}}
                                placeholder="请输入您想搜索的内容"
                                ref={(ref) => (this.searchText = ref)}
                                onCancel={this.onSearch}
                                onChange={this.onChange}
                                onBlur={this.onBlur}
                                cancelText="搜索"
                                showCancelButton
                            />
                        </View>
                        <Flex style={{ width: screenWidth * 0.12 }}>
                            {/* <View style={{ width: screenWidth * 0.04 }}></View> */}
                            <TouchableOpacity style={styles.filterView}>
                                {this.showCreate()}
                            </TouchableOpacity>
                        </Flex>
                    </Flex>
                </View>
                <View style={styles.todoList}>
                    {/* {console.log('最新内容类型' , this.state.resourceType , Date.parse(new Date()) , 'search:' , SearchText)} */}
                    <ContentListContainer navigation={this.props.navigation}  resourceType={this.state.resourceType} searchStr={SearchText} />                   
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: screenHeight * 0.1,
        backgroundColor: "#4DC7F8",
    },
    todoList: {
        height: screenHeight * 0.9,
        backgroundColor:'fff'
    },
    flexNew: {
        paddingTop: screenHeight * 0.02,
        paddingLeft: screenWidth * 0.03,
    },
    filterView: {
        paddingLeft: screenWidth * 0.03,
    },
    searchView: {
        width: screenWidth * 0.7,
        opacity: 1,
    },
    searchBar: {
        backgroundColor: "white",
        borderRadius: 40,
        borderWidth: 0,
        fontSize: 15,
        paddingLeft: 30,
    },
    backdrop: {
        //backgroundColor: "purple",
    },
});
