import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SearchBar } from "@ant-design/react-native";
//import { SearchBar } from 'react-native-elements';
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { useNavigation  , useRoute } from "@react-navigation/native";
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

import TodoListContainer from "./TodoListContainer";

let SearchText = "";

export default function LatestTaskContainer(props) {
    const navigation = useNavigation();
    const route = useRoute();
    //将navigation传给LatestTask组件，防止路由出错
    return (
        <LatestTask
            navigation={navigation}
            route={route}
        ></LatestTask>
    );
}

class LatestTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            showFilter: true,
            value: "", //搜索栏中的内容
            resourceType: "all", //TodoList组件所要渲染的页面内容类型all:所有， 1：导学案,2：作业，3：通知4：公告
            //6：授课包，7：微课，9：导学案+作业+微课+授课包 10：通知+公告

            resourceRead: "", //资料夹是否已读接口返回的数据

            searchPoint: '',
        };
    }

    //第一次加载页面请求资料夹是否已读api
    UNSAFE_componentWillMount() {
        console.log('==================latest===========WillMount=========================')
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "studentApp_checkMineFloder.do";
        const params = {
            userId: userId,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            // console.log("resStr", resJson);
            this.setState({ resourceRead: resJson.data });
            //console.log('data' , this.state.resourceRead);
            return;
        });

        const { navigation } = this.props;
        this._unsubscribeNavigationFocusEvent = navigation.addListener(
            "focus",
            () => {
                console.log('##latest#learnId000###status000##', );
                console.log("LatestTaskFocused====================================");
                console.log(this.props.route);
                console.log("====================================");
                // this.setState({});
            }
        );
        this._unsubscribeNavigationBlurEvent = navigation.addListener(
            "blur",
            () => {
                console.log('============latest====Blur==================================')
                // SearchText = '';
            }
        );
    }

    componentWillUnmount() {
        SearchText = ""
        console.log('==========latest================卸载=================');
        this._unsubscribeNavigationFocusEvent();
        this._unsubscribeNavigationBlurEvent();
    }

    //点击文件夹图标跳转
    packagesPage = () => {
        this.setState({ resourceRead: 0 }); //资料夹状态改为已读
        // console.log("文件夹页面跳转");
        this.props.navigation.navigate("资料夹", {});
    };

    //搜索框内容改变时触发，更新value
    onChange = (value) => {
        //this.setState({ value });
        console.log('================onChange===================',typeof(value), value)
        SearchText = value;
    };
    //点击"搜索"按钮时触发
    onSearch = () => {
        // const {searchText} = this;
        // console.log('serachText' , searchText.state.value);
        // console.log('******' , searchText.state.value);
        // console.log("*******");
        this.setState({
            searchPoint: SearchText
        });
    };

    //点击键盘中的提交按钮，光标移出搜索框，“搜索“二字消失
    onBlur = () => {
        // console.log("点击了键盘中的提交按钮");
        this.setState({
            searchPoint: SearchText
        });
    };

    //显示filter图标
    renderAvatar = () => {
        return (
            <TouchableOpacity
                onPress={() => {
                    this.setState({ moduleVisible: true });
                }}
            >
                <Avatar
                    size={"tiny"}
                    shape={"square"}
                    source={require("../../assets/LatestTaskImages/filter.png")}
                />
            </TouchableOpacity>
        );
    };
    //全部最新内容
    handleAll = () => {
        // console.log("获取全部最新内容");
        this.setState({ resourceType: "all", moduleVisible: false });
    };
    //作业
    handleHomework = () => {
        // console.log("获取作业内容");
        this.setState({ resourceType: "2", moduleVisible: false });
    };
    //导学案
    handleGuidance = () => {
        // console.log("获取导学案内容");
        this.setState({ resourceType: "1", moduleVisible: false });
    };
    //授课包
    handleTeachingPackages = () => {
        // console.log("获取授课包内容");
        this.setState({ resourceType: "6", moduleVisible: false });
    };
    //微课
    handleMicroClass = () => {
        // console.log("获取微课内容");
        this.setState({ resourceType: "7", moduleVisible: false });
    };
    //通知
    handleInform = () => {
        // console.log("获取通知内容");
        this.setState({ resourceType: "3", moduleVisible: false });
    };
    //公告
    handleNotice = () => {
        // console.log("获取公告内容");
        this.setState({ resourceType: "4", moduleVisible: false });
    };

    //资料夹是否已读图标
    showPackagesStatus = () => {
        //componentwillMount第一次加载页面需要请求http://www.cn901.net:8111/AppServer/ajax/studentApp_checkMineFloder.do?&userId=ming6059&callback=ha
        //若返回数据的data值为0则不显示红点，否则存在未读则显示
        //资料夹图标只要被点击，就默认资料均被读，从资料夹页面返回时就不再显示红点标志

        console.log('==================资料夹是否已读==========================',this.state.resourceRead);
        return this.state.resourceRead != 0 ? ( //测试==0，之后需要改为！=0
            <View>
                {console.log('==================资料夹未读==========================')}
                <Image
                    source={require("../../assets/LatestTaskImages/rightNum.png")}
                    style={{height: 10,width: 10,top:10}}
                />
            </View>
        ) : (
            <View>
                {console.log('==================资料夹已读==========================')}
                <Image
                    source={require("../../assets/LatestTaskImages/packageRead.png")}
                    style={{height: 10,width: 10,top:10}}
                />
            </View>
        );
    };

    //显示筛选filter
    showFilter = () => {
        return (
            <View>
                <OverflowMenu
                    anchor={this.renderAvatar}
                    //弹出项外部背景样式
                    backdropStyle={styles.backdrop}
                    //backdropStyle={{backgroundColor:'white'}}
                    visible={this.state.moduleVisible}
                    onBackdropPress={() => {
                        this.setState({ moduleVisible: false });
                    }}
                    style={{ width: screenWidth * 0.22 }}
                    //fullWidth={false}
                >
                    <MenuItem
                        title="全部"
                        onPress={this.handleAll}
                        style={{ fontSize: 40 }}
                    />
                    <MenuItem
                        title="作业"
                        onPress={this.handleHomework}
                        //style={styles.menuItem}
                    />
                    <MenuItem
                        title="导学案"
                        onPress={this.handleGuidance}
                        style={styles.menuItem}
                    />
                    {/* <MenuItem 
                        title = "授课包"
                        onPress={this.handleTeachingPackages}
                        style={styles.menuItem}
                    /> */}
                    <MenuItem 
                        title = "微课"
                        onPress={this.handleMicroClass}
                        style={styles.menuItem}
                    />
                    <MenuItem
                        title="通知"
                        onPress={this.handleInform}
                        style={styles.menuItem}
                    />
                    <MenuItem
                        title="公告"
                        onPress={this.handleNotice}
                        style={styles.menuItem}
                    />
                </OverflowMenu>
            </View>
        );
    };

    render() {
        return (
            <View style={{backgroundColor:'#fff' , height: screenHeight - 77}}>
                <View style={styles.header}>
                    <View style={{ width: screenWidth * 0.125 , flexDirection: 'row' }}>
                        <TouchableOpacity
                            style={{
                                paddingTop: 15,
                                width: 25,
                                // backgroundColor:'pink',
                                marginLeft: screenWidth * 0.025,
                            }}
                            onPress={this.packagesPage}
                        >
                            <Image
                                source={require("../../assets/LatestTaskImages/packages.png")}
                                style={styles.packagesImg}
                            />
                        </TouchableOpacity>
                        {this.showPackagesStatus()}
                    </View>
                    <View style={styles.searchView}>
                        {console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++',SearchText,typeof(SearchText))}
                        <SearchBar
                            style={styles.searchBar}
                            value={{SearchText}}
                            placeholder="学案/作业"
                            ref={(ref) => (this.searchText = ref)}
                            onCancel={this.onSearch}
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            cancelText="搜索"
                            showCancelButton
                        />
                    </View>
                    <View style={{ width: screenWidth * 0.125 }}>
                        <TouchableOpacity style={{
                            ...styles.filterView,
                            right: screenWidth * 0.03,
                            position: 'absolute',
                            // backgroundColor:'pink'
                        }}>
                            {this.showFilter()}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.todoList}>
                    {/* {console.log('###learnId000#############SearchText######status000##',this.props.learnId , this.state.searchPoint , this.props.status)} */}
                    <TodoListContainer 
                        resourceType={this.state.resourceType} 
                        searchStr={this.state.searchPoint}  
                        learnId= {
                            this.props.route.params !== undefined && 
                            this.props.route.params.learnId !== undefined 
                            ? this.props.route.params.learnId
                            : ''
                        }
                        status= {
                            this.props.route.params !== undefined && 
                            this.props.route.params.status !== undefined 
                            ? this.props.route.params.status
                            : ''
                        }
                    />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    header: {
        height: 55,
        backgroundColor: "#6CC5CB",
        flexDirection: 'row',
    },
    todoList: {
        // height: screenHeight - 132,
        height: '95%',
        backgroundColor: "#fff",
    },
    packagesView: {
        width: screenWidth * 0.1,
    },
    packagesImg: {
        height: 22,
        width: 22,
    },
    rightNumView: {
        width: screenWidth * 0.05,
    },
    rightNumImg: {
        height: 22,
        width: 22,
        //top:0,
        //left:0,
        //marginLeft:0,
    },
    filterImg: {
        height: 22,
        width: 22,
    },
    filterView: {
        height: '100%',
        paddingTop: 15,
        width: 25,
    },
    searchView: {
        width: screenWidth * 0.75,
        opacity: 1,
        height: 55,
        paddingTop: 5,
        backgroundColor: '#6CC5CB'
    },
    searchBar: {
        backgroundColor: "#fff",
        borderRadius: 40,
        borderWidth: 0,
        fontSize: 15,
        paddingLeft: 30,
        height: 38
    },
    showSearch: {
        fontSize: 15,
        color: "white",
    },
    backdrop: {
        //backgroundColor: "purple",
    },
});
