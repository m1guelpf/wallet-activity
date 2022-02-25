import { FC } from 'react'
import Layout from '@/components/Layout'
import iOS from '@/components/iOS'
import useSWR from 'swr'
import ConnectWallet from '@/components/ConnectWallet'
import useWeb3 from '@/hooks/useWeb3'
import axios from 'axios'
import { ActivityData } from '@/lib/Activity'
import { formatAddressShort } from '@/lib/utils'
import { format as timeago } from 'timeago.js'
import TransactionRender from '@/components/TransactionRender'

const Index: FC = () => {
	const { userAddress } = useWeb3()
	const { data: activity, isValidating: loading } = useSWR<ActivityData>(
		() => userAddress && `/api/activity/${userAddress}?limit=10`,
		url => axios.get(url).then(res => res.data)
	)

	return (
		<Layout>
			<iOS.Screen>
				<div className="flex justify-center !mb-4">
					<ConnectWallet className="rounded-full backdrop-filter backdrop-blur-3xl backdrop-saturate-150 bg-black bg-opacity-40 py-2 px-4 font-medium transform active:scale-105 transition duration-300" />
				</div>
				{activity ? (
					activity.data.map(entry => <TransactionRender key={entry.id} entry={entry} />)
				) : (
					<iOS.ExplainerAlert className={loading ? 'animate-pulse' : ''} />
				)}
			</iOS.Screen>
		</Layout>
	)
}

export default Index
