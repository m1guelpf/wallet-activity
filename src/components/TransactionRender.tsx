import iOS from './iOS'
import { FC, useMemo } from 'react'
import Interpreter from '@/lib/Interpreter'
import { ActivityEntry } from '@/lib/Activity'
import { format as timeago } from 'timeago.js'
import { formatAddressShort } from '@/lib/utils'
import useAddress from '@/hooks/useAdress'
import { InspectorResult } from '@/lib/Inspector'

const TransactionRender: FC<{ entry: ActivityEntry }> = ({ entry }) => {
	const userAddress = useAddress()
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const { title, description, hideTransaction } = useMemo<InspectorResult>(
		() => Interpreter.augment(entry, { userAddress }),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[entry?.id]
	)

	if (hideTransaction) return null

	return (
		<a
			href={entry.explorer_url}
			className="block transform active:opacity-80 transition duration-300"
			target="_blank"
			rel="noreferrer"
		>
			<iOS.Notification
				meta={formatAddressShort(entry.id)}
				title={title}
				description={description}
				metaSubtitle={timeago(new Date(entry.raw.timestamp * 1000))}
			/>
		</a>
	)
}

export default TransactionRender
