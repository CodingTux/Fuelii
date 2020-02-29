import React from "react";
import { StyleSheet, Text, View, Image, ScrollView,  FlatList,
    RefreshControl } from "react-native";
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

import { Left, Body, Right, Form, Item, Input, Label } from "native-base";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";

class SmartModeAllUser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        subUsrName: "",
        genApi: "",
        removeUsrName: "",
        alrResUsr: [],
        disableItKey: false,
        disableItAdd: false,
        title: "Generate AuthKey",
        refreshing: false,
        loading: false
    };
  }

  render() {
    var obj = this.state.alrResUsr;

    if (obj === undefined) {
      obj = { None: "No user is listed" };
    }

    return (
      <>
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
                  this.props.navigation.navigate("SmartModeMain");
                }}
              />
            </Left>
            <Body>
              <Text style={{ color: "#FCAE5E", fontSize: hp(3.5) }}>
                All Users
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
                    console.log("Refresh Page")
                }}
                refreshing={this.state.refreshing}
                style={{ backgroundColor: "transparent" }}
              />
            }
            style={{height: '100%', backgroundColor: 'black'}}
          >
            <View >
              <Chip
                // avatar={<Image source = {require('../assets/gallary.png')} />}
                avatar={<Image source={require("../../assets/users.png")} />}
                //onPress={this._showModal}
                mode="flat"
                style={{
                  marginTop: 10,
                  marginLeft: 50,
                  marginRight: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 30,
                  backgroundColor: '#FCAE5E'
                }}
              >
                Authurised Users
              </Chip>
            </View>
            <Card
              elevation={10}
              style={{
                borderRadius: 20,
                margin: 20,
                backgroundColor: '#393e46'
              }}
            >
              <Card.Content>
                <FlatList
                  data={this.state.alrResUsr}
                  renderItem={this.showUsers}
                />
                <ScrollView >
                  {Object.keys(obj).map(getDetails => {
                    return (
                      <View
                        style={{
                          backgroundColor: "rgb(241,241,241)",
                          marginBottom: 10,
                          borderRadius: 20
                        }}
                      >
                        <List.Item
                          title={getDetails}
                          description={obj[getDetails]}
                          right={props => (
                            <View style={{ flexDirection: "row" }}>
                              <IconButton
                                {...props}
                                icon="share"
                                color="green"
                                size={20}
                                onPress={() => {
                                  console.log("Share Details")
                                }}
                              />

                              <IconButton
                                {...props}
                                icon={require("../../assets/delete.png")}
                                color="red"
                                size={20}
                                onPress={() => {
                                  console.log("Delete User");
                                  
                                }}
                              />
                            </View>
                          )}
                        />
                      </View>
                    );
                  })}
                </ScrollView>
              </Card.Content>
            </Card>
          </ScrollView>
        </Provider>
      </>
    );
  }
}

export default SmartModeAllUser;
