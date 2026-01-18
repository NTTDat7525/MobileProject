import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TextInput } from 'react-native'
import { Ionicons } from '@expo/vector-icons'

const Input = ({placeholder = '', icon, value, onChangeText, secureTextEntry = false}) => {
  return (
    <View style = {styles.container}>
      <View style = {styles.inputWrapper}> 
        {
          <Ionicons name={icon} 
                size={24} 
                color='#1E1E1E' 
                style={styles.icon} />
        }
        <TextInput  style={styles.input} 
                    placeholder={placeholder} 
                    value={value} 
                    onChangeText={onChangeText} 
                    secureTextEntry={secureTextEntry}></TextInput>
      </View>
    </View>
  )
}

export default Input

const styles = StyleSheet.create({
  container:{
    backgroundColor: '#FFFFFF',
    width: 358,
    height: 50,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    margin: 8
  },

  inputWrapper:{
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon:{
    color: '#1E1E1E',
    marginRight: 8,
  },

  input:{
    flex: 1,
    fontSize: 16,
    fontFamily: 'Arial',
  }
})