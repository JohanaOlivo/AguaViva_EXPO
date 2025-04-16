import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, Pressable, Alert, ScrollView, Image } from 'react-native';
import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';
import HistorialScreen from './Historial';

// Inicializar base de datos
const initializeDatabase = async (db) => {
  try {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE,
        password TEXT
      );
    `);
    console.log('✅ Base de datos inicializada');
  } catch (error) {
    console.log('❌ Error inicializando la base de datos:', error);
  }
};

const Stack = createStackNavigator();

export default function App() {
  return (
    <SQLiteProvider databaseName='auth.db' onInit={initializeDatabase}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login'>
        <Stack.Screen
          name='Login'
          component={LoginScreen}
          options={{ title: <Text style={homeStyles.title}>AquaViva</Text> }} 
        />
          <Stack.Screen name='Register' component={RegisterScreen} />
          <Stack.Screen name='Home' component={HomeScreen} />
          <Stack.Screen
            name='Historial'
            component={HistorialScreen}
            options={{ title: 'Historial de Captación' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SQLiteProvider>
  );
}

// Pantalla de Login
const LoginScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!userName || !password) {
      Alert.alert('Atención', 'Completa usuario y contraseña');
      return;
    }

    try {
      const validUser = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ? AND password = ?',
        [userName, password]
      );

      if (validUser) {
        Alert.alert('✅ Bienvenido', userName);
        navigation.navigate('Home', { user: userName });
        setUserName('');
        setPassword('');
      } else {
        Alert.alert('❌ Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.log('Error en login:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={homeStyles.title}>Bienvenido a AquaViva</Text>
      <Text style={homeStyles.title}>Iniciar Sesión</Text>
      <Image
        source={{ uri: "https://islaurbana.org/wp-content/uploads/2022/09/home-icon-1.gif" }}
        style={homeStyles.image}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder='Usuario'
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder='Contraseña'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <Pressable style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Ingresar</Text>
      </Pressable>

      <Pressable style={styles.link} onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </Pressable>
    </View>
  );
};

// Pantalla de Registro
const RegisterScreen = ({ navigation }) => {
  const db = useSQLiteContext();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    if (!userName || !password || !confirmPassword) {
      Alert.alert('Atención', 'Completa todos los campos');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    try {
      const existingUser = await db.getFirstAsync(
        'SELECT * FROM users WHERE username = ?',
        [userName]
      );

      if (existingUser) {
        Alert.alert('Error', 'El usuario ya existe');
        return;
      }

      await db.runAsync(
        'INSERT INTO users (username, password) VALUES (?, ?)',
        [userName, password]
      );

      Alert.alert('✅ Registro exitoso');
      navigation.navigate('Login');
    } catch (error) {
      console.log('Error en registro:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={homeStyles.title}>Registrarse</Text>
      <Image
        source={{ uri: "https://islaurbana.org/wp-content/uploads/2022/09/home-icon-1.gif" }}
        style={homeStyles.image}
        resizeMode="contain"
      />

      <TextInput
        style={styles.input}
        placeholder='Usuario'
        value={userName}
        onChangeText={setUserName}
      />

      <TextInput
        style={styles.input}
        placeholder='Contraseña'
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder='Confirmar contraseña'
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <Pressable style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </Pressable>

      <Pressable style={styles.link} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
      </Pressable>
    </View>
  );
};

// Pantalla de Inicio (Dashboard)
const HomeScreen = ({ navigation, route }) => {
  const { user } = route.params;


  return (
    <ScrollView contentContainerStyle={homeStyles.container}>
      <Text style={homeStyles.title}>Bienvenido a AquaViva</Text>
      <Text style={homeStyles.subtitle}>Hola, {user} 👋</Text>
      <Text style={homeStyles.subtitle}>Sistema de captación pluvial inteligente</Text>

      <Image
        source={{ uri: "https://islaurbana.org/wp-content/uploads/2022/09/home-icon-1.gif" }}
        style={homeStyles.image}
        resizeMode="contain"
      />

      <View style={homeStyles.card}>
        <Ionicons name="water-outline" size={28} color="#00796b" />
        <Text style={homeStyles.cardTitle}>Nivel del tanque</Text>
        <Text style={homeStyles.cardValue}>75%</Text>
      </View>

      <View style={homeStyles.card}>
        <Ionicons name="cloud-outline" size={28} color="#00796b" />
        <Text style={homeStyles.cardTitle}>Pronóstico de lluvia</Text>
        <Text style={homeStyles.cardValue}>Moderada en 2 días</Text>
      </View>

      <View style={homeStyles.card}>
        <Ionicons name="bar-chart-outline" size={28} color="#00796b" />
        <Text style={homeStyles.cardTitle}>Última captación</Text>
        <Text style={homeStyles.cardValue}>350 Litros</Text>
      </View>

      <Pressable style={homeStyles.logoutButton} onPress={() => navigation.navigate('Historial')}>
        <Text style={homeStyles.logoutText}>Ver Historial</Text>
      </Pressable>

      <Pressable style={homeStyles.logoutButton} onPress={() => navigation.navigate('Login')}>
        <Text style={homeStyles.logoutText}>Cerrar sesión</Text>
      </Pressable>

      <Text style={homeStyles.footer}>Gracias por cuidar el agua con AquaViva 💧</Text>
    </ScrollView>
  );
};

// Estilos generales
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    marginVertical: 5,
    borderRadius: 5,
  },
  button: {
    backgroundColor: 'blue',
    padding: 12,
    marginVertical: 10,
    width: '100%',
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
  },
  link: {
    marginTop: 10,
  },
  linkText: {
    color: 'blue',
  },
});

// Estilos del Dashboard (Home)
const homeStyles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: "#e0f7fa",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#00796b",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#004d40",
    textAlign: "center",
    marginBottom: 8,
  },
  image: {
    width: 220,
    height: 150,
    marginBottom: 24,
  },
  card: {
    backgroundColor: "#ffffff",
    width: "100%",
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    color: "#00796b",
    marginTop: 8,
  },
  cardValue: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#004d40",
    marginTop: 4,
  },
  footer: {
    marginTop: 24,
    fontSize: 14,
    color: "#004d40",
    textAlign: "center",
  },
  logoutButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#00796b",
    borderRadius: 5,
    width: "100%",
  },
  logoutText: {
    color: "white",
    fontSize: 18,
    textAlign: "center",
  },
});
