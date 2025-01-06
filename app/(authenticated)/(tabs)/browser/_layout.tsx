import React from 'react'
import { Link, Stack } from 'expo-router'
import { useUser } from '@clerk/clerk-expo'
import { Image, StyleSheet } from 'react-native'
import { Colors } from '@/constants/Colors'
import { Ionicons } from '@expo/vector-icons'

const Layout = () => {
    return (
        <Stack screenOptions={{
            headerShadowVisible: false,
            contentStyle: { backgroundColor: Colors.background }
        }}>
            <Stack.Screen
                name='index'
                options={{
                    title: 'Browse',
                    headerLargeTitle: true,
                    headerTitleAlign: 'center',
                    headerLeft: () => <HeaderLeft />,
                    headerRight: () => <HeaderRight />
                }}
            />
            <Stack.Screen name='new-project' options={{
                presentation: 'modal',
                headerShown: false,
                headerShadowVisible: false
            }} />
        </Stack>
    )
}
const HeaderLeft = () => {
    const { user } = useUser()
    return (
        <Image source={{ uri: user?.imageUrl }} style={styles.avatar} />
    )
}
const HeaderRight = () => {
    return (
        // <Link href='/settings'>
        <Ionicons name='settings-outline' size={24} color={Colors.dark} />
        // </Link>
    )
}

const styles = StyleSheet.create({
    avatar: {
        width: 28,
        height: 28,
        borderRadius: 100
    }
})

export default Layout   