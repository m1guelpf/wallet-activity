import '@/styles/styles.css'
import { ethers } from 'ethers'
import { AppProps } from 'next/app'
import { FC, useState } from 'react'
import Web3Context from '@/context/Web3Context'

const App: FC<AppProps> = ({ Component, pageProps }) => {
	const [web3, setWeb3] = useState<ethers.providers.Web3Provider>(null)
	const [userAddress, setUserAddress] = useState<string>(null)

	return (
		<Web3Context.Provider value={{ web3, setWeb3, userAddress, setUserAddress }}>
			<Component {...pageProps} />
		</Web3Context.Provider>
	)
}

export default App
