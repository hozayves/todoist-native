import React from 'react'
import { Stack } from 'expo-router'
import MoreButton from '@/components/MoreButton'
import { Colors } from '@/constants/Colors'
import { View, Text, StyleSheet } from 'react-native'
import { useSQLiteContext } from 'expo-sqlite'
import { todos } from '@/db/schema'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { eq } from 'drizzle-orm'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'

const Layout = () => {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)
    const { data } = useLiveQuery(drizzleDb.select()
        .from(todos)
        .where(eq(todos.completed, 0))
    )

    const count = data?.length || 0

    return (
        <Stack screenOptions={{
            contentStyle: { backgroundColor: Colors.background }
        }}>
            <Stack.Screen
                name='index'
                options={{
                    headerTitle: () => (
                        <View style={styles.headerTitle}>
                            <Text style={styles.headerTitleText}>Today</Text>
                            <Text style={styles.headerTitleTime}>{count} tasks</Text>
                        </View>
                    ),
                    headerLargeTitle: true,
                    headerRight: () => <MoreButton pageName='today' />
                }}
            />
        </Stack>
    )
}

const styles = StyleSheet.create({
    headerTitle: {
        justifyContent: 'center'
    },
    headerTitleText: {
        fontSize: 24,
        fontWeight: '400'
    },
    headerTitleTime: {
        fontSize: 14,
        fontWeight: '300'
    }
})

export default Layout