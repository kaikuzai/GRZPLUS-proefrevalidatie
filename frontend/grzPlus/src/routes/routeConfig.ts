import FormSelection from "../pages/FormSelection";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import FormDashboardPage from "../pages/FormDashboardPage";
import FormPage from "../pages/FormPage";
import AuthenticationCheck from "../pages/AuthenticationPage";
import SetPasswordPage from "../pages/SetPasswordPage";
import PatientOverviewPage from "../pages/PatientOverviewPage";
import OnboardingPage from "../pages/OnboardingPage";
import InvitePatient from "../pages/InvitePatient";
import InviteCaregiver from "../pages/InviteCaregiver";

interface RouteConfig {
    path: string, 
    element: React.FC, 
    isProtected: Boolean, 
}; 

export const routes: RouteConfig[] = [
    {path: '/', element: HomePage, isProtected: false},
    {path: '/formulieren', element: FormSelection, isProtected: false},
    {path: '/formulier/:slug', element: FormPage, isProtected: false},
    {path: '/dashboard', element: FormDashboardPage, isProtected: false},
    {path: '/patient-toevoegen', element: InvitePatient, isProtected: false},
    {path: '/login', element: LoginPage, isProtected: false},
    {path: '/auth-check', element: AuthenticationCheck, isProtected: false},
    {path: '/set-password/:token', element: SetPasswordPage , isProtected: false},
    {path: '/zorgverlener-toevoegen', element: InviteCaregiver , isProtected: false},
    {path: '/patienten/', element: PatientOverviewPage , isProtected: false},
    {path: '/rondleiding/', element: OnboardingPage , isProtected: false},
]

