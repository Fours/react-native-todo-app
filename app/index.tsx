import { ListCard } from '@/components/ListCard'
import { Colors, Radius, Spacing } from '@/constants/theme'
import { useTodoStorage } from '@/hooks/useTodoStorage'
import { Ionicons } from '@expo/vector-icons'
import { Stack, useRouter } from 'expo-router'
import { useRef, useState } from 'react'
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native'

export default function HomeScreen() {
  const router = useRouter()
  const { lists, isLoading, createList, renameList, deleteList } = useTodoStorage()
  const [modalVisible, setModalVisible] = useState(false)
  const [newName, setNewName] = useState('')
  const inputRef = useRef<TextInput>(null)

  function openModal() {
    setNewName('')
    setModalVisible(true)
    setTimeout(() => inputRef.current?.focus(), 100)
  }

  function handleCreate() {
    if (!newName.trim()) return
    createList(newName)
    setModalVisible(false)
  }

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={Colors.brand} />
      </View>
    )
  }

  return (
    <>
      <Stack.Screen
        options={{
          title: 'My Lists',
          headerRight: () => (
            <Pressable onPress={openModal} hitSlop={8} style={styles.addBtn}>
              <Ionicons name="add" size={28} color={Colors.text} />
            </Pressable>
          ),
        }}
      />

      {lists.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>No lists yet</Text>
          <Pressable onPress={openModal} style={styles.createBtn}>
            <Text style={styles.createBtnText}>Create your first list</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={lists}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <ListCard
              list={item}
              onPress={() => router.push({ pathname: '/list/[id]', params: { id: item.id } })}
              onRename={(name) => renameList(item.id, name)}
              onDelete={() => deleteList(item.id)}
            />
          )}
          contentContainerStyle={styles.list}
        />
      )}

      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setModalVisible(false)} />
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <View style={styles.sheet}>
            <Text style={styles.sheetTitle}>New List</Text>
            <TextInput
              ref={inputRef}
              style={styles.sheetInput}
              placeholder="List name"
              placeholderTextColor={Colors.textSecondary}
              value={newName}
              onChangeText={setNewName}
              onSubmitEditing={handleCreate}
              returnKeyType="done"
              maxLength={60}
            />
            <View style={styles.sheetActions}>
              <Pressable onPress={() => setModalVisible(false)} style={styles.cancelBtn}>
                <Text style={styles.cancelText}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleCreate}
                style={[styles.confirmBtn, !newName.trim() && styles.confirmBtnDisabled]}
                disabled={!newName.trim()}
              >
                <Text style={styles.confirmText}>Create</Text>
              </Pressable>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  )
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addBtn: {
    padding: 4
  },
  list: {
    padding: Spacing.base,
    paddingBottom: Spacing.xl,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.base,
    padding: Spacing.xl,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  createBtn: {
    backgroundColor: Colors.text,
    borderRadius: Radius.button,
    paddingVertical: 14,
    paddingHorizontal: Spacing.lg,
  },
  createBtnText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: Radius.card,
    borderTopRightRadius: Radius.card,
    padding: Spacing.lg,
    gap: Spacing.base,
    paddingBottom: 40,
  },
  sheetTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.text,
    letterSpacing: -0.44,
  },
  sheetInput: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.button,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.base,
    fontSize: 16,
    color: Colors.text,
  },
  sheetActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: Spacing.base,
  },
  cancelText: {
    fontSize: 16,
    color: Colors.textSecondary,
  },
  confirmBtn: {
    backgroundColor: Colors.text,
    borderRadius: Radius.button,
    paddingVertical: 12,
    paddingHorizontal: Spacing.lg,
  },
  confirmBtnDisabled: {
    backgroundColor: Colors.textDisabled,
  },
  confirmText: {
    color: Colors.background,
    fontSize: 16,
    fontWeight: '500',
  },
})
