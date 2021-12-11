import React, { Component, useContext } from 'react'
import { Route } from 'react-router-dom'
import { UserInfoContext } from '../store/UserInfoContext'


const permissionDenied = () => {
	return (
		<div className="col-9 mx-auto text-center mt-5">
			<div class="alert alert-danger alert-block">
				{/* <button type="button" class="close" data-dismiss="alert">×</button> */}
				<strong>Permission denied</strong>
			</div>
		</div>
	)
}

function SuperAdminRoute({ compoment: Component, ...rest }) {
	const [userInfo] = useContext(UserInfoContext)
	return (
		<Route
			{...rest}
			render={(props) => userInfo.role === 0
				? <Component {...props} />
				: permissionDenied()
			}
		/>
	)
}

export default SuperAdminRoute
