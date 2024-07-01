import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'

const create = () => {
  const [name, setName] = React.useState('')
  const [description, setDescription] = React.useState('')
  const [icon, setIcon] = React.useState('')

  const router = useRouter()
  const startGroup = useMutation(api.groups.createGroup)

  const onCreateGroup = async () => {
    await startGroup({
      name,
      description,
      icon_url: icon,
    })
    Alert.alert('Group Created')
    router.back()
  }
  return (
<KeyboardAvoidingView behavior="padding" style={styles.container}>
  <Text style={styles.label}>Name</Text>
  <TextInput
    style={styles.input}
    value={name}
    onChangeText={setName}
  />
    <Text style={styles.label}>Description</Text>
  <TextInput
    style={styles.input}
    value={description}
    onChangeText={setDescription}
  />
    <Text style={styles.label}>Icon URL</Text>
  <TextInput
    style={styles.input}
    value={icon}
    onChangeText={setIcon}
  />
  <TouchableOpacity style={styles.button} onPress={onCreateGroup}>
    <Text style={styles.buttonText}>Create Group</Text>
  </TouchableOpacity>
  </KeyboardAvoidingView>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5ea',
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#f8f5ea',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',


  },
  buttonText: {
    color: '#333',
  },
  
})

export default create