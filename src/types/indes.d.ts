interface Identificacion {
	version?: number | null;
	ambiente?: string | null;
	tipoDte?: string | null;
	numeroControl?: string | null;
	codigoGeneracion?: string | null;
	tipoModelo?: number | null;
	tipoOperacion?: number | null;
	tipoContingencia?: string | null;
	motivoContin?: string | null;
	fecEmi?: string | null;
	horEmi?: string | null;
	tipoMoneda?: string | null;
}

interface Direccion {
	departamento?: string | null;
	municipio?: string | null;
	complemento?: string | null;
}

interface Emisor {
	nit?: string | null;
	nrc?: string | null;
	nombre?: string | null;
	codActividad?: string | null;
	descActividad?: string | null;
	nombreComercial?: string | null;
	tipoEstablecimiento?: string | null;
	direccion?: Direccion | null;
	telefono?: string | null;
	correo?: string | null;
	codEstableMH?: string | null;
	codEstable?: string | null;
	codPuntoVentaMH?: string | null;
	codPuntoVenta?: string | null;
}

interface Receptor {
	nit?: string | null;
	nrc?: string | null;
	nombre?: string | null;
	codActividad?: string | null;
	descActividad?: string | null;
	nombreComercial?: string | null;
	direccion?: Direccion | null;
	telefono?: string | null;
	correo?: string | null;
}

interface CuerpoDocumento {
	numItem?: number | null;
	tipoItem?: number | null;
	cantidad?: number | null;
	codigo?: string | null;
	uniMedida?: number | null;
	descripcion?: string | null;
	precioUni?: number | null;
	montoDescu?: number | null;
	ventaNoSuj?: number | null;
	ventaExenta?: number | null;
	ventaGravada?: number | null;
	noGravado?: number | null;
	tributos?: string[] | null;
	psv?: number | null;
}

interface Tributo {
	codigo?: string | null;
	descripcion?: string | null;
	valor?: number | null;
}

interface Pago {
	codigo?: string | null;
	montoPago?: number | null;
	referencia?: string | null;
	plazo?: string | null;
	periodo?: string | null;
}

interface Resumen {
	totalNoSuj?: number | null;
	totalExenta?: number | null;
	totalGravada?: number | null;
	subTotalVentas?: number | null;
	descuNoSuj?: number | null;
	descuExenta?: number | null;
	descuGravada?: number | null;
	porcentajeDescuento?: number | null;
	totalDescu?: number | null;
	tributos?: Tributo[] | null;
	subTotal?: number | null;
	ivaPerci1?: number | null;
	ivaRete1?: number | null;
	reteRenta?: number | null;
	montoTotalOperacion?: number | null;
	totalNoGravado?: number | null;
	totalPagar?: number | null;
	totalLetras?: string | null;
	saldoFavor?: number | null;
	condicionOperacion?: number | null;
	pagos?: Pago[] | null;
	numPagoElectronico?: string | null;
}

interface Extension {
	nombEntrega?: string | null;
	docuEntrega?: string | null;
	nombRecibe?: string | null;
	docuRecibe?: string | null;
	observaciones?: string | null;
	placaVehiculo?: string | null;
}

interface Apendice {
	campo?: string | null;
	etiqueta?: string | null; // puede haber una que contiene la palabra sello
	valor?: string | null;
}

interface ResponseMH {
	version?: number | null;
	ambiente?: string | null;
	versionApp?: number | null;
	estado?: string | null;
	codigoGeneracion?: string | null;
	numeroControl?: string | null;
	selloRecibido?: string | null;
	fhProcesamiento?: string | null;
	clasificaMsg?: string | null;
	codigoMsg?: string | null;
	descripcionMsg?: string | null;
	observaciones?: string[] | null;
}

interface DTE {
	identificacion?: Identificacion | null;
	documentoRelacionado?: string | null;
	emisor?: Emisor | null;
	receptor?: Receptor | null;
	ventaTercero?: string | null;
	cuerpoDocumento?: CuerpoDocumento[] | null;
	resumen?: Resumen | null;
	extension?: Extension | null;
	apendice?: Apendice[] | null;
	responseMH?: ResponseMH | null;
	codigoEmpresa?: string | null;
	token?: string | null;
	digital?: string | null;
	codeQR?: string | null;
	//selloRecibido || SelloRecepcion
}
