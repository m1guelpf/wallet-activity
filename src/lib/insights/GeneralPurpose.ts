import Insight from '@/lib/Insight'
import Augmenter from '@/lib/Augmenter'
import { TxData } from '@/types/covalent'
import { ethers } from 'ethers'

const provider = new ethers.providers.InfuraProvider('homestead', process.env.INFURA_ID)

enum CONTRACT_PURPOSE {
	ETH_TRANSFER = 'eth_transfer',
	CONTRACT_DEPLOY = 'contract_deploy',
	CONTRACT_INTERACTION = 'contract_interaction',
}

class GeneralPurpose extends Insight {
	name = 'General Purpose'

	public async apply(tx: TxData): Promise<{ generalPurpose: string }> {
		const purpose = await this.getPurpose(tx)

		return { generalPurpose: purpose.toString() }
	}

	protected async getPurpose(tx: TxData): Promise<CONTRACT_PURPOSE> {
		if (!tx.to_address) return CONTRACT_PURPOSE.CONTRACT_DEPLOY

		const txData = await provider.getTransaction(tx.tx_hash)

		// Another option here would be to `getCode(tx.to_address)`, since you _could_ send ETH + a message to someone.
		if (txData.data == '0x') return CONTRACT_PURPOSE.ETH_TRANSFER

		return CONTRACT_PURPOSE.CONTRACT_INTERACTION
	}
}

export const registerInsight = (augmenter: typeof Augmenter) => augmenter.register(new GeneralPurpose())

export default GeneralPurpose
