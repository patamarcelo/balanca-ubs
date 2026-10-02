import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import {
	query,
	orderBy,
	getDocs,
	limit,
	where,
	serverTimestamp,
} from "firebase/firestore";

import { TABLES_FIREBASE } from "./firebase.typestables";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";

import { storage } from "./firebase";
import {
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";



// import { query, orderBy, onSnapshot, getDocs } from "firebase/firestore";
// import { collection, addDoc, Timestamp } from "firebase/firestore";

import toast from "react-hot-toast";

import { newDateArr } from "../../utils/format-suport/data-format";

export const handleUpdateRomaneioCheck = async (e, id, data) => {
	e.preventDefault();
	const taskDocRef = doc(db, TABLES_FIREBASE.truckmove, id);
	let updatedDoc;
	const updatedData = { ...data };
	try {
		updatedDoc = await updateDoc(taskDocRef, {
			...updatedData
		});
	} catch (err) {
		alert(err);
	}
	return updatedDoc;
};
export const handleUpdateClassic = async (e, id, data) => {
	e.preventDefault();
	const taskDocRef = doc(db, TABLES_FIREBASE.truckmove, id);
	let updatedDoc;
	const entrada = newDateArr(data.entrada);
	const saida = newDateArr(data.saida);
	const updatedData = { ...data, entrada: entrada, saida: saida };
	try {
		updatedDoc = await updateDoc(taskDocRef, {
			...updatedData
		});
	} catch (err) {
		alert(err);
	}
	return updatedDoc;
};

export const handleUpdateTruck = async (e, id, data) => {
	e.preventDefault();
	let newEntrada;
	if (!data.entrada & (data.pesoBruto > 0 || data.tara > 0)) {
		newEntrada = new Date();
	} else {
		newEntrada = data.entrada;
	}
	let saida;
	console.log("liquido firebase: ", data.liquido);
	if (data.liquido > 0) {
		saida = new Date();
	} else {
		saida = "";
	}
	const taskDocRef = doc(db, TABLES_FIREBASE.truckmove, id);
	let updatedDoc;
	const updatedData = { ...data, saida: saida, entrada: newEntrada };
	try {
		updatedDoc = await updateDoc(taskDocRef, {
			...updatedData
		});
	} catch (err) {
		alert(err);
	}
	return updatedDoc;
};

export const handleDeleteTruck = async (id, data) => {
	const placaFormat =
		data?.placa?.toUpperCase().slice(0, 3) +
		"-" +
		data?.placa?.toUpperCase().slice(-4);
	const motorista = data?.motorista;
	if (window.confirm(`Deletar a carga: ${placaFormat} - ${motorista} ??`)) {
		const taskDocRef = doc(db, TABLES_FIREBASE.truckmove, id);
		try {
			console.log("deletando id: ", id);
			await deleteDoc(taskDocRef);
			console.log(
				`Deletado o ID: ${placaFormat} - ${motorista} com sucesso`
			);
			toast.success("Carga deletada com sucesso!!");
			return;
		} catch (err) {
			alert(err);
		}
		return;
	} else {
		toast("Operação Cancelada", {
			position: "top-center",
			icon: "⚠️",
			style: {
				border: "1px solid black",
				fontWeight: "bold",
				backgroundColor: "whitesmoke"
			}
		});
	}
};

export const addTruckMove = async (
	user,
	entrada,
	pesoBruto,
	tara,
	liquido,
	cultura,
	placa,
	umidade,
	mercadoria,
	origem,
	fazendaOrigem,
	impureza,
	projeto,
	motorista,
	saida,
	tipo,
	observacoes,
	destino,
	fazendaDestino,
	unidadeOp,
	parcela,
	nfEntrada,
	op,
	relatorioColheita,
	ticket,
	parcelasNovas,
	valorFrete
) => {
	const createdAt = new Date();
	let newTransaction;
	if (liquido) {
		saida = entrada;
	}
	let hora_entrada;
	if (pesoBruto || tara) {
		hora_entrada = entrada;
	} else hora_entrada = "";
	try {
		newTransaction = await addDoc(
			collection(db, TABLES_FIREBASE.truckmove),
			{
				createdAt,
				user,
				entrada: hora_entrada,
				pesoBruto,
				tara,
				liquido,
				cultura,
				placa,
				umidade,
				mercadoria,
				origem,
				fazendaOrigem,
				impureza,
				projeto,
				motorista,
				saida,
				tipo,
				observacoes,
				destino,
				fazendaDestino,
				unidadeOp,
				parcela,
				nfEntrada,
				op,
				relatorioColheita,
				ticket,
				parcelasNovas,
				valorFrete
			}
		);
	} catch (error) {
		console.log("Error ao registrar a transação: ", error);
	}
	return newTransaction;
};

export const getTruckMoves = async () => {
	const q = await query(
		collection(db, TABLES_FIREBASE.truckmove),
		orderBy("createdAt", "desc"),
		limit(500)
	);
	const querySnapshot = await getDocs(q);
	return querySnapshot.docs.map((docSnapshot) => {
		return {
			...docSnapshot.data(),
			id: docSnapshot.id
		};
	});
};


export const getClassifiableTruckMoves = async () => {
	const startDate = new Date();

	// Inclui hoje e os seis dias anteriores.
	startDate.setHours(0, 0, 0, 0);
	startDate.setDate(startDate.getDate() - 6);

	const loadsQuery = query(
		collection(db, TABLES_FIREBASE.truckmove),
		where("createdAt", ">=", startDate),
		orderBy("createdAt", "desc"),
		limit(500)
	);

	const querySnapshot = await getDocs(loadsQuery);

	return querySnapshot.docs
		.map((docSnapshot) => ({
			...docSnapshot.data(),
			id: docSnapshot.id,
		}))
		.filter(
			(load) =>
				load.idApp !== undefined &&
				load.idApp !== null &&
				load.idApp !== ""
		);
};

export const saveTruckClassification = async (
	loadId,
	classification,
	legacySampleData = null
) => {
	const loadRef = doc(
		db,
		TABLES_FIREBASE.truckmove,
		loadId
	);

	const payload = {
		...classification,
		updatedAt: serverTimestamp(),
	};

	if (!classification.createdAt) {
		payload.createdAt = serverTimestamp();
	}

	await updateDoc(loadRef, {
		classificacao: payload,
		...(legacySampleData || {}),
	});
};



export const uploadTruckClassificationImage = async (
	loadId,
	file
) => {
	if (!file?.type?.startsWith("image/")) {
		throw new Error("Selecione uma imagem válida.");
	}

	if (file.size > 10 * 1024 * 1024) {
		throw new Error("A foto deve ter no máximo 10 MB.");
	}

	const extension =
		file.name.split(".").pop()?.toLowerCase() || "jpg";

	const fileName =
		`${Date.now()}-${Math.random()
			.toString(36)
			.slice(2, 10)}.${extension}`;

	const imageRef = ref(
		storage,
		`classificacoes-cargas/${loadId}/${fileName}`
	);

	const snapshot = await uploadBytes(
		imageRef,
		file,
		{ contentType: file.type }
	);

	return {
		url: await getDownloadURL(snapshot.ref),
		storagePath: snapshot.ref.fullPath,
		fileName,
		contentType: file.type,
		size: file.size,
	};
};


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
	console.log(newTransaction);
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
