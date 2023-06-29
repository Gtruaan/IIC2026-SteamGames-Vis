const colorPalette = {
    "Action": "#fa4d56", // Rojo
    "Strategy": "#4589ff", // Azul
    "Adventure": "#6fdc8c", // Verde
    "Massively Multiplayer": "#d2a106", // Amarillo
    "Indie": "#8a3ffc", // Morado 
    "RPG": "#ba4e00", // Naranjo
    "Early Access": "#d4bbff", // Lila
    "Free to Play": "#d4bbff", // Lila
    "Simulation": "#ff7eb6", // Rosado
    "Sports": "#007d79", // Turquesa oscuro
    "Casual": "#33b1ff", // Cian
    "Racing": "#08bdba", // Turquesa
    "Animation & Modeling": "#bae6ff", // Claro
    "Design & Illustration": "#bae6ff", // Claro
    "Utilities": "#bae6ff", // Claro
    "Video Production": "#bae6ff", // Claro
    "Audio Production": "#bae6ff", // Claro
    "Web Publishing": "#bae6ff", // Claro
};

const MARGIN1 = {
    top: 50,
    bottom: 150,
    right: 70,
    left: 56,
};

// Constantes para no andar hardcodeando por la vida (copy gus)
const SVG1_WIDTH = 900;
const SVG1_HEIGHT = 650;

const SVG1 = d3.select("#vis-1").append("svg");
//width height
SVG1.attr("width", SVG1_WIDTH).attr("height", SVG1_HEIGHT)

const HEIGHTVIS = SVG1_HEIGHT - MARGIN1.top - MARGIN1.bottom;
const WIDTHVIS = SVG1_WIDTH - MARGIN1.right - MARGIN1.left;

// Function para leer el json
function leer(){
    d3.json("data/dataset.json")
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


let hoverBar = () => {
    tooltip.body.style("opacity", 1);
}

let moveBar = (event, d) => {
    tooltip.body.style("left", event.pageX + 15 + "px")
                .style("top", event.pageY + 15 + "px");
    console.log(d);
    tooltip.text.html(`${d.name}<br><br>Género: ${d.genre.join(", ")}` + 
                      `<br><br>Reviews: ${d.reviews}<br>Precio: ${d.price}<br>`);
}
/*{
    "name": "Garry's Mod",
    "genre": "Indie,Simulation",
    "description": "Garry's Mod is a physics sandbox. There aren't any predefined aims or goals. We give you the tools and leave you to play.",
    "price": "$9.99",
    "mature_content": 0,
    "developer": "Facepunch Studios",
    "details": [
        "Single-player",
    ],
    "tags": [
        "Sandbox",
    ],
    "reviews": "Overwhelmingly Positive",
}*/

let leaveBar = () => {
    tooltip.body.style("opacity", 0);
}


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
    .domain([10, maxAvgPlayers + 4000]) // Quizas cambiar por 1000 o 10000 y poner 4 ticks
    .range([HEIGHTVIS, 0])
    .nice();
   //////////////////// EJE Y //////////////////////
   const ejeY = d3.axisLeft(escalaAvgPlayers).ticks(6); // Quizas cambiar ticks
   //////////////////// ESCALA Y ///////////////////
   SVG1.append("text").text("Popularidad (jugadores por mes)")
   .attr("x",30)
   .attr("y",30)
   .attr("font-weight", "bolder")
   .attr("font-size", 12);
   repEjeY = SVG1
   .append("g")
   .attr("id", "left_bar")
   .attr("transform", `translate(${MARGIN1.left}, ${MARGIN1.top})`)
   .call(ejeY);
   repEjeY.selectAll("line")
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
   SVG1.append("text").text("Top 10 Juegos por mes:")
   .attr("x",570)
   .attr("y",635)
   .attr("font-weight", "bolder").attr("font-size", 12);
   repEjeX = SVG1
   .append("g")
   .attr("id", "ejex")
   .attr("transform", `translate(${MARGIN1.left}, ${HEIGHTVIS + MARGIN1.top})`)
   .call(ejeX);
   repEjeX.selectAll("line")
   .attr("opacity", 1)
   /////////////////////////////// PRETTIFY ESCALAS ////////////////
   repEjeX.selectAll("path").attr("stroke-width", 2);
   repEjeX.selectAll("text").attr("font-weight", "bolder").attr("font-size", 12);
   repEjeY.selectAll("path").attr("stroke-width", 2);
   repEjeY.selectAll("text").attr("font-weight", "bolder").attr("font-size", 12);
   //////////////////////////// TEXTO /////////////////////////////////
   SVG1
   .append("text")
   .attr("id", "texto")
   .text("...").attr("x", 720)
   .attr("y", 635)
   .attr("font-weight", "bolder")
   .attr("font-size", 12);
   /////////////////////////////////////////////////////////////////////
    // Para incializar el join: quizas poner botones
    // Se puede parar con Timer stop solo es necesario hacer unos cambios

    // d3-Intervalo: Iniciar el temporizador
    let num = 104
    let randomColor
    const intervalo = d3.interval( () => {
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
        // console.log(top10Games[0].history[num].avg_players) // Para testear cosas
        // TEXTOS
        d3.select("#texto")
        .text(`${top10Games[0].history[num].month} ${top10Games[0].history[num].year}`)
        // Tenemos que obligatoriamente, obtener la escala, pues no se puede/debe actualizar
        // Durante el enter, despues se usará en el join para cada juego:
        //Contrary to ordinal scales, a band scale’s domain must be defined in full beforehand, 
        //and cannot be constructed iteratively.
        escalaX.domain(top10Games.map(d => {
          if(d.name.length > 27){
            return d.name.slice(0, 27) + "..."
          }
          return d.name;
        }));
        const ejeX = d3.axisBottom(escalaX);
        d3.select("#ejex").call(ejeX)
        .selectAll("text")
        .attr("transform", "rotate(-40)")
        .attr("text-anchor", "end")
        .attr("dx", "-0.8em")
        .attr("font-weight", "bolder")
        .attr("font-size", 12);

        // Hacer el join con ese top 10
      barras
      .selectAll(".games")
      // Si no hace hace esto como función de data, los datos no se identifican como objeto unico, y se
      // Sobre escriben
      .data(top10Games, d => d.name) // Función para asociar nombres como valor unico en DOM
      .join(
      // Elementos de entrada
      (enter) => {
        enter
          .append("rect")
          .attr("class","games")
          .attr("y", d => MARGIN1.top + escalaAvgPlayers(d.history[num].avg_players))
          .attr("height", d => HEIGHTVIS - escalaAvgPlayers(d.history[num].avg_players))
          .attr("width", 40)
          //OCURRE ALGO EXTRAÑO CON LOS COLORES
          .attr("fill", (d) => colorPalette[d.genre[0]])
          .attr("stroke-width", 2)
          .attr("stroke", "black")
          .attr("opacity", 0)
          .attr("x", d => {
            let name = d.name;
            if(name.length > 27) { 
              return escalaX(d.name.slice(0, 27) + "...") + escalaX.bandwidth() / 10 + MARGIN1.left + 10;
            }
            return escalaX(d.name) + escalaX.bandwidth() / 10 + MARGIN1.left + 10;
          })
          .on("mouseover", hoverBar)
        .on("mousemove", moveBar)
        .on("mouseleave", leaveBar)
          .transition() // Agregar la transición
          .duration(500)
          .attr("opacity", 1)
      },
      // Elementos de actualización
      (update) => {
        update
          .transition() // Agregar la transición
          .duration(1000)
          .attr("y", d => MARGIN1.top + escalaAvgPlayers(d.history[num].avg_players))
          .attr("height", d => HEIGHTVIS - escalaAvgPlayers(d.history[num].avg_players))
          .attr("x", d => {
            let name = d.name;
            if(name.length > 27) { 
              return escalaX(d.name.slice(0, 27) + "...") + escalaX.bandwidth() / 10 + MARGIN1.left + 10;
            }
            return escalaX(d.name) + escalaX.bandwidth() / 10 + MARGIN1.left + 10;
          })
          //OCURRE ALGO EXTRAÑO CON LOS COLORES

          //.attr("fill", () => {color = bucle2(color); return colorPalette[color]})
    },
    // Elementos de salida
    (exit) => {
      exit
        .transition() // Agregar la transición
        .duration(500)
        .attr("opacity", 0)
        .remove();
    }
  )
    }, 1500)
};
// testing
leer();

