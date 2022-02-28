import { useConnect } from 'wagmi'
import iOSbg from '@images/ios-bg.png'
import WifiIcon from './icons/WifiIcon'
import { useTime } from '@/hooks/useTime'
import SpinnerIcon from './icons/SpinnerIcon'
import BatteryIcon from './icons/BatteryIcon'
import EthereumIcon from './icons/EthereumIcon'
import LockClosedIcon from './icons/LockClosedIcon'
import { ChartBarIcon } from '@heroicons/react/solid'
import { getDayOfWeek, getMonthOfYear } from '@/lib/utils'
import useElementVisibility from '@/hooks/useElementVisibility'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { ForwardedRef, forwardRef, useEffect, useRef, useState } from 'react'
import useBalance from '@/hooks/useBalance'

const currencyFormatter = new Intl.NumberFormat('en-US', {
	style: 'currency',
	currency: 'USD',
	maximumFractionDigits: 2,
})

const iOS = {
	Screen: ({ children }) => {
		const timeRef = useRef(null)
		const [isStandalone, setStandalone] = useState<boolean>(false)
		const timeVisible = useElementVisibility(timeRef, { threshold: 0.3 })

		useEffect(() => {
			setStandalone(!!(window.navigator as any)?.standalone)
		}, [])

		return (
			<div className="flex items-center justify-center h-screen w-screen md:py-4 antialiased text-white bg-gray-900 to-black">
				<div
					className="md:max-w-md bg-cover md:rounded-3xl transform scale-100 h-full md:h-auto md:max-h-4xl relative overflow-auto w-full"
					style={{
						backgroundImage: `linear-gradient(rgba(0, 0, 0, .1) 0%, rgba(0, 0,  0, .1) 100%), url('${iOSbg.src}')`,
					}}
				>
					<div className="flex flex-col px-2 min-h-3xl h-full md:h-3xl">
						<iOS.TopBar isStandalone={isStandalone} showTime={!timeVisible} />
						<main className="pt-8 space-y-2 overflow-scroll min-h-0 flex flex-col flex-1 pb-4">
							<iOS.LockedTime ref={timeRef} />
							{children}
						</main>
						{!isStandalone && <iOS.BottomBar />}
					</div>
				</div>
			</div>
		)
	},
	TopBar: ({ showTime, isStandalone }) => {
		const time = useTime(1000) // refresh every second

		return (
			<header className="sticky top-0 inset-x-0 flex flex-row items-center justify-between z-20 bg-transparent backdrop-blur-sm -mx-2 px-2 pb-2 -mb-2">
				<div className={`flex flex-row items-center ml-1.5 w-36 mt-2`}>
					<SwitchTransition mode="out-in">
						<CSSTransition
							key={showTime}
							className={`transition transform duration-300 delay-75 ${isStandalone ? 'invisible' : ''}`}
							timeout={300}
							classNames={{
								enter: 'opacity-0',
								enterActive: 'opacity-100',
								exit: 'opacity-100',
								exitActive: 'opacity-0',
							}}
						>
							{showTime ? (
								<p className="text-sm font-medium">
									<span className='after:content-[":"] after:relative after:-top-[1px] after:text-white after:mx-[1px]'>
										{('0' + time.getHours()).slice(-2)}
									</span>
									<span>{('0' + time.getMinutes()).slice(-2)}</span>
								</p>
							) : (
								<p className="text-sm">Kintsugi</p>
							)}
						</CSSTransition>
					</SwitchTransition>
				</div>
				<iOS.Notch />
				<div className={`flex items-center justify-end space-x-1 w-36 mt-2 ${isStandalone ? 'invisible' : ''}`}>
					<ChartBarIcon className="w-4 h-4" />
					<WifiIcon className="w-4 h-4" />
					<BatteryIcon className="w-auto h-3" />
				</div>
			</header>
		)
	},
	Notch: () => (
		<div className="absolute hidden md:block top-0 left-1/2 h-9 w-52 md:w-72 bg-gray-900 rounded-b-3xl transform -translate-x-1/2 shadow-inner" />
	),
	LockedTime: forwardRef(({}, ref: ForwardedRef<HTMLDivElement>) => {
		const time = useTime(1000) // refresh every second
		const [{ data }] = useConnect()
		const { balance, usd_balance } = useBalance()

		return (
			<div className="pb-4 flex flex-col items-center" ref={ref}>
				{data?.connected ? (
					<EthereumIcon className="w-9 h-9 mb-5" />
				) : (
					<LockClosedIcon className="w-9 h-9 mb-5" />
				)}
				<h1 className="text-center text-8xl font-extralight">
					{balance ? (
						<span>{balance} ETH</span>
					) : (
						<>
							<span className='after:content-[":"] after:relative after:-top-2 after:text-white after:mx-0.5'>
								{('0' + time.getHours()).slice(-2)}
							</span>
							<span>{('0' + time.getMinutes()).slice(-2)}</span>
						</>
					)}
				</h1>
				<p className="text-2xl tracking-tight text-center font-base">
					{usd_balance ? (
						<span>{currencyFormatter.format(usd_balance)}</span>
					) : (
						<span>
							{getDayOfWeek(time)}, {time.getDate()} {getMonthOfYear(time)}
						</span>
					)}
				</p>
			</div>
		)
	}),
	BottomBar: () => (
		<footer className="sticky bottom-0 inset-x-0 z-30">
			<div className="flex items-center justify-center space-x-2 mb-2.5">
				<div className="w-1/3 h-1.5 bg-white rounded-full shadow" />
			</div>
		</footer>
	),
	SetupModal: ({ className = '', dataLoading }: { className?: string; dataLoading: boolean }) => {
		const [{ data, loading }, connect] = useConnect()

		const isLoading = loading || dataLoading

		return (
			<div
				className={`absolute bottom-0.5 inset-x-0.5 bg-white py-5 px-7 text-black md:rounded-3xl z-40 space-y-8 ${className}`}
			>
				<div className="space-y-2">
					<p className="text-center font-light text-3xl text-gray-600">Wallet History</p>
					<p className="text-center text-gray-600">Your transaction history, explained</p>
				</div>
				<div className="flex justify-center">
					{/* eslint-disable-next-line @next/next/no-img-element */}
					<img
						className="w-2/3"
						alt=""
						src="https://images.ctfassets.net/9sy2a0egs6zh/5w0q0fWbGtmiSts6oIDJ5x/6746f0e6d562c0e8315d841eb4c85f87/Explore-illo.svg"
					/>
				</div>
				<div className={`space-x-2 flex items-center ${isLoading ? 'justify-center' : 'justify-between'}`}>
					{isLoading ? (
						<div className="flex items-center justify-center space-x-1.5">
							<SpinnerIcon className="w-4 h-4" />
							<span className="">Connecting</span>
						</div>
					) : (
						data.connectors.map(connector => (
							<button
								key={connector.id}
								onClick={() => connect(connector)}
								className={`py-3 w-full bg-gray-300 text-black font-medium rounded-xl transition hover:opacity-80 ${
									loading ? 'invisible' : ''
								}`}
							>
								{connector.name}
							</button>
						))
					)}
				</div>
			</div>
		)
	},
	Notification: ({ title, description, meta, metaSubtitle }) => (
		<div className="rounded-2xl backdrop-filter backdrop-blur-3xl backdrop-saturate-150 bg-black bg-opacity-40 p-3 flex items-center space-x-3">
			<EthereumIcon className="h-10 w-10" />
			<div className="w-full">
				<div className="flex items-center justify-between mb-0.5">
					<p className="text-xs font-medium leading-none uppercase opacity-50">{meta}</p>
					<p className="text-xs leading-none opacity-50">{metaSubtitle}</p>
				</div>
				<div className="">
					<p className="text-sm font-semibold">{title}</p>
					<p className="text-sm">{description}</p>
				</div>
			</div>
		</div>
	),
}

export default iOS
