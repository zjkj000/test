import React from 'react';
import {StyleSheet,
    View,
    Button,
    Text,
} from "react-native";

export default class TodoList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { };
  }
  
  render() {
    return (
      <View>
          <Button title="做题" onPress={() => this.props.navigation.navigate('ViewPager_ToDo')}/>
          <Button title="单选题" onPress={() => this.props.navigation.navigate('Answer_single')}/>
          <Button title="多选题" onPress={() => this.props.navigation.navigate('Answer_multiple')}/>
          <Button title="判断题" onPress={() => this.props.navigation.navigate('Answer_judgment')}/>
          <Button title="主观题" onPress={() => this.props.navigation.navigate('Answer_subjective')}/>
          <Button title="阅读题" onPress={() => this.props.navigation.navigate('Answer_read')}/>
          <Button title="交作业" onPress={() => this.props.navigation.navigate('交作业')}/>
      </View> 
    );
  }
}

const styles = StyleSheet.create({

});