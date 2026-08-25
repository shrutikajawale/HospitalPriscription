import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Patients } from './pages/patients/patients';
import { Visits } from './pages/visits/visits';
import { Medicins } from './pages/medicins/medicins';
import { MedicineEdit } from './pages/medicins/medicine-edit';
import { PatientDetails } from './pages/patients/patient-details';
import { VisitDetails } from './pages/visit-details/visit-details';
import { roleBasedAccessGuard } from './core/guards/role-based-access-guard';
import { Staff } from './pages/staff/staff';


export const routes: Routes = [
    {
        path:'',
        redirectTo:'login',
        pathMatch:'full'
    },
    {
        path:'login',
        component: Login
    },
    {
        path:'admin',
        component: Layout,
         children:[
            {
                path:'',
                redirectTo:'dashboard',
                pathMatch:'full'
            },
            {
                path:'dashboard',
                component: Dashboard,
                canActivate: [roleBasedAccessGuard],
                data: { roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'patients',
                component: Patients,
                canActivate: [roleBasedAccessGuard],
                data: { roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'patients/add',
                component: PatientDetails,
                canActivate: [roleBasedAccessGuard],
                data: { mode: 'add', roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'patients/view/:id',
                component: PatientDetails,
                canActivate: [roleBasedAccessGuard],
                data: { mode: 'view', roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'patients/edit/:id',
                component: PatientDetails,
                canActivate: [roleBasedAccessGuard],
                data: { mode: 'edit', roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'visits',
                component: Visits,
                canActivate: [roleBasedAccessGuard],
                data: { roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'visits/add',
                component: VisitDetails,
                canActivate: [roleBasedAccessGuard],
                data: { mode: 'add', roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'visits/view/:id',
                component: VisitDetails,
                canActivate: [roleBasedAccessGuard],
                data: { mode: 'view', roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
            {
                path:'visits/edit/:id',
                component: VisitDetails,
                canActivate: [roleBasedAccessGuard],
                data: { mode: 'edit', roles: ['Admin', 'Doctor', 'Receptionist'] }
            },
             {
                path:'Medincines',
                component: Medicins,
                canActivate: [roleBasedAccessGuard],
                data: { roles: ['Admin', 'Doctor'] }
            },
            {
                path:'medicines/edit/:id',
                component: MedicineEdit
                ,canActivate: [roleBasedAccessGuard]
                ,data: { roles: ['Admin', 'Doctor'] }
            },
            {
                path:'staff',
                component: Staff
                ,canActivate: [roleBasedAccessGuard]
                ,data: { roles: ['Admin'] }
            },
        ]

    }
];
