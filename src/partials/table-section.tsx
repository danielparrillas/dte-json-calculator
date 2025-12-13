import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { setSelectedJson, useDteStore } from "@/hooks/dteStore";
import { obtenerValorSello } from "@/utils/selloSupport";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export default function TableSection() {
	const jsons = useDteStore((state) => state.jsons);
	return <DataTable columns={columns} data={jsons} filterBy="Emisor NIT" />;
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
		accessorFn: (row) => obtenerValorSello(row),
		meta: {
			title: "Sello recepción",
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
	// 	id: "Total Gravada",
	// 	accessorFn: (row) => Number(row.resumen?.totalGravada).toFixed(2),
	// 	meta: {
	// 		title: "Total Gravada",
	// 		type: "number",
	// 	},
	// },
	// {
	// 	id: "Total a Pagar",
	// 	accessorFn: (row) => Number(row.resumen?.totalPagar).toFixed(2),
	// 	meta: {
	// 		title: "Total a Pagar",
	// 		type: "number",
	// 	},
	// },
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
