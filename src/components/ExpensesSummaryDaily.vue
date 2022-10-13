<script setup>
import SummaryMetrics from './ExpensesSummaryMetrics.vue'
const title = 'Total'
const total = 1000
const unit = '$'
const period = '2019-01-01'
</script>

<template>
  <div class="flex justify-content-evenly">
    <SummaryMetrics
      :label="title"
      :amount="total"
      :period="period"
      :unit="unit"
    ></SummaryMetrics>
  </div>

  <div></div>
</template>
