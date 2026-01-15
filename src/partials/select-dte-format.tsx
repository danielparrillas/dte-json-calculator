import { setDteFormat, useDteStore } from "@/hooks/dteStore";
import { cn } from "@/lib/utils";
import { DTEFormat } from "@/types/dteFormatEnum";

const DTE_FORMATS = [
	{
		id: DTEFormat.CCF,
		name: "CCF",
		description: "Comprobante de Crédito Fiscal",
	},
	{
		id: DTEFormat.CCF_T,
		name: "CCF-TARJ",
		description: "Comprobante de Crédito Fiscal - Tarjeta",
	},
	{
		id: DTEFormat.DCL_T,
		name: "DCL-TARJ",
		description: "Pendiente...",
		disabled: true,
	},
];

export const SelectDTEFormat: React.FC = () => {
	const selectedFormat = useDteStore((state) => state.format);
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{DTE_FORMATS.map((format) => (
				<button
					key={format.id}
					onClick={() => setDteFormat(format.id)}
					className={cn(
						"p-4 rounded-lg border-2 transition-all cursor-pointer",
						selectedFormat === format.id
							? "border-blue-500 bg-blue-50"
							: "border-gray-300 bg-white hover:border-gray-400",
						format.disabled && "opacity-50 cursor-not-allowed"
					)}
					disabled={format.disabled}
				>
					<div className="text-lg font-semibold text-gray-800">
						{format.name}
					</div>
					<div className="text-sm text-gray-600 mt-2">{format.description}</div>
				</button>
			))}
		</div>
	);
};
