import { useAccount } from 'wagmi'
import { ButtonHTMLAttributes, FC } from 'react'
import { formatAddressShort } from '@/lib/utils'

const ConnectWallet: FC<ButtonHTMLAttributes<HTMLButtonElement>> = props => {
	const [{ data }, disconnect] = useAccount({ fetchEns: true })

	if (!data?.address) return null

	return (
		<button onClick={disconnect} {...props}>
			{data?.ens?.name || formatAddressShort(data?.address) || 'Connect Wallet'}
		</button>
	)
}

export default ConnectWallet
