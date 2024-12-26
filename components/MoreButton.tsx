import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import * as DropdownMenu from 'zeego/dropdown-menu'

type MoreButtonProps = {
    pageName: string
}
const MoreButton = ({ pageName }: MoreButtonProps) => {
    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger>
                <TouchableOpacity>
                    <MaterialCommunityIcons name='dots-vertical' size={24} color={Colors.primary} />
                </TouchableOpacity>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item key='today' style={{ backgroundColor: "white" }}>
                    <DropdownMenu.ItemTitle>Copy</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon>
                        <Ionicons name='copy-outline' size={24} color={Colors.primary} />
                    </DropdownMenu.ItemIcon>
                </DropdownMenu.Item>
                <DropdownMenu.Item key='today'>
                    <DropdownMenu.ItemTitle>Delete</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon>
                        <Ionicons name='trash-outline' size={24} color={Colors.primary} />
                    </DropdownMenu.ItemIcon>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default MoreButton

const styles = StyleSheet.create({})