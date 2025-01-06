import { View, Text, Button, StyleSheet, TouchableOpacity, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@clerk/clerk-expo'
import { useSQLiteContext } from 'expo-sqlite'
import { drizzle, useLiveQuery } from 'drizzle-orm/expo-sqlite'
import { useRouter } from 'expo-router'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'
import Fab from '@/components/Fab'
import { Ionicons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import Animated, { FadeIn, FadeOut, LayoutAnimation, LinearTransition } from 'react-native-reanimated'

const Page = () => {
    const { signOut } = useAuth()
    const router = useRouter()
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)
    const { data } = useLiveQuery(drizzleDb.select().from(projects), [])
    const isPro = false
    const [projectToDelete, setProjectToDelete] = useState<number | null>(null)

    const onDeleteProject = async (id: number) => {
        await drizzleDb.delete(projects).where(eq(projects.id, id))
    }

    const onNewProject = async () => {
        if (data.length >= 5 && !isPro) {
            // go Pro
        } else {
            router.push('/browser/new-project')
        }
    }
    return (
        <>
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>My Projects</Text>
                    <TouchableOpacity onPress={onNewProject}>
                        <Ionicons name='add' size={24} color={Colors.dark} />
                    </TouchableOpacity>
                </View>
                <Animated.FlatList
                    data={data}
                    itemLayoutAnimation={LinearTransition}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.projectItem}
                            onLongPress={() => setProjectToDelete(item.id)}
                        >
                            <Text style={{ color: item.color, borderWidth: 1, borderColor: 'transparent' }}>#</Text>
                            <Text style={styles.projectItemText}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                    ListFooterComponent={
                        <TouchableOpacity style={styles.clearButton} onPress={() => signOut()}>
                            <Text style={styles.clearButtonText}>Log Out</Text>
                        </TouchableOpacity>
                    }
                />
            </View>
            {projectToDelete !== null && (
                <View style={styles.deleteModal}>
                    <View style={styles.deleteModalContent}>
                        <Text style={styles.deleteModalText}>Are you sure you want to delete this project?</Text>
                        <View style={styles.deleteModalButtons}>
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={async () => {
                                    await onDeleteProject(projectToDelete)
                                    setProjectToDelete(null)
                                }}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setProjectToDelete(null)}
                            >
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
            <Fab />
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: Colors.backgroundAlt
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20
    },
    headerText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.dark,
        margin: 10
    },
    clearButton: {
        marginTop: 20,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 14,
        borderRadius: 5,
        backgroundColor: '#fff'
    },
    clearButtonText: {
        color: Colors.primary,
        fontWeight: 'bold'
    },
    separator: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: Colors.lightBorder
    },
    projectItem: {
        padding: 14,
        borderRadius: 5,
        backgroundColor: '#fff',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14
    },
    projectItemText: {
        color: Colors.dark,
        fontSize: 16,
        fontWeight: 'bold'
    },
    deleteModal: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteModalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    deleteModalText: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center',
    },
    deleteModalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    deleteButton: {
        backgroundColor: Colors.primary,
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    cancelButton: {
        backgroundColor: Colors.lightBorder,
        padding: 10,
        borderRadius: 5,
        minWidth: 100,
        alignItems: 'center',
    },
    deleteButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: Colors.dark,
        fontWeight: 'bold',
    },
})

export default Page