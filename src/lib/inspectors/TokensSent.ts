import a from 'indefinite'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'
import { addressEquals, formatAddressShort, parseTransferData } from '../utils'

class TokensSent extends Inspector {
	name = 'Tokens Sent'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			parseTransferData(entry).filter(transfer => addressEquals(transfer.from, config.userAddress)).length > 0
		)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		const transfers = parseTransferData(entry).filter(transfer => addressEquals(transfer.from, config.userAddress))

		if (transfers.length > 1) {
			return {
				title: `Sent ${transfers.length} ${transfers.every(transfer => transfer.isNFT) ? 'NFTs' : 'tokens'}`,
				description: `Sent ${transfers
					.map(transfer => (transfer.isNFT ? a(transfer.contract.name) : transfer.contract.name))
					.join(', ')} to ${transfers.map(transfer => formatAddressShort(transfer.to)).join(', ')}`,
			}
		}

		if (transfers[0].isNFT) {
			return {
				title: 'Sent an NFT',
				description: `Sent ${
					entry.insights.contractName ? a(entry.insights.contractName) : 'an NFT'
				} to ${formatAddressShort(transfers[0].to as string)}`,
			}
		}

		return {
			title: `Sent ${transfers[0].value} $${transfers[0].contract.symbol}`,
			description: `Sent ${transfers[0].contract.name} to ${formatAddressShort(transfers[0].to)}`,
		}
	}
}

export default TokensSent
