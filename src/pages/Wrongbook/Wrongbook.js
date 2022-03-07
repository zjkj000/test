import React, { Component, useState , useEffect,useRef} from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import res from "antd-mobile-icons/es/AaOutline";



export default Wrongbook = () => {
    //获取用户信息
    const ip = global.constants.baseUrl
    const token = global.constants.token
    const userName = global.constants.userName
    //初始化参数
    const [data, setData] = useState([]);
    //设置导航
    const navigation = useNavigation()
    //获取学科数据
    useEffect(() => {
        getData();
      },[]);
    const getData = () =>{
        fetch(ip
            + 'studentApp_ErrorQueGetSubject.do?'
            + 'userName=' + userName
            + '&token=' + token
            + '&callback=ha'
        )
    
            .then(response => response.text())
            .then(text => {
    
                let res = eval('(' + text.substring(2) + ')')
                //数据与props绑定
                setData(res.data)
                
    
            })
            .catch(err => console.log('Request Failed', err));
    }
    

    //点击跳转到单科全部错题界面并将小红点状态置0
    const onPressButton = (subjectId , subjectName) => {
        console.log('错题本页面测试')
        //更改学科错题已读状态
        fetch(ip
            + 'studentApp_ErrorQueUpdateStatus.do?'
            + 'userName=' + userName
            + '&token=' + token
            + '&subjectId=' + subjectId
            + '&callback=ha'
        )
    
            .then(response => response.text())
            .then(text => {
    
                let success = eval('(' + text.substring(2) + ')')
                //数据与props绑定
            
    
            })
            .catch(err => console.log('Request Failed', err));
        
        // 页面跳转，传递参数subjectId
        navigation.navigate({
            name:'错题本',
            params:{
                subjectId:subjectId,
                subjectName:subjectName
                
            }
        })
        
    }
    //处理小红点的显隐
    const handleVisible = (imageStatu) => {
        if(imageStatu=='0'){
            return (<Text/>)
        }else if(imageStatu=='1'){
            return(
                <Image source={require('../../assets/teaImg/rightNum.png')} style={styles.rightNum} />
            )
        }
    }
    //渲染
    return (
        <>
            <View style={{ height: '15%' }} />
            <View style={styles.Container}>
                {   
                //循环渲染data中的数据
                    data.map((item, index) => {
                        return (
                            //Alert.alert(item.status),
                            //TouchableOpacity点击或长按均有半透明效果
                            <TouchableOpacity onPress={() => onPressButton(item.subjectId,item.subjectName)} style={styles.TouchableOpacity} >
                                <View style={styles.Card}>
                                    <View style={styles.ViewCard}>
                                        <View style={styles.ViewCardleft}>
                                            <Image
                                                source={require('../../assets/teaImg/paper.png')}
                                                style={styles.Image}
                                            />
                                        </View>
                                        <View style={styles.ViewCardright}>
                                            <View style={styles.textView}>
                                                <Text style={styles.Text}>{item.subjectName}</Text>
                                                { handleVisible(item.status) }
                                            </View>
                                            <View>
                                                <Text>{item.errorQueNum}道错题</Text>
                                            </View>

                                        </View>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        </>
    )
};
const styles = StyleSheet.create({
    Container: {
        flexDirection: 'row',
        height: '100%',
        width: '100%',
        flexWrap: 'wrap'
        //backgroundColor:'blue'

    },

    TouchableOpacity: {
        margin: '3%',
        width: '43%',
        height: '9%',
        alignItems: 'center',
        hitSlop: ''

    },
    Card: {
        // /margin:'5%',
        width: '100%',
        height: '100%',
        borderColor: 'gainsboro',
        borderWidth: 1,
        display: 'flex',
        borderRadius: 10,
        //elevation:1,
        backgroundColor: 'white'

    },
    ViewCard: {
        flexDirection: 'row',
        padding: 0,
        //backgroundColor:'#F5FCFF',
        flex: 1,
        borderRadius: 10,
    },
    ViewCardleft: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        height: '100%',
        width: '40%',
        margin: 0,
        padding: 0,

        //backgroundColor:"yellow"
    },
    ViewCardright: {

        alignItems: 'flex-start',
        height: '100%',
        width: '60%',
        margin: 0,
        padding: 0,

        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        //backgroundColor:'green'
    },
    textView: {
        height: '50%',
        flexDirection: 'row',
        alignItems: 'center'
    },
    Image: {
        width: 50,
        height: 50,
    },
    rightNum: {
        marginLeft: 5,
        width: 12,
        height: 12
    },
    Text: {
        fontSize: 18,
        fontWeight: '500'
    }
})