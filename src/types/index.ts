export type MetricSystem = 'metros-kg' | 'metros-libras' | 'pulgadas-kg' | 'pulgadas-libras' | 'pies-kg' | 'pies-libras';

export type Gender = 'masculino' | 'femenino' | 'otro';

export interface BMIFormData {
  nombre: string;
  sexo: Gender;
  edad: number;
  sistemaMetricoOriginal: MetricSystem;
  estaturaOriginal: number;
  pesoOriginal: number;
  estaturaMetros: number;
  pesoKilogramos: number;
}

export interface BMIResponse {
  nombre: string;
  sexo: Gender;
  edad: number;
  sistemaMetricoOriginal: MetricSystem;
  estaturaOriginal: number;
  imc: number;
  rango: string;
}