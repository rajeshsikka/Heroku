function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
   
  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

  });
}

function optionChanged(sample) {
  // Fetch new data each time a new sample is selected
  buildPieChart(sample);
  buildBubbleChart(sample);
  buildMetadata(sample);
}


function buildPieChart(sample) {
  var sampleURL = `/samples/${sample}`

  Plotly.d3.json(sampleURL,function(error,response){

      if (error) return console.log(error);
         console.log('raj8', response);

         var labels = []

         var values = []

         var hovers = []

      for(i=0; i<10; i++){

          var label = response.otu_ids[i];

          labels.push(label);

          var value = response.sample_values[i];

          values.push(value);

          var hover = response[label - 1];

          hovers.push(hover);

      };

      var trace = {

          values: values,

          labels: labels,

          type: "pie",

          text: hovers,

          hoverinfo: "label+text+value+percent",

          textinfo: "percent"

      };

      var data = [trace]

      var layout = {

          margin: {

              l: 10,

              r: 10,

              b: 10,

              t: 10,

              pad: 4

          }

      }   
                                                   
      Plotly.newPlot("pie", data, layout)

  });

};

function buildBubbleChart(sample) {

  var sampleURL = `/samples/${sample}`

  Plotly.d3.json(sampleURL,function(error,response){

      if (error) return console.log(error);

      var otuIDs = response.otu_ids;

      var sampleValues = response.sample_values;

      var otuDescriptions = [];
      console.log('raj9', otuIDs);
      for(i=0; i<otuIDs.length; i++) {

          otuDescriptions.push(response[otuIDs[i] - 1]);

      };

      var trace = {

          x: otuIDs,

          y: sampleValues,

          mode: 'markers',

          type: 'scatter',

          marker: {

              size: sampleValues,

              color: otuIDs,

              colorscale: "Rainbow"

          },

          text: otuDescriptions,

        };

      var data = [trace]

      Plotly.newPlot("bubble", data)

  });

};

function buildMetadata(sample) {   
  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    // Use d3 to select the panel with id of `#sample-metadata`
    var sampleURL = `/metadata/${sample}`
    
    Plotly.d3.json(sampleURL,function(error,response){
       
      if (error) return console.log(error);
    
      console.log('raj7', response);
      
      var data = response[0];

      console.log('raj6', response);

      var metaList = document.getElementById('sample-metadata');
      console.log('raj1', metaList);
      metaList.innerHTML = '';

      var metaItems = [["Sample", "sample"], ["Ethnicity","ETHNICITY"],["Gender","GENDER"],["Age","AGE"],

          ["Wash Frequency","WFREQ"],["Type","BBTYPE"]] ;

      console.log('raj2', metaItems)

      for(i=0; i<metaItems.length; i++){

          var newLi = document.createElement('li');
          console.log('raj3', metaItems.length)

          newLi.innerHTML = `${metaItems[i][0]}: ${response[metaItems[i][1]]}`;

          metaList.appendChild(newLi);

      };

  });

};


// Initialize the dashboard
init();

