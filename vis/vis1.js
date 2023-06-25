const colorPalette = {
    "red": "#fd7f6f",
    "blue": "#7eb0d5",
    "green": "#b2e061",
    "purple": "#bd7ebe",
    "orange": "#ffb55a",
    "yellow": "#ffee65",
    "lavender": "#beb9db",
    "pink": "#fdcce5",
    "cyan": "#8bd3c7",
    "grey": "#c9c9c9",
};

const MARGIN = {
    top: 50,
    bottom: 60,
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
        return num + 104
    }
}

// =============================================================================
// ============================= PRIMERA VISUALIZACION =========================
// =============================================================================

const contenedor = SVG1

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
    const minAvgPlayers = extentAvgPlayers[0];
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
   .domain(["x","d"])
   .range([0, WIDTHVIS]);
   ///////////////////// EJE X /////////////////////
   const ejeX = d3.axisBottom(escalaX);
   //////////////////// ESCALA X ///////////////////
   SVG1.append("text").text("Top 10 Juegos por mes:").attr("x",400).attr("y",585);
   SVG1
   .append("g")
   .attr("transform", `translate(${MARGIN.left}, ${HEIGHTVIS + MARGIN.top})`)
   .call(ejeX)
   .selectAll("line")
   .attr("opacity", 1)
   ////////////////////////////////////////////////////////////////////////

    //metodo para encontrar el maximo avg_players pero para un mes en particular
    const maxAvgPlayers_month = d3.max(datasetValues, d => {
    if (d.history[103] !== undefined){
        return (d.history[103].avg_players)
    }});


    // Para incializar el join: quizas poner botones

    let num = bucle(104)

    // d3-Intervalo  
      // Iniciar el temporizador
    // d3.interval(
        
    //     ,1000)
};
// testing
leer();

