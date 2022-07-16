<script setup>
import Card from 'primevue/card'
import FileUpload from 'primevue/fileupload'
import { useToast } from 'primevue/usetoast'
import { csvToObjectArrays } from '../helpers/backup'
import useExpenseStore from '../stores/expenses.store'

const expenseStore = useExpenseStore()

const toast$ = useToast()

// callback function for file upload that handles data reading, records formating and saving into Store
function onFileUpload(e) {
  const file = e.files[0]
  const reader = new FileReader()

  reader.onload = (e) => {
    const data = e.target.result
    const formatedData = csvToObjectArrays(data)

    expenseStore.seed(formatedData)
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
                <i class="pi pi-file text-6xl text-primary-300"></i>
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
