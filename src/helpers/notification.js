// formats the notification options for toast component
export const notification = (
  message,
  severity = 'success',
  duration = 5000
) => ({
  severity,
  summary: severity.charAt(0).toUpperCase() + severity.slice(1),
  detail: message,
  life: duration,
})
