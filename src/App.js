import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'material-icons/iconfont/material-icons.css';
import Navbar from './components/Navbar.jsx';

import Home from "./page/Home.jsx";
import Pendientes from './page/Pendientes.jsx';
import Recordatorios from './page/Recordatorios.jsx';


function App() {
  return (
    <>
      <div className='spacelab' >
        <Router>
          <Navbar />
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/Pendientes" element={<Pendientes />} />
            <Route path="/Recordatorios" element={<Recordatorios />} />
          </Routes>
        </Router>
        <ToastContainer />
        </div>
    </>
  );
}

export default App;
