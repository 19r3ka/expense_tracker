// saves pinia state to localStorage using mutation.storeId as key
export function persistToLocalStorage({ storeId }, state) {
  const serializedState = JSON.stringify(state[storeId])
  localStorage.setItem(`scrooge-${storeId}`, serializedState)
}
