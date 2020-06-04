import React, {useState, useEffect} from 'react';
import { registerRootComponent, AppLoading} from 'expo';
import { Provider, connect } from 'react-redux';
import { LoadFonts } from 'homepairs-fonts';
import { AppState } from 'homepairs-types';
import { ActivityIndicator, StatusBar, AsyncStorage, BackHandler, Alert } from 'react-native';
import { PersistGate } from 'redux-persist/integration/react';
import { fetchGoogleApiKey } from 'homepairs-endpoints';
import * as firebase from 'firebase';
import { AppNavigator } from './src/components/AppNavigation';
import initializeStore from './src/state/store';

/* START OF FIREBASE */

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBZJ6lqYAYnKMctG2aNx8c6fq26PyH5UGM",
    authDomain: "homepairs.firebaseapp.com",
    databaseURL: "https://homepairs.firebaseio.com",
    projectId: "homepairs",
    storageBucket: "homepairs.appspot.com",
    messagingSenderId: "1072450456428",
    appId: "1:1072450456428:web:1f79a194e874316f6bc149",
    measurementId: "G-HQF4WK4WQY",
};

// Initialize Firebase
/* THIS BREAKS ON MOBILE!!!! */
/*
try {
    firebase.initializeApp(firebaseConfig);
} catch (err) {
    // we skip the “already exists” message which is
    // not an actual error when we’re hot-reloading
    if (!/already exists/.test(err.message)) {
        console.error("Firebase initialization error raised", err.stack);
    }
}
const firebaseApp = firebase; 
const performance_standalone = 'https://www.gstatic.com/firebasejs/7.14.4/firebase-performance-standalone.js';

(function (sa, fbc) {
    function load(f, c) {

        // NOTE: Why are you attempting to access the DOM, This will only work on web. For mobile 
        // platforms, their is not DOM. 
        
        var a = document.createElement('script');
        a.async = 1;
        a.src = f;
        var s = document.getElementsByTagName('script')[0];
        s.parentNode.insertBefore(a, s);
    } load(sa);
    window.addEventListener('load', function () { firebaseApp.performance(); });
})(performance_standalone, firebaseConfig);
firebase.analytics(firebaseApp);

/* END OF FIREBASE */

/* TODO: We can optimize this. Instead of holding the entire response, 
    we can hold only the information we need and create actions that deal with this use case.
    Also, we should be fetching our properties and preferredProviders after we have confirmed a 
    session is still valid. 
    */
const checkSession = async () => {
    await LoadFonts();
};

function mapStateToProps(state: AppState): any {
    return {
        authed: state.authenticated.authed,
    };
}
const ConnectedApp = connect(mapStateToProps)(AppNavigator);

const handleBackButton = () => {
    Alert.alert(
        'Exit App',
        'Exiting the application?', [
            {
                text: 'Cancel',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel',
            }, 
            {
                text: 'OK',
                onPress: () => BackHandler.exitApp(),
            },
        ], 
        { cancelable: false },
    );
    return true;
};

const App = () => {
    const [dataLoaded, setDataLoaded] = useState(false);
    
    
    useEffect(() => {
        BackHandler.addEventListener("hardwareBackPress", handleBackButton);
    }, [handleBackButton]);
    

    const { store, persistor } = initializeStore();
    store.dispatch(fetchGoogleApiKey());

    // Check to see if we have a valid session token. If we do, fetch the profile information again. 
    return !dataLoaded ?
        <AppLoading startAsync={checkSession} onFinish={() => { setDataLoaded(true); }} onError={(error) => console.log(error)}>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
        </AppLoading>
        : (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <ConnectedApp />
                </PersistGate>
            </Provider>
        );
};

export default App;

registerRootComponent(App);
