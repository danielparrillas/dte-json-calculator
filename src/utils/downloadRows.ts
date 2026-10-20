import * as XLSX from "xlsx";

export const FORMATOS_DESCARGA = ["xlsx", "xls", "csv", "json"] as const;

export type FormatoDescarga = (typeof FORMATOS_DESCARGA)[number];

export const downloadRows = (
	rows: Record<string, string | number>[],
	fileName: string,
	formato: FormatoDescarga
) => {
	if (formato === "json") {
		const blob = new Blob([JSON.stringify(rows, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const link = document.createElement("a");
		link.href = url;
		link.download = `${fileName}.json`;
		link.click();
		URL.revokeObjectURL(url);
		return;
	}
	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(
		workbook,
		XLSX.utils.json_to_sheet(rows),
		"Productos"
	);
	XLSX.writeFile(workbook, `${fileName}.${formato}`, { bookType: formato });
};
