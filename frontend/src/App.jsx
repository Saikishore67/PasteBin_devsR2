import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import PasteList from './pages/PasteList';
import CreatePaste from './pages/CreatePaste';
import ViewPaste from './pages/ViewPaste';
import EditPaste from './pages/EditPaste';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="page" key={location.pathname}>
      <Routes location={location}>
        <Route path="/" element={<PasteList />} />
        <Route path="/my-pastes" element={<PasteList onlyMine />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create" element={<CreatePaste />} />
        <Route path="/pastes/:id" element={<ViewPaste />} />
        <Route path="/pastes/:id/edit" element={<EditPaste />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <div className="app-shell">
            <Header />
            <AnimatedRoutes />
          </div>
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}
