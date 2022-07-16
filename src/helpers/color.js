import { categories } from '../config/expense'

// calculate the hex alpha value given a percentage
export const percentToHex = (percent = 0) => {
  const boundedPercentage = Math.max(0, Math.min(percent, 100))
  const intValue = Math.round(boundedPercentage * 2.55)
  return `${intValue.toString(16)}`
}

// add transparency to hex color codes
export const addTransparency =
  (alpha = 0) =>
  (hex) => {
    const transparency = percentToHex(alpha)
    //   return hex.replace(/^#/, '$&' + transparency)
    return hex + transparency
  }

// get the color for the category
const getCategoryColorName = (category) =>
  categories.find((c) => c.name === category).color

// returns the color for the category icon
export const colorizedText = (category, shade = 300) =>
  `text-${getCategoryColorName(category)}-${shade}`
