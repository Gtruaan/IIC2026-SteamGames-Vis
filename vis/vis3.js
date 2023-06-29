const legendacolor = {
  "red": "#fa4d56", // Rojo
  "blue": "#4589ff", // Azul
  "green": "#6fdc8c", // Verde
  "yellow": "#d2a106", // Amarillo
  "purple": "#8a3ffc", // Morado 
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

const MARGIN3 = {
    top: 50,
    bottom: 50,
    right: 20,
    left: 20,
};

// Constantes para no andar hardcodeando por la vida (copy gus)
const SVG3_WIDTH = 900; // 5000
const SVG3_HEIGHT = 900; // 5000

const SVG3 = d3.select("#vis-3").append("svg");
//width height
SVG3.attr("width", SVG3_WIDTH).attr("height", SVG3_HEIGHT)

const HEIGHTVIS3 = SVG3_HEIGHT - MARGIN3.top - MARGIN3.bottom;
const WIDTHVIS3 = SVG3_WIDTH - MARGIN3.right - MARGIN3.left;

// Function para leer el json
function leer3(filter){
    d3.json("data/dataset.json")
        .then((datos) => {
          // change text of selected category
          d3.selectAll("#selected-cat").text(filter);
          SVG3.selectAll("*").remove();
            datos = Object.values(datos);
            if(filter != "Todas las categorías") {
                datos = datos.filter(d => d.genre.includes(filter));
            }

            console.log(datos);
            console.log("Cantidad de objetos en el dataset:", Object.keys(datos).length);
            CreateCircularPacking(datos);     
        })
        .catch((error) => console.log(error))}

// =============================================================================
// ============================= TERCERA VISUALIZACION =========================
// =============================================================================

function CreateCircularPacking(datasetValues) {
    // Obtenemos los valores de cada objeto
    console.log("DATOS NORMALES", datasetValues);

     ///////////////////////////

 let hoverCircle = () => {
  tooltip.body.style("opacity", 1);
}

let moveCircle = (event, d) => {
  tooltip.body.style("left", event.pageX + 15 + "px")
              .style("top", event.pageY + 15 + "px");
  tooltip.text.html(`${d.name}<br><br>Género: ${d.genre.join(", ")}` + 
                    `<br><br>Reviews: ${d.reviews}<br>Precio: ${d.price}<br> <br>Creador: ${d.developer}<br><br>Edad (En meses): ${d.history.length}<br>`);
}

let leaveCircle = () => {
  tooltip.body.style("opacity", 0);
}


  const text = SVG3.append("g")
  .attr("id", "text");

  ////////////////////////////////////////////////////////

    // ['Very Positive', 'Mixed', 'Mostly Positive', 
    //'Overwhelmingly Positive', 'Mostly Negative']

    const x = d3.scaleOrdinal()
    .domain(['Mostly Negative','Very Positive', 'Mostly Positive', 'Mixed','Overwhelmingly Positive'])
    .range([0.8* SVG3_WIDTH /4 , SVG3_WIDTH /2 , 3.2* SVG3_WIDTH /4 , SVG3_WIDTH /2 , SVG3_WIDTH /2 ])

    const y = d3.scaleOrdinal()
    .domain(['Mostly Negative','Very Positive', 'Mostly Positive', 'Mixed','Overwhelmingly Positive'])
    .range([SVG3_HEIGHT /2, SVG3_HEIGHT /2, SVG3_HEIGHT /2, 3.2* SVG3_HEIGHT / 4, 0.8* SVG3_HEIGHT /4])

    const size = d3.scaleLinear()
    .domain([20, 104])
    .range([1, 4]) // 10 40

  const node = SVG3.append("g").attr("class","circles")
  .selectAll("circle")
  .data(datasetValues, d => d.name)
  .join("circle")
  .attr("r", d => {return size(d.history.length)})
  .attr("cx", SVG3_WIDTH / 2)
  .attr("cy", SVG3_HEIGHT / 2)
  .style("fill", d => {if(typeof d.price === "string" && (d.price).charAt(0) !== "$"){
    return legendacolor.red
  } else if (typeof d.price === "string" && parseFloat((d.price).slice(1)) < 15.00){
    return legendacolor.green
  } else if (typeof d.price === "string" && parseFloat((d.price).slice(1)) < 30.00){
    return legendacolor.yellow
  } else if (typeof d.price === "string" && parseFloat((d.price).slice(1)) > 30.00){
    return legendacolor.purple
  } else return legendacolor.blue
})
  .style("fill-opacity", 0.8)
  .attr("stroke", "black")
  .style("stroke-width", 1)
  .on("mouseover", hoverCircle)
  .on("mousemove", moveCircle)
  .on("mouseleave", leaveCircle)

  /////////
  const legends = SVG3.append("g").attr("class","legends");
  legends.append("circle").attr("cx",8).attr("cy",10).attr("r", 6).style("fill", legendacolor.red)
  legends.append("circle").attr("cx",8).attr("cy",30).attr("r", 6).style("fill", legendacolor.green)
  legends.append("circle").attr("cx",8).attr("cy",50).attr("r", 6).style("fill", legendacolor.yellow)
  legends.append("circle").attr("cx",8).attr("cy",70).attr("r", 6).style("fill", legendacolor.purple)
  legends.append("circle").attr("cx",8).attr("cy",90).attr("r", 6).style("fill", legendacolor.blue)
  legends.append("text").attr("x", 170).attr("y", 14).text("Gratis, paquete o Demo").attr("text-anchor", "end").attr("font-weight", "bolder").attr("font-size", 12);
  legends.append("text").attr("x", 163).attr("y", 34).text("Precio menor a 15.00$").attr("text-anchor", "end").attr("font-weight", "bolder").attr("font-size", 12);
  legends.append("text").attr("x", 196).attr("y", 54).text("Precio entre 15.00$ y 30.00$").attr("text-anchor", "end").attr("font-weight", "bolder").attr("font-size", 12);
  legends.append("text").attr("x", 163).attr("y", 74).text("Precio mayor a 30.00$").attr("text-anchor", "end").attr("font-weight", "bolder").attr("font-size", 12);
  legends.append("text").attr("x", 168).attr("y", 94).text("Precio no especificado").attr("text-anchor", "end").attr("font-weight", "bolder").attr("font-size", 12);
  /////////

  text.append("text")
  .text("Mostly Negative")
  .attr("x",0.8* SVG3_WIDTH /4 +10)
  .attr("y",SVG3_HEIGHT /2 - 100)
  .attr("text-anchor", "end")
  .attr("font-weight", "bolder")
  .attr("font-size", 12);

  /////////

  text.append("text")
  .text("Very Positive")
  .attr("x",SVG3_WIDTH /2 -2)
  .attr("y",SVG3_HEIGHT /2 - 130)
  .attr("text-anchor", "end")
  .attr("font-weight", "bolder")
  .attr("font-size", 12);

  /////////

  text.append("text")
  .text("Mostly Positive")
  .attr("x",3.2* SVG3_WIDTH /4 -3)
  .attr("y",SVG3_HEIGHT /2 - 100)
  .attr("text-anchor", "end")
  .attr("font-weight", "bolder")
  .attr("font-size", 12);

  /////////

  text.append("text")
  .text("Mixed")
  .attr("x",SVG3_WIDTH /2 -25)
  .attr("y",3.2* SVG3_HEIGHT / 4 - 80)
  .attr("text-anchor", "end")
  .attr("font-weight", "bolder")
  .attr("font-size", 12);

  /////////

  /////////

    text.append("text")
    .text("Overwhelmingly Positive")
    .attr("x",SVG3_WIDTH /2 +30)
    .attr("y",0.8* SVG3_HEIGHT /4 - 80)
    .attr("text-anchor", "end")
    .attr("font-weight", "bolder")
    .attr("font-size", 12);
  
  /////////

  // const circleCount = node.size();
  // console.log("Número de círculos:", circleCount);

    let simulation = d3.forceSimulation()
    .force("x", d3.forceX().strength(0.5).x(d => x(d.reviews)))
    .force("y", d3.forceY().strength(0.5).y(d => y(d.reviews)))
    .force("center", d3.forceCenter().x(SVG3_WIDTH/2).y(SVG3_HEIGHT/2)) // Attraction to the center of the svg area
    .force("charge", d3.forceManyBody().strength(1)) // Nodes are attracted one each other of value is > 0
    .force("collide", d3.forceCollide().strength(1).radius(d => {return size(d.history.length)+2}).iterations(1)) // Force that avoids circle overlapping
// Apply these forces to the nodes and update their positions.
// Once the force algorithm is happy with positions ('alpha' value is low enough), simulations will stop.
simulation
    .nodes(datasetValues)
    .on("tick", function(d){
      node
          .attr("cx", d => d.x)
          .attr("cy", d => d.y)
    });

    // function stopSimulation() {
    //   simulation.stop();
    // }
    
    // // Detén la simulación cuando lo desees, por ejemplo, después de un cierto período de tiempo
    // setTimeout(stopSimulation, 5000);

  const zoom = d3.zoom()
  .scaleExtent([1, 6])
  .extent([[0, 0], [SVG3_WIDTH, SVG3_HEIGHT]])
  .translateExtent([[0, 0], [SVG3_WIDTH, SVG3_HEIGHT]])
  .on("zoom", (event) => {
      const transform = event.transform;
      node.attr("transform", transform);

      node.selectAll("circle")
      .attr("r", 10 / transform.k)

      text.attr("transform", transform);
      
  })

  SVG3.call(zoom)


};

leer3("Todas las categorías");

d3.select("#reset-btn").on("click", () => {
  leer3("Todas las categorías");
});
