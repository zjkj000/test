import { useRoute } from "@react-navigation/native";
import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    useWindowDimensions,
    TouchableOpacity
} from "react-native";
import Loading from "../../utils/loading/Loading";
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";
import Dialog from "react-native-dialog";
import emitter from '../Wrongbook/utils/event.js';

export default WrongRecycle = () => {

    //初始化参数
    const ip = global.constants.baseUrl
    const token = global.constants.token
    const userName = global.constants.userName
    const subjectName = global.wrongBook.subjectName
    const subjectId = global.wrongBook.subjectId
    const questionId = global.wrongBook.questionId
    const sourceId = global.wrongBook.sourceId
    const currentPage = '1'
    

    //初始化props
    const [{ data, ready }, setState] = useState({ data: [], ready: 0 })
    const [visible, setVisible] = useState(false);//控制Dialog显隐
    const [refreash , setRefreash] = useState(0)

    //useEffect
    useEffect(() => {
        getData()
    }, [visible,refreash])
    //处理恢复错题按钮
    const handleRecycle = (questionId, sourceId) => {
        global.wrongBook.questionId = questionId
        global.wrongBook.sourceId = sourceId
        showDialog()
    }
    //Dialog对话框的显隐控制及功能函数
    //Dialog显示
    const showDialog = () => {
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
            + 'studentApp_ErrorQueRemove.do?'
            + 'subjectId=' + subjectId
            + '&userName=' + userName
            + '&questionId=' + questionId
            + '&sourceId=' + sourceId
            + '&token=' + token
            + '&callback=ha'
        )

            .then(response => response.text())
            .then(text => {

            })
            .catch(err => console.log('Request Failed', err));

        //对话框设为不可见
        setVisible(false);
        setRefreash(1)
        emitter.emit('wrongBook_refreash', refreash);
    };
    //渲染正常列表
    const handleErrList = () => {
        if (data != '') {
            return (
                <>
                    {/* Dialog对话框 */}
                    <View style={styles.container}>
                        <Dialog.Container visible={visible}>
                            <Dialog.Title>是否恢复本题？</Dialog.Title>
                            <Dialog.Description>
                                确认后本试题将被移出回收站，恢复到错题本原来位置
                            </Dialog.Description>
                            <Dialog.Button label="取消" onPress={handleCancel} />
                            <Dialog.Button label="确认" onPress={handleConform} />
                        </Dialog.Container>
                    </View>
                    {/* 错题本列表 */}
                    <ScrollView style={styles.scrollView}>
                        {
                            data.map((item, index) => {

                                return (
                                    <View style={styles.class}>
                                        {/* 一类试题上方的名称、图标、错题数 */}
                                        <View style={styles.class_type}>
                                            <View style={styles.textAndimg}>
                                                {handleImg(item.sourceType)}
                                                <View style={styles.left}>
                                                    <Text style={styles.class_type_text}> {item.sourceName}</Text>
                                                </View>
                                                <View style={styles.right}>
                                                    <Text style={styles.class_type_text}> 道错题  </Text>
                                                    <Text style={styles.errorQueNum}>{item.errorQueNum}</Text>
                                                </View>
                                            </View>

                                        </View>
                                        {/* 渲染一类的所有错题 */}
                                        <View style={styles.class_content}>
                                            {
                                                item.list.map((item1, index1) => {
                                                    return (
                                                        <View>
                                                            <View style={styles.class_content_title}>
                                                                <Text>  {item1.num}</Text>
                                                                <View style={styles.recoverRight}>
                                                                    <TouchableOpacity onPress={() => handleRecycle(item1.questionId, item.sourceId)}>
                                                                        <View style={{ marginRight: 5 }}>
                                                                            <Image
                                                                                source={require('../../assets/errorQue/recover.png')}
                                                                                style={styles.Image} />
                                                                        </View>

                                                                    </TouchableOpacity>
                                                                </View>
                                                            </View>

                                                            <View style={styles.class_content_con}>
                                                                <RenderHtml
                                                                    contentWidth={width - 6}
                                                                    source={{ html: item1.shitiShow }}
                                                                    tagsStyles={{
                                                                        img:{
                                                                            flexDirection:'row',
                                                                            flexWrap:'wrap'
                                                                        },
                                                                        p:{
                                                                            flexDirection:'row',
                                                                            flexWrap:'wrap'
                                                                        }
                                                                    }}
                                                                />
                                                            </View>

                                                        </View>
                                                    )
                                                })
                                            }
                                        </View>
                                    </View>
                                )
                            }
                            )
                        }
                    </ScrollView>
                </>
            )

        }
        else {
            return (
                <ScrollView style={styles.scrollView}>
                    <View style={styles.null}>
                        <Image source={require('../../assets/errorQue/null.png')} />
                    </View>
                </ScrollView>
            )
        }
    }
    //设置导航
    const navigation = useNavigation()
    //加载等待页
    const renderLoadingView = () => {
        return (
            <Loading show={true} />
        );
    }

    //获取数据
    const getData = () => {
        fetch(ip
            + 'studentApp_ErrorQueGetQuestionRecycle.do?'
            + 'userName=' + userName
            + '&token=' + token
            + '&subjectId=' + subjectId
            + '&currentPage=' + currentPage
            + '&callback=ha'
        )

            .then(response => response.text())
            .then(text => {

                const res = eval('(' + text.substring(2) + ')')

                //数据与props绑定
                setState({ data: res.data, ready: 1 })
                //setSuccess(res.success)
            })
            .catch(err => console.log('Request Failed', err))
        // 修改导航标题
        navigation.setOptions({ title: subjectName + '错题回收站' })
    }
    //设置图片加载宽度
    const { width } = useWindowDimensions();

    //匹配错题类型加载图片
    const handleImg = (sourceType) => {
        switch (sourceType) {
            case '1': return <Image source={require('../../assets/LatestTaskImages/study.png')} style={styles.Img} />
            case '2': return <Image source={require('../../assets/LatestTaskImages/homework.png')} style={styles.Img} />
        }
    }

    //渲染
    return (
            ready == '1' ? 
                handleErrList() 
                : renderLoadingView()
    )

}



const styles = StyleSheet.create({
    Loading: {
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
    container: {

        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
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
        flexWrap: 'wrap',
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
    right: {
        flex: 0.2,
        height: '100%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    left:{
        flex: 0.8,
        height: '100%',
        flexDirection: 'row',
        alignItems: 'center',
    },
    recoverRight:{
        flex: 1,
        height: '100%',
        flexDirection: 'row-reverse',
        alignItems: 'center',
    },
    mp4Img: {
        height: 15,
        width: 15,
        marginLeft: 5
    },
    null: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '20%'
    },
    //字体

    class_type_text: {
        fontSize: 15,
        color: '#808080',
    },
    errorQueNum: {
        fontSize: 14,
        color: '#FF0000',
    },
    //图标
    Img: {
        marginLeft: 5,
        height: 25,
        width: 25,

    },
    //恢复错题图标
    Image: {
        height: 40,
        width: 80,
        resizeMode: "contain",
    }
});