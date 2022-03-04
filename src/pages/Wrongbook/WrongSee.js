import { useRoute } from "@react-navigation/native";
import res from "antd-mobile-icons/es/AaOutline";
import React, { Component, useState, useEffect, useRef } from "react";
import { View, Image, Text, StyleSheet, TouchableOpacity, Alert, SafeAreaView, SectionList, StatusBar } from "react-native";

export default WrongSee = () => {
    //初始化参数

    const route = useRoute()
    const ip = global.constants.baseUrl
    const token = global.constants.token
    const userName = global.constants.userName
    const subjectName = route.params.subjectName
    const subjectId = route.params.subjectId
    const currentPage = '1'
    //console.log(token,subjectId)
    //初始化props

    const [data, setData] = useState([]);
    const [success, setSuccess] = useState(false);

    //useEffect
    useEffect(() => {
        getData();
    }, []);

    //获取数据
    const getData = () => {
        fetch(ip
            + 'studentApp_ErrorQueGetQuestion.do?'
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
                setSuccess(res.success)
               


            })
            .catch(err => console.log('Request Failed', err));
    }
   
    
    // const aa = JSON.stringify(data[0]).list
    // const bb = JSON.parse(aa)
    // console.log(bb)
    console.log(typeof(data[0]))

    // if (success == true) {
       

    //     //console.log(data)
    //     //console.log(typeof(data.list) )
        
    // }
    return (
        // <SafeAreaView style={styles.container}>
        //     <SectionList
        //     sections={data}
        //     keyExtractor={(item, index) => item + index}
        //     renderItem={({ item }) => <Item title={item} />}
        //     renderSectionHeader={({ section: { title } }) => (
        //         <Text style={styles.header}>{title}</Text>
        //     )}
        //     />
        // </SafeAreaView>
        <Text>aaa

        </Text>
    )

}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: StatusBar.currentHeight,
        marginHorizontal: 16
    },
    item: {
        backgroundColor: "#f9c2ff",
        padding: 20,
        marginVertical: 8
    },
    header: {
        fontSize: 32,
        backgroundColor: "#fff"
    },
    title: {
        fontSize: 24
    }
});