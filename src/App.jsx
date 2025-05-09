import React from 'react'
import AllRoutes from './All-Routes/AllRoutes'
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
// import 'react-toastify/dist/ReactToastify.css';
import "./App.css"
import './styles/animations.css'

const App = () => {
  return (
    <div>
     {/* <ToastContainer /> */}
      <AllRoutes />
    </div>
  )
}

export default App
