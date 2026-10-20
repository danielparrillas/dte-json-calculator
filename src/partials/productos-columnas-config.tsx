import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	setCodigoColumn,
	setTipoColumn,
	useCatalogoProductos,
	useProductosStore,
} from "@/hooks/productosStore";

// Selección de las columnas de código y tipo de la base de productos
export default function ProductosColumnasConfig() {
	const columns = useProductosStore((state) => state.columns);
	const codigoColumn = useProductosStore((state) => state.codigoColumn);
	const tipoColumn = useProductosStore((state) => state.tipoColumn);
	const catalogo = useCatalogoProductos();

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
