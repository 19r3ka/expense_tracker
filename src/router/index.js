// Create a new vue-router 4

import { createRouter, createWebHistory } from 'vue-router'
const Home = () => import('../views/HomePage.vue')
const ExpenseEditor = () => import('../views/NewExpensePage.vue')
const NotFound = () => import('../views/NotFoundPage.vue')
const LoadBackup = () => import('../views/LoadBackupPage.vue')
const Expenses = () => import('../views/ExpensesPage.vue')

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: Home,
    meta: { displayTitle: 'Home' },
  },
  {
    path: '/expense/:id/edit',
    name: 'ExpenseEditPage',
    component: ExpenseEditor,
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
    component: ExpenseEditor,
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
