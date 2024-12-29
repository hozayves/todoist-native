import { View, Text } from 'react-native'
import React from 'react'
import Fab from '@/components/Fab'
import { useSQLiteContext } from 'expo-sqlite'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { todos } from '@/db/schema'

const Page = () => {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)
    useDrizzleStudio(db)

    const { data } = useLiveQuery(drizzleDb.select().from(todos))
    console.log(data)
    return (
        <>
            <Text>Today Page</Text>
            <Fab />
        </>
    )
}

export default Page