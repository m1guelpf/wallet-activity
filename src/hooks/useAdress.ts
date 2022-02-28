import { useAccount } from 'wagmi'

const FAKED_ADDRESS = ''

const useAddress = (): string | null => {
	const [{ data }] = useAccount()

	return FAKED_ADDRESS || data?.address
}

export default useAddress
