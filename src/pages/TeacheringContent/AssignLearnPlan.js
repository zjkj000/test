import { Text, View,Image,ScrollView,TouchableOpacity,TextInput,StyleSheet, Alert} from 'react-native'
import React, { Component } from 'react'
import { screenWidth, screenHeight } from "../../utils/Screen/GetSize";
import { Button } from '@ui-kitten/components';

import { useNavigation } from "@react-navigation/native";
import BasePicker from '../../utils/datetimePickerUtils/BasePicker';
import DateTime from '../../utils/datetimePickerUtils/DateTime';
import http from '../../utils/http/request';
import Toast from '../../utils/Toast/Toast';
import { WaitLoading,Waiting } from '../../utils/WaitLoading/WaitLoading';
export default function AssignLearnPlanContainer(props) {
    const navigation = useNavigation();
    // navigation.setOptions({title:'布置作业'});
    // console.log('================AssignPicturesWorkContainer=======================');
    // console.log(props.route.params);
    // console.log('==================================================================');
    return <AssignLearnPlan navigation={navigation} paramsData={props.route.params} />;
}

class AssignLearnPlan extends Component {
    constructor(props){
        super(props)
        this.setBeginDateTime=this.setBeginDateTime.bind(this)
        this.setEndDateTime=this.setEndDateTime.bind(this)
        this.state={
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

            selectPaperNum: 0,
            selectPaperList: [],
            baseTypeIdLists: [],

        }
    }

    UNSAFE_componentWillMount(){
        var _dateStr=new Date().toISOString().substring(0,10)+' '+new Date().toISOString().substring(11,16)
        _dateStr = _dateStr.substring(0,11)+(parseInt(_dateStr.substring(12,13))+8)+_dateStr.substring(13,16)
        this.setState({
            beginstr:_dateStr,
            endstr:this.nextDay(_dateStr.substring(0,10))
        })
    }

  
    updateAssignToWho(who){
        if(who!=this.state.assigntoWho){
            this.setState({assigntoWho:who})
        }
        
    }
    setBeginDateTime(str){
        this.setState({beginstr:str,
            endstr:this.nextDay(str.substring(0,10))})
    }
    nextDay(str){
        var year = parseInt(str.substring(0,4))
        var month = parseInt(str.substring(5,7))
        var day = parseInt(str.substring(8,10))
        if(month==2&&day==28&&year%100==0&&yaer%400!=0){
           month=3
           day=1
        }else if(month==2&&day==28&&day%4!=0){
          month=3
          day=1
        }else if(month==2&&day<28){
          day+=1
        }else if(day=='30'&&(month=='2'||month=='4'||month=='6'||month=='9'||month=='11')){
          month+=1
          day=1
        }else if(day=='31'){
          day = 1
          if(month<12){
            month=month+1
          }else{
            month=1
            year+=1
          }
        }else{
          day+=1
        }
        return year+'-'+ month.toString().padStart(2,'0')+'-'+day.toString().padStart(2,'0')+' 23:59'
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

    //布置试卷 设置接口参数
    setPushPapersParams = () => {
        const { assigntoWho ,  groupSelected , studentSelected , studentsList } = this.state;
        const classSecleted = this.state.class;
        var keTangId = classSecleted.keTangId; //课堂id
        var keTangName = classSecleted.keTangName; //课堂名
        var classIdOrGroupId = classSecleted.classId;  //班级id
        var classOrGroupName = classSecleted.className; //班级名(接口返回的班级名后面自带一个逗号,)
        var learnType = ''; //作业布置方式 班级、个人50、小组70

        var stuIds = '';
        var stuNames = '';

        var startTime = this.state.beginstr;
        var endTime = this.state.endstr;

        if(assigntoWho == '0'){ //布置给班级 （有对应的学生信息需要拼装吗，接口传空值？）
            learnType = '50';
            stuIds = studentsList[0].ids;
            stuNames = studentsList[0].name;
            // console.log('**********studentsList******',stuIds);
            // console.log('**********studentsList.length******',studentsList.length);
            // return;
        }else if(assigntoWho == '1'){ //布置给小组 拼装小组id、小组名 学生id、学生姓名
            learnType = '70';
            classIdOrGroupId = '';
            classOrGroupName = '';

            for(let i = 0 ; i < groupSelected.length ; i++){
                classIdOrGroupId = classIdOrGroupId + ';' + groupSelected[i].id;
                classOrGroupName = classOrGroupName + ';' + groupSelected[i].value;
                
                stuIds = stuIds + ',' + groupSelected[i].ids;
                stuNames = stuNames + ',' + groupSelected[i].name;
            }
        }else{ //布置给个人
            learnType = '50';
            
            for(let i = 0 ; i < studentSelected.length ; i++){
                stuIds = stuIds + ',' + studentSelected[i].id;
                stuNames = stuNames + ',' + studentSelected[i].name;
            }
        }
        return(
            {
                startTime: startTime,
                endTime: endTime,
                keTangId: keTangId,
                classIds: classIdOrGroupId,
                stuIds: stuIds,
                stuNames: stuNames,
                roomType: learnType,
                keTangName: keTangName,
                className: classOrGroupName,
            }
        );
    }



    //布置页面点击布置
    SaveAssign(){
        if(this.state.beginstr==''){
            Toast.showDangerToast('请设置开始时间')
            Alert.alert('','请设置开始时间', [{} ,{text: '关闭', onPress: ()=>{}}]);
        }else if(this.state.endstr==''){
            Toast.showDangerToast('请设置结束时间')
            Alert.alert('','请设置结束时间', [{} ,{text: '关闭', onPress: ()=>{}}]);
        }else if(this.state.assigntoWho=='0'&&this.state.studentsList.length==0){
            Toast.showDangerToast('请先选择布置对象')
            Alert.alert('','请先选择布置对象', [{} ,{text: '关闭', onPress: ()=>{}}]);
        }else if(this.state.assigntoWho=='1'&&this.state.groupSelected.length==0){
            Toast.showDangerToast('请先选择布置对象')
            Alert.alert('','请先选择布置对象', [{} ,{text: '关闭', onPress: ()=>{}}]);
        }else if(this.state.assigntoWho=='2'&&this.state.studentSelected.length==0){
            Toast.showDangerToast('请先选择布置对象')
            Alert.alert('','请先选择布置对象', [{} ,{text: '关闭', onPress: ()=>{}}]);
        }else{
            WaitLoading.show('布置中...',-1)
            
            var pushParamsObj = this.setPushPapersParams();    
            var allParams = {
                ...pushParamsObj,
                token: global.constants.token,
                assignType: 2, //只布置，不保存
                jsonStr: '',
                userName: global.constants.userName,
                learnPlanName: this.props.paramsData.learnPlanName,
                learnPlanId: this.props.paramsData.learnPlanId,
                type: this.props.paramsData.pushType == 'learnPlan' ? 1 : 2,
                flag: 'save',
            }
            const ip = global.constants.baseUrl;
            const url = ip + "teacherApp_releaseLearnPlan.do";
            const params = {
                ...allParams,
                //callback:'ha',
            };
            console.log('-----pushAndSavePaper-----', Date.parse(new Date()))
            http.get(url, params)
                .then((resStr) => {
                    let resJson = JSON.parse(resStr);

                    console.log('****************resJson.success*********', resJson);
                    if(resJson.success){
                        Alert.alert('','布置成功！',[{},
                            {text:'关闭',onPress:()=>{
                                WaitLoading.dismiss()
                                this.props.navigation.navigate({
                                    name: "Teacher_Home",
                                    params: {
                                        screen: "最新",
                                        params: {
                                            isRefresh: true, 
                                        },
                                    },
                                    merge: true,
                                });
                            }}
                        ])   
                    }else{
                        WaitLoading.show_false()
                        Alert.alert('',resJson.message, [{} , {text: '关闭', onPress: ()=>{  }}]);
                        Toast.showDangerToast('布置失败！',1000)
                    }
                })
        }
    }

    render() {
        return (
        <View style={{borderTopWidth:1,backgroundColor:'#FFFFFF'}}>
        
        <ScrollView style={{height:'93%',}}>
            <Waiting/>
            <View style={{flexDirection:'row',paddingLeft:20,alignItems:'center',borderBottomWidth:0.5}}>
                    <Text style={{fontSize:15,marginRight:40}}>作业名称:</Text>
                    <TextInput value={this.props.paramsData.learnPlanName} placeholder='传过来的值'></TextInput>
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
                            <Image style={{width:20,height:20}} source={this.state.SelectKeTangStatus?require('../../assets/image3/top.png'):require('../../assets/image3/bot.png')}></Image>
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