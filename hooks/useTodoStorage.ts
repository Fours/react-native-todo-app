import { useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

export type TodoItem = {
  id: string
  text: string
  done: boolean
}

export type TodoList = {
  id: string
  name: string
  items: TodoItem[]
  createdAt: number
}

const STORAGE_KEY = '@todo_app_lists'

function makeId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function persist(lists: TodoList[]) {
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(lists)).catch(() => {})
}

export function useTodoStorage() {
  const [lists, setLists] = useState<TodoList[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((raw) => {
        if (raw) setLists(JSON.parse(raw))
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [])

  function createList(name: string) {
    const next = [...lists, { id: makeId(), name: name.trim(), items: [], createdAt: Date.now() }]
    setLists(next)
    persist(next)
  }

  function renameList(id: string, name: string) {
    const next = lists.map((l) => (l.id === id ? { ...l, name: name.trim() } : l))
    setLists(next)
    persist(next)
  }

  function deleteList(id: string) {
    const next = lists.filter((l) => l.id !== id)
    setLists(next)
    persist(next)
  }

  function addItem(listId: string, text: string) {
    const next = lists.map((l) =>
      l.id === listId
        ? { ...l, items: [...l.items, { id: makeId(), text: text.trim(), done: false }] }
        : l
    )
    setLists(next)
    persist(next)
  }

  function updateItem(listId: string, itemId: string, text: string) {
    const next = lists.map((l) =>
      l.id === listId
        ? { ...l, items: l.items.map((i) => (i.id === itemId ? { ...i, text: text.trim() } : i)) }
        : l
    )
    setLists(next)
    persist(next)
  }

  function toggleItem(listId: string, itemId: string) {
    const next = lists.map((l) =>
      l.id === listId
        ? { ...l, items: l.items.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i)) }
        : l
    )
    setLists(next)
    persist(next)
  }

  function deleteItem(listId: string, itemId: string) {
    const next = lists.map((l) =>
      l.id === listId ? { ...l, items: l.items.filter((i) => i.id !== itemId) } : l
    )
    setLists(next)
    persist(next)
  }

  function reorderItems(listId: string, nextItems: TodoItem[]) {
    const next = lists.map((l) => (l.id === listId ? { ...l, items: nextItems } : l))
    setLists(next)
    persist(next)
  }

  return {
    lists,
    isLoading,
    createList,
    renameList,
    deleteList,
    addItem,
    updateItem,
    toggleItem,
    deleteItem,
    reorderItems,
  }
}
