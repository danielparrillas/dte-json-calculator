interface Props {
	fileName: string;
	className?: string;
	defaultExtension?: boolean;
}

const icons: Record<string, string> = {
	doc: "/images/icons/doc-icon.svg",
	docx: "/images/icons/doc-icon.svg",
	pdf: "/images/icons/pdf-icon.svg",
	// xls: 'file-excel',
	// xlsx: 'file-excel',
	// ppt: 'file-powerpoint',
	// pptx: 'file-powerpoint',
	// jpg: 'file-image',
	// jpeg: 'file-image',
	// png: 'file-image',
	// gif: 'file-image',
	// zip: 'file-archive',
	// rar: 'file-archive',
	// txt: 'file-text',
	// csv: 'file-csv',
	// mp3: 'file-audio',
	// mp4: 'file-video',
	default: "file",
};
export default function IconFile({
	fileName,
	className = "w-4 h-4",
	defaultExtension,
}: Props) {
	const extension = fileName.split(".").pop() || "default";
	const icon = icons[extension];

	if (defaultExtension && !icon) {
		return <p className="font-bold">.{extension}</p>;
	}
	if (!icon) return null;
	return <img src={icon} alt={fileName} className={className} />;
}
