import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  AsyncStorage,
  RefreshControl,
  StatusBar
} from "react-native";
import {
  Appbar,
  Chip,
  Button,
  Card,
  Avatar,
  Surface,
  FAB,
  TextInput,
  Divider,
  Provider
} from "react-native-paper";

import { Left, Body, Right, Form, Item, Label, Input } from "native-base";

import { Row, Col, Grid } from "react-native-easy-grid";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

class Settings extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      deviceId: "",
      key: "",
      host: "",
      port: "",
      mqtt_id: "",
      mqtt_pass: "",
      refreshing: false,
      loading: false,
      editDisable: true,
      status: "Edit",
      disableSave: true
    };

    this._retrieveData()
  }

  _retrieveData = async () => {
    try {
      var deviceId = await AsyncStorage.getItem("Device_Id");
      var Key = await AsyncStorage.getItem("Key");
      var Host = await AsyncStorage.getItem("Host");
      var Port = await AsyncStorage.getItem("Port");
      var MQTT_ID = await AsyncStorage.getItem("MQTT_ID");
      var MQTT_PASS = await AsyncStorage.getItem("MQTT_PASS");

      if (
        deviceId !== null &&
        Key !== null &&
        Host !== null &&
        Port !== null &&
        MQTT_ID !== null &&
        MQTT_PASS !== null
      ) {
        // We have data!!
        this.setState({
          deviceId: deviceId,
          key: Key,
          host: Host,
          port: Port,
          mqtt_id: MQTT_ID,
          mqtt_pass: MQTT_PASS
        });
      }
    } catch (error) {
      // Error retrieving data
    }
  };

  _storeData = async () => {
    try {
      await AsyncStorage.setItem("Device_Id", this.state.deviceId);
      await AsyncStorage.setItem("Key", this.state.key);
      await AsyncStorage.setItem("Host", this.state.host);
      await AsyncStorage.setItem("Port", this.state.port);
      await AsyncStorage.setItem("MQTT_ID", this.state.mqtt_id);
      await AsyncStorage.setItem("MQTT_PASS", this.state.mqtt_pass);
      this.setState({
        status: "Edit",
        editDisable: true
      });
      alert("Data Saved Successfully!!!");
    } catch (error) {
      // Error saving data
    }
  };

  render() {
    return (
      <>
          <StatusBar backgroundColor="black" barStyle="light-content" />
      
        <LinearGradient
          colors={["black", "black"]}
          style={{ paddingTop: hp(2), paddingBottom: hp(5) }}
        >
          <Appbar.Header style={{ backgroundColor: "transparent" }}>
            <Left>
              <FAB
                small={false}
                icon={"arrow-left"}
                onPress={() => {
                  this.props.navigation.navigate("Home");
                }}
              />
            </Left>
            <Body>
              <Text style={{ color: "#FCAE5E", fontSize: hp(3.5) }}>
                Settings
              </Text>
            </Body>
            <Right />
          </Appbar.Header>
        </LinearGradient>
        <Provider>
          <ScrollView
            refreshControl={
              <RefreshControl
                //tintColor={$.config.colors.style}
                onRefresh={() => {
                  this._retrieveData();
                }}
                refreshing={this.state.refreshing}
                style={{ backgroundColor: "transparent" }}
              />
            }
            style={{ height: "100%", backgroundColor: "black" }}
          >
            <View>
              <Card
                elevation={10}
                style={{
                  borderRadius: 20,
                  margin: 10,
                  //   backgroundColor: "#393e46"
                  backgroundColor: "black",
                  borderWidth: 3,
                  borderColor: "#393e46"
                }}
              >
                <Card.Content>
                  <Grid>
                    <Row>
                      <Col size={30}>
                        <Item rounded style={{ marginBottom: "6%" }}>
                          <Input
                            placeholder="Device Id"
                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            disabled
                          />
                        </Item>
                      </Col>
                      <Col size={65}>
                        <Item
                          rounded
                          style={{ marginBottom: "6%", marginLeft: "3%" }}
                        >
                          <Input
                            placeholder='Enter Device Id'
                            value={this.state.deviceId}
                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            onChangeText={deviceId => {
                              this.setState({
                                deviceId
                              });
                            }}
                            disabled={this.state.editDisable}
                          />
                        </Item>
                      </Col>
                    </Row>
                  </Grid>

                  <Grid>
                    <Row>
                      <Col size={30}>
                        <Item rounded style={{ marginBottom: "6%" }}>
                          <Input
                            placeholder="Key"
                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            disabled
                          />
                        </Item>
                      </Col>
                      <Col size={65}>
                        <Item
                          rounded
                          style={{ marginBottom: "6%", marginLeft: "3%" }}
                        >
                          <Input
                            placeholder={'Enter Key'}
                            value={this.state.key}

                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            onChangeText={key => {
                              this.setState({
                                key
                              });
                            }}
                            disabled={this.state.editDisable}
                          />
                        </Item>
                      </Col>
                    </Row>
                  </Grid>
                  <Grid>
                    <Row>
                      <Col size={30}>
                        <Item rounded style={{ marginBottom: "6%" }}>
                          <Input
                            placeholder="Host"
                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            disabled
                          />
                        </Item>
                      </Col>
                      <Col size={65}>
                        <Item
                          rounded
                          style={{ marginBottom: "6%", marginLeft: "3%" }}
                        >
                          <Input
                            placeholder={'Enter Host'}
                            placeholderTextColor="lightgrey"
                            value={this.state.host}

                            style={{
                              textAlign: "center",
                              color: "lightgrey",
                              fontSize: 15
                            }}
                            onChangeText={host => {
                              this.setState({
                                host
                              });
                            }}
                            disabled={this.state.editDisable}
                          />
                        </Item>
                      </Col>
                    </Row>
                  </Grid>

                  <Grid>
                    <Row>
                      <Col size={30}>
                        <Item rounded style={{ marginBottom: "6%" }}>
                          <Input
                            placeholder="Port"
                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            disabled
                          />
                        </Item>
                      </Col>
                      <Col size={65}>
                        <Item
                          rounded
                          style={{ marginBottom: "6%", marginLeft: "3%" }}
                        >
                          <Input
                            placeholder={'Enter Port'}
                            value={this.state.port}

                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            onChangeText={port => {
                              this.setState({
                                port
                              });
                            }}
                            disabled={this.state.editDisable}
                          />
                        </Item>
                      </Col>
                    </Row>
                  </Grid>

                  <Grid>
                    <Row>
                      <Col size={30}>
                        <Item rounded style={{ marginBottom: "6%" }}>
                          <Input
                            placeholder="MQTT ID"
                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            disabled
                          />
                        </Item>
                      </Col>
                      <Col size={65}>
                        <Item
                          rounded
                          style={{ marginBottom: "6%", marginLeft: "3%" }}
                        >
                          <Input
                            placeholder="Enter MQTT Id"
                            value={this.state.mqtt_id}

                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            onChangeText={mqtt_id => {
                              this.setState({
                                mqtt_id
                              });
                            }}
                            disabled={this.state.editDisable}
                          />
                        </Item>
                      </Col>
                    </Row>
                  </Grid>

                  <Grid>
                    <Row>
                      <Col size={30}>
                        <Item rounded style={{ marginBottom: "6%" }}>
                          <Input
                            placeholder="MQTT PASS"
                            placeholderTextColor="lightgrey"
                            style={{
                              textAlign: "center",
                              color: "lightgrey",
                              fontSize: 15
                            }}
                            disabled
                          />
                        </Item>
                      </Col>
                      <Col size={65}>
                        <Item
                          rounded
                          style={{ marginBottom: "6%", marginLeft: "3%" }}
                        >
                          <Input
                            placeholder={'Enter MQTT Pass'}
                            value={this.state.mqtt_pass}

                            placeholderTextColor="lightgrey"
                            style={{ textAlign: "center", color: "lightgrey" }}
                            onChangeText={mqtt_pass => {
                              this.setState({
                                mqtt_pass
                              });
                            }}
                            disabled={this.state.editDisable}
                          />
                        </Item>
                      </Col>
                    </Row>
                  </Grid>
                </Card.Content>
              </Card>

              <View>
                <Grid>
                  <Row>
                    <Col>
                      <FAB
                        label={this.state.status}
                        small
                        icon="pencil"
                        onPress={() => {
                          if (this.state.status === "Edit") {
                            this.setState({
                              editDisable: false,
                              status: "Cancel",
                              disableSave: false
                            });
                          } else {
                            this.setState({
                              editDisable: true,
                              status: "Edit",
                              disableSave: true
                            });
                          }
                        }}
                        style={{ margin: 10 }}
                      />
                    </Col>
                  </Row>

                  <Col>
                    <FAB
                      label="Save"
                      small
                      icon="check"
                      onPress={() => {
                        this._storeData();
                      }}
                      style={{ margin: 10 }}
                      disabled={this.state.disableSave}
                    />
                  </Col>
                </Grid>
              </View>
            </View>
          </ScrollView>
        </Provider>
      </>
    );
  }
}

export default Settings;
