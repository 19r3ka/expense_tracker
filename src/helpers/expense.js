// An expense object with default values
export const defaultValues = {
  category: null,
  amount: 0,
  currency: '',
  datetime: null,
  description: '',
  location: [0, 0],
  receipt: '',
  createdAt: null,
  updatedAt: null,
}

// return a map of expense categories with associated id, name, icon and color
export const categories = [
  { name: 'clothing', id: 1, icon: 'checkroom', color: 'blue' },
  { name: 'entertainment', id: 2, icon: 'celebration', color: 'red' },
  { name: 'food', id: 3, icon: 'restaurant', color: 'indigo' },
  { name: 'gift / donation', id: 4, icon: 'redeem', color: 'teal' },
  {
    name: 'health & personal care',
    id: 5,
    icon: 'health_and_safety',
    color: 'green',
  },
  { name: 'household supply', id: 6, icon: 'microwave', color: 'cyan' },
  { name: 'housing', id: 7, icon: 'home', color: 'orange' },
  { name: 'personal', id: 8, icon: 'sentiment_satisfied', color: 'purple' },
  { name: 'transportation', id: 9, icon: 'directions_car', color: 'pink' },
  { name: 'utilities', id: 10, icon: 'bolt', color: 'bluegray' },
]

// generates a unique id for each expense using createObjectURL static method
export const uuid = () => {
  const tempUrl = URL.createObjectURL(new Blob()).toString()
  // get last part of url removing the prefix (e.g. 'blob:http://localhost:3000/')
  const id = tempUrl.split(/[:/]/g).pop()
  // release the blob and associated resources
  URL.revokeObjectURL(tempUrl)
  return id
}
