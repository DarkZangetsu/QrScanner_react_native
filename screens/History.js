import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

export default function History() {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // Fetch history from local storage or API
    const fetchHistory = async () => {
      try {
        const historyData = await AsyncStorage.getItem('scanHistory');
        if (historyData) {
          setHistory(JSON.parse(historyData));
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchHistory();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>Type: {item.type}</Text>
            <Text>Data: {item.data}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
