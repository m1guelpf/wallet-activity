import { FC } from 'react'

const EthereumIcon: FC<{ className?: string }> = ({ className = '' }) => (
	<svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="0 0 24 24" fill="currentColor">
		<polygon points="19.12 12.225 12 0 4.875 12.225 12 16.575" />
		<polygon points="12 24 19.125 13.622 12 17.972 4.875 13.622" />
	</svg>
)

export default EthereumIcon
