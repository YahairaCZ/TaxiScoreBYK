import React, { useState, useEffect } from 'react';  // Importamos las librerías necesarias para usar el estado y efectos secundarios.
import { View, Text, FlatList, StyleSheet } from 'react-native';  // Importamos los componentes de React Native para la interfaz.
import { db } from '../config/firebaseConfig';  // Importamos la configuración de Firebase para poder conectarnos a la base de datos.
import { collection, onSnapshot } from 'firebase/firestore';  // Importamos las funciones necesarias de Firebase Firestore para leer datos en tiempo real.

const HomeScreen2 = () => {
  // Usamos useState para crear dos estados: uno para los datos de los conductores y otro para los datos de los usuarios.
  const [conductores, setConductores] = useState([]);  // Inicializamos el estado de conductores como un arreglo vacío.
  const [usuarios, setUsuarios] = useState([]);  // Inicializamos el estado de usuarios como un arreglo vacío.

  // useEffect se usa para ejecutar código cuando el componente se monta o cuando alguna de sus dependencias cambia.
  useEffect(() => {
    // Creamos una suscripción en tiempo real para obtener los datos de la colección 'conductores' de Firebase.
    const unsubscribeConductores = onSnapshot(collection(db, 'conductores'), (snapshot) => {
      // 'snapshot' contiene todos los documentos de la colección 'conductores' en tiempo real.
      const nuevosConductores = snapshot.docs.map(doc => ({
        id: doc.id,  // Obtenemos el ID del documento.
        ...doc.data(),  // Obtenemos los datos del documento.
      }));
      setConductores(nuevosConductores);  // Actualizamos el estado 'conductores' con los nuevos datos obtenidos.
    });

    // Creamos otra suscripción en tiempo real para obtener los datos de la colección 'users' de Firebase.
    const unsubscribeUsuarios = onSnapshot(collection(db, 'users'), (snapshot) => {
      // 'snapshot' contiene todos los documentos de la colección 'users' en tiempo real.
      const nuevosUsuarios = snapshot.docs.map(doc => ({
        id: doc.id,  // Obtenemos el ID del documento.
        ...doc.data(),  // Obtenemos los datos del documento.
      }));
      setUsuarios(nuevosUsuarios);  // Actualizamos el estado 'usuarios' con los nuevos datos obtenidos.
    });

    // Este código se ejecutará cuando el componente se desmonte, y desactivará las suscripciones en tiempo real.
    return () => {
      unsubscribeConductores();  // Desactiva la suscripción de 'conductores' cuando el componente se desmonte.
      unsubscribeUsuarios();  // Desactiva la suscripción de 'usuarios' cuando el componente se desmonte.
    };
  }, []);  // El arreglo vacío [] significa que este efecto solo se ejecuta una vez, cuando el componente se monta.

  return (
    <View style={styles.container}>  
      <Text style={styles.title}>Lista de Conductores</Text>  
      
      
      <FlatList
        data={conductores}  
        keyExtractor={item => item.id}  
        renderItem={({ item }) => (  
          <View style={styles.card}>  
            <Text style={styles.name}>Nombre: {item.name_conduc}</Text>  
            <Text style={styles.numTaxi}>Número de Taxi: {item.num_taxi}</Text>  
          </View>
        )}
      />

     
      <Text style={[styles.title, { marginTop: 30 }]}>Lista de Usuarios</Text>  

      
      <FlatList
        data={usuarios}  
        keyExtractor={item => item.id}  
        renderItem={({ item }) => (  
          <View style={styles.card}>  
            <Text style={styles.name}>Nombre: {item.name_user}</Text>  
            <Text style={styles.numTaxi}>Correo: {item.email}</Text>  
            <Text style={styles.numTaxi}>Contraseña: {item.passw}</Text>  
          </View>
        )}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,  
    padding: 20, 
  },
  title: {
    fontSize: 24, 
    fontWeight: 'bold', 
    textAlign: 'center',  
  },
  card: {
    backgroundColor: '#f9f9f9',  
    padding: 15, 
    marginVertical: 10,  
    borderRadius: 5,  
    elevation: 3,  
  },
  name: {
    fontSize: 18,  
    fontWeight: '600', 
  },
  numTaxi: {
    fontSize: 16, 
  },
});

export default HomeScreen2; 





const HomeScreen = () => {
  const [topDrivers, setTopDrivers] = useState([]);

  useEffect(() => {
    // Consulta para obtener los 5 conductores mejor calificados
    const q = query(
      collection(db, 'ratings'),
      orderBy('rating', 'desc'),
      limit(5)
    );

    // onSnapshot devuelve una función de desuscripción, que es lo que necesitamos
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const driversData = [];
        snapshot.forEach((doc) => {
          driversData.push(doc.data());
        });
        setTopDrivers(driversData);
      },
      (error) => {
        console.log('Error fetching data:', error);
      }
    );

    // Desuscripción cuando el componente se desmonta
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      } else {
        console.log('unsubscribe no es una función:', unsubscribe);
      }
    };
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Top 5 Drivers</Text>
      {topDrivers.length > 0 ? (
        topDrivers.map((driver, index) => (
          <View style={styles.driverContainer} key={index}>
            <Text style={styles.driverName}>{driver.driverName}</Text>
            <Text style={styles.driverRating}>Rating: {driver.rating}</Text>
          </View>
        ))
      ) : (
        <Text>No drivers found.</Text>
      )}
    </View>
  );
};