import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm"

const w = 800;
const h = 400;
const barWidth = w/275;

const svg = d3.select(".chart-div")
                    .append("svg")
                    .attr("width", w +100)
                    .attr("height", h+60);

const toolTip = d3.select(".chart-div")
                .append("div")
                .attr("id", "tooltip")
                .style("opacity", 0);

async function dataFetcher  (url) {
    try{
    const res = await fetch(url)
    const toJson = await res.json()
    return toJson["data"];
    }catch(err){
        console.error(err)
    }
}

const data = await dataFetcher("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json");

const fullDates = data.map(item => new Date(item[0])); //yearsDate
const datesWithQ = data.map(item => {
    let temp = item[0].split("-")[1];
    let year = item[0].split("-")[0];
    let quarter = "";
    if (temp === '01') {
        quarter = 'Q1';
      } else if (temp === '04') {
        quarter = 'Q2';
      } else if (temp === '07') {
        quarter = 'Q3';
      } else if (temp === '10') {
        quarter = 'Q4';
      }
      return `${year} ${quarter}`
}) //years
const GDP = data.map(item => item[1]);


const maxGdp = d3.max(GDP);
const linearScale = d3.scaleLinear().domain([0, maxGdp]).range([0, h]);
const gdpScaled = GDP.map( item => linearScale(item));

console.log(gdpScaled);

const maxDate = new Date(d3.max(fullDates));
maxDate.setMonth(maxDate.getMonth() + 3);


const xScale = d3.scaleTime()
                .domain([d3.min(fullDates), maxDate])
                .range([0, w]);

const xAxis = d3.axisBottom(xScale);
svg.append("g")
    .call(xAxis)
    .attr("transform", "translate(60, 400)")
    .attr("id", "x-axis")
  

const yScale = d3.scaleLinear()
                    .domain([0, maxGdp])
                    .range([h , 0]);

const yAxis = d3.axisLeft(yScale);

svg.append("g")
    .call(yAxis)
    .attr("id", "y-axis")
    .attr("transform", "translate(60, 0)");
    

d3.select("svg")
    .selectAll("rect")
    .data(gdpScaled).enter()
    .append("rect")
    .attr("data-date", (d, i) => data[i][0])
    .attr("data-gdp", (d, i) => data[i][1])
    .attr("class", "bar")
    .attr("x", (d, i) => xScale(fullDates[i]))
    .attr("y", d => h-d )
    .attr("width", barWidth)
    .attr("height", d => d)
    .attr("index", (d, i) => i)
    .attr("transform", "translate(60, 0)")
    .on("mouseover", (event, d)=>{
        //d=height of the current rect
        const index = event.target.attributes.index.value;
      
        toolTip.html(
            `${datesWithQ[index]} <br> $${GDP[index]} Billion`
        )
        .attr("data-date", data[index][0])
        .style("left", (event.pageX + 10) + "px")
        .style("top", (event.pageY - 15) + "px")
        .style("transform", "translateX(60px)")
        .style("opacity", 1);
    })
    .on("mouseout", (e, d) => {
        toolTip.transition().duration(200).style('opacity', 0);
    });
    










