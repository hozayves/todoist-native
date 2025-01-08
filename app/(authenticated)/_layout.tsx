import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { useWindowDimensions } from 'react-native'

const Layout = () => {
    const { height } = useWindowDimensions()
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
        </Stack>
    )
}

export default Layout