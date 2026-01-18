import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const TypeTable = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>TypeTable</Text>
    </View>
  )
}

export default TypeTable

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FF9E6B',
        width: 100,
        height: 41,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text:{
        color: '#2E2E2E',
        fontSize: 14,
        fontFamily: 'Arial',
    }
})