 let array=[

 object1 = {entity:"bolivia",code:"bol",year:2020,christian:95.70631,jews:0.034531184,muslim:0.008412181,hindu:0.003325746,buddhist:0.017019995,other:0.2421076,no_religion:3.9882944},

 object2 = {entity:"afghanistan",code:"afg",year:2010,christian:0.10022439,jews:0.000106422,muslim:99.74918,hindu:0.00035474,buddhist:0.01998632,other:0.121494696,no_religion:0.00865241},

 object3 = {entity:"afghanistan",code:"afg",year:2020,christian:0.019379199,jews:0.0000256593,muslim:99.86197,hindu:0.000128296,buddhist:0.020000853,other:0.09004255,no_religion:0.008456565},

 object4 = {entity:"africa",code:"owid_afr",year:2010,christian:50.044273,jews:0.008155441,muslim:44.846317,hindu:0.1253172,buddhist:0.007438888,other:2.43861,no_religion:2.529368},

 object5 = {entity:"africa",code:"owid_afr",year:2020,christian:50.922043,jews:0.0040311515,muslim:44.76618,hindu:0.10642564,buddhist:0.006977514,other:2.0160115,no_religion:2.1779282},

 object6 = {entity:"albania",code:"alb",year:2010,christian:20.28347,jews:0.009593685,muslim:70.1529,hindu:0,buddhist:0,other:0.016603233,no_religion:9.537429},

 object7 = {entity:"albania",code:"alb",year:2020,christian:17.815659,jews:0.010049576,muslim:74.507225,hindu:0.000707935,buddhist:0.000158218,other:0.013315931,no_religion:7.6528873},

 object8 = {entity:"algeria",code:"dza",year:2010,christian:0.2906793,jews:0.000151956,muslim:98.57146,hindu:0,buddhist:0.014109504,other:0.038876127,no_religion:1.0847238},

 object9 = {entity:"algeria",code:"dza",year:2020,christian:0.29498956,jews:0.000129986,muslim:98.38235,hindu:0,buddhist:0.015000784,other:0.04132855,no_religion:1.2662071},

 object10 = {entity:"angola",code:"ago",year:2010,christian:91.57468,jews:0.002140027,muslim:0.1669055,hindu:0.013696176,buddhist:0.00385205,other:3.7618802,no_religion:4.47685}];
//-----------------------------------

let media=array.filter((object)=>object.entity="africa").map((object)=>object.jews).reduce((a,b,i,arr)=>(a+b)/arr.length);

console.log(media);


