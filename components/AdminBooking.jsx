import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
const AdminItem = (icon, time, status, table, people, customer) => {
  return (
    <View style = {styles.container}>
        <View style = {styles.inputWrapper}>
            {
                <Ionicons name={icon} 
                size={24} 
                color='#1E1E1E' 
                style={styles.icon} />
            }
            <Text style={styles.time}>{time}</Text>
            <Text style={styles.status}>{status}</Text>
        </View>

        <Text style={styles.customer}>{customer}</Text>
        <View style={styles.description}>
          <Text style={styles.table}>{table}</Text>
          <Text style={styles.people}>{people}</Text>
        </View>
        
    </View>
  )
}

export default AdminItem

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#FFFFFF',
    width: 358,
    height: 100,
  }
})