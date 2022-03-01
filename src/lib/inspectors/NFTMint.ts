import a from 'indefinite'
import { ethers } from 'ethers'
import { ActivityEntry } from '../Activity'
import { TX_PURPOSE } from '../insights/GeneralPurpose'
import { addressEquals, parseTransferData } from '../utils'
import Inspector, { Config, InspectorResult } from '../Inspector'

class NFTMint extends Inspector {
	name = 'NFT Mint'

	public check(entry: ActivityEntry, config: Config): boolean {
		const transfers = parseTransferData(entry).filter(
			transfer => addressEquals(transfer.to, config.userAddress) && transfer.isNFT
		)

		return (
			entry.insights.generalPurpose === TX_PURPOSE.CONTRACT_INTERACTION &&
			addressEquals(entry.raw.from, config.userAddress) &&
			(entry.insights.method?.toLowerCase()?.includes('mint') || transfers.length > 0)
		)
	}

	resolve(entry: ActivityEntry): InspectorResult {
		if (entry.insights.contractName === 'ENS') {
			const name = this.getENSName(entry.raw.input)

			return { title: 'Registered an ENS name', description: name ? `You now own ${name}.eth` : '' }
		}

		return {
			title: 'Minted an NFT',
			description: `Minted ${entry.insights.contractName ? a(entry.insights.contractName) : 'an'} NFT${
				entry.value_in_eth != '0' ? ` for ${parseFloat(entry.value_in_eth).toFixed(2)} ETH` : ''
			}`,
		}
	}

	protected getENSName(data: string): string | null {
		return ethers.utils.defaultAbiCoder.decode(['string'], ethers.utils.hexDataSlice(data, 4))?.[0]
	}
}

export default NFTMint
