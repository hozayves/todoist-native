import { Link, Stack, useGlobalSearchParams, useRouter } from "expo-router"
import { useEffect, useState } from "react"
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Pressable } from "react-native"
import { Colors, DEFAULT_PROJECT_COLOR } from "@/constants/Colors"
import { useSQLiteContext } from "expo-sqlite"
import { drizzle } from "drizzle-orm/expo-sqlite"
import { projects } from "@/db/schema"
import { useHeaderHeight } from "@react-navigation/elements"
import Ionicons from "@expo/vector-icons/build/Ionicons"


const Page = () => {
    const [projectName, setProjectName] = useState('')
    const router = useRouter()
    const { bg } = useGlobalSearchParams<{ bg?: string }>()
    const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_PROJECT_COLOR)
    const db = useSQLiteContext()
    const drizzleDb = drizzle(db)
    const headerHeight = useHeaderHeight()

    if (!selectedColor) {
        setSelectedColor(DEFAULT_PROJECT_COLOR)
    }

    useEffect(() => {
        if (bg) {
            setSelectedColor(bg)
        }
    }, [bg])

    const onCreateProject = async () => {
        console.log('create project')
        await drizzleDb.insert(projects).values({
            name: projectName,
            color: selectedColor
        })
        setSelectedColor(DEFAULT_PROJECT_COLOR)
        router.dismiss()
    }

    return (
        <View style={{ marginTop: headerHeight }}>
            <Stack.Screen options={{
                headerRight: () => (
                    <TouchableOpacity onPress={onCreateProject} disabled={projectName === ''}>
                        <Text style={projectName === '' ? styles.btnTextDisabled : styles.btnText}>Create</Text>
                    </TouchableOpacity>
                )
            }}
            />
            <View style={styles.container}>
                <TextInput
                    style={styles.input}
                    placeholder="Name"
                    value={projectName}
                    onChangeText={setProjectName}
                    autoFocus={true}
                />
                <Link href='/browser/new-project/color-select' asChild>
                    <TouchableOpacity style={styles.BtnItem}>
                        <Ionicons name="color-palette" size={24} color={selectedColor} />
                        <Text style={styles.BtnItemText}>Color</Text>
                        <View style={[styles.colorPreview, { backgroundColor: selectedColor }]} />
                        <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
                    </TouchableOpacity>
                </Link>
                {/* <TouchableOpacity onPress={onCreateProject} disabled={projectName === ''}>
                    <Text style={projectName === '' ? styles.btnTextDisabled : styles.btnText}>Create</Text>
                </TouchableOpacity> */}
            </View>
        </View>
    )
}
const styles = StyleSheet.create({
    btnText: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: '500'
    },
    btnTextDisabled: {
        fontSize: 18,
        fontWeight: '500',
        color: Colors.dark
    },
    container: {
        marginHorizontal: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
    },
    input: {
        borderTopWidth: StyleSheet.hairlineWidth,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: Colors.lightBorder,
        padding: 12,
        fontSize: 16
    },
    BtnItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 12,
        gap: 16
    },
    BtnItemText: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1
    },
    colorPreview: {
        width: 24,
        height: 24,
        borderRadius: 12
    }
})

export default Page     