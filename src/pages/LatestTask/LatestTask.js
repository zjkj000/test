import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SearchBar } from "@ant-design/react-native";
//import { SearchBar } from 'react-native-elements';
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
//import { Container , Header , Item , Input , Icon , Button } from 'native-base';
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


export default function LatestTaskContainer() {
    const navigation = useNavigation();
    //将navigation传给LatestTask组件，防止路由出错
    return <LatestTask navigation={navigation}></LatestTask>;
}

class LatestTask extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            showFilter: true,
            value: '',  //搜索栏中的内容
            resourceType: 'all', //TodoList组件所要渲染的页面内容类型all:所有， 1：导学案,2：作业，3：通知4：公告
                                //6：授课包，7：微课，9：导学案+作业+微课+授课包 10：通知+公告
        };
    }

    //点击文件夹图标跳转
    packagesPage = () => {
        console.log("文件夹页面跳转");
        this.props.navigation.navigate("资料夹", {});
    };


    //搜索框内容改变时触发，更新value
    onChange = (value) => {
        this.setState({ value });
    };
    //点击"搜索"按钮时触发
    onSearch = () => {
        const {searchText} = this;
        console.log('serachText' , searchText.state.value);
        //this.setState({ value });
        this.onSubmit(searchText.state.value);
    };
    //点击"搜索"按钮时触发
    onSubmit = (value) => {
        console.log('点击了搜索');
        //this.setState({ value: '' });

        if(value == '作业'){
            this.setState({ resourceType: '2' });
        }else if(value == '导学案'){
            this.setState({ resourceType: '1' });
        }else if(value == '通知'){
            this.setState({ resourceType: '3' });
        }else if(value == '公告'){
            this.setState({ resourceType: '4' });
        }else{
            this.setState({ resourceType: 'all' });
        }
    };
    //点击键盘中的提交按钮，光标移出搜索框，“搜索“二字消失
    onBlur = () => {
        console.log('点击了键盘中的提交按钮');
        //this.setState({ value: '' });
        const {searchText} = this;
        const value = searchText.state.value;
        if(value == '作业'){
            this.setState({ resourceType: '2' });
        }else if(value == '导学案'){
            this.setState({ resourceType: '1' });
        }else if(value == '通知'){
            this.setState({ resourceType: '3' });
        }else if(value == '公告'){
            this.setState({ resourceType: '4' });
        }else{
            this.setState({ resourceType: 'all' });
        }
    };

    //显示filter图标
    renderAvatar = () => {
        return(
            <TouchableOpacity
                onPress={() => {
                    this.setState({ moduleVisible: true })
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
        console.log('获取全部最新内容');
        this.setState({ resourceType: 'all'});
    };
    //作业
    handleHomework = () => {
        console.log('获取作业内容');
        this.setState({ resourceType: '2'});
    };
    //导学案
    handleGuidance = () => {
        console.log('获取导学案内容');
        this.setState({ resourceType: '1'});
    };
    //授课包
    handleTeachingPackages = () => {
        console.log('获取授课包内容');
        this.setState({ resourceType: '6'});
    };
    //微课
    handleMicroClass = () => {
        console.log('获取微课内容');
        this.setState({ resourceType: '7'});
    };
    //通知
    handleInform = () => {
        console.log('获取通知内容');
        this.setState({ resourceType: '3'});
    };
    //公告
    handleNotice = () => {
        console.log('获取公告内容');
        this.setState({ resourceType: '4'});
    };

    //资料夹是否已读图标
    showPackagesStatus = () => {
        //第一次加载页面需要请求http://www.cn901.net:8111/AppServer/ajax/studentApp_checkMineFloder.do?&userId=ming6059&callback=ha
        //若返回数据的data值为0则不显示红点，否则存在未读则显示
        //state中是否需要保存data？？？还是只需要判断是否第一次加载

        //设置一个变量标识是否第一次加载，fetch请求之后将变量改为已加载

        return (
            <View
                style={styles.rightNumView}
            >     
                <Image
                    source={require("../../assets/LatestTaskImages/rightNum.png")}
                    style={styles.rightNumImg}
                />
            </View>
        );
    };

    //显示筛选filter
    showFilter = () => {
        return(
            <View>
                <OverflowMenu
                    anchor={this.renderAvatar}
                    //弹出项外部背景样式
                    backdropStyle={styles.backdrop}
                    //backdropStyle={{backgroundColor:'white'}}
                    visible={this.state.moduleVisible}
                    onBackdropPress={() => {
                        this.setState({ moduleVisible: false});
                    }}
                    style={{width: screenWidth*0.22,}}
                    //fullWidth={false}
                >
                    <MenuItem 
                        title = "全部"
                        onPress={this.handleAll}
                        style={{fontSize:40}}
                    />
                    <MenuItem 
                        title = "作业"
                        onPress={this.handleHomework}
                        //style={styles.menuItem}
                    />
                    <MenuItem 
                        title = "导学案"
                        onPress={this.handleGuidance}
                        style={styles.menuItem}
                    />
                    {/*<MenuItem 
                        title = "授课包"
                        onPress={this.handleTeachingPackages}
                        style={styles.menuItem}
                    />
                    <MenuItem 
                        title = "微课"
                        onPress={this.handleMicroClass}
                        style={styles.menuItem}
                    />*/}
                    <MenuItem 
                        title = "通知"
                        onPress={this.handleInform}
                        style={styles.menuItem}
                    />
                    <MenuItem 
                        title = "公告"
                        onPress={this.handleNotice}
                        style={styles.menuItem}
                    />
                </OverflowMenu>
            </View>
        );
    };

    render() {
        return (
            <View>
                <View style={styles.header}>
                    <Flex style={styles.flexNew}>
                        <TouchableOpacity
                            style={styles.packagesView}
                            onPress={this.packagesPage}
                        >     
                            <Image
                                source={require("../../assets/LatestTaskImages/packages.png")}
                                style={styles.packagesImg}
                            />
                        </TouchableOpacity>    
                        {this.showPackagesStatus()}         
                        <View style={styles.searchView}>
                            <SearchBar 
                                style={styles.searchBar}
                                value={this.state.value}
                                placeholder="学案/作业"
                                ref={ref => this.searchText = ref}

                                onCancel={this.onSearch}
                                onChange={this.onChange}
                                onBlur={this.onBlur}
                                cancelText='搜索'
                                showCancelButton
                            />
                        </View>
                        <Flex style={{width: screenWidth * 0.12}}>
                            <View style={{width: screenWidth * 0.04}}></View>
                            <TouchableOpacity
                                style={styles.filterView}
                            >
                                {this.showFilter()}
                            </TouchableOpacity>
                        </Flex>
                    </Flex>
                </View>
                <View style={styles.todoList}>
                    {console.log('最新内容类型' , this.state.resourceType)}
                    <TodoListContainer resourceType={this.state.resourceType} />
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
        height: screenHeight * 0.8,
    },
    flexNew: {
        paddingTop: 0,
        paddingLeft: screenWidth*0.02,
    },
    packagesView: {
        width: screenWidth * 0.1,
    },
    packagesImg: {
        height: "100%",
        width: "50%",
        resizeMode: "contain",
    },
    rightNumView: {
        width: screenWidth * 0.05,
    },
    rightNumImg: {
        height: "100%",
        width: "50%",
        resizeMode: "contain",
        //marginLeft:0,
    },
    filterImg: {
        height: "100%",
        width: "90%",
        resizeMode: "contain",
    },
    filterView: {
        width: screenWidth * 0.08,
    },
    searchView: {
        width: screenWidth * 0.7,
        //backgroundColor:'red',
        //borderWidth: 0,
        //borderColor: 'red',
        opacity: 1,
    },
    showSearch: {
        fontSize: 15,
        color: "white",
    },
    searchBar: {
        backgroundColor: "white",
        borderRadius: 40,
        //height: screenHeight * 0.07,
        borderWidth: 0,
        //paddingTop: 0,
        fontSize: 15,
        paddingLeft: 30,
    },
    backdrop: {
        //backgroundColor: "purple",
    },
});
