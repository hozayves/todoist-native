import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Fab from '@/components/Fab'


const Page = () => {
    return (
        <View style={styles.container}>
            <Text>Upcoming Page</Text>
            <Fab />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    }
})

export default Page