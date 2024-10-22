import { setSelectedJson, useDteStore } from "@/hooks/dteStore";
import { Button } from "./ui/button";
import {
	Sheet,
	SheetContent,
	SheetTitle,
	SheetDescription,
	SheetHeader,
	SheetFooter,
	SheetClose,
} from "./ui/sheet";
import ReactJson from "react-json-view";

export default function JsonSheetViewer() {
	const selectedJson = useDteStore((state) => state.selectedJson);
	const onOpenChange = (open: boolean) => {
		if (!open) {
			setSelectedJson(null);
		}
	};
	return (
		<Sheet open={!!selectedJson} onOpenChange={onOpenChange}>
			<SheetContent className="flex flex-col min-w-fit w-full sm:max-w-4xl">
				<SheetHeader>
					<SheetTitle>Vista previa</SheetTitle>
					<SheetDescription>
						Navega entre las propiedades del JSON
					</SheetDescription>
				</SheetHeader>
				<div className="grow w-full sm:max-w-4xl overflow-y-auto overflow-x-auto">
					<ReactJson
						src={selectedJson || {}}
						displayDataTypes={false}
						indentWidth={2}
						collapsed={2}
					/>
				</div>
				<SheetFooter>
					<SheetClose asChild>
						<Button type="submit">Salir</Button>
					</SheetClose>
				</SheetFooter>
			</SheetContent>
		</Sheet>
	);
}
