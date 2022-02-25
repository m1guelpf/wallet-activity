import iOS from './iOS'
import { FC } from 'react'
import collect from 'collect.js'
import useWeb3 from '@/hooks/useWeb3'
import { format as timeago } from 'timeago.js'
import { ActivityEntry } from '@/lib/Activity'
import { Interaction } from '@/lib/insights/InterpretEvents'
import { addressEquals, formatAddressShort } from '@/lib/utils'
import { CONTRACT_PURPOSE } from '@/lib/insights/GeneralPurpose'

const TransactionRender: FC<{ entry: ActivityEntry }> = ({ entry }) => {
	const { userAddress } = useWeb3()

	console.log(entry)

	return (
		<a
			href={entry.explorer_url}
			className="block transform active:opacity-80 transition duration-300"
			target="_blank"
			rel="noreferrer"
		>
			<iOS.Notification
				meta={formatAddressShort(entry.id)}
				title={getTitle(entry, userAddress)}
				description={getDescription(entry, userAddress)}
				metaSubtitle={timeago(new Date(entry.raw.timestamp * 1000))}
			/>
		</a>
	)
}

const getTitle = (entry: ActivityEntry, userAddress: string): string => {
	switch (entry.insights.generalPurpose as CONTRACT_PURPOSE) {
		case CONTRACT_PURPOSE.CONTRACT_DEPLOY:
			return `Deployed Contract${entry.insights.contractName ? ` ${entry.insights.contractName}` : ''}`
		case CONTRACT_PURPOSE.ETH_TRANSFER:
			const isSend = addressEquals(entry.raw.from, userAddress)
			return `${isSend ? 'Sent' : 'Received'} ${entry.value_in_eth} ETH ${isSend ? 'to' : 'from'} ${
				isSend
					? entry.insights?.toENS || formatAddressShort(entry.raw.to)
					: entry.insights?.fromENS || formatAddressShort(entry.raw.from)
			}`
		case CONTRACT_PURPOSE.CONTRACT_INTERACTION:
			if (addressEquals(entry.raw.from, userAddress)) {
				if (
					entry.insights.interactions?.find(
						(contract: Interaction) => contract.contract === 'Project Wyvern Exchange'
					) &&
					entry.insights?.interactions?.length > 1
				) {
					return `Bought an NFT on OpenSea`
				}

				if (entry.insights.method.toLowerCase().includes('mint')) {
					return `Minted an NFT`
				}

				return 'Interacted with a Smart Contract'
			}
			if (entry.insights.method?.includes('mint')) {
				return entry.insights.contractName ? `Received a ${entry.insights.contractName} NFT` : 'Received an NFT'
			}

			const receivedDetails = getReceivedDetails(entry, userAddress).map(token => {
				if (token.isNFT) return `a ${token.name} NFT`

				return `${token.amount} $${token.ticker}`
			})

			return `Received ${receivedDetails.join(', ')}`
	}
}

const getReceivedDetails = (
	entry: ActivityEntry,
	userAddress: string
): Array<{ name: string; ticker: string; isNFT: boolean; amount: number }> => {
	return entry.insights.interactions?.map((contract: Interaction) => {
		return {
			name: contract.contract,
			ticker: contract.contract_symbol,
			isNFT: contract.details.filter(event => event.event === 'Transfer' && event.value === null).length > 0,
			amount: collect(contract.details)
				.filter(event => event.event === 'Transfer' && addressEquals(event?.to as string, userAddress))
				.map(event => parseFloat(event.value as string))
				.sum() as number,
		}
	})
}

const getDescription = (entry: ActivityEntry, userAddress: string): string => {
	switch (entry.insights.generalPurpose as CONTRACT_PURPOSE) {
		case CONTRACT_PURPOSE.CONTRACT_DEPLOY:
			return ''
		case CONTRACT_PURPOSE.ETH_TRANSFER:
			return ''
		case CONTRACT_PURPOSE.CONTRACT_INTERACTION:
			if (addressEquals(entry.raw.from, userAddress)) {
				if (
					entry.insights.interactions?.find(
						(contract: Interaction) => contract.contract === 'Project Wyvern Exchange'
					) &&
					entry.insights.interactions?.length > 1
				) {
					return `Bought a ${entry.insights.interactions[1].contract} NFT for ${entry.value_in_eth} ETH`
				}

				if (entry.insights.contractName || entry.insights.method) {
					return `${entry.insights.method ? `Called ${entry.insights.method}() on` : 'Interacted with'} ${
						entry.insights.contractName || formatAddressShort(entry.insights.toENS || entry.raw.to)
					}`
				}

				return 'More Content Here'
			}
			if (
				entry.insights.method?.includes('mint') ||
				getReceivedDetails(entry, userAddress).filter(token => token.isNFT).length > 0
			)
				return `${entry.insights?.fromENS || formatAddressShort(entry.raw.from)} sent you an NFT.`

			return `${entry.insights?.fromENS || formatAddressShort(entry.raw.from)} sent you some tokens.`
	}
}

export default TransactionRender
