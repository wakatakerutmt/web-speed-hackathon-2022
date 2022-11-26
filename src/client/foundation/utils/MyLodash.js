export const without = (arr, ...args) => arr.filter(item => !args.includes(item))

export const difference = (arr1, arr2) => arr1.filter(x => !arr2.includes(x))

export const slice = (arr, start, end) => [...arr.slice(start, end)]

export const sample = (arr) => Math.floor(Math.random() * arr.length)

export const range = (num1, num2) => Array.from({ length: num2 - num1 }, (_, i) => i + num1)