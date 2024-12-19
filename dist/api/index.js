"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// api/index.ts
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
function calcularIMC(peso, altura) {
    const alturaM = altura / 100;
    const imc = peso / (alturaM * alturaM);
    return imc;
}
function valorarIMC(imc) {
    if (imc <= 18.5)
        return "Bajo peso";
    if (imc > 18.5 && imc < 25)
        return "Peso normal";
    if (imc >= 25 && imc < 30)
        return "Sobrepeso";
    if (imc >= 30 && imc < 35)
        return "Obesidad grado 1";
    if (imc >= 35 && imc < 40)
        return "Obesidad grado 2";
    if (imc >= 40)
        return "Obesidad grado 3";
    return "otro imc";
}
app.get("/api", (req, res) => {
    res.send("Hola mundo api!");
});
app.get("/api/imc", (req, res) => {
    res.send("Hola mundo api get!");
});
app.post("/api/imc", (req, res) => {
    const peso = req.body.pesoKilogramos;
    const altura = req.body.estaturaMetros;
    const imc = calcularIMC(peso, altura);
    const rango = valorarIMC(imc);
    req.body.imc = parseFloat(imc.toFixed(3));
    req.body.rango = rango;
    console.log(req.body);
    res.json(req.body);
});
exports.default = app;
