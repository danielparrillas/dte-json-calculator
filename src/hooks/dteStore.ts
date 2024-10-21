import { create } from "zustand";

interface DteStore {
	files: FileList | null;
	setFiles: (files: FileList | null) => void;
}

export const useDteStore = create<DteStore>()((set) => ({
	files: null,
	setFiles: (files) => set({ files }),
}));
