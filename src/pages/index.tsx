import axios from 'axios'
import { FC } from 'react'
import iOS from '@/components/iOS'
import Layout from '@/components/Layout'
import useSWRImmutable from 'swr/immutable'
import { ActivityData } from '@/lib/Activity'
import ConnectWallet from '@/components/ConnectWallet'
import TransactionRender from '@/components/TransactionRender'
import useAddress from '@/hooks/useAdress'

const Index: FC = () => {
	const userAddress = useAddress()
	const { data: activity, isValidating: loading } = useSWRImmutable<ActivityData>(
		() => userAddress && `/api/activity/${userAddress}?limit=15`,
		url => axios.get(url).then(res => res.data),
		{}
	)

	return (
		<Layout>
			<iOS.Screen>
				{activity ? (
					<>
						<div className="flex justify-center !mb-4">
							<ConnectWallet className="rounded-full backdrop-filter backdrop-blur-3xl backdrop-saturate-150 bg-black bg-opacity-40 py-2 px-4 font-medium transform active:scale-105 transition duration-300" />
						</div>
						{activity.data.map(entry => (
							<TransactionRender key={entry.id} entry={entry} />
						))}
					</>
				) : (
					<iOS.SetupModal dataLoading={loading} />
				)}
			</iOS.Screen>
		</Layout>
	)
}

export default Index
