import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { InspectorResult } from '../Inspector'
import { ethers } from 'ethers'

const LILNOUNS_EXCHANGE = '0x55e0f7a3bb39a28bd7bcc458e04b3cf00ad3219e'

class LilNounsBid extends Inspector {
	name = 'Lil Nouns Bid'

	public check(entry: ActivityEntry): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.to, LILNOUNS_EXCHANGE) &&
			['createBid', 'settleCurrentAndCreateNewAuction'].includes(entry.insights.method)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		if (entry.insights.method == 'settleCurrentAndCreateNewAuction') return { title: 'Won Lil Noun auction' }

		return {
			title: 'Bid on a Lil Noun',
			description: `Bid ${entry.value_in_eth} ETH for Lil Noun #${this.getNounId(entry.raw.input)}.`,
		}
	}

	protected getNounId(data: string): number | null {
		return ethers.utils.defaultAbiCoder.decode(['uint256'], ethers.utils.hexDataSlice(data, 4))?.[0]?.toNumber()
	}
}

export default LilNounsBid
