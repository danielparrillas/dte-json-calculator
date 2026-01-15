import InputFiles from "@/components/ui/input-files";
import { setJsonsFromFiles, useDteStore } from "@/hooks/dteStore";
import { toast } from "sonner";
import { useStore } from "zustand";

export default function UpploadSection() {
	const handleDuplicateUpload = (file: File) => {
		toast.error(
			<p>
				El archivo <strong>{file.name}</strong> ya ha sido subido
			</p>
		);
	};

	const isDisabled = useDteStore((state) => state.format) === null;

	return (
		<InputFiles
			onChange={setJsonsFromFiles}
			onDuplicateUpload={handleDuplicateUpload}
			accept=".json"
			disable={isDisabled}
		/>
	);
}
