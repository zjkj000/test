import { Text, View,Image,ScrollView,TouchableOpacity,TextInput,StyleSheet} from 'react-native'
import React, { Component } from 'react'
import { screenWidth, screenHeight } from "../../../utils/Screen/GetSize";
import { Button } from '@ui-kitten/components';

import { useNavigation } from "@react-navigation/native";
import BasePicker from '../../../utils/datetimePickerUtils/BasePicker';
import DateTime from '../../../utils/datetimePickerUtils/DateTime';
import http from '../../../utils/http/request'
import Toast from '../../../utils/Toast/Toast';
export default function AssignPicturesWorkContainer(props) {
    const navigation = useNavigation();
    const paperName=props.route.params.paperName
    const paperId = props.route.params.paperId
    navigation.setOptions({title:'布置作业'});
    return <AssignPicturesWork navigation={navigation} paperName={paperName} paperId={paperId} />;
}

class AssignPicturesWork extends Component {
    constructor(props){
        super(props)
        this.setBeginDateTime=this.setBeginDateTime.bind(this)
        this.setEndDateTime=this.setEndDateTime.bind(this)
        this.state={
            paperId:'',
            paperName:'',
            assigntoWho:'0',   // 0:班级 1:小组   2:个人
            SelectKeTangStatus:false,
            beginstr:'',
            endstr:'',

            className: '', //选择课堂
            keTangId:'',
            classNameList: [], //班级列表
            class: {}, //所选中的课堂对应的班级信息
            classFlag: false, //是否选中班级
            groupList: [], //小组列表
            groupSelected: [], //被选中的小组
            classOrGroupId:'',

            studentsList: [], //个人列表（接口返回的classList、学生信息由字符串拼接）
            studentsListTrans: [], //studentsList中拼接的学生信息挨个提取出
            studentSelected: [], //被选中的学生
           
        }
    }

    UNSAFE_componentWillMount(){
        this.setState({paperName:this.props.paperName,
                       paperId:this.props.paperId})
        }

    updateAssignToWho(who){
        if(who!=this.state.assigntoWho){
            this.setState({assigntoWho:who})
        }
        
    }
    setBeginDateTime(str){
        this.setState({beginstr:str,endstr:str})
    }
    setEndDateTime(str){
        this.setState({endstr:str})
    }

    //请求课堂列表
    fetchClassNameList = () => {
        const userId = global.constants.userName;
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getKeTangList.do";
        const params = {
            userName: userId,
        };
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                this.setState({ classNameList: resJson.data });
            })
    }

    showClassNameList = () => {
        const { classNameList } = this.state;
        const content = classNameList.map((item, index) => {
            return(
                <View style={{flexDirection: 'column',justifyContent:'center',alignItems:'center'}}>
                    <View key={index} 
                        style={this.state.className == item.keTangName ? styles.classNameViewSelected : styles.classNameView}
                    >
                        <Text style={styles.classNameText}
                            onPress={()=>{
                                if(this.state.className != item.keTangName){
                                    this.setState({ 
                                        className: item.keTangName ,
                                        keTangId:item.keTangId,
                                        class: item , 
                                        groupList: [] , 
                                        studentsList: [] ,
                                        studentsListTrans: [],
                                        groupSelected: [],
                                        studentSelected: [],
                                    })
                                }
                            }}
                        >
                            {item.keTangName}
                        </Text>
                    </View>
                    <View style={{height: 5}}></View>
                </View>
            );
        })
        return content;
    }

    //布置对象列表
    showAssignToWho = () => {
        const { assigntoWho } = this.state;
        const assignList = [];
        if(this.state.className == ''){
            return(
                <View style={{justifyContent:'center', alignItems: 'center'}}>
                    <Text style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10,}}>请先选择课堂</Text>
                </View>
            );
        }else{
            if(assigntoWho == '0'){ //班级
                return(
                    <View 
                        style={this.state.classFlag == false ?
                            {width: screenWidth*0.4,  height: 35, marginTop: 10, marginLeft: 20, backgroundColor: '#DCDCDC'}
                            : {width: screenWidth*0.4,  height: 35, marginTop: 10, marginLeft: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: 'red'}
                        }
                    >
                        <Text 
                            style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 5, textAlign: 'center'}}
                            onPress={()=>{
                                if(this.state.groupList.length <= 0 && this.state.studentsList.length <= 0){
                                    if(this.state.class != null){ //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                                    }     
                                }
                                this.splitStudents(); //分割获取到的学生信息
                                if(this.state.classFlag){
                                    this.setState({classFlag: false});
                                }else{
                                    this.setState({classFlag: true});
                                }
                            }}
                        >
                            {this.state.class.className.substring(0 , this.state.class.className.length - 1)}
                        </Text>
                    </View>
                );
            }else if(assigntoWho == '1'){ //小组
                if(this.state.groupList.length <= 0 && this.state.studentsList.length <= 0){
                    if(this.state.class != null){ //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                    }     
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                if(this.state.groupList.length > 0){
                    content = this.state.groupList.map((item , index)=>{
                        return(
                            <View style={{flexDirection: 'column',justifyContent:'center',alignItems:'center'}}>
                                <View key={index} 
                                    style={ this.IsInGroupSelected(item) ? styles.groupViewSelected : styles.groupView }
                                >
                                    <Text style={styles.groupItem}
                                        onPress={()=>{this.updateGroupSelected(item)}}
                                    >
                                        {item.value}
                                    </Text>
                                </View>
                                <View style={{height: 5}}></View>
                            </View>
                        )
                    })
                }
                return(
                    this.state.groupList.length > 0
                    ? content
                    : <View style={{justifyContent:'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10,}}>
                        您还没有创建小组，可以前往电脑端进行创建</Text>
                    </View>
                );
            }else{ //个人
                if(this.state.groupList.length <= 0 && this.state.studentsList.length <= 0){
                    // console.log('****class****',this.state.class.keTangId , this.state.class.keTangName);
                    if(this.state.class != null){ //已选择课堂且小组和个人信息都为空时请求一次小组和个人信息
                        // console.log('---this.state.class.keTangId-----' , this.state.class.keTangId);
                        this.fetchGroupAndStudentList(this.state.class.keTangId);
                    }     
                }
                this.splitStudents(); //分割获取到的学生信息

                let content;
                const { studentsListTrans } = this.state;     
                if(studentsListTrans.length > 0){
                    content = studentsListTrans.map((item , index)=>{
                        return(
                                <View key={index} 
                                    style={ this.IsInStudentSelected(item) ? {
                                            width: screenWidth * 0.3,
                                            height: 40,
                                            fontSize: 15,
                                            color: 'black',
                                            backgroundColor: '#fff',
                                            fontWeight: '300',
                                            margin: 3,
                                            borderWidth: 2,
                                            borderColor: 'red',
                                            textAlign: 'center',
                                        }
                                        : {
                                            width: screenWidth * 0.3,
                                            height: 40,
                                            fontSize: 15,
                                            color: 'black',
                                            backgroundColor: '#DCDCDC',
                                            fontWeight: '300',
                                            margin: 3,
                                            borderWidth: 2,
                                            borderColor: '#fff',
                                            textAlign: 'center',
                                        }
                                    }
                                >
                                    <Text style={styles.classNameText}
                                        onPress={()=>{this.updateStudentSelected(item)}}
                                    >
                                        {item.name}
                                    </Text>
                                </View>
                                // <View style={{height: 5}}></View>
                        )
                    })
                }
                return(
                    studentsListTrans.length > 0
                    ? <View style={{
                                flexDirection: 'row',
                                flexWrap: 'wrap',  //自动换行
                                backgroundColor: '#fff',
                                left: screenWidth * 0.025,
                                marginBottom: 10,
                            }}
                    >
                        {content}
                    </View>
                    : <View style={{justifyContent:'center', alignItems: 'center'}}>
                        <Text style={{fontSize: 16, color: 'black', fontWeight: '400', paddingTop: 10,}}>
                            当前班级没有学生信息</Text>
                    </View>
                );
            }
        }
    }

    //请求小组以及学生信息
    fetchGroupAndStudentList = (classId) => {
        const ip = global.constants.baseUrl;
        const url = ip + "teacherApp_getClassStudentList.do";
        const params = {
            keTangId: classId,
        };
        http.get(url, params)
            .then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('测试',resJson)
                this.setState({ groupList: resJson.data.groupList , studentsList: resJson.data.classList });
            })
    }

     //查看小组是否在已选择的小组列表中
     IsInGroupSelected = (groupItem) => {
        const { groupSelected } = this.state;
        for(let i = 0 ; i < groupSelected.length ; i++){
            if(groupSelected[i].id == groupItem.id){
                return true;
            }
        }
        return false;
    }

    //更新已选择的小组列表
    updateGroupSelected = (groupItem) => {
        const { groupSelected } = this.state;
        let groups = [];
        let flag = this.IsInGroupSelected(groupItem);
        if(flag == true){ //在则删除
            for(let i = 0 ; i < groupSelected.length ; i++){
                if(groupSelected[i].id != groupItem.id){
                    groups.push(groupSelected[i]);
                }
            }
            this.setState({ groupSelected: groups });
        }else{ //不在则添加
            groups = groupSelected;
            groups.push(groupItem);
            this.setState({ groupSelected: groups });
        }
    }

    //查看学生是否在已选择的学生列表中
    IsInStudentSelected = (studentItem) => {
        const { studentSelected } = this.state;
        for(let i = 0 ; i < studentSelected.length ; i++){
            if(studentSelected[i].id == studentItem.id){
                return true;
            }
        }
        return false;
    }

    //更新已选择的学生列表
    updateStudentSelected = (studentItem) => {
        const { studentSelected } = this.state;
        let students = [];
        let flag = this.IsInStudentSelected(studentItem);
        if(flag == true){ //在则删除
            for(let i = 0 ; i < studentSelected.length ; i++){
                if(studentSelected[i].id != studentItem.id){
                    students.push(studentSelected[i]);
                }
            }
            this.setState({ studentSelected: students });
        }else{ //不在则添加
            students = studentSelected;
            students.push(studentItem);
            this.setState({ studentSelected: students });
        }
    }

    //分割获取到的学生信息字符串
    splitStudents = () => {
        const { studentsList , studentsListTrans } = this.state;
        if(studentsList.length > 0 && studentsListTrans.length <= 0){
            let studentsNameList = [];
            let studentsIdList = [];
            let students = [];
            for(let i = 0 ; i < studentsList.length ; i++){
                let names = studentsList[i].name.split(','); //姓名分割
                names.map((item , index)=>{
                    studentsNameList.push(item);
                });
                let Ids = studentsList[i].ids.split(','); //id分割
                Ids.map((item , index)=>{
                    studentsIdList.push(item);
                });
            }
            for(let i = 0 ; i < studentsNameList.length ; i++){ //组装分割的姓名+id
                students.push({
                    id: studentsIdList[i],
                    name: studentsNameList[i],
                })
            }
            this.setState({ studentsListTrans: students });
        }
    }

    //布置页面点击布置
    SaveAssign(){
        if(this.state.beginstr==''){
            Toast.showDangerToast('请设置开始时间')
        }else if(this.state.endstr==''){
            Toast.showDangerToast('请设置结束时间')
        }else{
            //拼接提交保存的参数
            var stuIds ='';
            var stuNames ='';
            var learnType ='';
            var classIdOrGroupId = '';
            var classOrGroupName = '';
            if(this.state.assigntoWho=='0'){
                console.log('assigntowho 0',this.state.studentsList)
                learnType = '70'
                stuIds = this.state.studentsList[0].ids
                stuNames = this.state.studentsList[0].name
            }else if(this.state.assigntoWho=='1'){
                learnType = '50'
                for(let i=0;i<this.state.groupSelected.length;i++){
                    classIdOrGroupId = classIdOrGroupId+ ','+ this.state.groupSelected[i].id
                    classOrGroupName = classOrGroupName+ ','+  this.state.groupSelected[i].value
                    stuIds =stuIds +','+this.state.groupSelected[i].ids
                    stuNames =stuNames +','+this.state.groupSelected[i].name
                }
                if(this.state.groupSelected.length>0){
                    stuIds=  stuIds.substring(1)
                    stuNames =stuNames.substring(1)
                    classIdOrGroupId=classIdOrGroupId.substring(1)
                    classOrGroupName = classOrGroupName.substring(1)
                }
            }else if(this.state.assigntoWho=='2'){
                learnType = '70'
                for(let i=0;i<this.state.studentSelected.length;i++){
                    stuIds =stuIds +','+this.state.studentSelected[i].id
                    stuNames =stuNames +','+this.state.studentSelected[i].name
                }
                if(this.state.studentSelected.length>0){
                    stuIds=  stuIds.substring(1)
                    stuNames =stuNames.substring(1)
                }
                
            }
            const url =
                "http://" +
                "www.cn901.net" +
                ":8111" +
                "/AppServer/ajax/teacherApp_phoneBuzhiZY.do";
            const params = {
                paperId:this.state.paperId,		//试卷id
                paperName:this.state.paperName,	        //含中文，前端加码	试卷name
                userName:global.constants.userName,		//教师登录名
                startTime:this.state.beginstr,		    //开始时间
                endTime	:this.state.endstr,	            //结束时间
                keTangId:this.state.keTangId,	        //课堂id
                classOrGroupId:classIdOrGroupId,	    //班级或小组id
                stuIds:stuIds,	                    //学生id串
                stuNames:stuNames,               //含中文，前端加码	学生姓名串
                learnType:learnType,		        //作业布置方式：班级70/小组50/个人70
                keTangName:this.state.className,           //含中文，前端加码	课堂名
                classOrGroupName:classOrGroupName,	    //含中文，前端加码	班级或小组名  
                };
            http.get(url, params).then((resStr) => {
                let resJson = JSON.parse(resStr);
                console.log('布置页面保存：',resJson)
                if(resJson.success){
                    //跳转首页
                }
            })
        }

    
    }

  render() {
    return (
    <View style={{borderTopWidth:1,backgroundColor:'#FFFFFF'}}>
      
      <ScrollView style={{height:'93%',}}>
        <View style={{flexDirection:'row',paddingLeft:20,alignItems:'center',borderBottomWidth:0.5}}>
                <Text style={{fontSize:15,marginRight:40}}>作业名称:</Text>
                <TextInput value={this.state.paperName} placeholder='传过来的值'></TextInput>
        </View>
        
        <View style={{flexDirection:'row',padding:15,paddingLeft:20,alignItems:'center',borderBottomWidth:0.5}}>
            <Text style={{fontSize:15,marginRight:40}}>开始时间:</Text>
            <Text style={{fontSize:15,}}>{this.state.beginstr}</Text>
            <TouchableOpacity style={{position:'absolute',right:20,flexDirection:'row'}} >
                <DateTime style={{position:'absolute',right:20,flexDirection:'row'}}  setDateTime={this.setBeginDateTime} selectedDateTime={this.state.beginstr}/>
            </TouchableOpacity>
        </View>

        <View style={{flexDirection:'row',padding:15,paddingLeft:20,alignItems:'center',borderBottomWidth:0.5}}> 
            <Text style={{fontSize:15,marginRight:40}}>结束时间:</Text>
            <Text style={{fontSize:15}}>{this.state.endstr}</Text>
            <TouchableOpacity style={{position:'absolute',right:20,flexDirection:'row'}} >
                <DateTime setDateTime={this.setEndDateTime} selectedDateTime={this.state.endstr}/>
            </TouchableOpacity>
            
        </View>

        <View style={{borderBottomWidth:1,padding:15,paddingLeft:20}}>
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{fontSize:15,marginRight:40}}>选择课堂:</Text>
                    <Text style={{fontSize:15,marginRight:20}}>{this.state.className}</Text>
                    <TouchableOpacity onPress={()=>{this.setState({SelectKeTangStatus:!this.state.SelectKeTangStatus})}} style={{position:'absolute',right:10}}>
                        <Image style={{width:20,height:20}} source={this.state.SelectKeTangStatus?require('../../../assets/image3/top.png'):require('../../../assets/image3/bot.png')}></Image>
                    </TouchableOpacity>
                </View>
            
            {this.state.SelectKeTangStatus?
                        (<View style={{marginTop:20}}>
                            {
                                this.state.classNameList.length <= 0
                                    ? this.fetchClassNameList()
                                    : null
                            }
                            {
                                this.state.classNameList.length > 0
                                    ? this.showClassNameList()
                                    : <Text>课堂列表未获取到或者为空</Text>
                            }
                        </View>
                        ):(<View></View>)}
        </View>

        <View style={{flexDirection:'row',height:60,alignItems:'center'}}>
            <Text style={{fontSize:15,marginRight:40,marginLeft:30}}>布置给</Text>
            <Button onPress={()=>{this.updateAssignToWho('0');this.setState({SelectKeTangStatus:false})}} style={{marginRight:20}} appearance={this.state.assigntoWho=='0'?'filled':'ghost'}>班级</Button>
            <Button onPress={()=>{this.updateAssignToWho('1');this.setState({SelectKeTangStatus:false})}} style={{marginRight:20}} appearance={this.state.assigntoWho=='1'?'filled':'ghost'}>小组</Button>
            <Button onPress={()=>{this.updateAssignToWho('2');this.setState({SelectKeTangStatus:false})}} appearance={this.state.assigntoWho=='2'?'filled':'ghost'}>个人</Button>
            
        </View>

        <ScrollView>
            <View style={{alignItems:'center',marginTop:15}}>
                {this.showAssignToWho()}
            </View>
                
        </ScrollView>
      </ScrollView>

      {/* 按钮区域 */}
      <View style={{flexDirection:'row',justifyContent:'space-around'}}>
            <Button onPress={()=>{
                            this.setState({
                                beginstr: '',
                                endstr: '',
                                className: '', //选择课堂
                                SelectKeTangStatus: false, //是否显示课堂列表
                                beginstr:'',
                                endstr:'',
                                assigntoWho: '0', //布置作业对象 0:班级 1：小组 2:个人
                                class: {}, //所选中的课堂对应的班级信息
                                classFlag: false, //是否选中班级
                                groupSelected: [], //被选中的小组
                                // studentsList: [], //个人列表（接口返回的classList、学生信息由字符串拼接）
                                //studentsListTrans: [], //studentsList中拼接的学生信息挨个提取出
                                studentSelected: [], //被选中的学生
                                keTangId:'',
                                classOrGroupId:'',
                                // studentsListTrans: [], //studentsList中拼接的学生信息挨个提取出
                            })
                        }}
             style={{width:'40%'}} >重置</Button>
            <Button onPress={()=>{
                this.SaveAssign()
                this.props.navigation.navigate({
                    name:'Teacher_Home'

                })
                }} style={{width:'40%'}}>确定</Button>
      </View>
    </View>
    )
  }
}

const styles = StyleSheet.create({
classNameView: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#DCDCDC',
        borderWidth: 2,
        borderColor: '#fff',
    },
    classNameViewSelected: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#fff',
        borderWidth: 2,
        borderColor: 'red',
    },classNameText: {
        fontSize: 15,
        color: 'black',
        fontWeight: '300',
        paddingTop: 8,
        textAlign: 'center',
    }, groupView: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#DCDCDC',
        marginTop:3,
        borderWidth: 2,
        borderColor: '#fff',
    },
    groupViewSelected: {
        width: screenWidth * 0.5,
        height: 40,
        backgroundColor: '#fff',
        marginTop:3,
        borderWidth: 2,
        borderColor: 'red',
    },
    groupItem: {
        fontSize: 15,
        color: 'black',
        fontWeight: '300',
        paddingTop: 8,
        textAlign: 'center',
    },

})