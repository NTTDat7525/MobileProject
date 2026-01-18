import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import ServiceItem from '../components/ServiceItem';
import CardItem from '../components/CardItem';
import TypeTable from '../components/TypeTable';
import SearchBar from '../components/SearchBar';
const index = () => {
    return (
    <View style={styles.container}>
        
        <Button title="Get Started" />

        <Input  icon="person-outline" 
                placeholder="Enter username" 
                value={''}
                onChangeText={() => {}} />
                
        <Input icon="lock-closed-outline" 
                placeholder="Enter password" 
                value={''}
                onChangeText={() => {}} 
                secureTextEntry={true} />

        <ServiceItem title="Service 1" />

        <CardItem title="Restaurant" description="Description of the restaurant" />

        <TypeTable />

        <SearchBar  value = {''}
                    onChangeText={() => {}} 
                    secureTextEntry={true} />
    </View>
    );
};

export default index;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'gray',
        justifyContent: 'center',
        alignItems: 'center',
    },
});