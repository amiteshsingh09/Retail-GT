// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Toast from 'react-native-toast-message';
import { Forget } from './src/Forgetpass';
import { Login } from './src/Login';
import { Itemlist } from './src/Itemlist';
import { Beat } from './src/BeatName';
import { AddToCart } from './src/AddToCart';
import { OrderReturn } from './src/OrderReturn';
import { ReturnCart } from './src/ReturnCart';
import { Ledger } from './src/Ledger';
import { DeliveryList } from "./src/DeliveryList";
import { SalesManager } from "./src/SalesManager";
import { RequestApproval } from "./src/RequestApproval";
import {RoleBasedNavigation} from './src/RoleBasedNavigation';
import { Indent } from "./src/Indent"; 
import { Collection } from "./src/Collection"; 
import { FrontScreen } from './src/FrontScreen';
import { View } from 'react-native-animatable';
import { CustomPicker } from "./src/CustomPicker";
import { IndentCart } from "./src/IndentCart";


const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='FrontScreen'>
      <Stack.Screen name="FrontScreen" component={FrontScreen}
      options={{headerShown:false}}
      />
      <Stack.Screen name="Collection" component={Collection}
      
      />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Forget" component={Forget} />
        <Stack.Screen name="Order" component={Itemlist} />
        <Stack.Screen name="Sale Return" component={OrderReturn} />
        <Stack.Screen 
          name="General Trading" 
          component={Beat}
          
        />
        <Stack.Screen name="Indent Cart" component={IndentCart} />
       
        <Stack.Screen name="CustomPicker" component={CustomPicker} />
        <Stack.Screen name="Home" 
        component={RoleBasedNavigation}
        options={{
          headerLeft: () => (
            <View style={{ width: 50 }} />
          ),
        }} />
         <Stack.Screen 
          name="Sale Cancellation Request"
          title='Sale'
          component={RequestApproval}
          options={{
            
          }}
        />
        <Stack.Screen name="Indent Request" component={Indent} />
        
        <Stack.Screen name="Cart" component={AddToCart} />
        <Stack.Screen name="Ledger" component={Ledger} />
       
        <Stack.Screen name="SalesManager" component={SalesManager} />
        <Stack.Screen name="DeliveryList" component={DeliveryList} 
        options={{
            headerLeft: () => null 
          }} /><Stack.Screen name="Return Cart" component={ReturnCart} />
      </Stack.Navigator>
      <Toast />
    </NavigationContainer>
  );
}

export default App;
