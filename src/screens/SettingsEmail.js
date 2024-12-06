import React, { useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, FormControl, Input, Button, Center, Link, Image } from 'native-base';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore"; // Importar funciones necesarias
import { db } from '../config/firebaseConfig'; // Importar la configuración de Firestore

export default function SettingsEmail({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Función para cambiar el correo electrónico
  const handleChangeEmail = async () => {
    try {
      // Verificar si el correo y la contraseña son correctos en Firestore
      const usersRef = collection(db, "users"); // Accede a la colección de usuarios
      const q = query(usersRef, where("email", "==", email)); // Filtra por el correo electrónico

      const querySnapshot = await getDocs(q); // Ejecuta la consulta
      if (querySnapshot.empty) {
        // Si no se encuentra el usuario
        setError('Usuario no encontrado');
        return;
      }

      // Si se encuentra al menos un usuario
      querySnapshot.forEach(async (docRef) => {
        const user = docRef.data();

        if (user.passw === password) {
          // Si la contraseña coincide, actualizamos el correo electrónico
          const userDoc = doc(db, "users", docRef.id); // Accedemos al documento del usuario
          await updateDoc(userDoc, {
            email: newEmail, // Actualiza el correo electrónico
          });

          setSuccessMessage('Correo electrónico cambiado con éxito');
          setError('');
        } else {
          // Si la contraseña no coincide
          setError('Contraseña incorrecta');
          setSuccessMessage('');
        }
      });
    } catch (error) {
      console.log('Error al cambiar el correo electrónico:', error);
      setError('Error al cambiar el correo electrónico. Intenta de nuevo');
      setSuccessMessage('');
    }
  };

  return (
    <Center style={{}}>
      <Box safeArea p="2" py="40" w="90%" maxW="290" mx="auto">
        
        
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>
              <Image source={require('../../assets/usuario.png')} alt="Mi imagen descriptiva" style={{ width: 20, height: 20 }} /> Correo Electrónico Actual
            </FormControl.Label>
            <Input
              placeholder="Ingresa tu correo actual"
              value={email}
              onChangeText={text => setEmail(text)}
              keyboardType="email-address"
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Image source={require('../../assets/llave2.png')} alt="Mi imagen descriptiva" style={{ width: 20, height: 20 }} /> Contraseña
            </FormControl.Label>
            <Input
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Image source={require('../../assets/usuario.png')} alt="Mi imagen descriptiva" style={{ width: 20, height: 20 }} /> Nuevo Correo Electrónico
            </FormControl.Label>
            <Input
              placeholder="Ingresa tu nuevo correo"
              value={newEmail}
              onChangeText={text => setNewEmail(text)}
              keyboardType="email-address"
            />
          </FormControl>

          {error && (
            <Text color="red.500" mt="2">{error}</Text>
          )}

          {successMessage && (
            <Text color="green.500" mt="2">{successMessage}</Text>
          )}

          <Button mt="2" colorScheme="red" onPress={handleChangeEmail}>
            Cambiar Correo Electrónico
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
