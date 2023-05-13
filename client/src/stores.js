import { writable } from 'svelte/store'

export const isAuthenticated = writable(undefined)

export const searchTerm = writable('')

export const notes = writable([])
