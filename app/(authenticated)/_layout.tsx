import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'

const Layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }} />
    )
}

export default Layout