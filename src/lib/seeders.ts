import axios from 'axios'
import logger from './logger'
import collect from 'collect.js'
import { getChainId } from './utils'
import { Network } from '@/types/utils'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const tintinURL: Record<Network, string> = {
	[Network.MAINNET]:
		'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-ethereum/eb6b57e33f0a157c3688024a1eead4ea85753bd1/contracts/mainnet/contracts.json',
	[Network.KOVAN]:
		'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-ethereum/eb6b57e33f0a157c3688024a1eead4ea85753bd1/contracts/kovan/contracts.json',
	[Network.POLYGON]:
		'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-polygon/e1f77790bb8c4dc27251bf0fdd417e76736160b0/contracts/mainnet/contracts.json',
	[Network.MUMBAI]:
		'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-polygon/e1f77790bb8c4dc27251bf0fdd417e76736160b0/contracts/mumbai/contracts.json',
	[Network.ARBITRUM]:
		'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-arbitrum/dc9428673a8f77bd3d9544ff951f86bda5e6eef2/contracts/mainnet/contracts.json',
	[Network.ARBITRUM_RINKEBY]:
		'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-arbitrum/dc9428673a8f77bd3d9544ff951f86bda5e6eef2/contracts/testnet/contracts.json',
}

export const seedTintin = async ({ network = Network.MAINNET }: { network?: Network } = {}) => {
	const contractMapping = await axios
		.get(tintinURL[network])
		.then(
			res =>
				Object.fromEntries(
					JSON.parse(`[${res.data.replaceAll('}', '},').slice(0, -2)}]`).map(mapping => [
						mapping.address,
						mapping.name,
					])
				) as Record<string, string>
		)

	const chunks = collect(Object.entries(contractMapping)).chunk(1000).toArray() as [string, string][]

	for (const chunkId in chunks) {
		const chunk = chunks[chunkId]
		logger.startTimer(`chunk-${chunkId}`)

		const { count } = await prisma.contract.createMany({
			data: chunk.map(([address, name]) => ({ address: address, name: name, chainId: getChainId(network) })),
			skipDuplicates: true,
		})

		logger.endTimer(`chunk-${chunkId}`, `inserted ${count}`)
	}
}
