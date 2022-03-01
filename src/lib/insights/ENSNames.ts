import { ethers } from 'ethers'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import Multicall from '../clients/multicall'
import Insight, { Config } from '@/lib/Insight'

class ENSNames extends Insight {
	name = 'ENS Names'
	#ensCache: Record<string, string | null> = { null: null }

	public async applyAll(txs: TxData[], config: Config): Promise<TxData[]> {
		const provider = new ethers.providers.StaticJsonRpcProvider(
			{ url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_KEY}` },
			config.chainId
		)
		const multicall = new Multicall(config.chainId, provider)

		this.#ensCache = await multicall.resolveNames(
			txs
				.map(tx => [tx.from_address, tx.to_address])
				.flat()
				.filter(address => address)
		)

		return txs
	}

	public async apply(tx: TxData): Promise<{ fromENS: string; toENS: string }> {
		const [fromENS, toENS] = await Promise.all([this.getENSFor(tx.from_address), this.getENSFor(tx.to_address)])

		return { fromENS, toENS }
	}

	protected async getENSFor(address: string): Promise<string | null> {
		if (!address) return null

		return this.#ensCache[address]
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new ENSNames())

export default ENSNames
