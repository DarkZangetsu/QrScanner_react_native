import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

export default function Home() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Text style={styles.header}>QR SCANNER</Text>
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.navigate('Scanner')} style={styles.navButton}>
          <Ionicons name="scan-outline" size={30} color="#fff" />
          <Text style={styles.navButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.main}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Scanner')}
        >
          <Ionicons name="qr-code-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Scan using the Camera</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ScanImage')}
        >
          <Ionicons name="image-outline" size={24} color="#fff" />
          <Text style={styles.buttonText}>Scan with gallery Image</Text>
        </TouchableOpacity>
        <Image 
          source={require('../assets/images.png')} 
          style={styles.qrImage} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00bfa5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    fontSize: 28,
    color: '#fff',
    fontWeight: 'bold',
    marginTop: 40,
  },
  navBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    padding: 10,
    backgroundColor: '#00796b',
  },
  navButton: {
    alignItems: 'center',
  },
  navButtonText: {
    color: '#fff',
    fontSize: 12,
  },
  main: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    padding: 20,
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 5,
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  qrImage: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});
