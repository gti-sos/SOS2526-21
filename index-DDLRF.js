

let myObject1 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1990",
    death_count_hiv_aids_under_5:"10",
    death_count_hiv_aids_70_plus:"1",
    death_count_hiv_aids_5_14:"0",
    death_count_hiv_aids_15_49:"15",
    death_count_hiv_aids_50_69:"7"
}
let myObject2 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1991",
    death_count_hiv_aids_under_5:"12",
    death_count_hiv_aids_70_plus:"1",
    death_count_hiv_aids_5_14:"0",
    death_count_hiv_aids_15_49:"19",
    death_count_hiv_aids_50_69:"8"
}
let myObject3 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1992",
    death_count_hiv_aids_under_5:"13",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"0",
    death_count_hiv_aids_15_49:"24",
    death_count_hiv_aids_50_69:"9"
}

let myObject4 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1993",
    death_count_hiv_aids_under_5:"16",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"1",
    death_count_hiv_aids_15_49:"28",
    death_count_hiv_aids_50_69:"10"
}
let myObject5 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1994",
    death_count_hiv_aids_under_5:"19",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"1",
    death_count_hiv_aids_15_49:"32",
    death_count_hiv_aids_50_69:"11"
}
let myObject6 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1995",
    death_count_hiv_aids_under_5:"22",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"1",
    death_count_hiv_aids_15_49:"35",
    death_count_hiv_aids_50_69:"11"
}
let myObject7 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1996",
    death_count_hiv_aids_under_5:"24",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"1",
    death_count_hiv_aids_15_49:"39",
    death_count_hiv_aids_50_69:"12"
}
let myObject8 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1997",
    death_count_hiv_aids_under_5:"26",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"1",
    death_count_hiv_aids_15_49:"43",
    death_count_hiv_aids_50_69:"12"
}
let myObject9 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1998",
    death_count_hiv_aids_under_5:"28",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"1",
    death_count_hiv_aids_15_49:"45",
    death_count_hiv_aids_50_69:"12"
}
let myObject10 = {
    country:"Afghanistan",
    codecountry:"AFG",
    year:"1999",
    death_count_hiv_aids_under_5:"29",
    death_count_hiv_aids_70_plus:"2",
    death_count_hiv_aids_5_14:"2",
    death_count_hiv_aids_15_49:"47",
    death_count_hiv_aids_50_69:"13"
}

ejemploDatos = [myObject1,myObject2,myObject3,myObject4,myObject5,myObject6,myObject7,myObject8,myObject9,myObject10];


function calcularMediaMenores14(datos, codigoPais) {
    return datos.filter((n) => (n.codecountry === codigoPais))
            .map(n => parseInt(n.death_count_hiv_aids_under_5) + parseInt(n.death_count_hiv_aids_5_14))
            .reduce((suma, valor, i, arr) => (suma + valor/arr.length), 0)
};

//console.log(calcularMediaMenores14(ejemploDatos, "AFG"));

module.exports = {ejemploDatos, calcularMediaMenores14}