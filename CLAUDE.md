# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## App Summary

This is a React Native todo list app built with Expo. It supports multiple named todo lists with full CRUD: create/rename lists, add/edit/delete todo items, mark items done (strikethrough), drag-and-drop reordering, and local storage persistence. The UI follows the Airbnb design system defined in `DESIGN.md`.

## Commands

```bash
npm start          # Start Expo dev server
npm run ios        # Run on iOS simulator
npm run android    # Run on Android emulator
npm run web        # Run on web
npm run lint       # Run ESLint
```

No test framework is configured.

## Architecture

**Routing:** Expo Router (file-based). All screens live under `app/`. Navigation is a Stack via `app/_layout.tsx`.

**State & persistence:** No external state library. Todo data is persisted to local storage (AsyncStorage or similar). State is managed locally in screens/components with React hooks.

**Design system:** Defined in `DESIGN.md`. Key tokens: brand accent `#ff385c`, near-black text `#222222`, white `#ffffff`. Border radius 8px (buttons), 20px (cards). Three-layer card shadows. Portrait orientation only.

**Key dependencies:**
- `expo-router` — file-based routing
- `react-native-reanimated` — animations (also used by drag-and-drop)
- `react-native-gesture-handler` — gesture support
- `@expo/vector-icons` — icons throughout the UI
- `expo-haptics` — haptic feedback on interactions

**Path alias:** `@/*` resolves to the project root.

**React Compiler** and **Expo Typed Routes** are both enabled (see `app.json`).
