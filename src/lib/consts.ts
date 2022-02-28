import { ChainId, Network } from '@/types/utils'

export const networks: Record<Network, ChainId> = {
	mainnet: 1,
	kovan: 42,
	polygon: 137,
	mumbai: 80001,
	arbitrum: 42161,
	'arbitrum-rinkeby': 421611,
}

export const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const monthsOfYear = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
]

export const contractNameReplacements = {
	'OpenSea Shared Storefront': 'Opensea',
	'Project Wyvern Exchange': 'Opensea',
	'ENS: Base Registrar': 'ENS',
}
