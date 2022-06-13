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
    TextInput,
    ImageBackground
} from "react-native";
import Loading from "../../utils/loading/Loading";
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";
import WrongSubmitButton from "./utils/WrongSubmitButton";
import SeeAnswerButton from "./utils/SeeAnswerButton";
import ShowAnswerContainer from "./utils/ShowAnswer";
import RadioList from "../LatestTask/DoWork/Utils/RadioList";
import Checkbox from "../LatestTask/DoWork/Utils/Checkbox";
import Dialog from "react-native-dialog";
import emitter from '../Wrongbook/utils/event.js';
import VideoPlayerContainer from "./utils/VideoPlayer";
import VideoPlayScreen from "./utils/VideoPlayScreen";

export default WrongDetails = () => {

    //初始化参数
    const token = global.constants.token
    const userName = global.constants.userName
    const ip = global.constants.baseUrl
    const route = useRoute()
    const subjectName = route.params.subjectName
    const subjectId = route.params.subjectId
    const sourceId = route.params.sourceId
    
    


    //初始化props
    const [data, setData] = useState([])
    const [currentPage, setCurrentpage] = useState(route.params.currentPage)
    const [show, setShow] = useState(true)
    const [basetypeId, setBasetypeId] = useState(0)
    const [value, setValue] = useState('')
    const [index, setIndex] = useState('')
    const [newAnswer, setNewAnswer] = useState([])
    const [stuAnswer, setStuAnswer] = useState('')
    const [questionId, setQuestionId] = useState(route.params.questionId)
    const [visible, setVisible] = useState(false)//控制Dialog显隐
    const [allPage, setAllPage] = useState(0)
    const [refreash, setRefreash] = useState(0)
    const [mp4_data, setMp4_data] = useState([])
    const [videoUrl,setvideoUrl] = useState('')

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
                setCurrentpage(res.data.currentPage)
                setBasetypeId(res.data.baseTypeId)
                setStuAnswer(res.data.stuAnswer)
                setQuestionId(res.data.questionId)
                setAllPage(res.data.allPage)
               
                handleVideoData()
            })
            .catch(err => console.log('Request Failed', err))
    }
    //请求视频数据，写在外面是因为视频请求应答回比getData快，导致questionId还没更新就用老的id请求到了数据
    const handleVideoData = () => {
        fetch(ip
            + 'studentApp_ErrorGetMp4List.do?'
            + '&questionId=' + questionId
            + '&callback=ha'
        )

            .then(response => response.text())
            .then(text => {
                const res = eval('(' + text.substring(2) + ')')
                setMp4_data(res.data)
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
            const Answer = (index, value) => {
                setIndex(index)
                setValue(value)
                const clone = newAnswer
                clone[index] = value
                setNewAnswer(clone)
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
            //setQuestionId(questionId)
            setShow(true)
        }
        else {
            Alert.alert('已经是第一道题了')
        }
    }

    //点击右箭头重新提交请求
    const handleRight = (currentPage) => {
        let temp = parseInt(currentPage)
        if (temp != allPage) {
            temp = (temp + 1).toString()
            setCurrentpage(temp)
           // setQuestionId(questionId)
            setShow(true)
        }
        else {
            Alert.alert('已经是最后一道题了')
        }
    }

    //点击‘标记掌握’弹出对话框
    //Dialog对话框的显隐控制及功能函数
    //Dialog显示
    const handleToRecycle = () => {
        setVisible(true);
    };
    //取消键设置隐藏
    const handleCancel = () => {
        setVisible(false);
    };
    //确认键设置隐藏并且发送请求
    const handleConform = () => {
        //确认后将题目移出回收站
        fetch(ip
            + 'studentApp_ErrorQueBiaoji.do?'
            + 'subjectId=' + subjectId//
            + '&userName=' + userName//
            + '&questionId=' + questionId//
            + '&sourceId=' + sourceId//
            + '&token=' + token//
            + '&callback=ha'
        )

            .then(response => response.text())
            .then(text => {

            })
            .catch(err => console.log('Request Failed', err));

        //对话框设为不可见
        setVisible(false)
        setRefreash(1)
        emitter.emit('wrongBook_refreash', refreash);
        setRefreash(0)
        let temp = parseInt(currentPage)
        if (temp == '1') {
            setCurrentpage(temp)
        }
        else {
            temp = (temp - 1).toString()
            setCurrentpage(temp)
        }
    };

    //点击播放视频
    const handleVideo = (videoUrl) => {
        setvideoUrl(videoUrl)
    }
    //考点讲解视频
    const handleMp4 = () => {
        if(typeof(mp4_data[0])=='undefined'){
                return(null)  
        }
        else{   
            return (
                showVideo()     
            )}
    }
    const showVideo = () => {
        return (
            <View>
                <View style={styles.videoTotle}><Text>  考点讲解</Text><Image source={require('../../assets/errorQue/play.png')} style={styles.mp4Img} /></View>
                <View style={styles.mp4}>
                {
                    mp4_data.map((item, indexnull) => {
                        // 
                        const title = JSON.stringify(item)
                        let index = title.indexOf("@");
                        let mp4_title = title.substring(index + 3, title.length - 1);
                        let mp4_url = title.substring(1, index);
                        if(mp4_title.length>11){
                            mp4_title = mp4_title.substring(0, 11)+'...'
                        }
    
                        return (
                            <View style={styles.video}>
                                <TouchableOpacity onPress={() => handleVideo(mp4_url)}>
                                    <ImageBackground
                                        source={require('../../assets/errorQue/previewImg.jpg')}
                                        style={styles.mp4_show}
                                        resizeMode={'contain'}
                                    >
                                        <Text style={styles.mp4_tiele}>{mp4_title}</Text>
                                    </ImageBackground>
                                </TouchableOpacity>
                            </View>
                        )
                    })
    
                }
                </View>
            </View>
        )
    }
    

    //渲染具体错题
    const handleWrongList = () => {
        if (data != null) {
            return (
                <>
                    {/* Dialog对话框 */}
                    <View style={styles.container}>
                        <Dialog.Container visible={visible}>
                            <Dialog.Title>是否标记本题？</Dialog.Title>
                            <Dialog.Description>
                                标记掌握的试题将被移出错题本，可以在“错题回收站”中查看和恢复
                            </Dialog.Description>
                            <Dialog.Button label="取消" onPress={handleCancel} />
                            <Dialog.Button label="确认" onPress={handleConform} />
                        </Dialog.Container>
                    </View>

                    {/* 试题回显 */}
                    <ScrollView style={styles.scrollView}>
                        {currentPage == '0' ?
                            handleErrorListNull()
                            : handleErrorList()
                        }
                        {/* 视频区域 */}
                        {
                            handleMp4()
                        }
                    </ScrollView>

                    {/* 标记错题 进入回收站按钮 */}
                    <View style={styles.Mark}>
                        <TouchableOpacity onPress={() => handleToRecycle()}>
                            <Image
                                source={require('../../assets/errorQue/markIcon.png')}
                                style={styles.Image} />
                        </TouchableOpacity>
                    </View>

                    {/* 底部导航 */}
                    <View style={styles.Bottom}>
                        <View style={styles.Bottom_con}>
                            <View style={styles.Left}>
                                <TouchableOpacity onPress={() => handleLeft(currentPage)}>
                                    <Image
                                        source={require('../../assets/stuImg/lastquestion.png')}
                                        style={styles.Arrow} />

                                </TouchableOpacity>
                            </View>
                            <View style={styles.Bottom_text}>
                                <Text style={styles.index}>{currentPage}</Text><Text>/{allPage}</Text>
                            </View>
                            <View style={styles.Right}>
                                <TouchableOpacity onPress={() => handleRight(currentPage)}>
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
        else {
            return (
                <>
                    <ScrollView style={styles.scrollView}>
                        <View style={styles.null}>
                            <Image source={require('../../assets/errorQue/null.png')} />
                        </View>
                    </ScrollView>
                    <View style={styles.Bottom}>
                        <View style={styles.Bottom_con}>
                            <View style={styles.Left}>
                                {/* <TouchableOpacity onPress={() => handleLeft(currentPage)}> */}
                                    <Image
                                        source={require('../../assets/stuImg/lastquestion.png')}
                                        style={styles.Arrow} />

                                {/* </TouchableOpacity> */}
                            </View>
                            <View style={styles.Bottom_text}>
                                <Text style={styles.index}>{currentPage}</Text><Text>/{allPage}</Text>
                            </View>
                            <View style={styles.Right}>
                                {/* <TouchableOpacity onPress={() => handleRight(currentPage)}> */}
                                    <Image
                                        source={require('../../assets/stuImg/nextquestion.png')}
                                        style={styles.Arrow} />

                                {/* </TouchableOpacity> */}
                            </View>
                        </View>
                    </View>
                </>


            )
        }

    }


    //题目区域回显
    const handleErrorList = () => {
        return (
            <>
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
                
            </>

        )
    }
    //空题目回显
    const handleErrorListNull = () => {
        return (

            <View style={styles.null}>
                <Image source={require('../../assets/errorQue/null.png')} />
            </View>

        )
    }
    

    return (
        videoUrl!=''
        ?<VideoPlayerContainer url={videoUrl} setvideoUrl={setvideoUrl} setOptions={navigation.setOptions}/>
        :handleWrongList()
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
    answer_result: {
        flexDirection: 'row',
        justifyContent: 'center',
        paddingLeft: 20,
        alignItems: 'center'
    },
    Mark: {
        position: 'absolute',
        bottom: '8%',
        right: '3%',
    },
    null: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20%'
    },
    mp4Img: {
        height: 15,
        width: 20,
        marginLeft: 5
    },
    
    videoTotle:{
        flexDirection: 'row',
        height: 25,
        flexDirection: 'row',
        marginTop:'5%'
    },
    mp4: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
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
    mp4_tiele:{
        fontSize: 14,
        color: 'white',
        position:'absolute',
        bottom:4,
        left:2,
    },
    //图标
    Img: {
        marginLeft: 5,
        height: 25,
        width: 25,
    },
    Arrow: {
        margin: 8
    },
    mp4_show: {
        height:120,
        width:170,
        margin:5,
        marginTop:0
    },
    
    //标记错题
    Image: {
        resizeMode: "contain",
        width: 110,
    },
});