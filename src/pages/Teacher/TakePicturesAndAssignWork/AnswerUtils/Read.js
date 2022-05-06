import { Text, View } from 'react-native'
import React, { Component } from 'react'
import Single from './Single'
export default class Read extends Component {
    constructor(props){
        super(props)
        this.setAnswer=this.setAnswer.bind(this)
        this.state={
            SelectedList:['A','B','C','D'],
            Answer:['A','B','C'],
        }
    }
    setAnswer(index,str){
        var newAnswer =this.state.Answer
        newAnswer[index]=str
        this.props.setReadAnswer(this.props.type,this.state.Answer)
        this.setState({Answer:newAnswer})
    }
    UNSAFE_componentWillMount(){
            this.setState({
                SelectedList:this.props.SelectedList,
                Answer:this.props.Answer
            })    
    }
    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({
            SelectedList:nextProps.SelectedList,
            Answer:nextProps.Answer
        }) 
    }

  render() {
    return (
        <>
        {this.state.Answer.map((item,index)=>{
            return(
                <View style={{flexDirection:'row',alignItems:'center'}}>
                    <Text style={{marginRight:index<9?10:2}}>{index+1}</Text>
                    <Single TimuIndex={index} SelectList={this.state.SelectedList} SelectedIndex={item} setAnswer={this.setAnswer}></Single>
                </View>
            )
        })}
        </>
      
    )
  }
}