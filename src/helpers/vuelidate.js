import {
  helpers,
  maxValue,
  minLength,
  minValue,
  numeric,
  required,
} from '@vuelidate/validators'

// A validator for valid category with not empty name and id
const validCategory = (category) => category?.name !== ''

// A validator for geo coordinates
const notNullIsland = ([lat, lng]) =>
  !isNaN(lat) &&
  !isNaN(lng) &&
  lat >= -90 &&
  lat <= 90 &&
  lng >= -90 &&
  lng <= 90

export const expenseRules = {
  amount: {
    required,
    numeric,
    minValue: helpers.withMessage(
      'Expense amount cannot be zero.',
      minValue(1)
    ),
  },
  category: {
    required,
    validCategory: helpers.withMessage(
      'You must select a category',
      validCategory
    ),
  },
  datetime: {
    required,
    maxValue: helpers.withMessage(
      'Date and time value is in the future',
      maxValue(new Date())
    ),
  },
  description: {
    required,
    minLength: helpers.withMessage(
      'You must describe the expense.',
      minLength(1)
    ),
  },
  location: {
    notNullIsland: helpers.withMessage(
      'You must select a location.',
      notNullIsland
    ),
  },
}
