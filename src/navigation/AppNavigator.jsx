import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import LogIn from '../screens/LogIn';
import SignUp from '../screens/SignUp';

import WalletInterface from '../screens/wallet/WalletInterface';
import Profile from '../screens/profile/Profile';
import MapScreen from '../screens/properties/MapScreen';

import AssetDetails from '../screens/Market/AssetDetails';

import Home from '../screens/home/Home';
import AiPage from '../screens/properties/AiPage';
import MarketScreen from '../screens/properties/MarketScreen';
import PortfolioScreen from '../screens/properties/PortfolioScreen';

import NotificationScreen from '../screens/NotificationScreen';
import PersonalInfo from '../screens/profile/PersonalInfo';
import Rewards from '../screens/profile/Rewards';
import SendScreen from '../screens/wallet/SendScreen';
import ReceiveScreen from '../screens/wallet/ReceiveScreen';
import DepositScreen from '../screens/wallet/DepositScreen';
import WithdrawScreen from '../screens/wallet/WithdrawScreen';
import BuyScreen from '../screens/Market/BuyScreen';
import LinkedBankAccountsScreen from '../screens/profile/LinkedBankAccountsScreen';
import LoginScreen from '../screens/LoginScreen';
import Test from '../screens/Test';
import Register from '../screens/Register';
const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">

         <Stack.Screen name="LoginScreen" component={LoginScreen}
        options={{ headerShown: false }}  />
          <Stack.Screen name="Register" component={Register}
        options={{ headerShown: false }}  />


        <Stack.Screen name="LogIn" component={LogIn}
        options={{ headerShown: false }}  />

        <Stack.Screen name="SignUp" component={SignUp} 
        options={{ headerShown: false }} />

        

        <Stack.Screen name="MarketScreen" component={MarketScreen}
         options={{ headerShown: false }}  />

        

         

         <Stack.Screen name="AssetDetails" component={AssetDetails}
         options={{ headerShown: false }}  />

           <Stack.Screen name="BuyScreen" component={BuyScreen}
         options={{ headerShown: false }}  />

         



        <Stack.Screen name="Home" component={Home}
        options={{ headerShown: false }}  />

         <Stack.Screen name="WalletInterface" component={WalletInterface} 
          options={{ headerShown: false }} />

        <Stack.Screen name="Profile" component={Profile} 
          options={{ headerShown: false }} />

           <Stack.Screen name="MapScreen" component={MapScreen} 
          options={{ headerShown: false }} />

        <Stack.Screen name="Marketplace" component={MarketScreen}
         options={{ headerShown: false }}  />
        <Stack.Screen name="AiPage" component={AiPage}
         options={{ headerShown: false }}  />
      
         <Stack.Screen name="PortfolioScreen" component={PortfolioScreen}
         options={{ headerShown: false }}  />
         
         <Stack.Screen name="NotificationScreen" component={NotificationScreen}
         options={{ headerShown: false }}  />
          <Stack.Screen name="PersonalInfo" component={PersonalInfo}
         options={{ headerShown: false }}  />
          <Stack.Screen name="Rewards" component={Rewards}
         options={{ headerShown: false }}  />
          <Stack.Screen name="SendScreen" component={SendScreen}
         options={{ headerShown: false }}  />
         <Stack.Screen name="ReceiveScreen" component={ReceiveScreen}
         options={{ headerShown: false }}  />
         <Stack.Screen name="DepositScreen" component={DepositScreen}
         options={{ headerShown: false }}  />
          <Stack.Screen name="WithdrawScreen" component={WithdrawScreen}
         options={{ headerShown: false }}  />
         <Stack.Screen name="LinkedBankAccountsScreen" component={LinkedBankAccountsScreen}
         options={{ headerShown: false }}  />
        
         <Stack.Screen name="Test" component={Test}
         options={{ headerShown: false }}  />
        



          

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
