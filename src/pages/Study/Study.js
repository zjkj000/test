import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity } from "react-native";
import { SearchBar } from "@ant-design/react-native";
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { useNavigation } from "@react-navigation/native";
import {
    Avatar,
    Layout,
    Button,
    Divider,
    Input,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";

import StudyListContainer from "./StudyListContainer";


export default function StudyContainer() {
    const navigation = useNavigation();
    //将navigation传给LatestTask组件，防止路由出错
    return <Study navigation={navigation}></Study>;
}

class Study extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showSearch: false,
            showFilter: true,
            value: '',  //搜索栏中的内容
            resourceType: '9', //TodoList组件所要渲染的页面内容类型all:所有， 1：导学案,2：作业，3：通知4：公告
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
        }else{
            this.setState({ resourceType: '9' });
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
        }else{
            this.setState({ resourceType: '9' });
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
        this.setState({ resourceType: '9'});
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
    

    //显示筛选filter
    showFilter = () => {
        return(
            <View>
                <OverflowMenu
                    anchor={this.renderAvatar}
                    backdropStyle={styles.backdrop}
                    visible={this.state.moduleVisible}
                    onBackdropPress={() => {
                        this.setState({ moduleVisible: false});
                    }}
                    style={{width: screenWidth*0.22,}}
                >
                    <MenuItem 
                        title = "全部"
                        onPress={this.handleAll}
                        //style={styles.menuItem}
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
                        <View style={styles.searchView}>
                            <SearchBar 
                                style={styles.searchBar}
                                value={this.state.value}
                                placeholder="学案/作业"
                                ref={ref => this.searchText = ref}
                                //onFocus={() => this.showSearch(true)}
                                onCancel={this.onSearch}
                                onChange={this.onChange}
                                //onSubmit={this.onBlur}
                                onBlur={this.onBlur}
                                //onSubmit={() => this.showSearch(false)}
                                cancelText='搜索'
                                showCancelButton
                            />
                        </View>
                        <Flex style={{width: screenWidth * 0.12}}>
                            <View style={{width: screenWidth * 0.04}}></View>
                            <TouchableOpacity
                                style={styles.filterView}
                            >
                                {/*<Image
                                    source={require("../../assets/LatestTaskImages/filter.png")}
                                    style={styles.filterImg}
                                />*/}
                                {/*this.showSerachOrFilter()*/}
                                {this.showFilter()}
                            </TouchableOpacity>
                        </Flex>
                    </Flex>
                </View>
                <View style={styles.todoList}>
                    {console.log('最新内容类型' , this.state.resourceType)}
                    <StudyListContainer resourceType={this.state.resourceType} />
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
        paddingLeft: screenWidth*0.03,
    },
    packagesImg: {
        height: "100%",
        width: "50%",
        resizeMode: "contain",
    },
    packagesView: {
        width: screenWidth * 0.1,
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
        width: screenWidth * 0.75,
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
});
