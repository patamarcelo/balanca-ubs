import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { query, orderBy, getDocs } from "firebase/firestore";
import { TABLES_FIREBASE } from "./firebase.typestables";
import { doc, onSnapshot, updateDoc, deleteDoc } from "firebase/firestore";

// ADD ORDEM CARREGAMENTO
export const addOrdemCarrega = async (
	origem,
	destino,
	placaTrator,
	placaVagao1,
	placaVagao2,
	motorista,
	cpf,
	empresa,
	cpfcnpj,
	veiculo,
	mercadoria,
	observacao,
	user
) => {
	const createdAt = new Date();
	let newTransaction;
	try {
		newTransaction = await addDoc(
			collection(db, TABLES_FIREBASE.ordemCarrega),
			{
				createdAt,
				origem,
				destino,
				placaTrator,
				placaVagao1,
				placaVagao2,
				motorista,
				cpf,
				empresa,
				cpfcnpj,
				veiculo,
				mercadoria,
				observacao,
				user
			}
		);
	} catch (error) {
		console.log("Error ao registrar a transação: ", error);
	}
	console.log(newTransaction);
	return newTransaction;
};
