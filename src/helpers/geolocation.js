// Callback function for when we want to get the current location
function getLocationCallback(resolve, reject) {
  function onSuccess(position) {
    const { latitude, longitude } = position.coords
    resolve([latitude, longitude])
  }

  function onError(error) {
    reject(error)
  }

  if (!('geolocation' in navigator)) {
    reject(new Error('Geolocation is not available'))
  }

  navigator.geolocation.getCurrentPosition(onSuccess, onError)
}

// Promisified function to get user current location using navigator.geolocation
export const getLocationAsync = () => new Promise(getLocationCallback)
