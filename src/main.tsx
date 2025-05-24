import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
    <div
    className='bg-black text-white font-serif font-medium min-h-screen h-full w-full'
    >
        <App />
    </div>
)
