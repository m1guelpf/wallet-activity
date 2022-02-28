import collect, { Collection } from 'collect.js'
import a from 'indefinite'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'
import { addressEquals, parseTransferData, TransferEvent } from '../utils'

const LOOKSRARE_EXCHANGE = '0x59728544b08ab483533076417fbbb2fd0b17ce3a'

const SUPPORTED_METHODS = ['matchAskWithTakerBidUsingETHAndWETH']

type TakerBidEvent = {
	event: string
}

class LooksRareSale extends Inspector {
	name = 'LooksRare Sale'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.to, LOOKSRARE_EXCHANGE) &&
			SUPPORTED_METHODS.includes(entry.insights.method)
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

		if (entry.insights.method === 'matchAskWithTakerBidUsingETHAndWETH') {
			return {
				title: `${isBuy ? 'Bought' : 'Sold'} an NFT on LooksRare`,
				description: `${isBuy ? 'Bought' : 'Sold'} ${boughtNFTs.join(', ')} NFT${
					boughtNFTs.length > 1 ? 's' : ''
				} for ${entry.value_in_eth} ETH`,
			}
		}

		return {
			title: `${isBuy ? 'Bought' : 'Sold'} an NFT on LooksRare`,
		}
	}
}

export default LooksRareSale
