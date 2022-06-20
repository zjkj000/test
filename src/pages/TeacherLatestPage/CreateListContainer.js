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
    Alert,
    ImageBackground,
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

let pageNo = 0; //当前第几页
let itemNo = 0; //item的个数
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了

var oldtype = ""; //保存上一次查询的资源类型，若此次请求的类型与上次不同再重新发送请求
let oldsearchStr = ""; //保存上一次搜索框内容

let todosList = []; //复制一份api请求得到的数据


export default function CreateListContainer(props) {
    const navigation = useNavigation();

    const rsType = props.resourceType;
    // console.log("**rsType", rsType);
    const searchStr1 = props.searchStr;
    // console.log("**searchStr1", searchStr1);

    //将navigation传给TodoList组件，防止路由出错
    return (
        <CreateList
            navigation={navigation}
            resourceType={rsType}
            searchStr={searchStr1}
        ></CreateList>
    );
}

class CreateList extends React.Component {
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
        };
        this.fetchData = this.fetchData.bind(this); //fetchData函数中this指向问题
    }

    UNSAFE_componentWillMount() {
        //初始挂载执行一遍
        oldtype = this.props.resourceType;
        oldsearchStr = this.props.searchStr;


        // console.log("componentWillMount**************" , 'oldtype' , oldtype , 'rescouceType' , this.props.resourceType , this.props.searchStr);
        this.fetchData(pageNo , oldtype , oldsearchStr , true);
    }

    componentDidMount() {
        //初始挂载执行一遍
        //this.fetchData(pageNo);
    }
    

    UNSAFE_componentWillUpdate(nextProps) {
        // console.log("componentWillUpdate*********", Date.parse(new Date()) , 'type:' , oldtype, 'nextProps.type:' , nextProps.resourceType);
        // console.log("componentWillUpdate*********", Date.parse(new Date()) , 'searchStr:' , oldsearchStr , 'nextProps.searchStr:' , nextProps.searchStr);

        
        if (
            oldtype != nextProps.resourceType ||
            oldsearchStr != nextProps.searchStr 
        ) {
            oldtype = nextProps.resourceType;
            oldsearchStr = nextProps.searchStr;
            // console.log("componentWillUpdate*********0000", Date.parse(new Date()));
            //当此次请求与上次请求的数据类型不一致时，先清空上一次的数据再请求
            this.setState({
                todos: [],
                isLoading: true,
                error: false,
                isRefresh: true,
                showFoot: 0,
            });
            pageNo = 0; //当前第几页
            itemNo = 0; //item的个数
            dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
            this.fetchData(pageNo , oldtype , oldsearchStr , true);
        }
    }

    componentDidUpdate() {
        // console.log("componentDidUpdate*********", Date.parse(new Date()));
    }

    componentWillUnmount() {
        oldsearchStr = '';
        oldtype = '';
    }


    //通过fetch请求数据
    fetchData(pageNo , type , search , onRefresh = false) {
        // console.log("fetchData*********", Date.parse(new Date()));
        
        const token = global.constants.token;
        const userId = global.constants.userName;
        // const ip = global.constants.baseUrl;
        // const url = ip + "studentApp_getStudentPlan.do";
        // const token = 'ZBPXffGR9o+CZwXhPLMS/5C6LwePziASE+TYVIv9MPI6BsEOZoIziHIuzoz+tFmNm8wUHFo9QvZvfmy+6OWcDQVfO8g7nfju';
        // const userId = 'gege';
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getAllNews.do";
        const params = {
            currentPage: pageNo,
            userID: userId,
            resourceType: type,
            type: 'new',
            searchStr: search,
            //callback:'ha',
            token: token,
        }; 
        // console.log('*******请求的url' , url);
        // console.group('*********参数' , params);     

        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                // console.log('--------resJson-----' , resJson);
                let todosList1 =  resJson.data.list; //重要！！！
                // console.log('********请求数据返回的message', resJson.message);
                // console.log('********请求数据返回的success', resJson.success);
                // console.log('******请求的数据******', todosList1[0]);

                let dataBlob = [];
                let i = itemNo;

                //console.log("fetchData*********success", Date.parse(new Date()));
                
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
                
                todosList1 = null;
                dataBlob = null;
            })
            .catch((error) => {
                console.log('******catch***error**' , error);
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

        //复制一份请求的数据
        todosList = this.state.todos;

        //当前渲染的数据项的内容
        let todo = todoItem.item.value;
        //console.log('todo', todo);
        //当前渲染数据项的index索引
        let todoIndex = todoItem.item.key;
        //console.log('index',todoIndex);
        //Object.keys(todoItem).length != 0
        if (todo != null) {
            //console.log('tododo' , todo);      
            return (
                <TouchableOpacity
                    onPress = {() => {
                        //把未读消息清掉   跳转作业批改页面
                        // todosList[todoIndex].value.fNumber = 0;
                        // this.setState({ todos: todosList });
                        

                        if(todo.fNumber > 0){  //还有待批改的作业
                            todosList[todoIndex].value.fNumber = 0;
                            this.setState({ todos: todosList });
                        }
                        if(todo.fType == 3){ //通知
                            Alert.alert('这是通知');

                        }else if(todo.fType == 4){ //公告
                            Alert.alert('这是公告');
                        }else{
                            this.props.navigation.navigate({
                                name: 'CorrectPaperList',
                                params:{ 
                                    taskId:todo.fId, 
                                    type:todo.fType==1?'learnPlan':'paper'
                                },
                            })
                        }
                    }}
                >
                    <View style={{flexDirection: 'row' , backgroundColor: '#fff' , padding: 10}}>
                        <View style={{flexDirection: 'row',width: '20%',height:'100%'}}>
                            {this.showTaskImg(todo.fType)}
                            {this.showTaskReadNum(todo.fNumber)}
                        </View>
                        <View style={{flexDirection: 'column',width: '80%',height:'100%'}}>
                            <Text
                                numberOfLines={1}
                                ellipsizeMode={"tail"}
                                style={{
                                    color: "black",
                                    fontSize: 20,
                                    fontWeight: "900",
                                }}
                            >
                                {todo.fName}
                            </Text>
                            <View><Text style={{height:10}}></Text></View>
                            <View style={{flexDirection: 'row'}}>
                                <Text
                                    numberOfLines={1}
                                    ellipsizeMode={"tail"}
                                    style={{width: screenWidth * 0.55 , fontWeight: "400"}}
                                >
                                    {todo.fDescription}
                                </Text>
                                <Text 
                                    style={{
                                        paddingLeft: screenWidth * 0.6,
                                        position: "absolute",
                                        color: "#DCDCDC",
                                    }}
                                >
                                    {todo.fTime}
                                </Text>
                            </View>
                            <View style={{flexDirection: 'row'}}>
                                <Text style={{fontWeight: "400"}}>{todo.fNum1}</Text>
                                <Text style={{width: 5}}></Text>
                                <Text style={{fontWeight: "400"}}>{todo.fNum2}</Text>
                                <Text style={{width: 5}}></Text>
                                <Text style={{fontWeight: "400"}}>{todo.fNum3}</Text>
                                
                                {this.showTaskProgress(todo.fType , todo.fNum4 , todo.fNum5)}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>

            );
        } else {
            return (
                <View style={styles.container}>
                    <Loading show={true} />
                </View>
            );
        }
    };

    //显示任务图标
    showTaskImg(fType){
        if(fType == 1){//导学案
            return <View style={{alignItems: 'center',paddingTop: 10}}><Image 
                        source = {require('../../assets/teacherLatestPage/learnPlan.png')}
                        style = {styles.typeImg}
                   /></View>
        } else if(fType == 2){//作业
            return <View style={{alignItems: 'center',paddingTop: 10}}><Image 
                        source = {require('../../assets/teacherLatestPage/homework.png')}
                        style = {styles.typeImg}
                   /></View>
        }else if(fType == 3){//通知
            return <View style={{alignItems: 'center',paddingTop: 10}}><Image 
                        source = {require('../../assets/teacherLatestPage/notice.png')}
                        style = {styles.typeImg}
                   /></View>
        }else if(fType == 4){//公告
            return <View style={{alignItems: 'center',paddingTop: 10}}><Image 
                        source = {require('../../assets/teacherLatestPage/article.png')}
                        style = {styles.typeImg}
                   /></View>
        }else if(fType == 7){//微课
            return <View style={{alignItems: 'center',paddingTop: 10}}><Image 
                        source = {require('../../assets/teacherLatestPage/weike.png')}
                        style = {styles.typeImg}
                   /></View>
        }  
    }

    //显示任务是否还有未读以及未读数
    showTaskReadNum(fNumber){
        if(fNumber >= 10){
            return <ImageBackground
                        source = {require('../../assets/teacherLatestPage/rightNum.png')} 
                        style={{
                            height: '42%',   
                            width: '42%',
                            resizeMode: "contain",          
                        }}
                    >
                        <Text style={{color: 'white', fontSize: 9 , fontWeight: '600', paddingLeft: 2}}>{fNumber}</Text>
                    </ImageBackground>
                // return <Text style={{color: 'red', fontSize: 15}}>{fNumber}</Text>
        }else if(fNumber > 0){
            return <ImageBackground
                source = {require('../../assets/teacherLatestPage/rightNum.png')} 
                style={{
                    height: '42%',   
                    width: '42%',
                    resizeMode: "contain",       
                }}
            >
                <Text style={{color: 'white', fontSize: 10 , paddingLeft: 4}}>{fNumber}</Text>
            </ImageBackground>
        }else{
            return null;
        }
    }

    //显示任务进度
    showTaskProgress(fType , fNum4 , fNum5){
        if(fType == 1 || fType == 7){
            return(
                <View  
                    style={{
                        flexDirection: 'row' , 
                        paddingLeft: screenWidth * 0.48,
                        position: "absolute",
                    }}
                >
                    <Text style={{width: 20}}></Text>
                    <Image
                        source={require("../../assets/teacherLatestPage/progress.png")}
                        // style={{width: '85%', height: '85%' , resizeMode: "contain"}}
                        style={{width: 20, height: 20 }}
                    />
                    <Text>{fNum4}</Text>
                    <Text style={{width: 20}}></Text>
                    <Image
                        source={require("../../assets/teacherLatestPage/resourceSum.png")}
                        // style={{width: '85%', height: '85%' , resizeMode: "contain"}}
                        style={{width: 20, height: 20 }}
                    />
                    <Text>{fNum5}</Text>
                </View>
            );
        }else{
            return null;
        }
    }


    renderData() {
        return (
            <View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />
                <FlatList
                    showsVerticalScrollIndicator={false}
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
        // console.log("render", Date.parse(new Date()));
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            // console.log('正在加载！！！！！！！');
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            console.log('请求失败！！！！！！！')
            return this.renderErrorView();
        }
        //加载数据
        // console.log('渲染数据！！！！！！！')
        return this.renderData();
    }

    //下拉刷新
    _onRefresh = () => {
        console.log("下拉刷新！！！");
        pageNo = 0;
        itemNo = 0;
        this.setState({
            isRefresh: true, //下拉控制
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            //isRefreshing: false, //下拉控制
        });
        this.fetchData(pageNo , oldtype , oldsearchStr , true);
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
        if (pageNo != 0 && dataFlag == false) {
            return;
        } else {
            pageNo++;
        }
        //底部显示正在加载更多数据
        this.setState({ showFoot: 2 });
        //获取数据
        this.fetchData(pageNo , oldtype , oldsearchStr);
    }
}

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    typeImg: {
        // height: "100%",
        // width: "80%",
        // resizeMode: "stretch",
        height: 60,
        width: 60,
        alignContent: 'center'
    }
});
