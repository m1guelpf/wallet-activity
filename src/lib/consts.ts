import { ChainId, Network } from '@/types/utils'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

export const networks: Record<Network, ChainId> = {
	mainnet: 1,
	kovan: 42,
	polygon: 137,
	mumbai: 80001,
	arbitrum: 42161,
	'arbitrum-rinkeby': 421611,
}

export const multicallAddresses: Record<ChainId, string> = {
	1: '0xeefba1e63905ef1d7acba5a8513c70307c1ce441',
	42: '0x2cc8688c5f75e365aaeeb4ea8d6a480405a48d2a',
	137: '0x11ce4B23bD875D7F5C6a31084f55fDe1e9A87507',
	42161: '0x813715eF627B01f4931d8C6F8D2459F26E19137E',
	421611: '', // @TODO: Find multicall for arbitrum rinkeby
	80001: '0x08411ADd0b5AA8ee47563b146743C13b3556c9Cc',
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
	Guestbook__v1_0: 'Guestbook',
}
