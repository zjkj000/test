import { Text, View,StyleSheet,TouchableOpacity } from 'react-native'
import React, { Component } from 'react'
import { Button } from '@ui-kitten/components';

var SelectedRefs = {};
export default class SelectScore extends Component {
  constructor(props){
    super(props)
    this.state={
      scoreList:[0,1,2,3,4,5,6,7,8,9,10],
      selectedScore:''
    }
  }
  UNSAFE_componentWillMount(){
    this.setState({
      scoreList:this.props.scoreList?this.props.scoreList:[0,1,2,3,4,5,6,7,8,9,10],
      selectedScore:this.props.selectedScore?this.props.selectedScore:''
  })
}
  

  selectItem(score){
    SelectedRefs[parseInt(this.state.selectedScore)].style=styles.viewstyle
    for (var key in SelectedRefs){
      var refitem = SelectedRefs[key];
      if(refitem.key==score){
          refitem.style=styles.selectedviewstyle
      }
  }
    this.setState({selectedScore:score})
    this.props.getscore(score)
  }

  CorrretScore(value){
    console.log('zuixin',value)
      this.setState({selectedScore:value})
  }
  
  makeScoreList(list){
    var Scorelist=[]
    list.map((item,index)=>{
      let value = item
      Scorelist.push(
        <View style={{margin:5}}>
              <Button style={styles.Button_style}
                      appearance={((this.state.selectedScore!=''||this.state.selectedScore=='0')&&this.state.selectedScore==item)?'filled':'outline'}
                              onPress={()=>{
                                console.log('最新的',this.state.selectedScore,this.state.selectedScore==item)
                                this.setState({selectedScore:value})
                                this.props.getscore(value)
                              }}>{item=='0'?'0':item}</Button>
              
        </View>)
    })
    return Scorelist;
  }

  render() { 
    const scoreList = this.state.scoreList
    return (
        <View style={{flexDirection:'row',flexWrap:'wrap',width:'100%'}}>
          {this.makeScoreList(scoreList)}
        </View>
      )
  }
}


const styles = StyleSheet.create({

    Button_style:{
      width:60,height:45,
    },
    text:{
      position:'absolute',
      marginLeft:8,
      marginTop:2,
      fontSize:22,
      color:'#62C3E4'
    },
    text_2:{
      position:'absolute',
      marginLeft:15,
      marginTop:2,
      fontSize:22,
      color:'#62C3E4'
    },
    selectedtext:{
      zIndex:10,
      position:'absolute',
      marginLeft:8,
      marginTop:2,
      fontSize:22,
      color:'#FFFFFF'
    },
    selectedtext_2:{
      zIndex:10,
      position:'absolute',
      marginLeft:3,
      marginTop:2,
      fontSize:22,
      color:'#FFFFFF'
    },
  });