import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const ChatId = () => {
    const {id} = useLocalSearchParams()
    
  return (
    <View>
      <Text>ChatId</Text>
    </View>
  )
}

export default ChatId