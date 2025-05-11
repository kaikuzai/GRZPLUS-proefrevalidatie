import FormSelection from "../pages/FormSelection";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import FormPage from "../pages/FormPage";
import AddPatientPage from "../pages/AddPatientPage";
import AuthenticationCheck from "../pages/AuthenticationPage";

interface RouteConfig {
    path: string, 
    element: React.FC, 
    isProtected: Boolean, 
}; 

export const routes: RouteConfig[] = [
    {path: '/', element: HomePage, isProtected: false},
    {path: '/formulieren', element: FormSelection, isProtected: false},
    {path: '/formulier/:slug', element: FormPage, isProtected: false},
    {path: '/dashboard', element: DashboardPage, isProtected: false},
    {path: '/add-patient', element: AddPatientPage, isProtected: false},
    {path: '/login', element: LoginPage, isProtected: false},
    {path: '/auth-check', element: AuthenticationCheck, isProtected: false},
]

