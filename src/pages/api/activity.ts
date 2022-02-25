import Covalent from '@/lib/clients/Covalent'
import handler from '@/lib/api-handler'
import Augmenter from '@/lib/Augmenter'
import { NextApiRequest, NextApiResponse } from 'next'
import { ethers } from 'ethers'

export default handler.get(async ({ query: { wallet } }: NextApiRequest, res: NextApiResponse) => {
	if (!wallet) return res.status(400).send('No wallet specified.')

	let now = new Date().getTime()
	const [transactionData] = await Promise.all([Covalent.getTransactionsFor(wallet as string), Augmenter.ready()])
	console.log(`fetching&init took ${(new Date().getTime() - now) / 1000}s`)

	now = new Date().getTime()
	const activity = await Promise.all(
		transactionData.items.map(async tx => {
			return {
				id: tx.tx_hash,
				raw: {
					from: tx.from_address,
					to: tx.to_address,
					value: tx.value,
					gas_units: tx.gas_spent,
					gas_price: tx.gas_price,
					reverted: !tx.successful,
				},
				value_in_eth: tx.value == '0' ? '0' : ethers.utils.formatUnits(tx.value),
				insights: await Augmenter.augment(tx),
				explorer_url: `https://etherscan.io/tx/${tx.tx_hash}`,
			}
		})
	)
	console.log(`augmenting took ${(new Date().getTime() - now) / 1000}s`)

	res.status(200).json(activity)
})
