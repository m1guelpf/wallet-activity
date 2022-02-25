import useWeb3 from '@/hooks/useWeb3'
import { formatAddressShort } from '@/lib/utils'
import { ButtonHTMLAttributes } from 'react'

const ConnectWallet = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
	const { web3, userAddress, userENS, connectWallet, disconnectWallet } = useWeb3()

	return (
		<button {...props} onClick={web3 ? disconnectWallet : connectWallet}>
			{userENS || formatAddressShort(userAddress) || 'Connect Wallet'}
		</button>
	)
}

export default ConnectWallet
