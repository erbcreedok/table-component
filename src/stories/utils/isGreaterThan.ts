export const isGreaterThan = (value: any, max = Infinity) => {
  const numberValue = Number(value)
  if (Number.isNaN(numberValue)) return false

  return numberValue > max
}
