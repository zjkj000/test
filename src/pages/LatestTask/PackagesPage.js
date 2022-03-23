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
} from "react-native";
import { SearchBar, TabBar } from "@ant-design/react-native";
import { Icon, Flex } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";
import { screenWidth, screenHeight , userId , token} from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import Loading from "../../utils/loading/Loading"; //Loading组件使用export {Loading}或者export default Loading;
//import {Loading} from "../../utils/loading/Loading"; //Loading组件使用export {Loading},此时import必须加{}导入
//import global from "../../utils/global/constants";

let pageNo = 1; //当前第几页
let itemNo = 0; //item的个数
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了

var oldtype = '';  //保存上一次查询的资源类型，若此次请求的类型与上次不同再重新发送请求


export default function PackagesPageContainer(props) {
    //console.log(props.resourceType);
    //const rsType = props.resourceType;
    const navigation = useNavigation();
    //将navigation传给TodoList组件，防止路由出错
    return <PackagesPage navigation={navigation} ></PackagesPage>;
}


class PackagesPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //type为2是作业，为1是导学案，3通知，4公告
            message: '',
            todos: [],
            isLoading: true,
            isRefresh: false,
            //网络请求状态
            error: false,
            errorInfo: "",
            showFoot: 0, //控制foot， 0：隐藏footer 1：已加载完成，没有更多数据 2：正在加载中
            //isRefreshing: false, //下拉控制
        };
        this.fetchData = this.fetchData.bind(this); //fetchData函数中this指向问题
    }

    
    UNSAFE_componentWillMount(){  //初始挂载执行一遍
        //oldtype = this.props.resourceType;
        //this.fetchData(pageNo);
    }

    componentDidMount(){   //初始挂载执行一遍
        this.fetchData(pageNo);
    }

    
    UNSAFE_componentWillUpdate(){
        //fetchData执行会触发setState函数，又会重新执行componentWillUpdate函数，
        //需要将oldtype设置为此次请求的数据类型，否则oldtype != this.props.resourceType一直满足，将会一直发送请求
        //oldtype = this.props.resourceType;   
    }

    componentDidUpdate(){
        //if(oldtype != this.props.resourceType){
            //当此次请求与上次请求的数据类型不一致时，先清空上一次的数据再请求，这样render时会出现Loading效果
            //this.setState({ todos: [] });
            //this.fetchData(pageNo);
        //}
    }


    //通过fetch请求数据
    fetchData(pageNo , onRefresh = false){      
       const token = global.constants.token;
       const userId = global.constants.userName;
       const ip = global.constants.baseUrl;  
       const url = ip + "studentApp_getMineFloder.do";
       const params = {
            currentPage: pageNo,
            userId: userId, 
        }
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            var todosList = resJson.data; //重要！！！！！！

            let dataBlob = [];
            let i = itemNo;

            todosList.map(function (item) {
                dataBlob.push({
                    key: i,
                    value: item,
                });
                i++;
            });
            itemNo = i;
            console.log('itemNo' , itemNo);
            let foot = 0;
            if(todosList.length < 12){
                foot = 1; //未请求到数据，数据加载完了
                dataFlag = false; //数据加载完了
            }

            this.setState({
                message:resJson.message, 

                //下拉刷新时todos只保存第一页数据dataBlob
                todos: onRefresh ? dataBlob
                                : this.state.todos.concat(dataBlob),
                isLoading: false,
                isRefresh: false,
                showFoot: foot,
                //isRefreshing: false,
            });
            todosList = null;
            dataBlob = null;
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
        return(
            <View style={styles.container}>
                <Loading show={true}/> 
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
                <Text>{ errorInfo }</Text>
            </View>
        );
    }

    //返回itemView(单个todo)
    _renderItemView = ( todoItem ) => {
        const navigation = this.props.navigation;

        //console.log('tododo' , todoItem);  //index、item（key、value）、separators
        //console.log('tododo' , todoItem.item);
        //console.log('todolength' , Object.keys(todoItem).length);

        if(Object.keys(todoItem).length != 0){
            let todo = todoItem.item.value;
            //console.log('tododo' , todo);
            //资料ID
            const id = todo.id;
            //资料类型图标
            const img = todo.imgUrl;
            const imgUrl =  img.substring(9) ;
            //资料标题
            const title = todo.title;
            //类型
            const type = todo.type;
            //时间
            const time = todo.dateStr;
            //课程名+教师名
            const names = todo.teacherName; 
            //图标
            const todoImg =
                imgUrl == "mp3.png"
                    ? require("../../assets/LatestTaskImages/mp3.png")
                    : imgUrl == "mp4.png"
                    ? require("../../assets/LatestTaskImages/mp4.png")
                    : imgUrl == "pdf.png"
                    ? require("../../assets/LatestTaskImages/pdf.png")
                    : imgUrl == "ppt.png"
                    ? require("../../assets/LatestTaskImages/ppt.png")
                    : require("../../assets/LatestTaskImages/word.png"); 

            return(
                <View>
                    <TouchableOpacity
                        onPress={() => {
                            if(imgUrl == "mp3.png"){
                                navigation.navigate("音频", 
                                {
                                    id: id,
                                    type: type,
                                    deviceType: 'PHONE',
                                });
                            }else if(imgUrl == "mp4.png"){
                                navigation.navigate("视频", 
                                {
                                    id: id,
                                    type: type,
                                    deviceType: 'PHONE',
                                });
                            }else if(imgUrl == "doc.png" || imgUrl == "pdf.png"){
                                navigation.navigate("文档" , 
                                {
                                    id: id,
                                    type: type,
                                    deviceType: 'PHONE',
                                });
                                //Alert.alert('文档类型的组件还未实现');
                            }else if(imgUrl == "ppt.png"){    
                                navigation.navigate("PPT" , 
                                {
                                    id: id,
                                    type: type,
                                    deviceType: 'PHONE',
                                });
                            }                                       
                        }}
                        style={{
                            //borderWidth: 0.5,
                            paddingTop: 10,
                            paddingLeft: 10,
                            paddingRight: 10,
                            paddingBottom: 10,
                            borderBottomWidth:0.1, //下边框
                            backgroundColor: '#fff',
                        }}
                    >
                        <View style={styles.ViewCard}>
                            <View style={styles.ViewLeft}>
                                <Image source={todoImg} style={styles.img}></Image>
                            </View>
                            <View style={styles.ViewRight}>
                                <View style={styles.titleView}>
                                    <Text style={styles.title}
                                          numberOfLines={1}
                                          ellipsizeMode={"tail"}
                                    >
                                        {title}
                                    </Text>
                                </View>            
                                <View style={{ flexDirection: 'row', }}>
                                    <Text style={{height: 10}}></Text>
                                </View>
                                <View style={styles.textView}>
                                        <Text style={styles.names}
                                              numberOfLines={1}
                                              ellipsizeMode={"tail"}
                                        >
                                            {names}
                                        </Text>
                                        <Text style={styles.time}>{time}</Text>
                                </View>
                            </View>
                        </View>             
                    </TouchableOpacity>
                </View>
            );
        }
        else{
            return(
                <View style={styles.container}>                     
                    <Loading show={true}/>         
                </View>
            );
        }
    };


    renderData(){
        return(
            <View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />
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
        console.log('下拉刷新！！！');
        pageNo = 1;
        itemNo = 0;
        this.setState({
            isRefresh: true,
            showFoot: 0, // 控制foot， 0：隐藏footer  1：已加载完成,没有更多数据   2 ：显示加载中
            //isRefreshing: false, //下拉控制
        });
        this.fetchData(pageNo , (onRefresh = true));
    }

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
                    <View style={{ height: 1.2 , backgroundColor: "#999999" }} />
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
                    <ActivityIndicator color='#59B9E0' />
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } else if (this.state.showFoot == 0) {
            return (
                <View style={styles.footer}>
                    <View style={{ height: 1 , backgroundColor: "#999999" }} />
                    <Text></Text>
                </View>
            );
        }
    }

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
        this.fetchData(pageNo);
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
    footer: {
        flexDirection: "row",
        height: 24,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 10,
    },
    img: {
        height: "90%",
        width: "90%",
        resizeMode: "contain",
    },
    ViewCard: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        //height: screenHeight*0.1,
    },
    ViewLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        height: '100%',
        width: '20%',
        padding: 0,
    },
    ViewRight: {
        //alignItems: 'flex-start',
        flexDirection: 'column',
        height: '100%',
        width: '80%',
        padding: 10,
    },
    titleView: {
        flexDirection: 'row',
        //height:screenHeight*0.05,
        // height: '50%',
        // width: '100%',
        
    },
    title: {
        //color: 'black',
        fontSize: 20,
        fontWeight: "900",
        width: screenWidth*0.8,
        paddingEnd: 10,
    },
    textView: {
        flexDirection: 'row',
        // height: '50%',
        // width: '100%',
        //paddingTop: 10,
    },
    names: {
        //color: 'black',
        fontSize: 18,
        fontWeight: "500",
    },
    time: {
        fontSize: 18,
        fontWeight: "500",
        paddingLeft: screenWidth * 0.5,
        position: "absolute",
    },
});
