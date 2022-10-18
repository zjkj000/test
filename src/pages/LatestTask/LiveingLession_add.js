import { ScrollView, Text, TextInput, View,Image, Alert,Keyboard,TouchableOpacity  } from 'react-native'
import React, { Component, useEffect, useState } from 'react'
import { CheckBox,Layout,Radio,Button, OverflowMenu ,MenuItem } from '@ui-kitten/components'
import http from '../../utils/http/request'
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import DateTime from '../../utils/datetimePickerUtils/DateTime';
//   教师端  添加直播课页面
import { useNavigation } from '@react-navigation/native';
import {Waiting,WaitLoading} from '../../utils/WaitLoading/WaitLoading'
import res from 'antd-mobile-icons/es/AaOutline';
export default function LiveingLession_add(props) {
    const navigation =useNavigation();

    const flag = props.route.params.flag?props.route.params.flag:'new';
    const roomId = props.route.params.roomId?props.route.params.roomId:'';
    const [data,setdata] = useState([])
    // useEffect(()=>{
    //     // if(type=='update'){
    //     //     // updateInform()
    //     // }
    // },[])

    function updateInform(){
        const url = "http://www.cn901.com/ShopGoods/ajax/livePlay_editZbLive.do";
        const params = {
                roomId:roomId,
            };
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            setdata(resJson.data);
          })
      }

     return (<LiveingLession_addContent navigation={navigation}  flag={flag} roomId={roomId} data ={data} />)
}

class LiveingLession_addContent extends Component {
    constructor(props){
        super(props)
        this.setDateStr=this.setDateStr.bind(this)
        this.state={
            subjectList:[],   //学科以及学科对应的自己的课堂    subjectList如果size=1，则学科radio选项不显示  默认直接写值，如果size>1,则默认第一个选中 
                              //subjectList 包括 ketangList  subjectId subjectName
            ketangList:[],    //下面的课堂为第一个学科下的课堂，切换学科时，课堂跟着切换 
            
            mList:[],      //协作组list
            moduleVisible:false,  //记录选择协作组弹窗是否显示
            titleisnull:true,     //记录是否输入了课堂名称
            setDateisnull:true,   //记录是否选择了时间
            userId:global.constants.userName,
            title:'',            //直播课名称
            subjectId:'',        //学科id
            subjectName:'',     //直播课名称
            startTime:'',       //开始时间
            hour:'',           //对应小时
            minutes:'',        //对应分钟

            type:'2',         // 类型：1自己的课堂，2协作组，3自己课堂+协作组
            ketangId:'',       //课堂id串，多个用,号分隔
            xzzId:'',          //协作组id（协作组只能选则一个）
            xzzName:'',        //协作组名称
            flag:this.props.flag,       //update(编辑记录),save（新创建的记录保存）
            roomId:this.props.roomId,       //房间号（如果是新创建的传空串，如果是编辑保存，传roomId）
        }
    }

    UNSAFE_componentWillMount(){
        //加载  信息  -- -获取教师教授的学科,课堂，协作组list
        this.fetchTea_Info();
        if(this.props.data!=null&&this.props.flag=='update'){
            this.setState(...this.props.data)
        }
    }
    UNSAFE_componentWillUpdate(nextProps){ 
        if(nextProps.data!=null&&nextProps.flag=='update'){
            this.setState(...nextProps.data)
        }
    }

    //  是  save  或  update
    saveLiveingLession(){
        const url = "http://www.cn901.com/ShopGoods/ajax/ livePlay_saveZbLive.do";
        const params = {
                userId:global.constants.userName,
                title:'',
                subjectId:'', 
                subjectName:'',   //直播课名称
                startTime:'',     //startTime
                hour:'',        //对应小时
                minutes:'',    //对应分钟
                type:'',      // 类型：1自己的课堂，2协作组，3自己课堂+协作组
                ketangId:'',  //课堂id串，多个用,号分隔
                xzzId:'',     //协作组id（协作组只能选则一个）
                xzzName:'',   //协作组名称
                flag:'',     //update(编辑记录),save（新创建的记录保存）
                roomId:'',   //房间号（如果是新创建的传空串，如果是编辑保存，传roomId）
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
                            screen:'通知公告',
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

    //获取教师教授的学科,课堂，协作组list
    fetchTea_Info(){
        const url = "http://www.cn901.com/ShopGoods/ajax/livePlay_getMyKtListRN.do";
        const params = {userId:global.constants.userName};   // 教师用户名
        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            this.setState({mList:resJson.mList,subjectList:resJson.subjectList});
          })
    }

    //设置开始时间
    setDateStr(str){
        this.setState({startTime:str+':00',setDateisnull:false})
    }


    //协作组选项默认
    renderAvatar = () => {
        return (
            <TouchableOpacity onPress={() => this.setState({moduleVisible:true})}>
                <Text style={{fontSize:15,color:'#87CEFA',marginLeft:10}}>{this.state.xzzName==''?"------请选择------":this.state.xzzName}</Text>
                <Text style={{position:'absolute',right:5}}>{this.state.xzzName==''?'▼':''}</Text>
            </TouchableOpacity>
        );
    };

  render() {
    //动态加载学科的选项 
    var Xueke_RadioItem = [];
    if(this.state.subjectList.length>1){
        for (let item_xknum = 0; item_xknum < this.state.subjectList.length; item_xknum++) {
            Xueke_RadioItem.push(
                <Radio key={item_xknum} style={{height:30}} checked={this.state.subjectId==this.state.subjectList[item_xknum].subjectId?true:false} onChange={()=>{
                    if(this.state.subjectId==this.state.subjectList[item_xknum].subjectId){
                        this.setState({subjectId:'',ketangId:''})
                    }else{
                        this.setState({subjectId:this.state.subjectList[item_xknum].subjectId,ketangId:''})
                    }
                    this.setState({subjectName:this.state.subjectList[item_xknum].subjectName,subjectId:this.state.subjectList[item_xknum].subjectId,ketangList:this.state.subjectList[item_xknum].ketangList})
                }}>{this.state.subjectList[item_xknum].subjectName}</Radio>
            );
        }
    }else{
        if(this.state.subjectList.length>0){
            this.setState({subjectName:this.state.subjectList[0].subjectName,
                subjectId:this.state.subjectList[0].subjectId,
                ketangList:this.state.subjectList[0].ketangList})
            Xueke_RadioItem.push(<Text>{this.state.subjectList[0].subjectName}</Text>);
        }
        
    }
    

    //动态加载 我的课堂 选项 
    var Ketang_RadioItem = [];
    for (let item_Ktnum = 0; item_Ktnum < this.state.ketangList.length; item_Ktnum++) {
        Ketang_RadioItem.push(
            <CheckBox key={item_Ktnum} style={{height:30}} checked={this.state.ketangId.indexOf(this.state.ketangList[item_Ktnum].key)>-1?true:false} onChange={()=>{
                console.log("dangqian:"+this.state.ketangId)
                if(this.state.ketangId.indexOf(this.state.ketangList[item_Ktnum].key)>-1){
                    let newketangId = this.state.ketangId;
                    var repstr = ","+this.state.ketangList[item_Ktnum].key; 
                    this.setState({ketangId:newketangId.replace(repstr,"")})
                }else{
                    var newketangId = this.state.ketangId;
                    this.setState({ketangId:(newketangId+','+this.state.ketangList[item_Ktnum].key)})
                }
            }}>{this.state.ketangList[item_Ktnum].value}</CheckBox>
        );
    }

        //动态加载协作组的选项 
        var MenuItem_number = [];
        for (let item_num = 0; item_num < this.state.mList.length; item_num++) {
            MenuItem_number.push(
                <MenuItem
                    title={this.state.mList[item_num].value}
                    key={item_num}
                    onPress={() => {
                        this.setState({ moduleVisible: false,xzzName:this.state.mList[item_num].value,xzzId:this.state.mList[item_num].key });
                    }}
                />
            );
        }
    return (
      <View style={{backgroundColor:'#fff',height:'100%',borderTopWidth:0.5}}>
         <Waiting/> 
        <View style={{height:50,flexDirection:'row',alignItems:'center',backgroundColor:'#FFFFFF',justifyContent:"center",borderBottomWidth:0.5,borderColor:"#CBCBCB"}}>
              <TouchableOpacity style={{position:'absolute',left:10}} 
                                onPress={()=>{this.props.navigation.goBack()
            }}>
                <Image style={{width:30,height:30}} source={require('../../assets/teacherLatestPage/goBack.png')} ></Image>
              </TouchableOpacity>
              <Text style={{color:'#59B9E0',fontSize:20}}>创建课堂</Text>
        </View>

        <ScrollView style={{paddingBottom:20}}>
             <View style={{flexDirection:'row',borderBottomWidth:0.5,padding:10,borderColor:"#CBCBCB",width:'100%',alignItems:'center'}}>
                <Text style={{width:80}}>课堂名称:</Text>
                <TextInput
                        placeholder="请输入课堂名称"
                        value={this.state.title}
                        style={{
                            width:screenWidth-100,
                            height:40,
                            backgroundColor: '#fff' , 
                            borderColor: '#DCDCDC',
                            borderWidth: 1,
                            borderRadius: 5,
                            paddingLeft:20
                        }}
                        onChangeText={(text)=>{
                            if(text==''){
                                this.setState({title:text,titleisnull:true})
                            }else{
                                this.setState({title:text,titleisnull:false})
                            }
                        }}
                >
                </TextInput>
            </View>
            <View style={{flexDirection:'row',borderBottomWidth:0.5,padding:10,borderColor:"#CBCBCB",width:'100%',alignItems:'center'}}>
                <Text style={{width:80}}>开课时间:</Text>
                <TextInput
                            editable={false}
                            value={this.state.startTime}
                            onFocus={()=>{
                                Keyboard.dismiss()
                                this.mysetdate._showDatePicker()
                            }}
                            style={{
                                    width: screenWidth-130,
                                    height:38,
                                    backgroundColor:this.state.setDateFlag=='2'?'#fff':'#f2f4f6', 
                                    borderColor: '#DCDCDC',
                                    borderWidth:1,
                                    borderRadius:5
                            }}
                ></TextInput>
                <DateTime ref={ref => this.mysetdate = ref} setDateTime={this.setDateStr} selectedDateTime={this.state.setDate}></DateTime>
            </View> 

           <View style={{flexDirection:'row',padding:10,height:50,borderBottomWidth:0.5,borderColor:"#CBCBCB",alignItems:'center'}}>
                <Text >课堂类型:</Text>
                <Layout style={{flexDirection:'row',paddingLeft:20}}>
                    <Radio style={{height:30}} checked={(this.state.type=='1'||this.state.type=='3')?true:false} onChange={()=>{
                        if(this.state.type==''){
                            this.setState({type:'1'})
                        }else if(this.state.type=='1'){
                            this.setState({type:''})
                        }else if(this.state.type=='2'){
                            this.setState({type:'3'})
                        }else{this.setState({type:'2'})}
                    }}>自己的课堂</Radio>
                    <Radio style={{height:30}} checked={(this.state.type=='2'||this.state.type=='3')?true:false} onChange={()=>{
                        if(this.state.type==''){
                            this.setState({type:'2'})
                        }else if(this.state.type=='1'){
                            this.setState({type:'3'})
                        }else if(this.state.type=='2'){
                            this.setState({type:''})
                        }else{this.setState({type:'1'})}
                    }}>协作组的课堂</Radio>
                </Layout>
            </View>

            <View style={{flexDirection:'row',padding:10,borderBottomWidth:0.5,borderColor:"#CBCBCB",alignItems:'center'}}>
                <Text style={{width:40}}>学科:</Text>
                <Layout style={{flexDirection:'row',flexWrap:'wrap',paddingLeft:40}}>
                    {/* 动态加载学科 */}
                    {Xueke_RadioItem}
                </Layout> 
            </View> 


            <View style={{flexDirection:'row',borderBottomWidth:0.5,padding:10,borderColor:"#CBCBCB",width:'100%',alignItems:'center',flexWrap:'nowrap'}}>
                <Text style={{width:100}}>选择我的课堂:</Text>
                <Layout style={{flexDirection:'row',flexWrap:'wrap',paddingLeft:40}}>
                    {/* 动态加载课堂 */}
                    {Ketang_RadioItem}
                </Layout> 
            </View>

            <View style={{flexDirection:'row',borderBottomWidth:0.5,padding:10,borderColor:"#CBCBCB",width:'100%',alignItems:'center'}}>
                <Text style={{width:80}}>选择协作组:</Text>
                <View style={{width:screenWidth-110,backgroundColor:'#fff',borderWidth:0.5,height:30,justifyContent:'center'}}>
                 <OverflowMenu
                                style={{borderColor:'#000',borderWidth:1,width:screenWidth-120}}
                                anchor={this.renderAvatar}
                                visible={this.state.moduleVisible}
                                onBackdropPress={() => {this.setState({moduleVisible:false})}}
                            >
                                {MenuItem_number}
                    </OverflowMenu> 
                </View>
                
            </View> 
        </ScrollView>

        <View style={{width:'100%',marginBottom:10,flexDirection:'row',justifyContent:'space-around'}}>
            {/* <Button onPress={()=>{this.props.navigation.goBack()}} style={{width:'40%'}}>取消</Button> */}
            <Button onPress={()=>{
                //判断是否为空
                // if(this.state.titleisnull){ 
                //     Alert.alert('','请输入标题！',[{},{text:'确定',onPress:()=>{}}])
                // }
                // else if(!this.state.AllTea&&!this.state.AllStu){
                //     Alert.alert('','请选择发布对象！',[{},{text:'确定',onPress:()=>{}}])
                // }else if(this.state.contentisnull){
                //     Alert.alert('','请先输入内容',[{},{text:'确定',onPress:()=>{}}])
                // }else if(this.state.setDateFlag=='2'&&this.state.setDateisnull){
                //     Alert.alert('','请设置定时发布时间！',[{},{text:'确定',onPress:()=>{}}])
                // }else{
                //     this.saveLiveingLession()
                // }
            }} style={{width:'40%'}}>确定</Button>
        </View>
      </View>
    )
  }
}

