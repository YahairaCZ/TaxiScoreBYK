import React, { useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, FormControl, Input, Button, Center, Link, Image } from 'native-base';
import { getFirestore, collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore"; // Importar funciones necesarias
import { db } from '../config/firebaseConfig'; // Importar la configuración de Firestore

export default function SettingsPassw({ navigation }) {
  const [email, setEmail] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Función para cambiar la contraseña
  const handleChangePassword = async () => {
    try {
      // Verificar si el correo y la contraseña antigua son correctos en Firestore
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

        if (user.passw === oldPassword) {
          // Si la contraseña antigua coincide, actualizamos con la nueva
          const userDoc = doc(db, "users", docRef.id); // Accedemos al documento del usuario
          await updateDoc(userDoc, {
            passw: newPassword, // Actualiza la contraseña
          });

          setSuccessMessage('Contraseña cambiada con éxito');
          setError('');
        } else {
          // Si la contraseña antigua no coincide
          setError('Contraseña antigua incorrecta');
          setSuccessMessage('');
        }
      });
    } catch (error) {
      console.log('Error al cambiar la contraseña:', error);
      setError('Error al cambiar la contraseña. Intenta de nuevo');
      setSuccessMessage('');
    }
  };

  return (
    <Center style={{}}>
      <Box safeArea p="2" py="40" w="90%" maxW="290" mx="auto">
        
        
        <VStack space={3} mt="5">
          <FormControl>
            <FormControl.Label>
              <Image source={require('../../assets/usuario.png')} alt="Mi imagen descriptiva" style={{ width: 20, height: 20 }} /> Correo Electrónico
            </FormControl.Label>
            <Input
              placeholder="Ingresa tu correo"
              value={email}
              onChangeText={text => setEmail(text)}
              keyboardType="email-address"
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Image source={require('../../assets/llave2.png')} alt="Mi imagen descriptiva" style={{ width: 20, height: 20 }} /> Contraseña Actual
            </FormControl.Label>
            <Input
              placeholder="Ingresa tu contraseña actual"
              value={oldPassword}
              onChangeText={text => setOldPassword(text)}
              secureTextEntry
            />
          </FormControl>

          <FormControl>
            <FormControl.Label>
              <Image source={require('../../assets/llave2.png')} alt="Mi imagen descriptiva" style={{ width: 20, height: 20 }} /> Nueva Contraseña
            </FormControl.Label>
            <Input
              placeholder="Ingresa tu nueva contraseña"
              value={newPassword}
              onChangeText={text => setNewPassword(text)}
              secureTextEntry
            />
          </FormControl>

          {error && (
            <Text color="red.500" mt="2">{error}</Text>
          )}

          {successMessage && (
            <Text color="green.500" mt="2">{successMessage}</Text>
          )}

          <Button mt="2" colorScheme="red" onPress={handleChangePassword}>
            Cambiar Contraseña
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
