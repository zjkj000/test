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
            <Table>
                <View style={styles.container1}>
                    <Row  data={state.tableHead} style={{marginTop:3}} textStyle={{textAlign:'center',marginBottom:5}}/>
                </View>
                    <Rows data={state.tableData} textStyle={{textAlign:'center',marginBottom:3,marginTop:5}} />
            </Table>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: { padding:5,width:"100%"},
  container1: { backgroundColor: '#33CCFF' ,borderRadius:8,paddingRight:10},
  head: { marginTop:6,}
});