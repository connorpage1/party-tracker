import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import 'semantic-ui-css/semantic.min.css'
import { RouterProvider } from "react-router-dom";
import { router } from './routes/index.jsx'
import GlobalProvider from './context/GlobalProvider.jsx'


createRoot(document.getElementById('root')).render(
    <GlobalProvider>
        <RouterProvider router={router} />
    </GlobalProvider>
)
