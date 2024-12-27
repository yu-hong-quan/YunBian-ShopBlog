export interface Theme {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  border: string
}

export const lightTheme: Theme = {
  primary: '#42b983',
  secondary: '#3aa876',
  background: '#ffffff',
  surface: '#f8f9fa',
  text: '#2c3e50',
  border: '#eaeaea'
}

export const darkTheme: Theme = {
  primary: '#42b983',
  secondary: '#3aa876',
  background: '#1a1a1a',
  surface: '#2c2c2c',
  text: '#ffffff',
  border: '#404040'
} 