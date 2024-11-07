import {
	Table,
	TableBody,
	TableCaption,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useDteStore } from "@/hooks/dteStore";

export default function ErrorsSection() {
	const errors = useDteStore((state) => state.errors);

	if (errors.length === 0) return null;

	return (
		<section className="p-4 bg-muted rounded">
			<h3 className="font-semibold text-muted-foreground">Errores</h3>
			<Table>
				<TableCaption>Lista de archivos que dieron error.</TableCaption>
				<TableHeader>
					<TableRow>
						<TableHead>Archivo</TableHead>
						<TableHead>Error</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{errors.map((error) => (
						<TableRow key={error.file}>
							<TableCell className="font-medium">{error.file}</TableCell>
							<TableCell>{error?.error?.message}</TableCell>
						</TableRow>
					))}
				</TableBody>
				<TableFooter>
					<TableRow>
						<TableCell>Conteo</TableCell>
						<TableCell className="text-right">{errors.length}</TableCell>
					</TableRow>
				</TableFooter>
			</Table>
		</section>
	);
}
