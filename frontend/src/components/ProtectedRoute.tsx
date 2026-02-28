import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: JSX.Element;
    allowedRoles?: string[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
        return <Navigate to="/login" replace />;
    }

    const { role } = JSON.parse(userData);

    if (allowedRoles && !allowedRoles.includes(role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return children;
};

export default ProtectedRoute;
