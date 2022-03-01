import a from 'indefinite'
import { ActivityEntry } from '../Activity'
import { TransferEvent } from '@/types/utils'
import collect, { Collection } from 'collect.js'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, parseTransferData } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

const WYVERN_EXCHANGE = ['0x7be8076f4ea4a4ad08075c2508e481d6c946d12b', '0x7f268357a8c2552623316e2562d90e642bb538e5']

class OpenSeaBuy extends Inspector {
	name = 'OpenSea Buy'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			WYVERN_EXCHANGE.includes(entry.raw.to.toLowerCase()) &&
			entry.insights.method === 'atomicMatch_'
		)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		const transfersNFT = collect(parseTransferData(entry)).filter(transfer => transfer.isNFT)
		const isBuy = addressEquals(transfersNFT.random().to as string, config.userAddress)

		const boughtNFTs = transfersNFT
			.groupBy('contract.address')
			.values()
			.map((transfers: Collection<TransferEvent>): string => {
				const oneOf = transfers.random()

				if (transfers.count() > 1) return a(`${transfers.count()} ${oneOf.contract.name}`)
				return a(oneOf.contract.name)
			})
			.toArray()

		return {
			title: `${isBuy ? 'Bought' : 'Sold'} an NFT on OpenSea`,
			description: `${isBuy ? 'Bought' : 'Sold'} ${boughtNFTs.join(', ')} NFT${
				boughtNFTs.length > 1 ? 's' : ''
			} for ${entry.value_in_eth} ETH`,
		}
	}
}

export default OpenSeaBuy
