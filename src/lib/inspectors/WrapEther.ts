import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { InspectorResult } from '../Inspector'
import { formatUnits } from 'ethers/lib/utils'

const WRAPPED_ETHER = '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2'

class WrapEther extends Inspector {
	name = 'Wrap Ether'

	public check(entry: ActivityEntry): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.to, WRAPPED_ETHER)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		const event = entry.insights.interactions[0].details[0]

		return {
			title: `${event.event === 'Deposit' ? 'Wrapped' : 'Unwrapped'} ${parseFloat(
				formatUnits(event.wad as string)
			).toFixed(2)} ETH`,
		}
	}
}

export default WrapEther
