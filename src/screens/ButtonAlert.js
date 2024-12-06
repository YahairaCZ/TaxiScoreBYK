import React, { useState, useEffect } from 'react';
import { View, Alert, Linking, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as Location from 'expo-location'; // Importamos expo-location
import { collection, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

const ButtonAlert = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [location, setLocation] = useState(null); // Para almacenar la ubicación

  // Obtén la ubicación del usuario
  useEffect(() => {
    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === 'granted') {
        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } else {
        Alert.alert('Error', 'No se pudo obtener la ubicación.');
      }
    };
    getLocation();
  }, []);

  const fetchContacts = async () => {
    try {
      const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'), limit(3));
      const querySnapshot = await getDocs(q);
      const contacts = querySnapshot.docs.map(doc => doc.data());

      // Encuentra el primer contacto activo disponible
      const activeContact = contacts.find(contact => contact.isActive);
      if (activeContact) {
        setPhoneNumber(activeContact.phone);
      } else {
        Alert.alert('Error', 'No hay contactos activos disponibles.');
      }
    } catch (error) {
      console.error('Error al obtener contactos:', error);
      Alert.alert('Error', 'Hubo un problema al obtener los contactos.');
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handlePanicButtonPress = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'No hay un número de contacto configurado.');
      return;
    }

    if (!location) {
      Alert.alert('Error', 'No se pudo obtener la ubicación.');
      return;
    }

    const { latitude, longitude } = location.coords;

    // Crear la URL para Google Maps
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;

    // Mensaje con el enlace a Google Maps
    const message = `¡Ayuda urgente! Mi ubicación actual está en:
 ${googleMapsUrl}`;

    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          Linking.openURL(url);
        } else {
          Alert.alert('Error', 'No se pudo abrir WhatsApp');
        }
      })
      .catch(() => {
        Alert.alert('Error', 'Hubo un problema al intentar enviar el mensaje');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePanicButtonPress}>
        <Icon name="notifications-active" size={200} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 50, justifyContent: 'center', alignItems: 'center' },
});

export default ButtonAlert;
