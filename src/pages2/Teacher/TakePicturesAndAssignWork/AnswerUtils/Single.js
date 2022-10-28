
import { Text, View } from 'react-native'
import React, { Component } from 'react'
import { Radio, RadioGroup,} from '@ui-kitten/components';

export default class Single extends Component {
    constructor(props){
        super(props)
        this.state={
          SelectList:['A','B','C','D'],                    //单选列表
          SelectedIndex:0,                           //单选答案选中 的index
        }
    }
    
    UNSAFE_componentWillMount(){
        this.setState({SelectList:this.props.SelectList,
            SelectedIndex:this.props.SelectedIndex=='A'?0
            :this.props.SelectedIndex=='B'?1
            :this.props.SelectedIndex=='C'?2
            :this.props.SelectedIndex=='D'?3
            :this.props.SelectedIndex=='E'?4
            :this.props.SelectedIndex=='F'?5
            :this.props.SelectedIndex=='G'?6:-1})
    }

    UNSAFE_componentWillReceiveProps(nextProps){
        this.setState({SelectList:nextProps.SelectList,
            SelectedIndex:nextProps.SelectedIndex=='A'?0
            :nextProps.SelectedIndex=='B'?1
            :nextProps.SelectedIndex=='C'?2
            :nextProps.SelectedIndex=='D'?3
            :nextProps.SelectedIndex=='E'?4
            :nextProps.SelectedIndex=='F'?5
            :nextProps.SelectedIndex=='G'?6:-1})
    }

  render() {
    return (
        <View style={{margin:10}}>
        <React.Fragment>
            <RadioGroup style={{flexWrap:'wrap',flexDirection:'row',}}
                selectedIndex={this.state.SelectedIndex}
                onChange={index => 
                    {
                        this.props.setAnswer(this.props.TimuIndex,index==0?'A'
                                                                          :index==1?'B'
                                                                          :index==2?'C'
                                                                          :index==3?'D'
                                                                          :index==4?'E'
                                                                          :index==5?'F'
                                                                          :index==6?'G':'')
                        this.setState({SingleSelectedIndex:index})
                    }
                    
                }
                >
                {this.state.SelectList.map(function(item,index){
                        return(<Radio key={index}>{item}</Radio>)
                    })
                }  
            </RadioGroup>      
        </React.Fragment>   
    </View>
    )
  }
}
  
  