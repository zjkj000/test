import { Text, View,Image,Button} from 'react-native'
import React, { Component } from 'react'
import { Radio, RadioGroup } from '@ui-kitten/components';
import http from '../../utils/http/request';
import { Toast } from '../../utils/Toast/Toast';
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function SelectSubject_InfoContainer(props) {
  const navigation = useNavigation();
  const taskId = props.taskId;
  return <SelectSubject_Info navigation={navigation} taskId={taskId}/>
}

class SelectSubject_Info extends Component {
    constructor(props){
        super(props)
        this.state={
            des:'',             //为空或者null，则不显示
            taskName: '',
            startTimeStr: '',
            endTimeStr: '',
            composeName: '',
            composeId: '',      //该id不为空，表示学生已经选过科，则进行回显，判断list里id                       与composeId相同的，则选中
            newcomposeId:'',
            list:[],
            taskId: '',
            success: false,
        }

    }

    UNSAFE_componentWillMount(){
        const url = 
                    "http://"+
                    "www.cn901.net" +
                    ":8111" +
                    "/AppServer/ajax/studentApp_getSelectCourseTaskDetial.do"
        const params ={
                    userId:'ming6001',
                    mode:'1',
                    taskId:'2679a3e7-f1c1-42e7-9c10-089793d676b0',
                    // taskId:this.props.taskId
                }
        if(!this.state.success){
            http.get(url,params).then((resStr)=>{
                let resJson = JSON.parse(resStr);
                console.log(resJson.data.composeId)
                this.setState({
                    newcomposeId:resJson.composeId,
                    ...resJson.data})
            })
        }
    }

    sub_select(){
        const newcomposeId= this.state.newcomposeId
        const url = 
                "http://"+
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/studentApp_saveSelectsubject.do"
        const params ={
                userId:global.constants.userName,
                userCn:'测试固定',
                taskId:this.state.taskId,
                taskName:this.state.taskName,
                composeId:this.state.newcomposeId,
                composeName:this.state.list[newcomposeId].name
                }
        if(this.state.newcomposeId!=this.state.composeId){
                http.get(url,params).then((resStr)=>{
                    let resJson = JSON.parse(resStr);
                    if(resJson.success){
                       Toast.showSuccessToast('选科提交成功!',3000)
                    }
                })
        }else{
            Toast.showSuccessToast('你的选科结果未改变',3000)
        }
    }

    setSelectedIndex(index){
        this.setState({newcomposeId:index})
    }

    render() {
        return (
            <View style={{paddingTop:10,paddingLeft:20,paddingRight:20}}>
               {this.state.des==''?(<Text></Text>):(
                <View style={{backgroundColor:'#FFFFFF',height:50,flexDirection:'row',alignItems:'center'}}>
                    <Image style={{margin:10}} source={require('../../assets/image3/notes.png')}></Image>
                    <Text>{this.state.des}</Text>
                </View>
               )}
            
                {/* 标题区域 */}
                <View style={{marginTop:10,flexDirection:'row'}}>
                    <View style={{backgroundColor:'#FE9B33',width:8,marginRight:10}}></View>
                    <Text style={{fontSize:20}}>{this.state.taskName}</Text>
                </View>
                <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-end'}}>
                    <Image style={{height:30,width:30,marginRight:10,marginLeft:10}} source={require('../../assets/image3/clander.png')}/>
                    <Text>{this.state.startTimeStr}</Text>
                    <Text>至</Text>
                    <Text>{this.state.endTimeStr}</Text>
                </View>
                <Text style={{color:'red',fontSize:15,marginLeft:40,marginTop:10}}>选科进行中...</Text>

                <View style={{backgroundColor:'#FFFFFF',marginTop:20}}>
                <React.Fragment>
                    <RadioGroup
                        style={{padding:10,flexWrap:'wrap',flexDirection:'row',justifyContent:'space-around'}}
                        selectedIndex={ parseInt(this.state.newcomposeId)}
                        onChange={index => this.setSelectedIndex(index)}>
                        {this.state.list.map(function(item,index){
                                return(<Radio key={index}>{item.name}</Radio>)
                            })
                        }  
                    </RadioGroup>      
                </React.Fragment>   
                </View>
                
                <View style={{alignItems:'center',marginTop:20}}>
                    <View style={{backgroundColor:'#59B9E0',height:40,width:200,alignItems:'center',justifyContent:'center'}}>
                        <TouchableOpacity 
                            onPress={()=>{
                                this.sub_select()
                            }} >
                            <Text style={{color:'#FFFFFF'}}>确认提交</Text>
                        </TouchableOpacity>
                    </View>
                    
                </View>

            </View>
        )
    }
}
