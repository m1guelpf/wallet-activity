import useSWR from 'swr'
import axios from 'axios'
import { ethers } from 'ethers'
import useWeb3 from '@/hooks/useWeb3'
import { useEffect, useState } from 'react'

const useBalance = (): { balance: number | null; usd_balance: number | null } => {
	const { web3, userAddress } = useWeb3()
	const [balance, setBalance] = useState<number>(null)
	const { data: ethereum } = useSWR<{ price: number }>('/api/eth-price', url => axios.get(url).then(res => res.data))

	useEffect(() => {
		if (!web3 || !userAddress) return

		web3.getBalance(userAddress).then(balance => setBalance(parseFloat(ethers.utils.formatUnits(balance))))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [web3, userAddress])

	return { balance, usd_balance: balance && ethereum && balance * ethereum.price }
}

export default useBalance
