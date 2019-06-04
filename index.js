const {cursos} = require('./listadoCursos');
var numeral = require('numeral');
var fs = require('fs');
var yargs = require('yargs');
var express = require('express');
var app = express();

const opciones = {
    'id':{
        alias:'i',
        describe:'Id del curso a inscribir',
        demand: true
    },
    'nombre':{
        alias:'n',
        describe:'Nombre del interesado',
        demand: true
    },
    'cedula':{
        alias:'c',
        describe:'Cedula del interesado',
        demand: true
    }
}

const argv = yargs.command('inscribir', 'Realizar inscripcion a un curso', opciones).argv

if(argv._.find(comando => comando == 'inscribir')){
    let nombre = argv.nombre;
    let cedula = argv.cedula;
    let id = argv.id;
    realizarInscripcion(id, nombre, cedula);

    app.use(express.static(__dirname + '/public'))
    app.listen(3000);
}else{
    imprimirCursos(cursos);
}

function imprimirCurso(curso){
    console.log('-------------------------------------------');
    console.log(`Nombre: ${curso.nombre}`);
    console.log(`Id: ${curso.id}`);
    console.log(`Duracion: ${curso.duracion} dias`);
    console.log(`Valor: ${numeral(curso.valor).format('$0,0.00')}`);
    console.log('-------------------------------------------');
}

function imprimirCursos(arregloCursos){
    let intervalo = 0;
    arregloCursos.forEach(curso => {
        setTimeout(function(){
            imprimirCurso(curso);
        }, intervalo);
        intervalo += 2000;
    });
}

function realizarInscripcion(id, nombre, cedula){
    console.log();
    let curso = cursos.find(curso => curso.id == id);
        
    if(curso == null){
        console.log('El curso especificado no existe');
        return;
    }

    imprimirCurso(curso);

    let interesado = {
        nombre: nombre,
        cedula: cedula
    };

    guardarArchivo(curso, interesado);
}

function guardarArchivo(curso, interesado){
    let data = '<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8">'
    data += '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
    data += '<meta http-equiv="X-UA-Compatible" content="ie=edge">'
    data += '<title>Bienvenido</title></head><body>'
    data += '<h1>Constancia de inscripcion</h1>';
    data += '<h2>Interesado:</h2>';
    data += '<hr>';
    data += '<p>';
    data += '<ul>';
    data += `<li><b>Nombre:</b> ${interesado.nombre}</li>`;
    data += `<li><b>Cedula:</b> ${interesado.cedula}</li>`;
    data += '</ul>';
    data += '</p>';
    data += '<h2>Detalles del curso:</h2>';
    data += '<hr>';
    data += '<p>';
    data += '<ul>';
    data += `<li><b>Nombre:</b> ${curso.nombre}</li>`;
    data += `<li><b>Id:</b> ${curso.id}</li>`;
    data += `<li><b>Duracion:</b> ${curso.duracion}</li>`;
    data += `<li><b>Valor:</b> ${numeral(curso.valor).format('$0,0.00')}</li>`;
    data += '</ul>';
    data += '</p>';
    data += '</body></html>';

    let nombreArchivo = `${interesado.nombre}${curso.nombre}.html`;
    nombreArchivo = nombreArchivo.replace(/ /g, "");
    fs.writeFile('public/'+nombreArchivo, data, (err)=>{
        if(err){
            console.log('Ha ocurrido un error al escribir el archivo');
            console.log(err);
        }else{
            console.log(`Se ha guardado su comprobante en el archivo "${nombreArchivo}"`);
            console.log(`Puede verificarlo en http://localhost:3000/${nombreArchivo}`);
        }
    })
}