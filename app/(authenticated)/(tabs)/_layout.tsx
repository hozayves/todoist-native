import React from 'react'
import { Stack, Tabs } from 'expo-router'
import { Colors } from '@/constants/Colors'
import { MaterialCommunityIcons, Entypo, Ionicons } from '@expo/vector-icons'

const Layout = () => {
    return (
        <Tabs screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: Colors.primary,
            tabBarInactiveTintColor: Colors.dark
        }}>
            <Tabs.Screen
                name='today'
                options={{
                    title: 'Today',
                    tabBarIcon: ({ focused, size }) => (
                        focused
                            ?
                            <Ionicons name="calendar-number" size={size + 2} color={Colors.primary} />
                            :
                            <Ionicons name='calendar-number-outline' size={size} />
                    )
                }} />
            <Tabs.Screen
                name='upcoming'
                options={{
                    title: 'Upcoming',
                    tabBarIcon: ({ focused, size }) => (
                        focused
                            ?
                            <Ionicons name='calendar-outline' size={size + 2} color={Colors.primary} />
                            :
                            <Ionicons name='calendar-outline' size={size} />
                    )
                }} />
            <Tabs.Screen
                name='search'
                options={{
                    title: 'Search',
                    tabBarIcon: ({ focused, size }) => (
                        focused
                            ?
                            <Ionicons name="search-outline" size={size + 2} color={Colors.primary} />
                            :
                            <Ionicons name='search-outline' size={size} />
                    )
                }} />
            <Tabs.Screen
                name='browser'
                options={{
                    title: 'Browser',
                    tabBarIcon: ({ focused, size }) => (
                        focused
                            ?
                            <Entypo name='text-document' size={size + 2} color={Colors.primary} />
                            :
                            <Entypo name='text-document' size={size} />
                    )
                }} />
        </Tabs>
    )
}

export default Layout