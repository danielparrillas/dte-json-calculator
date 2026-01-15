import { DTE as DTECCF } from "@/types/ccf";
import { DTE as DTECCFT } from "@/types/ccf_t";

export function obtenerValorSelloForCCF(dte: DTECCF): string | null {
	const selloRegex = /sello/i;

	// 1. Buscar propiedades directas en el objeto DTE que contengan la palabra "sello"
	for (const key in dte) {
		if (selloRegex.test(key)) {
			const valor = (dte as Record<string, string>)[key];
			if (typeof valor === "string" && valor.trim() !== "") {
				return valor;
			}
		}
	}

	// 2. Buscar en el arreglo de apéndices si hay alguna etiqueta que contenga la palabra "sello"
	if (Array.isArray(dte.apendice)) {
		for (const apendice of dte.apendice) {
			if (apendice?.etiqueta && selloRegex.test(apendice.etiqueta)) {
				if (apendice.valor && apendice.valor.trim() !== "") {
					return apendice.valor;
				}
			}
		}
	}

	// Si no se encuentra ningún valor de sello
	return null;
}

export function obtenerValorSelloForCCFT(dte: DTECCFT): string | null {
	const selloRegex = /sello/i;

	// 1. Buscar propiedades directas en el objeto DTE que contengan la palabra "sello"
	for (const key in dte) {
		if (selloRegex.test(key)) {
			const valor = (dte as Record<string, string>)[key];
			if (typeof valor === "string" && valor.trim() !== "") {
				return valor;
			}
		}
	}

	// // 2. Buscar en el arreglo de apéndices si hay alguna etiqueta que contenga la palabra "sello"
	// if (Array.isArray(dte.apendice) && dte.apendice?.length > 0) {
	// 	for (const apendice of dte.apendice) {
	// 		if (apendice?.etiqueta && selloRegex.test(apendice.etiqueta)) {
	// 			if (apendice.valor && apendice.valor.trim() !== "") {
	// 				return apendice.valor;
	// 			}
	// 		}
	// 	}
	// }

	// Si no se encuentra ningún valor de sello
	return null;
}
