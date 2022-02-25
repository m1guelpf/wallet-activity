import { ethers } from 'ethers'
import Web3Modal from 'web3modal'
import Web3Context from '@/context/Web3Context'
import WalletConnectProvider from '@walletconnect/web3-provider'
import { useContext, useEffect, useMemo, useState } from 'react'

const useWeb3 = (): {
	web3: ethers.providers.Web3Provider | null
	userAddress: string | null
	userENS: string | null
	connectWallet: () => void
	disconnectWallet: () => void
} => {
	const { web3, setWeb3, userAddress, setUserAddress } = useContext(Web3Context)
	const [userENS, setUserENS] = useState<string>(null)

	const web3Modal = useMemo<Web3Modal | null>(() => {
		if (typeof window == 'undefined') return null

		return new Web3Modal({
			cacheProvider: true,
			providerOptions: {
				walletconnect: {
					display: {
						description: 'Use Rainbow & other popular wallets',
					},
					package: WalletConnectProvider,
					options: {
						infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
					},
				},
			},
		})
	}, [])

	const connectWallet = () =>
		web3Modal
			.connect()
			.then(provider => new ethers.providers.Web3Provider(provider))
			.then(setWeb3)

	const disconnectWallet = () => {
		web3Modal.clearCachedProvider()

		setWeb3(null)
		setUserAddress(null)
		setUserENS(null)
	}

	useEffect(() => {
		if (!web3) return

		web3.getSigner()
			.getAddress()
			.then(address => {
				setUserAddress(address)

				return web3.lookupAddress(address)
			})
			.then(ensDomain => {
				if (!ensDomain) return

				setUserENS(ensDomain)
			})
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [web3])

	useEffect(() => {
		if (!web3Modal.cachedProvider) return

		connectWallet()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	return { web3, userAddress, userENS, connectWallet, disconnectWallet }
}

export default useWeb3
