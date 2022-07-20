import React from "react";
import {
    Text,
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Alert,
    Modal
} from "react-native";
import { SearchBar } from "@ant-design/react-native";
//import { SearchBar } from 'react-native-elements';
import { Flex } from "@ant-design/react-native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { useNavigation, useRoute } from "@react-navigation/native";
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

import CreateListContainer from "./CreateListContainer";
import { ScrollView } from "react-native-gesture-handler";

let SearchText = "";

export default function LatestPageContainer() {
    const navigation = useNavigation();
    const route = useRoute();
    //将navigation传给LatestTask组件，防止路由出错
    return <LatestPage navigation={navigation} route={route}></LatestPage>;
}

class LatestPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            resourceType: "", //CreateList组件所要渲染的页面内容类型 '':所有， 1：导学案,2：作业，3：通知4：公告
            //6：授课包，7：微课，9：导学案+作业+微课+授课包 10：通知+公告

            createmoduleVisible: false, //创建作业等弹出框是否显示
            filtermoduleVisible: false, //筛选作业等弹出框是否显示

            searchPoint: "",
        };
    }

    componentDidMount() {
        const { navigation } = this.props;
        this._unsubscribeNavigationFocusEvent = navigation.addListener(
            "focus",
            () => {
                // console.log(
                //     "LatestPageFocused===================================="
                // );
                // console.log(this.props.route);
                if (
                    this.props.route.params !== undefined &&
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
        // console.log('*******');
        this.setState({
            searchPoint: SearchText,
        });
    };

    //点击键盘中的提交按钮，光标移出搜索框，“搜索“二字消失
    onBlur = () => {
        console.log("点击了键盘中的提交按钮");
        this.setState({
            searchPoint: SearchText,
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
        this.setState({ resourceType: "", filtermoduleVisible: false });
    };
    //作业
    handleHomework = () => {
        this.setState({ resourceType: "2", filtermoduleVisible: false });
    };
    //导学案
    handleGuidance = () => {
        this.setState({ resourceType: "1", filtermoduleVisible: false });
    };
    //授课包
    handleTeachingPackages = () => {
        this.setState({ resourceType: "6", filtermoduleVisible: false });
    };
    //微课
    handleMicroClass = () => {
        this.setState({ resourceType: "7", filtermoduleVisible: false });
    };
    //通知
    handleInform = () => {
        this.setState({ resourceType: "3", filtermoduleVisible: false });
    };
    //公告
    handleNotice = () => {
        this.setState({ resourceType: "4", filtermoduleVisible: false });
    };

    //创建+布置作业
    createHomework = () => {
        // this.setState({ createmoduleVisible: false });
        this.props.navigation.navigate("设置作业属性", {});
    };

    //创建+布置导学案
    createLearnCase = () => {
        // this.setState({ createmoduleVisible: false });
        this.props.navigation.navigate({
            name: "设置导学案属性",
            params: {
                createType: "learnCase",
            },
        });
    };

    //创建+布置微课
    createWeiKe = () => {
        // this.setState({ createmoduleVisible: false });
        this.props.navigation.navigate({
            name: "设置导学案属性",
            params: {
                createType: "weiKe",
            },
        });
    };

    //创建授课包
    createTeachingPackages = () => {
        // this.setState({ createmoduleVisible: false });
        this.props.navigation.navigate({
            name: "设置导学案属性",
            params: {
                createType: "TeachingPackages",
            },
        });
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
                    <MenuItem title="作业" onPress={this.handleHomework} />
                    <MenuItem
                        title="导学案"
                        onPress={this.handleGuidance}
                        style={styles.menuItem}
                    />
                    <MenuItem
                        title="微课"
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

    //显示创建create
    showCreate = () => {
        return (
            <View>
                <OverflowMenu
                    ref={(ref) => {
                        this.overRef = ref;
                    }}
                    anchor={this.renderAvatarCreate}
                    //弹出项外部背景样式
                    backdropStyle={styles.backdrop}
                    visible={this.state.createmoduleVisible}
                    onBackdropPress={() => {
                        this.setState({ createmoduleVisible: false });
                    }}
                    style={{ height: 1000 }}
                >
                    {/* {console.log(this.overRef)} */}
                    <MenuItem
                        title="创建授课包"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createTeachingPackages();
                        }}
                    />
                    <MenuItem
                        title="我的授课包"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "教学内容",
                                params: {
                                    resourceType: "package",
                                },
                            });
                        }}
                    />
                    <MenuItem
                        title="创建导学案+布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createLearnCase();
                        }}
                    />
                    <MenuItem
                        title="创建微课+布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createWeiKe();
                        }}
                    />
                    <MenuItem
                        title="创建作业+布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createHomework();
                        }}
                        style={{ height: 40 }}
                    />
                    <MenuItem
                        title="选导学案布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "教学内容",
                                params: {
                                    resourceType: "learnPlan",
                                },
                            });
                        }}
                    />
                    <MenuItem
                        title="选微课布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "教学内容",
                                params: {
                                    resourceType: "weike",
                                },
                            });
                        }}
                    />
                    <MenuItem
                        title="选卷布置作业"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "Teacher_Home",
                                params: {
                                    screen: "最新",
                                    params: {
                                        isRefresh: true,
                                    },
                                },
                                merge: true,
                            });
                        }}
                    />
                    <MenuItem
                        title="拍照布置作业"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "CreatePicturePaperWork",
                            });
                        }}
                    />
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
                            style={{ height: 40 }}
                        />
                    ) : (
                        <></>
                    )}
                </OverflowMenu>
            </View>
        );
    };

    //显示创建create
    showCreate1 = () => {
        return (
            <Modal
                animationType="none"
                transparent={true}
                visible={true}
                //监听物理返回键
                onRequestClose={() => {
                    console.log('----------------Modal has been closed.---------------------');
                    Alert.alert('','关闭悬浮框', [{} , {text: '确定', onPress: ()=>{}}]);
                    this.setState({ createmoduleVisible: false });
                }}
            >
                <View>
                    <Text
                        style={{height: 70, width: 50, right: 0, position: 'absolute'}}
                        onPress={()=>{
                            this.setState({ createmoduleVisible: false });
                    }}></Text>
                </View>
                <View style={
                    global.constants.isadmin == "2"
                    ? styles.modalView
                    : styles.modalView1
                }>
                    <MenuItem
                        title="创建授课包"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createTeachingPackages();
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.4, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="我的授课包"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "教学内容",
                                params: {
                                    resourceType: "package",
                                },
                            });
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="创建导学案+布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createLearnCase();
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="创建微课+布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createWeiKe();
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="创建作业+布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.createHomework();
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="选导学案布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "教学内容",
                                params: {
                                    resourceType: "learnPlan",
                                },
                            });
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="选微课布置"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "教学内容",
                                params: {
                                    resourceType: "weike",
                                },
                            });
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="选卷布置作业"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "Teacher_Home",
                                params: {
                                    screen: "最新",
                                    params: {
                                            isRefresh: true, 
                                        },
                                },
                                merge:true
                            });
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                    <MenuItem
                        title="拍照布置作业"
                        onPress={() => {
                            this.setState({ createmoduleVisible: false });
                            this.props.navigation.navigate({
                                name: "CreatePicturePaperWork",
                            });
                        }}
                        style={{height:40}}
                    />
                    <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
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
                        style={{height:40}}
                    />
                    {
                        global.constants.isadmin == "2"
                        ? <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} />
                        : null
                    }
                    
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
                            style={{height:40}}
                        />
                    ) : (
                        <></>
                    )}
                    {/* <View style={{ paddingLeft: 0, width: screenWidth*0.35, height: 1, backgroundColor: "#DCDCDC" }} /> */}
                </View>
            </Modal>
        );
    };

    render() {
        return (
            <View style={{ backgroundColor: "#fff" , height: screenHeight - 77}}>
                <View style={styles.header}>
                    {/* <Flex style={styles.flexNew}> */}
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
                            {/* <TouchableOpacity style={styles.filterView}>
                                {this.showCreate()}
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                style={{
                                    ...styles.filterView,
                                    right: screenWidth * 0.03,
                                    position: 'absolute',
                                    // backgroundColor:'pink'
                                }}
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
                            {
                                this.state.createmoduleVisible
                                ? (
                                    this.showCreate1()
                                )
                                : null
                            }
                        </View>
                    {/* </Flex> */}
                </View>
                <View style={styles.todoList}>
                    {/* {console.log('最新内容类型' , this.state.resourceType , Date.parse(new Date()) , 'search:' , SearchText)} */}
                    <CreateListContainer
                        resourceType={this.state.resourceType}
                        searchStr={this.state.searchPoint}
                        isRefresh={
                            this.props.route.params !== undefined &&
                            this.props.route.params.isRefresh !== undefined
                                ? this.props.route.params.isRefresh
                                : ""
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
        // height: screenHeight - 132,
        height: '95%',
        backgroundColor: "#fff",
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
