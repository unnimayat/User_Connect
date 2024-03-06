import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import home from './components/home';
import login from './components/login';
import category from './components/category';
import signin from "./components/signin"
import createjoin from './components/createjoin'
import attendance from './components/attendence';
import unit from './components/unit';
import dashboard from './components/dashboard'
import editprofile from './components/editprofile';
import members from "./components/members"
import feed from "./components/feed"
import profile from './components/profile';
import sendinvitation from "./components/sendinvitation"
import announcements from "./components/announcements"
import pending from "./components/pending"
import minutes from "./components/minutes"
import ListingPage from "./components/list"
import map from "./components/map"
const Stack = createNativeStackNavigator();
import {i18next} from './assets/i18n/i18n'
import 'intl-pluralrules';

const MyStack = () => {
  return (
    
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="home"
          component={home}
          options={{title: ' '}}
        />
        <Stack.Screen name="login" component={login} options={{title:''}}/>
        <Stack.Screen name="createjoin" component={createjoin} options={{title:''}}/>
        <Stack.Screen name="attendance" component={attendance} options={{title:''}}/>
        <Stack.Screen name='unit' component={unit} options={{title:''}}/>
        <Stack.Screen name='dashboard' component={dashboard} options={{title:''}}/>
        <Stack.Screen name='editprofile' component={editprofile} options={{title:''}}/>
        <Stack.Screen name='members' component={members} options={{title:''}}/>
        <Stack.Screen name='sendinvitation' component={sendinvitation} options={{title:''}}/>
        <Stack.Screen name='feed' component={feed} options={{title:''}}/>
        <Stack.Screen name='profile' component={profile} options={{title:''}}/>
        <Stack.Screen name='announcements' component={announcements} options={{title:''}}/>       
        <Stack.Screen name='pending' component={pending} options={{title:''}}/>
        <Stack.Screen name='minutes' component={minutes} options={{title:''}}/>
        <Stack.Screen name="category" component={category} />
        <Stack.Screen name="ListingPage" component={ListingPage} />
        <Stack.Screen name="signin" component={signin} options={{title:''}}/>
        <Stack.Screen name="map" component={map} options={{ title: '' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default MyStack