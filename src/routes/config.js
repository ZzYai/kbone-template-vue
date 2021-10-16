export default {
    mode: 'hash',
    routes: [
        {
            path: '',
            redirect: '/home'
        },
        {
            path: '/home',
            component: () => import("@/views/home/home"),
            children: [
                {
                    path: '',
                    redirect: 'homeAddr'
                },
                {
                    path: 'homeAddr',
                    name: 'homeAddr',
                    component: () => import("@/views/home/homeAddr/homeAddr")
                },
                ,
                {
                    path: 'sayMessage',
                    name: 'sayMessage',
                    component: () => import("@/views/home/sayMessage/sayMessage")
                },
                {
                    path: 'bussinessList',
                    name: 'bussinessList',
                    component: () => import("@/views/home/bussinessList/bussinessList")
                },
                {
                    path: 'mine',
                    name: 'mine',
                    component: () => import("@/views/home/mine/mine/mine")
                },
                {
                    path: 'industryChain',
                    name: 'industryChain',
                    component: () => import("@/views/home/industryChain/industryChain")
                },
                {
                    path: 'industryCorrelation',
                    name: 'industryCorrelation',
                    component: () => import("@/views/home/industryChain/industryCorrelation")
                }
            ]
        },
        {
            path: '/enterprise',
            component: () => import("@/views/enterprise/enterprise"),
            children: [
                {
                    path: '',
                    // name : 'enterpriseHome',
                    redirect: 'enterpriseHome'
                },
                {
                    path: 'enterpriseHome',
                    name: 'enterpriseHome',
                    component: () => import("@/views/enterprise/enterpriseHome")
                },
                {
                    path: 'enterprisePanorama/:durl',
                    name: 'enterprisePanorama',
                    component: () => import("@/views/enterprise/enterprisePanorama")
                },
                {
                    path: 'enterpriseServe',
                    name: 'enterpriseServe',
                    component: () => import("@/views/enterprise/enterpriseServe")
                },
                {
                    path: 'enterpriseNews',
                    name: 'enterpriseNews',
                    component: () => import("@/views/enterprise/enterpriseNews")
                },
                {
                    path: 'enterpriseImg',
                    name: 'enterpriseImg',
                    component: () => import("@/views/enterprise/enterpriseImg"),
                },
                {
                    path : 'enterpriseShowImg',
                    name : 'enterpriseShowImg',
                    component: () => import("@/views/enterprise/enterpriseShowImg"),
                },
                {
                    path: 'enterprisePPT',
                    name: 'enterprisePPT',
                    component: () => import("@/views/enterprise/enterprisePPT")
                },
                {
                    path: 'enterpriseWe/:data',
                    name: 'enterpriseWe',
                    component: () => import("@/views/enterprise/enterpriseWe")
                },
                {
                    path: 'severDetail/:data',
                    name: 'severDetail',
                    component: () => import("@/views/enterprise/enterpriseServeDetail")
                },
                {
                    path : 'enterprisePublicity',
                    name : 'enterprisePublicity',
                    component : ()=>import('@/views/enterprise/enterprisePublicity')
                }
            ]
        },{
            path : '*',
            redirect : 'home'
        }
    ]
}