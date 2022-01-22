/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  ScrollView,
  View,
  PermissionsAndroid
} from 'react-native';

import wifi from 'react-native-android-wifi';

type Props = {};
export default class App extends Component<Props> {
  constructor(props){
    super(props);
    this.state = {
      isWifiNetworkEnabled: null,
      ssid: null,
      pass: null,
      ssidExist: null,
      currentSSID: null,
      currentBSSID: null, 
      wifiList: null,
      modalVisible: false,
      status:null,
      level: null,
      ip: null,
    };

  }

  componentDidMount (){
    console.log(wifi);
    this.askForUserPermissions();
  }

  async askForUserPermissions() {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          'title': 'Wifi networks',
          'message': 'We need your permission in order to find wifi networks',
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK"
        }
      )
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Thank you for your permission! :)");
      } else {
        console.log("You will not able to retrieve wifi available networks list");
      }
    } catch (err) {
      console.warn(err)
    }
  }

  serviceCheckOnPress(){
    wifi.isEnabled(
      (isEnabled)=>{
        this.setState({isWifiNetworkEnabled: isEnabled});
        console.log(isEnabled);
      });
  }

  serviceSetEnableOnPress(enabled){
    wifi.setEnabled(enabled)
  }

  connectOnPress(){
    wifi.findAndConnect(this.state.ssid, this.state.pass, (found) => {
      this.setState({ssidExist:found});
    });
  }

  disconnectOnPress(){
    wifi.disconnect();
  }

  getSSIDOnPress(){
    wifi.getSSID((ssid) => {
      this.setState({currentSSID:ssid});
    });
  }

  getBSSIDOnPress(){
    wifi.getBSSID((bssid) => {
      this.setState({currentBSSID:bssid});
    });
  }

  getWifiNetworksOnPress(){
    wifi.loadWifiList((wifiStringList) => {
        console.log(wifiStringList);
        var wifiArray = JSON.parse(wifiStringList);
        this.setState({
          wifiList:wifiArray,
          modalVisible: true
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  connectionStatusOnPress(){
    wifi.connectionStatus((isConnected) => {
      this.setState({status:isConnected});
    });
  }

  levelOnPress(){
    wifi.getCurrentSignalStrength((level)=>{
      this.setState({level:level});
    });
  }

  ipOnPress(){
    wifi.getIP((ip)=>{
      this.setState({ip:ip});
    });
  }


  renderModal(){
    var wifiListComponents = [];
    for (w in this.state.wifiList){
      wifiListComponents.push(
        <View key={w} style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>{this.state.wifiList[w].SSID}</Text>
          <Text>BSSID: {this.state.wifiList[w].BSSID}</Text>
          <Text>Capabilities: {this.state.wifiList[w].capabilities}</Text>
          <Text>Frequency: {this.state.wifiList[w].frequency}</Text>
          <Text>Level: {this.state.wifiList[w].level}</Text>
          <Text>Timestamp: {this.state.wifiList[w].timestamp}</Text>
        </View>
      );
    }
    return wifiListComponents;
  }

  render() {
    return (
    <ScrollView>
      <View style={styles.container}>
        <Text style={styles.title}>React Native Android Wifi Example App</Text>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Check wifi service status</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={this.serviceCheckOnPress.bind(this)}>
              <Text style={styles.buttonText}>Check</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{this.state.isWifiNetworkEnabled==null?"":this.state.isWifiNetworkEnabled?"Wifi service enabled :)":"Wifi service disabled :("}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Enable/Disable wifi network</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={this.serviceSetEnableOnPress.bind(this,true)}>
              <Text style={styles.buttonText}>Enable</Text>
            </TouchableHighlight>
            <TouchableHighlight style={styles.button} onPress={this.serviceSetEnableOnPress.bind(this,false)}>
              <Text style={styles.buttonText}>Disable</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Sign device into a specific network:</Text>
          <Text style={styles.instructions}>SSID</Text>
          <TextInput 
            style={styles.textInput}
            underlineColorAndroid='transparent'
            onChangeText={(event)=>this.state.ssid=event}
            value={this.state.ssid}
            placeholder={'ssid'} />
          <Text style={styles.instructions}>Password</Text>
          <TextInput
            style={styles.textInput}
            secureTextEntry={true} 
            underlineColorAndroid='transparent'
            onChangeText={(event)=>this.state.pass=event}
            value={this.state.pass}
            placeholder={'password'} />
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={this.connectOnPress.bind(this)}>
              <Text style={styles.buttonText}>Connect</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{this.state.ssidExist==null?"":this.state.ssidExist?"Network in range :)":"Network out of range :("}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Disconnect current wifi network</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={this.disconnectOnPress.bind(this)}>
              <Text style={styles.buttonText}>Disconnect</Text>
            </TouchableHighlight>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Current SSID</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={this.getSSIDOnPress.bind(this)}>
              <Text style={styles.buttonText}>Get SSID</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{this.state.currentSSID + ""}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Current BSSID</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={this.getBSSIDOnPress.bind(this)}>
              <Text style={styles.buttonText}>Get BSSID</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{this.state.currentBSSID + ""}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Get all wifi networks in range</Text>
          <TouchableHighlight style={styles.bigButton} onPress={this.getWifiNetworksOnPress.bind(this)}>
            <Text style={styles.buttonText}>Available WIFI Networks</Text>
          </TouchableHighlight>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Connection status</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.bigButton} onPress={this.connectionStatusOnPress.bind(this)}>
              <Text style={styles.buttonText}>Get connection status</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{this.state.status==null?"":this.state.status?"You're connected :)":"You're not connected :("}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Get current wifi signal strength</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.bigButton} onPress={this.levelOnPress.bind(this)}>
              <Text style={styles.buttonText}>Get signal strength</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{this.state.level==null?"":this.state.level}</Text>
          </View>
        </View>
        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Get current IP</Text>
          <View style={styles.row}>
            <TouchableHighlight style={styles.button} onPress={this.ipOnPress.bind(this)}>
              <Text style={styles.buttonText}>Get IP</Text>
            </TouchableHighlight>
            <Text style={styles.answer}>{this.state.ip==null?"":this.state.ip}</Text>
          </View>
        </View>
      </View>
      <Modal 
        visible={this.state.modalVisible}
        onRequestClose={() => {}}>
        <TouchableHighlight style={styles.button} onPress={()=>this.setState({modalVisible:false})}>
          <Text style={styles.buttonText}>Close</Text>
        </TouchableHighlight>
        <ScrollView>
        {this.renderModal()}
        </ScrollView>
      </Modal>
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding:15,
    backgroundColor: '#F5FCFF',
    marginBottom:100
  },
  row:{
    flexDirection:'row'
  },
  title: {
    fontSize: 20,
  },
  instructionsContainer: {
    padding:15,
    borderBottomWidth: 1,
    borderBottomColor: '#CCCCCC',
  },
  instructionsTitle: {
    marginBottom:10,
    color: '#333333'
  },
  instructions: {
    color: '#333333'
  },
  button:{
    padding:5,
    width:120,
    alignItems: 'center',
    backgroundColor:'blue',
    marginRight: 15,
  },
  bigButton:{
    padding:5,
    width:180,
    alignItems: 'center',
    backgroundColor:'blue',
    marginRight: 15,
  },
  buttonText:{
    color:'white'
  },
  answer:{
    marginTop: 5,
  }
});
