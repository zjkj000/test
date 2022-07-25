import React from "react";
import { Text, View, StyleSheet, Image, TouchableOpacity, Alert } from "react-native";
import { SearchBar } from "@ant-design/react-native";
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import { useNavigation  , useRoute } from "@react-navigation/native";
import {
    Avatar,
    OverflowMenu,
    MenuItem,
} from "@ui-kitten/components";
import Inform_NoticeListContainer from "./Inform_NoticeListContainer";


let SearchText = '';

export default function InformAndNoticePageContainer(props) {
    console.log('通知公告：',props)
    const navigation = useNavigation();
    const route = useRoute();
    //将navigation传给LatestTask组件，防止路由出错
    return <InformAndNoticePage navigation={navigation}   route={route}></InformAndNoticePage>;
}

class InformAndNoticePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resourceType: '', //CreateList组件所要渲染的页面内容类型 '':所有， 1：导学案,2：作业，3：通知4：公告
                                //6：授课包，7：微课，9：导学案+作业+微课+授课包 10：通知+公告
            
            createmoduleVisible: false, //创建通知公告弹出框是否显示
            filtermoduleVisible: false, //筛选通知公告弹出框是否显示

            searchPoint: ''
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribeNavigationFocusEvent = navigation.addListener(
            "focus",
            () => {
                console.log("InformAndNoticePageFocused====================================");
                console.log(this.props.route);
                if (this.props.route.params !== undefined && 
                    this.props.route.params.isRefresh !== undefined && 
                    this.props.route.params.isRefresh
                ) { 
                        this.props.navigation.setParams({ isRefresh: false }); 
                        // console.log("刷新====================================",this.props.route);
                } 
                console.log("====================================");
                // bindBackExitApp();
            }
        );
    }


    componentWillUnmount() {
        SearchText = "";
        this._unsubscribeNavigationFocusEvent();
    } 


    //搜索框内容改变时触发，更新value
    onChange = (value) => {
        SearchText = value;
    };
    //点击"搜索"按钮时触发
    onSearch = () => {
        console.log('*******');
        this.setState({
            searchPoint: SearchText
        });
    };
    
    //点击键盘中的提交按钮，光标移出搜索框，“搜索“二字消失
    onBlur = () => {
        console.log('点击了键盘中的提交按钮');
        this.setState({
            searchPoint: SearchText
        });
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
                    source={require("../../../assets/teacherLatestPage/filter1.png")}
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
                    source={require("../../../assets/teacherLatestPage/create1.png")}
                />
            </TouchableOpacity>
        );
    };

    //全部最新内容
    handleAll = () => {
        this.setState({ resourceType: "",filtermoduleVisible: false});
    };
    //通知
    handleInform = () => {
        this.setState({ resourceType: "3",filtermoduleVisible: false});
    };
    //公告
    handleNotice = () => {
        this.setState({ resourceType: "4" ,filtermoduleVisible: false});
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
                    />
                    <MenuItem
                        title="通知"
                        onPress={this.handleInform}
                    />
                    <MenuItem
                        title="公告"
                        onPress={this.handleNotice}
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
                        title="发布通知"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "CreateInform",
                                params: {
                                    noticeId: "",
                                    type: "",
                                },
                            });
                        }}
                    />
                    {global.constants.isadmin == "2" ? (
                        <MenuItem
                            title="发布公告"
                            onPress={() => {
                                this.setState({ createmoduleVisible: false });
                                this.props.navigation.navigate({
                                    name: "CreateNotice",
                                    params: {
                                        noticeId: "",
                                        type: "",
                                    },
                                });
                            }}
                        />
                    ) : (
                        <></>
                    )}
                </OverflowMenu>
            </View>
        );
    };

    // render(){
    //     return(
    //         <View style={styles.header}>
    //             <View style={{ width: screenWidth * 0.125 }}>
    //                 {/* <View style={{ width: screenWidth * 0.04 }}></View> */}
    //                 <TouchableOpacity 
    //                     style={{
    //                         ...styles.filterView,
    //                         // backgroundColor:'pink',
    //                         marginLeft: screenWidth * 0.03,
    //                     }}
    //                 >
    //                     {this.showFilter()}
    //                 </TouchableOpacity>
    //             </View>
    //             <View style={styles.searchView}>
    //                 <SearchBar
    //                     style={styles.searchBar}
    //                     value={{ SearchText }}
    //                     placeholder="请输入您想搜索的内容"
    //                     ref={(ref) => (this.searchText = ref)}
    //                     onCancel={this.onSearch}
    //                     onChange={this.onChange}
    //                     onBlur={this.onBlur}
    //                     cancelText="搜索"
    //                     showCancelButton
    //                 />
    //             </View>
    //             <View style={{ width: screenWidth * 0.125 }}>
    //                 {/* <View style={{ width: screenWidth * 0.04 }}></View> */}
    //                 <TouchableOpacity style={{
    //                     ...styles.filterView,
    //                     right: screenWidth * 0.03,
    //                     position: 'absolute',
    //                     // backgroundColor:'pink'
    //                 }}>
    //                     {this.showCreate()}
    //                 </TouchableOpacity>
    //             </View>
    //         </View>
    //     )
    // }

    render() {
        return (
            <View style={{backgroundColor:'#fff' , height: screenHeight - 50}}>
                <View style={styles.header}>
                    <View style={{ width: screenWidth * 0.125 }}>
                        {/* <View style={{ width: screenWidth * 0.04 }}></View> */}
                        <TouchableOpacity 
                            style={{
                                ...styles.filterView,
                                // backgroundColor:'pink',
                                marginLeft: screenWidth * 0.03,
                            }}
                        >
                            {this.showFilter()}
                        </TouchableOpacity>
                    </View>
                    <View style={styles.searchView}>
                        <SearchBar
                            style={styles.searchBar}
                            value={{ SearchText }}
                            placeholder="请输入您想搜索的内容"
                            ref={(ref) => (this.searchText = ref)}
                            onCancel={this.onSearch}
                            onChange={this.onChange}
                            onBlur={this.onBlur}
                            cancelText="搜索"
                            showCancelButton
                        />
                    </View>
                    <View style={{ width: screenWidth * 0.125 }}>
                        {/* <View style={{ width: screenWidth * 0.04 }}></View> */}
                        <TouchableOpacity style={{
                            ...styles.filterView,
                            right: screenWidth * 0.03,
                            position: 'absolute',
                            // backgroundColor:'pink'
                        }}>
                            {this.showCreate()}
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.todoList}>
                    <Inform_NoticeListContainer 
                        resourceType={this.state.resourceType} 
                        searchStr={this.state.searchPoint}
                        isRefresh= {
                            this.props.route.params !== undefined && 
                            this.props.route.params.isRefresh !== undefined 
                            ? this.props.route.params.isRefresh
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
        backgroundColor: "#4DC7F8",
        flexDirection: 'row',
    },
    todoList: {
        height: screenHeight - 105,
        // height: '90%',
        // backgroundColor: "pink",
    },
    flexNew: {
        paddingTop: screenHeight * 0.02,
        paddingLeft: screenWidth * 0.03,
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
        backgroundColor: '#4DC7F8'
    },
    searchBar: {
        backgroundColor: "#fff",
        borderRadius: 40,
        borderWidth: 0,
        fontSize: 15,
        paddingLeft: 30,
        height: 38
    },
    backdrop: {
        // backgroundColor: "purple",
    },
    modalView: {
        marginTop: 50, //model覆盖框组件不会覆盖路由标题,但是点击顶部的路由返回箭头按钮没反应（组件覆盖）（modal组件visible为true）
        flexDirection: 'column', 
        backgroundColor: '#fff' , 
        right: 20 , 
        borderRadius: 6,
        borderWidth: 1, 
        borderColor: '#DCDCDC' ,
        height: 455,
        width: screenWidth*0.35,
        position: 'absolute',
        //justifyContent: "center",
        //alignItems: "center",
    },
    modalView1: {
        marginTop: 50, //model覆盖框组件不会覆盖路由标题,但是点击顶部的路由返回箭头按钮没反应（组件覆盖）（modal组件visible为true）
        flexDirection: 'column', 
        backgroundColor: '#fff' , 
        right: 20 , 
        borderRadius: 6,
        borderWidth: 1, 
        borderColor: '#DCDCDC' ,
        height: 412,
        width: screenWidth*0.35,
        position: 'absolute',
        //justifyContent: "center",
        //alignItems: "center",
    },
});
