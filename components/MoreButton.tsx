import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
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
                    <Text>{pageName}</Text>
                </TouchableOpacity>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
                <DropdownMenu.Item key='today'>
                    <DropdownMenu.ItemTitle>Copy</DropdownMenu.ItemTitle>
                    <DropdownMenu.ItemIcon>
                        <Ionicons name='copy-outline' size={24} color={Colors.primary} />
                    </DropdownMenu.ItemIcon>
                </DropdownMenu.Item>
            </DropdownMenu.Content>
        </DropdownMenu.Root>
    )
}

export default MoreButton

const styles = StyleSheet.create({})