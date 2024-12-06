import React, { useState } from 'react';
import { NativeBaseProvider, Box, Text, VStack, FormControl, Input, Button, Center, Link, Image } from 'native-base';
import { getFirestore, collection, getDocs, query, where } from "firebase/firestore"; // Importar Firestore
import { db } from '../config/firebaseConfig'; // Importar la configuración de Firestore

export default function LoginScreen({ onLogin, navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Función para autenticar al usuario
  const handleLogin = async () => {
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
      querySnapshot.forEach((doc) => {
        const user = doc.data();
        if (user.passw === password) {
          // Si la contraseña coincide
          console.log("Usuario autenticado:", user);
          onLogin(); // Llama a la función onLogin para cambiar el estado de autenticación
        } else {
          // Si la contraseña no coincide
          setError('Contraseña incorrecta');
        }
      });
    } catch (error) {
      console.log('Error al iniciar sesión:', error);
      setError('Error de autenticación. Intenta de nuevo');
    }
  };

  return (
    <Center style={{}}>
      <Box safeArea p="2" py="40" w="90%" maxW="290" mx="auto">
        <Image source={require('../../assets/logo.png')} alt="Mi imagen descriptiva" style={{ alignSelf: 'center', width: 200, height: 200 }} />
        
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
              <Image source={require('../../assets/llave2.png')} alt="Mi imagen descriptiva" style={{ width: 20, height: 20 }} /> Contraseña
            </FormControl.Label>
            <Input
              placeholder="Ingresa tu contraseña"
              value={password}
              onChangeText={text => setPassword(text)}
              secureTextEntry
            />
            <Link
              _text={{ fontSize: "xs", fontWeight: "500", color: "red" }}
              alignSelf="flex-end"
              mt="1"
              onPress={() => navigation.navigate('Registro')}  // Redirige directamente al Registro
            >
              Registrarse
            </Link>
          </FormControl>

          {error && (
            <Text color="red.500" mt="2">{error}</Text>
          )}

          <Button mt="2" colorScheme="red" onPress={handleLogin}>
            Iniciar Sesión
          </Button>
        </VStack>
      </Box>
    </Center>
  );
}
