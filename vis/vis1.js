const colorPalette = [
    "#fd7f6f",
    "#7eb0d5",
    "#b2e061",
    "#bd7ebe",
    "#ffb55a",
    "#ffee65",
    "#beb9db",
    "#fdcce5",
    "#8bd3c7",
    "#c9c9c9",
];

const MARGIN = {
    top: 50,
    bottom: 130,
    right: 20,
    left: 56,
};

// Constantes para no andar hardcodeando por la vida (copy gus)
const SVG1_WIDTH = 900;
const SVG1_HEIGHT = 600;

const SVG1 = d3.select("#vis-1").append("svg");
//width height
SVG1.attr("width", SVG1_WIDTH).attr("height", SVG1_HEIGHT)

const HEIGHTVIS = SVG1_HEIGHT - MARGIN.top - MARGIN.bottom;
const WIDTHVIS = SVG1_WIDTH - MARGIN.right - MARGIN.left;

// Function para leer el json
function leer(){
    d3.json("./nuevodataset.json")
        .then((datos) => {
            console.log(datos);
            console.log("Cantidad de objetos en el dataset:", Object.keys(datos).length);
            CreateBarChart(datos);     
        })
        .catch((error) => console.log(error))}

function bucle(num){
    if (num > 1){
        return num - 1
    } else {
        return 103
    }}

function bucle2(num){
    if (num > 0){
        return num - 1
    } else {
        return 10
    }
}

// =============================================================================
// ============================= PRIMERA VISUALIZACION =========================
// =============================================================================

const barras = SVG1.append("g")
                    .attr("id", "barras");

function CreateBarChart(dataset) {

    // Obtenemos los valores de cada objeto
    const datasetValues = Object.values(dataset);

    // Esto fue usado para obtener el juego mas viejo del dataset.
    // Como resultado tenemos que es call of duty black ops del 2012, dejando
    // El largo de la lista de fechas como 103
    const objWithLongestList = datasetValues.reduce((prev, current) => {
        if (current.history.length > prev.history.length) {
          return current;
        } else {
          return prev;
        }
      });
    // Dado la forma en la que está hecha el dataset, necesitamos hacer un map
    // Para obtener el valor mas alto de avg players, por lo que necesitamos hacer un mapeo plano
    // Para juntar todos los avg_players que existen en un solo array
    const allAvgPlayers = datasetValues.flatMap(d => d.history.map(h => h.avg_players));
    // Ahora extent
    const extentAvgPlayers = d3.extent(allAvgPlayers);
    // Guardamos el maximo y minimo para AvgPlayers en total
    const maxAvgPlayers = extentAvgPlayers[1];
    // Hacemos las escalas totales
    //////////////////// ESCALA Y ///////////////////
    const escalaAvgPlayers = d3
    .scaleLog()
    .domain([10, maxAvgPlayers + 4000])
    .range([HEIGHTVIS, 0])
    .nice();
   //////////////////// EJE Y //////////////////////
   const ejeY = d3.axisLeft(escalaAvgPlayers).ticks(6);
   //////////////////// ESCALA Y ///////////////////
   SVG1.append("text").text("Popularidad (jugadores por mes)").attr("x",30).attr("y",30);
   SVG1
   .append("g")
   .attr("id", "left_bar")
   .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)
   .call(ejeY)
   .selectAll("line")
   .attr("opacity", 1)
   .attr("x1", WIDTHVIS)
   .attr("stroke-dasharray", 5)
   .attr("opacity", 1);
   //////////////////// ESCALA X ///////////////////
   const escalaX = d3
   .scaleBand()
   .domain([])
   .range([0, WIDTHVIS]);
   ///////////////////// EJE X /////////////////////
   const ejeX = d3.axisBottom(escalaX);
   //////////////////// ESCALA X ///////////////////
   SVG1.append("text").text("Top 10 Juegos por mes:").attr("x",400).attr("y",590);
   SVG1
   .append("g")
   .attr("id", "ejex")
   .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)
   .call(ejeX)
   .selectAll("line")
   .attr("opacity", 1)
   //////////////////////////// TEXTO /////////////////////////////////
   SVG1
   .append("text")
   .attr("id", "texto")
   .text("").attr("x",570).attr("y",590);
   /////////////////////////////////////////////////////////////////////
    // Para incializar el join: quizas poner botones
    let num = 104
    let randomColor
    // d3-Intervalo: Iniciar el temporizador
    d3.interval( () => {
        // Bucle que cambia los meses (103 es el mes mas viejo)
        num = bucle(num)
        let color = 10 // 10 colores

        // Sort
        datasetValues.sort((a, b) => {
            let avgPlayersA = a.history[num]?.avg_players || 0;
            let avgPlayersB = b.history[num]?.avg_players || 0;
            return avgPlayersB - avgPlayersA;
          });

        // Tomar los primeros 10 elementos del array (top 10)
        const top10Games = datasetValues.slice(0, 10);
        // TEXTOS
        d3.select("#texto").text(`${top10Games[0].history[num].year}: ${top10Games[0].history[num].month}`)
        // Tenemos que obligatoriamente, obtener la escala, pues no se puede/debe actualizar
        // Durante el enter, despues se usará en el join para cada juego:
        //Contrary to ordinal scales, a band scale’s domain must be defined in full beforehand, 
        //and cannot be constructed iteratively.
        escalaX.domain(top10Games.map(d => d.name));
        const ejeX = d3.axisBottom(escalaX);
        d3.select("#ejex").call(ejeX)
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("dy", "-0.5em");

        // Hacer el join con ese top 10
      barras
      .selectAll(".games")
      .data(top10Games, d => d.name)
      .join(
      // Elementos de entrada
      enter => {
        enter
          .append("rect")
          .attr("class","games")
          .attr("y", d => MARGIN.top + escalaAvgPlayers(d.history[num].avg_players))
          .attr("height", d => HEIGHTVIS - escalaAvgPlayers(d.history[num].avg_players))
          .attr("width", 40)
          //OCURRE ALGO EXTRAÑO CON LOS COLORES
          .attr("fill", () => {randomColor = Math.floor(Math.random()*16777215).toString(16); return "#" + randomColor})
          .attr("opacity", 0)
          .attr("x", d => escalaX(d.name) + escalaX.bandwidth() / 10 + MARGIN.left + 10)
          .transition() // Agregar la transición
          .duration(500)
          .attr("opacity", 1)
      },
      // Elementos de actualización
      update => {
        update
          .transition() // Agregar la transición
          .duration(1000)
          .attr("y", d => MARGIN.top + escalaAvgPlayers(d.history[num].avg_players))
          .attr("height", d => HEIGHTVIS - escalaAvgPlayers(d.history[num].avg_players))
          .attr("x", d => escalaX(d.name) + escalaX.bandwidth() / 10 + MARGIN.left + 10)
          //OCURRE ALGO EXTRAÑO CON LOS COLORES

          //.attr("fill", () => {color = bucle2(color); return colorPalette[color]})
    },
    // Elementos de salida
    exit => {
      exit
        .transition() // Agregar la transición
        .duration(500)
        .attr("opacity", 0)
        .remove();
    }
  )
    },2000)
};
// testing
leer();

