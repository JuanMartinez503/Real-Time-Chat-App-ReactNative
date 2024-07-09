import { View, Text, KeyboardAvoidingView, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { useRouter } from 'expo-router'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Colors from '@/constants/Colors'

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
    backgroundColor: '#f5f5f5',
    padding: 10,
  },
  label: {
    fontWeight: 'bold',
    fontFamily: 'RobotoBold',
    marginVertical: 10,
  },
  input: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    borderWidth:StyleSheet.hairlineWidth,
    borderColor: Colors.primary,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 10,
  
    alignItems: 'center',
    marginTop: 20,


  },
  buttonText: {
    fontFamily: 'RobotoBold',
    color: '#fff',
  },
  
})

export default create