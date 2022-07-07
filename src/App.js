import { BrowserRouter } from 'react-router-dom'; // npm install react-router-dom
import Routes from './routes';
import AuthProvider from './contexts/auth';

import { ToastContainer, toast } from 'react-toastify'; // npm install react-toastify
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastContainer autoClose={3000} />
        <Routes/>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
