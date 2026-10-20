import { StateStorage } from "zustand/middleware";

const DB_NAME = "dte-json-calculator";
const STORE_NAME = "keyval";

let dbPromise: Promise<IDBDatabase> | null = null;

const openDb = () => {
	dbPromise ??= new Promise<IDBDatabase>((resolve, reject) => {
		const request = indexedDB.open(DB_NAME, 1);
		request.onupgradeneeded = () => request.result.createObjectStore(STORE_NAME);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
	return dbPromise;
};

const run = async <T>(
	mode: IDBTransactionMode,
	operation: (store: IDBObjectStore) => IDBRequest<T>
) => {
	const db = await openDb();
	return new Promise<T>((resolve, reject) => {
		const request = operation(
			db.transaction(STORE_NAME, mode).objectStore(STORE_NAME)
		);
		request.onsuccess = () => resolve(request.result);
		request.onerror = () => reject(request.error);
	});
};

// IndexedDB en lugar de localStorage: un catálogo grande supera fácilmente los ~5 MB de localStorage
export const indexedDbStorage: StateStorage = {
	getItem: async (name) =>
		(await run<string | undefined>("readonly", (store) => store.get(name))) ??
		null,
	setItem: async (name, value) => {
		await run("readwrite", (store) => store.put(value, name));
	},
	removeItem: async (name) => {
		await run("readwrite", (store) => store.delete(name));
	},
};
