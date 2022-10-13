<script setup>
import { computed, ref } from 'vue'
import Moment from 'moment'
import TabView from 'primevue/tabview'
import TabPanel from 'primevue/tabpanel'
import Card from 'primevue/card'
import Chart from 'primevue/chart'
import SummaryMetrics from './ExpensesSummaryMetrics.vue'
import SummaryCategoryVariation from './ExpensesSummaryCategoryVariation.vue'
import useAnalyticsStore from '../stores/analytics.store'
import useSettingsStore from '../stores/settings.store'
import { getCategoryColorHex } from '../helpers/color'
import { formatCurrency } from '../helpers/expense'

const analyticsStore = useAnalyticsStore()
const { currentCurrency } = useSettingsStore()
const activeIndex = ref(0)

// array of hours in a day
const hoursInDay = Array.from({ length: 24 }, (_, i) => i)

// array of days in a month
const daysInMonth = Array.from(
  { length: Moment().daysInMonth() },
  (_, i) => i + 1
)

// array of months in a year
const monthsInYear = Array.from({ length: 12 }, (_, i) => i + 1)

const datasets = [
  analyticsStore.todayHourlySummary,
  analyticsStore.thisMonthDailySummary,
  analyticsStore.thisYearMonthlySummary,
].map((dataset) =>
  Object.entries(dataset).map(([label, data]) => ({
    type: 'bar',
    label,
    backgroundColor: getCategoryColorHex(label),
    borderColor: getCategoryColorHex(label),
    borderWidth: 1,
    borderRadius: 25,
    maxBarThickness: 15,
    data,
  }))
)

const dataset = computed(() => datasets.at(activeIndex.value))

const tabs = [
  { title: 'Today', content: '' },
  { title: 'This month', content: '' },
  { title: 'This year', content: '' },
]

const total = computed(() =>
  dataset.value
    ?.map((set) => set.data)
    .reduce((acc, curr) => acc.concat(curr), []) // flatten all arrays
    .reduce((acc, curr) => acc + curr, 0)
)

// computes the first day of current month
const firstDayOfMonth = ref(Moment().startOf('month').format('YYYY/MM/DD'))

// computes the last day of current month
const lastDayOfMonth = computed(() =>
  Moment().endOf('month').format('YYYY/MM/DD')
)

// computes the first day of current year
const firstDayOfYear = computed(() =>
  Moment().startOf('year').format('YYYY/MM/DD')
)

// computes the last day of current year
const lastDayOfYear = computed(() =>
  Moment().endOf('year').format('YYYY/MM/DD')
)

const period = computed(() =>
  [
    Moment().format('MMMM DD YYYY'),
    `${firstDayOfMonth.value} - ${lastDayOfMonth.value}`,
    `${firstDayOfYear.value} - ${lastDayOfYear.value}`,
  ].at(activeIndex.value)
)

const chartLabel = computed(() =>
  [hoursInDay, daysInMonth, monthsInYear].at(activeIndex.value)
)

const chartData = computed(() => ({
  labels: chartLabel.value,
  datasets: dataset.value,
}))

const chartOptions = {
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  plugins: {
    tooltips: {
      mode: 'index',
      intersect: false,
    },
    legend: {
      display: false,
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: '#495057',
      },
      grid: {
        display: false,
      },
    },

    y: {
      display: false,
      stacked: true,
    },
  },
}

const variations = [
  analyticsStore.dailyVariation,
  analyticsStore.monthlyVariation,
  analyticsStore.yearlyVariation,
]

const variationsByCategory = computed(() => variations.at(activeIndex.value))
</script>

<template>
  <div>
    <TabView v-model:activeIndex="activeIndex" lazy class="mt-1">
      <TabPanel v-for="tab in tabs" :key="tab.title" :header="tab.title">
        <div class="flex justify-content-evenly">
          <SummaryMetrics
            label="Total"
            :amount="formatCurrency(total, currentCurrency.code)"
            :period="period"
          ></SummaryMetrics>
        </div>
      </TabPanel>
    </TabView>

    <Card>
      <template #content>
        <div class="mt-1">
          <Chart type="bar" :data="chartData" :options="chartOptions" />
        </div>

        <div class="mt-3">
          <div
            v-for="(amount, category) of variationsByCategory"
            :key="category"
          >
            <SummaryCategoryVariation
              :category="category"
              :variation="amount"
              :currency="currentCurrency.code"
            ></SummaryCategoryVariation>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>
