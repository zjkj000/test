import { Text, View,Image,ScrollView, FlatList, TouchableOpacity,Alert } from 'react-native'
import React, { Component,useEffect, useState } from 'react'
import { useNavigation } from "@react-navigation/native";
import { OverflowMenu, MenuItem } from "@ui-kitten/components";
import { SearchBar } from "@ant-design/react-native";
import http from '../../utils/http/request'
import Toast from '../../utils/Toast/Toast';
let SearchText = '';
let currentPage= 1;
export default function LiveingLessonInfo() {
    const navigation = useNavigation();
    const [data,setdata] = useState([])
    const [type,settype] =useState('All')
    const [moduleVisible,setmoduleVisible]=useState(false)
    const [isRefresh,setisRefresh] = useState(false)
    const [showFoot,setshowFoot]=useState('0')   //0代表还可以加载  1代表没数据了
    useEffect(()=>{
        fetchData('All',1)
      },[])

    function fetchData(newtype,newcurrentPage,isRefreshing=false){
        const url =
            "http://" +
            "www.cn901.net" +
            ":8111" +
            "/AppServer/ajax/studentApp_getZBLiveList.do";
        const params = {
                type:newtype,   //   默认全部   1直播中  2 未开始  3 已结束
                searchStr:SearchText,
                currentPage:newcurrentPage,  //当前页 初始 1
                userId: global.constants.userName
          };

        http.get(url, params).then((resStr) => {
            let resJson = JSON.parse(resStr);
            if(resJson.success){
                if(newcurrentPage==1){
                    setshowFoot('0')  //第一页还可以请求
                    setdata(resJson.data)
                }else{
                    setdata(data.concat(resJson.data))
                }
                if(resJson.data.length<30){
                    setshowFoot('1')   //数据<30  就代表没有了
                }
            }
            if(isRefreshing){
                Toast.showSuccessToast('刷新成功',500)
                setisRefresh(false)}
            
        })
    }

    function renderAvatar(){
        return (
            <TouchableOpacity onPress={() => setmoduleVisible(true)}>
                <Text style={{fontSize:15,color:'#87CEFA'}}>{type=='2'?"未开始":type=='1'?'直播中':type=='3'?"已结束":'全部'}</Text>
                <Text style={{position:'absolute',right:5}}>▼</Text>
            </TouchableOpacity>
        );
    };
    function _renderItemView(dataItem){
            return (<LiveingLessonContent navigation={navigation} source={dataItem} />)
      }

    function _onRefresh(){
        currentPage=1
        setisRefresh(true)
        fetchData(type,1,true);
      }
    function _onEndReached(){
        //如果是正在加载中或没有更多数据了，则返回
        if (showFoot== 0){
            fetchData(type,currentPage+1)
            currentPage= currentPage+1  //如果还有 页码要+1
        }
    }
    function _renderFooter(){
        if (showFoot == '1') {
            return (
                <View>
                    <View
                        style={{
                            height: 30,
                            alignItems: "center",
                            justifyContent: "flex-start",
                        }}
                    >
                        <Text
                            style={{
                                color: "#999999",
                                fontSize: 14,
                                marginTop: 5,
                                marginBottom: 5,
                            }}
                        >
                            没有更多数据了
                        </Text>
                    </View>
                </View>
            );
        } else{
            return (
                <View style={{height: 24,justifyContent: "center",alignItems: "center",marginBottom: 10}}>
                    <Text>正在加载更多数据...</Text>
                </View>
            );
        } 
    }

  return (
    <View style={{padding:10,paddingBottom:0}}>
        {/* 筛选框    搜索框 */}
        <View style={{flexDirection:'row',margin:10}}>
            <View style={{width:80,height:40,padding:10,paddingRight:0,backgroundColor:'#fff',marginTop:2}}>
                <OverflowMenu
                            style={{borderColor:'#000',borderWidth:0.8,width:80}}
                            anchor={renderAvatar}
                            visible={moduleVisible}
                            onBackdropPress={() => {
                                setmoduleVisible(false)
                            }}
                        >
                        <MenuItem
                                title={'全部'}
                                key={0}
                                onPress={() => {
                                    setdata([])
                                    setmoduleVisible(false)
                                    settype('All')
                                    currentPage=1;
                                    fetchData('All',1)
                                }}
                            />
                            <MenuItem
                                title={'直播中'}
                                key={1}
                                onPress={() => {
                                    setdata([])
                                    setmoduleVisible(false)
                                    settype('1')
                                    currentPage=1;
                                    fetchData('1',1)
                                }}
                            />
                            <MenuItem
                                title={'未开始'}
                                key={2}
                                onPress={() => {
                                    setdata([])
                                    setmoduleVisible(false)
                                    settype('2')
                                    currentPage=1;
                                    fetchData('2',1)
                                }}
                            />
                            <MenuItem
                                title={'已结束'}
                                key={3}
                                onPress={() => {
                                    setdata([])
                                    setmoduleVisible(false)
                                    settype('3')
                                    currentPage=1;
                                    fetchData('3',1)
                                }}
                            />
                </OverflowMenu>
            </View>
            <View style={{width:'80%'}}>
                <SearchBar
                                    style={{height:40}}
                                    value={{SearchText}}
                                    placeholder="请输入课程名称，教师姓名或课堂号搜索"
                                    // ref={(ref) => (setSearchText(ref))}
                                    onCancel={()=>
                                        {
                                        setdata([])
                                        fetchData(type,1)
                                        }
                                    }
                                    onChange={(value)=>{SearchText=value}}
                                    onBlur={()=>
                                        {
                                        setdata([])
                                        fetchData(type,1)
                                        }
                                    }
                                    cancelText="搜索"
                                    //showCancelButton
                                />
            </View>
           
        </View>
        {/* <ScrollView> */}
            <FlatList
                        style={{marginBottom:70}}
                        showsVerticalScrollIndicator={false}
                        //定义数据显示效果
                        data={data}
                        renderItem={_renderItemView.bind(this)}
                        //下拉刷新相关
                        onRefresh={() => _onRefresh()}
                        refreshing={isRefresh}
                        ListFooterComponent={_renderFooter.bind(this)}
                        onEndReached={_onEndReached.bind(this)}
                        onEndReachedThreshold={0.5}
                    />
       
        {/* </ScrollView> */}
    </View>
  )
}

class LiveingLessonContent extends Component {
    constructor(props){
        super(props)
        this.state={
            time1:'',
            time2:'',
            teacherName:'',
            subject:'',
            title:'',
            status:''     //   1  直播中   2 未开始  3已结束
        }
    }

    UNSAFE_componentWillMount(){
        // console.log('this',this.props.source)
        this.setState({...this.props.source.item})
    }

  render() {
    return (
      <View style={{margin:2,flexDirection:'row',padding:8,backgroundColor:'#fff',marginBottom:10}}>
        {/* 第一列 学科图标 */}
        <View style={{marginRight:5,marginTop:20}}>
            {/* <Text>{this.state.subject}</Text> */}
            {   this.state.subject.indexOf('语文')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/yuwen.png')}/>):
                this.state.subject.indexOf('数学')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/shuxue.png')}/>):
                this.state.subject.indexOf('英语')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/yingyu.png')}/>):
                this.state.subject.indexOf('物理')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/wuli.png')}/>):
                this.state.subject.indexOf('化学')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/huaxue.png')}/>):
                this.state.subject.indexOf('政治')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/zhengzhi.png')}/>):
                this.state.subject.indexOf('历史')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/lishi.png')}/>):
                this.state.subject.indexOf('地理')>0?(<Image style={{width:50,height:50}} source={require('../../assets/errorQue/dili.png')}/>):
                (<Image style={{width:50,height:50}} source={require('../../assets/errorQue/yuwen.png')}/>)}
        </View>

        {/* 第二列  名称 时间 信息 */}
        <View style={{flexDirection:'column',width:'90%'}}>
            {/* 第一行  title + 图表 */}
            <View>
                <Text style={{fontSize:18,fontWeight:'600'}}>{this.state.title}</Text>
                {this.state.status=='1'?(<View style={{position:'absolute',right:25,backgroundColor:'#FF897B',padding:5}}><Text style={{color:'#fff'}}>直播中</Text></View>):
                 this.state.status=='2'?(<View style={{position:'absolute',right:25,backgroundColor:'#7E9CFE',padding:5}}><Text style={{color:'#fff'}}>未开始</Text></View>):
                 this.state.status=='3'?(<View style={{position:'absolute',right:25,backgroundColor:'#949599',padding:5}}><Text style={{color:'#fff'}}>已结束</Text></View>):
                (<></>)
                }
            </View>

            {/* 第二行 学科 + 教师 */}
            <View style={{flexDirection:'row',marginTop:10}}>
                <Image style={{width:17,height:17,marginRight:3}} source={require('../../assets/StatisticalForm/clander.png')}/>
                <Text style={{marginRight:5}}>{this.state.time1}</Text>
                <Image style={{width:17,height:17,marginRight:3}} source={require('../../assets/StatisticalForm/clock.png')}/>
                <Text>{this.state.time2}</Text>
                
            </View>

            {/* 第三行  时间 +进入课堂 */}
            <View style={{flexDirection:'row',marginTop:10}}>
                <Text>学科: </Text>
                <Text>{this.state.subject}</Text>
                <Text style={{marginLeft:10}}>教师: </Text>
                <Text>{this.state.teacherName}</Text>
                {this.state.status=='1'?(
                    <TouchableOpacity style={{position:"absolute",right:25}} onPress={
                        ()=>{
                            Alert.alert('进入直播间')
                        }
                        }>
                         <Text style={{color:'#77A5BD'}}>进入课堂{'>>'}</Text>
                    </TouchableOpacity>
                ):
                 this.state.status=='2'?(
                        <Text style={{position:"absolute",right:25}}>进入课堂{'>>'}</Text>
                 ):
                 (<></>)}
            </View>
        </View>

      </View>
    )
  }
}