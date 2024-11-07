import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	useReactTable,
	getSortedRowModel,
	getPaginationRowModel,
	ColumnFiltersState,
	getFilteredRowModel,
	VisibilityState,
	Table as TableType,
	OnChangeFn,
} from "@tanstack/react-table";
import { Input } from "@/components/ui/input";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Column } from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableFooter,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Button } from "./button";
import { ReactNode, useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import {
	ArrowDown,
	ArrowLeftToLine,
	ArrowRightToLine,
	ArrowUp,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
	Columns,
	Download,
	EyeOff,
	MoreVertical,
} from "lucide-react";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./select";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Separator } from "./separator";
import * as XLSX from "xlsx";
import { ScrollArea } from "./scroll-area";

interface DataTableColumnHeaderProps<TData, TValue>
	extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>;
	children?: ReactNode;
	canFilter?: boolean;
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	children,
	title, // Deprecado, no se recomienda su uso
	canFilter = true,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	// Advertencia de deprecación para el uso de 'title'
	if (title) {
		console.warn(
			'El prop "title" está deprecado se recomienda usar el prop "children" en su lugar. Para definir el título de la columna se recomienda usar la propiedad "meta.title" en la definición de la columna.'
		);
	}
	const meta = column.columnDef.meta as { title: string; hideText: boolean };
	const titleContent = children || meta?.title || title || column.id;

	if (!column.getCanSort()) {
		return <div className={cn(className)}>{titleContent}</div>;
	}

	const highlighted = column.getIsFiltered() || column.getIsSorted();
	return (
		<div className={cn("flex items-center space-x-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={highlighted ? "secondary" : "ghost"}
						size="sm"
						className="w-full flex justify-between -ml-3 h-8 data-[state=open]:bg-accent group"
					>
						<div className={highlighted ? "font-bold" : ""}>{titleContent}</div>

						{column.getIsSorted() === "desc" ? (
							<ArrowDown className="ml-2 size-4" />
						) : column.getIsSorted() === "asc" ? (
							<ArrowUp className="ml-2 size-4" />
						) : (
							<MoreVertical className="ml-2 size-4 transition-opacity opacity-0 group-hover:opacity-100" />
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent align="start" className="grid gap-1 w-48 p-2">
					{canFilter && (
						<>
							<Input
								placeholder={`Filter ${column.id}...`}
								value={(column?.getFilterValue() as string) ?? ""}
								onChange={(event) => column?.setFilterValue(event.target.value)}
							/>
							<Separator />
						</>
					)}
					<Button
						size="sm"
						variant={column.getIsSorted() === false ? "secondary" : "ghost"}
						className="flex justify-start"
						onClick={() => column.clearSorting()}
					>
						<ArrowUpDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Default
					</Button>
					<Button
						size="sm"
						variant={column.getIsSorted() === "asc" ? "secondary" : "ghost"}
						className="flex justify-start"
						onClick={() => column.toggleSorting(false)}
					>
						<ArrowUp className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Asc
					</Button>
					<Button
						size="sm"
						variant={column.getIsSorted() === "desc" ? "secondary" : "ghost"}
						className="flex justify-start"
						onClick={() => column.toggleSorting(true)}
					>
						<ArrowDown className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Desc
					</Button>
					<Separator />
					<Button
						size="sm"
						variant="ghost"
						className="flex justify-start"
						onClick={() => column.toggleVisibility(false)}
					>
						<EyeOff className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
						Hide
					</Button>
				</PopoverContent>
			</Popover>
		</div>
	);
}

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	filerBy?: string;
	noDataContent?: ReactNode;
	calcTotals?: ReactNode;
	headerContent?: ReactNode;
	canExport?: boolean;
	exportedFileName?: string;
	initialColumnVisibility?: VisibilityState;
	columnVisibilityValue?: VisibilityState;
	onColumnVisibilityChange?: OnChangeFn<VisibilityState>;
	hideViewOptions?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	filerBy,
	noDataContent,
	calcTotals = true,
	headerContent,
	data,
	canExport = true,
	exportedFileName,
	initialColumnVisibility = {},
	columnVisibilityValue,
	hideViewOptions,
	onColumnVisibilityChange,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		initialColumnVisibility
	);

	const resetColumnVisibility = () => {
		if (onColumnVisibilityChange)
			onColumnVisibilityChange(initialColumnVisibility);
		else setColumnVisibility(initialColumnVisibility);
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onSortingChange: setSorting,
		getSortedRowModel: getSortedRowModel(),
		onColumnFiltersChange: setColumnFilters,
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: onColumnVisibilityChange || setColumnVisibility,
		state: {
			sorting,
			columnFilters,
			columnVisibility: columnVisibilityValue || columnVisibility,
		},
	});

	return (
		<div>
			<div className="flex flex-wrap items-center gap-2 pb-4">
				{filerBy && (
					<div className="flex-grow">
						<Input
							placeholder={`Buscar por ${filerBy}`}
							value={
								(table.getColumn(filerBy)?.getFilterValue() as string) ?? ""
							}
							onChange={(event) =>
								table.getColumn(filerBy)?.setFilterValue(event.target.value)
							}
							className="max-w-sm mr-2"
						/>
					</div>
				)}
				{headerContent}
				{canExport && (
					<DataTableExport table={table} exportedFileName={exportedFileName} />
				)}
				{!hideViewOptions && (
					<DataTableViewOptions
						table={table}
						resetColumnVisibility={resetColumnVisibility}
					/>
				)}
			</div>

			<div className="rounded-md border bg-card">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
									className="group"
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id} className="py-1.5 text-nowrap">
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="p-0 text-center">
									{noDataContent || <div className="p-8">Sin datos.</div>}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
					{calcTotals && <DataTableTotal table={table} />}
				</Table>
			</div>
			<div className="h-2"></div>
			<DataTablePagination table={table} />
		</div>
	);
}

interface DataTableExportProps<TData> {
	table: TableType<TData>;
	exportedFileName?: string;
}
export function DataTableExport<TData>({
	table,
	exportedFileName,
}: DataTableExportProps<TData>) {
	const handleExport = () => {
		// Obtener los nombres de las columnas
		const columnNames = table
			.getAllColumns()
			.filter((column) => column.getIsVisible())
			.map((column) => {
				const meta = column.columnDef.meta as { title: string };
				return typeof meta?.title === "string" ? meta?.title : column.id;
			});

		// Obtener los datos de las filas filtradas
		const data = table
			.getFilteredRowModel()
			.rows.map((row) =>
				row.getVisibleCells().map((cell) => String(cell.getValue()))
			);
		// Incluir los nombres de las columnas como la primera fila
		const worksheetData = [columnNames, ...data];

		const workbook = XLSX.utils.book_new();
		const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
		XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes");
		XLSX.writeFile(
			workbook,
			`${exportedFileName || "export"} - ${new Date().toLocaleString()}.xlsx`,
			{
				compression: true,
			}
		);
	};
	return (
		<Button
			variant="outline"
			size="sm"
			className="ml-auto"
			onClick={handleExport}
		>
			<Download className="size-4" />
			<span className="hidden md:inline ml-2">Exportar</span>
		</Button>
	);
}

interface DataTablePaginationProps<TData> {
	table: TableType<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	return (
		<div className="flex items-center justify-between px-2">
			<div className="flex-1 text-sm text-muted-foreground hidden">
				{table.getFilteredSelectedRowModel().rows.length} de{" "}
				{table.getFilteredRowModel().rows.length} fila(s) seleccionadas.
			</div>
			<div className="flex items-center space-x-6 lg:space-x-8">
				<div className="flex items-center space-x-2">
					<p className="text-sm font-medium">Filas</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => {
							if (value === "Todas")
								table.setPageSize(table.getFilteredRowModel().rows.length);
							else table.setPageSize(Number(value));
						}}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 25, 50, 100, "Todas"].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="flex w-[100px] items-center justify-center text-sm font-medium">
					Pág {table.getState().pagination.pageIndex + 1} de{" "}
					{table.getPageCount()}
				</div>
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to first page</span>
						<ArrowLeftToLine className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">Go to previous page</span>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to next page</span>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">Go to last page</span>
						<ArrowRightToLine className="h-4 w-4" />
					</Button>
				</div>
				<p className="text-muted-foreground">
					Total de filas {table.getFilteredRowModel().rows.length}
				</p>
			</div>
		</div>
	);
}

interface DataTableViewOptionsProps<TData> {
	table: TableType<TData>;
	resetColumnVisibility: () => void;
}

export function DataTableViewOptions<TData>({
	table,
	resetColumnVisibility,
}: DataTableViewOptionsProps<TData>) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="outline" size="sm" className="ml-auto">
					<Columns className="mr-2 h-4 w-4" />
					Columnas
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[150px]">
				<DropdownMenuLabel>Visibilidad</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<ScrollArea className="h-[200px]">
					<DropdownMenuCheckboxItem onClick={resetColumnVisibility}>
						Por defecto
					</DropdownMenuCheckboxItem>
					<DropdownMenuCheckboxItem
						checked={table
							.getAllColumns()
							.every((column) => column.getIsVisible())}
						onCheckedChange={() => {
							table
								.getAllColumns()
								.forEach((column) => column.toggleVisibility(true));
						}}
					>
						Todas
					</DropdownMenuCheckboxItem>
					<DropdownMenuSeparator />
					{table
						.getAllColumns()
						.filter(
							(column) =>
								typeof column.accessorFn !== "undefined" && column.getCanHide()
						)
						.map((column) => {
							return (
								<DropdownMenuCheckboxItem
									key={column.id}
									className="capitalize"
									checked={column.getIsVisible()}
									onCheckedChange={(value) => column.toggleVisibility(!!value)}
								>
									{column.id}
								</DropdownMenuCheckboxItem>
							);
						})}
				</ScrollArea>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

interface DataTableTotalProps<TData> {
	table: TableType<TData>;
}

export function DataTableTotal<TData>({ table }: DataTableTotalProps<TData>) {
	const totalRow = useMemo(() => {
		const totals: Record<string, number> = {};
		table.getRowModel().rows.forEach((row) => {
			row.getVisibleCells().forEach((cell) => {
				if (typeof cell.getValue() === "number") {
					totals[cell.column.id] =
						(totals[cell.column.id] || 0) + Number(cell.getValue());
				}
			});
		});
		return totals;
	}, [
		table.getRowModel().rows.length,
		table.getState().pagination.pageIndex,
		table.getState().pagination.pageSize,
		table.getState().sorting,
		table.getIsSomeColumnsVisible(),
	]);
	return (
		<TableFooter>
			<TableRow>
				{table
					.getAllColumns()
					.filter((column) => column.getCanHide())
					.map((column) => {
						if (column.getIsVisible() === false) return null;
						return (
							<TableCell key={column.id}>
								{typeof totalRow[column.id] === "number"
									? totalRow[column.id]
									: null}
							</TableCell>
						);
					})}
			</TableRow>
		</TableFooter>
	);
}
