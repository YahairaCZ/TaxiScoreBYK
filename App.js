import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { NativeBaseProvider } from 'native-base';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import HomeScreen2 from './src/screens/HomeScreen2';
import NotificationScreen from './src/screens/NotificationScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import LoginScreen from './src/screens/LoginScreen';
import SettingsPassw from './src/screens/SettingsPassw';
import SettingsEmail from './src/screens/SettingsEmail';
import PersonalContact from './src/screens/PersonalContact';
import Drivers from './src/screens/Drivers';
import Calific from './src/screens/Calific';
import Coments from './src/screens/Coments';
import ButtonAlert from './src/screens/ButtonAlert';
import Registro from './src/screens/Registro';  // Asegúrate de que este esté correctamente importado

const Stack = createStackNavigator();

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = (navigation) => {
    setIsLoggedIn(false);
    navigation.navigate('Login'); // Cambié a 'navigate' para un flujo más simple
  };

  useEffect(() => {
    const backAction = () => {
      return false; // Deja que React Navigation maneje el botón "Atrás"
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  return (
    <NativeBaseProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          <Stack.Navigator>
            {/* Pantallas con barra superior habilitada */}
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: true, title: 'Inicio' }}
            />
            <Stack.Screen
              name="Home2"
              component={HomeScreen2}
              options={{ headerShown: true, title: 'Inicio2' }}
            />
            <Stack.Screen
              name="Notification"
              component={NotificationScreen}
              options={{ headerShown: true, title: 'Notificaciones' }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              initialParams={{ onLogout: handleLogout }}  // Pasar handleLogout como un parámetro
              options={{ headerShown: true, title: 'Configuración' }}
            />
            <Stack.Screen
              name="SettingsPassw"
              component={SettingsPassw}
              options={{ headerShown: true, title: 'Cambiar Contraseña' }}
            />
            <Stack.Screen
              name="SettingsEmail"
              component={SettingsEmail}
              options={{ headerShown: true, title: 'Cambiar Email' }}
            />
            <Stack.Screen
              name="PersonalContact"
              component={PersonalContact}
              options={{ headerShown: true, title: 'Contacto Personal' }}
            />
            <Stack.Screen
              name="Drivers"
              component={Drivers}
              options={{ headerShown: true, title: 'Conductores' }}
            />
            <Stack.Screen
              name="Calific"
              component={Calific}
              options={{ headerShown: true, title: 'Calificaciones' }}
            />
            <Stack.Screen
              name="Coments"
              component={Coments}
              options={{ headerShown: true, title: 'Coments' }}
            />
            <Stack.Screen
              name="ButtonAlert"
              component={ButtonAlert}
              options={{ headerShown: true, title: 'ButtonAlert' }}
            />
            {/* Asegúrate de que Registro esté en el Stack Navigator */}
            <Stack.Screen
              name="Registro"
              component={Registro} // Asegúrate de que el componente Registro esté correctamente importado
              options={{ headerShown: true, title: 'Registro' }}
            />
          </Stack.Navigator>
        ) : (
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login">
              {(props) => <LoginScreen {...props} onLogin={handleLogin} />}
            </Stack.Screen>
            {/* Aquí también debe estar el Registro */}
            <Stack.Screen
              name="Registro"
              component={Registro} // Registro también debe estar en esta parte
              options={{ headerShown: true, title: 'Registro' }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
