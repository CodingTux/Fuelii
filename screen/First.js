import React from "react";
import { StyleSheet, Text, View, Image, StatusBar } from "react-native";
import {
  Appbar,
  Chip,
  Button,
  Card,
  Avatar,
  Surface,
  FAB,
  List,
  Divider,
} from "react-native-paper";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp
} from "react-native-responsive-screen";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { LinearGradient } from "expo-linear-gradient";

import { DrawerActions } from "react-navigation-drawer";


class First extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      entries: [
        {
          title: "Fuel Mode",
          subtitle: "Enter Into the smart mode",
          content: (
            <Card.Cover
              source={require("../assets/fuel.png")}
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
              icon="eye"
              onPress={() => this.props.navigation.navigate("FuelModeMain")}

            />
          )
        },
        {
          title: "Smart Mode",
          subtitle: "Enter Into the smart mode",
          content: (
            <Card.Cover
              source={require("../assets/bullet.jpg")}
              style={{
                height: "70%",
                marginTop: hp(3),
                marginLeft: hp(1),
                marginRight: hp(1),

                backgroundColor: "transparent",
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
              icon="arrow-right"
              onPress={() => this.props.navigation.navigate("SmartModeMain")}
            />
          )
        },
        {
          title: "Settings",
          subtitle: "Lorem ipsum dolor sit amet",
          content: (
            <Surface
              style={{
                height: "70%",
                marginTop: hp(3),
                marginLeft: hp(1),
                marginRight: hp(1),

                backgroundColor: "transparent",
                borderRadius: 20,
                borderBottomLeftRadius: 20,
                backgroundColor: "#f5eded"
              }}
            >
              <Avatar.Image
                size={120}
                source={require("../assets/man.png")}
                style={{
                  backgroundColor: "white",
                  borderWidth: 2,
                  alignSelf: "center",
                  top: 10
                }}
              />
              <List.Section
                style={{
                  top: 10
                }}
              >
                <List.Subheader style={{alignSelf: 'center' }}>
                  <Text style={{ fontSize: hp(4)}}> Details</Text>
                </List.Subheader>
                <Divider style={{height: 2}}/>
                <List.Item titleStyle={{fontSize: hp(3) }} descriptionStyle={{fontSize: hp(4) }} title="Name" description="Abhishek" />
                <List.Item titleStyle={{fontSize: hp(3) }} descriptionStyle={{fontSize: hp(4) }} title="Bike" description="Apache" />
              </List.Section>
            </Surface>
          ),
          bottom: (
            <FAB
              style={{
                position: "absolute",
                marginTop: 30,
                right: "41%",
                bottom: 0
              }}
              icon="pencil"
              onPress={() => console.log("Pressed")}
            />
          )
        }
      ],
      activeSlide: 1
    };
  }

  _goBack = () => console.log("Went back");

  _handleSearch = () => console.log("Searching");

  _handleMore = () => console.log("Shown more");

  _renderItem = ({ item, index }) => {
    return (
      <Card
        style={{
          borderRadius: 20,
          backgroundColor: "#393e46",
          elevation: 10,
          shadowRadius: 20,
          marginTop: "10%",
          height: "90%"
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

  pagination = () => {
    const { entries, activeSlide } = this.state;
    return (
      <Pagination
        dotsLength={entries.length}
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
    return (
      <>
        <LinearGradient
          colors={["black", "black"]}
          style={{ paddingTop: hp(2), paddingBottom: hp(2) }}
        >
          <Appbar.Header style={{ backgroundColor: "transparent" }} dark>
            <Appbar.Action
              icon="menu"
              onPress={this._goBack}
              color="#e1f4f3"
              size={40}

              onPress={() =>
                this.props.navigation.dispatch(DrawerActions.toggleDrawer())
              }
            />
            <Image
              style={{ width: wp(72), height: hp(10) }}
              source={require("../assets/bykebox.png")}
            />
          </Appbar.Header>
        </LinearGradient>

        <View
          style={{
            height: 100 + "%",
            backgroundColor: "black",
            alignItems: "center",
            justifyContent: "center",
            flex: 1
          }}
        >
          <Carousel
            ref={c => {
              this._carousel = c;
            }}
            data={this.state.entries}
            renderItem={this._renderItem}
            sliderWidth={500}
            itemWidth={300}
            onSnapToItem={index => this.setState({ activeSlide: index })}
            firstItem={1}
            layout="default"
          />
          {this.pagination()}
        </View>
      </>
    );
  }
}


export default  First