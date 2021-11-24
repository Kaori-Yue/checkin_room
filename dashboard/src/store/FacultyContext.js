import React, { createContext, useReducer, useState, useEffect } from "react"
import Axios from 'axios'
import env from './../../../env.json'

// export const CounterContext = createContext({})
export const FacultyContext = createContext([])

const initialState = {
	counter: 0
}



export const FacultyProvider = ({ children }) => {
	const [state, setState] = useState([])

	useEffect(() => {
		Axios.get(env.API + '/get_faculty')
			.then(res => {
				setState(res.data?.data);
			})
	}, [])

	console.log('from context')

	return (
		<FacultyContext.Provider value={[state, setState]}>
			{children}
		</FacultyContext.Provider>
	)
}









/*
const counterReducer = (state, action) => {
	switch (action.type) {
	  case "ADD_COUNTER":
		return {
		  ...state, // copy state
		  counter: state.counter + action.payload // set state counter
		}
	  case "SUB_COUNTER":
		return {
		  ...state, // copy state
		  counter: state.counter - action.payload // set state counter
		}
	}
  }

  export const CounterProvider = ({ children }) => {
	const [counterState, counterDispatch] = useReducer(
	  counterReducer,
	  initialState
	)

	const { counter } = counterState

	const addCounter = payload =>
	  counterDispatch({ type: "ADD_COUNTER", payload }) // ส่ง type ADD_COUNTER และ payload เพื่อให้ conterReducer ไปใช้งานต่อ
	const subCounter = payload =>
	  counterDispatch({ type: "SUB_COUNTER", payload }) // ส่ง type SUB_COUNTER และ payload เพื่อให้ conterReducer ไปใช้งานต่อ

	return (
	  <CounterContext.Provider value={{ counter, addCounter, subCounter }}>
		{children}
	  </CounterContext.Provider>
	)
  }
  */