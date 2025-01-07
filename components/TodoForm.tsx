import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity } from "react-native"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Project, Todo } from "@/types/interfaces"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import { useSQLiteContext } from "expo-sqlite"
import { projects, todos } from "@/db/schema"
import { useEffect, useState } from "react"
import { Colors } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { eq } from "drizzle-orm"

type TodoFormProps = {
    todo?: Todo & { project_name: string, project_color: string, project_id: number }
}
type TodoFormData = {
    name: string,
    description: string,
}
const TodoForm = ({ todo }: TodoFormProps) => {
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)

    const {
        control,
        handleSubmit,
        formState: { errors },
        trigger,
    } = useForm<TodoFormData>({
        defaultValues: {
            name: todo?.name || '',
            description: todo?.description || '',
        },
        mode: 'onChange',
    });

    const { data } = useLiveQuery(drizzleDb.select().from(projects))
    const [selectedProject, setSelectedProject] = useState<Project>(
        todo?.project_id
            ? {
                id: todo.project_id,
                name: todo.project_name || '',
                color: todo.project_color || '#000000'
            }
            : {
                id: 1,
                name: 'Inbox',
                color: '#000000'
            }
    )

    const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
        if (todo) {
            // UPDATE
            console.log("UPDATE")
            await drizzleDb.update(todos).set({
                name: data.name,
                description: data.description,
                project_id: selectedProject.id,
                due_date: 0, // TODO: add due date
            }).where(eq(todos.id, todo.id))
        } else {
            // CREATE
            console.log("CREATE")
            await drizzleDb.insert(todos).values({
                name: data.name,
                description: data.description,
                project_id: selectedProject.id,
                priority: 0,
                date_added: Date.now(),
                completed: 0,
                due_date: 0,
            })
        }
    }
    useEffect(() => {
        trigger()
    }, [trigger])
    return (
        <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}
            style={{ backgroundColor: '#fff' }}>
            <ScrollView
                contentContainerStyle={[styles.container]}
                keyboardShouldPersistTaps="always"
                showsVerticalScrollIndicator={false}
                keyboardDismissMode="none"
            >
                <Controller
                    control={control}
                    name="name"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.input}
                            placeholder="Task name"
                            value={value}
                            onChangeText={onChange}
                            autoFocus={true}
                            autoCorrect={false}
                            autoCapitalize="words"
                            enablesReturnKeyAutomatically
                            returnKeyType="done"
                        />
                    )}
                />
                <Controller
                    control={control}
                    name="description"
                    rules={{ required: true }}
                    render={({ field: { onChange, value } }) => (
                        <TextInput
                            style={styles.description}
                            placeholder="Description"
                            value={value}
                            onChangeText={onChange}
                            multiline
                            enablesReturnKeyAutomatically
                            returnKeyType="done"
                        />
                    )}
                />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.actionButtonsContainer}
                >
                    <Pressable style={({ pressed }) => {
                        return [
                            styles.outlineButton,
                            {
                                backgroundColor: pressed ? Colors.lightBorder : 'transparent'
                            }
                        ]
                    }}>
                        <Ionicons name="calendar-outline" size={24} color={Colors.dark} />
                        <Text style={styles.outlineButtonText}>Date</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => {
                        return [
                            styles.outlineButton,
                            {
                                backgroundColor: pressed ? Colors.lightBorder : 'transparent'
                            }
                        ]
                    }}>
                        <Ionicons name="flag-outline" size={24} color={Colors.dark} />
                        <Text style={styles.outlineButtonText}>Priority</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => {
                        return [
                            styles.outlineButton,
                            {
                                backgroundColor: pressed ? Colors.lightBorder : 'transparent'
                            }
                        ]
                    }}>
                        <Ionicons name="location-outline" size={24} color={Colors.dark} />
                        <Text style={styles.outlineButtonText}>Location</Text>
                    </Pressable>
                    <Pressable style={({ pressed }) => {
                        return [
                            styles.outlineButton,
                            {
                                backgroundColor: pressed ? Colors.lightBorder : 'transparent'
                            }
                        ]
                    }}>
                        <Ionicons name="pricetags-outline" size={24} color={Colors.dark} />
                        <Text style={styles.outlineButtonText}>Labels</Text>
                    </Pressable>
                </ScrollView>
                <View style={styles.bottomRow}>
                    <TouchableOpacity
                        onPress={() => console.log("LABELS")}
                        style={styles.outlineButton}>
                        <Ionicons name="pricetags-outline" size={24} color={Colors.dark} />
                        <Text style={styles.outlineButtonText}>Labels</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => handleSubmit(onSubmit)()}
                        style={[styles.submitButton, {
                            opacity: errors.name ? 0.5 : 1
                        }]}>
                        <Ionicons name="arrow-up" size={24} color={'#fff'} />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        gap: 12,
        paddingTop: 16,
    },
    input: {
        fontSize: 18,
        paddingHorizontal: 12,
        backgroundColor: '#fff',
        width: '100%',
    },
    description: {
        fontSize: 16,
        paddingHorizontal: 16
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        paddingHorizontal: 16
    },
    outlineButton: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.lightBorder,
        borderRadius: 6,
        paddingHorizontal: 12,
        paddingVertical: 8,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8
    },
    submitButton: {
        backgroundColor: Colors.primary,
        borderRadius: 25,
        padding: 6,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        gap: 8
    },
    outlineButtonText: {
        fontSize: 14,
        color: Colors.dark,
        fontWeight: '500'
    },
    bottomRow: {
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.lightBorder,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    }
})

export default TodoForm