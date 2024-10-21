import InputFiles from "@/components/ui/input-files";
import { setJsonsFromFiles } from "@/hooks/dteStore";
import { toast } from "sonner";

export default function UpploadSection() {
	const handleDuplicateUpload = (file: File) => {
		toast.error(
			<p>
				El archivo <strong>{file.name}</strong> ya ha sido subido
			</p>
		);
	};

	return (
		<InputFiles
			onChange={setJsonsFromFiles}
			onDuplicateUpload={handleDuplicateUpload}
			accept=".json"
		/>
	);
}
