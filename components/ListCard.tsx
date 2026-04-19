import { useState, useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  Alert,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { Colors, Radius, Shadow, Spacing } from '@/constants/theme'
import type { TodoList } from '@/hooks/useTodoStorage'

type Props = {
  list: TodoList
  onPress: () => void
  onRename: (name: string) => void
  onDelete: () => void
}

export function ListCard({ list, onPress, onRename, onDelete }: Props) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(list.name)
  const inputRef = useRef<TextInput>(null)

  function startEdit() {
    setDraft(list.name)
    setEditing(true)
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  function commitEdit() {
    if (draft.trim()) onRename(draft.trim())
    setEditing(false)
  }

  function handleDelete() {
    Alert.alert('Delete list', `Delete "${list.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ])
  }

  const doneCount = list.items.filter((i) => i.done).length
  const itemLabel =
    list.items.length === 0
      ? 'No items'
      : `${doneCount}/${list.items.length} done`

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
    >
      <View style={styles.content}>
        <View style={styles.info}>
          {editing ? (
            <TextInput
              ref={inputRef}
              style={styles.nameInput}
              value={draft}
              onChangeText={setDraft}
              onBlur={commitEdit}
              onSubmitEditing={commitEdit}
              returnKeyType="done"
              selectTextOnFocus
            />
          ) : (
            <Pressable onPress={startEdit} hitSlop={8}>
              <Text style={styles.name} numberOfLines={1}>
                {list.name}
              </Text>
            </Pressable>
          )}
          <Text style={styles.meta}>{itemLabel}</Text>
        </View>

        <View style={styles.actions}>
          <Pressable onPress={handleDelete} hitSlop={8} style={styles.deleteBtn}>
            <Ionicons name="trash-outline" size={20} color={Colors.brand} />
          </Pressable>
          <Ionicons name="chevron-forward" size={20} color={Colors.border} />
        </View>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.background,
    borderRadius: Radius.card,
    marginBottom: Spacing.md,
    minHeight: 72,
    ...Shadow,
  },
  cardPressed: {
    opacity: 0.85,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.base,
    gap: Spacing.sm,
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  nameInput: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    padding: 0,
    margin: 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  meta: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  deleteBtn: {
    padding: 4,
  },
})
