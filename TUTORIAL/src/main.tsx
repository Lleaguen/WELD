import React from 'react'
import ReactDOM from 'react-dom/client'
import { WeldProvider, Weld } from '@weldjs/react'
import { App } from './App'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <WeldProvider>
      <Weld.ToastProvider />
      <App />
    </WeldProvider>
  </React.StrictMode>
)
