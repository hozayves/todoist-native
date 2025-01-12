import { View, Text, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Fab from '@/components/Fab'
import { useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useSQLiteContext } from 'expo-sqlite'
import { Calendar, CalendarProvider, ExpandableCalendar, AgendaList } from 'react-native-calendars'
import { drizzle } from 'drizzle-orm/expo-sqlite'
import { format, parse } from 'date-fns'
import { eq } from 'drizzle-orm'
import { todos, projects } from '@/db/schema'
import { Todo } from '@/types/interfaces'
import { MarkedDates } from 'react-native-calendars/src/types'
import TaskRow from '@/components/TaskRow'
import { Colors } from '@/constants/Colors'

// @ts-ignore fix for defaultProps warning: https://github.com/wix/react-native-calendars/issues/2455
ExpandableCalendar.defaultProps = undefined
interface Section {
    title: string,
    data: Todo[]
}

const Page = () => {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)

    const { data } = useLiveQuery(drizzleDb.select()
        .from(todos)
        .leftJoin(projects, eq(todos.project_id, projects.id))
        .where(eq(todos.completed, 0))
    )

    const [agendaItems, setAgendaItems] = useState<Section[]>([])

    const withProjectData = data?.map((item) => ({
        ...item.todos,
        project_name: item.projects?.name,
        project_color: item.projects?.color
    }))

    const markedDates: MarkedDates = {}
    withProjectData
        .map((todo) => {
            if (todo.due_date) {
                markedDates[new Date(todo.due_date).toISOString().split('T')[0]] = {
                    marked: true,
                    dotColor: todo.project_color
                }
            }
        })
        .filter(Boolean)

    useEffect(() => {
        // Formated data todos with project name and color
        const formatedData = data?.map((item) => ({
            ...item.todos,
            project_name: item.projects?.name,
            project_color: item.projects?.color
        }))
        // Group tasks by day
        const groupedByDay = formatedData?.reduce((acc: { [key: string]: Todo[] }, task) => {
            const day = format(new Date(task.due_date || new Date()), 'dd-MM-yyyy');
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

        setAgendaItems(listData)

    }, [data])
    return (
        <>
            <CalendarProvider
                showTodayButton
                theme={{
                    todayButtonTextColor: '#000',
                    todayBackgroundColor: '#000',
                }}
                date={new Date().toISOString()}
            >
                <ExpandableCalendar
                    markedDates={markedDates}
                    hideArrows
                    closeOnDayPress
                    theme={{
                        todayTextColor: Colors.primary,
                        todayButtonFontSize: 24,
                        textDisabledColor: Colors.lightText,
                        textDayFontWeight: '300',
                        textMonthFontWeight: 'bold',
                        textDayFontSize: 16,
                        textMonthFontSize: 18,
                        selectedDayBackgroundColor: Colors.primary,
                        selectedDayTextColor: '#fff',
                        todayButtonFontWeight: 'bold',
                    }}
                />
                <AgendaList
                    sections={agendaItems}
                    renderItem={({ item }) => <TaskRow task={item} />}
                    renderSectionHeader={(section) => {
                        const sectionTitle = section as unknown as string
                        const date = parse(sectionTitle, 'dd-MM-yyyy', new Date())
                        return <Text style={styles.header}>{format(date, 'd MMM · eee')}</Text>
                    }}
                />
            </CalendarProvider>
            <Fab />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24
    },
    header: {
        fontSize: 16,
        fontWeight: 'bold',
        backgroundColor: '#fff',
        paddingHorizontal: 16,
        paddingVertical: 10,
    }
})

export default Page