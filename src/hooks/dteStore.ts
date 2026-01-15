import { DTE } from "@/types/ccf";
import { DTEFormat } from "@/types/dteFormatEnum";
import { jsonToObject } from "@/utils/jsonToObject";
import { create } from "zustand";

interface DteStore {
	format: DTEFormat | null;
	jsons: DTE[];
	errors: { file: string; error: { message: string } }[];
	selectedJson: DTE | null;
	setSelectedJson: (json: DTE) => void;
}

export const useDteStore = create<DteStore>()((set) => ({
	format: null,
	jsons: [],
	errors: [],
	selectedJson: null,
	setSelectedJson: (json) => set({ selectedJson: json }),
}));

export const setDteFormat = (format: DTEFormat | null) =>
	useDteStore.setState({ format });

export const setSelectedJson = (json: DTE | null) => {
	useDteStore.setState({ selectedJson: json });
};

export const setJsonsFromFiles = async (files: FileList | null) => {
	if (!files || files === null) {
		useDteStore.setState({ jsons: [] });
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
		useDteStore.setState({ jsons, errors });
	});
};
