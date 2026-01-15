import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { setSelectedJson, useDteStore } from "@/hooks/dteStore";
import { DTE } from "@/types/dcl_t";
import { obtenerValorSelloForDCL } from "@/utils/selloSupport";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

function DCLTTableSection() {
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
		accessorFn: (row) => obtenerValorSelloForDCL(row),
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
		id: "Receptor",
		accessorFn: (row) => row.receptor?.nombre,
		meta: {
			title: "Receptor",
			type: "string",
		},
	},
	{
		id: "Tipo de DTE",
		accessorFn: (row) => row.identificacion?.tipoDte || "",
		meta: {
			title: "Tipo de DTE",
			type: "string",
		},
	},
	{
		id: "Valor Operaciones",
		accessorFn: (row) => {
			if (row.cuerpoDocumento && "valorOperaciones" in row.cuerpoDocumento) {
				return Number(row.cuerpoDocumento.valorOperaciones).toFixed(2);
			}
			return "";
		},
		meta: {
			title: "Valor Operaciones",
			type: "number",
		},
	},
	{
		id: "Comisión",
		accessorFn: (row) => {
			if (row.cuerpoDocumento && "comision" in row.cuerpoDocumento) {
				return Number(row.cuerpoDocumento.comision).toFixed(2);
			}
			return "";
		},
		meta: {
			title: "Comisión",
			type: "number",
		},
	},
	{
		id: "IVA",
		accessorFn: (row) => {
			if (row.cuerpoDocumento && "iva" in row.cuerpoDocumento) {
				return Number(row.cuerpoDocumento.iva).toFixed(2);
			}
			return "";
		},
		meta: {
			title: "IVA",
			type: "number",
		},
	},
	{
		id: "IVA Percibido",
		accessorFn: (row) => {
			if (row.cuerpoDocumento && "ivaPercibido" in row.cuerpoDocumento) {
				return Number(row.cuerpoDocumento.ivaPercibido).toFixed(2);
			}
			return "";
		},
		meta: {
			title: "IVA Percibido",
			type: "number",
		},
	},
	{
		id: "Líquido a Pagar",
		accessorFn: (row) => {
			if (row.cuerpoDocumento && "liquidoApagar" in row.cuerpoDocumento) {
				return Number(row.cuerpoDocumento.liquidoApagar).toFixed(2);
			}
			return "";
		},
		meta: {
			title: "Líquido a Pagar",
			type: "number",
		},
	},
	{
		id: "Código Liquidación",
		accessorFn: (row) => {
			if (row.cuerpoDocumento && "codLiquidacion" in row.cuerpoDocumento) {
				return row.cuerpoDocumento.codLiquidacion;
			}
			return "";
		},
		meta: {
			title: "Código Liquidación",
			type: "string",
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

export default DCLTTableSection;
