import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'

const Layout = () => {
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='task/new' options={{ presentation: 'modal' }} />
            <Stack.Screen name='task/[id]' options={{ presentation: 'modal' }} />
        </Stack>
    )
}

export default Layout