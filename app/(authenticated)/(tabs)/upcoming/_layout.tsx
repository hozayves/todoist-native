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
                    title: 'Upcoming',
                    headerShadowVisible: false,
                    headerRight: () => <MoreButton pageName='upcoming' />,
                    headerTitleAlign: 'center'
                }}
            />
        </Stack>
    )
}

export default Layout