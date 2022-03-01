import millify from 'millify'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, parseTransferData } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

const AAVE_POOL_V2 = '0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9'

class AaveDeposit extends Inspector {
	name = 'AAVE Deposit'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			addressEquals(entry.raw.to, AAVE_POOL_V2) &&
			entry.insights.method === 'deposit'
		)
	}

	resolve(entry: ActivityEntry, config: Config): InspectorResult {
		const from = parseTransferData(entry).find(transfer => addressEquals(transfer.from, config.userAddress))

		return {
			title: `Deposited ${millify(parseFloat(from.value))} $${from.contract.symbol} on AAVE`,
		}
	}
}

export default AaveDeposit
