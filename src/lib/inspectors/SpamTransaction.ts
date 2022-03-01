import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

const ENS_TOKEN = '0xc18360217d8f7ab5e7c516566761ea12ce7f9d72'
const ENS_REGISTRAR = '0x283af0b28c62c092c9727f1ee09c02ca627eb7f5'

class SpamTransaction extends Inspector {
	name = 'Spam Remover'

	public check(entry: ActivityEntry, config: Config): boolean {
		if (entry.insights.generalPurpose !== TX_PURPOSE.CONTRACT_INTERACTION) {
			return false
		}

		// ENS Delegators get tagged every time people move their tokens around
		if (
			entry.insights.interactions
				?.find(contract => addressEquals(contract.contract_address, ENS_TOKEN))
				?.details?.some(event => event.event === 'DelegateVotesChanged')
		) {
			return true
		}

		// Having a commit tx before every ENS Registration tx is redundant
		if (addressEquals(entry.raw.to, ENS_REGISTRAR) && entry.insights.method == 'commit') {
			return true
		}

		return false
	}

	resolve(): InspectorResult {
		return {
			hideTransaction: true,
		}
	}
}

export default SpamTransaction
