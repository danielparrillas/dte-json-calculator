import { DTE as CCF } from "@/types/ccf";
import { DTE as CCFT } from "@/types/ccf_t";
import { DTEFormat } from "@/types/dteFormatEnum";
import { jsonToObject } from "@/utils/jsonToObject";
import { useMemo } from "react";
import { create } from "zustand";

type DTE = CCF | CCFT;

interface DteStore {
	format: DTEFormat | null;
	jsons: DTE[];
	errors: { file: string; error: { message: string } }[];
	selectedJson: DTE | null;
	excludedTiposDte: string[];
	setSelectedJson: (json: DTE) => void;
}

export const useDteStore = create<DteStore>()((set) => ({
	format: null,
	jsons: [],
	errors: [],
	selectedJson: null,
	excludedTiposDte: [],
	setSelectedJson: (json) => set({ selectedJson: json }),
}));

export const setDteFormat = (format: DTEFormat | null) =>
	useDteStore.setState({ format });

export const setSelectedJson = (json: DTE | null) => {
	useDteStore.setState({ selectedJson: json });
};

export const SIN_TIPO_DTE = "Sin tipo";

export const getTipoDte = (json: DTE) =>
	json.identificacion?.tipoDte || SIN_TIPO_DTE;

export const toggleTipoDte = (tipoDte: string) => {
	const { excludedTiposDte } = useDteStore.getState();
	useDteStore.setState({
		excludedTiposDte: excludedTiposDte.includes(tipoDte)
			? excludedTiposDte.filter((tipo) => tipo !== tipoDte)
			: [...excludedTiposDte, tipoDte],
	});
};

export const setExcludedTiposDte = (excludedTiposDte: string[]) =>
	useDteStore.setState({ excludedTiposDte });

// JSONs cuyo tipo de DTE está seleccionado (memoizado para no crear un arreglo nuevo en cada render)
export const useFilteredJsons = () => {
	const jsons = useDteStore((state) => state.jsons);
	const excludedTiposDte = useDteStore((state) => state.excludedTiposDte);
	return useMemo(
		() => jsons.filter((json) => !excludedTiposDte.includes(getTipoDte(json))),
		[jsons, excludedTiposDte]
	);
};

export const setJsonsFromFiles = async (files: FileList | null) => {
	if (!files || files === null) {
		useDteStore.setState({ jsons: [], excludedTiposDte: [] });
		return;
	}
	const promises = Array.from(files).map((file) =>
		jsonToObject(file).then(
			(json) => ({ status: "fulfilled", value: json }),
			(error) => ({
				status: "rejected",
				file: file.name,
				error: { message: error.message || "Error desconocido" },
			})
		)
	);

	Promise.all(promises).then((results) => {
		const jsons = results
			.filter((result) => result.status === "fulfilled")
			.map((result) => (result as PromiseFulfilledResult<DTE>).value);

		const errors = results
			.filter((result) => result.status === "rejected")
			.map((result) => ({
				file: (result as { status: string; file: string }).file,
				error: (result as { status: string; error: { message: string } }).error,
			}));

		console.log({ jsons, errors });
		useDteStore.setState({ jsons, errors, excludedTiposDte: [] });
	});
};
