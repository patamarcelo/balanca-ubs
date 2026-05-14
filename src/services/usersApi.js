import { nodeServerUsers } from "../utils/axios/axios.utils";

const authHeaders = {
	Authorization: `Token ${process.env.REACT_APP_DJANGO_TOKEN}`,
};

export async function getAllUsers() {
	const response = await nodeServerUsers.get("get-all-users", {
		headers: authHeaders,
	});

	return response.data;
}

export async function getUser(uid) {
	const response = await nodeServerUsers.get(`get-user/${uid}`, {
		headers: authHeaders,
	});

	return response.data;
}

export async function createUser(payload) {
	const response = await nodeServerUsers.post("create-user", payload, {
		headers: authHeaders,
	});

	return response.data;
}

export async function updateUser(uid, payload) {
	const response = await nodeServerUsers.patch(`update-user/${uid}`, payload, {
		headers: authHeaders,
	});

	return response.data;
}

export async function updateUserPassword(uid, password) {
	const response = await nodeServerUsers.patch(
		`update-password/${uid}`,
		{ password },
		{
			headers: authHeaders,
		}
	);

	return response.data;
}

export async function updateUserClaims(uid, customClaims, replace = false) {
	const response = await nodeServerUsers.patch(
		`update-claims/${uid}`,
		{
			customClaims,
			replace,
		},
		{
			headers: authHeaders,
		}
	);

	return response.data;
}

export async function setUserDisabled(uid, disabled) {
	const response = await nodeServerUsers.patch(
		`set-disabled/${uid}`,
		{ disabled },
		{
			headers: authHeaders,
		}
	);

	return response.data;
}

export async function revokeUserSessions(uid) {
	const response = await nodeServerUsers.post(
		`revoke-refresh-tokens/${uid}`,
		{},
		{
			headers: authHeaders,
		}
	);

	return response.data;
}

export async function deleteUser(uid) {
	const response = await nodeServerUsers.delete(`delete-user/${uid}`, {
		headers: authHeaders,
		data: {
			confirm: true,
		},
	});

	return response.data;
}