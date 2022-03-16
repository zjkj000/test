import { useRoute } from "@react-navigation/native";
import React, { Component, useState, useEffect, useRef } from "react";
import {
    View,
    Image,
    Text,
    StyleSheet,
    ScrollView,
    useWindowDimensions
} from "react-native";
import Loading from "../../utils/loading/Loading";
import RenderHtml from 'react-native-render-html';
import { useNavigation } from "@react-navigation/native";


export default WrongRecycle = () => {

    //初始化参数
    const ip = global.constants.baseUrl
    const token = global.constants.token
    const userName = global.constants.userName
    const subjectName = global.wrongBook.subjectName
    const subjectId = global.wrongBook.subjectId
    const currentPage = '1'

    //初始化props
    const [data, setData] = useState([])
    //const [success, setSuccess] = useState(false)


    //useEffect
    useEffect(() => {
        getData()
    }, [])

    //渲染正常列表
    const handleErrList = () => {
        if (data != '') {
            return (
                data.map((item, index) => {
                    return (
                        <View style={styles.class}>
                            <View style={styles.class_type}>
                                <View style={styles.textAndimg}>
                                    {handleImg(item.sourceType)}
                                    <Text style={styles.class_type_text}> {item.sourceName}</Text>

                                    <View style={styles.right}>
                                        <Text style={styles.class_type_text}> 道错题  </Text>
                                        <Text style={styles.errorQueNum}>{item.errorQueNum}</Text>
                                    </View>
                                </View>

                            </View>
                            <View style={styles.class_content}>
                                {
                                    item.list.map((item1, index1) => {
                                        return (
                                            <View>
                                                <View style={styles.class_content_title}>
                                                    <Text>  {item1.num}</Text>
                                                    <View style={styles.right}>
                                                        {/* 贴恢复错题图标 */}
                                                    </View>
                                                </View>

                                                <View style={styles.class_content_con}>
                                                    <RenderHtml
                                                        contentWidth={width - 8}
                                                        source={{ html: item1.shitiShow }}
                                                    />
                                                </View>

                                            </View>
                                        )
                                    })
                                }
                            </View>
                        </View>
                    )
                })
            )
        }
        else {
            return (
                <View style={styles.null}>
                    <Image source={require('../../assets/photoImage/beijing.png')} />
                </View>
            )
        }
    }
    //设置导航
    const navigation = useNavigation()

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
                setData(res.data)
                //setSuccess(res.success)
            })
            .catch(err => console.log('Request Failed', err))
        // setShow(false)
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
        <ScrollView style={styles.scrollView}>
            {handleErrList()}
        </ScrollView>
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
    scrollView: {
        width: '100%',
        height: '100%',
        backgroundColor:'white'
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
        flex: 1,
        height: '100%',
        flexDirection: 'row-reverse',
        alignItems: 'center'
    },
    mp4Img: {
        height: 15,
        width: 15,
        marginLeft: 5
    },
    null:{
        flex:1,
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center',
        marginTop:'20%'
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

    }
});