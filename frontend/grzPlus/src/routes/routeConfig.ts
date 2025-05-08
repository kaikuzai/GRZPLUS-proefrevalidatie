import FormSelection from "../pages/FormSelection";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import DashboardPage from "../pages/DashboardPage";
import FormPage from "../pages/FormPage";
import AddPatientPage from "../pages/AddPatientPage";

interface RouteConfig {
    path: string, 
    element: React.FC, 
    isProtected: Boolean, 
}; 

export const routes: RouteConfig[] = [
    {path: '/', element: HomePage, isProtected: false},
    {path: '/formulieren', element: FormSelection, isProtected: false},
    {path: '/formulier', element: FormPage, isProtected: false},
    {path: '/dashboard', element: DashboardPage, isProtected: false},
    {path: '/add-patient', element: AddPatientPage, isProtected: false},
    {path: '/login', element: LoginPage, isProtected: false},

]

