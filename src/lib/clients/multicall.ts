import { ethers } from 'ethers'
import { ChainId } from '@/types/utils'
import { namehash } from 'ethers/lib/utils'
import { multicallAddresses, ZERO_ADDRESS } from '../consts'
import { Multicall as MulticallInterface, Multicall__factory } from '@/contracts'

export type Call = {
	contract: {
		address: string
	}
	name: string
	inputs: ethers.utils.ParamType[]
	outputs: ethers.utils.ParamType[]
	params: any[]
}

class Multicall {
	#contract: MulticallInterface
	#abiCoder: ethers.utils.AbiCoder
	#provider: ethers.providers.Provider
	#ensRegistry: string

	constructor(chainId: ChainId, provider: ethers.providers.Provider) {
		this.#provider = provider
		this.#abiCoder = new ethers.utils.AbiCoder()
		this.#contract = Multicall__factory.connect(multicallAddresses[chainId], provider)
	}

	async execute<T extends any = any>(calls: Call[]): Promise<T[]> {
		const callReqs = calls.map(call => ({
			target: call.contract.address,
			callData: this.#encodeCall(call.name, call.inputs, call.params),
		}))

		const response = await this.#contract.callStatic.aggregate(callReqs)

		return calls.map(({ outputs }, i) => {
			const params = this.#abiCoder.decode(outputs, response.returnData[i])

			return outputs.length === 1 ? params[0] : params
		})
	}

	async resolveNames(addresses: string[]): Promise<Record<string, string | null>> {
		const dict = {}
		if (!this.#ensRegistry) this.#ensRegistry = (await this.#provider.getNetwork()).ensAddress

		const resolvers = await this.execute<string>(
			addresses.map(address => ({
				contract: {
					address: this.#ensRegistry,
				},
				name: 'resolver',
				inputs: [ethers.utils.ParamType.fromString('bytes32')],
				outputs: [ethers.utils.ParamType.fromString('address')],
				params: [namehash(`${address.toLowerCase().substring(2)}.addr.reverse`)],
			}))
		)

		const addrLeft = addresses
			.map((address, i) => [address, resolvers[i]])
			.filter(([address, resolver]) => {
				if (resolver !== ZERO_ADDRESS) return true

				dict[address] = null
				return false
			})

		const names = await this.execute<string>(
			addrLeft.map(([address, resolver]) => ({
				contract: {
					address: resolver,
				},
				name: 'name',
				inputs: [ethers.utils.ParamType.fromString('bytes32')],
				outputs: [ethers.utils.ParamType.fromString('string')],
				params: [namehash(`${address.toLowerCase().substring(2)}.addr.reverse`)],
			}))
		)

		addrLeft.forEach(([address], i) => (dict[address] = names[i]))

		return dict
	}

	#getFnSig(name: string, inputs: ethers.utils.ParamType[]): string {
		return `${name}(${inputs
			.map(input => {
				if (input.type === 'tuple') return this.#getFnSig('', input.components)
				if (input.type === 'tuple[]') return `${this.#getFnSig('', input.components)}[]`
				return input.type
			})
			.join(',')})`
	}

	#encodeCall(name: string, inputs: ethers.utils.ParamType[], params: any[]): string {
		return `0x${ethers.utils
			.keccak256(ethers.utils.toUtf8Bytes(this.#getFnSig(name, inputs)))
			.substring(2, 10)}${this.#abiCoder.encode(inputs, params).substring(2)}`
	}
}

export default Multicall
