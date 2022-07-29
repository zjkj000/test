import { random } from 'nanoid';
import React, { Component } from 'react';
import { StyleSheet, View } from 'react-native';
import { Table, Row, Rows } from 'react-native-table-component';
export default class MyTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:'',
      tableHead:[],
      // widthArr:  [28 ,   53,   43,   48,   43,   43,   43,   58],
      tableData: []
    }
  }
  UNSAFE_componentWillMount(){
    this.setState({tableHead:this.props.tablehead,tableData:this.props.data,id:new Date().toISOString()})
  }
  UNSAFE_componentWillReceiveProps(nextprops){
    this.setState({tableHead:nextprops.tablehead,tableData:nextprops.data})
  }
    
  render() {
    const state = this.state;
    return (
      <View  style={styles.container}>
            <Table >
                <View>
                    <Row  data={state.tableHead} style={{marginTop:3,borderWidth:0.5,backgroundColor: '#A4A4A4'}} textStyle={styles.Rowtext}/>
                </View>
                    <Rows data={state.tableData} style={{borderWidth:0.5,borderTopWidth:0}} textStyle={styles.Rowstext}/>
            </Table>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: { padding:5,width:"100%"},
  head: { marginTop:6,},
  Rowtext:{
    textAlign:'center',marginBottom:5,fontSize:12
  },
  Rowstext:{
    textAlign:'center',marginBottom:3,marginTop:5,fontSize:12
  },
});