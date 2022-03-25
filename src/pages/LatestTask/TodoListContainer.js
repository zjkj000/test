import React from "react";
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    Dimensions,
    ActivityIndicator,
    FlatList,
} from "react-native";
import { SearchBar, TabBar } from "@ant-design/react-native";
import { Icon, Flex } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";
import {
    screenWidth,
    screenHeight,
    userId,
    token,
} from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import Loading from "../../utils/loading/Loading"; //Loading组件使用export {Loading}或者export default Loading;
//import {Loading} from "../../utils/loading/Loading"; //Loading组件使用export {Loading},此时import必须加{}导入

import "../../utils/global/constants";

let pageNo = 1; //当前第几页
let itemNo = 0; //item的个数
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了

var oldtype = ""; //保存上一次查询的资源类型，若此次请求的类型与上次不同再重新发送请求
let searchStr = ""; //保存上一次搜索框内容

let todosList = []; //复制一份api请求得到的数据

let flag = 1;   //提交作业页面返回，已批改作业的状态图标问题（两次主动请求数据）

export default function TodoListContainer(props) {
    //console.log(props.resourceType);
    const rsType = props.resourceType;
    console.log('**rsType' , rsType);
    const searchStr1 = props.searchStr;
    console.log('**searchStr1' , searchStr1);
    const status = props.status;
    const navigation = useNavigation();
    //将navigation传给TodoList组件，防止路由出错
    return (
        <TodoList
            navigation={navigation}
            resourceType={rsType}
            searchStr={searchStr1}
            status={status}
        ></TodoList>
    );
}

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //type为2是作业，为1是导学案，3通知，4公告
            message: "",
            todos: [],
            isLoading: true,
            isRefresh: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            showFoot: 0, //控制foot， 0：隐藏footer 1：已加载完成，没有更多数据 2：正在加载中
            //isRefreshing: false, //下拉控制
            status: "3",
        };
        this.fetchData = this.fetchData.bind(this); //fetchData函数中this指向问题
    }

    UNSAFE_componentWillMount() {
        //初始挂载执行一遍
        oldtype = this.props.resourceType;
        searchStr = this.props.searchStr;


        console.log("componentWillMount**************" , 'oldtype' , oldtype , 'rescouceType' , this.props.resourceType , this.props.searchStr);
        this.fetchData(pageNo , oldtype , searchStr , true);
    }

    componentDidMount() {
        //初始挂载执行一遍
        //this.fetchData(pageNo);
    }

    // UNSAFE_componentWillReceiveProps(props){
    //     console.log('componentWillReceiveProps' , props);
    // }


    // shouldComponentUpdate(nextProps , nextState){
    //     console.log('shouldComponentUpdate*****Props', this.props.resourceType , this.props.searchStr);
    //     console.log('shouldComponentUpdate*****nextProps', nextProps.resourceType , nextProps.searchStr);
    //     if(this.props.resourceType != nextProps.resourceType || this.props.searchStr != nextProps.searchStr){
    //         return true;
    //     }
    //     return true;
    // }
    

    UNSAFE_componentWillUpdate(nextProps) {
        //fetchData执行会触发setState函数，又会重新执行componentWillUpdate函数，
        //需要将oldtype设置为此次请求的数据类型，否则oldtype != this.props.resourceType一直满足，将会一直发送请求
        
        //oldtype = this.props.resourceType;
        //searchStr = this.props.searchStr;

        console.log("componentWillUpdate*********", Date.parse(new Date()) , 'type:' , oldtype, 'nextProps.type:' , nextProps.resourceType);
        console.log("componentWillUpdate*********", Date.parse(new Date()) , 'searchStr:' , searchStr , 'nextProps.searchStr:' , nextProps.searchStr);

        if (
            oldtype != nextProps.resourceType ||
            searchStr != nextProps.searchStr 
        ) {
            oldtype = nextProps.resourceType;
            searchStr = nextProps.searchStr;
            console.log("componentWillUpdate*********0000", Date.parse(new Date()));
            //当此次请求与上次请求的数据类型不一致时，先清空上一次的数据再请求
            this.setState({
                todos: [],
                isLoading: true,
                error: false,
                isRefresh: true,
                showFoot: 0,
            });
            pageNo = 1; //当前第几页
            itemNo = 0; //item的个数
            dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
            this.fetchData(pageNo , oldtype , searchStr , true);
            //this.setState({ status: '3' });
        }

        if (this.props.navigation.getState().routes[1].params != null) {
            const todoId =
                this.props.navigation.getState().routes[1].params.learnId;
            const status =
                this.props.navigation.getState().routes[1].params.status;

            this.props.navigation.getState().routes[1].params = null;

            if (status == 3) {
                console.log("componentWillUpdate*********0000", Date.parse(new Date()));
                //未批改的作业，不请求数据
                //console.log('获取到的status' , status);
                for (var i = 0; i < todosList.length; i++) {
                    if (todosList[i].value.learnId == todoId) {
                        //console.log('当前todo' , todosList[i]);
                        //console.log('之前的状态' , todosList[i].value.status);
                        todosList[i].value.status = status;
                        //console.log('修改后的状态' , todosList[i].value.status);
                        this.setState({ todos: todosList });
                        return;
                    }
                }
            } else {
                console.log("componentWillUpdate*********1111", Date.parse(new Date()));
               
                // this.setState({ isLoading: true });
                // pageNo = 1; //当前第几页
                // itemNo = 0; //item的个数
                // dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
                // this.fetchData(pageNo , oldtype , searchStr , true);
                console.log('______________');
                flag = 2;
                this._onRefresh();
            }
        }
    }

    componentDidUpdate() {
        //console.log('oldtype' , oldtype);
        //console.log('resourceType' , this.props.resourceType);
        console.log("componentDidUpdate*********", Date.parse(new Date()));
        // if (
        //     oldtype != this.props.resourceType ||
        //     searchStr != this.props.searchStr
        // ) {
        //     console.log("componentDidUpdate*********0000", Date.parse(new Date()));
        //     //当此次请求与上次请求的数据类型不一致时，先清空上一次的数据再请求
        //     this.setState({
        //         todos: [],
        //         isLoading: true,
        //         error: false,
        //         isRefresh: true,
        //         showFoot: 0,
        //     });
        //     pageNo = 1; //当前第几页
        //     itemNo = 0; //item的个数
        //     dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
        //     this.fetchData(pageNo, (onRefresh = true));
        //     //this.setState({ status: '3' });
        // }
    }

    //显示任务状态的图标
    showStatusUrl = (todo, todoIndex, statusImg) => {
        //console.log('showTodo' , todo);

        if (todo.type == "通知" || todo.type == "公告") {
            return (
                //todo.status == 4表明已读,5未读
                todo.status == 4 ? null : (
                    <Image source={statusImg} style={styles.imgStatus} />
                )
            );
        } else if (todo.type == "作业") {
            return <Image source={statusImg} style={styles.imgStatus} />;
        } else {
            return <Image source={statusImg} style={styles.imgStatus} />;
        }
    };

    //通过fetch请求数据
    fetchData(pageNo , type , search , onRefresh = false) {
        console.log("fetchData*********", Date.parse(new Date()));
        // const rsType = this.props.resourceType;
        // const searchStr = this.props.searchStr;
        const token = global.constants.token;
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "studentApp_getStudentPlan.do";
        const params = {
            currentPage: pageNo,
            userId: userId,
            resourceType: type,
            searchStr: search,
            //callback:'ha',
            token: token,
        };      

       
        // if(flag == 3){
        //     console.log('&&&&&&&&&*******&&&&&&&&&');
        //     flag = 1;
        //     this.setState({
        //         todos: todosList,
        //     });
        //     return;
        // }
        // console.log('&&&&&&&&&&******&&&&&&&&');
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                let todosList1 = [];
                todosList1 = resJson.data; //重要！！！

                let dataBlob = [];
                let i = itemNo;
                console.log("fetchData*********success", Date.parse(new Date()));
                todosList1.map(function (item) {
                    dataBlob.push({
                        key: i,
                        value: item,
                    });
                    i++;
                });
                itemNo = i;
                //console.log("itemNo", itemNo);
                let foot = 0;
                if (todosList1.length < 12) {
                    foot = 1; //未请求到数据，数据加载完了
                    dataFlag = false; //数据加载完了
                }
                
                this.setState({
                    message: resJson.message,

                    //下拉刷新时todos只保存第一页数据dataBlob
                    todos: onRefresh
                        ? dataBlob
                        : this.state.todos.concat(dataBlob),
                    isLoading: false,
                    isRefresh: false,
                    showFoot: foot, 
                    //isRefreshing: false,
                });
                
                
                // if(flag == 2){
                //     console.log('&&&&&&&&&&&&&&&&&&');
                //     flag = 3;
                //     //flag = 1;
                //     todosList = dataBlob;
                    
                //     this._onRefresh();
                //     //this.setState({ todos: todosList });
                //     return;
                // }
                todosList1 = null;
                dataBlob = null;


                if(flag == 2){
                    console.log('&&&&&&&&&&&&&&&&&&');
                    flag = 1;
                    this._onRefresh();
                    return;
                }
            })
            .catch((error) => {
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //加载等待页
    renderLoadingView() {
        return (
            <View style={styles.container}>
                <Loading show={true} />
            </View>
        );
    }

    //加载失败view
    renderErrorView() {
        const { errorInfo } = this.state.errorInfo;
        return (
            <View style={styles.container}>
                <Text>Fail</Text>
                {this.setState({ error: false })}
                {/* <Text>{this.state.message}</Text> */}
                <Text>{errorInfo}</Text>
            </View>
        );
    }

    //返回itemView(单个todo)
    _renderItemView = (todoItem) => {
        const navigation = this.props.navigation;

        //console.log('tododo' , todoItem);  //index、item（key、value）、separators
        //console.log('tododo' , todoItem.item);
        //console.log('todolength' , Object.keys(todoItem).length);

        //复制一份请求的数据
        todosList = this.state.todos;
        //console.log('todosList数据',todosList);
        //console.log('todosList[1]',todosList[1]);

        //当前渲染的数据项的内容
        let todo = todoItem.item.value;
        //console.log('todo', todo);
        //当前渲染数据项的index索引
        let todoIndex = todoItem.item.key;
        //console.log('index',todoIndex);
        //Object.keys(todoItem).length != 0
        if (todo != null) {
            //console.log('tododo' , todo);
            //根据type判断是作业还是导学案等
            const todoType = todo.type;
            //作业、导学案图标
            const todoImg =
                todoType == "导学案"
                    ? require("../../assets/LatestTaskImages/study.png")
                    : todoType == "作业"
                    ? require("../../assets/LatestTaskImages/homework.png")
                    : todoType == "通知"
                    ? require("../../assets/LatestTaskImages/inform.png")
                    : require("../../assets/LatestTaskImages/public-notice.png");
            //根据图标状态指定图标的url(对于已读的通知，应该不显示任何图标，此处使用三目运算，且需要require请求资源，故设置请求资源为空白图片../Image/readInform.png)
            var statusUrl = todo.status;
            console.log('*****任务状态图标****', todoType , statusUrl);
            const statusImg =
                statusUrl == "1" || statusUrl == "5"
                    ? require("../../assets/LatestTaskImages/new.png")
                    : statusUrl == "2" || (statusUrl == "4" && todoType == "导学案")
                    ? require("../../assets/LatestTaskImages/hasCheck.png")
                    : statusUrl == "3"
                    ? require("../../assets/LatestTaskImages/noCheck.png")
                    : require("../../assets/LatestTaskImages/readInform.png");
            //小标题
            const bottomTitle = todo.bottomTitle;
            //创建者
            const createrName = todo.createrName;
            //课程名称（通过判断学习状态修改课程名称）
            const courseName = todo.courseName;
            //截止时间(当作业或导学案已批改,通知或公告时，截止时间不显示，可将截止时间修改为空字符串)
            const timeStop =
                todo.status == 2 || todo.status == 4 || todo.status == 5
                    ? ""
                    : todo.timeStop;
            const courseName_timeStop = courseName + "  " + timeStop;
            //开始时间
            const time = todo.time;
            //发布内容(当作业或导学案已批改,通知或公告时，发布内容不显示，可将发布内容修改为空字符串)
            const content =
                todo.status == 2 || todo.status == 4 || todo.status == 5
                    ? ""
                    : todo.content;

            //获取learnId（当前作业、通知公告的标识）
            const learnId = todo.learnId;
            //todo类型
            const type =
                todoType == "导学案"
                    ? 1
                    : todoType == "作业"
                    ? 2
                    : todoType == "通知"
                    ? 3
                    : 4;

            return (
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            if (todoType == "作业") {
                                // 查看已经批改的作业
                                if (statusUrl == 2) {
                                    navigation.navigate({
                                        name: "ShowCorrected",
                                        params: {
                                            learnId: learnId,
                                            selectedindex: 0,
                                            papername: bottomTitle,
                                        },
                                        megre: true,
                                    });
                                }
                                // 做作业
                                else {
                                    navigation.navigate("DoPaper", {
                                        learnId: learnId,
                                        status: statusUrl, //作业状态
                                        selectedindex: 0,
                                        papername: bottomTitle,
                                    });
                                    //this.setState({ todos: todosList });
                                }
                            } else if (todoType == "导学案") {
                                //学导学案
                                if (statusUrl == 2) {
                                    navigation.navigate({
                                        name: "ShowCorrected_LearningGuide",
                                        params: {
                                            learnId: learnId,
                                            selectedindex: 0,
                                            papername: bottomTitle,
                                        },
                                        megre: true,
                                    });
                                }
                                // 做导学案
                                else {
                                    navigation.navigate("DoLearningGuide", {
                                        learnId: learnId,
                                        status: statusUrl, //导学案状态
                                        selectedindex: 0,
                                        papername: bottomTitle,
                                    });
                                }
                            } else if (
                                todoType == "通知" ||
                                todoType == "公告"
                            ) {
                                navigation.navigate(
                                    todoType == "通知" ? "通知" : "公告",
                                    {
                                        bottomTitle: bottomTitle,
                                        createrName: createrName,
                                        time: time,
                                        courseName: courseName, //通知或公告内容
                                        learnId: learnId,
                                        status: statusUrl, //通知状态
                                        type: type, //todo类型
                                    }
                                );

                                if (statusUrl == 5) {
                                    //表示未读的通知公告
                                    //console.log('todoIndexStatus1', todosList[todoIndex].value.status)
                                    todosList[todoIndex].value.status = 4; //修改本地缓存数据
                                    //console.log('todoIndexStatus2', todosList[todoIndex].value.status);
                                    //todos = todosList; //将本地缓存数据覆盖state中的todos
                                    this.setState({ todos: todosList });
                                }
                            }
                        }}
                        style={{
                            //borderWidth: 0.5,
                            paddingTop: 10,
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingBottom: 10,
                            borderBottomWidth: 0.1, //下边框
                        }}
                    >
                        <Flex>
                            {/*作业/导学案等图标iconUrl 作业/导学案等type 图标状态statusUrl 小标题bottomTitle 创建者createrName*/}
                            <Image source={todoImg} style={styles.imgType} />
                            <Text style={styles.title}>{todoType}</Text>
                            {this.showStatusUrl(todo, todoIndex, statusImg)}
                            <View style={{ width: screenWidth * 0.05 }}></View>
                            <View style={styles.titlePosition}>
                                <Text
                                    style={styles.title}
                                    numberOfLines={1}
                                    ellipsizeMode={"tail"}
                                >
                                    {bottomTitle}
                                </Text>
                            </View>
                            <Text style={styles.createrName}>
                                {createrName}
                            </Text>
                        </Flex>
                        <Flex>
                            {/*课程名courseName  截止时间timeStop  资源发布时间time*/}
                            <Text
                                numberOfLines={1}
                                ellipsizeMode={"tail"}
                                style={styles.courseName_timeStop}
                            >
                                {courseName_timeStop}
                            </Text>
                            <Text style={styles.time}>{time}</Text>
                        </Flex>
                        {this.contentShow(content)}
                    </TouchableOpacity>
                </View>
            );
        } else {
            return (
                <View style={styles.container}>
                    <Loading show={true} />
                </View>
            );
        }
    };

    //当content内容为空时，返回null，页面将不为content分配页面空间
    contentShow = (content) => {
        //return content == " " ;
        return content == "" ? null : (
            <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={styles.content}
            >
                {content}
            </Text>
        );
    };

    renderData() {
        return (
            <View>
                <FlatList
                    //定义数据显示效果
                    data={this.state.todos}
                    renderItem={this._renderItemView.bind(this)}
                    //分割线
                    ItemSeparatorComponent={this._separator}
                    //下拉刷新相关
                    onRefresh={() => this._onRefresh()}
                    refreshing={this.state.isRefresh}
                    //上拉加载相关
                    ListFooterComponent={this._renderFooter.bind(this)}
                    onEndReached={this._onEndReached.bind(this)}
                    onEndReachedThreshold={0.5}
                />
            </View>
        );
    }

    render() {
        console.log("render", Date.parse(new Date()));
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            return this.renderErrorView();
        }
        //加载数据
        return this.renderData();
    }

    //下拉刷新
    _onRefresh = () => {
        console.log("下拉刷新！！！");
        pageNo = 1;
        itemNo = 0;
        this.setState({
            isRefresh: true, //下拉控制
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            //isRefreshing: false, //下拉控制
        });
        this.fetchData(pageNo , oldtype , searchStr , true);
    };

    //分割线
    _separator() {
        return <View style={{ height: 1, backgroundColor: "#999999" }} />;
    }

    //底部信息提示
    _renderFooter() {
        if (this.state.showFoot == 1) {
            return (
                <View>
                    {/**最后一项数据也加上分割线 */}
                    <View style={{ height: 1.2, backgroundColor: "#999999" }} />
                    <View
                        style={{
                            height: 30,
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                color: "#999999",
                                fontSize: 14,
                                marginTop: 5,
                                marginBottom: 5,
                            }}
                        >
                            没有更多数据了
                        </Text>
                    </View>
                </View>
            );
        } else if (this.state.showFoot == 2) {
            return (
                <View style={styles.footer}>
                    <ActivityIndicator color="#59B9E0" />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot == 0) {
            return (
                <View style={styles.footer}>
                    <View style={{ height: 1, backgroundColor: "#999999" }} />
                    <Text></Text>
                </View>
            );
        }
    }

    //上拉加载
    _onEndReached() {
        //如果是正在加载中或没有更多数据了，则返回
        if (this.state.showFoot != 0) {
            return;
        }
        //如果当前页大于或等于总页数，那就是到最后一页了，返回
        if (pageNo != 1 && dataFlag == false) {
            return;
        } else {
            pageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({ showFoot: 2 });
        //获取数据
        this.fetchData(pageNo , oldtype , searchStr);
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    imgType: {
        height: "100%",
        width: "5%",
        resizeMode: "contain",
    },
    imgStatus: {
        height: "80%",
        width: "5%",
        // height: 40,
        // width: 40,
        resizeMode: "contain",
    },
    title: {
        color: "black",
        fontSize: 17,
        fontWeight: "900",
    },
    titlePosition: {
        width: screenWidth * 0.4,
    },
    createrName: {
        color: "black",
        fontSize: 17,
        fontWeight: "bold",
        paddingLeft: screenWidth * 0.8,
        position: "absolute",
    },
    courseName_timeStop: {
        fontSize: 15,
        width: screenWidth * 0.8,
    },
    time: {
        fontSize: 15,
        width: screenWidth * 0.2,
    },
    content: {
        fontSize: 15,
        width: screenWidth,
    },
    footer: {
        flexDirection: "row",
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
});
