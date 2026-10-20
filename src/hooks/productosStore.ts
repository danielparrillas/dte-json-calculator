import { FileRows } from "@/utils/fileToRows";
import { useMemo } from "react";
import { create } from "zustand";

export const TIPOS_PRODUCTO = [
	"Mercadería",
	"Servicio",
	"No identificado",
] as const;

export type TipoProducto = (typeof TIPOS_PRODUCTO)[number];

interface ProductosStore {
	fileName: string | null;
	columns: string[];
	rows: Record<string, unknown>[];
	codigoColumn: string | null;
	tipoColumn: string | null;
	excludedTiposProducto: TipoProducto[];
}

export const useProductosStore = create<ProductosStore>()(() => ({
	fileName: null,
	columns: [],
	rows: [],
	codigoColumn: null,
	tipoColumn: null,
	excludedTiposProducto: [],
}));

// "M" / "Mercadería" -> Mercadería, "S" / "Servicio" -> Servicio
export const parseTipoProducto = (value: unknown): TipoProducto | null => {
	const text = String(value ?? "")
		.trim()
		.toUpperCase();
	if (text === "M" || text.startsWith("MERC")) return "Mercadería";
	if (text === "S" || text.startsWith("SERV")) return "Servicio";
	return null;
};

export const normalizarCodigo = (value: unknown) =>
	String(value ?? "")
		.trim()
		.toUpperCase();

// Excel suele convertir "0001" en 1, por eso también se compara sin ceros a la izquierda
const sinCerosIzquierda = (codigo: string) => codigo.replace(/^0+(?=.)/, "");

const detectarTipoColumn = ({ columns, rows }: FileRows) => {
	const porNombre = columns.find((column) => /tipo|actividad/i.test(column));
	const muestra = rows.slice(0, 200);
	const porValores = columns.find((column) => {
		const valores = muestra
			.map((row) => row[column])
			.filter((value) => String(value ?? "").trim() !== "");
		return (
			valores.length > 0 &&
			valores.filter((value) => parseTipoProducto(value)).length /
				valores.length >=
				0.8
		);
	});
	return porValores || porNombre || null;
};

const detectarCodigoColumn = (columns: string[], tipoColumn: string | null) => {
	const candidatas = columns.filter((column) => column !== tipoColumn);
	return (
		candidatas.find((column) => /c[oó]d|art[ií]culo|sku|code/i.test(column)) ||
		candidatas[0] ||
		null
	);
};

export const setProductosFromRows = (fileName: string, fileRows: FileRows) => {
	const tipoColumn = detectarTipoColumn(fileRows);
	useProductosStore.setState({
		fileName,
		columns: fileRows.columns,
		rows: fileRows.rows,
		tipoColumn,
		codigoColumn: detectarCodigoColumn(fileRows.columns, tipoColumn),
		excludedTiposProducto: [],
	});
};

export const clearProductos = () =>
	useProductosStore.setState({
		fileName: null,
		columns: [],
		rows: [],
		codigoColumn: null,
		tipoColumn: null,
		excludedTiposProducto: [],
	});

export const setCodigoColumn = (codigoColumn: string) =>
	useProductosStore.setState({ codigoColumn, excludedTiposProducto: [] });

export const setTipoColumn = (tipoColumn: string) =>
	useProductosStore.setState({ tipoColumn, excludedTiposProducto: [] });

export const toggleTipoProducto = (tipo: TipoProducto) => {
	const { excludedTiposProducto } = useProductosStore.getState();
	useProductosStore.setState({
		excludedTiposProducto: excludedTiposProducto.includes(tipo)
			? excludedTiposProducto.filter((excluded) => excluded !== tipo)
			: [...excludedTiposProducto, tipo],
	});
};

export const setExcludedTiposProducto = (
	excludedTiposProducto: TipoProducto[]
) => useProductosStore.setState({ excludedTiposProducto });

export type CatalogoProductos = {
	exactos: Map<string, TipoProducto>;
	sinCeros: Map<string, TipoProducto>;
	// Filas del archivo descartadas por no tener código o tipo reconocible
	ignorados: number;
};

// Catálogo código -> tipo; null mientras no esté cargado y configurado
export const useCatalogoProductos = (): CatalogoProductos | null => {
	const rows = useProductosStore((state) => state.rows);
	const codigoColumn = useProductosStore((state) => state.codigoColumn);
	const tipoColumn = useProductosStore((state) => state.tipoColumn);
	return useMemo(() => {
		if (rows.length === 0 || !codigoColumn || !tipoColumn) return null;
		const exactos = new Map<string, TipoProducto>();
		const sinCeros = new Map<string, TipoProducto>();
		let ignorados = 0;
		for (const row of rows) {
			const codigo = normalizarCodigo(row[codigoColumn]);
			const tipo = parseTipoProducto(row[tipoColumn]);
			if (!codigo || !tipo) {
				ignorados++;
				continue;
			}
			exactos.set(codigo, tipo);
			sinCeros.set(sinCerosIzquierda(codigo), tipo);
		}
		return { exactos, sinCeros, ignorados };
	}, [rows, codigoColumn, tipoColumn]);
};

export const getTipoProducto = (
	catalogo: CatalogoProductos,
	codigo: unknown
): TipoProducto => {
	const normalizado = normalizarCodigo(codigo);
	if (!normalizado) return "No identificado";
	return (
		catalogo.exactos.get(normalizado) ||
		catalogo.sinCeros.get(sinCerosIzquierda(normalizado)) ||
		"No identificado"
	);
};
