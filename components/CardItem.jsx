import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const CardItem = ({title, description}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.image}>IMG</Text>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  )
}

export default CardItem

const styles = StyleSheet.create({
    container:{
        backgroundColor: "#FFFFFF",
        width: 358,
        height: 132,
        borderRadius: 16,
        flexDirection: 'row',
        padding: 19
    },

    image:{
        backgroundColor: '#D9D9D9',
        width: 106,
        height: 94,
        borderRadius: 16,

        textAlignVertical: 'center',
        textAlign: 'center',
    },

    textContainer:{
        marginLeft: 19,
    },

    title:{
        color: '#2E2E2E',
        fontSize: 20,
        fontFamily: 'Arial',
        fontWeight: 'Bold',
    }
})