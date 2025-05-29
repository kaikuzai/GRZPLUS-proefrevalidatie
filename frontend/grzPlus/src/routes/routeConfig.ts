import FormSelection from "../pages/FormSelection";
import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import FormDashboardPage from "../pages/FormDashboardPage";
import FormPage from "../pages/FormPage";
import AuthenticationCheck from "../pages/AuthenticationPage";
import InformationPage from "../pages/InformationPage2";
import SetPasswordPage from "../pages/SetPasswordPage";
import AdminInviteUserPage from "../pages/AdminInviteUserPage";
import PatientOverviewPage from "../pages/PatientOverviewPage";
import CaregiverInviteUserPage from "../pages/CaregiverInviteUserPage";
import OnboardingPage from "../pages/OnboardingPage";

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
    {path: '/patient-toevoegen', element: CaregiverInviteUserPage, isProtected: false},
    {path: '/login', element: LoginPage, isProtected: false},
    {path: '/auth-check', element: AuthenticationCheck, isProtected: false},
    {path: '/informatie', element: InformationPage , isProtected: false},
    {path: '/set-password/:token', element: SetPasswordPage , isProtected: false},
    {path: '/zorgverlener-toevoegen', element: AdminInviteUserPage , isProtected: false},
    {path: '/patienten/', element: PatientOverviewPage , isProtected: false},
    {path: '/rondleiding/', element: OnboardingPage , isProtected: false},
]

