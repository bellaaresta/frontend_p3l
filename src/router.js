import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

function importComponent(path) {
    return () => import(`./components/${path}.vue`);
}

const router = new VueRouter({
    mode: "history",
    routes: [
        {
            path: '/login',
            name: 'Login',
            meta: { title: 'Login' },
            component: importComponent('Login'),
        },
        {
            path: "/dashboard",
            component: importComponent("DashboardLayout"),
            children: [
                {
                    path: "/dashboard",
                    name: "Dashboard",
                    meta: { title: 'Dashboard' },
                    component: importComponent("Dashboard"),
                },
                {
                    path: "/aset",
                    name: "Asets",
                    meta: { title: 'Aset' },
                    component: importComponent("DataMaster/Asets"),
                },
                {
                    path: "/mitra",
                    name: "Mitras",
                    meta: { title: 'Mitra' },
                    component: importComponent("DataMaster/Mitras"),
                },
                {
                    path: "/driver",
                    name: "Drivers",
                    meta: { title: 'Driver' },
                    component: importComponent("DataMaster/Drivers"),
                },
                {
                    path: "/pegawai",
                    name: "Pegawais",
                    meta: { title: 'Pegawai' },
                    component: importComponent("DataMaster/Pegawais"),
                },
                {
                    path: "/role",
                    name: "Roles",
                    meta: { title: 'Role' },
                    component: importComponent("DataMaster/Roles"),
                },
                {
                    path: "/customer",
                    name: "Customers",
                    meta: { title: 'Customer' },
                    component: importComponent("DataMaster/Customers"),
                },
                {
                    path: "/promo",
                    name: "Promos",
                    meta: { title: 'Promo' },
                    component: importComponent("DataMaster/Promos"),
                },
                {
                    path: "/transaksi",
                    name: "Transaksis",
                    meta: { title: 'Transaksi' },
                    component: importComponent("DataMaster/Transaksis"),
                },
                {
                    path: "/jadwalshift",
                    name: "Jadwalshifts",
                    meta: { title: 'Jadwalshift' },
                    component: importComponent("DataMaster/Jadwalshifts"),
                },
                {
                    path: "/detailjadwal",
                    name: "Detailjadwals",
                    meta: { title: 'Detailjadwal' },
                    component: importComponent("DataMaster/Detailjadwals"),
                },
            ],
        },
        {
            path: '*',
            redirect: '/'
        },
    ],
});

router.beforeEach((to, from, next) => {
    document.title = to.meta.title;
    next();
});


export default router;