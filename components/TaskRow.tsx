import { Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useRef } from 'react'
import { Todo } from '@/types/interfaces'
import { Link } from 'expo-router';
import { Colors } from '@/constants/Colors';
import BounceCheckBox from 'react-native-bouncy-checkbox'
import { useSQLiteContext } from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { todos } from '@/db/schema';
import { eq } from 'drizzle-orm';
import BottomSheet from './BottomSheet';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import TaskDetails from '@/app/(authenticated)/task/TaskDetails';

interface TaskRowTodo {
    task: Todo;
}

const TaskRow = ({ task }: TaskRowTodo) => {
    const db = useSQLiteContext()
    const drizzleDB = drizzle(db)

    const markCompleted = async () => {
        console.log('markAsCompleted')
        await drizzleDB.update(todos).set({ completed: 1, date_completed: Date.now() }).where(eq(todos.id, task.id))
    }
    const bottomSheetRef = useRef<BottomSheetModal>(null)
    const openBottomSheet = () => bottomSheetRef.current?.present()
    return (
        <View>
            <Pressable style={styles.container} onPress={openBottomSheet}>
                <View style={styles.row}>
                    <BounceCheckBox
                        size={25}
                        textContainerStyle={{ display: 'none' }}
                        fillColor={task.project_color}
                        unFillColor='#fff'
                        isChecked={task.completed === 1}
                        textStyle={{ color: '#000', fontSize: 16, textDecorationLine: 'none' }}
                        onPress={markCompleted}
                    />
                    <Text style={styles.name}>{task.name}</Text>
                </View>
                <Text style={styles.projectName}>{task.project_name}</Text>
            </Pressable>
            <BottomSheet title='Task Details' ref={bottomSheetRef} >
                <TaskDetails id={task.id} />
            </BottomSheet>
        </View>
    )
}

export default TaskRow

const styles = StyleSheet.create({
    container: {
        padding: 14,
        backgroundColor: '#fff',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: Colors.lightBorder,
    },
    row: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 10
    },
    name: {
        fontSize: 16,
        flex: 1
    },
    projectName: {
        fontSize: 12,
        color: Colors.lightText,
        alignSelf: 'flex-end',
        marginTop: 5
    }
})