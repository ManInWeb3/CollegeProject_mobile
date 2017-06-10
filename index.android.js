/**
 * shevelevw@gmail.com
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  Button,
  View,
  ListView,
  TouchableHighlight,
  Image,
  ScrollView,
} from 'react-native';

import { StackNavigator } from 'react-navigation';
var testsArray = [];
var TESTAPIURL = 'http://209.126.109.242:10980/api/v1/test/';
var TESTLOGAPIURL = "http://209.126.109.242:10980/api/v1/testlog/bypin/";
var MEDIAIURL = "http://209.126.109.242:10980/tests/static/media/";

class TestListScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: "Tests list",
  });
  
  constructor(props) {
    // console.log("constructor");
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged:(r1,r2) => r1.guid != r2.guid});
    this.state = {
      dataSource: dataSource.cloneWithRows(testsArray),
      title: "Tests list",
      isLoading:true,
    }
  }

  componentDidMount() {
    this.getList(function(json){
      testsArray = json;
      this.setState ({
        dataSource:this.state.dataSource.cloneWithRows(testsArray),
        isLoading:false
      })
    }.bind(this));   
  }

  getList(callback) {
    fetch(TESTAPIURL)
      .then(response => response.json())
      .then(json => callback(json))
      .catch(error => console.log("error:"+error));
   }


  renderRow(rowData) {

    const { navigate } = this.props.navigation;

    return (
        <TouchableHighlight underlayColor='#dddddd' style={{height:55}} onPress={() => navigate('TestLog', { "pin_code": rowData.pin_code }) } >
          <View>
            <Text style={{fontSize: 20, color: '#000000'}} numberOfLines={1}>{rowData.topic}</Text>
            <Text style={{fontSize: 20, color: '#000000',alignSelf: 'flex-end'}} numberOfLines={1}>{rowData.student}</Text>
          </View>
        </TouchableHighlight>
      );
}

   render() {
    this.state.title = "Tests list";
    var currentView = (this.state.isLoading) ? <Text style={{height: 100, backgroundColor: '#dddddd'}}> Loading ... </Text> : 
        <ListView 
          dataSource={this.state.dataSource} 
          style={styles.news} 
          renderRow={this.renderRow.bind(this)} 
          enableEmptySections={true}
        />
    return(
      <View style={styles.container}>
        <View style={styles.body}>
          {currentView}
        </View>
      </View>
    );
  }

}



class TestLogScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: `${navigation.state.params.pin_code}`,
  });
  

  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged:(r1,r2) => r1.guid != r2.guid});
    this.state = {
      dataSource: dataSource.cloneWithRows(testsArray),
      // title: `${navigation.state.params.pin_code}`,
      isLoading:true
    }
  }

  componentDidMount() {
    this.getList(function(json){
      testsArray = json;
      this.setState ({
        dataSource:this.state.dataSource.cloneWithRows(testsArray),
        isLoading:false
      })
    }.bind(this));   
  }

  getList(callback) {
    const { params } = this.props.navigation.state;
    fetch(TESTLOGAPIURL + params.pin_code + "/")
      .then(response => response.json())
      .then(json => callback(json))
      .catch(error => console.log("error:"+error));
   }




   render() {
      const { params } = this.props.navigation.state;
      pin_code = params.pin_code;

      console.log("TestLog length:" + this.state.dataSource.getRowCount());
      var currentView = (this.state.isLoading) ? 
          <Text style={{height: 40, backgroundColor: '#dddddd'}}> Loading ... </Text> 
          : 
          (this.state.dataSource.getRowCount() > 0) ? 
              <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true}/> 
              : 
              <Text style={{height: 40, backgroundColor: '#dddddd'}}> There are no test logs in the test.</Text>
      return(
        <View>
        {currentView}
        </View>
      );
  }

  renderRow(rowData) {
    const { navigate } = this.props.navigation;
    var screenshot = MEDIAIURL + rowData.screenshot.split("/").pop();
    var photo = MEDIAIURL + rowData.photo.split("/").pop();
    return (
        <ScrollView underlayColor='#dddddd' >
          <View>
            <Text style={{fontSize: 20, color: '#000000'}}>{rowData.datetime}</Text>
            <View style={{flex: 1, flexDirection: 'row', height: 150}}>
              <Image
                style={{flex:1,height: undefined,width: undefined}}
                source={{uri: screenshot}}
                resizeMode="contain"
              />
              <Image
                  style={{
                    flex: 1,
                    width: undefined,
                    height: undefined
                  }}
                  source={{uri: photo}}
                  resizeMode="contain"
              />
            </View>
            <Text style={{fontSize: 20, color: '#000000'}}>{rowData.text}</Text>
            <View style={{height: 1, backgroundColor: '#dddfff'}}/>
          </View>
        </ScrollView>
      );
  }

}

const ReactWTestClient = StackNavigator({
  // Login: { screen: LoginScreen },
  TestList: { screen: TestListScreen },
  TestLog:  { screen: TestLogScreen },
});

AppRegistry.registerComponent('WTestApplication', () => ReactWTestClient);


var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    backgroundColor: '#FF6600',
    padding: 10,
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  body: {
    flex: 9,
    backgroundColor: '#F6F6EF'
  },
  header_item: {
  paddingLeft: 10,
  paddingRight: 10,
  justifyContent: 'center'
  },
  header_text: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 15
  },
  button: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0'
  },
  news_item: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 15,
    paddingBottom: 15,
    marginBottom: 5
  },
  news_item_text: {
    color: '#575757',
    fontSize: 18
  }
});







