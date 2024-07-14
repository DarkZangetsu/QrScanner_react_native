import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Share, Linking } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { BarCodeScanner } from 'expo-barcode-scanner';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export default function ScanImage() {
  const [image, setImage] = useState(null);
  const [scannedData, setScannedData] = useState('');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      scanQRCode(result.assets[0].uri);
    }
  };

  const scanQRCode = async (imageUri) => {
    try {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      if (status === 'granted') {
        const scannedCodes = await BarCodeScanner.scanFromURLAsync(imageUri);

        if (scannedCodes.length > 0) {
          setScannedData(scannedCodes[0].data);
          const storedHistory = await AsyncStorage.getItem('scanHistory');
          const history = storedHistory ? JSON.parse(storedHistory) : [];
          history.push(scannedCodes[0].data);
          await AsyncStorage.setItem('scanHistory', JSON.stringify(history));
        } else {
          setScannedData('No QR code found');
        }
      } else {
        setScannedData('Camera permission not granted');
      }
    } catch (error) {
      console.error('Error scanning QR code:', error);
      setScannedData('Error scanning QR code');
    }
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

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(scannedData);
    Toast.show({
      type: 'success',
      text1: 'Copié',
      text2: 'Le texte a été copié dans le presse-papiers',
      visibilityTime: 2000,
      autoHide: true,
      topOffset: 30,
      bottomOffset: 40,
    });
  };

  const openInBrowser = async () => {
    if (scannedData.startsWith('http')) {
      await Linking.openURL(scannedData);
    } else {
      // Gérer le cas où les données scannées ne sont pas une URL
      console.log('Les données scannées ne sont pas une URL valide');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.pickButton} onPress={pickImage}>
        <Ionicons name="image-outline" size={24} color="#fff" />
        <Text style={styles.pickButtonText}>Pick an image from gallery</Text>
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      {scannedData ? (
        <View style={styles.resultContainer}>
          <Text style={styles.resultLabel}>Scanned Data:</Text>
          <Text style={styles.resultText}>{scannedData}</Text>
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionButton} onPress={openInBrowser}>
              <Ionicons name="open-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Open</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={copyToClipboard}>
              <Ionicons name="copy-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Copy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={shareData}>
              <Ionicons name="share-social-outline" size={24} color="#fff" />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#00bfa5',
    padding: 20,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#00796b',
    padding: 15,
    borderRadius: 5,
    marginBottom: 20,
  },
  pickButtonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
    borderRadius: 10,
  },
  resultContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '100%',
  },
  resultLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#00796b',
  },
  resultText: {
    fontSize: 16,
    marginBottom: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#00796b',
    padding: 10,
    borderRadius: 5,
    width: '30%',
  },
  actionButtonText: {
    color: '#fff',
    marginTop: 5,
    fontSize: 12,
  },
});