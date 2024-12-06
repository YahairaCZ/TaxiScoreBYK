import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

function Drivers({ navigation }) {
  const [driversWithRatings, setDriversWithRatings] = useState([]); // Lista con calificaciones promedio

  useEffect(() => {
    const fetchDrivers = async () => {
      const driversQuery = query(collection(db, 'conductores')); // Colección de conductores

      const unsubscribeDrivers = onSnapshot(driversQuery, (driverSnapshot) => {
        const driverList = driverSnapshot.docs.map((driverDoc) => {
          const driverData = driverDoc.data();
          const driverId = driverDoc.id;

          // Obtener calificaciones para cada conductor
          const ratingsQuery = query(
            collection(db, 'ratings'),
            where('taxiId', '==', driverId)
          );

          const unsubscribeRatings = onSnapshot(ratingsQuery, (ratingsSnapshot) => {
            const ratings = ratingsSnapshot.docs.map((doc) => doc.data().rating);
            const averageRating =
              ratings.length > 0
                ? (ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length).toFixed(1)
                : 0;

            // Actualizar el estado de los conductores con el promedio de calificación
            setDriversWithRatings((prevDrivers) => {
              return prevDrivers.map((driver) =>
                driver.id === driverId
                  ? { ...driver, averageRating }
                  : driver
              );
            });
          });

          return {
            id: driverId,
            name_conduc: driverData.name_conduc,
            num_taxi: driverData.num_taxi,
            averageRating: 0, // Inicializamos con 0, luego se actualizará
            unsubscribeRatings,
          };
        });

        setDriversWithRatings(driverList); // Inicializa los conductores sin calificaciones
      });

      return () => unsubscribeDrivers(); // Limpia la suscripción al desmontar
    };

    fetchDrivers();
  }, []);

  const handleUserPress = (id) => {
    navigation.navigate(id); // Navega a la pantalla con el nombre del ID
  };

  return (
    <FlatList
      style={styles.container}
      data={driversWithRatings}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <TouchableOpacity>
          <View style={styles.userContent}>
            <Icon name="person" size={50} color="#000" style={styles.profileIcon} />
            <View style={styles.userDetails}>
              
              <Text style={styles.userName}>
                {item.name_conduc} <Text style={styles.averageRating}>({item.averageRating} ★)</Text>
              </Text>
              <Text style={styles.userText}>No. de Taxi: {item.num_taxi}</Text>
            </View>
          </View>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buttonCalif}
              onPress={() =>
                navigation.navigate('Calific', {
                  id: item.id,
                  nombre: item.name_conduc,
                  noTaxi: item.num_taxi,
                })
              }
            >
              <Text>Qualifications</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.buttonCalif} // Estilo para el botón de comentarios
              onPress={() =>
                navigation.navigate('Coments', {
                  id: item.id,
                  nombre: item.name_conduc,
                  noTaxi: item.num_taxi,
                })
              }
            >
              <Text>Comments</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
    />
  );
}

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 10,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userDetails: {
    justifyContent: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userText: {
    fontSize: 14,
    color: '#555',
  },
  averageRating: {
    fontSize: 16,
    color: '#FFD700',
    fontWeight: 'bold',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  buttonCalif: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 8,
    marginVertical: 5,
  },
  buttonComments: {
    padding: 10,
    backgroundColor: '#28a745', // Botón verde para comentarios
    borderRadius: 8,
    marginVertical: 5,
  },
  separator: {
    height: 10,
  },
});

export default Drivers;
