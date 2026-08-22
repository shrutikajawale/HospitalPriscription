import { Routes } from '@angular/router';
import { Layout } from './pages/layout/layout';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Patients } from './pages/patients/patients';
import { Visits } from './pages/visits/visits';
import { Medicins } from './pages/medicins/medicins';
import { MedicineEdit } from './pages/medicins/medicine-edit';

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
                component: Dashboard
            },
            {
                path:'patients',
                component: Patients
            },
            {
                path:'visits',
                component: Visits
            },
             {
                path:'Medincines',
                component: Medicins
            },
            {
                path:'medicines/edit/:id',
                component: MedicineEdit
            },
        ]

    }
];
