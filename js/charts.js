function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("data/samples.json").then((data) => {
    var sampleNames = data.names;

    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    var firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

// Initialize the dashboard
init();

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildMetadata(newSample);
  buildCharts(newSample);
  
}

// Demographics Panel 
function buildMetadata(sample) {
  d3.json("data/samples.json").then((data) => {
    var metadata = data.metadata;
    // Filter the data for the object with the desired sample number
    var resultArray = metadata.filter(sampleObj => sampleObj.id == sample);
    var result = resultArray[0];
    // Use d3 to select the panel with id of `#sample-metadata`
    var PANEL = d3.select("#sample-metadata");

    // Use `.html("") to clear any existing metadata
    PANEL.html("");

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(result).forEach(([key, value]) => {
      PANEL.append("h6").text(`${key.toUpperCase()}: ${value}`);
    });

  });
}

// 1. Create the buildCharts function.
function buildCharts(sample) {

  // 2. Use d3.json to load and retrieve the samples.json file 
  d3.json("data/samples.json").then((data) => {


    // Gauge Chart 
    // 1. Create a variable that filters the metadata array for the object with the desired sample number.
    var gaugeData = data.metadata; 

    // Create a variable that holds the first sample in the array.
    var gaugeArray = gaugeData.filter(i => i.id == sample);  

    // 2. Create a variable that holds the first sample in the metadata array.
    var gaugeResult = gaugeArray[0]

    // 3. Create a variable that holds the washing frequency.
    var wFreq = gaugeResult.wfreq
    console.log(wFreq)

    // Bar and Bubble Chart
    // 3. Create a variable that holds the samples array. 
    var chartData = data.samples;
   
    // 4. Create a variable that filters the samples for the object with the desired sample number.
    var chartArray = chartData.filter(i => i.id == sample);

    //  5. Create a variable that holds the first sample in the array.
    var resultChart = chartArray[0];

    // 6. Create variables that hold the otu_ids, otu_labels, and sample_values.
    var otu_ids_var = resultChart.otu_ids
    console.log(otu_ids_var)
    var otu_labels_var = resultChart.otu_labels
    console.log(otu_labels_var)
    var sample_val = resultChart.sample_values
    console.log(sample_val)

    // 7. Create the yticks for the bar chart.
    // Hint: Get the the top 10 otu_ids and map them in descending order  
    // so the otu_ids with the most bacteria are last. 

   /// Unchained do not work properly 

    // let i = otu_ids_var.sort((a,b) => b - a); 
    // console.log(i);

    // var top10_otu_ids = i.slice(0,10).reverse();
    // console.log(top10_otu_ids)

    // let x = sample_val.sort((a,b) => b - a); 
    // console.log(x);

    // var top10_sample_val = x.slice(0,10).reverse();
    // console.log(top10_sample_val)

    // var yticks = top10_otu_ids.map(i => "OTU " + i);
    // console.log(yticks)

    // Chain the slice() method with the map() and reverse() functions 
    // to retrieve the top 10 otu_ids sorted in descending order.

    var top_sample_val = sample_val.map(i => i).slice(0,10).reverse()

    var yticks = otu_ids_var.map(i => "OTU " + i).slice(0,10).reverse()

    // // 8. Create the trace for the bar chart. 
    var barData = [{

        x: top_sample_val,
        y: yticks, 
        type: "bar",
        orientation: "h",
        text: otu_labels_var,
        marker: {color: otu_ids_var}
      
    }];

    // 9. Create the layout for the bar chart. 
    var barLayout = {

        title:"Top 10 bacteria Cultures Found",

    };
    // 10. Use Plotly to plot the data with the layout. 
    Plotly.newPlot("bar", barData, barLayout); 

// Bar and Bubble charts
  
      // 1. Create the trace for the bubble chart.
      var bubbleData = [{
      
      x: otu_ids_var,
      y: sample_val,
      mode: 'markers',
      marker: {
          color: otu_ids_var,
          size: sample_val
      },
      text: otu_labels_var
     
      }];
  
      // 2. Create the layout for the bubble chart.
      var bubbleLayout = {
      
      title: "Bacteria Cultures Per Sample",
      xaxis: {title: "OTU ID"},
      yaxis: {title: "# of times observed"}

      };
  
      // 3. Use Plotly to plot the data with the layout.
      Plotly.newPlot("bubble", bubbleData, bubbleLayout); 

      // 4. Create the trace for the gauge chart.
      var gaugeDataChart = [{

        domain: { x: [0, 1], y: [0, 1] },
        value: wFreq,
        title: { text:"<b>Belly Button Washing Frequency</b><br></br>Scrubs per Week"},
        type: "indicator",
        mode: "gauge+number+delta",
        delta: { reference: 10 },
        gauge: {
          axis: { range: [null, 10], dtick: "2" },
          bar: {color: "black"},
          steps: [
            { range: [0, 2], color: "lightgray" },
            { range: [2, 4], color: "lightsalmon" },
            { range: [4, 6], color: "khaki" },
            { range: [6, 8], color: "lightgoldenrodyellow" },
            { range: [8, 10], color: "maroon" }
          ],
          threshold: {
            line: { color: "red", width: 4 },
            thickness: 0.75,
            value: 2
          }
        }
      }];

     // 5. Create the layout for the gauge chart.
     var gaugeLayout = { 

        automargin: true
 
     };

     // 6. Use Plotly to plot the gauge data and layout.
     Plotly.newPlot("gauge", gaugeDataChart, gaugeLayout);





  });
}
