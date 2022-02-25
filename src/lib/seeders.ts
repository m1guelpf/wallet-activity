import axios from 'axios'
import collect from 'collect.js'
import { PrismaClient } from '@prisma/client'
import logger from './logger'

const prisma = new PrismaClient()

export const seedTintin = async () => {
	const contractMapping = await axios
		.get(
			'https://raw.githubusercontent.com/tintinweb/smart-contract-sanctuary-ethereum/eb6b57e33f0a157c3688024a1eead4ea85753bd1/contracts/mainnet/contracts.json'
		)
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
			data: chunk.map(([address, name]) => ({ id: address, name: name })),
			skipDuplicates: true,
		})

		logger.endTimer(`chunk-${chunkId}`, `, inserted ${count}`)
	}
}
