import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import type { BMIFormData, BMIResponse, Gender, MetricSystem } from '../types';
import { convertToKilograms, convertToMeters, getUnitsFromSystem } from '../utils/conversions';

const METRIC_SYSTEMS: MetricSystem[] = [
  'metros-kg',
  'metros-libras',
  'pulgadas-kg',
  'pulgadas-libras',
  'pies-kg',
  'pies-libras',
];

const GENDERS: Gender[] = ['masculino', 'femenino', 'otro'];

export default function BMICalculator() {
  const [formData, setFormData] = useState({
    nombre: '',
    sexo: '' as Gender,
    edad: '',
    sistemaMetricoOriginal: '' as MetricSystem,
    estaturaOriginal: '',
    pesoOriginal: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [result, setResult] = useState<BMIResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nombre) newErrors.nombre = 'Debe ingresar el nombre';
    if (!formData.sexo) newErrors.sexo = 'Debe seleccionar el sexo';
    if (!formData.edad) newErrors.edad = 'Debe ingresar la edad';
    if (!formData.sistemaMetricoOriginal) newErrors.sistemaMetricoOriginal = 'Debe seleccionar el sistema métrico';
    if (!formData.estaturaOriginal) newErrors.estaturaOriginal = 'Debe ingresar la estatura';
    if (!formData.pesoOriginal) newErrors.pesoOriginal = 'Debe ingresar el peso';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const { heightUnit, weightUnit } = getUnitsFromSystem(formData.sistemaMetricoOriginal);
    
    const bmiData: BMIFormData = {
      ...formData,
      nombre:formData.nombre,
      sexo:formData.sexo,
      edad: Number(formData.edad),
      estaturaOriginal: Number(formData.estaturaOriginal),
      pesoOriginal: Number(formData.pesoOriginal),
      estaturaMetros: convertToMeters(Number(formData.estaturaOriginal), heightUnit),
      pesoKilogramos: convertToKilograms(Number(formData.pesoOriginal), weightUnit),
    };

    console.log(bmiData)

    try {
      setIsLoading(true);
      const response = await fetch('http://localhost:3000/imc', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
        },
        body: JSON.stringify(bmiData),
      });

      if (!response.ok) throw new Error('Error al calcular el IMC');

      const data: BMIResponse = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
      setErrors({ submit: 'Error al calcular el IMC. Por favor, intente nuevamente.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 ">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
          Calculadora de IMC
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.nombre && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.nombre}
              </p>
            )}
          </div>

          {/* Sexo */}
          <div>
            <label htmlFor="sexo" className="block text-sm font-medium text-gray-700">
              Sexo
            </label>
            <select
              id="sexo"
              name="sexo"
              value={formData.sexo}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Seleccione...</option>
              {GENDERS.map(gender => (
                <option key={gender} value={gender}>
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </option>
              ))}
            </select>
            {errors.sexo && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.sexo}
              </p>
            )}
          </div>

          {/* Edad */}
          <div>
            <label htmlFor="edad" className="block text-sm font-medium text-gray-700">
              Edad
            </label>
            <input
              type="number"
              id="edad"
              name="edad"
              value={formData.edad}
              onChange={handleInputChange}
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.edad && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.edad}
              </p>
            )}
          </div>

          {/* Sistema Métrico */}
          <div>
            <label htmlFor="sistemaMetricoOriginal" className="block text-sm font-medium text-gray-700">
              Sistema Métrico
            </label>
            <select
              id="sistemaMetricoOriginal"
              name="sistemaMetricoOriginal"
              value={formData.sistemaMetricoOriginal}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            >
              <option value="">Seleccione...</option>
              {METRIC_SYSTEMS.map(system => (
                <option key={system} value={system}>
                  {system.replace('-', ' / ')}
                </option>
              ))}
            </select>
            {errors.sistemaMetricoOriginal && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.sistemaMetricoOriginal}
              </p>
            )}
          </div>

          {/* Estatura */}
          <div>
            <label htmlFor="estaturaOriginal" className="block text-sm font-medium text-gray-700">
              Estatura
            </label>
            <input
              type="number"
              id="estaturaOriginal"
              name="estaturaOriginal"
              value={formData.estaturaOriginal}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.estaturaOriginal && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.estaturaOriginal}
              </p>
            )}
          </div>

          {/* Peso */}
          <div>
            <label htmlFor="pesoOriginal" className="block text-sm font-medium text-gray-700">
              Peso
            </label>
            <input
              type="number"
              id="pesoOriginal"
              name="pesoOriginal"
              value={formData.pesoOriginal}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            />
            {errors.pesoOriginal && (
              <p className="mt-1 text-sm text-red-600 flex items-center">
                <AlertCircle className="h-4 w-4 mr-1" />
                {errors.pesoOriginal}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Calculando...' : 'Calcular IMC'}
          </button>
        </form>

        {errors.submit && (
          <div className="mt-4 p-4 bg-red-50 rounded-md">
            <p className="text-sm text-red-600 flex items-center">
              <AlertCircle className="h-4 w-4 mr-1" />
              {errors.submit}
            </p>
          </div>
        )}

        {result && (
          <div className="mt-8 p-4 bg-green-50 rounded-md">
            <p className="text-sm text-green-800">
              {result.nombre} de sexo {result.sexo} con {result.edad} años de edad, 
              tiene un IMC de {result.imc.toFixed(1)} con nivel de peso {result.rango}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}