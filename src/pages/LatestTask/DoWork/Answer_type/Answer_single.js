import {
    Text,
    StyleSheet,
    View,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
    Dimensions,StatusBar
} from "react-native";
import { screenWidth, screenHeight } from "../../../../utils/Screen/GetSize";
import React, { Component, useState } from "react";
import RadioList from "../Utils/RadioList";
import RenderHtml from "react-native-render-html";
import { useNavigation } from "@react-navigation/native";

export default function Answer_singleContainer(props) {
    const navigation = useNavigation();
    const paperId = props.paperId;
    const submit_status = props.submit_status;
    const startdate = props.startdate;
    const papername = props.papername;
    const sum = props.sum;
    const num = props.num;
    const datasource = props.datasource;
    const oldAnswer_data = props.oldAnswer_data;
    const [ischange, setischange] = useState();
    props.getischange(ischange);
    const [Stu_answer, setStu_answer] = useState();
    props.getStu_answer(Stu_answer);
    return (
        <Answer_single
            navigation={navigation}
            papername={papername}
            submit_status={submit_status}
            startdate={startdate}
            paperId={paperId}
            getischange={setischange}
            getStu_answer={setStu_answer}
            sum={sum}
            num={num}
            isallObj={props.isallObj}
            datasource={datasource}
            oldAnswer_data={oldAnswer_data}
        />
    );
}
//  单选题 模板页面
//  使用时 需要传入参数：   sum   总题目数量：                 选传 不传默认总数题   会显示1/1题
//                         num   这是第几个题目               选传 不传默认num  0   会显示1/1题
//                         datasource                        必须传  试题的内容
//                         paperId                           必须传  用于提交作业时候用到
//                         oldAnswer_data                    选择传递   是否有历史作答记录  一般是通过api获取的历史答案。否则不建议传
//                         getischange={setischange}         传递一个函数  用于向做作业的页面传递 是否改变了答案，便于判断是否要提交  setischange函数要自己写在做作业页面
//                         getStu_answer={setStu_answer_i}   传递一个函数  用于获得阅读题得到的作答结果  setStu_answer_i函数要自己写在做作业页面 代表设置第几道题的答案。

class Answer_single extends Component {
    constructor(props) {
        super(props);
        this.stuAnswer = this.stuAnswer.bind(this);
        this.state = {
            numid: "",
            questionTypeName: "单选题",
            questionId: "",
            baseTypeId: "",
            questionName: "", //题目名称
            questionChoiceList: "", //题目选项
            questionContent: "", //题目内容
            answer: "",
            stu_answer: "",
            oldStuAnswer: "",
        };
    }

    //用于将本道题写的答案  传给 Todo页面，用于提交
    stuAnswer(str) {
        this.setState({ stu_answer: str });
        this.props.getStu_answer(str); //改父组件回显
        this.props.getischange(true);
    }

    UNSAFE_componentWillMount() {
        //请求数据  需要  作业id  用户id   这道题的 numid
        //id有了 props.paperId   用户id有
        //请求到之后  就要把答案 设置到oldstuanswer
        this.setState({
            stu_answer: this.props.oldAnswer_data
                ? this.props.oldAnswer_data
                : "",
            oldStuAnswer: this.props.oldAnswer_data,
            numid: this.props.num ? this.props.num : 0,
            ...this.props.datasource,
        });
    }

    render() {
        const HTML = this.state.questionContent;
        const questionChoiceList = this.state.questionChoiceList;
        const width = Dimensions.get("window").height;
        // const width2 = Dimensions.get("screen").height;
        const width3 = StatusBar.currentHeight;
        // console.log("屏幕高度",width3)
        return (
            <View style={{backgroundColor:'#FFFFFF',borderTopColor:'#000000',borderTopWidth:0.5,height:'100%',justifyContent:'space-between'}}  >
                {/* 第一行显示 第几题  题目类型 */}
                <View style={styles.answer_title}>
                    <Text style={{ color: "#59B9E0" }}>
                        {(this.state.numid ? this.state.numid : 0) + 1}
                    </Text>
                    <Text>/{this.props.sum ? this.props.sum : 1}题 </Text>

                    <Text style={{ marginLeft: 20 }}>
                        {this.state.questionTypeName}
                    </Text>
                    {/* <TouchableOpacity
                        onPress={() => {
                            //导航跳转
                            this.props.navigation.navigate("SubmitPaper", {
                                paperId: this.props.paperId,
                                submit_status: this.props.submit_status,
                                startdate: this.props.startdate,
                                papername: this.props.papername,
                                isallObj: this.props.isallObj,
                            });
                        }}
                        style={{ position: "absolute", right: 20, top: 10 }}
                    >
                        <Image
                            source={require("../../../../assets/image3/look.png")}
                        ></Image>
                    </TouchableOpacity> */}
                </View>

                {/* 题目展示区域 */}
                <ScrollView style={styles.answer_area}>
                    <RenderHtml contentWidth={width} source={{ html: HTML }} 
                            tagsStyles={{
                                img:{
                                    flexDirection:'row'
                                },
                                p:{
                                    flexDirection:'row'
                                }
                            }}
                    />
                    <Text style={{ height: 50 }}></Text>
                </ScrollView>

                {/* 答案区域 */}
                <View style={styles.answer_result}>
                    {/* checkedindexID 历史选中的答案  
                    ChoiceList选项列表   
                    getstuanswer用于获取学生作答记录  这个函数自己写  名称是  stuAnswer
                    type区分单选还是阅读:不传默认是单选 */}
                    <RadioList
                        checkedindexID={this.state.stu_answer}
                        ChoiceList={questionChoiceList}
                        getstuanswer={this.stuAnswer}
                        type="single"
                    />
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    // 题目模板标题
    answer_title: { paddingTop:10, paddingLeft: 30, flexDirection: "row",height:40},

    // 题目内容区域
    answer_area: {padding: 20,paddingTop:0},

    // 答题部分区域
    answer_result: {
        height:80,
        borderTopWidth: 0.5,
        borderTopColor: "#000000",
        paddingLeft: 30,
        paddingRight: 30,
        flexDirection: "row",
        justifyContent:"space-around"
    },
});
