import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { Config, InspectorResult } from '../Inspector'

const WYVERN_EXCHANGE = ['0x7be8076f4ea4a4ad08075c2508e481d6c946d12b', '0x7f268357a8c2552623316e2562d90e642bb538e5']

class OpenSeaCancel extends Inspector {
	name = 'OpenSea Cancel'

	public check(entry: ActivityEntry, config: Config): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			WYVERN_EXCHANGE.includes(entry.raw.to.toLowerCase()) &&
			entry.insights.method === 'cancelOrder_'
		)
	}

	resolve(): InspectorResult {
		return {
			title: 'Cancelled OpenSea Listing',
		}
	}
}

export default OpenSeaCancel
