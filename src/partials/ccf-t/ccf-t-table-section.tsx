import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { setSelectedJson, useDteStore } from "@/hooks/dteStore";
import { DTE } from "@/types/ccf_t";
import { obtenerValorSelloForCCFT } from "@/utils/selloSupport";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

function CCFTTableSection() {
	const jsons = useDteStore((state) => state.jsons);
	return (
		<DataTable columns={columns} data={jsons as DTE[]} filterBy="Emisor NIT" />
	);
}
const columns: ColumnDef<DTE>[] = [
	{
		id: "Fecha de emisión",
		accessorFn: (row) =>
			`${row.identificacion?.fecEmi} ${row.identificacion?.horEmi}`,
		cell: ({ row }) => (
			<span className="text-nowrap">
				{row.original.identificacion?.fecEmi?.split("-").reverse().join("/")}
			</span>
		),
		meta: {
			title: "Fecha de emisión",
			type: "date",
		},
	},
	{
		id: "Hora de emisión",
		accessorFn: (row) => row.identificacion?.horEmi,
		meta: {
			title: "Hora de emisión",
			type: "string",
		},
	},
	{
		id: "Código de generación",
		accessorFn: (row) =>
			row.identificacion?.codigoGeneracion?.replace(/-/g, ""),
		meta: {
			title: "Código de generación",
			type: "string",
		},
	},
	{
		id: "Número de control",
		accessorFn: (row) => row.identificacion?.numeroControl?.replace(/-/g, ""),
		meta: {
			title: "Número de control",
			type: "string",
		},
	},
	{
		id: "Sello recepción",
		accessorFn: (row) => obtenerValorSelloForCCFT(row),
		meta: {
			title: "Sello recepción",
			type: "string",
		},
	},
	{
		id: "Emisor",
		accessorFn: (row) => row.emisor?.nombre,
		meta: {
			title: "Emisor",
			type: "string",
		},
	},
	{
		id: "Emisor NIT",
		accessorFn: (row) => row.emisor?.nit,
		meta: {
			title: "Emisor NIT",
			type: "string",
		},
	},
	{
		id: "Receptor NIT",
		accessorFn: (row) => row.receptor?.nit || "",
		meta: {
			title: "Receptor NIT",
			type: "string",
		},
	},
	{
		id: "Receptor Nombre",
		accessorFn: (row) => row.receptor?.nombre,
		meta: {
			title: "Receptor Nombre",
			type: "string",
		},
	},
	// {
	// 	id: "Observaciones",
	// 	accessorFn: (row) => row.cuerpoDocumento?.observaciones || "",
	// 	meta: {
	// 		title: "Observaciones",
	// 		type: "string",
	// 	},
	// },
	{
		id: "Tipo de DTE",
		accessorFn: (row) => row.identificacion?.tipoDte || "",
		meta: {
			title: "Tipo de DTE",
			type: "string",
		},
	},
	{
		id: "Total No sujeto",
		accessorFn: (row) => Number(row.resumen?.totalNoSuj).toFixed(2),
		meta: {
			title: "Total No sujeto",
			type: "number",
		},
	},
	{
		id: "Total Exenta",
		accessorFn: (row) => Number(row.resumen?.totalExenta).toFixed(2),
		meta: {
			title: "Total Exenta",
			type: "number",
		},
	},
	{
		id: "Total Gravada",
		accessorFn: (row) => Number(row.resumen?.totalGravada).toFixed(2),
		meta: {
			title: "Total Gravada",
			type: "number",
		},
	},
	{
		id: "Total a Pagar",
		accessorFn: (row) => Number(row.resumen?.totalPagar).toFixed(2),
		meta: {
			title: "Total a Pagar",
			type: "number",
		},
	},
	{
		id: "Tributo",
		accessorFn: (row) => {
			const tributo =
				(row.resumen?.tributos && row.resumen.tributos[0].descripcion) ||
				"Sin tributo";
			return tributo;
		},
		meta: {
			title: "Tributo",
			type: "number",
		},
	},
	{
		id: "Total IVA",
		accessorFn: (row) => {
			const iva = (row.resumen?.tributos && row.resumen.tributos[0].valor) || 0;
			return Number(iva).toFixed(2);
		},
		meta: {
			title: "Total IVA",
			type: "number",
		},
	},
	{
		id: "Acciones",
		header: "",
		accessorFn: () => "",
		cell: ({ row }) => (
			<Button
				className="p-0.5 size-auto bg-blue-600 hover:bg-blue-700"
				onClick={() => setSelectedJson(row.original as object)}
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

export default CCFTTableSection;
