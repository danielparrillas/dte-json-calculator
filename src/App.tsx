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
import TableSection from "./partials/table-section";
import UpploadSection from "./partials/uppload-section";

function App() {
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
						<AccordionTrigger>Paso 1: Sube los archivos JSON</AccordionTrigger>
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
							Paso 2: Cálculo de los resultados
						</AccordionTrigger>
						<AccordionContent>
							Se extraen los datos de los archivos JSON y se presentan en una
							tabla para su exploración.
						</AccordionContent>
					</AccordionItem>
				</Accordion>
				<TableSection />
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
