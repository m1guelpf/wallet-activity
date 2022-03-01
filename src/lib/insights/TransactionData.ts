import { ethers } from 'ethers'
import { getTx } from '../utils'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import Insight, { Config } from '@/lib/Insight'

class TransactionData extends Insight {
	name = 'Transaction Data'

	constructor() {
		super()
	}

	public async applyAll(txs: TxData[], config: Config): Promise<TxData[]> {
		const provider = new ethers.providers.StaticJsonRpcProvider(
			{ url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}` },
			config.chainId
		)

		return Promise.all(
			txs.map(async tx => {
				const txData = await getTx(provider, tx.tx_hash)

				return { ...tx, data: txData.data, creates: txData.creates }
			})
		)
	}

	public async apply(tx: TxData, config: Config): Promise<{}> {
		return {}
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new TransactionData())

export default TransactionData
