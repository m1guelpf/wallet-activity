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
