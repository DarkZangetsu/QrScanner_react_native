import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './screens/Home';
import Scanner from './screens/Scanner';
import History from './screens/History';
import ScanImage from './screens/ScanImage';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Scanner" component={Scanner} />
        <Stack.Screen name="History" component={History} />
        <Stack.Screen name="ScanImage" component={ScanImage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
