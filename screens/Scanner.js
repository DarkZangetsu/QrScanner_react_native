import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, TouchableOpacity, Linking, Animated, Share } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

export default function Scanner() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [scannedType, setScannedType] = useState('');
  const [scannedData, setScannedData] = useState('');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);
    setScannedType(type);
    setScannedData(data);
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
    // Save scan history
    const scanHistory = JSON.parse(await AsyncStorage.getItem('scanHistory')) || [];
    scanHistory.push({ type, data, date: new Date().toLocaleString() });
    await AsyncStorage.setItem('scanHistory', JSON.stringify(scanHistory));
  };

  const resetScan = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start(() => {
      setScanned(false);
      setScannedType('');
      setScannedData('');
    });
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(scannedData);
   
  };

  const shareData = async () => {
    try {
      await Share.share({
        message: scannedData,
      });
    } catch (error) {
      console.error('Error sharing data:', error);
    }
  };

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <Animated.View style={[styles.resultContainer, { opacity: fadeAnim }]}>
        {scanned && (
          <>
            <Text style={styles.label}>{scannedType}</Text>
            <Text style={styles.resultText}>{scannedData}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(scannedData)}>
                <Ionicons name="open-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Ouvrir</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={copyToClipboard}>
                <Ionicons name="copy-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Copier</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={shareData}>
                <Ionicons name="share-social-outline" size={24} color="white" />
                <Text style={styles.buttonText}>Partager</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.scanAgainButton} onPress={resetScan}>
              <Text style={styles.scanAgainText}>Tap to Scan Again</Text>
            </TouchableOpacity>
          </>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00bfa5',
  },
  resultContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 10,
    color: '#00796b',
  },
  resultText: {
    marginBottom: 20,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'column',
    alignItems: 'center',
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 5,
    width: '30%',
  },
  buttonText: {
    color: 'white',
    marginTop: 5,
    fontSize: 12,
  },
  scanAgainButton: {
    alignItems: 'center',
    padding: 10,
  },
  scanAgainText: {
    color: '#00796b',
    fontSize: 16,
  },
});