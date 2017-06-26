/**
 * shevelevw@gmail.com
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  TouchableHighlight,
  Image,
  ScrollView,
} from 'react-native';

import { StackNavigator } from 'react-navigation';

// Some configs
// Set addresses of API endpoints and media files
var TESTAPIURL = 'http://209.126.109.242:10980/api/v1/test/';
var TESTLOGAPIURL = "http://209.126.109.242:10980/api/v1/testlog/bypin/";
var MEDIAIURL = "http://209.126.109.242:10980/tests/static/media/";

// Interface strings
var LISTTITLE = "Tests list";
var TESTTITLEpre = "Test PIN: ";
var LOADING = "Loading ...";
var NOTESTSHERE = "There are no tests.";
var NOTESTLOGSSHERE = "There are no test logs in the test.";


// Define screen to show list of tests
class TestListScreen extends Component {

  static navigationOptions = ({ navigation }) => ({
    title: LISTTITLE,
  });
  
// Set some variables in the beginning
  constructor(props) {
    super(props);
    var testsArray = [];
    var dataSource = new ListView.DataSource({rowHasChanged:(r1,r2) => r1.guid != r2.guid});
    this.state = {
      dataSource: dataSource.cloneWithRows(testsArray),
      title: LISTTITLE,
      isLoading:true,
    }
  }

// This method will be called when the app is loaded and ready
  componentDidMount() {
  // Call function to fetch array tests' array from API and populate dataSource with gotten array
    this.getList(function(json){
      testsArray = json;
      this.setState ({
        dataSource:this.state.dataSource.cloneWithRows(testsArray),
        isLoading:false,
      })
    }.bind(this));   
  }

// Function to get the list of options and transfer it to function callback  - anonymouse function will be defined late
  getList(callback) {
    fetch(TESTAPIURL)
      .then(response => response.json())
      .then(json => callback(json))
      .catch(error => console.log("connection error: "+error));
  }

// Define how to visualize 1 item of the list, also check if we're fetching the array then show Loading 
// and define action (navigate) if you tach the item
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

// This function will be called to visualize the screen
  render() {
    this.state.title = LISTTITLE;
  // Decision tree: if isLoading (getting data) show LOADING if gotten list is empty show NOTESTSHETE and else show ListView of gotten data  
    var currentView = (this.state.isLoading) ? 
          <Text style={{height: 100, backgroundColor: '#dddddd'}}> {LOADING} </Text> 
          : 
          (this.state.dataSource.getRowCount() == 0) ? 
              <Text style={{height: 100, backgroundColor: '#dddddd'}}> {NOTESTSHERE} </Text> 
              :
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


// Screen to visualise list of test logs
class TestLogScreen extends Component {

// Define title of the screen
  static navigationOptions = ({ navigation }) => ({
    title: TESTTITLEpre + `${navigation.state.params.pin_code}`,
  });
  
// Set some variables in the begining
  constructor(props) {
    super(props);
    var dataSource = new ListView.DataSource({rowHasChanged:(r1,r2) => r1.guid != r2.guid});
    this.state = {
      dataSource: dataSource.cloneWithRows(testsArray),
      isLoading:true
    }
  }

// This method will be called when the app is loaded and ready
  componentDidMount() {
    this.getList(function(json){
      testsArray = json;
      this.setState ({
        dataSource:this.state.dataSource.cloneWithRows(testsArray),
        isLoading:false
      })
    }.bind(this));   
  }

// Function to get the list of options and transfer it to function callback - anonymouse function will be defined late
  getList(callback) {
    const { params } = this.props.navigation.state;
    fetch(TESTLOGAPIURL + params.pin_code + "/")
      .then(response => response.json())
      .then(json => callback(json))
      .catch(error => console.log("error:"+error));
   }



// This function will be called to visualize the screen
   render() {
      const { params } = this.props.navigation.state;
      // Decide what to show message LOADING or There is no test logs or the list view with the data
      var currentView = (this.state.isLoading) ? 
          <Text style={{height: 40, backgroundColor: '#dddddd'}}> {LOADING} </Text> 
          : 
          (this.state.dataSource.getRowCount() == 0) ? 
              <Text style={{height: 40, backgroundColor: '#dddddd'}}> {NOTESTLOGSSHERE} </Text>
              :
              <ListView dataSource={this.state.dataSource} renderRow={this.renderRow.bind(this)} enableEmptySections={true}/> 
      return(
        <View>
        {currentView}
        </View>
      );
  }

// Define how to visualize 1 line (1 test log) of the list view
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

// Define routing of the app and connect screens
const ReactWTestClient = StackNavigator({
  TestList: { screen: TestListScreen },
  TestLog:  { screen: TestLogScreen },
});

// Register application and define wat to call to start the app
AppRegistry.registerComponent('WTestApplication', () => ReactWTestClient);

// Define styles for components of the app screens
var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  body: {
    flex: 9,
    backgroundColor: '#F6F6EF'
  },
});







