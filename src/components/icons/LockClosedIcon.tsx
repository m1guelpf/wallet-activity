import { FC } from 'react'

const LockClosedIcon: FC<{ className?: string }> = ({ className = '' }) => (
	<svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 76">
		<path
			d="M7.732 75.977H44.01c2.474 0 4.321-.635 5.542-1.905 1.22-1.27 1.831-3.255 1.831-5.957V40.283c0-2.67-.61-4.647-1.831-5.932-1.22-1.286-3.068-1.93-5.542-1.93l-35.352.099c-2.506 0-4.524.634-6.054 1.904-1.53 1.27-2.295 3.222-2.295 5.86v27.831c0 2.702.61 4.688 1.83 5.957 1.222 1.27 3.085 1.905 5.592 1.905ZM6.169 35.4h7.08V21.63c0-3.124.594-5.728 1.782-7.812 1.189-2.083 2.743-3.637 4.663-4.663a12.87 12.87 0 0 1 6.153-1.538c2.18 0 4.232.513 6.152 1.538 1.92 1.026 3.483 2.58 4.688 4.663 1.204 2.084 1.806 4.688 1.806 7.813V35.4h7.032V22.655c0-5.013-.96-9.122-2.881-12.329-1.92-3.206-4.387-5.574-7.398-7.104-3.01-1.53-6.144-2.295-9.4-2.295-3.254 0-6.387.765-9.399 2.295-3.01 1.53-5.476 3.898-7.397 7.104-1.92 3.207-2.88 7.316-2.88 12.33V35.4Z"
			fill="currentColor"
			fillRule="nonzero"
		/>
	</svg>
)

export default LockClosedIcon