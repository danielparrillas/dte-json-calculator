import { Table as TableType } from "@tanstack/react-table";
import * as XLSX from "xlsx";

type ColumnMeta = {
	title?: string;
	type?: "string" | "number" | "date";
};

export function exportTableToExcel<TData>(
	table: TableType<TData>,
	exportedFileName: string = "export"
) {
	const visibleColumns = table
		.getAllColumns()
		.filter((column) => column.getIsVisible());

	const columnNames = visibleColumns.map((column) => {
		const meta = column.columnDef.meta as ColumnMeta;
		return meta?.title || column.id;
	});

	const columnTypes = visibleColumns.map((column) => {
		const meta = column.columnDef.meta as ColumnMeta;
		return meta?.type || "string";
	});

	const data = table.getFilteredRowModel().rows.map((row) =>
		row.getVisibleCells().map((cell, colIndex) => {
			const raw = cell.getValue();
			const type = columnTypes[colIndex];

			if (type === "number") {
				const num = parseFloat(raw as string);
				return isNaN(num) ? raw : num;
			} else if (type === "date") {
				if (
					typeof raw === "string" &&
					/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(raw)
				) {
					const [datePart, timePart] = raw.split(" ");
					const [year, month, day] = datePart.split("-").map(Number);
					const [hours, minutes, seconds] = timePart.split(":").map(Number);

					// ✅ Crear fecha completa con hora EN LOCAL
					return new Date(year, month - 1, day, hours, minutes, seconds);
				}

				// fallback por si acaso
				const date = new Date(raw as string);
				return isNaN(date.getTime()) ? raw : date;
			}
			return String(raw);
		})
	);

	const worksheetData = [columnNames, ...data];

	const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

	// Ajustar formato de celdas para fechas y números
	const range = XLSX.utils.decode_range(worksheet["!ref"]!);
	for (let R = 1; R <= range.e.r; ++R) {
		for (let C = 0; C <= range.e.c; ++C) {
			const cell = worksheet[XLSX.utils.encode_cell({ r: R, c: C })];
			const type = columnTypes[C];

			if (cell && type === "date" && cell.v instanceof Date) {
				cell.t = "d"; // tipo fecha
				cell.z = "dd/mm/yyyy"; // 👈 mostrar solo fecha, pero internamente guarda fecha+hora
			} else if (cell && type === "number" && typeof cell.v === "number") {
				cell.t = "n";
			}
		}
	}

	const workbook = XLSX.utils.book_new();
	XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");

	XLSX.writeFile(
		workbook,
		`${exportedFileName} - ${new Date().toLocaleString()}.xlsx`,
		{
			compression: true,
		}
	);
}
