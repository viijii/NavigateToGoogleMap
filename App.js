import React, { Component } from 'react';
import {
    StyleSheet,
    Button,
    Text,
    View,
    TextInput,
    ImageBackground,
    ActivityIndicator,
    Linking,
    TouchableOpacity
} from 'react-native';
import styled from 'styled-components/native';
import PropTypes from 'prop-types';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import getDirections from 'react-native-google-maps-directions'
import { PermissionsAndroid } from 'react-native';


let Container = styled(View) `
	width: 100%;
	height: 100%;
	background-color: white;
`;

let Map = styled(MapView) `
	width: 100%;
	height: 100%;
`;

// const origin = { latitude: 42.2678176, longitude: -71.000124 };
// const destination = { latitude: 42.2929175, longitude: -71.0548235 };
const origin = { latitude:17.440081 , longitude:78.348915}; // gachibowli
// const destination = { latitude: 40.7480124, longitude: -73.9894128 }; // new york
const destination = { latitude:17.437462, longitude: 78.448288}; //ameerpet
const GOOGLE_MAPS_APIKEY = 'YOUR_GOOGLE_MAP_API_KEY';

export default class App extends Component {

    constructor() {
        super();

        this.state = {
          origin,
      
         destination
        }
       
    }

    async requestLocationPermission() {
        try {

            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                {
                    'title': 'Food App Location Permission',
                    'message': 'Food App needs access to your map ' +
                        'so you can be navigated.'
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use the location");
                return true;

            } else {
                console.log("location permission denied");
                return false;
            }

        } catch (err) {
            console.warn(err)
        }

    }

    getLocation = () => {
     
        navigator.geolocation.getCurrentPosition((position) => {
            let newOrigin = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };

            console.log('new origin');
            console.log(newOrigin);

            this.setState({
                origin: newOrigin
            });
        }, (err) => {
            console.log('error');
            console.log(err)

        }, {enableHighAccuracy: true, timeout: 2000, maximumAge: 1000})

    };

    async componentDidMount() {
        let isGranted = await this.requestLocationPermission();
        if (isGranted) {
            this.getLocation();
        }
    }

    handleGetGoogleMapDirections = () => {
        const data = {
            destination: this.state.destination,
            params: [
                {
                    key: "dirflg",
                    value: "d"
                }
            ]
        };

        getDirections(data)
    };

    render() {
        return (
           <Container>
                <Map
                    region={{
                        latitude: (this.state.origin.latitude + this.state.destination.latitude) / 2,
                        longitude: (this.state.origin.longitude + this.state.destination.longitude) / 2,
                        latitudeDelta: Math.abs(this.state.origin.latitude - this.state.destination.latitude) + Math.abs(this.state.origin.latitude - this.state.destination.latitude) * .1,
                        longitudeDelta: Math.abs(this.state.origin.longitude - this.state.destination.longitude) + Math.abs(this.state.origin.longitude - this.state.destination.longitude) * .1,
                    }}
                >
                    <MapView.Marker
                        coordinate={this.state.destination}
                    >
                        <MapView.Callout onPress={this.handleGetGoogleMapDirections}>
                            <Text>Press to Get Direction</Text>
                        </MapView.Callout>
                    </MapView.Marker>
                    {/* <MapView.Marker
                        coordinate={this.state.origin}
                    >
                        <MapView.Callout>
                            <Text>Your Location</Text>
                        </MapView.Callout>
                    </MapView.Marker> */}
                    <MapViewDirections
                        origin={this.state.origin}
                        destination={this.state.destination}
                        apikey={GOOGLE_MAPS_APIKEY}
                    />

                </Map>
            </Container>
        );
    }
}