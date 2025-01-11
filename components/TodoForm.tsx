import { View, Text, ScrollView, StyleSheet, TextInput, Pressable, KeyboardAvoidingView, Platform, TouchableOpacity, Modal, Dimensions, FlatList } from "react-native"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import { Project, Todo } from "@/types/interfaces"
import { drizzle, useLiveQuery } from "drizzle-orm/expo-sqlite"
import { useSQLiteContext } from "expo-sqlite"
import { projects, todos } from "@/db/schema"
import { useEffect, useRef, useState } from "react"
import { Colors, DATE_COLORS } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import { eq } from "drizzle-orm"
import { BottomSheetModal } from "@gorhom/bottom-sheet"
import DateSelect from "@/app/(authenticated)/task/Date-select"
import BottomSheet from "@/components/BottomSheet"
import * as SecureStore from 'expo-secure-store'
import { format, isSameDay, isTomorrow } from "date-fns"

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

    // FORM HANDLING 
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

    // PROJECT SELECTION 
    const [showProjectSelect, setShowProjectSelect] = useState(false)
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

    const [selectedDate, setSelectedDate] = useState<Date>(
        todo?.due_date ? new Date(todo.due_date) : new Date()
    )
    const [previouslySelectedDate, setPreviouslySelectedDate] = useState<string | undefined>(undefined)

    useEffect(() => {
        SecureStore.getItemAsync('selectedDate').then((date) => {
            if (date !== null) {
                setSelectedDate(new Date(date))
                setPreviouslySelectedDate(undefined)
            }
        })
    }, [])

    // SUBMIT HANDLING 
    const onSubmit: SubmitHandler<TodoFormData> = async (data) => {
        if (todo) {
            // UPDATE
            console.log("UPDATE")
            await drizzleDb.update(todos).set({
                name: data.name,
                description: data.description,
                project_id: selectedProject.id,
                due_date: selectedDate.getTime(), // TODO: add due date
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
                due_date: selectedDate.getTime(),
            })
        }
    }
    useEffect(() => {
        trigger()
    }, [trigger])

    // DATE SELECT BOTTOM SHEET
    const bottomSheetDateRef = useRef<BottomSheetModal>(null)

    const openDateSelect = () => {
        SecureStore.setItemAsync('selectedDate', selectedDate.toISOString())
        setPreviouslySelectedDate(selectedDate.toISOString())
        bottomSheetDateRef.current?.present()
    }

    const getDateObject = (date: Date) => {
        if (isSameDay(date, new Date())) {
            return {
                name: 'Today',
                color: DATE_COLORS.today
            }
        } else if (isTomorrow(new Date(date))) {
            return {
                name: 'Tomorrow',
                color: DATE_COLORS.tomorrow
            }
        } else {
            return {
                name: format(new Date(date), 'EEE, d MMM'),
                color: DATE_COLORS.other
            }
        }
    }

    const onProjectSelect = (project: Project) => {
        setSelectedProject(project)
        setShowProjectSelect(false)
    }
    return (
        <KeyboardAvoidingView
            enabled
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 50}
            style={{ backgroundColor: '#fff' }}>
            <Modal
                visible={showProjectSelect}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowProjectSelect(false)}
            >
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <FlatList
                            data={data}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    onPress={() => onProjectSelect(item)}
                                    style={styles.projectButton}>
                                    <Text style={{ color: item.color }}>#{item.id}</Text>
                                    <Text style={styles.projectButtonText}>{item.name}</Text>
                                </TouchableOpacity>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                            ItemSeparatorComponent={() => <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: Colors.lightBorder }} />}
                        />
                    </View>
                </View>
            </Modal>
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
                    <Pressable
                        onPress={openDateSelect}
                        style={({ pressed }) => {
                            return [
                                styles.outlineButton,
                                {
                                    backgroundColor: pressed ? Colors.lightBorder : 'transparent',
                                    borderColor: getDateObject(selectedDate).color
                                }
                            ]
                        }}>
                        <Ionicons name="calendar-outline" size={24} color={getDateObject(selectedDate).color} />
                        <Text style={[styles.outlineButtonText, { color: getDateObject(selectedDate).color }]}>{getDateObject(selectedDate).name}</Text>
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
                    <Pressable
                        style={({ pressed }) => {
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
                        onPress={() => setShowProjectSelect(true)}
                        style={styles.outlineButton}>
                        {selectedProject.id === 1 && (
                            <Ionicons name="file-tray-outline" size={24} color={Colors.dark} />
                        )}
                        {selectedProject.id !== 1 && (
                            <Text style={{ color: selectedProject.color }}>#{selectedProject.id}</Text>
                        )}
                        <Text style={styles.outlineButtonText}>{selectedProject.name}</Text>
                        <Ionicons name="chevron-down" size={14} color={Colors.dark} />
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
            <BottomSheet
                ref={bottomSheetDateRef}
                snapPoints={['50%']}
                index={0}
            >
                <DateSelect onSave={
                    (date: Date) => {
                        const dateString = date.toISOString()
                        setSelectedDate(date)
                        SecureStore.setItemAsync('selectedDate', dateString)
                        bottomSheetDateRef.current?.dismiss()
                    }
                } />
            </BottomSheet>
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
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        width: Dimensions.get('window').width - 60,
        height: 200,
        backgroundColor: '#fff',
        borderRadius: 16,
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.2)',
        elevation: 5,
    },
    projectButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: 5
    },
    projectButtonText: {
        fontSize: 16,
    }
})

export default TodoForm