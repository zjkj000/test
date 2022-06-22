import {ScrollView, Text, TextInput, TouchableOpacity, View,Keyboard,Alert } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { Layout, Radio,Button } from '@ui-kitten/components';
import http from '../../utils/http/request'
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import DateTime from './DateTime'
//   教师端  管理员创建通知
import { useNavigation } from '@react-navigation/native';
import {Waiting,WaitLoading} from '../../utils/WaitLoading/WaitLoading'
export default function Tea_CreateInform(props) {
    const navigation =useNavigation();
    const noticeId = props.route.params.noticeId
    const type = props.route.params.type
    const [data,setdata] = useState([])
    useEffect(()=>{
        if(noticeId!=''&&type!=''){
            updateInform()
        }
    },[])
    function updateInform(){
        const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_getNoticeInfo.do";
        const params = {
                noticeId:noticeId,
                type:type,           //类型：3  通知  4  公告
                token:global.constants.token 
            };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                setdata(resJson.data)
            }
          })
      }
    return (
        <Tea_CreateInformContent navigation={navigation} data={data} noticeId={noticeId}/>
    )
}

class Tea_CreateInformContent extends Component {
    constructor(props){
        super(props)
        this.setDateStr=this.setDateStr.bind(this)
        this.state={
            className:'',
            classId:'',
            userName:'',
            userCN:'',
            success:false,
            stuClassList:[],  //id: 162,ids: ,name: 一年级一班（2017级）, value: ''，
            title:'',
            content:'',
            setDateFlag:'1',   //  1及时发送；2定时发送
            setDate:'',       // 定时发送时，定时的时间
            saveOrUpdate:'',  //save新建的通知，进程保存；update保存修改的通知
            noticeId:'',      
        }
    }

    UNSAFE_componentWillMount(){
        if(!this.state.success){
            this.getStuClassList()
        }
        this.setState({
            noticeId:this.props.noticeId,
            saveOrUpdate:this.props.data!=''?'update':'save',
            content:this.props.data.content,
            setDate:this.props.data.setDate,
            title:this.props.data.title,
            classId:this.props.data.classId,
            className:this.props.data.className
        })

    }
    setDateStr(str){
        this.setState({setDate:str})
    }

    //type  是  save  或  update
    saveOrUpdateInform(){
        const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_saveNotice.do";
        const params = {
                classId:this.state.classId,
                className:this.state.className,
                userName:global.constants.userName,
                userCN:global.constants.userCn,
                content:this.state.content,
                title:this.state.title,
                setDateFlag:this.state.setDateFlag,
                setDate:this.state.setDate,
                saveOrUpdate:this.state.saveOrUpdate,  
                noticeId:this.state.noticeId,  
            };
        WaitLoading.show('发布中...',-1)
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                WaitLoading.dismiss()
                Alert.alert('','发布成功',[{},
                    {text:'确定',onPress:()=>{
                        this.props.navigation.navigate({
                            name:'Teacher_Home',
                            params:{
                                screen:'最新',
                                params:{
                                    isRefresh:true,
                                }
                            },
                            merge:true
                        })
                    }}
              ])
            }
        })
    }

    //通知获取学生列表
    //如果data为空，即没有班级信息，则在显示班级的位置标红显示这样一句话：您还没有课堂和班级信息，请联系管理员创建。然后将确定按钮置灰，不可点
    getStuClassList(){
        const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/teacherApp_publishNotice.do";
        const params = {
                userName : global.constants.userName,
            };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                this.setState({stuClassList:resJson.data,success:resJson.success})
            }
        })
    }

  render() {
    const RenderStuList = []
    this.state.stuClassList.map((item,index)=>{
        RenderStuList.push(
            <TouchableOpacity onPress={()=>{
                this.setState({classId:item.id,className:item.name})
            }}>
                <View style={{backgroundColor:'#dadada',borderWidth:1,borderColor:this.state.classId==item.id?'red':'#dadada',height:40,padding:10,marginTop:5,width:250,alignItems:'center'}}>
                    <Text>{item.name}</Text>
                </View>
            </TouchableOpacity>
        )
    })
    return (
      <View style={{backgroundColor:'#fff',height:'100%',borderTopWidth:0.5}}>
        <Waiting/>
        <ScrollView style={{borderTopWidth:0.5,width:'100%'}}>
            <View style={{flexDirection:'row',borderBottomWidth:0.5,padding:10}}>
                <Text style={{marginTop:10}}>标题:</Text>
                <TextInput
                        placeholder="请输入标题"
                        value={this.state.title}
                        style={{
                            width: screenWidth*0.7 ,
                            height:40,
                            marginLeft:15,
                            backgroundColor: '#fff' , 
                            borderColor: '#DCDCDC',
                            borderWidth: 1,
                            borderRadius: 5,
                            paddingLeft:20
                        }}
                        onChangeText={(text)=>{
                            this.setState({title:text})
                        }}
                >
                </TextInput>
            </View>
            <View style={{padding:10,borderBottomWidth:0.5,width:'100%'}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{marginTop:10}}>班级:</Text>
                    <TextInput
                            value={this.state.className}
                            onFocus={()=>Keyboard.dismiss()}
                            style={{
                                width: screenWidth*0.7 ,
                                height:40,
                                marginLeft:15,
                                backgroundColor: '#fff' , 
                                borderColor: '#DCDCDC',
                                borderWidth: 1,
                                paddingLeft:20
                            }}>
                        </TextInput>
                </View>
                <View style={{width:'100%',alignItems:'center'}}>
                    {RenderStuList}
                </View>

            </View>
            <View style={{flexDirection:'row',padding:10,borderBottomWidth:0.5}}>
                <Text style={{marginTop:25}}>设置:</Text>
                <Layout style={{flexDirection:'column',paddingLeft:20}}>
                    <Radio style={{height:30}} checked={this.state.setDateFlag=='1'} onChange={()=>{
                                if(this.state.setDateFlag!='1'){
                                    this.setState({setDateFlag:'1'})
                                }
                            }}>即时发布</Radio>
                    <View style={{flexDirection:'row'}}>
                        <Radio checked={this.state.setDateFlag=='2'} onChange={()=>{
                            if(this.state.setDateFlag!='2'){
                                this.setState({setDateFlag:'2'})
                            }
                        }}>定时发布</Radio>
                        <DateTime ref={ref => this.mysetdate = ref} setDateTime={this.setDateStr} selectedDateTime={this.state.setDate}></DateTime>
                        <TextInput
                            ref={ref => this.mytextinput = ref}
                            editable={this.state.setDateFlag=='2'?true:false}
                            value={this.state.setDate}
                            onFocus={()=>{
                                Keyboard.dismiss()
                                this.mysetdate._showDatePicker()
                            }}
                            style={{
                                    width: screenWidth*0.4 ,
                                    height:35,
                                    backgroundColor: this.state.setDateFlag=='2'?'#fff':'#f2f4f6' , 
                                    borderColor: '#DCDCDC',
                                    borderWidth:1,
                            }}
                            ></TextInput>
                    </View>
                </Layout>
            </View>
            <View style={{padding:10}}>
                <Text>内容:  (添加文字)</Text>
                <TextInput 
                    value={this.state.content}
                    underlineColorAndroid='transparent'
                    multiline={true}
                    textAlign='left'
                    textAlignVertical='top'
                    style={{
                            marginTop:5,
                            width: screenWidth*0.9 ,
                            height:screenHeight*0.6,
                            marginLeft:15,
                            backgroundColor:'#fff' , 
                            borderColor: '#DCDCDC',
                            borderWidth: 1,
                            borderRadius: 5,
                            paddingLeft: 20,
                        }}
                        onChangeText={(text)=>{
                            this.setState({content:text})
                        }}
                ></TextInput>
            </View>
        </ScrollView>
        <View style={{width:'100%',position:'absolute',bottom:10,flexDirection:'row',justifyContent:'space-around'}}>
            <Button onPress={()=>{this.props.navigation.goBack()}} style={{width:'40%'}}>取消</Button>
            <Button onPress={()=>{
                this.saveOrUpdateInform()
            }} style={{width:'40%'}}>确定</Button>
        </View>
      </View>
    )
  }
}

