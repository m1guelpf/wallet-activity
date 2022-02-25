import { RefObject, useEffect, useState } from 'react'

const useElementVisibility = (
	elementRef: RefObject<Element>,
	{ threshold = 0, root = null, rootMargin = '0%' }: IntersectionObserverInit
): boolean => {
	const [visible, setVisible] = useState<boolean>(true)

	useEffect(() => {
		const node = elementRef?.current // DOM Ref
		const hasIOSupport = !!window.IntersectionObserver

		if (!hasIOSupport || !node) return

		const observer = new IntersectionObserver(
			([entry]: IntersectionObserverEntry[]): void => setVisible(entry.isIntersecting),
			{ threshold, root, rootMargin }
		)

		observer.observe(node)

		return () => observer.disconnect()

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [elementRef, JSON.stringify(threshold), root, rootMargin])

	return visible
}

export default useElementVisibility
