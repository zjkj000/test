import { useRoute } from "@react-navigation/native";
import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    TouchableOpacity,
    Alert,
    ScrollView,
    useWindowDimensions,
    TextInput
} from "react-native";
import Loading from "../../utils/loading/Loading";
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";
import WrongSubmitButton from "./utils/WrongSubmitButton";
import SeeAnswerButton from "./utils/SeeAnswerButton";
import ShowAnswerContainer from "./utils/ShowAnswer";
import RadioList from "../LatestTask/DoWork/Utils/RadioList";
import Checkbox from "../LatestTask/DoWork/Utils/Checkbox";


export default WrongDetails = () => {

    //初始化参数
    const token = global.constants.token
    const userName = global.constants.userName
    const ip = global.constants.baseUrl
    const route = useRoute()
    const subjectName = route.params.subjectName
    const subjectId = route.params.subjectId
    const sourceId = route.params.sourceId
    const questionId = route.params.questionId
    

    //初始化props
    const [data, setData] = useState([])
    const [success, setSuccess] = useState(false)
    const [currentPage, setCurrentpage] = useState(route.params.currentPage)
    const [show, setShow] = useState(true)
    const [basetypeId, setBasetypeId] = useState(0)
    const [value, setValue] = useState('')
    const [index, setIndex] = useState('')
    const [newAnswer,setNewAnswer] =  useState([])
    const [stuAnswer, setStuAnswer] = useState('')
    



    //设置导航
    const navigation = useNavigation()

    //useEffect
    useEffect(() => {
        // 修改导航标题
        navigation.setOptions({ title: subjectName + '错题详情' })
        getData()
    }, [currentPage])

    //请求数据
    const getData = () => {
        setValue('')
        fetch(ip
            + 'studentApp_ErrorQueAnswerQuestion.do?'
            + 'userName=' + userName
            + '&token=' + token
            + '&subjectId=' + subjectId
            + '&currentPage=' + currentPage
            + '&sourceId=' + sourceId
            + '&questionId=' + questionId
            + '&callback=ha'
        )

            .then(response => response.text())
            .then(text => {

                const res = eval('(' + text.substring(2) + ')')

                //数据与props绑定
                setData(res.data)
                setSuccess(res.success)
                setCurrentpage(res.data.currentPage)
                setBasetypeId(res.data.baseTypeId)
                setStuAnswer(res.data.stuAnswer)

            })
            .catch(err => console.log('Request Failed', err))

    }

    //匹配错题类型加载图片
    const handleImg = (sourceType) => {
        switch (sourceType) {
            case '1': return <Image source={require('../../assets/LatestTaskImages/study.png')} style={styles.Img} />
            case '2': return <Image source={require('../../assets/LatestTaskImages/homework.png')} style={styles.Img} />
        }
    }
    
    //根据题目类型匹配答题区域组件
    const handleAnswerClass = (basetypeId) => {
        
        //单多选判断个数
        if (data.baseTypeId == '101' || data.baseTypeId == '102') {
            switch (data.answerNum) {
                case '3': var questionChoiceList = 'A,B,C'
                    break;
                case '4': var questionChoiceList = 'A,B,C,D'
                    break;
                case '5': var questionChoiceList = 'A,B,C,D,E'
                    break;
                case '6': var questionChoiceList = 'A,B,C,D,E,F'
                    break;
                case '7': var questionChoiceList = 'A,B,C,D,E,F,G'
                    break;
                case '8': var questionChoiceList = 'A,B,C,D,E,F,G,H'
                    break;
            }
        }

        //阅读题根据题数渲染出多少个单选列表
        if (basetypeId == '108') {
            
            //处理返回的单个答案组整一个数组
            const Answer = (index , value) => {
                setIndex(index)
                setValue(value)
                const clone = newAnswer
                clone[index] = value
                setNewAnswer(clone)
                
                console.log(newAnswer)
            }
            var items = [];
            for (var read_num_i = 0; read_num_i < data.smallQuestionNum; read_num_i++) {
                items.push(
                    <View key={read_num_i} style={styles.answer_result}>
                        <Text style={{ fontSize: 20, width: 25 }}>{read_num_i + 1}</Text>
                        <RadioList 
                            TimuIndex={read_num_i} 
                            checkedindexID={''} 
                            ChoiceList={"A,B,C,D"} 
                            getstuanswer={Answer} type='read' />
                    </View>);
            }
        }

        //根据题目类型匹配答题区域组件
        switch (basetypeId) {
            //单选题答题组件
            case '101': return (
                <View style={styles.answerIput}>
                    <View>
                        <Text>请选择答案：</Text>
                    </View>
                    <RadioList
                        checkedindexID={''}
                        ChoiceList={questionChoiceList}
                        getstuanswer={setValue}
                    />
                </View>)
            case '102': return (
                <View style={styles.answerIput}>
                    <View>
                        <Text>请选择答案：</Text>
                    </View>
                    <Checkbox
                        checkedlist={''}
                        ChoiceList={questionChoiceList}
                        getstuanswer={setValue}
                    />
                </View>)

            //判断题答题组件
            case '103': return (
                <View style={styles.answerIput}>
                    <View>
                        <Text>请选择答案：</Text>
                    </View>
                    <RadioList
                        checkedindexID={''}
                        ChoiceList={'对,错'}
                        getstuanswer={setValue}
                    />
                </View>

            )
            //填空题答题组件
            case '104': return (
                <View style={styles.answerIput}>
                    <TextInput
                        style={styles.TextInput}
                        placeholder='请输入答案'
                        value={value}
                        onChangeText={text => setValue(text)}
                    />
                </View>)

            case '108': return (
                <View style={styles.answerIput}>
                    <View>
                        <Text>请选择答案：</Text>
                    </View>
                    {items}
                </View>)



        }
    }

    //匹配底部按钮类型
    const handleClass = (basetypeId) => {
        switch (basetypeId) {
            case '101': return <WrongSubmitButton questionId={questionId} sourceId={sourceId} subjectId={subjectId} basetypeId={basetypeId} setShow={setShow} setStuAnswer={setStuAnswer} value={value} />
            case '102': return <WrongSubmitButton questionId={questionId} sourceId={sourceId} subjectId={subjectId} basetypeId={basetypeId} setShow={setShow} setStuAnswer={setStuAnswer} value={value} />
            case '103': return <WrongSubmitButton questionId={questionId} sourceId={sourceId} subjectId={subjectId} basetypeId={basetypeId} setShow={setShow} setStuAnswer={setStuAnswer} value={value} />
            case '104': return <WrongSubmitButton questionId={questionId} sourceId={sourceId} subjectId={subjectId} basetypeId={basetypeId} setShow={setShow} setStuAnswer={setStuAnswer} value={value} />
            //主观题仅查看答案
            case '106': return <SeeAnswerButton questionId={questionId} sourceId={sourceId} subjectId={subjectId} basetypeId={basetypeId} setShow={setShow} />
            case '108': return <WrongSubmitButton questionId={questionId} sourceId={sourceId} subjectId={subjectId} basetypeId={basetypeId} setShow={setShow} setStuAnswer={setStuAnswer} value={JSON.stringify(newAnswer)} />

        }
    }

    //设置图片加载宽度
    const { width } = useWindowDimensions();

    //点击左箭头重新提交请求
    const handleLeft = (currentPage) => {
        let temp = parseInt(currentPage)
        if (temp != 1) {
            temp = (temp - 1).toString()
            setCurrentpage(temp)
            setShow(true)
        }
        else {
            Alert.alert('已经是第一道题了')
        }
    }

    //点击右箭头重新提交请求
    const handleRight = (currentPage) => {
        let temp = parseInt(currentPage)
        if (temp != data.allPage) {
            temp = (temp + 1).toString()
            setCurrentpage(temp)
            setShow(true)
        }
        else {
            Alert.alert('已经是最后一道题了')
        }
    }

    

    return (
        <>
            {/* 试题回显 */}
            <ScrollView style={styles.scrollView}>
                <View style={styles.class}>
                    <View style={styles.class_type}>
                        <View style={styles.textAndimg}>
                            {handleImg(data.sourceType)}
                            <Text style={styles.class_type_text}> {data.sourceName}</Text>
                        </View>
                    </View>
                    <View style={styles.class_content}>
                        <View>
                            <View style={styles.class_content_title}>
                                <Text>  {data.num}</Text>
                                <View style={styles.scoreright}>
                                    <Text style={styles.textRight}>得分：{data.stuScore}  全班平均分:{data.avgScore}  </Text>
                                </View>
                            </View>

                            <View style={styles.class_content_con}>
                                <RenderHtml
                                    contentWidth={width - 6}
                                    source={{ html: data.shitiShow }}
                                />
                            </View>

                        </View>
                    </View>
                </View>
                {/* 根据题型选择答题组件 */}
                {show
                    ? handleAnswerClass(basetypeId)
                    : null
                }
                {/* 提交答案或查看答案      点击后显示答案*/}
                {show
                    ? handleClass(basetypeId)
                    : <ShowAnswerContainer
                        shitiAnswer={data.shitiAnswer}
                        shitiAnalysis={data.shitiAnalysis}
                        stuAnswer={stuAnswer}
                        basetypeId={basetypeId} />
                }

            </ScrollView>


            {/* 底部导航 */}
            <View style={styles.Bottom}>
                <View style={styles.Bottom_con}>
                    <View style={styles.Left}>
                        <TouchableOpacity onPress={() => handleLeft(data.currentPage)}>
                            <Image
                                source={require('../../assets/stuImg/lastquestion.png')}
                                style={styles.Arrow} />

                        </TouchableOpacity>
                    </View>
                    <View style={styles.Bottom_text}>
                        <Text style={styles.index}>{data.currentPage}</Text><Text>/{data.allPage}</Text>
                    </View>
                    <View style={styles.Right}>
                        <TouchableOpacity onPress={() => handleRight(data.currentPage)}>
                            <Image
                                source={require('../../assets/stuImg/nextquestion.png')}
                                style={styles.Arrow} />

                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </>
    )
}


//css样式
const styles = StyleSheet.create({
    Loading: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    scrollView: {
        width: '100%',
        height: '100%',
        backgroundColor: 'white'
    },
    class: {
        width: '100%',
    },
    class_type: {
        backgroundColor: '#DBDBDB',
        flexDirection: 'row',
        flexWrap: 'wrap',
        minHeight: 35,
    },
    textAndimg: {
        flex: 1,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    class_content: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    class_content_title: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: 'white',
        height: 25,
        flexDirection: 'row',
        alignItems: 'center'
    },
    class_content_con: {
        borderColor: '#696969',
        borderWidth: 1,
        margin: 3,
    },
    scoreright: {
        flex: 1,
        height: '100%',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    Bottom: {
        height: '7%',
        width: '100%',
        borderTopWidth: 1,
        borderTopColor: 'GRAY',
        flexDirection: 'row',
    },
    Bottom_con: {
        flexDirection: 'row',
        width: '100%'
    },
    Bottom_text: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    Left: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    Right: {
        flex: 1,
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },

    answerIput: {
        marginTop: 3,
        marginBottom: 7,
        marginLeft: 3,
        marginRight: 3,
        backgroundColor: 'white'
    },
    TextInput: {
        borderBottomWidth: 0.5,
    },
    answer_result:{
        flexDirection:'row',
        justifyContent:'center',
        paddingLeft:20,
        alignItems:'center'
    },

    //字体

    class_type_text: {
        fontSize: 15,
        color: '#808080',
    },
    index: {
        fontSize: 25,
        fontWeight: 'bold',
        color: 'black'

    },
    //图标
    Img: {
        marginLeft: 5,
        height: 25,
        width: 25,
    },
    Arrow: {
        margin: 8
    }
});