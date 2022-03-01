import a from 'indefinite'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, formatAddressShort, parseTransferData, TransferEvent } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'
import collect, { Collection } from 'collect.js'
import millify from 'millify'

class TokensReceived extends Inspector {
	name = 'Tokens Received'

	public check(entry: ActivityEntry, config: Config): boolean {
		if (entry.insights.generalPurpose !== TX_PURPOSE.CONTRACT_INTERACTION) {
			return false
		}

		return parseTransferData(entry).some(transfer => addressEquals(transfer.to, config.userAddress))
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		if (entry.insights.contractName == 'ENS') return { title: 'Received an ENS name' }

		const received = this.aggregateReceived(entry, config.userAddress)

		if (received.length == 1 && received[0].isNFT) {
			return {
				title: `Received ${entry.insights.contractName ? a(entry.insights.contractName) : 'an'} NFT`,
				description: `${formatAddressShort(
					entry.insights?.fromENS || received[0].from?.[0] || entry.raw.from
				)} sent you an NFT`,
			}
		}

		const from = received
			.map(transfer => transfer.from)
			.flat()
			.map(addr => formatAddressShort(addr))
			.join(', ')

		return {
			title: `Received ${received
				.map(transfer => {
					if (transfer.isNFT) return `${a(transfer.contract.name)} NFT`

					return `${millify(transfer.amount)} $${transfer.contract.symbol}`
				})
				.join(', ')}`,
			description: `${
				from || entry.insights?.fromENS || formatAddressShort(entry.raw.from)
			} sent you some tokens`,
		}
	}

	aggregateReceived(
		entry: ActivityEntry,
		userAddress: string
	): Array<{
		contract: {
			name: string
			symbol: string
			address: string
		}
		isNFT: boolean
		from: string[]
		amount: number
	}> {
		return collect(parseTransferData(entry).filter(transfer => addressEquals(transfer.to, userAddress)))
			.groupBy('contract.address')
			.values()
			.map((aggregateTransfers: Collection<TransferEvent & { isNFT: boolean }>) => {
				const oneOf = aggregateTransfers.random()

				return {
					contract: oneOf.contract,
					isNFT: oneOf.isNFT,
					from: aggregateTransfers.map(transfer => transfer.from).toArray(),
					amount: aggregateTransfers.map(transfer => parseFloat(transfer.value)).sum(),
				}
			})
			.toArray()
	}
}

export default TokensReceived
