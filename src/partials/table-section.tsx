import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { setSelectedJson, useDteStore } from "@/hooks/dteStore";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export default function TableSection() {
	const jsons = useDteStore((state) => state.jsons);
	return <DataTable columns={columns} data={jsons} filerBy="Emisor NIT" />;
}

const columns: ColumnDef<DTE>[] = [
	{
		id: "Fecha de emisión",
		accessorFn: (row) =>
			row.identificacion?.fecEmi?.split("-").reverse().join("/"),
		cell: ({ row }) => (
			<span className="text-nowrap">
				{row.original.identificacion?.fecEmi?.split("-").reverse().join("/")}
			</span>
		),
	},
	{
		id: "Hora de emisión",
		accessorFn: (row) => row.identificacion?.horEmi,
	},
	{
		id: "Emisor",
		accessorFn: (row) => row.emisor?.nombre,
	},
	{
		id: "Emisor NIT",
		accessorFn: (row) => row.emisor?.nit,
	},
	{
		id: "Código de generación",
		accessorFn: (row) =>
			row.identificacion?.codigoGeneracion?.replace(/-/g, ""),
	},
	{
		id: "Número de control",
		accessorFn: (row) => row.identificacion?.numeroControl?.replace(/-/g, ""),
	},
	{
		id: "Receptor NIT",
		accessorFn: (row) => row.receptor?.nit,
	},
	{
		id: "Receptor Nombre",
		accessorFn: (row) => row.receptor?.nombre,
	},
	{
		id: "Total Gravada",
		accessorFn: (row) => Number(row.resumen?.totalGravada).toFixed(2),
	},
	{
		id: "Total a Pagar",
		accessorFn: (row) => Number(row.resumen?.totalPagar).toFixed(2),
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
	},
];
