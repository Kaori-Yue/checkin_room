import env from '../../env.json'
import axios from 'axios'


// axios.defaults.h
/**
 * 
 * @param {object} params
 * @param {string} params.username
 * @param {string} params.password
 * @param {string} params.name
 * @param {string} params.invite_code
 * @returns {import('axios').AxiosResponse<{success: boolean}>}
 */
export function Register(params) {
	return axios.post(env.API + '/register', { ...params })
}

/**
 * 
 * @param {object} params
 * @param {string} params.room_name
 * @param {string} params.capacity
 * @param {string} params.faculty_id
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
export function AddRoom(params) {
	return axios.post(env.API + '/regis_room', { ...params })
}


/**
 * 
 * @param {object} params
 * @param {string} params.room_id
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
export function getRoomInfo(params) {
	return axios.get(env.API + '/get_roominfo?room_id=' + params.room_id)
}


/**
 * 
 * @param {object} params
 * @param {string} params.room_id
 * @param {string} params.room_name
 * @param {string} params.capacity
 * @param {string} params.faculty_id
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
export function editRoom(params) {
	return axios.post(env.API + '/editRoom', { ...params })
}



/**
 * 
 * @param {object} params
 * @param {string} params.room_id
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
 export function deleteRoom(params) {
	return axios.post(env.API + '/deleteRoom', { ...params })
}

/**
 * 
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
 export function getCountAdmin() {
	return axios.get(env.API + '/count_admin')
}

/**
 * 
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
 export function getRoomCreatedInfo() {
	return axios.get(env.API + '/room_created_info')
}

/**
 * 
 * @param {object} params
 * @param {string} params.groupName
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
 export function createGroup(params) {
	return axios.post(env.API + '/create/group', { ...params })
}


/**
 * 
 * @param {object} params
 * @param {string} params.username
 * @param {string} params.password
 * @param {string} params.name
 * @param {string} params.role
 * @returns {Promise< import('axios').AxiosResponse<{success: boolean}> >}
 */
 export function createUser(params) {
	return axios.post(env.API + '/register', { ...params })
}
