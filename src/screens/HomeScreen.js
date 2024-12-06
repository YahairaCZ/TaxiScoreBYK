import React, { useEffect, useState } from 'react';
import { Button, View, FlatList, Text, SafeAreaView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getFirestore, collection, onSnapshot, query, getDocs } from 'firebase/firestore';
import { useRoute } from '@react-navigation/native';
import useLocation from './useLocation'; // Importamos el hook para geolocalización
import { WebView } from 'react-native-webview'; // Importamos WebView

function Ptlist({ item }) {
    return (
        <View style={styles.itemContainer}>
            <Text style={styles.itemText}> {item.name_conduc}</Text>
            <Text style={styles.itemText}> {item.num_taxi}</Text>
        </View>
    );
}

function HomeScreen({ navigation }) {
    const [drivers, setDrivers] = useState([]); // Lista completa de conductores
    const [searchText, setSearchText] = useState(''); // Texto de búsqueda
    const [ratings, setRatings] = useState([]); // Calificaciones de los conductores

    const db = getFirestore();
    const driversCollection = collection(db, 'conductores');
    const ratingsCollection = collection(db, 'ratings');

    // Hook para geolocalización
    const { location, errorMsg } = useLocation();

    // Escuchar cambios en los datos de los conductores
    useEffect(() => {
        const unsubscribeDrivers = onSnapshot(driversCollection, (snapshot) => {
            const driverList = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setDrivers(driverList); // Guardar todos los conductores
        });

        return () => unsubscribeDrivers();
    }, []); // Solo se ejecuta una vez al montar el componente

    // Escuchar cambios en las calificaciones
    useEffect(() => {
        const unsubscribeRatings = onSnapshot(ratingsCollection, async () => {
            const ratingsQuery = query(ratingsCollection);
            const querySnapshot = await getDocs(ratingsQuery);
            const ratingList = querySnapshot.docs.map(doc => doc.data());
            setRatings(ratingList); // Guardar la lista de calificaciones
        });

        return () => unsubscribeRatings();
    }, []); // Solo se ejecuta una vez al montar el componente

    // Calcular el promedio de las calificaciones de los conductores
    useEffect(() => {
        if (drivers.length > 0 && ratings.length > 0) {
            const updatedDriverList = drivers.map((driver) => {
                const driverRatings = ratings.filter(rating => rating.driverName === driver.name_conduc);
                const averageRating = driverRatings.length > 0 
                    ? driverRatings.reduce((sum, { rating }) => sum + rating, 0) / driverRatings.length 
                    : 0;

                return { ...driver, averageRating };
            });

            // Ordenar por calificación y obtener los 5 mejores
            updatedDriverList.sort((a, b) => b.averageRating - a.averageRating);
            setDrivers(updatedDriverList); // Mantener todos los conductores con su promedio
        }
    }, [ratings]); // Solo se ejecuta cuando las calificaciones cambian

    // Filtrar conductores en base a la búsqueda
    const filteredList = searchText
        ? drivers.filter((item) => item.name_conduc.toLowerCase().includes(searchText.toLowerCase()))
        : drivers.slice(0, 5);  // Si no hay búsqueda, muestra el top 5 calculado

    let locationText = 'Esperando ubicación...';
    if (errorMsg) {
        locationText = errorMsg;
    } else if (location) {
        locationText = `Lat: ${location.coords.latitude}, Lon: ${location.coords.longitude}`;
    }

    return (
        <SafeAreaView style={styles.safeAV}>
            <View style={styles.headerContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('ButtonAlert')}>
                    <Icon name="notifications-active" size={30} color="black" style={{ height: 50 }} />
                </TouchableOpacity>

                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar usuario..."
                    value={searchText}
                    onChangeText={setSearchText}
                />

                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Icon name="settings" size={30} color="black" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={filteredList}  
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <Ptlist item={item} />}
                ItemSeparatorComponent={() => <View style={styles.ItemSC} />}
                contentContainerStyle={styles.flatListContainer}
            />

            <TouchableOpacity
                style={styles.butDriv}
                onPress={() => navigation.navigate('Drivers', { drivers })}
            >
                <Text>All Drivers</Text>
            </TouchableOpacity>

            {/* Contenedor de WebView para mostrar el mapa */}
            <View style={styles.locationContainer}>
                {location && (
                    <WebView
                        style={styles.map}
                        originWhitelist={['*']}
                        source={{
                            uri: `https://www.google.com/maps?q=${location.coords.latitude},${location.coords.longitude}&z=15`,
                        }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        width: '60%',
        marginHorizontal: '5%',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10,
        marginBottom: 10,
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 1,
    },
    safeAV: {},
    itemContainer: {
        padding: 1,
        borderBottomWidth: 5,
        borderBottomColor: '#ccc',
        backgroundColor: '#ffff',
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
    },
    itemText: {
        fontSize: 20,
        flex: 5,
    },
    ItemSC: {
        marginVertical: 1,
        borderColor: '#00000020',
        borderWidth: 0.5,
    },
    flatListContainer: {
        paddingBottom: 10,
    },
    butDriv: {
        marginTop: 5,
        paddingHorizontal: 10,
        paddingVertical: 7,
        borderBottomWidth: 5,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff',
        alignSelf: 'center',
        borderRadius: 30,
    },
    locationContainer: {
        width: '120%',
        height: '60%',
        
    },
    map: {
        width: '100%',
        height: '5%',
    },
});

export default HomeScreen;
