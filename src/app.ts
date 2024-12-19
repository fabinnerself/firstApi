import express, { Request, Response } from "express"
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json())

function calcularIMC(peso:number, altura:number): number {
    const alturaM: number = altura/100;
    const imc: number = peso/(alturaM*alturaM)
    return imc    
}

function valorarIMC(imc:number):string {
     if(imc <=18.5)
        return "Bajo peso"

     if(imc >18.5 && imc<25)
        return "Peso normal"

     if(imc >=25 && imc<30)
        return "Sobrepeso"

     if(imc >=30 && imc<35)
        return "Obesidad grado 1"

     if(imc >=35 && imc<40)
        return "Obesidad grado 2"

     if(imc >=40 )
        return "Obesidad grado 3"
    else
        return "otro imc"    
}

app.get("/",(req:Request,rest:Response)=> {
    rest.send("Hola mundo api!");
}) 

app.post("/imc",(req:Request,rest:Response)=> {
    
    const peso:number = req.body.pesoKilogramos;
    const altura:number = req.body.estaturaMetros;
    const imc : number = calcularIMC(peso,altura)
    const rango :string = valorarIMC(imc)

    req.body.imc= parseFloat(imc.toFixed(3));
    req.body.rango= rango;
    console.log(req.body)
    
    rest.json(req.body)
})

const port = 3000;

app.listen(port, () => {
    console.log(`Escuchando puerto ${port}`)
})

export default app;
