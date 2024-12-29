import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from '@/constants/Colors'
import * as Clipboard from 'expo-clipboard'
import { toast } from 'sonner-native'

type MoreButtonProps = {
    pageName: string
}

const MoreButton = ({ pageName }: MoreButtonProps) => {
    const [isDropdownVisible, setDropdownVisible] = useState(false)

    const copyToClipboard = async () => {
        const path = `hozayvestodoist://(authenticated)/(tabs)/${pageName.toLowerCase()}`
        await Clipboard.setStringAsync(path)
        toast.success('Copied to Clipboard')
    }


    const toggleDropdown = () => {
        setDropdownVisible(!isDropdownVisible)
        console.log(isDropdownVisible)
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => setDropdownVisible(!isDropdownVisible)} style={{ borderWidth: 1 }}>
                <MaterialCommunityIcons name="dots-vertical" size={24} color={Colors.dark} />
            </TouchableOpacity>
            {isDropdownVisible && (
                <View style={styles.dropdown}>
                    <TouchableOpacity style={styles.dropdownRow} onPress={copyToClipboard}>
                        <Text style={styles.dropdownText}>Copy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownRow}>
                        <Text style={styles.dropdownText}>Select Task</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.dropdownRow}>
                        <Text style={styles.dropdownText}>View</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    )
}

export default MoreButton

const styles = StyleSheet.create({
    container: {
        position: 'relative',
    },
    dropdown: {
        position: 'absolute',
        top: -70, // Adjust to place it above the header
        right: 0,
        zIndex: 10,
        borderWidth: 1,
        borderColor: Colors.primary,
        backgroundColor: Colors.secondary,
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
        elevation: 5,
    },
    dropdownRow: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },
    dropdownText: {
        fontSize: 16,
        color: Colors.primary,
    },
})
