import React from 'react';
import {
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    Image,
    View,
    Text,
    Dimensions,
} from "react-native";
import { SearchBar, TabBar } from '@ant-design/react-native';
import { Icon , Flex } from '@ant-design/react-native';
import { useNavigation } from "@react-navigation/native";

export default function TodoListContainer(){
    const navigation = useNavigation();
    //将navigation传给TodoList组件，防止路由出错
    return <TodoList navigation={navigation}></TodoList>
}

//显示器大小
export const screenWidth = Dimensions.get('window').width;
//console.log('window width  ' , screenWidth);   //window width   411.42857142857144
export const screenHeight = Dimensions.get('window').height;
//console.log('window height  ' , screenHeight);  //window height   683.4285714285714

class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {  //type为2是作业，为1是导学案，3通知，4公告
        todos: [
            {statusUrl: 'new', status: '1', iconUrl: '../../Images/LatestTaskImages/homework.png', type: '2',
                createrName: '明茗', bottomTitle: '正弦定理',
                courseName: '高中数学', timeStop: '1月27日', time: '1月25日',
                content: '高中数学(北师大版)/必修5/解三角形/正弦定理正弦定理正弦定理', teaScore: null, averageScore: null, rank: null
            },
            {statusUrl: '未批改', status: '3', iconUrl: '../../Images/LatestTaskImages/homework.png', type: '2',
                 createrName: '明茗', bottomTitle: '余弦定理拍照布置',
                 courseName: '高中数学', timeStop: '1月27日', time: '1月25日',
                 content: '余弦定理', teaScore: null, averageScore: null, rank: null
            },
            {statusUrl: '已批改', status: '2', iconUrl: '../../Images/LatestTaskImages/homework.png', type: '2',
                  createrName: '明茗', bottomTitle: '余弦定理',
                  courseName: '', timeStop: '', time: '1月25日',
                  content: '', teaScore: 2.0, averageScore: 2.0, rank: null
            },
            {statusUrl: 'new', status: '1', iconUrl: '../../Images/LatestTaskImages/study.png', type: '1',
                   createrName: '明茗', bottomTitle: '等差数列',
                   courseName: '高中数学', timeStop: '1月27日', time: '1月25日',
                   content: '高中数学(北师大版)/必修5/数列/等差数列/等差等差等差等差等差',  teaScore: null, averageScore: null, rank: null
            },
            {statusUrl: '已读', status: '4', iconUrl: '../../Images/LatestTaskImages/inform.png', type: '3',
                   createrName: '明茗', bottomTitle: '寒假放假通知',
                   courseName: '', timeStop: '', time: '2022.01',
                   content: '马上就要放寒假了，大家在家注意安全，做好疫情防护工作，提前祝大家新年快乐！',  teaScore: null, averageScore: null, rank: null
            },
            {statusUrl: '未读', status: '5', iconUrl: '../../Images/LatestTaskImages/public-notice.png', type: '4',
                   createrName: '诸珠', bottomTitle: '定时公告2-第3次修改',
                   courseName: '', timeStop: '', time: '2020.04',
                   content: '第二个定时公告2222-第3次次改',  teaScore: null, averageScore: null, rank: null
            },
        ],
    };
  }
  //当content内容为空时，返回null，页面将不为content分配页面空间
  contentShow = (content) => {
        return content == '' ? null : <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.content}>{content}</Text>
  };

  render() {
    const {todos} = this.state;
    const content = todos.map((todo , index) => {
      //根据type判断是作业还是导学案等
      const todoType = todo.type == '1' ? '导学案' :
                       (todo.type == '2' ? '作业' :
                       (todo.type == '3' ? '通知' : '公告'));
      //作业、导学案图标
      //const iconUrl = todo.iconUrl;
      //console.log('iconUrl' , typeof(iconUrl) , iconUrl);
      //const todoImg = require(iconUrl); //(这种方法报错！！！)
      const todoImg = todoType == '导学案' ?
                      require('../../Images/LatestTaskImages/study.png') :
                      (todoType == '作业' ?
                      require('../../Images/LatestTaskImages/homework.png') :
                      (todoType == '通知' ?
                      require('../../Images/LatestTaskImages/inform.png') :
                      require('../../Images/LatestTaskImages/public-notice.png')));
      //根据图标状态指定图标的url(对于已读的通知，应该不显示任何图标，此处使用三目运算，且需要require请求资源，故设置请求资源为空白图片../Image/readInform.png)
      const statusImg = (todo.statusUrl == 'new' || todo.statusUrl == '未读') ?
                        require('../../Images/LatestTaskImages/new.png') :
                        (todo.statusUrl == '已批改' ?
                        require('../../Images/LatestTaskImages/hasCheck.png') :
                        (todo.statusUrl == '未批改' ?
                        require('../../Images/LatestTaskImages/noCheck.png') :
                        require('../../Images/LatestTaskImages/readInform.png')));
      console.log('statusImg' , typeof(statusImg) , statusImg);
      //小标题
      const bottomTitle = todo.bottomTitle;
      //创建者
      const createrName = todo.createrName;
      //课程名称（通过判断学习状态修改课程名称）
      const courseName = (todo.status == 1 || todo.status == 3) ?
                         todo.courseName :
                         (todo.status == 2 ?
                         ('得分:' + todo.teaScore + '分 平均分:' +
                         todo.averageScore + '分') :
                         todo.content);
      //截止时间(当作业或导学案已批改,通知或公告时，截止时间不显示，可将截止时间修改为空字符串)
      const timeStop = (todo.status == 2 || todo.status == 4 || todo.status == 5) ?
                       '' : ('截止:' + todo.timeStop);
      const courseName_timeStop = courseName + "  " + timeStop;
      //开始时间
      const time = todo.time;
      //发布内容(当作业或导学案已批改,通知或公告时，发布内容不显示，可将发布内容修改为空字符串)
      const content = (todo.status == 2 || todo.status == 4 || todo.status == 5) ?
                      '' : todo.content;

      return (
        <View key={index}  style={{ flex: 1 }}>
            <TouchableOpacity
                onPress={() => {
                    this.props.navigation.navigate("Todo" , {});
                }}
                style={{borderWidth:0.5,paddingTop: 10,paddingLeft: 10,paddingRight: 10,paddingBottom: 10}}
            >
                <Flex>
                    {/*作业/导学案等图标iconUrl 作业/导学案等type 图标状态statusUrl 小标题bottomTitle 创建者createrName*/}
                    <Image source={todoImg} style={styles.imgType} />
                    <Text style={styles.title}>{todoType}</Text>
                    <Image source={statusImg}  style={styles.imgStatus} />
                    <View style={{width:screenWidth*0.05}}></View>
                    <View style={styles.titlePosition}><Text style={styles.title}>{bottomTitle}</Text></View>
                    <Text style={styles.createrName}>{createrName}</Text>
                </Flex>
                <Flex>
                    {/*课程名courseName  截止时间timeStop  资源发布时间time*/}
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.courseName_timeStop}>{courseName_timeStop}</Text>
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
    return (
         <View>
            <ScrollView style={{ backgroundColor: '#fff' }}>
                  {content}
            </ScrollView>
         </View>
    );
  }
}

const styles = StyleSheet.create({
    imgType: {
        height:'100%',
        width:'5%',
        resizeMode: 'contain',
    },
    imgStatus: {
        height:'80%',
        width:'5%',
        resizeMode: 'contain',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    titlePosition:{
        width: screenWidth*0.58,
    },
    createrName: {
        fontSize: 20,
        fontWeight: 'bold',
        paddingLeft:screenWidth*0.8,
        position:'absolute',
    },
    courseName_timeStop: {
        fontSize: 15,
        width: screenWidth*0.8,
    },
    time: {
        fontSize: 15,
        width: screenWidth*0.2,
    },
    content: {
        fontSize: 15,
        width: screenWidth,
    },
});