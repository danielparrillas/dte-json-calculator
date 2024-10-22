import { jsonToObject } from "@/utils/jsonToObject";
import { create } from "zustand";

interface DteStore {
	jsons: DTE[];
	selectedJson: DTE | null;
	setSelectedJson: (json: DTE) => void;
}

export const useDteStore = create<DteStore>()((set) => ({
	jsons: [],
	selectedJson: null,
	setSelectedJson: (json) => set({ selectedJson: json }),
}));

export const setSelectedJson = (json: DTE | null) => {
	useDteStore.setState({ selectedJson: json });
};

export const setJsonsFromFiles = (files: FileList | null) => {
	if (!files || files === null) {
		useDteStore.setState({ jsons: [] });
		return;
	}
	const promises: Promise<DTE>[] = Array.from(files).map((file) =>
		jsonToObject(file)
	) as Promise<DTE>[];

	Promise.all(promises)
		.then((jsons) => {
			useDteStore.setState({ jsons });
		})
		.catch((error) => {
			console.error("Error al leer los archivos", error);
		});
};
