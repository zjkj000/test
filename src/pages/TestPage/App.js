import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Image,
  TextInput,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

export default class MyProject extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Image
          source={{
            uri: 'http://oss-hz.qianmi.com/qianmicom/u/cms/qmwww/201511/03102524l6ur.png',
          }}
          style={styles.logo}
        />
        <TextInput style={styles.input} placeholder='username' />
        <TextInput
          style={styles.input}
          placeholder='password'
          password={true}
        />
        <TouchableOpacity
          style={styles.btn}
          onPress={() => console.log('press me')}
        >
          <Text style={styles.text}>login</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingLeft: 10,
    paddingRight: 10,
    backgroundColor: '#F5FCFF',
  },
  input: {
    marginTop: 10,
    width: 300,
    height: 40,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'lightblue',
  },
  btn: {
    width: 150,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3333FF',
    height: 40,
    borderRadius: 5,
    marginTop: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#FFF',
  },
  logo: {
    width: 160,
    height: 160,
    marginTop: 100,
  },
});

AppRegistry.registerComponent('MyProject', () => MyProject);
