<script setup>
import { computed, ref, onActivated, onDeactivated } from 'vue'
import AppCamera from 'simple-vue-camera'
import Avatar from 'primevue/avatar'
import Button from 'primevue/button'
import { useToast } from 'primevue/usetoast'
import { notification } from '../helpers/notification'
import { useRouter } from 'vue-router'

const resolution = {
  width: 375,
  height: 812,
}

const emits = defineEmits(['snapshot'])
const toast$ = useToast()
const router = useRouter()

const camera = ref(null)
const videoInputs = ref([])
const imageUrl = ref('')

const hasOneCamera = computed(() => videoInputs.value.length === 1)
const hasThumbnail = computed(() => !!imageUrl.value)

// saves image blob to base64 string format
const toBase64String = (blob) =>
  new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.src = URL.createObjectURL(blob)
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(img.src)
      resolve(canvas.toDataURL('image/jpeg'))
    }
    img.onerror = reject
  })

// Takes a photo and returns the data URL.
const onSnapshot = async () => {
  const blob = await camera.value?.snapshot(resolution, 'image/jpeg', 0.5)
  imageUrl.value = await toBase64String(blob)
  emits('snapshot', imageUrl.value)
}

// Switches between available video input devices
const onChangeCamera = () => {
  if (hasOneCamera.value) return
  const currentCamera = camera.value?.currentDeviceID

  const nextCameraIndex =
    (videoInputs.value.indexOf(currentCamera) + 1) % videoInputs.value.length

  // Find the next camera
  const nextCamera = videoInputs.value[nextCameraIndex]

  camera.value?.changeCamera(nextCamera.deviceId)
}

// Navigate user to the page of the latest reminders
const onThumbnailClick = () => {
  const route = { name: 'RemindersPage' }
  router.push(route)
}

// Callback when the camera is faced with an error.
const onError = (error) => {
  let message = ''

  switch (error.name) {
    case 'NotAllowedError':
      message =
        'You denied permission to use camera. To use reminders, change permissions in your browser.'
      break
    case 'NotReadableError':
      message = 'Something prevented access to your camera.'
      break
    default:
      message = error.message
      break
  }

  toast$.add(notification(message, 'error'))
  router.back()
}

onActivated(async () => {
  camera.value?.start()
  videoInputs.value = await camera.value?.devices(['videoinput'])
})

onDeactivated(() => {
  camera.value?.stop()
})
</script>

<template>
  <AppCamera ref="camera" :resolution="resolution" autoplay @error="onError">
    <div
      class="absolute w-full bottom-0 p-4 overlay flex align-items-center justify-content-evenly"
    >
      <Button
        id="change-camera-button"
        icon="pi pi-sync"
        class="p-button-outlined p-button-rounded w-3rem h-3rem surface-100"
        :disabled="hasOneCamera"
        @click="onChangeCamera"
      ></Button>
      <Button
        id="take-photo-button"
        class="p-button-outlined p-button-rounded w-4rem h-4rem surface-0"
        @click="onSnapshot"
      >
        <i class="pi pi-camera text-4xl"></i>
      </Button>
      <Button
        id="thumbnail-button"
        class="p-button-outlined p-button-rounded p-0 w-3rem h-3rem surface-200"
        :disabled="!hasThumbnail"
        @click="onThumbnailClick"
      >
        <Avatar
          v-show="hasThumbnail"
          :image="imageUrl"
          size="xlarge"
          shape="circle"
        />
      </Button>
    </div>
  </AppCamera>
</template>

<style scoped>
.overlay {
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
}

#take-photo-button .p-button-icon {
  font-size: 2.5rem !important;
}
</style>
