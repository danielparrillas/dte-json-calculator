import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "./components/ui/card";

function App() {
	return (
		<div className="h-screen flex flex-col items-center bg-card">
			<header className="w-full flex justify-center border-b shadow-sm">
				<Card className="max-w-4xl w-full border-none shadow-none">
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
			<main className="max-w-4xl w-full"></main>
		</div>
	);
}

export default App;
