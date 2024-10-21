import { DataTable } from "@/components/ui/data-table";
import { useDteStore } from "@/hooks/dteStore";
import { jsonToObject } from "@/utils/jsonToObject";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";

export default function TableSection() {
	const files = useDteStore((state) => state.files);
	const [jsons, setJsons] = useState<any[]>([]);

	useEffect(() => {
		if (!files) {
			setJsons([]);
			return;
		}
		const promises = Array.from(files).map((file) => jsonToObject(file));
		Promise.all(promises)
			.then((jsons) => {
				setJsons(jsons);
			})
			.catch((error) => {
				console.error("Error al leer los archivos", error);
			});
	}, [files, files?.length]);

	console.log("jsons", jsons);

	return <DataTable columns={columns()} data={jsons} />;
}

const columns = (): ColumnDef<unknown>[] => [
	{
		id: "Emisor",
		accessorFn: (row) => row.codigoEmpresa,
	},
	{
		id: "Emisor NIT",
		accessorFn: (row) => row.emisor.nit,
	},
	{
		id: "Código de generación",
		accessorFn: (row) => row.identificacion.codigoGeneracion.replace(/-/g, ""),
	},
	{
		id: "Número de control",
		accessorFn: (row) => row.identificacion.numeroControl.replace(/-/g, ""),
	},
];
