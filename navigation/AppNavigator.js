import React from "react";
import { View, ScrollView, SafeAreaView, Image } from "react-native";

import { createDrawerNavigator } from "react-navigation-drawer";

import { Appbar, Divider, FAB } from "react-native-paper";

import { CardItem, Text, Left } from "native-base";

import First from "../screen/First";
import SmartModeMain from '../screen/SmartMode/SmartModeMain'
import SmartModeAllUser from '../screen/SmartMode/SmartModeAllUser'

import Settings from '../screen/Settings'


import { LinearGradient } from "expo-linear-gradient";


import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";

const SideMenu = createDrawerNavigator(
  {
    Home: { screen: First },
    SmartModeMain: SmartModeMain,
    SmartModeAllUser: SmartModeAllUser,
    Settings: Settings
  },
  {
    contentComponent: props => (
      <View>
        <LinearGradient
          colors={["black", "black"]}
          style={{ paddingTop: hp(2), paddingBottom: hp(5) }}
        >
          <Appbar.Header style={{ backgroundColor: "transparent" }} dark>
            <Image
              style={{ width: wp(52), height: hp(10) }}
              source={require("../assets/bykebox.png")}
            />
          </Appbar.Header>
        </LinearGradient>
        <Divider style={{ height: 2 }} />

        <ScrollView
          style={{ backgroundColor: "black", height: "100%" }}
          contentContainerStyle={{ justifyContent: "space-between" }}
        >
          <SafeAreaView forceInset={{ top: "always", horizontal: "never" }}>
            <CardItem
              style={{
                margin: hp(2),
                borderRadius: 10,
                backgroundColor: "#393e46"
              }}
              button
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate("Home");
              }}
            >
              <Left>
                <FAB
                  small
                  icon="home"
                  onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate("Home");
                  }}
                />
                <Text style={{ color: "#FCAE5E", fontSize: hp(3) }}>Home</Text>
              </Left>
            </CardItem>

            <CardItem
              style={{
                margin: hp(2),
                borderRadius: 10,
                backgroundColor: "#393e46"
              }}
              button
              onPress={() => {
               
                props.navigation.navigate("SmartModeMain");
              }}
            >
              <Left>
                <FAB
                  small
                  icon={require("../assets/motorcycle.png")}
                  onPress={() => {
              
                    props.navigation.navigate("SmartModeMain");
                  }}
                />
                <Text style={{ color: "#FCAE5E", fontSize: hp(3) }}>
                  Smart Mode
                </Text>
              </Left>
            </CardItem>

            <CardItem
              style={{
                margin: hp(2),
                borderRadius: 10,
                backgroundColor: "#393e46"
              }}
              button
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate("Home");
              }}
            >
              <Left>
                <FAB
                  small
                  icon={require("../assets/fuel.png")}
                  onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate("Home");
                  }}
                />
                <Text style={{ color: "#FCAE5E", fontSize: hp(3) }}>
                  Fuel Mode
                </Text>
              </Left>
            </CardItem>

            <CardItem
              style={{
                margin: hp(2),
                borderRadius: 10,
                backgroundColor: "#393e46"
              }}
              button
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate("Home");
              }}
            >
              <Left>
                <FAB
                  small
                  icon={"history"}
                  onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate("Home");
                  }}
                />
                <Text style={{ color: "#FCAE5E", fontSize: hp(3) }}>
                  History
                </Text>
              </Left>
            </CardItem>

            <CardItem
              style={{
                margin: hp(2),
                borderRadius: 10,
                backgroundColor: "#393e46"
              }}
              button
              onPress={() => {
                props.navigation.navigate("Settings");
              }}
            >
              <Left>
                <FAB
                  small
                  icon="settings"
                />
                <Text style={{ color: "#FCAE5E", fontSize: hp(3) }}>
                  Settings
                </Text>
              </Left>
            </CardItem>

            <CardItem
              style={{
                margin: hp(2),
                borderRadius: 10,
                backgroundColor: "#393e46"
              }}
              button
              onPress={() => {
                props.navigation.closeDrawer();
                props.navigation.navigate("Home");
              }}
            >
              <Left>
                <FAB
                  small
                  icon="logout"
                  onPress={() => {
                    props.navigation.closeDrawer();
                    props.navigation.navigate("Home");
                  }}
                />
                <Text style={{ color: "#FCAE5E", fontSize: hp(3) }}>
                  Logout
                </Text>
              </Left>
            </CardItem>
          </SafeAreaView>
        </ScrollView>
      </View>
    )
  }
);

// const Menu =  createSwitchNavigator({

//   First: First,
//   smtModeFirst: DataBike,
//   second: drawerNav
// });

export default SideMenu;
