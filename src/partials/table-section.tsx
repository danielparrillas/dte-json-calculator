import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { setSelectedJson, useDteStore } from "@/hooks/dteStore";
import { ColumnDef } from "@tanstack/react-table";
import { Eye } from "lucide-react";

export default function TableSection() {
	const jsons = useDteStore((state) => state.jsons);
	console.log(jsons);

	return <DataTable columns={columns} data={jsons} />;
}

const columns: ColumnDef<unknown>[] = [
	{
		id: "Emisor",
		accessorFn: (row) => row.codigoEmpresa,
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
		id: "Acciones",
		header: "",
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
