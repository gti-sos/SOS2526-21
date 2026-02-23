let cholera_stats = [

    fila1={
        country: "afganistan", 
        year: 2016,
        number_of_reported_cases_of_cholera: 677,
        number_of_reported_deaths_from_cholera: 5,
        cholera_case_fatality_rate: 0.7,
        region: "eastern mediterranean"
    },

    fila2={
        country: "afganistan", 
        year: 2015,
        number_of_reported_cases_of_cholera: 58064,
        number_of_reported_deaths_from_cholera: 8,
        cholera_case_fatality_rate: 0.01,
        region: "eastern mediterranean"
    },

    fila3={
        country: "afganistan", 
        year: 2014,
        number_of_reported_cases_of_cholera: 45481,
        number_of_reported_deaths_from_cholera: 4,
        cholera_case_fatality_rate: 0.0,
        region: "eastern mediterranean"
    },

    fila4={
        country: "afganistan", 
        year: 2013,
        number_of_reported_cases_of_cholera: 3957,
        number_of_reported_deaths_from_cholera: 14,
        cholera_case_fatality_rate: 0.35,
        region: "eastern mediterranean"
    },

    fila5={
        country: "afganistan", 
        year: 2012,
        number_of_reported_cases_of_cholera: 12,
        number_of_reported_deaths_from_cholera: 0,
        cholera_case_fatality_rate: 0.1,
        region: "eastern mediterranean"
    },

    fila6={
        country: "afganistan", 
        year: 2011,
        number_of_reported_cases_of_cholera: 3733,
        number_of_reported_deaths_from_cholera: 44,
        cholera_case_fatality_rate: 1.18,
        region: "eastern mediterranean"
    },

    fila7={
        country: "afganistan", 
        year: 2010,
        number_of_reported_cases_of_cholera: 2369,
        number_of_reported_deaths_from_cholera: 10,
        cholera_case_fatality_rate: 0.42,
        region: "eastern mediterranean"
    },

    fila8={
        country: "afganistan", 
        year: 2009,
        number_of_reported_cases_of_cholera: 662,
        number_of_reported_deaths_from_cholera: 11,
        cholera_case_fatality_rate: 1.66,
        region: "eastern mediterranean"
    },

    fila9={
        country: "afganistan", 
        year: 2008,
        number_of_reported_cases_of_cholera: 4384,
        number_of_reported_deaths_from_cholera: 22,
        cholera_case_fatality_rate: 0.5,
        region: "eastern mediterranean"
    },

    fila10={
        country: "afganistan", 
        year: 2005,
        number_of_reported_cases_of_cholera: 33,
        number_of_reported_deaths_from_cholera: 0,
        cholera_case_fatality_rate: 0.0,
        region: "eastern mediterranean"
    }


];


/*Tener un archivo llamado “index-YYY.js” en el repositorio SOS2526-XX que contenga 
el código de una aplicación en nodejs (similar a lo que se vió en el L03) que realice 
el siguiente algoritmo (siendo YYY las siglas del alumno): 
-Inicializa un array con los datos de ejemplo pestaña individual de la ficha de trabajo.
-Realice un algoritmo usando iteradores (forEach, Map, filter, …) que permita calcular 
la media de valores de alguna de los campos numéricos del subconjunto de filas que 
comparten un determinado valor en el campo de información geográfica.
Al hacer “node index-YYY.js” se muestra el resultado del cálculo.
 */


function media_muertes_colera_pais_despues_del_año(pais, año){
    let filtrado = cholera_stats.filter(fila => fila.country === pais && fila.year > año);
    
    let suma_muertes = filtrado.map(fila => fila.number_of_reported_deaths_from_cholera)
                        .reduce((a, n) => {return a+n}, 0);

    return filtrado.length === 0? 0 : suma_muertes / filtrado.length;
    };

console.log(media_muertes_colera_pais_despues_del_año("afganistan", 2009));