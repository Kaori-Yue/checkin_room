import React, { cloneElement } from "react"
import { FacultyProvider } from "./FacultyContext"
import { UserInfoProvider } from './UserInfoContext'

// https://medium.com/the-existing/react-how-to-use-global-state-with-react-hooks-very-easy-2137c5757937
function ProviderComposer({ contexts, children }) {
	return contexts.reduce(
		(kids, parent) =>
			cloneElement(parent, {
				children: kids
			}),
		children
	)
}
export default function ContextProvider({ children }) {
	return (
		<ProviderComposer
			// add providers to array of contexts
			contexts={[
				<FacultyProvider />,
				<UserInfoProvider />,

			]}
		>
			{children}
		</ProviderComposer>
	)
}