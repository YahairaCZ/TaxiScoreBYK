import React, { useState, useEffect } from 'react';
import { ScrollView, Button, Alert } from 'react-native';
import { Box, Text, HStack, FlatList, VStack } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';
import { useNavigation } from '@react-navigation/native';

export default function RatingScreen({ route }) {
  const { id, nombre, noTaxi } = route.params;

  const [rating, setRating] = useState(0); // Calificación inicial en 0
  const [ratings, setRatings] = useState([]); // Lista de calificaciones
  const [averageRating, setAverageRating] = useState(0); // Calificación media

  // Obtener calificaciones de Firestore al cargar la pantalla
  useEffect(() => {
    const q = query(collection(db, 'ratings'), where('taxiId', '==', id));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRatings = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setRatings(fetchedRatings);

      // Calcular la calificación promedio
      if (fetchedRatings.length > 0) {
        const total = fetchedRatings.reduce((sum, item) => sum + item.rating, 0);
        setAverageRating((total / fetchedRatings.length).toFixed(1)); // Redondear a un decimal
      } else {
        setAverageRating(0); // Sin calificaciones
      }
    });

    

    console.log("unsubscribe function:", unsubscribe);

  return () => {
    if (typeof unsubscribe === 'function') {
      unsubscribe(); // Limpiar suscripción al desmontar
    } else {
      console.log("unsubscribe is not a function.");
    }
  };
}, [id]);

  // Manejar la selección de estrellas
  const handleStarPress = (starNumber) => {
    setRating(starNumber);
  };

  // Guardar la calificación en Firestore
  const handleSaveRating = async () => {
    if (rating === 0) {
      Alert.alert('Error', 'Por favor selecciona una calificación antes de guardar.');
      return;
    }

    try {
      await addDoc(collection(db, 'ratings'), {
        taxiId: id,
        driverName: nombre,
        taxiNumber: noTaxi,
        rating: rating,
        timestamp: new Date(),
      });

      Alert.alert('Éxito', 'Calificación guardada correctamente.');
    } catch (error) {
      console.error('Error al guardar la calificación:', error);
      Alert.alert('Error', 'Hubo un problema al guardar la calificación.');
    }
  };

  // Renderizar estrellas
  const renderStars = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Icon
          key={i}
          name={i <= rating ? 'star' : 'star-border'}
          size={30}
          color="#FFD700"
          onPress={() => handleStarPress(i)}
          style={{ margin: 5 }}
        />
      );
    }
    return stars;
  };

  // Renderizar lista de calificaciones
  const renderRatings = ({ item }) => (
    <Box p="4" borderBottomWidth="1" borderColor="gray.200">
      <VStack>
        <HStack space={4} alignItems="center">
          <Text fontSize="lg" fontWeight="bold">{item.driverName}</Text>
          <Text color="gray.500">Taxi: {item.taxiNumber}</Text>
        </HStack>
        <HStack>
          {[...Array(5)].map((_, i) => (
            <Icon
              key={i}
              name={i < item.rating ? 'star' : 'star-border'}
              size={20}
              color="#FFD700"
            />
          ))}
        </HStack>
      </VStack>
    </Box>
  );

  return (
    <ScrollView>
      {/* Información del conductor */}
      <Text style={{ fontSize: 18, fontWeight: 'bold', paddingLeft: 10, paddingTop: 10 }}>
        Perfil del Usuario
      </Text>
      <Box p="4" bg="gray.100">
        <HStack space={4} alignItems="center">
          <Icon name="person" size={50} color="#000" style={styles.profileIcon} />
          <VStack>
            <HStack space={2} alignItems="center">
              <Text fontSize="lg" fontWeight="bold">{nombre}</Text>
              <Text fontSize="md" color="gray.500">({averageRating} ★)</Text>
            </HStack>
            <Text color="gray.500">Taxi: {noTaxi}</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Calificación con Estrellas */}
      <Box p="4">
        <Text fontSize="lg" fontWeight="bold">Califica este taxi:</Text>
        <HStack>{renderStars()}</HStack>
      </Box>

      {/* Botón para guardar calificación */}
      <Box p="4">
        <Button title="Guardar Calificación" onPress={handleSaveRating} />
      </Box>

      {/* Lista de calificaciones */}
      <Box p="4">
        <Text fontSize="lg" fontWeight="bold">Calificaciones anteriores:</Text>
        <FlatList
          data={ratings}
          keyExtractor={(item) => item.id}
          renderItem={renderRatings}
        />
      </Box>
    </ScrollView>
  );
}

const styles = {
  profileIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
};