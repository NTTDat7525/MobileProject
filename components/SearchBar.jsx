import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { TextInput } from 'react-native'
const SearchBar = ({ value, onChangeText, secureTextEntry = false }) => {
  return (
    <View style={styles.container}>
        <Ionicons name="search-outline"
                size={24} 
                color='#1E1E1E' 
                style={styles.icon} />
      <TextInput style={styles.text} placeholder='Nhập từ khóa'
                    value={value} 
                    onChangeText={onChangeText} 
                    secureTextEntry={secureTextEntry}></TextInput>
    </View>
  )
}

export default SearchBar

const styles = StyleSheet.create({
    container:{
        backgroundColor: '#FFFFFF',
        width: 358,
        height: 50,
        borderRadius: 12,
        padding: 13,
        flexDirection: 'row',
        alignItems: 'center',
    },

    icon:{
        marginRight: 8,
    },

    text:{
        color: '#1E1E1E',
        fontSize: 16,
        fontFamily: 'Arial',
    }
})