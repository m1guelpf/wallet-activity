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
			title: `Swapped ${millify(parseFloat(from.value))} $${from.contract.symbol} for ${millify(
				parseFloat(to.value)
			)} $${to.contract.symbol}`,
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

		if (transfers.length != 2 || fromIndex === -1) return { from: null, to: null }

		return { from: transfers[fromIndex], to: transfers.reverse()[fromIndex] }
	}
}

export default GeneralSwap
