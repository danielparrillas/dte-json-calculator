import { jsonToObject } from "@/utils/jsonToObject";
import { create } from "zustand";

interface DteStore {
	jsons: object[];
	selectedJson: object | null;
	setSelectedJson: (json: object) => void;
}

export const useDteStore = create<DteStore>()((set) => ({
	jsons: [],
	selectedJson: null,
	setSelectedJson: (json) => set({ selectedJson: json }),
}));

export const setSelectedJson = (json: object | null) => {
	useDteStore.setState({ selectedJson: json });
};

export const setJsonsFromFiles = (files: FileList | null) => {
	if (!files || files === null) {
		useDteStore.setState({ jsons: [] });
		return;
	}
	const promises: Promise<object>[] = Array.from(files).map((file) =>
		jsonToObject(file)
	) as Promise<object>[];

	Promise.all(promises)
		.then((jsons) => {
			useDteStore.setState({ jsons });
		})
		.catch((error) => {
			console.error("Error al leer los archivos", error);
		});
};
