import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { setSelectedJson, useDteStore } from "@/hooks/dteStore";
import { CuerpoDocumento, DTE } from "@/types/ccf";
import { obtenerValorSelloForCCF } from "@/utils/selloSupport";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

type Item = {
	item: CuerpoDocumento;
	dte: DTE;
};

function CCFItemsTableSection() {
	const jsons = useDteStore((state) => state.jsons);
	const items: Item[] = (jsons as DTE[])
		.filter(
			(json) => json.cuerpoDocumento && Array.isArray(json.cuerpoDocumento)
		)
		.map((json) =>
			(json.cuerpoDocumento || []).map((item) => ({ item, dte: json }))
		)
		.flat();

	return <DataTable columns={columns} data={items} filterBy="Emisor NIT" />;
}
const columns: ColumnDef<Item>[] = [
	{
		id: "Fecha de emisión",
		accessorFn: ({ dte }) =>
			`${dte.identificacion?.fecEmi} ${dte.identificacion?.horEmi}`,
		cell: ({ row }) => (
			<span className="text-nowrap">
				{row.original.dte.identificacion?.fecEmi
					?.split("-")
					.reverse()
					.join("/")}
			</span>
		),
		meta: {
			title: "Fecha de emisión",
			type: "date",
		},
	},
	{
		id: "Hora de emisión",
		accessorFn: ({ dte }) => dte.identificacion?.horEmi,
		meta: {
			title: "Hora de emisión",
			type: "string",
		},
	},
	{
		id: "Emisor",
		accessorFn: ({ dte }) => dte.emisor?.nombre,
		meta: {
			title: "Emisor",
			type: "string",
		},
	},
	{
		id: "Emisor NIT",
		accessorFn: ({ dte }) => dte.emisor?.nit,
		meta: {
			title: "Emisor NIT",
			type: "string",
		},
	},
	{
		id: "Código de generación",
		accessorFn: ({ dte }) =>
			dte.identificacion?.codigoGeneracion?.replace(/-/g, ""),
		meta: {
			title: "Código de generación",
			type: "string",
		},
	},
	{
		id: "Número de control",
		accessorFn: ({ dte }) =>
			dte.identificacion?.numeroControl?.replace(/-/g, ""),
		meta: {
			title: "Número de control",
			type: "string",
		},
	},
	{
		id: "Sello recepción",
		accessorFn: ({ dte }) => obtenerValorSelloForCCF(dte),
		meta: {
			title: "Sello recepción",
			type: "string",
		},
	},
	{
		id: "Receptor NIT",
		accessorFn: ({ dte }) => dte.receptor?.nit || "",
		meta: {
			title: "Receptor NIT",
			type: "string",
		},
	},
	{
		id: "Receptor Nombre",
		accessorFn: ({ dte }) => dte.receptor?.nombre,
		meta: {
			title: "Receptor Nombre",
			type: "string",
		},
	},
	{
		id: "Total Gravada",
		accessorFn: ({ dte }) => Number(dte.resumen?.totalGravada).toFixed(2),
		meta: {
			title: "Total Gravada",
			type: "number",
		},
	},
	{
		id: "Total a Pagar",
		accessorFn: ({ dte }) => Number(dte.resumen?.totalPagar).toFixed(2),
		meta: {
			title: "Total a Pagar",
			type: "number",
		},
	},
	{
		id: "Código",
		accessorFn: ({ item }) => item.codigo,
		meta: {
			title: "Código",
			type: "string",
		},
	},
	{
		id: "Descripción",
		accessorFn: ({ item }) => item.descripcion,
		meta: {
			title: "Descripción",
			type: "string",
		},
	},
	{
		id: "Cantidad",
		accessorFn: ({ item }) => item.cantidad,
		meta: {
			title: "Cantidad",
			type: "number",
		},
	},
	{
		id: "Unidad de medida",
		accessorFn: ({ item }) => item.uniMedida,
		meta: {
			title: "Unidad de medida",
			type: "string",
		},
	},
	{
		id: "Precio Unitario",
		accessorFn: ({ item }) => item.precioUni,
		meta: {
			title: "Precio Unitario",
			type: "number",
		},
	},
	{
		id: "Descuento por item",
		accessorFn: ({ item }) => item.montoDescu,
		meta: {
			title: "Descuento por item",
			type: "number",
		},
	},
	{
		id: "Ventas no sujetas",
		accessorFn: ({ item }) => item.ventaNoSuj,
		meta: {
			title: "Ventas no sujetas",
			type: "number",
		},
	},
	{
		id: "Ventas exentas",
		accessorFn: ({ item }) => item.ventaExenta,
		meta: {
			title: "Ventas exentas",
			type: "number",
		},
	},
	{
		id: "Ventas gravadas",
		accessorFn: ({ item }) => item.ventaGravada,
		meta: {
			title: "Ventas gravadas",
			type: "number",
		},
	},
	{
		id: "Acciones",
		header: "",
		accessorFn: () => "",
		cell: ({ row: { original } }) => (
			<Button
				className="p-0.5 size-auto bg-blue-600 hover:bg-blue-700"
				onClick={() => setSelectedJson(original as Object)}
			>
				<Eye className="size-4" />
			</Button>
		),
		meta: {
			title: "Acciones",
			type: "string",
		},
	},
];

export default CCFItemsTableSection;
