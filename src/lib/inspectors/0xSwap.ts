import millify from 'millify'
import { addressEquals } from '../utils'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { InspectorResult } from '../Inspector'

const OX_EXCHANGE = '0xdef1c0ded9bec7f1a1670819833240f027b25eff'

const IGNORED_TOKENS = ['Uniswap V2', 'SushiSwap LP Token']

class OxSwap extends Inspector {
	name = '0x Swap'

	public check(entry: ActivityEntry): boolean {
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.to, OX_EXCHANGE)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		const swapData = this.getSwapDetails(entry)

		return {
			title: `Swapped ${millify(parseFloat(swapData.in.amount))} ${swapData.in.ticker} for ${millify(
				parseFloat(swapData.out.amount as string)
			)} $${swapData.out.ticker}`,
		}
	}

	protected getSwapDetails(entry: ActivityEntry) {
		// Swaps going thru Sushi contain an additional transfer that doesn't concern the user
		const tokens = entry.insights.interactions.filter(contract => !IGNORED_TOKENS.includes(contract.contract))
		const tokenOut = tokens[0]
		let tokenIn

		if (entry.raw.value !== '0') tokenIn = { contract: 'ETH', ticker: 'ETH', amount: entry.value_in_eth }
		else tokenIn = tokens[tokens.length - 1]

		return {
			in: {
				name: tokenIn.contract,
				ticker: tokenIn?.ticker ?? `${tokenIn.contract_symbol}`,
				amount: tokenIn?.amount ?? tokenIn.details?.find(event => event.event == 'Transfer')?.value,
			},
			out: {
				name: tokenOut.contract,
				ticker: tokenOut.contract_symbol,
				amount: tokenOut.details?.find(event => event.event == 'Transfer')?.value,
			},
		}
	}
}

export default OxSwap
