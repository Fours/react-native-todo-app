import { Platform } from 'react-native'

export const Colors = {
  brand: '#ff385c',
  brandPressed: '#e00b41',
  text: '#222222',
  textSecondary: '#6a6a6a',
  textDisabled: 'rgba(0,0,0,0.24)',
  background: '#ffffff',
  surface: '#f2f2f2',
  border: '#c1c1c1',
}

export const Radius = {
  button: 8,
  card: 20,
  circle: 9999,
}

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 24,
  xl: 32,
}

export const Shadow = Platform.select({
  ios: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  android: {
    elevation: 3,
  },
  default: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
})
