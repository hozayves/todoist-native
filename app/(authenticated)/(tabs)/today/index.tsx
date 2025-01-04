import { View, Text, SectionList, StyleSheet, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import Fab from '@/components/Fab'
import { useSQLiteContext } from 'expo-sqlite'
import { useDrizzleStudio } from 'expo-drizzle-studio-plugin'
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { projects, todos } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { format } from 'date-fns'
import { Todo } from '@/types/interfaces'
import TaskRow from '@/components/TaskRow'
import { Colors } from '@/constants/Colors'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Sentry from '@sentry/react-native'

interface Section {
    title: string,
    data: Todo[]
}

const Page = () => {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)
    useDrizzleStudio(db)

    const { data } = useLiveQuery(drizzleDb.select()
        .from(todos)
        .leftJoin(projects, eq(todos.project_id, projects.id))
        .where(eq(todos.completed, 0))
    )

    const [sectionListData, setSectionListData] = useState<Section[]>([])
    const { top } = useSafeAreaInsets()

    useEffect(() => {
        // Formated data todos with project name and color
        const formatedData = data?.map((item) => ({
            ...item.todos,
            project_name: item.projects?.name,
            project_color: item.projects?.color
        }))
        // Group tasks by day
        const groupedByDay = formatedData?.reduce((acc: { [key: string]: Todo[] }, task) => {
            const day = format(new Date(task.due_date) || new Date(), 'd MMM . eee');
            if (!acc[day]) {
                acc[day] = []
            }
            acc[day].push(task)
            return acc
        }, {})
        // Convert grouped data to sections array
        const listData: Section[] = Object.entries(groupedByDay || {}).map(([day, tasks]) => ({
            title: day,
            data: tasks
        }))

        // Sort sections by date
        listData.sort((a, b) => {
            const dateA = new Date(a.data[0].due_date || new Date())
            const dateB = new Date(b.data[0].due_date || new Date())
            return dateA.getTime() - dateB.getTime()
        })

        setSectionListData(listData)

    }, [data])

    return (
        <>
            <View style={[styles.container, { paddingTop: top + 20 }]}>
                <SectionList
                    showsVerticalScrollIndicator={false}
                    contentInsetAdjustmentBehavior='automatic'
                    sections={sectionListData}
                    renderItem={({ item }) => <TaskRow task={item} />}
                    renderSectionHeader={({ section }) => <Text style={styles.header}>{section.title}</Text>}
                // refreshControl={<RefreshControl refreshing={false} onRefresh={() => console.log("Section Refresh.")} />}
                />
            </View>
            <Fab />
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginBottom: 82,
    },
    header: {
        fontSize: 16,
        backgroundColor: '#fff',
        fontWeight: 'bold',
        padding: 14,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.lightBorder
    }
})

export default Page