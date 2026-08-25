import { GlobalConstant } from "./GlobalConstant";

export const MenuConstant = {
    menuItems: [
        { title: 'Dashboard', route: '/admin/dashboard', section: 'Overview', roles: [GlobalConstant.ROLE.DOCTOR, GlobalConstant.ROLE.RECEIPNEST, GlobalConstant.ROLE.ADMIN] },
        { title: 'Patients', route: '/admin/patients', section: 'Management', roles: [GlobalConstant.ROLE.DOCTOR, GlobalConstant.ROLE.RECEIPNEST, GlobalConstant.ROLE.ADMIN] },
        { title: 'Visits', route: '/admin/visits', section: 'Management', roles: [GlobalConstant.ROLE.DOCTOR, GlobalConstant.ROLE.RECEIPNEST, GlobalConstant.ROLE.ADMIN] },
        { title: 'Medicines', route: '/admin/Medincines', section: 'Assets', roles: [GlobalConstant.ROLE.DOCTOR, GlobalConstant.ROLE.ADMIN] },
        { title: 'staff', route: '/admin/staff', section: 'Assets', roles: [GlobalConstant.ROLE.ADMIN] }
    ]
}
