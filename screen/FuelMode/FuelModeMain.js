import React from "react";
import {
    Text,
    View,
    ScrollView,
    RefreshControl,
    StatusBar
} from "react-native";
import {
    Appbar,
    Button,
    Card,
    FAB,
    Provider
} from "react-native-paper";

import { Left, Body, Right, Item, Spinner, Input } from "native-base";

import { Row, Col, Grid } from "react-native-easy-grid";
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp
} from "react-native-responsive-screen";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from '@react-native-community/datetimepicker';
import CameraAPI from "./Camera"
import axios from 'axios';

class FuelModeMain extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            odometer: "",
            gas: "",
            price_per_let: "",
            total_cost: "",
            date: new Date(),
            is_full_tank: false,
            showDate: false,
            detecting_text: false,
            loading_text: "Detecting Text Please Wait"
        };
    }


    _storeData = async () => {
        alert("Data stored successfully!!!")
        this.props.navigation.navigate("Home")
    };

    onDateChange = (event, selectedDate) => {
        const currentDate = selectedDate || this.state.date;
        this.setState({
            date: currentDate,
            showDate: false
        })
    };

    autoDetectValues = async (result) => {
        this.setState({
            detecting_text: true
        })
        try {
            let localUri = result.uri;
            let filename = localUri.split('/').pop();

            // Infer the type of the image
            let match = /\.(\w+)$/.exec(filename);
            let type = match ? `image/${match[1]}` : `image`;

            // Upload the image using the fetch and FormData APIs
            let formData = new FormData();
            // Assume "photo" is the name of the form field the server expects
            formData.append('image', { uri: localUri, name: filename, type });

            const response = await axios.post(`https://2p8e6kw9x9.execute-api.ap-south-1.amazonaws.com/fuel_api/upload`, formData, {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, GET, PUT, OPTIONS, DELETE',
                'Access-Control-Allow-Headers': 'Access-Control-Allow-Methods, Access-Control-Allow-Origin, Origin, Accept, Content-Type',
                'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/x-www-form-urlencoded'
            })
            const data = response.data
            console.log(data)
            this.setState({
                price_per_let: data['Price'],
                total_cost: data["Amount"],
                gas: data["Qty"]
            })

        } catch (err) {
            alert(err.message)
            console.log(err)
            this.setState({
                detecting_text: false
            })
        }

        this.setState({
            detecting_text: false
        })
    }

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
                                Fuel Mode
                            </Text>
                        </Body>
                        <Right>
                            <CameraAPI setImageUri={this.autoDetectValues} />
                        </Right>
                    </Appbar.Header>
                </LinearGradient>
                <Provider>
                    {
                        this.state.detecting_text && (
                            <View>
                                <Text style={{ color: "white", fontSize: hp(2.5), textAlign: "center", backgroundColor: "black" }}>
                                    {this.state.loading_text}
                                </Text>
                                <Spinner style={{ backgroundColor: "black" }} />
                            </View>
                        )
                    }
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
                                                        placeholder="Odometer"
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
                                                        placeholder='Odometer(km)'
                                                        value={this.state.odometer}
                                                        placeholderTextColor="lightgrey"
                                                        style={{ textAlign: "center", color: "lightgrey" }}
                                                        onChangeText={odometer => {
                                                            this.setState({
                                                                odometer
                                                            });
                                                        }}
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
                                                        placeholder="Gas"
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
                                                        placeholder='Gas(l)'
                                                        value={this.state.gas}
                                                        placeholderTextColor="lightgrey"
                                                        style={{ textAlign: "center", color: "lightgrey" }}
                                                        onChangeText={gas => {
                                                            this.setState({
                                                                gas
                                                            });
                                                        }}
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
                                                        placeholder="Price/L"
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
                                                        placeholder='Price/L'
                                                        value={this.state.price_per_let}
                                                        placeholderTextColor="lightgrey"
                                                        style={{ textAlign: "center", color: "lightgrey" }}
                                                        onChangeText={price_per_let => {
                                                            this.setState({
                                                                price_per_let
                                                            });
                                                        }}
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
                                                        placeholder="Total Cost"
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
                                                        placeholder='Total Cost'
                                                        value={this.state.price_per_let}
                                                        placeholderTextColor="lightgrey"
                                                        style={{ textAlign: "center", color: "lightgrey" }}
                                                        onChangeText={price_per_let => {
                                                            this.setState({
                                                                price_per_let
                                                            });
                                                        }}
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
                                                        placeholder="Date"
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
                                                    <Button
                                                        placeholder='Select Date'
                                                        style={{ textAlign: "center", color: "lightgrey", padding: 7 }}
                                                        onPress={() => {
                                                            this.setState({
                                                                showDate: true
                                                            })
                                                        }}
                                                    >
                                                        <Text style={{ color: "white" }}>{this.state.date.toString()}</Text>
                                                    </Button>
                                                    {this.state.showDate && <DateTimePicker
                                                        testID="dateTimePicker"
                                                        value={this.state.date}
                                                        mode={'date'}
                                                        is24Hour={true}
                                                        display="default"
                                                        onChange={this.onDateChange}
                                                    />}
                                                </Item>
                                            </Col>
                                        </Row>
                                    </Grid>

                                </Card.Content>
                            </Card>

                            <View>
                                <Grid>
                                    <Col>
                                        <FAB
                                            label="Upload"
                                            small
                                            icon="check"
                                            onPress={() => {
                                                this._storeData();
                                            }}
                                            style={{ margin: 10 }}
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

export default FuelModeMain;
