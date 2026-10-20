import * as XLSX from "xlsx";

export type FileRows = {
	columns: string[];
	rows: Record<string, unknown>[];
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value);

const columnsFromRows = (rows: Record<string, unknown>[]) => {
	const columns = new Set<string>();
	for (const row of rows) {
		for (const key of Object.keys(row)) columns.add(key);
	}
	return Array.from(columns);
};

const rowsFromXLSX = async (file: File): Promise<FileRows> => {
	const workbook = XLSX.read(await file.arrayBuffer(), { type: "array" });
	// Se usa la primera hoja que tenga datos
	for (const sheetName of workbook.SheetNames) {
		const sheet = workbook.Sheets[sheetName];
		const header = XLSX.utils.sheet_to_json<unknown[]>(sheet, { header: 1 })[0];
		if (!header || header.length === 0) continue;
		// raw: false devuelve el texto formateado, así los códigos numéricos llegan como texto
		const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
			defval: "",
			raw: false,
		});
		return { columns: columnsFromRows(rows), rows };
	}
	throw new Error("El archivo no contiene hojas con datos");
};

const rowsFromJSON = async (file: File): Promise<FileRows> => {
	const data: unknown = JSON.parse(await file.text());
	// Acepta un arreglo de objetos o un objeto con una propiedad que sea un arreglo de objetos
	const array = Array.isArray(data)
		? data
		: isRecord(data)
		? Object.values(data).find(Array.isArray)
		: undefined;
	const rows = (array || []).filter(isRecord);
	if (rows.length === 0) {
		throw new Error("El JSON debe contener un arreglo de objetos");
	}
	return { columns: columnsFromRows(rows), rows };
};

export const fileToRows = (file: File): Promise<FileRows> => {
	const name = file.name.toLowerCase();
	if (name.endsWith(".json")) return rowsFromJSON(file);
	if (name.endsWith(".xlsx") || name.endsWith(".xls")) return rowsFromXLSX(file);
	return Promise.reject(new Error("Formato no soportado, usa .xlsx, .xls o .json"));
};
