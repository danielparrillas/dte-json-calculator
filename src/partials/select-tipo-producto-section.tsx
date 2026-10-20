import { Button } from "@/components/ui/button";
import {
	setExcludedTiposProducto,
	TIPOS_PRODUCTO,
	toggleTipoProducto,
	useProductosStore,
} from "@/hooks/productosStore";
import { cn } from "@/lib/utils";
import { ItemConTipoProducto, montoItem } from "@/utils/productoColumns";
import { Check } from "lucide-react";
import { useMemo } from "react";

type Props = {
	items: ItemConTipoProducto[];
};

export default function SelectTipoProductoSection({ items }: Props) {
	const excludedTiposProducto = useProductosStore(
		(state) => state.excludedTiposProducto
	);

	const resumen = useMemo(
		() =>
			TIPOS_PRODUCTO.map((tipo) => {
				const delTipo = items.filter(
					({ tipoProducto }) => tipoProducto === tipo
				);
				return {
					tipo,
					items: delTipo.length,
					monto: delTipo.reduce((total, { item }) => total + montoItem(item), 0),
				};
			}),
		[items]
	);

	return (
		<div className="flex flex-col gap-4 mb-4">
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={excludedTiposProducto.length === 0}
					onClick={() => setExcludedTiposProducto([])}
				>
					Seleccionar todos
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={excludedTiposProducto.length === TIPOS_PRODUCTO.length}
					onClick={() => setExcludedTiposProducto([...TIPOS_PRODUCTO])}
				>
					Quitar todos
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
				{resumen.map(({ tipo, items, monto }) => {
					const seleccionado = !excludedTiposProducto.includes(tipo);
					return (
						<button
							key={tipo}
							onClick={() => toggleTipoProducto(tipo)}
							aria-pressed={seleccionado}
							className={cn(
								"p-4 rounded-lg border-2 transition-all cursor-pointer text-left",
								seleccionado
									? "border-blue-500 bg-blue-50"
									: "border-gray-300 bg-white hover:border-gray-400"
							)}
						>
							<div className="flex items-start justify-between gap-2">
								<div className="text-lg font-semibold text-gray-800">
									{tipo}
								</div>
								<div
									className={cn(
										"size-5 shrink-0 rounded border-2 flex items-center justify-center",
										seleccionado
											? "border-blue-500 bg-blue-500 text-white"
											: "border-gray-300"
									)}
								>
									{seleccionado && <Check className="size-3.5" />}
								</div>
							</div>
							<div className="flex gap-6 mt-3 text-sm text-gray-700">
								<div>
									<span className="font-semibold">{items}</span>{" "}
									{items === 1 ? "item" : "items"}
								</div>
								<div>
									<span className="font-semibold">${monto.toFixed(2)}</span>{" "}
									en ventas
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
