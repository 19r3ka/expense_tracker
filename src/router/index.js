// Create a new vue-router 4

import { createRouter, createWebHistory } from 'vue-router'

const Home = () => import('../views/HomePage.vue')
const Expenses = () => import('../views/ExpensesPage.vue')
const NewExpense = () => import('../views/NewExpensePage.vue')
const EditExpense = () => import('../views/EditExpensePage.vue')
const Settings = () => import('../views/AppSettingsPage.vue')
const LoadBackup = () => import('../views/LoadBackupPage.vue')
const NotFound = () => import('../views/NotFoundPage.vue')
const LoadAirtable = () => import('../views/LoadAirtablePage.vue')

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: Home,
    meta: { displayTitle: 'Home' },
  },
  {
    path: '/airtable',
    name: 'LoadAirtablePage',
    component: LoadAirtable,
    meta: { displayTitle: 'Airtable' },
  },
  {
    path: '/settings',
    name: 'SettingsPage',
    component: Settings,
    meta: { displayTitle: 'Settings' },
  },
  {
    path: '/expense/:id/edit',
    name: 'EditExpensePage',
    component: EditExpense,
    prop: true,
    meta: { displayTitle: 'Edit an expense' },
  },
  {
    path: '/expenses/',
    name: 'ExpensesPage',
    component: Expenses,
    meta: { displayTitle: 'Expenses' },
  },
  {
    path: '/expenses/new',
    name: 'NewExpensePage',
    component: NewExpense,
    meta: { displayTitle: 'Add an expense' },
  },
  {
    path: '/seed',
    name: 'LoadBackupPage',
    component: LoadBackup,
    meta: { displayTitle: 'Upload backup' },
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'PageNotFound',
    component: NotFound,
    meta: { displayTitle: 'Page not found' },
  },
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
