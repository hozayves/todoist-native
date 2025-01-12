import { StyleSheet, View } from 'react-native'
import React from 'react'
import { useSQLiteContext } from 'expo-sqlite'
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { eq } from 'drizzle-orm'
import { projects, todos } from '@/db/schema'
import TodoForm from '@/components/TodoForm'

const TaskDetails = ({ id }: { id: number }) => {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)
    const { data } = useLiveQuery(
        drizzleDb.select()
            .from(todos)
            .leftJoin(projects, eq(todos.project_id, projects.id))
            .where(eq(todos.id, id))
    )

    if (!!data && data.length === 0) {
        return null
    }

    const todo = {
        ...data[0].todos,
        project_name: data[0].projects?.name,
        project_color: data[0].projects?.color,
        project_id: data[0].projects?.id
    }
    return (
        <View style={styles.container}>
            <TodoForm todo={todo} />
        </View>
    )
}

export default TaskDetails

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    }
})