import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Modal,
  AsyncStorage,
  RefreshControl,
  StatusBar,
  ToastAndroid
} from "react-native";
import {
  Appbar,
  Chip,
  Button,
  Card,
  Avatar,
  TextInput,
  FAB,
  Provider,
  Divider,
  Snackbar
} from "react-native-paper";

import { Left, Body, Right } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { LinearGradient } from "expo-linear-gradient";

import { Col, Row, Grid } from "react-native-easy-grid";

import RNSpeedometer from "react-native-speedometer";

import { Client, Message } from "react-native-paho-mqtt";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

class SmartModeMain extends React.Component {
  myStorage = {
    setItem: (key, item) => {
      myStorage[key] = item;
    },
    getItem: key => myStorage[key],
    removeItem: key => {
      delete myStorage[key];
    }
  };

  constructor(props) {
    super(props);
    this.client = {};
    this.state = {
      visible: false,

      mapRegion: {
        latitude: 37.78825,
        longitude: -122.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421
      },

      activeSlide: 1,
      value: 40,
      showAllDataSwitch: false,
      subUsrName: "",
      genApi: "",
      removeUsrName: "",
      alrResUsr: {},
      disableItKey: false,
      disableItAdd: false,
      title: "Generate AuthKey",
      odometer: "",
      fuel_quantity: 0.0,
      fuel_price: 0.0,
      tot_cost: 0.0,
      date: "",
      fullTank: false,
      customTank: false,
      gasStation: true,
      visible: false,
      activityName: "",
      value: 0,
      strStpIcn: "../../assets/start.png",
      startOrStop: true,

      humidity: "",
      temprature: "",
      altitude: "",
      lati: 0.0,
      longi: 0.0,
      speed: "0",
      inclination: "",
      axis_x: "",
      axis_y: "",
      axis_z: "",
      accAxisX: "",
      accAxisY: "",
      accAxisZ: "",
      gyroAxisX: "",
      gyroAxisY: "",
      gyroAxisZ: "",
      onChipTemp: "",
      vibration: "",

      ignition: false,

      showRawData: false,
      disableMaps: true,
      loadingCard: false,
      showMaps: false,
      deviceId: "",
      key: "",
      host: "",
      port: "",
      mqtt_id: "",
      mqtt_pass: "",
      bikeStatus: "Start Engine",
      deviceStatus: "Offline",
      displayColor: "red"
    };
  }

  componentDidMount = async () => {
    try {
      var deviceId = await AsyncStorage.getItem("Device_Id");
      console.log("Device: " + deviceId);
      var Key = await AsyncStorage.getItem("Key");
      var Host = await AsyncStorage.getItem("Host");
      var Port = await AsyncStorage.getItem("Port");
      var MQTT_ID = await AsyncStorage.getItem("MQTT_ID");
      var MQTT_PASS = await AsyncStorage.getItem("MQTT_PASS");

      this.setState({
        refreshing: false
      });

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
    var domain =
      this.state.host.toString() + ":" + this.state.port.toString() + "/";
    console.log(domain);
    this.client = new Client({
      uri: domain,
      clientId: "clientId",
      storage: this.myStorage
    });

    var connectionDone = false;

    if (this.state.deviceId !== "") {
      console.log("Value: " + this.state.axis_x);
      if (isNaN(parseInt(this.state.axis_x))) {
        this.setState({
          deviceStatus: "Offline",
          displayColor: "red"
        });
      } else {
        this.setState({
          deviceStatus: "Online",
          displayColor: "green"
        });
      }

      if (isNaN(parseInt(this.state.lati))) {
        this.setState({
          disableMaps: true
        });
      }else{
        this.setState({
          disableMaps: false
        })
      }

      this.setState({
        mapRegion: {
          latitudeDelta: 0.00822,
          longitudeDelta: 0.00621
        }
      });

      this.client.on("connectionLost", responseObject => {
        this.setState({
          showMaps: false,
          mapRegion: {
            latitude: 21.00123,
            longitude: 21.00123
          },
          loadingCard: true
        });
        if (responseObject.errorCode !== 0) {
          // console.log(responseObject);
          // connect the client
          this.client
            .connect({
              useSSL: false,
              userName: this.state.mqtt_id,
              password: this.state.mqtt_pass,
              keepAliveInterval: Infinity,
              timeout: Infinity
            })
            .then(() => {
              // Once a connection has been made, make a subscription and send a message.

              const api = this.state.key;

              console.log("onConnect");
              this.client.subscribe(api).then(() => {
                console.log("subscribed to " + api);
                this.setState({
                  loadingCard: false
                });
              });
            })
            .catch(responseObject => {
              console.log(responseObject);
              if (responseObject.errorCode !== 0) {
                //   console.log("onConnectionLost:" + responseObject.errorMessage);
              }
            });
        }
      });

      this.client.on("messageReceived", message => {
        // console.log(message.payloadString);

        //accx/accy/accz/gyrox/gyroy/gyroz/x/y/z/lat/lon/alt/speed/humi/temp/vibration/

        if (message.destinationName === this.state.key.toString()) {
          console.log(message.payloadString);
          var dataArray = message.payloadString.split("/");
          console.log(dataArray);

          this.setState({
            accAxisX: dataArray[0],
            accAxisY: dataArray[1],
            accAxisZ: dataArray[2],
            gyroAxisX: dataArray[3],
            gyroAxisY: dataArray[4],
            gyroAxisZ: dataArray[5],
            axis_x: dataArray[6],
            axis_y: dataArray[7],
            axis_z: dataArray[8],
            lati: dataArray[9],
            longi: dataArray[10],
            altitude: dataArray[11],
            speed: dataArray[12],
            humidity: dataArray[13],
            temprature: dataArray[14],
            vibration: dataArray[15],
            mapRegion: {
              latitude: parseFloat(dataArray[9]),
              longitude: parseFloat(dataArray[10])
            }
          });
        }
      });
      // connect the client
      this.client
        .connect({
          useSSL: false,
          userName: this.state.mqtt_id,
          password: this.state.mqtt_pass,
          keepAliveInterval: Infinity,
          timeout: Infinity
        })
        .then(async () => {
          // Once a connection has been made, make a subscription and send a message.

          this.setState({
            loadingCard: true
          });

          const api = this.state.key;

          console.log("onConnect");
          this.client.subscribe(api).then(() => {
            console.log("subscribed to " + api);
            this.setState({
              loadingCard: false
            });
          });

          connectionDone = true;
        })
        .catch(responseObject => {
          console.log(responseObject);
          if (responseObject.errorCode !== 0) {
            //  console.log("onConnectionLost:" + responseObject);
          }
        });

      console.log(connectionDone);
      console.log(this.state.startOrStop);
    } else {
      console.log("Set correct values in settings page");
    }

    // set event handlers
  };

  _handleMapRegionChange = mapRegion => {
    this.setState({ mapRegion });
  };

  componentWillUnmount = () => {
    console.log("Unmounted");
    this.client.disconnect();
  };

  handleStartStop = () => {
    var onOff;
    if (this.state.startOrStop) {
      onOff = 1;

      try {
        const on_off = new Message(onOff.toString());
        on_off.destinationName = this.state.key + "/1";
        this.client.send(on_off);
        console.log("Bike Started");
        this.setState({
          value: 100,
          startOrStop: !this.state.startOrStop,
          bikeStatus: "Stop Engine"
        });
      } catch {
        ToastAndroid.showWithGravity(
          "Connection Issue",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    } else {
      onOff = 3;

      const on_off = new Message(onOff.toString());
      on_off.destinationName = this.state.key + "/3";
      try {
        this.client.send(on_off);
        console.log("Bike Stopped");
        this.setState({
          value: 0,
          startOrStop: !this.state.startOrStop,
          bikeStatus: "Start Engine"
        });
      } catch {
        ToastAndroid.showWithGravity(
          "Connection Issue",
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
      //this.setState({value: 0})
    }
  };

  _showModal = () => this.setState({ visible: true });
  _hideModal = () => this.setState({ visible: false });

  createApiForSU = () => {
    // var CryptoJS = require("crypto-js");

    // this.state.genApi = CryptoJS.AES.encrypt(this.state.subUsrName, 'secret key 123')
    // var genApi = this.state.genApi.toString()
    // console.log("encrypted text", genApi);
    // this.setState({ disableItKey: true, title: genApi })

    if (this.state.subUsrName.length > 0) {
      this.state.genApi = Math.floor(Math.random() * 90000) + 10000;
      var genApi = this.state.genApi.toString();
      console.log("encrypted text", genApi);
      this.setState({ disableItKey: true, title: genApi });
    } else {
      alert("Please enter valid username");
    }
  };

  _renderItem = ({ item, index }) => {
    return (
      <Card
        style={{
          borderRadius: 20,
          backgroundColor: "#393e46",
          elevation: 10,
          shadowRadius: 20
        }}
      >
        <Card.Content>
          <Chip
            style={{
              alignItems: "center",
              marginTop: hp(1),
              backgroundColor: "#FCAE5E"
            }}
            mode="outlined"
          >
            <Text
              style={{ textAlign: "center", color: "#545454", fontSize: hp(3) }}
            >
              {item.title}
            </Text>
          </Chip>
        </Card.Content>

        {item.content}
        {item.bottom}
      </Card>
    );
  };

  pagination = lengthOfEntries => {
    const { activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={lengthOfEntries}
        activeDotIndex={activeSlide}
        containerStyle={{}}
        dotStyle={{
          backgroundColor: "white"
        }}
        inactiveDotStyle={
          {
            // Define styles for inactive dots here
          }
        }
      />
    );
  };

  render() {
    var entries = [
      {
        title: "Add User",
        subtitle: "Enter Into the smart mode",
        content: (
          <Card.Cover
            source={require("../../assets/adduser.png")}
            style={{
              height: "70%",
              marginTop: hp(3),
              marginLeft: hp(1),
              marginRight: hp(1),

              backgroundColor: "#acdbdf",
              borderRadius: 20,
              borderBottomLeftRadius: 20
            }}
          ></Card.Cover>
        ),
        bottom: (
          <FAB
            style={{
              position: "absolute",
              marginTop: 30,
              right: "41%",
              bottom: 0
            }}
            icon="plus"
            onPress={() => {
              this.setState({
                visible: true
              });
            }}
          />
        )
      },
      {
        title: "All Users",
        subtitle: "Enter Into the smart mode",
        content: (
          <Card.Cover
            source={require("../../assets/users.png")}
            style={{
              height: "70%",
              marginTop: hp(3),
              marginLeft: hp(1),
              marginRight: hp(1),

              backgroundColor: "#c4bbf0",
              borderRadius: 20,
              borderBottomLeftRadius: 20
            }}
          ></Card.Cover>
        ),
        bottom: (
          <FAB
            style={{
              position: "absolute",
              marginTop: 30,
              right: "41%",
              bottom: 0
            }}
            icon="eye"
            onPress={() => this.props.navigation.navigate("SmartModeAllUser")}
          />
        )
      },
      {
        title: "History",
        subtitle: "Lorem ipsum dolor sit amet",
        content: (
          <Card.Cover
            source={require("../../assets/history.png")}
            style={{
              height: "70%",
              marginTop: hp(3),
              marginLeft: hp(1),
              marginRight: hp(1),

              backgroundColor: "#ffc045",
              borderRadius: 20,
              borderBottomLeftRadius: 20
            }}
          ></Card.Cover>
        ),
        bottom: (
          <FAB
            style={{
              position: "absolute",
              marginTop: 30,
              right: "41%",
              bottom: 0
            }}
            icon="history"
            onPress={() => this.props.navigation.navigate("SmartModeMain")}
          />
        )
      }
    ];

    return (
      <>
        <StatusBar backgroundColor="black" barStyle="light-content" />

        <LinearGradient
          colors={["black", "black"]}
          style={{ paddingTop: hp(2), paddingBottom: hp(2) }}
        >
          <Appbar.Header style={{ backgroundColor: "transparent" }} dark>
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
              <Text style={{ color: "#FCAE5E", fontSize: hp(3) }}>
                SmartMode
              </Text>
            </Body>
            <Right />
          </Appbar.Header>
        </LinearGradient>

        <ScrollView
          style={{
            backgroundColor: "black",
            flex: 1
          }}
          scrollEventThrottle={200}
          directionalLockEnabled={true}
          refreshControl={
            <RefreshControl
              //tintColor={$.config.colors.style}
              onRefresh={() => {
                this.componentDidMount();
              }}
              refreshing={this.state.refreshing}
              style={{ backgroundColor: "transparent" }}
            />
          }
        >
          <Text
            style={{ color: "white", textAlign: "center", fontStyle: "italic" }}
          >
            Device Status:{" "}
            <Text style={{ color: this.state.displayColor }}>
              {this.state.deviceStatus}
            </Text>
          </Text>
          <Grid style={{ marginBottom: "2%" }}>
            <Col>
              <Card
                elevation={10}
                style={{
                  borderRadius: 20,
                  marginTop: 10,
                  marginLeft: 20,
                  marginRight: 20,
                  marginBottom: 10,

                  //backgroundColor: "#393e46"
                  backgroundColor: "transparent"
                }}
              >
                <Card.Content>
                  <RNSpeedometer
                    value={parseInt(this.state.speed)}
                    size={350}
                    labels={[""]}
                    halfCircleStyle={{ backgroundColor: "#D6FFFD" }}
                    labelStyle={{ fontSize: hp(2), color: "white" }}
                    innerCircleStyle={{ backgroundColor: "black" }}
                  />
                </Card.Content>
              </Card>
            </Col>
            <Divider
              style={{
                backgroundColor: "white",
                marginBottom: "2%",
                marginLeft: "4%",
                marginRight: "4%",
                height: hp(0.2),
                backgroundColor: "#393e46"
              }}
            />
            <Row>
              <Body>
                <Row>
                  <Right>
                    <Text style={{ color: "white", textAlign: "center" }}>
                      {this.state.bikeStatus}
                    </Text>
                  </Right>
                  <Card
                    elevation={10}
                    style={{
                      borderRadius: 20,
                      marginTop: 10,
                      marginLeft: 20,
                      marginBottom: 10,

                      backgroundColor: "#393e46"
                    }}
                    onPress={() => {
                      this.handleStartStop();
                    }}
                  >
                    <Card.Content>
                      <Avatar.Image
                        source={require("../../assets/start.png")}
                      />
                    </Card.Content>
                  </Card>

                  <Card
                    elevation={10}
                    style={{
                      borderRadius: 20,
                      marginTop: 10,
                      marginLeft: 20,
                      marginBottom: 10,
                      marginRight: 20,
                      backgroundColor: "#393e46"
                    }}
                    onPress={() => {
                      onOff = 2;
                      this.setState({});
                      console.log("Ignition");
                      this.setState({
                        value: 100,
                        ignition: !this.state.ignition
                      });
                      const on_off = new Message(onOff.toString());
                      on_off.destinationName = this.state.key + "/2";
                      this.client.send(on_off);
                    }}
                  >
                    <Card.Content>
                      <Avatar.Image
                        source={require("../../assets/ignition.png")}
                        style={{ backgroundColor: "#FF6767" }}
                      />
                    </Card.Content>
                  </Card>

                  <Left>
                    <Text style={{ color: "white" }}>Ignition</Text>
                  </Left>
                </Row>

                <Row>
                  <Right>
                    <Text style={{ color: "white", textAlign: "center" }}>
                      Show Raw Data
                    </Text>
                  </Right>
                  <Card
                    elevation={10}
                    style={{
                      borderRadius: 20,
                      marginTop: 10,

                      marginBottom: 10,

                      backgroundColor: "#393e46"
                    }}
                    onPress={() => {
                      this.setState({
                        showRawData: true
                      });
                    }}
                  >
                    <Card.Content>
                      <Avatar.Image
                        source={require("../../assets/toggle.png")}
                        style={{ backgroundColor: "transparent" }}
                      />
                    </Card.Content>
                  </Card>

                  <Card
                    elevation={10}
                    style={{
                      borderRadius: 20,
                      marginTop: 10,
                      marginLeft: 20,
                      marginBottom: 10,

                      backgroundColor: "#393e46"
                    }}
                    onPress={() => {
                      if (this.state.disableMaps === false) {
                        this.setState({
                          showMaps: true
                        });
                      } else {
                        alert("Device is offline. Maps cannot be loaded");
                      }
                    }}
                  >
                    <Card.Content>
                      <Avatar.Image
                        source={require("../../assets/maps.png")}
                        style={{ backgroundColor: "transparent" }}
                      />
                    </Card.Content>
                  </Card>

                  <Left>
                    <Text style={{ color: "white", textAlign: "center" }}>
                      Show Live Location
                    </Text>
                  </Left>
                </Row>
              </Body>
            </Row>
          </Grid>

          <Divider
            style={{
              backgroundColor: "white",
              marginBottom: "3%",
              marginLeft: "4%",
              marginRight: "4%",
              height: hp(0.2),
              backgroundColor: "#393e46"
            }}
          />

          <View style={{ height: hp(50), width: "100%" }}>
            <Carousel
              ref={c => {
                this._carousel = c;
              }}
              data={entries}
              renderItem={this._renderItem}
              sliderWidth={400}
              centerContent
              itemWidth={300}
              onSnapToItem={index => this.setState({ activeSlide: index })}
              firstItem={1}
              layout="default"
            />
            {this.pagination(entries.length)}
          </View>
        </ScrollView>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showRawData}
          onRequestClose={() => {
            this.setState({
              showRawData: !this.state.showRawData
            });
          }}
        >
          <LinearGradient
            colors={["black", "black"]}
            style={{ paddingTop: hp(2), paddingBottom: hp(2) }}
          >
            <Appbar.Header style={{ backgroundColor: "transparent" }} dark>
              <Left>
                <FAB
                  small={false}
                  icon={"close"}
                  onPress={() => {
                    this.setState({
                      showRawData: false
                    });
                  }}
                />
              </Left>
              <Body>
                <Text style={{ color: "#FCAE5E", fontSize: hp(3.5) }}>
                  Raw Data
                </Text>
              </Body>
              <Right />
            </Appbar.Header>
          </LinearGradient>
          <ScrollView>
            <View style={{ height: "100%", backgroundColor: "black" }}>
              <Card
                elevation={10}
                style={{
                  borderRadius: 20,
                  margin: 10,
                  backgroundColor: "#393e46"
                }}
              >
                <Card.Content>
                  <View>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,
                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/speed.png")} />
                      }
                    >
                      <Text>Speed: </Text>

                      <Text style={{ color: "black" }}>{this.state.speed}</Text>
                    </Chip>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,
                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/altitude.png")} />
                      }
                    >
                      Altitude:
                      {this.state.altitude}
                      {/* {stateName['altitude']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/latitude.png")} />
                      }
                    >
                      Latitude:
                      {this.state.lati}
                      {/* {stateName['lati']} */}
                    </Chip>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/longitude.png")} />
                      }
                    >
                      Longitude:
                      {this.state.longi}
                      {/* {stateName['longi']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image
                          source={require("../../assets/temperature.png")}
                        />
                      }
                    >
                      Temperature:
                      {this.state.temprature}
                      {/* {stateName['temprature']} */}
                    </Chip>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/axis.png")} />
                      }
                    >
                      Axis X:
                      {this.state.axis_x}
                      {/* {stateName['axis_x']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/axis.png")} />
                      }
                    >
                      Axis Y:
                      {this.state.axis_y}
                      {/* {stateName['axis_y']} */}
                    </Chip>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/axis.png")} />
                      }
                    >
                      Axis Z:
                      {this.state.axis_z}
                      {/* {stateName['axis_z']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image
                          source={require("../../assets/accelerometer.png")}
                        />
                      }
                    >
                      Accelerometer Axis X:
                      {this.state.accAxisX}
                      {/* {stateName['accAxisX']} */}
                    </Chip>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image
                          source={require("../../assets/accelerometer.png")}
                        />
                      }
                    >
                      Accelerometer Axis Y:
                      {this.state.accAxisY}
                      {/* {stateName['accAxisY']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image
                          source={require("../../assets/accelerometer.png")}
                        />
                      }
                    >
                      Accelerometer Axis Z:
                      {this.state.accAxisZ}
                      {/* {stateName['accAxisZ']} */}
                    </Chip>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/gyro.png")} />
                      }
                    >
                      Gyrometer Axis X:
                      {this.state.gyroAxisX}
                      {/* {stateName['gyroAxisX']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/gyro.png")} />
                      }
                    >
                      Gyrometer Axis Y:
                      {this.state.gyroAxisY}
                      {/* {stateName['gyroAxisY']} */}
                    </Chip>
                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/gyro.png")} />
                      }
                    >
                      Gyrometer Axis Z:
                      {this.state.gyroAxisZ}
                      {/* {stateName['gyroAxisZ']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/gyro.png")} />
                      }
                    >
                      Vibration:
                      {this.state.vibration}
                      {/* {stateName['vibration']} */}
                    </Chip>

                    <Chip
                      mode="flat"
                      style={{
                        marginTop: 10,

                        flexDirection: "row"
                      }}
                      avatar={
                        <Image source={require("../../assets/gyro.png")} />
                      }
                    >
                      Humidity:
                      {this.state.humidity}
                      {/* {stateName['humidity']} */}
                    </Chip>
                  </View>
                </Card.Content>
              </Card>
            </View>
          </ScrollView>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.visible}
          onRequestClose={() => {
            this._hideModal();
          }}
        >
          <View
            style={{
              bottom: 0,
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              width: "100%"
            }}
          >
            <LinearGradient colors={["black", "black"]}>
              <Card
                elevation={10}
                style={{
                  borderRadius: 20,
                  backgroundColor: "#393e46"
                }}
              >
                <Card.Content>
                  <FAB
                    small={false}
                    icon={"close"}
                    onPress={() => {
                      this.setState({
                        subUsrName: "",
                        title: "Generate AuthKey"
                      });
                      this._hideModal();
                    }}
                    label="Close"
                  />
                  <View>
                    <TextInput
                      label="Enter UserName(should be unique)"
                      value={this.state.subUsrName}
                      onChangeText={text => this.setState({ subUsrName: text })}
                      style={{ margin: 15 }}
                      mode="outlined"
                      selectionColor="rgb(0,215,194)"
                    />
                  </View>

                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "center",
                      alignItems: "center"
                    }}
                  >
                    <Button
                      mode="outlined"
                      onPress={this.createApiForSU}
                      style={{ backgroundColor: "#FCAE5E" }}
                    >
                      <Text style={{ color: "#545454" }}>
                        {" "}
                        {this.state.title}
                      </Text>
                    </Button>

                    <Button
                      icon="plus"
                      mode="contained"
                      style={{
                        marginLeft: 10,
                        backgroundColor: "rgb(0,215,194)"
                      }}
                    >
                      Add User
                    </Button>
                  </View>
                </Card.Content>
              </Card>
            </LinearGradient>
          </View>
        </Modal>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.showMaps}
          onRequestClose={() => {
            this._hideModal();
          }}
        >
          <LinearGradient
            colors={["black", "black"]}
            style={{ paddingTop: hp(2), paddingBottom: hp(2) }}
          >
            <Appbar.Header style={{ backgroundColor: "transparent" }} dark>
              <Left>
                <FAB
                  small={false}
                  icon={"arrow-left"}
                  onPress={() => {
                    this.setState({
                      showMaps: false
                    });
                  }}
                />
              </Left>
              <Body>
                <Text style={{ color: "#FCAE5E", fontSize: hp(2.5) }}>
                  Live Location
                </Text>
              </Body>
              <Right />
            </Appbar.Header>
          </LinearGradient>
          <MapView
            style={{ alignSelf: "stretch", height: "100%" }}
            region={
              (this.state.mapRegion,
              { latitudeDelta: 0.0922, longitudeDelta: 0.0421 })
            }
            provider={PROVIDER_GOOGLE}
            // onRegionChange={this._handleMapRegionChange}
          >
            <MapView.Marker
              title="Live Location"
              description=""
              minZoomLevel={15} // default => 0
              maxZoomLevel={20} // default => 20
              coordinate={{
                latitude: this.state.mapRegion.latitude,
                longitude: this.state.mapRegion.longitude
              }}
            />
          </MapView>
        </Modal>

        <Snackbar
          visible={this.state.loadingCard}
          onDismiss={() => this.setState({ loadingCard: false })}
        >
          Connecting to server
        </Snackbar>
      </>
    );
  }
}

export default SmartModeMain;
