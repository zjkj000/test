import { Text, View,StyleSheet,Image,Button,TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { useNavigation } from "@react-navigation/native";

export default function Select_Subject_Details_Contont(props) {
    const navigation = useNavigation();
    const source =props.source
    
  return (<Select_Subject_Details navigation={navigation} source={source}/>)
}


class Select_Subject_Details extends Component{
    constructor(props){
      super(props)
      this.state={
        taskName:'',
        type:'',                              //类型：1正式选，2模拟选
        mode:'',                              //模式：1、3+1+2；2、六选三；3、七选三
        startTimeStr: '',
        endTimeStr: '',
        subjectComposeName:'',    //"未选科", 设置 默认初始为未选科
        subjectComposeNameOne: '',
        subjectComposeNameTwo: '',
        subjectComposeNameThree: '',
        status: "" ,                            //状态：1未发布；2已发布3已暂停4已截止（根据状态显示左上角图标，且不允许进行选科操作
        taskId: "",
      }
    }
  
    UNSAFE_componentWillMount(){
      this.setState({...this.props.source})
    }
  
    render() {
      return (
        <View style={styles.contoiner}>
          {this.state.status=='1'?<Image style={{position:'absolute'}} source={require('../../assets/image3/s.png')}/>
          :this.state.status=='2'?<Image style={{position:'absolute'}} source={require('../../assets/image3/ing.png')}/>
          :this.state.status=='3'?<Image style={{position:'absolute'}} source={require('../../assets/image3/stop.png')}/>
          :<Image style={{position:'absolute'}} source={require('../../assets/image3/ed.png')}/>}
  
          <Text style={{color:'#59B9E0',fontSize:25,marginRight:10}}>{this.state.taskName}</Text>
          <View style={{flexDirection:'row',marginBottom:10,marginTop:10}}>
              <Text style={{backgroundColor:'#FFEA91',padding:5,color:'#99660d'}}>{this.state.type=='1'?'正式选':'模拟选'}</Text>
              <Text style={{backgroundColor:'#EBF2FC',padding:5,marginLeft:5,color:'#7D97E2'}}>
                {this.state.type=='1'?'3+1+2':this.state.type=='2'?'六选三':'七选三'}</Text>
          </View>
          <View style={{flexDirection:'row',flexWrap:'wrap'}}>
            <Text>时间:  </Text>
            <Text>{this.state.startTimeStr}</Text>
            <Text>至</Text>
            <Text>{this.state.endTimeStr}</Text>
          </View>
            
          {this.state.status=='2'&&this.state.subjectComposeName=='未选科'?(
            //状态为2  未选择的时候  只让去选科
            <TouchableOpacity style={{position:'absolute',right:5}}
                onPress={()=>{this.props.navigation.navigate(
                                {
                                  name:"Selectsubject_Info",
                                  params:{
                                        taskId:this.state.taskId
                                          }
                                })
                              }
                        }>
              <Text style={{fontSize:18,color:'#E97252'}}>去选科》</Text>
            </TouchableOpacity>
          ):this.state.status=='2'&&this.state.subjectComposeName!='未选科'?(
            //状态为2  且已经有了选择  展示选择  +  去选科
            <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-end'}}>
              <Text style={{marginRight:5}}>已选组合:</Text>
              <Text style={{color:'#F06F8B',fontSize:18,marginRight:3,marginLeft:3}}>{this.state.subjectComposeNameOne}</Text>
              <Text>+</Text>
              <Text style={{color:'#34BD55',fontSize:18,marginRight:3,marginLeft:3}}>{this.state.subjectComposeNameTwo}</Text>
              <Text>+</Text>
              <Text style={{color:'#B9AD37',fontSize:18,marginRight:3,marginLeft:3}}>{this.state.subjectComposeNameThree}</Text>
              <TouchableOpacity style={{position:'absolute',right:5}}
                   onPress={()=>{this.props.navigation.navigate(
                                  {
                                    name:"Selectsubject_Info",
                                    params:{
                                          taskId:this.state.taskId
                                            }
                                  })
                                }
                           }>
                  <Text style={{fontSize:15,color:'#E97252'}}>去选科》</Text>
              </TouchableOpacity>
            </View>
          ):this.state.subjectComposeName!='未选科'?(
            //状态为 3 or 4  ，已选择   展示选择的科目
            <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-end'}}>
              <Text style={{marginRight:5}}>已选组合:</Text>
              <Text style={{color:'#F06F8B',fontSize:18,marginRight:3,marginLeft:3}}>{this.state.subjectComposeNameOne}</Text>
              <Text>+</Text>
              <Text style={{color:'#34BD55',fontSize:18,marginRight:3,marginLeft:3}}>{this.state.subjectComposeNameTwo}</Text>
              <Text>+</Text>
              <Text style={{color:'#B9AD37',fontSize:18,marginRight:3,marginLeft:3}}>{this.state.subjectComposeNameThree}</Text>
            </View>
          ):(
            //其余情况都是 未选择
            <View style={{flexDirection:'row',marginTop:10,alignItems:'flex-end'}}>
              <Text style={{marginRight:5}}>已选组合:未选择</Text>
            </View>
          )}
  
        </View>
      )
    }
  }
  const styles = StyleSheet.create({
    contoiner:{paddingTop:50,paddingLeft:35,paddingBottom:20,margin:20,borderWidth:2,borderColor:'#708090',height:250,backgroundColor:'#FFFFFF'},
    
})