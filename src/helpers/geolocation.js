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

// asserts that a value is between two other values
const isBetween = (value, min, max) => value >= min && value <= max

// Promisified function to get user current location using navigator.geolocation
export const getLocationAsync = () => new Promise(getLocationCallback)

// check if string represents valid pair of longitude and latitude values
export const isValidGeolocation = (string) => {
  const [longitude, latitude] = string.split(',').map(Number)
  return (
    !isNaN(longitude) &&
    !isNaN(latitude) &&
    isBetween(longitude, -180, 180) &&
    isBetween(latitude, -90, 90)
  )
}
