import { FC } from 'react'
import '@/styles/styles.css'
import { providers } from 'ethers'
import { AppProps } from 'next/app'
import { chain, InjectedConnector, WagmiProvider } from 'wagmi'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

const connectors = [
	new InjectedConnector({ chains: [chain.mainnet], options: { shimDisconnect: true } }),
	new WalletConnectConnector({
		chains: [chain.mainnet],
		options: {
			infuraId: process.env.NEXT_PUBLIC_INFURA_ID,
			qrcode: true,
		},
	}),
]

const provider = () => new providers.InfuraProvider(chain.mainnet.id, process.env.NEXT_PUBLIC_INFURA_ID)

const App: FC<AppProps> = ({ Component, pageProps }) => (
	<WagmiProvider autoConnect connectorStorageKey="wallet" connectors={connectors} provider={provider}>
		<Component {...pageProps} />
	</WagmiProvider>
)

export default App
