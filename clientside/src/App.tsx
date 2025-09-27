import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login'; 
import Register from './pages/Register';
import Converter from './pages/Converter';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const isAuthenticated = !!localStorage.getItem('token'); 
    
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />; 
    }

    return <>{children}</>;
};

const App: React.FC = () => {
    return (
        <Router>
            <Routes>
                {/* Rotas de Autenticação */}
                <Route path="/register" element={<Register />} /> 
                <Route path="/login" element={<Login />} /> 

                {/* Rota Protegida do Dashboard */}
                <Route 
                    path="/" 
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    } 
                />
                
                {/* Rota Protegida da Calculadora */}
                <Route 
                    path="/converter" 
                    element={
                        <ProtectedRoute>
                            <Converter /> 
                        </ProtectedRoute>
                    } 
                />
                
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
};

export default App;