import React from "react";
import {ScrollView,StyleSheet,Modal,Image, View,Text,TextInput,ActivityIndicator,FlatList,Alert,ImageBackground,} from "react-native";
import { useNavigation } from "@react-navigation/native";
import {screenWidth,screenHeight,userId,token,} from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import Loading from "../../utils/loading/Loading"; //Loading组件使用export {Loading}或者export default Loading;
import "../../utils/global/constants";
import {
    Button,
} from "@ui-kitten/components";
import {WaitLoading,Waiting} from '../../utils/WaitLoading/WaitLoading' 
let pageNo = 1; //当前第几页
let itemNo = 0; //item的个数
let dataFlag = true; //此次是否请求到了数据，若请求的数据为空，则表示全部数据都请求到了

var oldtype = ""; //保存上一次查询的资源类型，若此次请求的类型与上次不同再重新发送请求
let oldsearchStr = ""; //保存上一次搜索框内容
let todosList = []; //复制一份api请求得到的数据

let textInputPaper = ''; //设置属性---试卷简介
let textLearnAim = ''; //设置属性---学习目标
let textLearnPoint = ''; //设置属性---学习重点
let textLearnDiff = ''; //设置属性---学习难点
let textCourseSummary = ''; //设置属性---课堂总结
let textCourseExpansion = ''; //设置属性---课外扩展

let isFetchProperty = false;
export default function ContentListContainer(props) {
    const navigation =useNavigation()
    const rsType = props.resourceType;
    const searchStr1 = props.searchStr;
    return <ContentList 
        navigation={navigation} 
        resourceType={rsType} 
        searchStr={searchStr1} 
        isRefresh={props.isRefresh}
    />;
}

class ContentList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            PropertyModelVisiblity: false, //属性悬浮框
            learnPlanId: '',
            content: '', //属性--内容简介
            aim: '', //属性--目标
            point: '', //属性--重点
            diff: '', //属性--难点
            summary: '', //属性--总结
            extension: '', //属性--扩展
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
        console.log("componentWillUpdate******教学内容****isRefresh****" , nextProps.isRefresh);
        //console.log("componentWillUpdate*********", Date.parse(new Date()) , 'type:' , oldtype, 'nextProps.type:' , nextProps.resourceType);
        //console.log("componentWillUpdate*********", Date.parse(new Date()) , 'searchStr:' , oldsearchStr , 'nextProps.searchStr:' , nextProps.searchStr);

        
        if (
            oldtype != nextProps.resourceType ||
            oldsearchStr != nextProps.searchStr ||
            nextProps.isRefresh
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
        pageNo = 1; //当前第几页
        itemNo = 0; //item的个数
        dataFlag = true;
        oldsearchStr='';
        oldtype = '';
        textInputPaper = '';
        textLearnAim = '';
        textLearnPoint = '';
        textLearnDiff = '';
        textCourseSummary = '';
        textCourseExpansion = '';
        isFetchProperty = false;
    }


    //通过fetch请求数据
    fetchData(pageNo , type , search , onRefresh = false) {
        console.log("fetchData*********", Date.parse(new Date()));
        const token = global.constants.token;
        const userId = global.constants.userName;
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
                        <View style={{flexDirection: 'row' , backgroundColor: '#fff' , padding: 5}}>
                            <View style={{flexDirection: 'row',width: 75,height:'100%'}}>
                                {this.showTaskImg(todoImg)}
                            </View>
                            <View style={{flexDirection: 'column',width: screenWidth-90,height:'100%'}}>
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={"tail"}
                                        style={{
                                            color: "black",
                                            fontSize: 20,
                                            fontWeight: "900",
                                            width: '75%'
                                        }}
                                    >
                                        {todo.name}
                                    </Text>
                                    <Text 
                                        style={{
                                            // paddingLeft: screenWidth * 0.6,
                                            // position: "absolute",
                                            color: "#DCDCDC",
                                            width: '25%'
                                        }}
                                    >
                                        {todo.createTime}
                                    </Text>
                                </View>
                                <View><Text style={{height:12}}></Text></View>
                                <View style={{flexDirection: 'row'}}>
                                    <Text
                                        numberOfLines={1}
                                        ellipsizeMode={"tail"}
                                        style={{width: '72%' , fontWeight: "400"}}
                                    >
                                        {todo.knowledge}
                                    </Text>
                                    {this.showTaskProgress(todoImg , todo.propertyCount , todo.resCount)}
                                </View>  
                            </View>
                        </View>
                        <View style={{backgroundColor:'#fff'}}><Text style={{width:20}}></Text></View>
                        {this.showTodo(todoImg,todo.id,todo.name,todo.paperType,todo,todoItem.item)}
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
                        flexDirection: "row",
                        width: '25%',
                    }}
                >
                    <Image
                        source={require("../../assets/teacherLatestPage/progress.png")}
                        // style={{width: '85%', height: '85%' , resizeMode: "contain"}}
                        style={{width: 15, height: 15 , marginTop: 3}}
                    />
                    <Text>{propertyCount}</Text>
                    <Text style={{width: 10}}></Text>
                    <Image
                        source={require("../../assets/teacherLatestPage/resourceSum.png")}
                        // style={{width: '85%', height: '85%' , resizeMode: "contain"}}
                        style={{width: 15, height: 15 , marginTop: 3}}
                    />
                    <Text>{resCount}</Text>
                </View>
            );
        }else{
            return null;
        }
    }

    setModalVisible = (visible) => {
        console.log('-----------setModalVisible---------------', visible);
        this.setState({ PropertyModelVisiblity: visible , learnPlanId: '' });   
    }

    //获取资源属性
    fetchProperty(){
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getLpProperty.do";
        const params = {
            learnPlanId: this.state.learnPlanId,
            token: global.constants.token,
            //callback:'ha',
        };

        console.log('-----fetchProperty-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                isFetchProperty = true;
                let resJson = JSON.parse(resStr);
                console.log('==============FetchProperty=========================');
                console.log(resJson.data);
                console.log('====================================================');
                if(resJson.data != null){
                    this.setState({ 
                        content: resJson.data.introduction != null ? resJson.data.introduction : '',
                        aim: resJson.data.goal != null ? resJson.data.goal : '',
                        point: resJson.data.emphasis != null ? resJson.data.emphasis : '',
                        diff: resJson.data.difficulty != null ? resJson.data.difficulty : '',
                        summary: resJson.data.summary != null ? resJson.data.summary : '',
                        extension: resJson.data.extension != null ? resJson.data.extension : '',
                    },()=>{
                        textInputPaper = this.state.content;
                        textLearnAim = this.state.aim;
                        textLearnPoint = this.state.point;
                        textLearnDiff = this.state.diff;
                        textCourseSummary = this.state.summary;
                        textCourseExpansion = this.state.extension;
                        console.log('==============Property==============================');
                        console.log(textInputPaper, textLearnAim, textLearnPoint, textLearnDiff, textCourseSummary, textCourseExpansion);
                        console.log('====================================================');
                    });
                }
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }   

    //保存资源属性
    saveProperty(){
        console.log('======================saveProperty==========输入的属性==================');
        console.log(textInputPaper, textLearnAim, textLearnPoint, textLearnDiff, textCourseSummary, textCourseExpansion);
        console.log('====================================================');
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_saveLpProperty.do";
        const params = {
            teacherId: global.constants.userName,
            learnPlanId: this.state.learnPlanId,
            Goal: textLearnAim == "null" ? '' : textLearnAim,
            Emphasis: textLearnPoint == "null" ? '' : textLearnPoint,
            Difficulty: textLearnDiff == "null" ? '' : textLearnDiff,
            Summary: textCourseSummary == "null" ? '' : textCourseSummary,
            Extension: textCourseExpansion == "null" ? '' : textCourseExpansion,
            introduction: textInputPaper == "null" ? '' : textInputPaper,
            token: global.constants.token,
            //callback:'ha',
        };

        console.log('-----saveProperty-----', Date.parse(new Date()))
        http.get(url, params)
            .then((resStr) => {
                isFetchProperty = true;
                let resJson = JSON.parse(resStr);
                if(resJson.success){
                    Alert.alert('','属性保存成功', [{} ,
                        {text: '关闭', onPress: ()=>{
                            this.setState({
                                PropertyModelVisiblity: false , 
                                learnPlanId: '',
                                content: '',
                                aim: '',
                                point: '',
                                diff: '',
                                summary: '',
                                extension: '',
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
                        }}       
                    ]);
                }else{
                    Alert.alert('','属性保存失败', [{} ,
                        {text: '关闭', onPress: ()=>{
                            this.setState({ 
                                PropertyModelVisiblity: false , 
                                learnPlanId: '',
                                content: '',
                                aim: '',
                                point: '',
                                diff: '',
                                summary: '',
                                extension: '', 
                            });
                        }}       
                    ]);
                }
            })
            .catch((error) => {
                console.log('******catch***error**', error);
                this.setState({
                    error: true,
                    errorInfo: error,
                });
            });
    }

    //显示属性悬浮框
    showPropertyModal(){
        console.log('===================showPropertyModal========显示属性悬浮框=================',this.state.learnPlanId,isFetchProperty);
        console.log(textInputPaper, textLearnAim, textLearnPoint, textLearnDiff, textCourseSummary, textCourseExpansion);
        console.log('=============================================================');
        const { PropertyModelVisiblity } = this.state;
        isFetchProperty == false ? this.fetchProperty() : null;
        return(
            <Modal
                animationType="none"
                transparent={true}
                visible={PropertyModelVisiblity}
                onRequestClose={() => {
                    this.setModalVisible(!PropertyModelVisiblity);
                }}
            >
                <View style={{
                    flexDirection: 'column',
                    top: screenHeight*0.15, 
                    width: screenWidth*0.9,
                    alignSelf: 'center',
                    backgroundColor: '#fff',
                    borderWidth: 2,
                    borderRadius: 5,
                    borderColor: 'grey'
                }}>
                    <View>
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5 }}>
                            <Text style={styles.longTitle}>内容简介：</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>{ textInputPaper = text }}
                            >{this.state.content == "null" ? '' : this.state.content}</TextInput>
                        </View>
                        <View style={{ paddingLeft: 0, width: screenWidth*0.9, height: 2, backgroundColor: "#DCDCDC" }} />
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5 }}>
                            <Text style={styles.longTitle}>学习目标：</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>{ textLearnAim = text }}
                            >{this.state.aim == "null" ? '' : this.state.aim}</TextInput>
                        </View>
                        <View style={{ paddingLeft: 0, width: screenWidth*0.9, height: 2, backgroundColor: "#DCDCDC" }} />
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5 }}>
                            <Text style={styles.longTitle}>学习重点：</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>{ textLearnPoint = text }}
                            >{this.state.point == "null" ? '' : this.state.point}</TextInput>
                        </View>
                        <View style={{ paddingLeft: 0, width: screenWidth*0.9, height: 2, backgroundColor: "#DCDCDC" }} />
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5 }}>
                            <Text style={styles.longTitle}>学习难点：</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>{ textLearnDiff = text }}
                            >{this.state.diff == "null" ? '' : this.state.diff}</TextInput>
                        </View>
                        <View style={{ paddingLeft: 0, width: screenWidth*0.9, height: 2, backgroundColor: "#DCDCDC" }} />
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5 }}>
                            <Text style={styles.longTitle}>课堂总结：</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>{ textCourseSummary = text }}
                            >{this.state.summary == "null" ? '' : this.state.summary}</TextInput>
                        </View>
                        <View style={{ paddingLeft: 0, width: screenWidth*0.9, height: 2, backgroundColor: "#DCDCDC" }} />
                        <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5 }}>
                            <Text style={styles.longTitle}>课外扩展：</Text>
                            <TextInput
                                style={styles.textInput}
                                onChangeText={(text)=>{ textCourseExpansion = text }}
                            >{this.state.extension == "null" ? '' : this.state.extension}</TextInput>
                        </View>
                        <View style={{ paddingLeft: 0, width: screenWidth*0.9, height: 2, backgroundColor: "#DCDCDC" }} />
                    </View>
                    
                
                    {/**取消 确定按钮 */}
                    <View
                        style={{
                            paddingTop: 10,
                            alignSelf: 'center',
                            flexDirection: 'row',
                            backgroundColor: '#fff',
                            paddingBottom: 10,
                        }}
                    >
                        <Button style={styles.button}
                            onPress={() => {
                                textInputPaper = '';
                                textLearnAim = '';
                                textLearnPoint = '';
                                textLearnDiff = '';
                                textCourseSummary = '';
                                textCourseExpansion = '';
                                isFetchProperty = false;
                                this.setModalVisible(!PropertyModelVisiblity);
                            }}
                        >
                            取消修改
                        </Button>
                        <Text style={{ width: screenWidth * 0.1 }}></Text>
                        <Button style={styles.button}
                            onPress={() => {
                                this.saveProperty();
                                textInputPaper = '';
                                textLearnAim = '';
                                textLearnPoint = '';
                                textLearnDiff = '';
                                textCourseSummary = '';
                                textCourseExpansion = '';
                                isFetchProperty = false;
                            }}
                        >
                            确定修改
                        </Button>
                    </View>
                </View>
            </Modal>
        );
    }

    //显示作业、导学案等可选操作
    showTodo(todoImg,id,name,paperType,todo,todoItem){
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
                            
                                this.props.navigation.navigate({
                                    name:'AssignPicturePaperWork',
                                    params:{
                                        paperName:name,
                                        paperId:id
                                    }
                                })
                            
                        }}>
                            布置
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent}  
                            onPress={() => {
                                if(todo.paperType == '6'){
                                    this.props.navigation.navigate({
                                        name:'EditPicturePaperWork',
                                        params:{
                                        paperName:name,
                                        paperId:id,
                                        type:'update',
                                        channelName:todo.channel,
                                        channelCode:todo.channelCode,
                                        gradeLevelName:todo.gradeBook,
                                        subjectCode:todo.subjectId,
                                        textBookCode:todo.textBookId,
                                        gradeLevelCode:todo.gradeBookCode,
                                        pointCode:todo.knowledgeCode,
                                        subjectName:todo.subject,
                                        textBookName:todo.textBook,
                                        pointName:todo.knowledge,
                                        }
                                    })
                                }else{
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
                            Alert.alert('','是否确认删除?',
                                [
                                    {text:'取消',onPress:()=>{}},
                                    {},
                                    {text:'确定',onPress:()=>{
                                        this.deletepaper(id,todoItem);
                                        WaitLoading.show('删除中',-1)
                                    }}
                                ])
                            
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
                        <Text style={styles.selectContent} onPress={() => {
                            Alert.alert('','是否确认删除?',
                            [
                                {text:'取消',onPress:()=>{}},
                                {},
                                {text:'确定',onPress:()=>{
                                    this.deleteLearnPlan(id,todoItem);
                                    WaitLoading.show('删除中',-1);
                                }}
                            ])
                        }}>
                            删除
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {
                            // Alert.alert('该功能还未写！！！')
                            isFetchProperty = false;
                            this.setState({ PropertyModelVisiblity: true , learnPlanId: id });
                        }}>
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
                        <Text style={styles.selectContent}  onPress={() => {
                            Alert.alert('','是否确认删除?',
                            [
                                {text:'取消',onPress:()=>{}},
                                {},
                                {text:'确定',onPress:()=>{
                                    this.deleteLearnPlan(id,todoItem);
                                    WaitLoading.show('删除中',-1);
                                }}
                            ])
                        }}>
                            删除
                        </Text>
                    </View>
                    <View style={{ top: 10, width: 1.5, height: '70%', backgroundColor: "#fff"}} />
                    <View style={styles.select}>
                        <Text style={styles.selectContent} onPress={() => {
                            // Alert.alert('该功能还未写！！！')
                            isFetchProperty = false;
                            this.setState({ PropertyModelVisiblity: true  , learnPlanId: id });
                        }}>
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
                    onEndReachedThreshold={0.8}
                />
                {
                    this.state.PropertyModelVisiblity && this.state.learnPlanId != '' ? this.showPropertyModal() : null
                }
            </View>
        );
    }

    //删除试卷
    deletepaper(paperId,todo){
        const url = global.constants.baseUrl+"teacherApp_deletePaper.do";
      const params = {
            token:global.constants.token,
            paperId:paperId 
          };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                WaitLoading.show_success('删除成功！',1000)
                const { todos } = this.state;
                var todosTemp = todos;
                var index = todos.indexOf(todo);

                console.log('==================删除索引======================================',index);
                if(index >= 0){
                    console.log('================删除前数组长度============1================',todosTemp.length);
                    todosTemp.splice(index , 1);
                    this.setState({
                        todos: todosTemp
                    },()=>{
                        console.log('================删除后数组长度===========2=================',this.state.todos.length);
                    })
                }
            }
        })
    }

    //删除导学案、微课、授课包
    deleteLearnPlan(learnPlanId,todo){
        const url = global.constants.baseUrl+"teacherApp_deleteLearnPlan.do";
        const params = {
            token: global.constants.token,
            learnPlanId: learnPlanId,
        };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                WaitLoading.show_success('删除成功！',1000);
                const { todos } = this.state;
                var todosTemp = todos;
                var index = todos.indexOf(todo);

                console.log('==================删除索引======================================',index);
                if(index >= 0){
                    console.log('================删除前数组长度============1================',todosTemp.length);
                    todosTemp.splice(index , 1);
                    this.setState({
                        todos: todosTemp
                    },()=>{
                        console.log('================删除后数组长度===========2=================',this.state.todos.length);
                    })
                }
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
                            marginBottom: 15,
                        }}
                    >
                        <Text
                            style={{
                                color: "#999999",
                                fontSize: 14,
                                marginTop: 1,
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
        marginBottom: 20,
    },
    longTitle: {
        fontSize: 15,
        color: 'black',
        fontWeight: '500',
        width: screenWidth * 0.23,
        paddingTop: 12,
    },
    button: {
        width: screenWidth * 0.35,
        color: 'white',
        backgroundColor: '#4DC7F8',
    },
    textInput: {
        width: screenWidth * 0.6,
        backgroundColor: '#fff',
        borderColor: '#DCDCDC',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 20,
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
