import JsonSheetViewer from "./components/json-sheet-viewer";
import {
	Accordion,
	AccordionItem,
	AccordionContent,
	AccordionTrigger,
} from "./components/ui/accordion";
import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./components/ui/card";
import ErrorsSection from "./partials/errors-section";
import { SelectDTEFormat } from "./partials/select-dte-format";
import CCFTableSection from "./partials/ccf/ccf-table-section";
import UpploadSection from "./partials/uppload-section";
import CCFItemsTableSection from "./partials/ccf/ccf-items-table-section";
import { useDteStore } from "./hooks/dteStore";
import { DTEFormat } from "./types/dteFormatEnum";
import CCFTTableSection from "./partials/ccf-t/ccf-t-table-section";

function App() {
	const dteFormat = useDteStore((state) => state.format);
	return (
		<div className="h-screen flex flex-col items-center bg-card">
			<header className="w-full flex justify-center border-b shadow-sm lg:px-8">
				<Card className="w-full border-none shadow-none">
					<CardHeader>
						<CardTitle className="text-2xl">
							DTE - Document Table Explorer
						</CardTitle>
						<CardDescription>
							Herramienta automatizadora para la exploración de archivos de los
							DTE JSON
						</CardDescription>
					</CardHeader>
				</Card>
			</header>
			<main className="grow py-4 w-full px-6 lg:px-8">
				<Accordion type="single" collapsible className="mb-4">
					<AccordionItem value="item-1">
						<AccordionTrigger>Paso 1: Elije el formato</AccordionTrigger>
						<AccordionContent>
							Selecciona el formato de tabla que deseas utilizar para explorar
							los archivos JSON de los DTE. Puedes elegir entre formato CCF,
							CCF-T y DCL-T
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<SelectDTEFormat />
				<Accordion type="single" collapsible className="mb-4">
					<AccordionItem value="item-1">
						<AccordionTrigger>Paso 2: Sube los archivos JSON</AccordionTrigger>
						<AccordionContent>
							Los archivos JSON son los documentos electrónicos que se generan
							en la factura electrónica. Puedes subir uno o varios archivos a la
							vez.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<UpploadSection />
				<ErrorsSection />
				<Accordion type="single" collapsible className="mb-4 mt-12">
					<AccordionItem value="item-1">
						<AccordionTrigger>
							Paso 3: Cálculo de los resultados
						</AccordionTrigger>
						<AccordionContent>
							Se extraen los datos de los archivos JSON y se presentan en una
							tabla para su exploración.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				{dteFormat === DTEFormat.CCF_T ? (
					<CCFTTableSection />
				) : (
					<CCFTableSection />
				)}
				{dteFormat === DTEFormat.CCF && (
					<>
						<Accordion type="single" collapsible className="mb-4 mt-12">
							<AccordionItem value="item-1">
								<AccordionTrigger>Paso 4: Detalle por items</AccordionTrigger>
								<AccordionContent>
									Se muestra una tabla con los detalles de los items de cada
									DTE.
								</AccordionContent>
							</AccordionItem>
						</Accordion>
						<CCFItemsTableSection />
					</>
				)}
			</main>
			<JsonSheetViewer />
			<footer className="w-full flex justify-center border-t shadow-sm bg-muted mt-16 lg:px-8">
				<Card className="w-full border-none shadow-none bg-transparent">
					<CardHeader>
						<CardTitle className="text-xl">Acerca de</CardTitle>
						<CardDescription>
							Esta herramienta fue creada por{" "}
							<a
								href="https://github.com/danielparrillas"
								target="_blank"
								rel="noreferrer"
								className="text-primary"
							>
								Daniel Parrillas
							</a>{" "}
							para facilitar la exploración de los documentos electrónicos de la
							factura electrónica.
						</CardDescription>
					</CardHeader>
				</Card>
			</footer>
		</div>
	);
}

export default App;
