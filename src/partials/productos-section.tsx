import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	clearProductos,
	setCodigoColumn,
	setProductosFromRows,
	setTipoColumn,
	useCatalogoProductos,
	useProductosStore,
} from "@/hooks/productosStore";
import { fileToRows } from "@/utils/fileToRows";
import { Database, X } from "lucide-react";
import { useRef } from "react";
import { toast } from "sonner";

export default function ProductosSection() {
	const inputFile = useRef<HTMLInputElement>(null);
	const fileName = useProductosStore((state) => state.fileName);
	const columns = useProductosStore((state) => state.columns);
	const codigoColumn = useProductosStore((state) => state.codigoColumn);
	const tipoColumn = useProductosStore((state) => state.tipoColumn);
	const catalogo = useCatalogoProductos();

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

	const conteo = catalogo
		? {
				mercaderia: Array.from(catalogo.exactos.values()).filter(
					(tipo) => tipo === "Mercadería"
				).length,
				servicio: Array.from(catalogo.exactos.values()).filter(
					(tipo) => tipo === "Servicio"
				).length,
		  }
		: null;

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
					</>
				)}
			</div>
			{fileName && (
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
					<label className="flex flex-col gap-1 text-sm font-medium">
						Columna de código
						<Select value={codigoColumn ?? ""} onValueChange={setCodigoColumn}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona la columna" />
							</SelectTrigger>
							<SelectContent>
								{columns.map((column) => (
									<SelectItem key={column} value={column}>
										{column}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</label>
					<label className="flex flex-col gap-1 text-sm font-medium">
						Columna de tipo (M Mercadería / S Servicio)
						<Select value={tipoColumn ?? ""} onValueChange={setTipoColumn}>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona la columna" />
							</SelectTrigger>
							<SelectContent>
								{columns.map((column) => (
									<SelectItem key={column} value={column}>
										{column}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</label>
				</div>
			)}
			{catalogo && conteo && (
				<p className="text-sm text-muted-foreground">
					{catalogo.exactos.size} productos cargados:{" "}
					<span className="font-semibold">{conteo.mercaderia}</span> de
					mercadería y <span className="font-semibold">{conteo.servicio}</span>{" "}
					de servicio
					{catalogo.ignorados > 0 &&
						` (${catalogo.ignorados} filas ignoradas por no tener código o tipo M/S)`}
					.
				</p>
			)}
		</div>
	);
}
