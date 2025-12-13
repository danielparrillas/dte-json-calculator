interface Identificacion {
	version?: number | null;
	ambiente?: string | null;
	tipoDte?: string | null;
	numeroControl?: string | null;
	codigoGeneracion?: string | null;
	tipoModelo?: number | null;
	tipoOperacion?: number | null;
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
	telefono?: string | null;
	correo?: string | null;
	direccion?: Direccion | null;
	codigoMH?: string | null;
	codigo?: string | null;
	puntoVentaMH?: string | null;
	puntoVentaContri?: string | null;
}

interface Receptor {
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
	codigoMH?: string | null;
	puntoVentaMH?: string | null;
}

/**
 * CuerpoDocumento para DTE 09 (Liquidación)
 */
interface CuerpoDocumento {
	periodoLiquidacionFechaInicio?: string | null;
	periodoLiquidacionFechaFin?: string | null;
	valorOperaciones?: number | null;
	codLiquidacion?: string | null;
	cantidadDoc?: number | null;
	descripSinPercepcion?: string | null;
	subTotal?: number | null;
	iva?: number | null;
	montoSujetoPercepcion?: number | null;
	ivaPercibido?: number | null;
	comision?: number | null;
	porcentComision?: number | null;
	ivaComision?: number | null;
	liquidoApagar?: number | null;
	montoSinPercepcion?: number | null;
	totalLetras?: string | null;
	observaciones?: string | null;
}

interface Extension {
	nombEntrega?: string | null;
	docuEntrega?: string | null;
	codEmpleado?: string | null;
}

interface DTE {
	identificacion?: Identificacion | null;
	emisor?: Emisor | null;
	receptor?: Receptor | null;
	cuerpoDocumento?: CuerpoDocumento | null;
	extension?: Extension | null;
	apendice?: null;
	selloRecibido?: string | null;
	firmaElectronica?: string | null;
}
