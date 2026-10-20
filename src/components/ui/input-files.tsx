import { useEffect, useRef, useState } from "react";
import { Button } from "./button";
import { Plus, Upload, X } from "lucide-react";
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
	allowDropWhenDisabled?: boolean;
};

type FileNames = string[];

const matchesAccept = (file: File, accept?: string) => {
	if (!accept) return true;
	const name = file.name.toLowerCase();
	const type = file.type.toLowerCase();
	return accept
		.split(",")
		.map((rule) => rule.trim().toLowerCase())
		.some((rule) => {
			if (rule.startsWith(".")) return name.endsWith(rule);
			if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
			return type === rule;
		});
};

const hasFiles = (e: DragEvent) =>
	Array.from(e.dataTransfer?.types ?? []).includes("Files");

export default function InputFiles({
	maxFiles,
	onChange,
	className,
	onDuplicateUpload,
	onMaxUpload,
	accept,
	disable,
	allowDropWhenDisabled,
}: Props) {
	const files = useRef<DataTransfer>(new DataTransfer());
	const inputFile = useRef<HTMLInputElement>(null);
	const previews = useRef<FileNames>([]);
	const [length, setLength] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const dragCounter = useRef(0);
	const handleDropRef = useRef<(droppedFiles: FileList) => void>(() => {});

	const showAdder = !maxFiles || length < maxFiles;
	const canDrop = !disable || allowDropWhenDisabled;

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

	handleDropRef.current = (droppedFiles) => {
		if (!canDrop) return;
		const transfer = new DataTransfer();
		for (const file of droppedFiles) {
			if (matchesAccept(file, accept)) transfer.items.add(file);
		}
		if (transfer.files.length === 0) return;
		addFilesToFileList(transfer.files, files.current);
		onChange(files.current.files);
	};

	useEffect(() => {
		const handleDragEnter = (e: DragEvent) => {
			if (!hasFiles(e)) return;
			e.preventDefault();
			dragCounter.current++;
			setIsDragging(true);
		};
		const handleDragOver = (e: DragEvent) => {
			if (!hasFiles(e)) return;
			e.preventDefault();
		};
		const handleDragLeave = (e: DragEvent) => {
			if (!hasFiles(e)) return;
			dragCounter.current = Math.max(0, dragCounter.current - 1);
			if (dragCounter.current === 0) setIsDragging(false);
		};
		const handleDrop = (e: DragEvent) => {
			if (!hasFiles(e)) return;
			e.preventDefault();
			dragCounter.current = 0;
			setIsDragging(false);
			if (e.dataTransfer?.files) handleDropRef.current(e.dataTransfer.files);
		};

		window.addEventListener("dragenter", handleDragEnter);
		window.addEventListener("dragover", handleDragOver);
		window.addEventListener("dragleave", handleDragLeave);
		window.addEventListener("drop", handleDrop);
		return () => {
			window.removeEventListener("dragenter", handleDragEnter);
			window.removeEventListener("dragover", handleDragOver);
			window.removeEventListener("dragleave", handleDragLeave);
			window.removeEventListener("drop", handleDrop);
		};
	}, []);

	const handleClickAddFiles = () => {
		inputFile.current?.click();
	};

	return (
		<div className={className}>
			{isDragging && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm pointer-events-none">
					<div className="flex flex-col items-center gap-2 rounded-lg border-2 border-dashed border-muted-foreground p-12 text-muted-foreground">
						<Upload className="size-10" />
						<p className="text-lg font-medium">
							{canDrop
								? "Suelta los archivos para cargarlos"
								: "Primero selecciona un formato de DTE"}
						</p>
					</div>
				</div>
			)}
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
						<Plus className="size-4 inline" /> Agregar o arrastra archivos aquí
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
