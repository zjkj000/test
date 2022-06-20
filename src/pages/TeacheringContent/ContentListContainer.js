import React from "react";
import {ScrollView,StyleSheet,TouchableOpacity,Image, View,Text,Dimensions,ActivityIndicator,FlatList,Alert,ImageBackground,} from "react-native";
import { SearchBar, TabBar } from "@ant-design/react-native";
import { Icon, Flex } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";
import {screenWidth,screenHeight,userId,token,} from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import Loading from "../../utils/loading/Loading"; //Loading组件使用export {Loading}或者export default Loading;
import "../../utils/global/constants";
import {WaitLoading,Waiting} from '../../utils/WaitLoading/WaitLoading' 
let pageNo = 1; //当前第几页
let itemNo = 0; //item的个数
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了

var oldtype = ""; //保存上一次查询的资源类型，若此次请求的类型与上次不同再重新发送请求
let oldsearchStr = ""; //保存上一次搜索框内容
let todosList = []; //复制一份api请求得到的数据
export default function ContentListContainer(props) {
    const navigation =useNavigation()
    const rsType = props.resourceType;
    const searchStr1 = props.searchStr;
    return <ContentList navigation={navigation} resourceType={rsType} searchStr={searchStr1} />;
}

class ContentList extends React.Component {
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
        //console.log("componentWillMount**************" , 'oldtype' , oldtype , 'rescouceType' , this.props.resourceType , this.props.searchStr);
        this.fetchData(pageNo , oldtype , oldsearchStr , true);
    }

    componentDidMount() {
    }
    
    UNSAFE_componentWillUpdate(nextProps) {
        //console.log("componentWillUpdate*********", Date.parse(new Date()) , 'type:' , oldtype, 'nextProps.type:' , nextProps.resourceType);
        //console.log("componentWillUpdate*********", Date.parse(new Date()) , 'searchStr:' , oldsearchStr , 'nextProps.searchStr:' , nextProps.searchStr);

        
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
            pageNo = 1; //当前第几页
            itemNo = 0; //item的个数
            dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了
            this.fetchData(pageNo , oldtype , oldsearchStr , true);
        }
    }

    componentDidUpdate() {
        // console.log("componentDidUpdate*********", Date.parse(new Date()));
    }

    componentWillUnmount() {
        oldsearchStr='';
        oldtype = '';
    }


    //通过fetch请求数据
    fetchData(pageNo , type , search , onRefresh = false) {
        console.log("fetchData*********", Date.parse(new Date()));
        const token = global.constants.token;
        const userId = global.constants.userName;
        // const ip = global.constants.baseUrl;
        // const url = ip + "studentApp_getStudentPlan.do";
        // const token = 'ZBPXffGR9o+CZwXhPLMS/5C6LwePziASE+TYVIv9MPI6BsEOZoIziHIuzoz+tFmNm8wUHFo9QvZvfmy+6OWcDQVfO8g7nfju';
        // const userId = 'gege';
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getLearnPlanOrPaperList.do";
        const params = {
            currentPage: pageNo,
            userId: userId,
            type: type,
            searchStr: search,
            // callback:'ha',
            token: token,
        }; 
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                let todosList1 =  resJson.data; 
                let dataBlob = [];
                let i = itemNo;
                todosList1.map(function (item) {
                    dataBlob.push({
                        key: i,
                        value: item,
                    });
                    i++;
                });
                itemNo = i;
                
                let foot = 0;
                if (todosList1.length < 12) {
                    foot = 1; //未请求到数据，数据加载完了
                    dataFlag = false; //数据加载完了
                }
                
                this.setState({
                    message: resJson.message,
                    todos: onRefresh
                        ? dataBlob
                        : this.state.todos.concat(dataBlob),
                    isLoading: false,
                    isRefresh: false,
                    showFoot: foot, 
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
            const todoImg = (todo.iconUrl).substring(9);
            return (
                /**水平滑动horizontal={true} 不显示滑动条showsHorizontalScrollIndicator={false} */
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                        <View style={{flexDirection: 'row' , backgroundColor: '#fff' , padding: 10}}>
                            <View style={{flexDirection: 'row',width: screenWidth*0.2,height:'100%'}}>
                                {this.showTaskImg(todoImg)}
                            </View>
                            <View style={{flexDirection: 'column',width: screenWidth*0.8,height:'100%'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={"tail"}
                                        style={{
                                            color: "black",
                                            fontSize: 20,
                                            fontWeight: "900",
                                            width: screenWidth*0.6
                                        }}
                                    >
                                        {todo.name}
                                    </Text>
                                    <Text 
                                        style={{
                                            paddingLeft: screenWidth * 0.6,
                                            position: "absolute",
                                            color: "#DCDCDC",
                                        }}
                                    >
                                        {todo.createTime}
                                    </Text>
                                </View>
                                <View><Text style={{height:10}}></Text></View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={"tail"}
                                        style={{width: screenWidth * 0.48 , fontWeight: "400"}}
                                    >
                                        {todo.knowledge}
                                    </Text>
                                    {this.showTaskProgress(todoImg , todo.propertyCount , todo.resCount)}
                                </View>  
                            </View>
                        </View>
                        <View style={{backgroundColor:'#fff'}}><Text style={{width:20}}></Text></View>
                        {/* {console.log('!!!!!!!!!!!!!!!!!!',todo.knowledgeCode,todo.knowledge)} */}
                        {this.showTodo(todoImg,todo.id,todo.name,todo.paperType,todo)}
                </ScrollView>

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
    showTaskImg(todoImg){
        if(todoImg == 'paper.png'){//试卷
            return <Image 
                        source = {require('../../assets/teacherLatestPage/paper.png')}
                        style = {styles.typeImg}
                   />
        }else if(todoImg == 'learnPlan.png'){//导学案
            return <Image 
                        source = {require('../../assets/teacherLatestPage/learnPlan.png')}
                        style = {styles.typeImg}
                   />
        }else if(todoImg == 'learnPack.png'){//授课包
            return <Image 
                        source = {require('../../assets/teacherLatestPage/learnPack.png')}
                        style = {styles.typeImg}
                   />
        }else if(todoImg == 'weike.png'){//公告
            return <Image 
                        source = {require('../../assets/teacherLatestPage/weike.png')}
                        style = {styles.typeImg}
                   />
        }
    }

    //显示任务进度
    showTaskProgress(todoImg , propertyCount , resCount){
        if(todoImg != 'paper.png'){
            return(
                <View  
                    style={{
                        flexDirection: 'row' , 
                        paddingLeft: screenWidth * 0.50,
                        position: "absolute",
                    }}
                >
                    <Image
                        source={require("../../assets/teacherLatestPage/progress.png")}
                        // style={{width: '85%', height: '85%' , resizeMode: "contain"}}
                        style={{width: 20, height: 20 }}
                    />
                    <Text>{propertyCount}</Text>
                    <Text style={{width: 20}}></Text>
                    <Image
                        source={require("../../assets/teacherLatestPage/resourceSum.png")}
                        // style={{width: '85%', height: '85%' , resizeMode: "contain"}}
                        style={{width: 20, height: 20 }}
                    />
                    <Text>{resCount}</Text>
                </View>
            );
        }else{
            return null;
        }
    }

    //显示作业、导学案等可选操作
    showTodo(todoImg,id,name,paperType,todo){
        if(todoImg == 'paper.png'){
            return(
                <View 
                    style={{
                        height: '100%',
                        flexDirection: 'row',
                        backgroundColor: '#49C6F2',
                    }}
                >
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {
                            if(todo.paperType == '6'){ //拍照布置作业布置
                                this.props.navigation.navigate({
                                    name:'AssignPicturePaperWork',
                                    params:{
                                        paperName:name,
                                        paperId:id
                                    }
                                })
                            }else{
                                console.log('============!!!!!!!!!!!!=============',todo)
                                this.props.navigation.navigate({
                                    name:'AssignPaper',
                                    params:{
                                        paperId: todo.id,
                                        paperName: todo.name,
                                    }
                                })
                                // Alert.alert('选题布置作业布置还未开发');
                            }
                        }}>
                            布置
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent}  
                            onPress={() => {
                                if(todo.paperType == '6'){
                                    Alert.alert('拍照布置作业编辑');
                                }else{
                                    console.log(todo); //选题布置作业编辑
                                    this.props.navigation.navigate({
                                        name:'创建作业',
                                        params:{
                                            type: 'update',
                                            name: name,
                                            introduction: todo.description,
                                            paperId: id,
                                            studyRankId: todo.channelCode,
                                            studyRank: todo.channel,
                                            studyClassId: todo.subjectId,
                                            studyClass: todo.subject,
                                            editionId: todo.textBookId,
                                            edition: todo.textBook,
                                            bookId: todo.gradeBookCode,
                                            book: todo.gradeBook,
                                            knowledgeCode: todo.knowledgeCode,
                                            knowledge: todo.knowledge
                                        }
                                    })
                                }
                            }}
                        >
                            编辑
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {
                            this.deletepaper(id)
                            WaitLoading.show('删除中',-1)
                    }}>
                            删除
                        </Text>
                    </View>
                </View>
            );
        }else if(todoImg == 'learnPlan.png' || todoImg == 'weike.png'){
            return(
                <View 
                    style={{
                        height: '100%',
                        flexDirection: 'row',
                        backgroundColor: '#49C6F2',
                    }}
                >
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {
                            // Alert.alert('该功能还未写！！！')
                            this.props.navigation.navigate({
                                name:'AssignLearnPlan',
                                params:{
                                    learnPlanId: todo.id,
                                    learnPlanName: todo.name,
                                    pushType: todoImg == 'learnPlan.png' ? 'learnPlan' : 'weike'
                                }
                            })
                        }}>
                            布置
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent}  onPress={() => {
                            // Alert.alert('该功能还未写！！！')
                            {console.log(todo)}
                            {console.log('gradeBook' , todo.gradeBook)}
                            {console.log('gradeBookCode' , todo.gradeBookCode)}
                            var createTypeTemp = '';
                            if(todoImg  == 'learnPlan.png'){
                                createTypeTemp = 'learnCase';
                            }else{
                                createTypeTemp = 'weiKe';
                            }
                            this.props.navigation.navigate({
                                name:'创建导学案',
                                params:{
                                    createType: createTypeTemp,
                                    actionType: 'update',
                                    name: name,
                                    introduction: todo.description,
                                    learnPlanId: id,
                                    studyRankId: todo.channelCode,
                                    studyRank: todo.channel,
                                    studyClassId: todo.subjectId,
                                    studyClass: todo.subject,
                                    editionId: todo.textBookId,
                                    edition: todo.textBook,
                                    bookId: todo.gradeBook,
                                    book: todo.gradeBookCode,
                                    knowledgeCode: todo.knowledgeCode,
                                    knowledge: todo.knowledge
                                }
                            })
                        }}>
                            编辑
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {this.deletepaper(id)}}>
                            删除
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {Alert.alert('该功能还未写！！！')}}>
                            属性
                        </Text>
                    </View>
                </View>
            );
        }else if(todoImg == 'learnPack.png'){
            return(
                <View 
                    style={{
                        height: '100%',
                        flexDirection: 'row',
                        backgroundColor: '#49C6F2',
                    }}
                >
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {
                            this.props.navigation.navigate({
                                name:'创建导学案',
                                params:{
                                    createType: 'TeachingPackages',
                                    actionType: 'update',
                                    name: name,
                                    introduction: todo.description,
                                    learnPlanId: id,
                                    studyRankId: todo.channelCode,
                                    studyRank: todo.channel,
                                    studyClassId: todo.subjectId,
                                    studyClass: todo.subject,
                                    editionId: todo.textBookId,
                                    edition: todo.textBook,
                                    bookId: todo.gradeBook,
                                    book: todo.gradeBookCode,
                                    knowledgeCode: todo.knowledgeCode,
                                    knowledge: todo.knowledge
                                }
                            })
                        }}>
                            编辑
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent}  onPress={() => {Alert.alert('该功能还未写！！！')}}>
                            删除
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {Alert.alert('该功能还未写！！！')}}>
                            属性
                        </Text>
                    </View>
                </View>
            );
        }
    }

    renderData() {
        return (
            <View>
                <View style={{ height: 1, backgroundColor: "#999999" }} />
                <Waiting/>
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

    deletepaper(paperId){
        const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_deletePaper.do";
      const params = {
            token:global.constants.token,
            paperId:paperId 
          };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                WaitLoading.show_success('删除成功！',1000)
                this.setState({todos:[]})
                this.fetchData(pageNo , oldtype , oldsearchStr , true);
            }
            
        })
    }

    render() {
        // console.log("render", Date.parse(new Date()));
        //第一次加载等待的view
        if (this.state.isLoading && !this.state.error) {
            console.log('正在加载！！！！！！！');
            return this.renderLoadingView();
        } else if (this.state.error) {
            //请求失败view
            console.log('请求失败！！！！！！！')
            return this.renderErrorView();
        }
        //加载数据
        console.log('渲染数据！！！！！！！')
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
        if (pageNo != 1 && dataFlag == false) {
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
        width: 60
    },
    select: {
        width: screenWidth*0.15,
        height: '100%',
        alignContent: 'center',
        alignItems: 'center',
    },
    selectContent: {
        color: '#fff',
        fontSize: 17,
        paddingTop: 25,
    },
});
