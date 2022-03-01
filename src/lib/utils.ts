import { ethers } from 'ethers'
import { NextApiRequest } from 'next'
import { ActivityEntry } from './Activity'
import { Formatter } from '@ethersproject/providers'
import { ChainId, Network, TransferEvent } from '@/types/utils'
import { TransactionResponse } from '@ethersproject/abstract-provider'
import { contractNameReplacements, daysOfWeek, monthsOfYear, networks } from './consts'

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

export const getChainId = (network: Network): ChainId => {
	return networks[network]
}

export const getDayOfWeek = (date: Date): string => {
	return daysOfWeek[date.getDay()]
}

export const getMonthOfYear = (date: Date): string => {
	return monthsOfYear[date.getMonth()]
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

export const correctContractName = (name: string): string => {
	if (contractNameReplacements[name]) return contractNameReplacements[name]

	return name
}

export const parseTransferData = (entry: ActivityEntry): TransferEvent[] => {
	return (
		entry.insights.interactions
			?.map(contract =>
				contract.details
					.filter(event => event.event.toLowerCase().includes('transfer'))
					.map(event => ({
						contract: {
							name: contract.contract,
							symbol: contract.contract_symbol,
							address: contract.contract_address,
						},
						to: (event.to ?? event._to) as string | undefined,
						from: (event.from ?? event._from) as string | undefined,
						value: (event.value ?? event._value) as string | undefined,
						isNFT: (event.value ?? event._value) === undefined,
					}))
			)
			?.flat() ?? []
	)
}

const formatter = new Formatter()
export const getTx = async (
	provider: ethers.providers.JsonRpcProvider,
	transactionHash: string
): Promise<TransactionResponse & { creates: string }> => {
	return formatter.transactionResponse(
		await provider.perform('getTransaction', { transactionHash })
	) as TransactionResponse & { creates: string }
}
