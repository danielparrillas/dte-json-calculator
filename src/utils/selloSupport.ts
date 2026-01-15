import { DTE } from "@/types/ccf";

export function obtenerValorSello(dte: DTE): string | null {
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
