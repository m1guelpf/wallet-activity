import { useTime } from '@/hooks/useTime'
import { getDayOfWeek, getMonthOfYear } from '@/lib/utils'
import { ChartBarIcon, MoonIcon } from '@heroicons/react/solid'
import WifiIcon from './icons/WifiIcon'
import BatteryIcon from './icons/BatteryIcon'
import LockClosedIcon from './icons/LockClosedIcon'
import { ForwardedRef, forwardRef, useRef } from 'react'
import useElementVisibility from '@/hooks/useElementVisibility'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import PersonViewFinderIcon from './icons/PersonViewfinderIcon'
import EthereumIcon from './icons/EthereumIcon'

const iOS = {
	Screen: ({ children }) => {
		const timeRef = useRef(null)
		const timeVisible = useElementVisibility(timeRef, { threshold: 0.3 })

		return (
			<div className="flex items-center justify-center h-screen w-screen md:py-4 antialiased text-white bg-gray-900 to-black">
				<div className="md:max-w-md bg-cover bg-ios md:rounded-xl transform scale-100 h-full md:h-auto md:max-h-4xl relative overflow-auto w-full">
					<div className="flex flex-col px-2 min-h-3xl h-full md:h-3xl">
						<iOS.TopBar showTime={!timeVisible} />
						<main className="pt-8 space-y-2 overflow-scroll min-h-0 flex flex-col flex-1 pb-4">
							<iOS.LockedTime ref={timeRef} />
							{children}
						</main>
						<iOS.BottomBar />
					</div>
				</div>
			</div>
		)
	},
	TopBar: ({ showTime }) => {
		const time = useTime(1000) // refresh every second

		return (
			<header className="sticky top-0 inset-x-0 flex flex-row items-center justify-between z-20 bg-transparent backdrop-blur-sm -mx-2 px-2 pb-2 -mb-2">
				<div className="flex flex-row items-center ml-1.5 w-36 mt-2">
					<SwitchTransition mode="out-in">
						<CSSTransition
							key={showTime}
							className="transition transform duration-300 delay-75"
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
				<div className="flex items-center justify-end space-x-1 w-36 mt-2">
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

		return (
			<div className="pb-4 flex flex-col items-center" ref={ref}>
				<LockClosedIcon className="w-9 h-9 mb-5" />
				<h1 className="text-center text-8xl font-extralight">
					<span className='after:content-[":"] after:relative after:-top-2 after:text-white after:mx-0.5'>
						{('0' + time.getHours()).slice(-2)}
					</span>
					<span>{('0' + time.getMinutes()).slice(-2)}</span>
				</h1>
				<p className="text-2xl tracking-tight text-center font-base">
					{getDayOfWeek(time)}, {time.getDate()} {getMonthOfYear(time)}
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
	ExplainerAlert: ({ className = '' }) => (
		<div
			className={`rounded-2xl backdrop-filter backdrop-blur-3xl backdrop-saturate-150 bg-black bg-opacity-40 p-3.5 ${className}`}
		>
			<p className="mb-3 text-xs font-medium leading-none uppercase opacity-50">Wallet not connected</p>
			<div className="flex space-x-4 justify">
				<p className="text-sm">Connect a wallet to view your transaction history, in a human-friendly way.</p>
				<PersonViewFinderIcon className="pt-1 h-11 w-11" />
			</div>
		</div>
	),
	Notification: ({ title, description, meta, metaSubtitle }) => (
		<div className="rounded-2xl backdrop-filter backdrop-blur-3xl backdrop-saturate-150 bg-black bg-opacity-40 p-3 flex items-center space-x-3">
			{/* eslint-disable-next-line @next/next/no-img-element */}
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
