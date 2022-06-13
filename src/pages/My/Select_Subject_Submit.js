import { Text, View,Image,Alert} from 'react-native'
import React, { Component } from 'react'
import { Radio, RadioGroup,Button} from '@ui-kitten/components';
import http from '../../utils/http/request';
import { Toast } from '../../utils/Toast/Toast';
import { useNavigation } from "@react-navigation/native";

export default function Select_Subject_SubmitContainer(props) {
  const navigation = useNavigation();
  const taskId = props.route.params.taskId;
  return <Select_Subject_Submit navigation={navigation} taskId={taskId}/>
}

class Select_Subject_Submit extends Component {
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
            selectedIndex:'',
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
                    userId: global.constants.userName,
                    mode:'1',
                    // taskId:'e541ebe4-0683-4b82-b539-b701608950ca',
                    taskId:this.props.taskId
                }
        if(!this.state.success){
            http.get(url,params).then((resStr)=>{
                let resJson = JSON.parse(resStr);
                var newcomposeId = resJson.data.composeId
                var newindex = -1
                resJson.data.list.map(function(item,index){
                    if(item.id==newcomposeId){
                        newindex=index
                    }
                })
                this.setState({
                    selectedIndex:newindex,
                    newcomposeId:resJson.data.composeId,
                    ...resJson.data})
            })
        }
    }
    sub_select(){
        const selectedIndex= parseInt(this.state.selectedIndex)
        const list = this.state.list
        const url = 
                "http://"+
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/studentApp_saveSelectsubject.do"
        const params ={
                userId:global.constants.userName,
                userCn:global.constants.userCn,
                taskId:this.state.taskId,
                taskName:this.state.taskName,
                composeId:this.state.newcomposeId,
                composeName:list[selectedIndex].name,
                type:'newApp'                             //这里是跟文档不同的地方， 新的RNAPP里面新加的参数
                }
        
        if(this.state.newcomposeId!=this.state.composeId){
                http.get(url,params).then((resStr)=>{
                    let resJson = JSON.parse(resStr);
                    if(resJson.success){
                        this.setState({composeId:list[selectedIndex].id,composeName:list[selectedIndex].name})
                        // Toast.showInfoToast('选科成功！',1000)
                        Alert.alert('选科成功！','你选择的组合为：'+list[selectedIndex].name,
                                [{text:'ok',onPress:()=>{
                                    this.props.navigation.navigate({
                                        name:'Select_subject',
                                        params:{
                                            type:this.state.composeName
                                        }
                                    })
                                }}])
                    }
                    
                })
        }else{
            // Toast.showInfoToast('你的选科结果未改变',3000)
            Alert.alert('结果未改变')
        }
    }

    setSelectedIndex(index){
        this.setState({selectedIndex:index,newcomposeId:this.state.list[index].id})
    }

    render() {
        return (
            <View style={{paddingTop:10,paddingLeft:20,paddingRight:20}}>
               {this.state.des==''?(<Text></Text>):(
                <View style={{backgroundColor:'#FFFFFF',flexDirection:'row',alignItems:'center',paddingRight:70}}>
                    <Image style={{margin:10}} source={require('../../assets/image3/notes.png')}></Image>
                    <Text style={{padding:15}}>{this.state.des}</Text>
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
                        style={{padding:10,flexWrap:'wrap',flexDirection:'row',justifyContent:'space-between'}}
                        selectedIndex={this.state.selectedIndex}
                        onChange={index => this.setSelectedIndex(index)}>
                        {this.state.list.map(function(item,index){
                                return(<Radio  style={{marginLeft:10}} key={index}>{item.name}</Radio>)
                            })
                        }  
                    </RadioGroup>      
                </React.Fragment>   
                </View>
                
                <View style={{alignItems:'center',marginTop:20}}>
                    <Button style={{width:200}} onPress={() => {
                        if(this.state.selectedIndex=='-1'){
                            Alert.alert('请先选择科目')
                        }else{ 
                            this.sub_select() 
                        }                       
                    }
                    
                    }>确认提交</Button>
                </View>

            </View>
        )
    }
}
