import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ServiceItem = ({title}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
    </View>
  )
}

export default ServiceItem

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#F5E6CC",
        width: 171,
        height: 42,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 8,
    },
    title:{
        color: '#2E2E2E',
        fontSize: 16,
        fontFamily: 'Arial',
    }
})