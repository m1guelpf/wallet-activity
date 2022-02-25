import Insight, { InsightFailed } from '@/lib/Insight'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import { ethers } from 'ethers'

const provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_ID)

class ENSNames extends Insight {
	name = 'ENS Names'
	#ensCache: Record<string, string | null> = { null: null }

	public async apply(tx: TxData): Promise<{ fromENS: string; toENS: string }> {
		const [fromENS, toENS] = await Promise.all([this.getENSFor(tx.from_address), this.getENSFor(tx.to_address)])

		return { fromENS, toENS }
	}

	protected async getENSFor(address: string): Promise<string | null> {
		if (!address) return null

		const ens = await provider.lookupAddress(address)
		this.#ensCache[address] = ens

		return ens
	}
}

//export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new ENSNames())

export default ENSNames
