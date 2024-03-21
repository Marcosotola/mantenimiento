import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'material-icons/iconfont/material-icons.css';
import Navbar from './components/Navbar.jsx';

import Home from "./page/Home.jsx";
import Calendar from './page/Calendar.jsx';
import Pendientes from './page/Pendientes.jsx';
import Recordatorios from './page/Recordatorios.jsx';
import Preventivos from './page/Preventivos.jsx';
import Renault from './page/Renault.jsx';
import Holcim from './page/Holcim.jsx';


function App() {
  return (
    <>
      <div className='spacelab' >
        <Router>
          <Navbar />
          <Routes >
            <Route path="/" element={<Home />} />
            <Route path="/Calendar" element={<Calendar />} />
            <Route path="/Pendientes" element={<Pendientes />} />
            <Route path="/Recordatorios" element={<Recordatorios />} />
            <Route path="/Preventivos" element={<Preventivos />} />
            <Route path="/Renault" element={<Renault />} />
            <Route path="/Holcim" element={<Holcim />} />
          </Routes>
        </Router>
        <ToastContainer />
        </div>
    </>
  );
}

export default App;
