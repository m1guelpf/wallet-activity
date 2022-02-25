import { ChainId, Network } from '@/types/utils'
import { NextApiRequest } from 'next'

export const buildUrl = (req: NextApiRequest, page = 0, limit = 100): string => {
	const url = new URL(req.url, `http://${req.headers.host}`)

	url.searchParams.set('page', page.toString())
	url.searchParams.set('limit', limit.toString())

	if (url.searchParams.get('page') == '1') url.searchParams.delete('page')
	if (url.searchParams.get('limit') == '100') url.searchParams.delete('limit')

	return `https://${req.headers.host}${url.pathname}/${
		url.searchParams.toString() == '' ? '' : `?${url.searchParams.toString()}`
	}`
}

const networks: Record<Network, ChainId> = {
	mainnet: 1,
	kovan: 42,
	polygon: 137,
	mumbai: 80001,
	arbitrum: 42161,
	'arbitrum-rinkeby': 421611,
}

export const getChainId = (network: Network): ChainId => {
	return networks[network]
}

export const getDayOfWeek = (date: Date): string => {
	return ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][date.getDay()]
}

export const getMonthOfYear = (date: Date): string => {
	return [
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
	][date.getMonth()]
}

export const formatAddressShort = (address: string): string | null => {
	if (!address) return null

	// Skip over ENS names
	if (address.includes('.')) return address

	return `${address.slice(0, 4)}…${address.slice(address.length - 4, address.length)}`
}

export const addressEquals = (address1: string, address2: string): boolean => {
	return address1?.toLowerCase() === address2?.toLowerCase()
}
