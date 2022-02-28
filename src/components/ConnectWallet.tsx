import { useAccount } from 'wagmi'
import { ButtonHTMLAttributes } from 'react'
import { formatAddressShort } from '@/lib/utils'

const ConnectWallet = (props: ButtonHTMLAttributes<HTMLButtonElement>) => {
	const [{ data }, disconnect] = useAccount({ fetchEns: true })

	if (!data?.address) return null

	return (
		<button onClick={disconnect} {...props}>
			{data?.ens?.name || formatAddressShort(data?.address) || 'Connect Wallet'}
		</button>
	)
}

export default ConnectWallet
