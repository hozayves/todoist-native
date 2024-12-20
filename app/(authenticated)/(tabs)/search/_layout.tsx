import React from 'react'
import { Stack } from 'expo-router'
import { Colors } from '@/constants/Colors'

const Layout = () => {
    return (
        <Stack screenOptions={{
            contentStyle: { backgroundColor: Colors.background }
        }}>
            <Stack.Screen
                name='index'
                options={{
                    title: 'Search',
                    headerLargeTitle: true,
                    headerSearchBarOptions: {
                        placeholder: 'Task, Project, and more...',
                        tintColor: Colors.primary,
                    }
                }}
            />
        </Stack>
    )
}

export default Layout