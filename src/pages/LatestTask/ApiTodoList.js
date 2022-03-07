import React from "react";
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    Dimensions,
} from "react-native";
import { SearchBar, TabBar } from "@ant-design/react-native";
import { Icon, Flex } from "@ant-design/react-native";
import { useNavigation } from "@react-navigation/native";
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import http from "../../utils/http/request";


var REQUEST_URL = 'http://www.cn901.net:8111/AppServer/ajax/studentApp_getStudentPlan.do?currentPage=1&userId=ming6060&resourceType=all&token=QI+ar3v0GUcw3HVjv1cuOqdy3/gRfmhkGKvkD68gnnrDZXRuRAxqwuuGkA/nVMTotrz92iBAXInntl22YkZHri5C7an5UU7N';

export default class ApiTodoList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //type为2是作业，为1是导学案，3通知，4公告
            message: '',
            todos: {},
        };
        this.fetchData = this.fetchData.bind(this); //fetchData函数中this指向问题
    }

    UNSAFE_componentWillMount(){
        this.fetchData();
    }

    componentDidMount(){
        this.fetchData();
    }
    //通过fetch请求数据
    fetchData(){  //{var jsonData = response.json() ; console.log('jsonData' , jsonData)}
       //http://www.cn901.net:8111/AppServer/ajax/studentApp_getStudentPlan.do?currentPage=1&userId=ming6060&resourceType=all
       const url =
            "http://"+
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/studentApp_getStudentPlan.do"
       const params ={
            currentPage:'2',
            userId:'ming6060',
            resourceType:'all',
            //callback:'ha',
            token:'QI+ar3v0GUcw3HVjv1cuOqdy3/gRfmhkGKvkD68gnnrDZXRuRAxqwuuGkA/nVMTotrz92iBAXInntl22YkZHri5C7an5UU7N',
        }
        http.get(url,params).then((resStr)=>{
            let resJson = JSON.parse(resStr);
            //console.log('resStr' , resStr);
            var todosList = resJson.data;
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

    render() {
        const { todos , message } = this.state;
        const todo1 = todos[0];
        //console.log('todoslist' , typeof(todos) , todos,todos.length);
       

        if(todos.length > 0){
            console.log('数据请求成功！！！');
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
                        const statusUrl = todo.status;
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
                                : todo.content;
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

                        return (
                            <View key={index} style={{ flex: 1 }}>
                                <TouchableOpacity
                                    onPress={() => {

                                        this.props.navigation.navigate("Todo", {});
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
                                    {/*<Flex>*/}
                                    {/*发布内容content*/}
                                    {this.contentShow(content)}
                                    {/*</Flex>*/}
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
            console.log('数据还在请求中！！！');
            return <Text>数据还在请求中</Text>;
        }
        /*
        if(todo1 != null)
        {
            status  = todos[0].bottomTitle;
            bottomTitle  = todos[0].bottomTitle;
            createrName = todos[0].createrName;
            timeStop = todos[0].timeStop;
            time = todos[0].time;
        }*/
    }
}

const styles = StyleSheet.create({
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
