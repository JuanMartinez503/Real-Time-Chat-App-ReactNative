import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const ChatId = () => {
    const {chatid} = useLocalSearchParams()
    
  return (
    <View>
      <Text>ChatId : {chatid}</Text>
    </View>
  )
}

export default ChatId