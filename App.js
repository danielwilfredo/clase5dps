import React, { useState, useEffect } from "react";
import {
  Text,
  View,
  FlatList,
  TextInput,
  Button,
  TouchableHighlight,
  StyleSheet,
  Image
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import shortid from "shortid";
import NumericInput from "react-native-numeric-input";

export default function App() {
  const [nombre, guardarInputTexto] = useState("");
  const [edad, setEdad] = useState(0);
  const [carrera, setCarrera] = useState("");
  const [lista, guardarlista] = useState([]);

  useEffect(() => {
    obtenerDatosStorage();
  }, []);

  const guardarDato = async () => {
    try {
      const nombrealumno = { nombre };
      nombrealumno.id = shortid.generate();
      const listaC = { ...nombrealumno, carrera, edad };
      console.log(listaC);

      const listanombres = [...lista, listaC];
      guardarlista(listanombres);

      const datos = JSON.stringify(listanombres);
      await AsyncStorage.setItem("listaalumnos", datos);
      guardarInputTexto("");
      setCarrera("");
      setEdad(1);
    } catch (error) {
      console.log(error);
    }
  };

  const obtenerDatosStorage = async () => {
    try {
      const nombreStorage = await AsyncStorage.getItem("listaalumnos");
      if (nombreStorage) {
        const datos = JSON.parse(nombreStorage);
        guardarlista(datos);
        console.log(`esta es la: ${lista}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const eliminarDato = async (id) => {
    try {
      const nombresFiltrados = lista.filter((nombre) => nombre.id !== id);
      guardarlista(nombresFiltrados);
      const datos = JSON.stringify(nombresFiltrados);
      await AsyncStorage.setItem("listaalumnos", datos);
      // await AsyncStorage.removeItem('listaalumnos');
      obtenerDatosStorage();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Text style={styles.titulo}>Administrador de Alumnos</Text>

      <View style={styles.contenedor}>
        <TextInput
          placeholder="Escribe tu Nombre"
          value={nombre}
          style={styles.input}
          onChangeText={(texto) => guardarInputTexto(texto)}
        />
        <TextInput
          placeholder="Carrera universitaria:"
          value={carrera}
          style={styles.input}
          onChangeText={(texto) => setCarrera(texto)}
        />
        <Text>Ingresa tu edad:</Text>
        <NumericInput
          value={edad}
          minValue={1}
          maxValue={99}
          step={1}
          onChange={(value) => setEdad(value)}
        />

        <Button title="Guardar" color="#333" onPress={() => guardarDato()} />

        <Text>
          {lista.length > 0 ? "Lista de alumnos" : "No hay alumnos, agrega uno"}
        </Text>
        {lista ? (
          <FlatList
            style={styles.item}
            data={lista}
            renderItem={({ item }) => (
              <>
              <View style={styles.item2}>
              <Text><Text style={styles.cardT}>Nombre: </Text> {item.nombre} 
                </Text>
                <Text>
                <Text style={styles.cardT}>Carrera: </Text>{item.carrera}
                </Text>
                <Text>
                <Text style={styles.cardT}>Edad: </Text> {item.edad}
                </Text>
                              <Button
                              title="X"
                              color="#eb144c"
                              style={styles.btnEliminar}
                              onPress={() => eliminarDato(item.id)}
                            />
              
              </View>
                            </>
            )}
            keyExtractor={(item) => item.id}
          />
        ) : null}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#FFF",
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    borderColor: "#666",
    borderBottomWidth: 1,
    width: 300,
    height: 40,
  },
  btnEliminar: {
    backgroundColor:"red",
    marginTop: 20,
    padding: 10,
  },
  textoEliminar: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    textTransform: "uppercase",
    width: 300,
  },
  item: {
    margin:15,
    marginVertical: 8,
    marginHorizontal: 16,
    width:250
  },
  titulo: {
    color: "#666",
    marginBottom: 20,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 70,
  },
  item2: {
    borderStyle:'solid',
    borderColor:"red",
    backgroundColor:'#E9E9E9',
    padding:5,
    margin:50,
    marginVertical: 8,
    marginHorizontal: 16,
  },
  cardT:{
    fontSize:15,
    fontWeight:'bold',
    color:'#7e7e7e'
  }
});
