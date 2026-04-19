'use no memo'

import { useRef, useState } from 'react'
import { ScrollView, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated'
import * as Haptics from 'expo-haptics'

type Props<T extends { id: string }> = {
  data: T[]
  renderItem: (item: T, index: number) => React.ReactNode
  itemHeight: number
  onReorder: (next: T[]) => void
}

function clamp(val: number, min: number, max: number) {
  'worklet'
  return Math.min(Math.max(val, min), max)
}

export function DraggableList<T extends { id: string }>({
  data,
  renderItem,
  itemHeight,
  onReorder,
}: Props<T>) {
  const onReorderRef = useRef(onReorder)
  onReorderRef.current = onReorder

  const dataRef = useRef(data)
  dataRef.current = data

  const [scrollEnabled, setScrollEnabled] = useState(true)

  const activeIndex = useSharedValue(-1)
  const dragY = useSharedValue(0)
  const dragStartY = useSharedValue(0)

  // positions[i] = the visual slot index for item at data[i]
  const positions = useSharedValue<number[]>(data.map((_, i) => i))

  // Keep positions in sync when data array changes length
  if (positions.value.length !== data.length) {
    positions.value = data.map((_, i) => i)
  }

  function commitReorder(nextData: T[]) {
    onReorderRef.current(nextData)
  }

  function enableScroll() {
    setScrollEnabled(true)
  }

  function disableScroll() {
    setScrollEnabled(false)
  }

  function buildGesture(index: number) {
    const longPress = Gesture.LongPress()
      .minDuration(300)
      .onStart(() => {
        'worklet'
        activeIndex.value = index
        dragStartY.value = positions.value[index] * itemHeight
        dragY.value = dragStartY.value
        runOnJS(disableScroll)()
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Medium)
      })

    const pan = Gesture.Pan()
      .averageTouches(true)
      .onUpdate((e) => {
        'worklet'
        if (activeIndex.value === -1) return
        const rawY = dragStartY.value + e.translationY
        const maxY = (dataRef.current.length - 1) * itemHeight
        dragY.value = clamp(rawY, 0, maxY)

        const currentSlot = Math.round(dragY.value / itemHeight)
        const prevPositions = positions.value

        // Find which item currently occupies the target slot
        const occupantIndex = prevPositions.findIndex((p) => p === currentSlot)
        if (occupantIndex !== -1 && occupantIndex !== activeIndex.value) {
          const next = [...prevPositions]
          // Swap slots
          next[occupantIndex] = prevPositions[activeIndex.value]
          next[activeIndex.value] = currentSlot
          positions.value = next
        }
      })
      .onEnd(() => {
        'worklet'
        if (activeIndex.value === -1) return

        // Build reordered array: sort items by their current slot
        const currentPositions = [...positions.value]
        const currentData = dataRef.current
        const indexed = currentData.map((item, i) => ({ item, slot: currentPositions[i] }))
        indexed.sort((a, b) => a.slot - b.slot)
        const reordered = indexed.map((x) => x.item)

        // Reset positions to clean 0..n-1
        positions.value = reordered.map((_, i) => i)
        activeIndex.value = -1

        runOnJS(commitReorder)(reordered)
        runOnJS(enableScroll)()
        runOnJS(Haptics.impactAsync)(Haptics.ImpactFeedbackStyle.Light)
      })

    return Gesture.Simultaneous(longPress, pan)
  }

  return (
    <ScrollView scrollEnabled={scrollEnabled}>
      <View style={{ height: data.length * itemHeight }}>
        {data.map((item, index) => (
          <DraggableItem
            key={item.id}
            index={index}
            itemHeight={itemHeight}
            activeIndex={activeIndex}
            positions={positions}
            dragY={dragY}
            gesture={buildGesture(index)}
          >
            {renderItem(item, index)}
          </DraggableItem>
        ))}
      </View>
    </ScrollView>
  )
}

type ItemProps = {
  index: number
  itemHeight: number
  activeIndex: ReturnType<typeof useSharedValue<number>>
  positions: ReturnType<typeof useSharedValue<number[]>>
  dragY: ReturnType<typeof useSharedValue<number>>
  gesture: ReturnType<typeof Gesture.Simultaneous>
  children: React.ReactNode
}

function DraggableItem({
  index,
  itemHeight,
  activeIndex,
  positions,
  dragY,
  gesture,
  children,
}: ItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    'worklet'
    const isActive = activeIndex.value === index
    const slot = positions.value[index] ?? index
    const targetY = isActive ? dragY.value : withSpring(slot * itemHeight, {
      damping: 20,
      stiffness: 200,
    })
    return {
      transform: [{ translateY: targetY }],
      zIndex: isActive ? 100 : 1,
      shadowOpacity: isActive ? 0.15 : 0,
      shadowRadius: isActive ? 8 : 0,
      shadowOffset: { width: 0, height: isActive ? 4 : 0 },
      shadowColor: '#000',
      elevation: isActive ? 6 : 0,
    }
  })

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View
        style={[
          {
            position: 'absolute',
            left: 0,
            right: 0,
            height: itemHeight,
            top: 0,
            backgroundColor: 'white',
          },
          animatedStyle,
        ]}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  )
}
