import millify from 'millify'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import Inspector, { InspectorResult } from '../Inspector'

class UniswapV2Swap extends Inspector {
	name = 'Uniswap v2 Swap'

	public check(entry: ActivityEntry): boolean {
		if (entry.id === '0xdb1a588188c9f88b6d3be3a31190c5756a5e95403f514f55efd86e8819290b66') {
			console.log(entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_DEPLOY)
		}
		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			entry.insights.interactions
				?.find(contract => contract.contract === 'Uniswap V2')
				?.details?.some(event => event.event == 'Swap')
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		const uniData = this.getSwapDetails(entry)

		return {
			title: `Swapped ${millify(parseFloat(uniData.in.amount))} ${uniData.in.ticker} for ${millify(
				parseFloat(uniData.out.amount as string)
			)} $${uniData.out.ticker}`,
		}
	}

	protected getSwapDetails(entry: ActivityEntry) {
		const tokens = entry.insights.interactions.filter(contract => contract.contract != 'Uniswap V2')
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

export default UniswapV2Swap
