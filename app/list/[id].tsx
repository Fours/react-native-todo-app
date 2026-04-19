import { useState, useRef } from 'react'
import {
  View,
  Text,
  Pressable,
  TextInput,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native'
import { Stack, useLocalSearchParams, useRouter } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useTodoStorage } from '@/hooks/useTodoStorage'
import { DraggableList } from '@/components/DraggableList'
import { TodoItem, ITEM_HEIGHT } from '@/components/TodoItem'
import type { TodoItem as TodoItemType } from '@/hooks/useTodoStorage'
import { Colors, Radius, Spacing } from '@/constants/theme'

export default function ListScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const router = useRouter()
  const { lists, renameList, deleteList, addItem, updateItem, toggleItem, deleteItem, reorderItems } =
    useTodoStorage()

  const list = lists.find((l) => l.id === id)

  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState('')
  const [newItemText, setNewItemText] = useState('')
  const titleInputRef = useRef<TextInput>(null)
  const addInputRef = useRef<TextInput>(null)

  if (!list) {
    return (
      <View style={styles.center}>
        <Text style={styles.notFound}>List not found</Text>
      </View>
    )
  }

  function startTitleEdit() {
    setTitleDraft(list!.name)
    setEditingTitle(true)
    setTimeout(() => titleInputRef.current?.focus(), 50)
  }

  function commitTitleEdit() {
    if (titleDraft.trim()) renameList(id, titleDraft.trim())
    setEditingTitle(false)
  }

  function handleAdd() {
    if (!newItemText.trim()) return
    addItem(id, newItemText)
    setNewItemText('')
  }

  function handleDeleteList() {
    Alert.alert('Delete list', `Delete "${list!.name}" and all its items?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteList(id)
          router.back()
        },
      },
    ])
  }

  function renderItem(item: TodoItemType) {
    return (
      <TodoItem
        item={item}
        onToggle={() => toggleItem(id, item.id)}
        onUpdate={(text) => updateItem(id, item.id, text)}
        onDelete={() => deleteItem(id, item.id)}
        dragHandle={
          <View style={styles.dragHandle}>
            <Ionicons name="reorder-three" size={24} color={Colors.border} />
          </View>
        }
      />
    )
  }

  const headerTitle = editingTitle ? (
    <TextInput
      ref={titleInputRef}
      style={styles.titleInput}
      value={titleDraft}
      onChangeText={setTitleDraft}
      onBlur={commitTitleEdit}
      onSubmitEditing={commitTitleEdit}
      returnKeyType="done"
      selectTextOnFocus
    />
  ) : (
    <Pressable onPress={startTitleEdit}>
      <Text style={styles.titleText} numberOfLines={1}>
        {list.name}
      </Text>
    </Pressable>
  )

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={88}
    >
      <Stack.Screen
        options={{
          headerTitle: () => headerTitle,
          headerRight: () => (
            <Pressable onPress={handleDeleteList} hitSlop={8} style={styles.headerBtn}>
              <Ionicons name="trash-outline" size={20} color={Colors.brand} />
            </Pressable>
          ),
        }}
      />

      {list.items.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No items yet</Text>
          <Text style={styles.emptyHint}>Add your first item below</Text>
        </View>
      ) : (
        <DraggableList
          data={list.items}
          renderItem={renderItem}
          itemHeight={ITEM_HEIGHT}
          onReorder={(next) => reorderItems(id, next)}
        />
      )}

      <View style={styles.addBar}>
        <TextInput
          ref={addInputRef}
          style={styles.addInput}
          placeholder="Add an item..."
          placeholderTextColor={Colors.textSecondary}
          value={newItemText}
          onChangeText={setNewItemText}
          onSubmitEditing={handleAdd}
          returnKeyType="done"
          blurOnSubmit={false}
        />
        <Pressable
          onPress={handleAdd}
          style={[styles.sendBtn, !newItemText.trim() && styles.sendBtnDisabled]}
          disabled={!newItemText.trim()}
        >
          <Ionicons
            name="send"
            size={20}
            color={newItemText.trim() ? Colors.brand : Colors.textDisabled}
          />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFound: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    maxWidth: 220,
  },
  titleInput: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    minWidth: 120,
    maxWidth: 220,
    padding: 0,
  },
  headerBtn: {
    padding: 4,
    marginRight: 4,
  },
  dragHandle: {
    paddingRight: 4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  emptyHint: {
    fontSize: 14,
    color: Colors.textDisabled,
  },
  addBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.border,
    gap: Spacing.sm,
    backgroundColor: Colors.background,
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.button,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
  },
  sendBtn: {
    padding: Spacing.sm,
  },
  sendBtnDisabled: {
    opacity: 0.5,
  },
})
