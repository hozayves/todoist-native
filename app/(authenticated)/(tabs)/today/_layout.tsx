import React from 'react'
import { Stack } from 'expo-router'
import MoreButton from '@/components/MoreButton'
import { Colors } from '@/constants/Colors'

const Layout = () => {
    return (
        <Stack screenOptions={{
            contentStyle: { backgroundColor: Colors.background }
        }}>
            <Stack.Screen
                name='index'
                options={{
                    title: 'Today',
                    headerLargeTitle: true,
                    headerRight: () => <MoreButton />
                }}
            />
        </Stack>
    )
}

export default Layout