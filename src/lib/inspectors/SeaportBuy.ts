import a from 'indefinite'
import { ActivityEntry } from '../Activity'
import { TransferEvent } from '@/types/utils'
import collect, { Collection } from 'collect.js'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, correctContractName, parseTransferData } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'
import { formatUnits } from 'ethers/lib/utils'

const SEAPORT_CONTRACT = '0x00000000006c3852cbef3e08e8df289169ede581'

class SeaportBuy extends Inspector {
	name = 'Seaport Buy'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.to, SEAPORT_CONTRACT) &&
			entry.insights.method === 'fulfillBasicOrder'
		)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		const transfersNFT = collect(parseTransferData(entry)).filter(transfer => transfer.isNFT)

		if (transfersNFT.isEmpty()) {
			const matchEvent = entry.insights.interactions?.[0]?.details?.find(event => event.event === 'OrdersMatched')

			if (!matchEvent) {
				const guessIsBuy = entry.value_in_eth != '0'
				return { title: `${guessIsBuy ? 'Bought' : 'Sold'} an NFT on OpenSea` }
			}

			const isBuy = addressEquals(matchEvent?.maker as string, config.userAddress)

			return {
				title: `${isBuy ? 'Bought' : 'Sold'} an NFT on OpenSea`,
				description: `${isBuy ? 'Bought' : 'Sold'} an NFT for ${parseFloat(
					formatUnits((matchEvent?.price as string) || '0') || entry.value_in_eth
				).toFixed(2)} ETH`,
			}
		}

		const isBuy = addressEquals(transfersNFT.random().to as string, config.userAddress)

		const boughtNFTs = transfersNFT
			.filter(
				transfer =>
					addressEquals(transfer.from, config.userAddress) || addressEquals(transfer.to, config.userAddress)
			)
			.groupBy('contract.address')
			.values()
			.map((transfers: Collection<TransferEvent>): string => {
				const oneOf = transfers.random()

				if (transfers.count() > 1) return `${transfers.count()} ${correctContractName(oneOf.contract.name)}`
				return a(correctContractName(oneOf.contract.name))
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

export default SeaportBuy
