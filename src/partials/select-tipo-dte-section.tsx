import { Button } from "@/components/ui/button";
import {
	getTipoDte,
	setExcludedTiposDte,
	toggleTipoDte,
	useDteStore,
} from "@/hooks/dteStore";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useMemo } from "react";

const TIPOS_DTE: Record<string, string> = {
	"01": "Factura",
	"03": "Comprobante de Crédito Fiscal",
	"04": "Nota de Remisión",
	"05": "Nota de Crédito",
	"06": "Nota de Débito",
	"07": "Comprobante de Retención",
	"08": "Comprobante de Liquidación",
	"09": "Documento Contable de Liquidación",
	"11": "Factura de Exportación",
	"14": "Factura de Sujeto Excluido",
	"15": "Comprobante de Donación",
};

type Resumen = { tipoDte: string; documentos: number; items: number };

export default function SelectTipoDteSection() {
	const jsons = useDteStore((state) => state.jsons);
	const excludedTiposDte = useDteStore((state) => state.excludedTiposDte);

	const resumen = useMemo(() => {
		const porTipo = new Map<string, Resumen>();
		for (const json of jsons) {
			const tipoDte = getTipoDte(json);
			const actual = porTipo.get(tipoDte) || {
				tipoDte,
				documentos: 0,
				items: 0,
			};
			actual.documentos += 1;
			// Igual que las tablas de items: solo cuenta cuerpoDocumento cuando es arreglo
			if (Array.isArray(json.cuerpoDocumento)) {
				actual.items += json.cuerpoDocumento.length;
			}
			porTipo.set(tipoDte, actual);
		}
		return Array.from(porTipo.values()).sort((a, b) =>
			a.tipoDte.localeCompare(b.tipoDte)
		);
	}, [jsons]);

	if (resumen.length === 0) {
		return (
			<p className="text-sm text-muted-foreground">
				Sube archivos JSON para ver los tipos de DTE disponibles.
			</p>
		);
	}

	const todosSeleccionados = excludedTiposDte.length === 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="flex gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={todosSeleccionados}
					onClick={() => setExcludedTiposDte([])}
				>
					Seleccionar todos
				</Button>
				<Button
					variant="outline"
					size="sm"
					disabled={excludedTiposDte.length === resumen.length}
					onClick={() =>
						setExcludedTiposDte(resumen.map(({ tipoDte }) => tipoDte))
					}
				>
					Quitar todos
				</Button>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{resumen.map(({ tipoDte, documentos, items }) => {
					const seleccionado = !excludedTiposDte.includes(tipoDte);
					return (
						<button
							key={tipoDte}
							onClick={() => toggleTipoDte(tipoDte)}
							aria-pressed={seleccionado}
							className={cn(
								"p-4 rounded-lg border-2 transition-all cursor-pointer text-left",
								seleccionado
									? "border-blue-500 bg-blue-50"
									: "border-gray-300 bg-white hover:border-gray-400"
							)}
						>
							<div className="flex items-start justify-between gap-2">
								<div>
									<div className="text-lg font-semibold text-gray-800">
										{tipoDte}
									</div>
									<div className="text-sm text-gray-600">
										{TIPOS_DTE[tipoDte] || "Tipo de DTE desconocido"}
									</div>
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
									<span className="font-semibold">{documentos}</span>{" "}
									{documentos === 1 ? "documento" : "documentos"}
								</div>
								<div>
									<span className="font-semibold">{items}</span>{" "}
									{items === 1 ? "item" : "items"}
								</div>
							</div>
						</button>
					);
				})}
			</div>
		</div>
	);
}
