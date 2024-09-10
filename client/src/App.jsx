import './App.css'
import Header from './components/Header'
import { Toaster } from 'react-hot-toast'
import { Outlet } from 'react-router-dom'



function App() {
  return (
    <>
      <Toaster />
      <Header />
      <Outlet />
    </>
  )
}

export default App;
