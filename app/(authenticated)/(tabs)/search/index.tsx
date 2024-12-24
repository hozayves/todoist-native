import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import Fab from '@/components/Fab'

const Page = () => {
    return (
        <>
            <ScrollView contentInsetAdjustmentBehavior='automatic'>
                <View>
                    <Text>Search Page</Text>
                </View>
            </ScrollView>
            {/* <Fab /> */}
        </>
    )
}

export default Page