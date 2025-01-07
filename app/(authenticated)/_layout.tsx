import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { useWindowDimensions } from 'react-native'

const Layout = () => {
    const { height } = useWindowDimensions()
    return (
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors.background } }}>
            <Stack.Screen name='(tabs)' options={{ headerShown: false }} />
            <Stack.Screen name='task/new' options={{
                presentation: 'formSheet',
                sheetAllowedDetents: height < 700 ? [0.22] : 'fitToContents',
                sheetGrabberVisible: true, // for ios
                sheetExpandsWhenScrolledToEdge: false, // for ios
                sheetCornerRadius: 10, // for ios
            }} />
            <Stack.Screen name='task/[id]' options={{
                presentation: 'formSheet',
                sheetAllowedDetents: height < 700 ? [0.22] : 'fitToContents',
                sheetGrabberVisible: true, // for ios
                sheetExpandsWhenScrolledToEdge: false, // for ios
                sheetCornerRadius: 10, // for ios
            }} />
        </Stack>
    )
}

export default Layout