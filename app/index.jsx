import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import Input from '../components/Input';
import Button from '../components/Button';
import ServiceItem from '../components/ServiceItem';
import CardItem from '../components/CardItem';
import TypeTable from '../components/TypeTable';
import SearchBar from '../components/SearchBar';
import AdminItem from '../components/AdminBooking';
import AdminHeaderItem from '../components/AdminHeaderItem';
import AdminNotification from '../components/AdminNotification';
import AdminBooking from '../components/AdminBooking';
const index = () => {
    return (
    <View style={styles.container}>
        <AdminHeaderItem icon="person" number="10" title="Admin Dashboard"></AdminHeaderItem>
        <AdminNotification icon="alert-circle-outline" title="Notifications"></AdminNotification>
        <AdminBooking icon="time-outline" time="12:00 PM" status="Confirmed" table="Table 5" people="4 People" customer="John Doe"></AdminBooking>
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