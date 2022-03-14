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
} from "react-native";
import { SearchBar, TabBar } from "@ant-design/react-native";
import { Icon, Flex } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";
import Loading from "../../utils/loading/Loading"; //Loading组件使用export {Loading}或者export default Loading;
//import {Loading} from "../../utils/loading/Loading"; //Loading组件使用export {Loading},此时import必须加{}导入

export default function TodoListContainer(props) {
    //console.log(props.resourceType);
    const rsType = props.resourceType;
    const navigation = useNavigation();
    //将navigation传给TodoList组件，防止路由出错
    return <TodoList navigation={navigation} resourceType={rsType}></TodoList>;
}

var oldtype = '';  //保存上一次查询的资源类型，若此次请求的类型与上次不同再重新发送请求
var InformOrNoticeStatus = '';  //0标识未读，1标识已读

class TodoList extends React.Component {
    constructor(props) {
        super(props);
        //console.log('props' , props);
        //console.log('resourceType' , props.resourceType);
        this.state = {
            //type为2是作业，为1是导学案，3通知，4公告
            message: '',
            todos: {},
        };
        this.fetchData = this.fetchData.bind(this); //fetchData函数中this指向问题
    }

    
    UNSAFE_componentWillMount(){  //初始挂载执行一遍
        oldtype = this.props.resourceType;
        console.log('oldtypeWillMount' , oldtype);
        this.fetchData();
    }

    componentDidMount(){   //初始挂载执行一遍
        //this.fetchData();
    }

    
    UNSAFE_componentWillUpdate(){
        console.log('oldtypeWillUpdate' , this.props.resourceType);
        //fetchData执行会触发setState函数，又会重新执行componentWillUpdate函数，
        //需要将oldtype设置为此次请求的数据类型，否则oldtype != this.props.resourceType一直满足，将会一直发送请求
        oldtype = this.props.resourceType;   
    }

    componentDidUpdate(){
        console.log('oldtypeDidUpdate' ,  this.props.resourceType);
        console.log('oldtype' , oldtype);
        if(oldtype != this.props.resourceType){
            this.fetchData();
        }
        if(InformOrNoticeStatus == '1'){
            console.log('修改通知公告状态');
            //this.setState({});
            //InformOrNoticeStatus = '0';
            console.log('InformOrNoticeStatus' , InformOrNoticeStatus);
        }
    }


    //通过fetch请求数据
    fetchData(){
       const rsType = this.props.resourceType;
       //console.log('rsType' , rsType);
       const url =
            "http://"+
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/studentApp_getStudentPlan.do"
       const params ={
            currentPage: '1',
            userId: 'ming6002',
            resourceType: rsType,
            //callback:'ha',
            token: 'QI+ar3v0GUcw3HVjv1cuOqdy3/gRfmhkGKvkD68gnnrDZXRuRAxqwuuGkA/nVMTotrz92iBAXInntl22YkZHri5C7an5UU7N',
        }
        console.log('数据请求！！！');
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            //console.log('resStr' , resStr);
            var todosList = resJson.data; //重要！！！！！！
            //console.log('objtodo' , typeof(todosList) , todosList ,todosList.length)
            this.setState({message:resJson.message, todos: todosList})
        })

       /*
       fetch(REQUEST_URL)
           .then((response) => response.json())
           .then((responseData) => {
               //console.log('responseData' , typeof(responseData) , responseData) //text方式解析为string类型
               var obj = JSON.parse(responseData) //将json字符串转化为json对象(text方式解析)
               //更新state
               var todosList = obj.data;
               //console.log('objtodo' , typeof(todosList) , todosList ,todosList.length)
               this.setState({message:obj.message, todos: todosList})
           })
           .catch((error) => {
               console.error(error);
           });*/
    }

    //当content内容为空时，返回null，页面将不为content分配页面空间
    contentShow = (content) => {
        //return content == " " ;
        return content == " " ? null : (
            <Text
                numberOfLines={1}
                ellipsizeMode={"tail"}
                style={styles.content}
            >
                {content}
            </Text>
        );
    };

    render() {
        const { todos , message } = this.state;
        const rsType = this.props.resourceType;
        // console.log('resourceType' , rsType);
        //const todo1 = todos[0];
        //console.log('todoslist' , typeof(todos) , todos,todos.length);
       

        if(todos.length > 0){
            //console.log('数据请求成功！！！');
            //console.log('message' , message);
            //console.log('todos' ,  todos);
            const content = todos.map((todo, index) => {
                        //console.log('sdsddsfds')
                        //根据type判断是作业还是导学案等
                        const todoType = todo.type;
                        //作业、导学案图标
                        //const iconUrl = todo.iconUrl;
                        //console.log('iconUrl' , typeof(iconUrl) , iconUrl);
                        //const todoImg = require(iconUrl); //(这种方法报错！！！)
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
                        const statusImg =
                            statusUrl == '1' || statusUrl == '5'
                                ? require("../../assets/LatestTaskImages/new.png")
                                : statusUrl == "2"
                                ? require("../../assets/LatestTaskImages/hasCheck.png")
                                : statusUrl == "3"
                                ? require("../../assets/LatestTaskImages/noCheck.png")
                                : require("../../assets/LatestTaskImages/readInform.png");
                        //console.log("statusImg", typeof statusImg, statusImg);
                        //小标题
                        const bottomTitle = todo.bottomTitle;
                        //创建者
                        const createrName = todo.createrName;
                        //课程名称（通过判断学习状态修改课程名称）
                        const courseName =
                            todo.status == 1 || todo.status == 3
                                ? todo.courseName
                                : todo.status == 2
                                ? "得分:" +
                                  todo.teaScore +
                                  "分 平均分:" +
                                  todo.averageScore +
                                  "分"
                                : todo.courseName;
                        //截止时间(当作业或导学案已批改,通知或公告时，截止时间不显示，可将截止时间修改为空字符串)
                        const timeStop =
                            todo.status == 2 || todo.status == 4 || todo.status == 5
                                ? ""
                                : "截止:" + todo.timeStop;
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
                                : 4 ;

                        return (
                            <View key={index} style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => {

                                        if(todoType == "作业"){
                                            // 查看已经批改的作业
                                            // if(statusUrl==2){
                                                this.props.navigation.navigate("ShowCorrected", 
                                                {
                                                    learnId: learnId, 
                                                    selectedindex:0,
                                                    papername:bottomTitle,
                                                    //navigation: useNavigation(),
                                                });
                                            // }
                                            // // 做作业
                                            // else{
                                                // this.props.navigation.navigate("DoPaper", 
                                                // {
                                                //     learnId: learnId, 
                                                //     status: statusUrl, //作业状态
                                                //     selectedindex:0,
                                                //     papername:bottomTitle,
                                                //     //navigation: useNavigation(),
                                                // });
                                            // }

                                        }else if(todoType == "导学案"){

                                            this.props.navigation.navigate("todo" , 
                                            {
                                                learnId: learnId, 
                                                status: statusUrl, //作业状态
                                                //navigation: useNavigation(),
                                            });
                                        }else if(todoType == "通知" || todoType == "公告"){    
                                            this.props.navigation.navigate("InformOrNotice" , 
                                            {
                                                bottomTitle: bottomTitle,
                                                createrName: createrName,
                                                time: time,
                                                courseName: courseName, //通知或公告内容
                                                learnId: learnId,
                                                status: statusUrl, //通知状态
                                                type: type, //todo类型
                                            });
                                            if(statusUrl == 5){ //表示未读的通知公告
                                                statusUrl = 4; //表示已读的通知公告
                                                //console.log('statusUrl1' , statusUrl);
                                                InformOrNoticeStatus = '1';
                                            }
                                        }                                       
                                    }}
                                    style={{
                                        borderWidth: 0.5,
                                        paddingTop: 10,
                                        paddingLeft: 10,
                                        paddingRight: 10,
                                        paddingBottom: 10,
                                    }}
                                >
                                    <Flex>
                                        {/*作业/导学案等图标iconUrl 作业/导学案等type 图标状态statusUrl 小标题bottomTitle 创建者createrName*/}
                                        <Image source={todoImg} style={styles.imgType} />
                                        <Text style={styles.title}>{todoType}</Text>
                                        {/*console.log('statusUrl2' , statusUrl)*/}
                                        <Image
                                            source={statusImg}
                                            style={styles.imgStatus}
                                        />                                       
                                        <View style={{ width: screenWidth * 0.05 }}></View>
                                        <View style={styles.titlePosition}>
                                            <Text style={styles.title}>{bottomTitle}</Text>
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
                                </TouchableOpacity>
                            </View>
                        );
                    });
            return(
                    <ScrollView style={{ backgroundColor: "#fff" }}>
                        {content}
                    </ScrollView>
            );
        }
        else{
            //console.log('数据还在请求中！！！');
            //return <Text>数据还在请求中</Text>;
            {/**<View style={styles.container}>
                    <ActivityIndicator animating={true} color="red" size="large" />
                    <Text style={{fontSize: 15,fontWeight: "bold",}}>数据正在加载中...</Text>          
                </View> */}
            return(
                <View style={styles.container}>                     
                    <Loading show={true}/>         
                </View>
            );
        }
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
        resizeMode: "contain",
    },
    title: {
        fontSize: 20,
        fontWeight: "bold",
    },
    titlePosition: {
        width: screenWidth * 0.58,
    },
    createrName: {
        fontSize: 20,
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
});
