import { FC } from 'react'
import Head from 'next/head'
import coverImg from '@images/cover.png'

const Layout: FC = ({ children }) => {
	const meta = {
		url: 'http://wallet-activity.vercel.app',
		title: 'Wallet History',
		description: 'WIP.',
		image: `http://wallet-activity.vercel.app${coverImg.src}`,
	}

	return (
		<>
			<Head>
				<title>{meta.title}</title>
				<meta name="title" content={meta.title} />
				<meta name="description" content={meta.description} />

				<meta property="og:type" content="website" />
				<meta property="og:url" content={meta.url} />
				<meta property="og:title" content={meta.title} />
				<meta property="og:description" content={meta.description} />
				<meta property="og:image" content={meta.image} />

				<meta property="twitter:card" content="summary_large_image" />
				<meta property="twitter:url" content={meta.url} />
				<meta property="twitter:title" content={meta.title} />
				<meta property="twitter:description" content={meta.description} />
				<meta property="twitter:image" content={meta.image} />
				<meta property="twitter:creator" content="@m1guelpf" />
			</Head>

			{children}
		</>
	)
}

export default Layout
