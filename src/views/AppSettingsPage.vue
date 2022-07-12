<script setup>
import { computed, ref } from 'vue'
import TieredMenu from 'primevue/tieredmenu'
import OverlayPanel from 'primevue/overlaypanel'
import ListBox from 'primevue/listbox'
import currencyList from '../config/currency'
import useSettingsStore from '../stores/settings.store'

const opcurrency = ref()
const oplanguage = ref()
const settingsStore = useSettingsStore()

const currentCurrency = computed({
  get: () => settingsStore.currentCurrency,
  set: (value) => settingsStore.setCurrency(value),
})

const currentLanguage = ref('English')

const contentItems = [
  {
    label: 'Backup',
    icon: 'pi pi-database',
    items: [
      {
        label: 'Backup',
        icon: 'pi pi-fw pi-upload',
        command: () => {
          console.log('Backup')
        },
      },
      {
        label: 'Restore',
        icon: 'pi pi-download',
        to: { name: 'LoadBackupPage' },
      },
    ],
  },
]

const preferencesItems = [
  {
    label: 'Language',
    icon: 'pi pi-fw pi-globe',
    command: ({ originalEvent }) => {
      oplanguage.value.toggle(originalEvent)
    },
  },
  {
    label: 'Currency',
    icon: 'pi pi-fw pi-money-bill',
    command: ({ originalEvent }) => {
      opcurrency.value.toggle(originalEvent)
    },
  },
]
</script>

<template>
  <div id="settings-page" class="page">
    <section class="grid section p-2 text-600">
      <div class="col-12 section-title">
        <h3 class="uppercase m-1">Content</h3>
      </div>

      <TieredMenu :model="contentItems" class="w-full" />
    </section>

    <section class="grid section p-2 text-600">
      <div class="col-12 section-title">
        <h3 class="uppercase m-1">Preferences</h3>
      </div>

      <TieredMenu :model="preferencesItems" class="w-full" />
    </section>

    <OverlayPanel ref="oplanguage" :show-close-icon="true" class="w-10">
      <div class="w-full">
        <p>
          Your current default language is:
          <strong>{{ currentLanguage }}</strong>
        </p>
        <p>Language selection has not yet been implemented.</p>
      </div>
    </OverlayPanel>

    <OverlayPanel ref="opcurrency" :show-close-icon="true" class="w-10">
      <div class="w-full">
        <p>
          Your current default currency is:
          <strong>{{ currentCurrency.code }}</strong>
        </p>

        <form>
          <div class="field">
            <div class="control">
              <ListBox
                v-model="currentCurrency"
                :options="currencyList"
                option-label="currency"
                :multiple="false"
                :filter="true"
                list-style="max-height:250px"
                style="width: '100%'"
                filter-placeholder="Search"
              />
            </div>
          </div>
        </form>
      </div>
    </OverlayPanel>
  </div>
</template>

<!-- <style>
.p-submenu-list {
  right: -200px !important;
}
</style> -->
