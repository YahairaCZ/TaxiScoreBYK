import React, { useState, useEffect } from 'react';
import { ScrollView, TextInput, Button, Alert } from 'react-native';
import { Box, Text, Avatar, VStack, HStack, FlatList } from 'native-base';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { collection, doc, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../config/firebaseConfig';

export default function CommentsScreen({ route }) {
  const { id, nombre, noTaxi } = route.params;

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  // Cargar comentarios desde Firestore
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const q = query(collection(db, 'comments'), where('taxiId', '==', id));
        const querySnapshot = await getDocs(q);

        const fetchedComments = [];
        querySnapshot.forEach((doc) => {
          fetchedComments.push(doc.data().comment);
        });

        setComments(fetchedComments);
      } catch (error) {
        console.error('Error al cargar comentarios:', error);
      }
    };

    fetchComments();
  }, [id]);

  // Guardar nuevo comentario en Firestore
  const handleAddComment = async () => {
    if (newComment.trim() === '') {
      Alert.alert('Error', 'El comentario no puede estar vacío.');
      return;
    }

    try {
      await addDoc(collection(db, 'comments'), {
        taxiId: id,
        comment: newComment,
        timestamp: new Date(),
      });

      setComments([...comments, newComment]); // Actualiza el estado local
      setNewComment('');
      Alert.alert('Éxito', 'Comentario agregado correctamente.');
    } catch (error) {
      console.error('Error al guardar el comentario:', error);
      Alert.alert('Error', 'No se pudo guardar el comentario.');
    }
  };

  return (
    <ScrollView>
      {/* Perfil del Usuario */}
      <Box p="4" bg="gray.100">
        <HStack space={4} alignItems="center">
          <Icon name="person" size={50} color="#000" style={styles.profileIcon} />
          <VStack>
            <Text fontSize="lg" fontWeight="bold">{nombre}</Text>
            <Text color="gray.500">Taxi: {noTaxi}</Text>
          </VStack>
        </HStack>
      </Box>

      {/* Lista de Comentarios */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <Box p="3" borderBottomWidth="1" borderColor="gray.200">
            <Text>{item}</Text>
          </Box>
        )}
      />

      {/* Agregar un Nuevo Comentario */}
      <Box p="4">
        <TextInput
          style={{
            borderColor: 'gray',
            borderWidth: 1,
            borderRadius: 4,
            padding: 10,
            marginBottom: 10,
          }}
          placeholder="Escribe un comentario..."
          value={newComment}
          onChangeText={setNewComment}
        />
        <Button title="Agregar Comentario" onPress={handleAddComment} />
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
