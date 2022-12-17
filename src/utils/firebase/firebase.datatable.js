import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { query, orderBy, getDocs } from "firebase/firestore";
import { TABLES_FIREBASE } from "./firebase.typestables";

// import { query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
// import { collection, addDoc, Timestamp } from "firebase/firestore";

// TRANSACTIONS DB POST
export const addTransaction = async (
	sellerName,
	sellerMail,
	sellerId,
	type,
	value,
	quantityPayment,
	clientMail,
	prodctsSell
) => {
	const createdAt = new Date();
	let newTransaction;
	try {
		newTransaction = await addDoc(
			collection(db, TABLES_FIREBASE.transactions),
			{
				createdAt,
				sellerName,
				sellerMail,
				sellerId,
				type,
				value,
				quantityPayment,
				clientMail,
				prodctsSell
			}
		);
	} catch (error) {
		console.log("Error ao registrar a transação: ", error);
	}
	return newTransaction;
};

// ADD CUSTOMER CREDIT CARD FORM

export const addCustomer = async (name, mail, cpf, phone) => {
	const createdAt = new Date();
	let newCustomer;
	try {
		newCustomer = await addDoc(collection(db, TABLES_FIREBASE.customer), {
			createdAt,
			name,
			mail,
			cpf,
			phone
		});
	} catch (error) {
		console.log("Error ao registrar o usuário: ", error);
	}
	return newCustomer;
};

// ADD SIGN USER CONDITIOONS
export const addSign = async (name, mail, id, text) => {
	const createdAt = new Date();
	let newSign;
	try {
		newSign = await addDoc(collection(db, TABLES_FIREBASE.contract), {
			createdAt,
			agreement: "Aceito",
			name,
			mail,
			id,
			text
		});
	} catch (error) {
		console.log("Error ao assinar pelo usuário: ", error);
	}
	return newSign;
};

// TRANSACTIONS DB GET

export const getTransactionsQuery = async () => {
	const q = await query(
		collection(db, TABLES_FIREBASE.transactions),
		orderBy("createdAt", "desc")
	);

	const querySnapshot = await getDocs(q);
	// console.log(querySnapshot.docs.map((docSnapshot) => docSnapshot.data()));
	return querySnapshot.docs.map((docSnapshot) => {
		return {
			...docSnapshot.data(),
			id: docSnapshot.id
		};
	});
};

export const getContractsSign = async () => {
	const q = await query(
		collection(db, TABLES_FIREBASE.contract),
		orderBy("createdAt", "desc")
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((docSnapshot) => {
		return {
			id: docSnapshot.data().id
		};
	});
};

// OLD FUNCS

// export const addUser = async (
// 	firstName,
// 	lastName,
// 	email,
// 	contact,
// 	address1,
// 	address2
// ) => {
// 	const createdAt = new Date();
// 	try {
// 		await addDoc(collection(db, "contacts"), {
// 			firstName: firstName,
// 			lastName: lastName,
// 			email: email,
// 			contact: contact,
// 			address1: address1,
// 			address2: address2,
// 			isSuperUser: false,
// 			createdAt
// 		});
// 		console.log("Contact registered successfully");
// 	} catch (err) {
// 		console.log(err);
// 	}
// };

// export const getContactsQuery = async () => {
// 	const q = await query(
// 		collection(db, "contacts"),
// 		orderBy("createdAt", "desc")
// 	);

// 	const querySnapshot = await getDocs(q);
// 	console.log(querySnapshot.docs.map((docSnapshot) => docSnapshot.data()));
// 	return querySnapshot.docs.map((docSnapshot) => {
// 		return {
// 			...docSnapshot.data(),
// 			id: docSnapshot.id
// 		};
// 	});
// };
