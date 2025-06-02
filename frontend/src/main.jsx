import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { UserContextProvider } from './context/UserContext.jsx'
import ProductContextProvider from './context/ProductContext.jsx'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <UserContextProvider>
      <ProductContextProvider>
        <App />
      </ProductContextProvider>
    </UserContextProvider>
  </BrowserRouter>,
)
