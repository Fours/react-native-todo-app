import { useState, useRef } from 'react'
import { View, Text, Pressable, TextInput, StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import * as Haptics from 'expo-haptics'
import { Colors, Spacing } from '@/constants/theme'
import type { TodoItem as TodoItemType } from '@/hooks/useTodoStorage'

export const ITEM_HEIGHT = 64

type Props = {
  item: TodoItemType
  onToggle: () => void
  onUpdate: (text: string) => void
  onDelete: () => void
  dragHandle?: React.ReactNode
}

export function TodoItem({ item, onToggle, onUpdate, onDelete, dragHandle }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(item.text)
  const inputRef = useRef<TextInput>(null)

  function handleToggle() {
    Haptics.selectionAsync()
    onToggle()
  }

  function startEdit() {
    setDraft(item.text)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function commitEdit() {
    if (draft.trim()) onUpdate(draft.trim())
    setEditing(false)
  }

  return (
    <View style={styles.row}>
      {dragHandle}

      <Pressable onPress={handleToggle} style={styles.checkbox}>
        {item.done ? (
          <View style={styles.checkboxFilled}>
            <Ionicons name="checkmark" size={14} color={Colors.background} />
          </View>
        ) : (
          <View style={styles.checkboxEmpty} />
        )}
      </Pressable>

      <Pressable onPress={startEdit} style={styles.textArea}>
        {editing ? (
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={draft}
            onChangeText={setDraft}
            onBlur={commitEdit}
            onSubmitEditing={commitEdit}
            returnKeyType="done"
            selectTextOnFocus
          />
        ) : (
          <Text
            style={[styles.text, item.done && styles.textDone]}
            numberOfLines={1}
          >
            {item.text}
          </Text>
        )}
      </Pressable>

      <Pressable onPress={onDelete} hitSlop={8} style={styles.deleteBtn}>
        <Ionicons name="close" size={18} color={Colors.textSecondary} />
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    height: ITEM_HEIGHT,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    paddingHorizontal: Spacing.base,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
    gap: Spacing.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxEmpty: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  checkboxFilled: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.brand,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textArea: {
    flex: 1,
    justifyContent: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
  },
  textDone: {
    textDecorationLine: 'line-through',
    color: Colors.textSecondary,
  },
  input: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
    padding: 0,
    margin: 0,
  },
  deleteBtn: {
    padding: 4,
  },
})
