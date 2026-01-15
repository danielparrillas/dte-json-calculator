import { useRef, useState } from "react";
import { Button } from "./button";
import { Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import IconFile from "./icon-file";
import { ScrollArea } from "./scroll-area";
import { Separator } from "./separator";

type Props = {
	onChange: (Files: FileList | null) => void;
	onDuplicateUpload?: (file: File) => void;
	onMaxUpload?: () => void;
	maxFiles?: number;
	className?: string;
	name?: string;
	accept?: React.InputHTMLAttributes<HTMLInputElement>["accept"];
	disable?: boolean;
};

type FileNames = string[];

export default function InputFiles({
	maxFiles,
	onChange,
	className,
	onDuplicateUpload,
	onMaxUpload,
	accept,
	disable,
}: Props) {
	const files = useRef<DataTransfer>(new DataTransfer());
	const inputFile = useRef<HTMLInputElement>(null);
	const previews = useRef<FileNames>([]);
	const [length, setLength] = useState(0);

	const showAdder = !maxFiles || length < maxFiles;

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newFiles = e.target.files;
		if (!newFiles) return;
		addFilesToFileList(newFiles, files.current);
		onChange(files.current.files);
	};

	const addFilesToFileList = (
		newFiles: FileList,
		dataTransfer: DataTransfer
	) => {
		for (const file of newFiles) {
			const leesThanMax = !maxFiles || files.current.files.length < maxFiles;
			const isRepeated = previews.current.includes(file.name);

			if (isRepeated) onDuplicateUpload?.(file);

			if (leesThanMax && !isRepeated) {
				previews.current.push(file.name);
				dataTransfer.items.add(file);
			}

			if (!leesThanMax) {
				console.log("maxFiles", maxFiles);
				onMaxUpload?.();
				break;
			}
		}
		setLength(files.current.files.length);
	};

	const handleRemoveFile = (name: string) => {
		const index = Array.from(files.current.files).findIndex(
			(file) => file.name === name
		);
		if (index > -1) {
			files.current.items.remove(index);
			previews.current = previews.current.filter((file) => file !== name);
			onChange(files.current.files);
		}
		if (files.current.files.length === 0) onChange(null);

		setLength(files.current.files.length);
	};

	const handleClickAddFiles = () => {
		inputFile.current?.click();
	};

	return (
		<div className={className}>
			<input
				ref={inputFile}
				type="file"
				onChange={handleFileChange}
				className="hidden"
				accept={accept}
				multiple
				// webkitdirectory="true"
			/>
			<ScrollArea className="h-72 w-full rounded-md border">
				<div className="p-4">
					{Array.from(files.current.files).map((file) => (
						<div key={file.name}>
							<div className="flex overflow-hidden relative items-center justify-between gap-2 p-2 group">
								<p className="flex gap-2 text-muted-foreground text-xs">
									<IconFile fileName={file.name} />
									{file.name}
								</p>
								<Button
									onClick={() => handleRemoveFile(file.name)}
									variant="destructive"
									className="absolute right-2 top-auto transition-opacity opacity-0 group-hover:opacity-100 size-6 rounded-full border shadow-md"
									size="icon"
									type="button"
								>
									<X className="size-4" />
								</Button>
							</div>
							<Separator className="my-2" />
						</div>
					))}
				</div>
			</ScrollArea>
			{showAdder && (
				<div
					onClick={handleClickAddFiles}
					className={cn(
						"grid content-center h-10 w-full aspect-square rounded-md border border-muted-foreground border-dashed cursor-pointer mt-2",
						length === 0 ? "col-span-2" : "animate-fade-in",
						disable && "pointer-events-none opacity-50 cursor-not-allowed"
					)}
				>
					<span className="text-center text-sm text-muted-foreground">
						<Plus className="size-4 inline" /> Agregar
					</span>
				</div>
			)}
			<p className="text-center text-muted-foreground text-sm mt-1">
				{length} Archivo{length === 1 ? "" : "s"} cargado
				{length === 1 ? "" : "s"}
			</p>
		</div>
	);
}
