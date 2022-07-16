<script setup>
import { computed, reactive } from 'vue'
import { formatCurrency, formatNumber } from '../helpers/expense'
import { categories } from '../config/expense'
import { addTransparency, colorizedText } from '../helpers/color'
import { colorHex } from '../config/color'
import Chart from 'primevue/chart'
import useSettingsStore from '../stores/settings.store'

const props = defineProps({
  report: {
    type: Object,
    default: () => {},
  },
})

const { currentCurrency } = useSettingsStore()

// returns the icon corresponding to category
const getCategoryIcon = (category) =>
  categories.find((c) => c.name === category).icon

// computes the total amount of expenses
const totalAmount = computed(() =>
  formatCurrency(props.report.total, currentCurrency.code)
)

const totalAmountByCategory = computed(() =>
  Object.entries(props.report.category)
    .filter(([, value]) => value > 0)
    .sort((a, b) => b[1] - a[1])
)

const transistionActive = reactive({
  enterClass: 'animate__fadeIn',
  leaveClass: 'animate__fadeOut',
})

const labels = computed(() => Object.keys(props.report.category))
const data = computed(() => Object.values(props.report.category))

const borderColor = computed(() =>
  labels.value.map(
    (label) =>
      colorHex[categories.find((category) => category.name === label).color]
  )
)
const backgroundColor = computed(() =>
  borderColor.value.map(addTransparency(40))
)

const chartData = computed(() => ({
  labels: labels.value,
  datasets: [
    {
      label: 'Expenses',
      data: data.value,
      backgroundColor: backgroundColor.value,
      borderColor: borderColor.value,
      borderWidth: 1,
      cutout: '80%',
      radius: '90%',
    },
  ],
}))

const options = {
  plugins: {
    legend: {
      display: false,
    },
  },
}
</script>

<template>
  <div class="grid p-2 m-1 bg-white">
    <div id="chart" class="col-9">
      <Chart type="doughnut" :data="chartData" :options="options" />
      <p class="overlay text-xl text-red-300">- {{ totalAmount }}</p>
    </div>

    <div id="chart-legend" class="col grid pt-4 pr-3">
      <TransitionGroup
        :enter-active-class="transistionActive.enterClass"
        :leave-active-class="transistionActive.leaveClass"
      >
        <div
          v-for="[category, amount] in totalAmountByCategory"
          :key="category"
          class="col-12 grid p-0"
        >
          <div class="icon col-4 text-xs">
            <i class="material-icons" :class="colorizedText(category)">{{
              getCategoryIcon(category)
            }}</i>
          </div>

          <div class="total col-8">
            <p class="m-0 text-right text-700">
              {{ formatNumber(amount) }}
            </p>
          </div>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
/* vertically center text */
p {
  margin: 0;
  padding: 0;
  line-height: 1.5;
}

div {
  padding: 4px;
}

div#chart-legend {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
}

.overlay {
  position: relative;
  top: -50%;
  width: 100%;
  text-align: center;
  margin: auto;
  z-index: 1;
}
</style>
