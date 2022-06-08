<template>
  <div id="home" class="page">
    <ul>
      <li>
        <RouterLink :to="{ name: 'NewExpensePage' }">
          Add an expense
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'LoadBackupPage' }">
          Load a backup file
        </RouterLink>
      </li>
      <li>
        <RouterLink :to="{ name: 'ExpensesPage' }">
          See all expense records
        </RouterLink>
      </li>
    </ul>
  </div>
</template>
