<script setup>
import { useRouter } from 'vue-router'
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import {
  arrayToObject,
  csvToArray,
  formatArray,
  isValidRow,
  notHeaderRow,
} from '../helpers/seed'
import useExpense from '../stores/expenses.store'
import { persistToLocalStorage } from '../helpers/pinia'
import { sortObjectsByDate } from '../helpers/date'

const expenseStore = useExpense()
expenseStore.$subscribe(persistToLocalStorage)

const toast$ = useToast()
const router = useRouter()
let formatedData = []

function onFileUpload(e) {
  const file = e.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    const data = e.target.result

    formatedData = csvToArray(data)
      .filter(isValidRow)
      .filter(notHeaderRow)
      .map(formatArray)
      .map(arrayToObject)

    console.log(formatedData.reduce(sortObjectsByDate, {}))
    localStorage.setItem('scrooge-backup', JSON.stringify(formatedData))
    const records = formatedData.length
    expenseStore.seed(formatedData.reduce(sortObjectsByDate, {}))

    toast$.add({
      severity: 'success',
      summary: 'Success',
      detail: `${records} records imported!`,
      life: 5000,
    })

    router.push({ name: 'ExpensesPage' })
  }

  reader.onerror = () => {
    toast$.add({
      severity: 'error',
      summary: 'Error',
      detail: `Failed to restore backup!`,
      life: 5000,
    })
  }

  reader.readAsText(file)
}
</script>

<template>
  <div id="load-backup" class="page">
    <Card class="mt-2">
      <template #title> Upload CSV </template>
      <template #content>
        <form class="p-fluid mt-5" @submit.prevent="onFileUpload">
          <FileUpload
            :auto="true"
            :show-cancel-button="false"
            :show-upload-button="false"
            accept=".csv"
            :custom-upload="true"
            @uploader="onFileUpload"
          >
            <template #empty>
              <div
                class="border-dashed border-2 border-primary w-full h-10rem flex flex-column align-items-center justify-content-center"
              >
                <i class="pi pi-file text-6xl text-primary-300" />
                <div>
                  <h5 class="text-primary text-center mb-1">
                    Select a CSV file to upload
                  </h5>
                  <h6 class="text-400 text-center m-0">
                    or drag and drop it here!
                  </h6>
                </div>
              </div>
            </template>
          </FileUpload>
        </form>
      </template>
    </Card>
  </div>
</template>
