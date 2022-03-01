import useSWR from 'swr'
import axios from 'axios'
import { useBalance as useETHBalance } from 'wagmi'

const useBalance = (): { balance: number | null; usd_balance: number | null } => {
	const [{ data: balance }] = useETHBalance()
	const { data: ethereum } = useSWR<{ price: number }>(
		'/api/eth-price',
		url => axios.get(url).then(res => res.data),
		{ revalidateOnFocus: false }
	)

	return {
		balance: balance?.value ? parseFloat(balance?.formatted) : null,
		usd_balance: balance?.value && ethereum && parseFloat(balance.formatted) * ethereum.price,
	}
}

export default useBalance
