import InputFiles from "@/components/ui/input-files";
import {
	setDteFormat,
	setJsonsFromFiles,
	useDteStore,
} from "@/hooks/dteStore";
import { DTEFormat } from "@/types/dteFormatEnum";
import { toast } from "sonner";

export default function UpploadSection() {
	const handleDuplicateUpload = (file: File) => {
		toast.error(
			<p>
				El archivo <strong>{file.name}</strong> ya ha sido subido
			</p>
		);
	};

	const format = useDteStore((state) => state.format);
	const isDisabled = format === null;

	const handleChange = (files: FileList | null) => {
		if (format === null && files && files.length > 0) {
			setDteFormat(DTEFormat.CCF);
		}
		setJsonsFromFiles(files);
	};

	return (
		<InputFiles
			onChange={handleChange}
			onDuplicateUpload={handleDuplicateUpload}
			accept=".json"
			disable={isDisabled}
			allowDropWhenDisabled
		/>
	);
}
