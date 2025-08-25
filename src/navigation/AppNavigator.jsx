import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import OpenPage from '../screens/OpenPage';
import LogIn from '../screens/LogIn';
import SignIn from '../screens/SignUp';
import OnboardingScreen from '../screens/OnboardingScreen';

import RealEstateSingleView from '../screens/properties/RealEstateSingleView';
import WalletInterface from '../screens/wallet/WalletInterface';
import Profile from '../screens/profile/Profile';
import MapScreen from '../screens/properties/MapScreen';
import GoldSingleView from '../screens/Gold/GoldSingleView';
import GreenSingleView from '../screens/Green/GreenSingleView';
import FinancialSingleView from '../screens/Financial/FinancialSingleView';
import Home from '../screens/home/Home';
import ZeroPage from '../screens/properties/ZeroPage';
import AssetDetails from '../screens/properties/AssetDetails';
import MarketScreen from '../screens/properties/MarketScreen';
import PortfolioScreen from '../screens/properties/PortfolioScreen';


const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
      <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">



        <Stack.Screen name="Onboarding" component={OnboardingScreen}
        options={{ headerShown: false }}  />

        <Stack.Screen name="OpenPage" component={OpenPage}
        options={{ headerShown: false }}  />

        <Stack.Screen name="LogIn" component={LogIn}
        options={{ headerShown: false }}  />

        <Stack.Screen name="SignIn" component={SignIn} 
        options={{ headerShown: false }} />

        {/* <Stack.Screen name="AllScreen" component={AllScreen} 
        options={{ headerShown: false }} /> */}

        <Stack.Screen name="MarketScreen" component={MarketScreen}
         options={{ headerShown: false }}  />

        <Stack.Screen name="RealEstateSingleView" component={RealEstateSingleView}
         options={{ headerShown: false }}  />

         <Stack.Screen name="GoldSingleView" component={GoldSingleView}
         options={{ headerShown: false }}  />

         <Stack.Screen name="GreenSingleView" component={GreenSingleView}
         options={{ headerShown: false }}  />

         <Stack.Screen name="FinancialSingleView" component={FinancialSingleView}
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
        <Stack.Screen name="ZeroPage" component={ZeroPage}
         options={{ headerShown: false }}  />
        <Stack.Screen name="AssetDetails" component={AssetDetails}
         options={{ headerShown: false }}  />
         <Stack.Screen name="PortfolioScreen" component={PortfolioScreen}
         options={{ headerShown: false }}  />
        



          

      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
