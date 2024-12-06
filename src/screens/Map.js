// Map.js
import React from 'react';
import { StyleSheet, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

const Map = ({ coordinates }) => {
    if (!coordinates) {
        return <Text style={styles.locationText}>Cargando mapa...</Text>;
    }

    return (
        <MapView
            style={styles.map}
            region={{
                latitude: coordinates.latitude,
                longitude: coordinates.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            }}
        >
            <Marker coordinate={coordinates} />
        </MapView>
    );
};

const styles = StyleSheet.create({
    map: {
        width: '100%',
        height: 300,
    },
    locationText: {
        textAlign: 'center',
        marginTop: 10,
    },
});

export default Map;
