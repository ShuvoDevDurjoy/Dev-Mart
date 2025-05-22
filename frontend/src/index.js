import {createRoot} from 'react-dom/client'
import App from './App'
import './index.css'
import MyContextProvider from './MyContextProvider';

createRoot(document.getElementById('root')).render(
    <MyContextProvider>
        <App />
    </MyContextProvider>
);