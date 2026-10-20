import { Button } from "@/components/ui/button";
import {
	clearProductos,
	setProductosFromRows,
	useProductosStore,
} from "@/hooks/productosStore";
import { fileToRows } from "@/utils/fileToRows";
import { NoEncontradosDialog, VerProductosDialog } from "@/partials/productos-dialogs";
import ProductosColumnasConfig from "@/partials/productos-columnas-config";
import { Database, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function ProductosSection() {
	const inputFile = useRef<HTMLInputElement>(null);
	const fileName = useProductosStore((state) => state.fileName);

	const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		// Permite volver a elegir el mismo archivo
		e.target.value = "";
		if (!file) return;
		try {
			setProductosFromRows(file.name, await fileToRows(file));
		} catch (error) {
			toast.error(
				<p>
					No se pudo leer <strong>{file.name}</strong>:{" "}
					{error instanceof Error ? error.message : "Error desconocido"}
				</p>
			);
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<input
				ref={inputFile}
				type="file"
				onChange={handleFileChange}
				className="hidden"
				accept=".xlsx,.xls,.json"
			/>
			<div className="flex flex-wrap items-center gap-2">
				<Button
					variant="outline"
					size="sm"
					onClick={() => inputFile.current?.click()}
				>
					<Database className="size-4 mr-2" />
					{fileName ? "Cambiar archivo" : "Cargar productos (.xlsx, .xls, .json)"}
				</Button>
				{fileName && (
					<>
						<span className="text-sm text-muted-foreground">{fileName}</span>
						<Button
							variant="ghost"
							size="icon"
							className="size-7"
							onClick={clearProductos}
						>
							<X className="size-4" />
							<span className="sr-only">Quitar base de productos</span>
						</Button>
						<VerProductosDialog />
						<NoEncontradosDialog />
					</>
				)}
			</div>
			{fileName && <ProductosColumnasConfig />}
		</div>
	);
}
