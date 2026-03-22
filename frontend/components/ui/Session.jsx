import React from 'react'
import { View, Text, StyleSheet, TextInput } from 'react-native';
export default Session = () => {
  return (
    <View style={styles.section}>
        <Text style={styles.labelRequest}>Special Request (Optional)</Text>
            <TextInput
                style={styles.textInput}
                multiline={true}
                numberOfLines={4}
                placeholder="e.g. Occasion, Allergies..."
                textAlignVertical="top"
            />
    </View>
  )
}

const styles = StyleSheet.create({
    section: {
        marginTop: 5,
        marginBottom: 10,
    },
    labelRequest: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    textInput: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 15,
        padding: 15,
        height: 100,
        backgroundColor: '#fff',
        fontSize: 16,
    },
})