import InputFiles from "@/components/ui/input-files";
import { useDteStore } from "@/hooks/dteStore";
import { toast } from "sonner";

export default function UpploadSection() {
	const setFiles = useDteStore((state) => state.setFiles);

	const handleDuplicateUpload = (file: File) => {
		toast.error(
			<p>
				El archivo <strong>{file.name}</strong> ya ha sido subido
			</p>
		);
	};

	return (
		<InputFiles
			onChange={setFiles}
			onDuplicateUpload={handleDuplicateUpload}
			accept=".json"
		/>
	);
}
