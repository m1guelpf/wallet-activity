import a from 'indefinite'
import millify from 'millify'
import { ActivityEntry } from '../Activity'
import { TransferEvent } from '@/types/utils'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, parseTransferData } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

const IGNORED_ADDRESSES = []

class GeneralSwap extends Inspector {
	name = 'General Swap'

	public check(entry: ActivityEntry, config: Config): boolean {
		if (
			entry.insights.generalPurpose !== TX_PURPOSE.CONTRACT_INTERACTION ||
			!addressEquals(entry.raw.from, config.userAddress)
		) {
			return false
		}

		const { from, to } = this.getSwapDetails(entry, config.userAddress)

		return Boolean(from && to)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		const { from, to } = this.getSwapDetails(entry, config.userAddress)

		return {
			title: from.isNFT && to.isNFT ? 'NFT Swap' : 'Token Swap',
			description: `Swapped ${
				from.isNFT ? a(from.contract.name) : `${millify(parseFloat(from.value))} $${from.contract.symbol}`
			} for ${to.isNFT ? a(to.contract.name) : `${millify(parseFloat(to.value))} $${to.contract.symbol}`}`,
		}
	}

	protected getSwapDetails(
		entry: ActivityEntry,
		userAddress: string
	): { from: TransferEvent | null; to: TransferEvent | null } {
		const transfers = parseTransferData(entry).filter(
			transfer => !IGNORED_ADDRESSES.includes(transfer.to.toLowerCase())
		)
		const fromIndex = transfers.findIndex(transfer => addressEquals(transfer.from, userAddress))
		const from = transfers?.[fromIndex]
		const to = transfers.reverse()?.[fromIndex]

		if (transfers.length != 2 || !addressEquals(to?.to, userAddress)) return { from: null, to: null }

		return { from, to }
	}
}

export default GeneralSwap
