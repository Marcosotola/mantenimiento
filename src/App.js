import Pendientes from './page/Pendientes.jsx';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'material-icons/iconfont/material-icons.css';
import Navbar from './components/Navbar.jsx';



function App() {
  return (
    <div className="App">
      <Navbar />
<Pendientes />



<ToastContainer />
    </div>
  );
}

export default App;
