import React, { createContext, useReducer, useState, useEffect } from "react"
import Axios from 'axios'
import env from './../../../env.json'



const initialState = {
	/** @type {number | null} */
	role: null
}
export const UserInfoContext = createContext(initialState)





export const UserInfoProvider = ({ children }) => {
	const [state, setState] = useState(initialState)

	return (
		<UserInfoContext.Provider value={[state, setState]}>
			{children}
		</UserInfoContext.Provider>
	)
}

