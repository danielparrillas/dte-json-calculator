import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useFilteredJsons } from "@/hooks/dteStore";
import {
	getTipoProducto,
	normalizarCodigo,
	parseTipoProducto,
	useCatalogoProductos,
	useProductosStore,
} from "@/hooks/productosStore";
import {
	downloadRows,
	FORMATOS_DESCARGA,
	FormatoDescarga,
} from "@/utils/downloadRows";
import ProductosColumnasConfig from "@/partials/productos-columnas-config";
import { ColumnDef } from "@tanstack/react-table";
import { Download, SearchX, Table2 } from "lucide-react";
import { useMemo } from "react";

type Fila = Record<string, unknown>;

export function VerProductosDialog() {
	const columns = useProductosStore((state) => state.columns);
	const rows = useProductosStore((state) => state.rows);
	const fileName = useProductosStore((state) => state.fileName);
	const codigoColumn = useProductosStore((state) => state.codigoColumn);
	const tipoColumn = useProductosStore((state) => state.tipoColumn);

	const tableColumns = useMemo<ColumnDef<Fila>[]>(
		() => [
			...columns.map<ColumnDef<Fila>>((column) => ({
				id: column,
				accessorFn: (row) => String(row[column] ?? ""),
				meta: {
					title: column,
					type: "string",
				},
			})),
			{
				id: "Tipo reconocido",
				accessorFn: (row) =>
					(tipoColumn && parseTipoProducto(row[tipoColumn])) ||
					"No reconocido",
				meta: {
					title: "Tipo reconocido",
					type: "string",
				},
			},
		],
		[columns, tipoColumn]
	);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm">
					<Table2 className="size-4 mr-2" />
					Ver productos
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-6xl max-h-[90vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>Base de datos de productos</DialogTitle>
					<DialogDescription>
						{fileName}: {rows.length} filas
					</DialogDescription>
				</DialogHeader>
				<ProductosColumnasConfig />
				<DataTable
					columns={tableColumns}
					data={rows}
					filterBy={codigoColumn ?? undefined}
					calcTotals={false}
					exportedFileName="Productos"
				/>
			</DialogContent>
		</Dialog>
	);
}

type NoEncontrado = {
	codigo: string;
	descripcion: string;
	items: number;
};

const noEncontradosColumns: ColumnDef<NoEncontrado>[] = [
	{
		id: "Código",
		accessorFn: ({ codigo }) => codigo,
		meta: {
			title: "Código",
			type: "string",
		},
	},
	{
		id: "Descripción",
		accessorFn: ({ descripcion }) => descripcion,
		meta: {
			title: "Descripción",
			type: "string",
		},
	},
	{
		id: "Items",
		accessorFn: ({ items }) => items,
		meta: {
			title: "Items",
			type: "number",
		},
	},
];

export function NoEncontradosDialog() {
	const jsons = useFilteredJsons();
	const catalogo = useCatalogoProductos();

	// Códigos de los items que no están en el catálogo, sin repetir
	const noEncontrados = useMemo(() => {
		if (!catalogo) return [];
		const porCodigo = new Map<string, NoEncontrado>();
		for (const json of jsons) {
			if (!Array.isArray(json.cuerpoDocumento)) continue;
			for (const item of json.cuerpoDocumento) {
				if (getTipoProducto(catalogo, item.codigo) !== "No identificado")
					continue;
				const codigo = normalizarCodigo(item.codigo);
				const descripcion = item.descripcion?.trim() || "";
				// Los items sin código se agrupan por descripción
				const key = codigo || `sin-codigo:${descripcion}`;
				const actual = porCodigo.get(key);
				if (actual) actual.items += 1;
				else porCodigo.set(key, { codigo, descripcion, items: 1 });
			}
		}
		return Array.from(porCodigo.values()).sort((a, b) =>
			a.codigo.localeCompare(b.codigo)
		);
	}, [jsons, catalogo]);

	const descargar = (formato: FormatoDescarga) =>
		downloadRows(
			noEncontrados.map(({ codigo, descripcion }) => ({
				Código: codigo,
				Descripción: descripcion,
			})),
			"Productos no encontrados",
			formato
		);

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button variant="outline" size="sm" disabled={!catalogo}>
					<SearchX className="size-4 mr-2" />
					No encontrados ({noEncontrados.length})
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
				<DialogHeader>
					<DialogTitle>Productos no encontrados</DialogTitle>
					<DialogDescription>
						Códigos de los items de los DTE que no están en la base de
						productos.
					</DialogDescription>
				</DialogHeader>
				<DataTable
					columns={noEncontradosColumns}
					data={noEncontrados}
					filterBy="Código"
					canExport={false}
					headerContent={
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="ml-auto"
									disabled={noEncontrados.length === 0}
								>
									<Download className="size-4 mr-2" />
									Descargar
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								{FORMATOS_DESCARGA.map((formato) => (
									<DropdownMenuItem
										key={formato}
										onClick={() => descargar(formato)}
									>
										.{formato}
									</DropdownMenuItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					}
				/>
			</DialogContent>
		</Dialog>
	);
}
