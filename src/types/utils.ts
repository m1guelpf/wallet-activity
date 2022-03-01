export type ChainId = 1 | 42 | 137 | 80001 | 42161 | 421611
export enum Network {
	MAINNET = 'mainnet',
	KOVAN = 'kovan',
	POLYGON = 'polygon',
	MUMBAI = 'mumbai',
	ARBITRUM = 'arbitrum',
	ARBITRUM_RINKEBY = 'arbitrum-rinkeby',
}

export type TransferEvent = {
	contract: {
		name: string
		symbol: string
		address: string
	}
	to: string | null
	from: string | null
	value: string | null
	isNFT: boolean
}
