import { View, Text, ScrollView, StyleSheet, TouchableOpacity , Image} from 'react-native'
import React from 'react'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Link } from 'expo-router'

const index = () => {
  const groups = useQuery(api.groups.get) || []
  console.log(groups)
  return (
    <View style={{
      flex: 1,
    }}>
      <ScrollView style={styles.container}>
        {groups.map((group) => (
          <Link key={group._id} href={{pathname:'/(chat)/[chatid]', params: {chatid:group._id}}} asChild>
            <TouchableOpacity style={styles.group}>
              <Image source={{uri: group.icon_url}} style={{width: 50, height: 50, borderRadius: 25}} />
              <View>
                <Text
                style={{
                  fontWeight: 'bold',
                }}>{group.name}</Text>
                <Text style={{color:'#888'}}>{group.description}</Text>
              </View>
            </TouchableOpacity>
          </Link>
        ))}
      </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f5ea',
    padding: 10,
  },
  group:{
    flex: 1,
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    elevation:3,
    shadowRadius: 3.84,
  }
})

export default index