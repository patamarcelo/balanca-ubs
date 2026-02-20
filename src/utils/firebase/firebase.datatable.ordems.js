import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { TABLES_FIREBASE } from "./firebase.typestables";
import { doc, deleteDoc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";

import toast from "react-hot-toast";

export const handleDeleteOrdem = async (id, data) => {
	const placaFormat =
		data?.placaTrator?.toUpperCase().slice(0, 3) +
		"-" +
		data?.placaTrator?.toUpperCase().slice(-4);
	const motorista = data?.motorista;
	if (window.confirm(`Deletar a carga: ${placaFormat} - ${motorista} ??`)) {
		const taskDocRef = doc(db, TABLES_FIREBASE.ordemCarrega, id);
		try {
			console.log("deletando id: ", id);
			await deleteDoc(taskDocRef);
			console.log(
				`Deletado o ID: ${placaFormat} - ${motorista} com sucesso`
			);
			toast.success("Carga deletada com sucesso!!", {
				position: "top-center",
				icon: "⚠️",
				style: {
					border: "1px solid black",
					fontWeight: "bold",
					backgroundColor: "whitesmoke"
				}
			});
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
	user,
	unidadeOpUser
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
				user,
				unidadeOpUser
			}
		);
	} catch (error) {
		console.log("Error ao registrar a transação: ", error);
	}
	console.log(newTransaction);
	return newTransaction;
};


export const CALDA_DOC_ID = "singleton";

export const caldaDocRef = () => doc(db, TABLES_FIREBASE.caldaAvulsa, CALDA_DOC_ID);

export async function fetchCaldaAvulsa() {
	const snap = await getDoc(caldaDocRef());
	if (!snap.exists()) return null;
	return snap.data();
}

export async function saveCaldaAvulsa(payload) {
	// payload esperado: { caldaAvulsa: [...], updatedAt? }
	await setDoc(
		caldaDocRef(),
		{
			...payload,
			updatedAt: serverTimestamp(),
		},
		{ merge: true }
	);
}

export async function clearCaldaAvulsa() {
	// "limpar a collection" na prática: apagar o doc singleton
	await deleteDoc(caldaDocRef());
}