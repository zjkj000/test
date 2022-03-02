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
          <Button title="做题" onPress={() => this.props.navigation.navigate('做作业')}/>
      </View> 
    );
  }
}

const styles = StyleSheet.create({

});