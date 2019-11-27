import React from 'react'; //**For every file that uses jsx, YOU MUST IMPORT REACT  */
import { StyleSheet, Text,SafeAreaView, ScrollView, View} from 'react-native';
import {MainAppStyles} from '../MainAppStyles'
import MainScreen from '../MainScreen';
import HomePairsHeader from '../../../Components/Navigation/HomePairsHeader/HomePairsHeader';


export default class AccountScreen extends MainScreen {
  render() {
    return(
        <SafeAreaView style={MainAppStyles.pallet}>
            <ScrollView 
            style={{flex: 1}} 
            contentContainerStyle={MainAppStyles.assetLoadedContainer}
            directionalLockEnabled={true}
            automaticallyAdjustContentInsets={false}>
                <Text style={styles.container}>Account</Text>
            </ScrollView>
        </SafeAreaView>
    );
}
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
});