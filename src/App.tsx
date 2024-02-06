
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './contexts/AuthContext.tsx';
import { RoutesApp } from './routes/index';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <RoutesApp />
        <ToastContainer autoClose={3000} />
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App;
