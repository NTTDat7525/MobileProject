import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
const AdminNotification = ({icon, title}) => {
  return (
    <View style = {styles.container}>
        <View style = {styles.inputWrapper}> 
        {
            <Ionicons name={icon} 
                size={24} 
                color='#1E1E1E' 
                style={styles.icon} />
        }
        </View>
        <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default AdminNotification

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#EFF6FF',
        borderColor: '#BEDBFF',
        borderWidth: 2,
        borderRadius: 12,
        padding: 12,
        width: 358,
        height: 45,
        flexDirection: 'row',
        alignItems: 'center',
    },
    icon:{
        height: 24,
        width: 24,
        marginRight: 8,
        color: '#2B7FFF',
    },
})