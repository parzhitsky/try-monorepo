import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { /* side effects */ } from 'bootstrap/dist/css/bootstrap.min.css'
import { store } from './store/store.js'
import { App } from './app.js'

const container = document.getElementById('container') as HTMLElement
const root = createRoot(container)

root.render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
