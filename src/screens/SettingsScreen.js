import React from 'react';
import { Text, View, SafeAreaView, TouchableOpacity, StyleSheet } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function SettingsScreen({ route, navigation }) {
    const { onLogout } = route.params; // Acceder a onLogout desde los parámetros

    return (
        <SafeAreaView style={styles.safeAV}>

            <View><Text style={styles.nameuser}>Hola! Usuario</Text></View>

            <View style={styles.ItemSC}>
                <Icon name="lock" size={30} color="black" style={{ width: '35%' }} />
                <Text style={{ height: 45, width: '40%' }}>Password</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SettingsPassw')}>
                    <Icon name="chevron-right" size={30} color="black" style={{ height: 50 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.ItemSC}>
                <Icon name="email" size={30} color="black" style={{ width: '35%' }} />
                <Text style={{ height: 45, width: '40%' }}>Email</Text>
                <TouchableOpacity onPress={() => navigation.navigate('SettingsEmail')}>
                    <Icon name="chevron-right" size={30} color="black" style={{ height: 50 }} />
                </TouchableOpacity>
            </View>

            <View style={styles.ItemSC}>
                <Icon name="group" size={30} color="black" style={{ width: '35%' }} />
                <Text style={{ height: 45, width: '40%' }}>Personal Contact</Text>
                <TouchableOpacity onPress={() => navigation.navigate('PersonalContact')}>
                    <Icon name="chevron-right" size={30} color="black" style={{ height: 50 }} />
                </TouchableOpacity>
            </View>

            {/* Aquí aplicamos el onLogout en el botón de log out */}
            <View style={styles.butlog}>
                <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => onLogout(navigation)}  // Llamamos a onLogout pasando navigation
                >
                    <Text>Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    nameuser: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 10,
    },
    safeAV: {
        marginVertical: 1,
        borderColor: '#00000020',
        borderWidth: 0,
    },
    ItemSC: {
        padding: 5,
        borderBottomWidth: 5,
        borderBottomColor: '#ccc',
        backgroundColor: '#ffff',
        borderRadius: 0,
        marginBottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderRadius: 20,
    },
    butlog: {
        textShadowColor: 'black',
        marginTop: 80,  // Mantiene el espacio arriba
        alignItems: 'center',  // Centra el contenido horizontalmente
        paddingHorizontal: 15,  // Aumenta espacio horizontal para que no toque los bordes
        paddingVertical: 10,  // Añade algo de espacio vertical
        borderBottomWidth: 5,
        borderBottomColor: '#ccc',
        backgroundColor: '#fff', // Color de fondo
        alignSelf: 'center',  // Centra el View horizontalmente en la pantalla
        borderRadius: 300,  // Bordes redondeados
    },
});
