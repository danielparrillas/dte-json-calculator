import { TipoProducto } from "@/hooks/productosStore";
import { ColumnDef } from "@tanstack/react-table";

type ItemVenta = {
	ventaNoSuj?: number | null;
	ventaExenta?: number | null;
	ventaGravada?: number | null;
};

export type ItemConTipoProducto = {
	item: ItemVenta;
	tipoProducto?: TipoProducto;
};

// Total de venta del item (no sujeta + exenta + gravada)
export const montoItem = (item: ItemVenta) =>
	Number(item.ventaNoSuj || 0) +
	Number(item.ventaExenta || 0) +
	Number(item.ventaGravada || 0);

const montoSiEsTipo =
	(tipo: TipoProducto) =>
	({ item, tipoProducto }: ItemConTipoProducto) =>
		(tipoProducto === tipo ? montoItem(item) : 0).toFixed(2);

// Agrega las columnas del catálogo de productos después de "Descripción"
export const withProductoColumns = <T extends ItemConTipoProducto>(
	columns: ColumnDef<T>[]
): ColumnDef<T>[] => {
	const productoColumns: ColumnDef<T>[] = [
		{
			id: "Tipo producto",
			accessorFn: ({ tipoProducto }) => tipoProducto,
			meta: {
				title: "Tipo producto",
				type: "string",
			},
		},
		{
			id: "Mercadería",
			accessorFn: montoSiEsTipo("Mercadería"),
			meta: {
				title: "Mercadería",
				type: "number",
			},
		},
		{
			id: "Servicio",
			accessorFn: montoSiEsTipo("Servicio"),
			meta: {
				title: "Servicio",
				type: "number",
			},
		},
	];
	const index = columns.findIndex((column) => column.id === "Descripción");
	return [
		...columns.slice(0, index + 1),
		...productoColumns,
		...columns.slice(index + 1),
	];
};
