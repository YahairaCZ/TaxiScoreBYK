import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Switch, StyleSheet, ScrollView, Alert } from 'react-native';
import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, orderBy, limit, getDocs, onSnapshot } from 'firebase/firestore';

const PersonalContact = () => {
  const [contact1, setContact1] = useState('');
  const [contact2, setContact2] = useState('');
  const [contact3, setContact3] = useState('');
  const [numcontact1, setNumContact1] = useState('');
  const [numcontact2, setNumContact2] = useState('');
  const [numcontact3, setNumContact3] = useState('');
  const [isContact1Active, setIsContact1Active] = useState(false);
  const [isContact2Active, setIsContact2Active] = useState(false);
  const [isContact3Active, setIsContact3Active] = useState(false);

  useEffect(() => {
    const fetchLastContacts = async () => {
      try {
        const q = query(collection(db, 'contacts'), orderBy('timestamp', 'desc'), limit(3));
        const querySnapshot = await getDocs(q);
        const fetchedContacts = querySnapshot.docs.map(doc => doc.data());

        if (fetchedContacts.length > 0) {
          setContact1(fetchedContacts[0]?.name || '');
          setNumContact1(fetchedContacts[0]?.phone || '');
          setIsContact1Active(fetchedContacts[0]?.isActive || false);
        }
        if (fetchedContacts.length > 1) {
          setContact2(fetchedContacts[1]?.name || '');
          setNumContact2(fetchedContacts[1]?.phone || '');
          setIsContact2Active(fetchedContacts[1]?.isActive || false);
        }
        if (fetchedContacts.length > 2) {
          setContact3(fetchedContacts[2]?.name || '');
          setNumContact3(fetchedContacts[2]?.phone || '');
          setIsContact3Active(fetchedContacts[2]?.isActive || false);
        }
      } catch (error) {
        console.error('Error al obtener contactos:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los contactos recientes.');
      }
    };

    fetchLastContacts();
  }, []);

  const saveContactsToFirestore = async () => {
    try {
      const contactsCollection = collection(db, 'contacts');
      const timestamp = new Date();

      await addDoc(contactsCollection, { name: contact1, phone: numcontact1, isActive: isContact1Active, timestamp });
      await addDoc(contactsCollection, { name: contact2, phone: numcontact2, isActive: isContact2Active, timestamp });
      await addDoc(contactsCollection, { name: contact3, phone: numcontact3, isActive: isContact3Active, timestamp });

      Alert.alert('Éxito', 'Contactos guardados en Firebase!');
    } catch (error) {
      console.error('Error al guardar contactos:', error);
      Alert.alert('Error', 'Hubo un problema al guardar los contactos.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Ingresa los detalles de tus contactos</Text>

      <Text style={styles.label}>Contacto 1</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={contact1} onChangeText={setContact1} />
      <TextInput style={styles.input} placeholder="Número" value={numcontact1} onChangeText={setNumContact1} />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Activo</Text>
        <Switch value={isContact1Active} onValueChange={setIsContact1Active} />
      </View>

      <Text style={styles.label}>Contacto 2</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={contact2} onChangeText={setContact2} />
      <TextInput style={styles.input} placeholder="Número" value={numcontact2} onChangeText={setNumContact2} />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Activo</Text>
        <Switch value={isContact2Active} onValueChange={setIsContact2Active} />
      </View>

      <Text style={styles.label}>Contacto 3</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={contact3} onChangeText={setContact3} />
      <TextInput style={styles.input} placeholder="Número" value={numcontact3} onChangeText={setNumContact3} />
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Activo</Text>
        <Switch value={isContact3Active} onValueChange={setIsContact3Active} />
      </View>

      <Button title="Guardar Contactos" onPress={saveContactsToFirestore} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 20, fontWeight: 'bold', marginVertical: 20, textAlign: 'center' },
  label: { fontSize: 16, marginBottom: 5 },
  input: { height: 40, borderColor: '#ccc', borderWidth: 1, borderRadius: 5, paddingLeft: 10, marginBottom: 20 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  switchLabel: { fontSize: 16, marginRight: 10 },
});

export default PersonalContact;