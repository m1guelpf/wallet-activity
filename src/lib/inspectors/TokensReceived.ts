import a from 'indefinite'
import millify from 'millify'
import logger from '../logger'
import { ZERO_ADDRESS } from '../consts'
import { ActivityEntry } from '../Activity'
import { TransferEvent } from '@/types/utils'
import collect, { Collection } from 'collect.js'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'
import { addressEquals, formatAddressShort, parseTransferData } from '../utils'

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
		logger.debug('received', entry)

		const received = this.aggregateReceived(entry, config.userAddress)

		if (received.length == 1 && received[0].isNFT) {
			const isMint = addressEquals(received[0].from?.[0], ZERO_ADDRESS)

			return {
				title: `${isMint ? 'Minted' : 'Received'} ${
					entry.insights.contractName ? a(entry.insights.contractName) : 'an'
				} NFT`,
				description: isMint
					? ''
					: `${formatAddressShort(
							entry.insights?.fromENS || received[0].from?.[0] || entry.raw.from
					  )} sent you an NFT`,
			}
		}

		const from = received
			.map(transfer =>
				transfer.from.map(addr =>
					formatAddressShort(addressEquals(addr, ZERO_ADDRESS) ? transfer.contract.address : addr)
				)
			)
			.flat()
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
		return collect(
			parseTransferData(entry).filter(
				transfer => addressEquals(transfer.from, userAddress) || addressEquals(transfer.to, userAddress)
			)
		)
			.groupBy('contract.address')
			.values()
			.map((aggregateTransfers: Collection<TransferEvent & { isNFT: boolean }>) => {
				const oneOf = aggregateTransfers.random()

				return {
					contract: oneOf.contract,
					isNFT: oneOf.isNFT,
					from: aggregateTransfers
						.filter(transfer => addressEquals(transfer.to, userAddress))
						.map(transfer => transfer.from)
						.toArray(),
					amount: aggregateTransfers
						.map(transfer =>
							addressEquals(transfer.from, userAddress)
								? -parseFloat(transfer.value)
								: parseFloat(transfer.value)
						)
						.sum(),
				}
			})
			.filter(aggregateTransfers => (aggregateTransfers.isNFT as boolean) || aggregateTransfers.amount > 0)
			.toArray()
	}
}

export default TokensReceived
