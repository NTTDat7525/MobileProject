import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Button = ({title}) => {
  return (
    <TouchableOpacity style = {styles.button} activeOpacity={0.8}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button;
const styles = StyleSheet.create({
    button: {
        backgroundColor: '#FF9E6B',
        height: 50,
        width: 358,
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
    },

    text: {
        color: '#2E2E2E',
        fontSize: 20,
        fontFamily: 'Arial'
    }
})