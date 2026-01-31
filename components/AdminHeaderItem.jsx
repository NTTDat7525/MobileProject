import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
const AdminHeaderItem = ({icon, number, title}) => {
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
      <Text style={styles.number}>{number}</Text>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default AdminHeaderItem

const styles = StyleSheet.create({
    container:{
      backgroundColor: '#4987F4',
      width: 175,
      height: 125,
      borderRadius: 16,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      paddingLeft: 16,
  },

  inputWrapper:{
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6FA2F7',
  },
    icon:{
    color: '#ffffff',
  },
  number:{
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold'
  },
  title:{
    color: '#FFFFFF',
    fontSize: 14,}
})