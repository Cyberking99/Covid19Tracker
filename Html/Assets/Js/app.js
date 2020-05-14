alert('Created by Kefas Kingsley\r\nIn case of any error, contact him using +2348038752155');

var countries = [];

function myFunction() {
  var x = document.getElementById("myTopnav");
  if (x.className === "navbar") {
    x.className += " responsive";
  } else {
    x.className = "navbar";
  }
}

window.addEventListener('load', function() {
    getDetails();
});

function getDetails() {
    var link = 'https://pomber.github.io/covid19/timeseries.json';
    
    $(".loader").css("display", "block");
    httpGet(link);
}

function httpGet(link) {
    if(link !== null && link !== undefined && link !== "") {
        $.ajax({
            url: link,
            success: function(data) {
                let items = Object.keys(data);
                
                var content = "";
                var totalConfirmed = 0;
                var totalRecovered = 0;
                var totalDeath = 0;
                var totalActive = 0;
                
                items.map(key => {
                    let value = data[key];
                    
                    var confirmed = 0;
                    var recovered = 0;
                    var deaths = 0;
                    var out = recovered + deaths;
                    var active = confirmed - out;
                    
                    Object.values(value).forEach(entry => {
                        confirmed = entry['confirmed'];
                        recovered = entry['recovered'];
                        deaths    = entry['deaths'];
                        active = confirmed - (recovered + deaths);
                    });
                    
                    var coutryWise  = {};
                    
                    coutryWise['country']    = key;
                    coutryWise['confirmed']  = confirmed;
                    coutryWise['recovered']  = recovered;
                    coutryWise['deaths']     = deaths;
                    coutryWise['active'] = active;
                    
                    countries.push(coutryWise);
                    
                    totalConfirmed += confirmed;
                    totalRecovered += recovered;
                    totalDeath     += deaths;
                    totalActive += active;
                    
                    
                    content += '<div class = "datadiv"><button class="collapsible" style="background-color: '+ getColor() +'"><b>'+ key +'</b></button><div class="content1"><span class="confirmed"><big>'+ confirmed +'</big><br><br> <b>Confirmed</b></span><span class="recovered"><big>'+ recovered +'</big><br><br> <b>Recovered</b></span><span class="death"><big>'+ deaths +'</big><br><br> <b>Deaths</b></span></div></div>';
                });
                
                $('#totalConfirmed').html('<b>' + totalConfirmed + '</b><br><br>Confirmed');
                $('#totalRecovered').html('<b>' + totalRecovered + '</b><br><br>Recovered');
                $('#totalDeath').html('<b>' + totalDeath + '</b><br><br>Deaths');
               
                $('#profileDetails').append(content);
                
               // applyCollapsible();
                
                $("#card1").css("display", "block");
                $(".loader").css("display", "none");
                $("body, html").css("background-color", "#ffffff");
            },
            error: function() {
                alert("System seems to be offline, or your link is invalid. Be sure the link is correct, and try again later");
            }
        });
    }
}

function applyCollapsible() {
    var coll = document.getElementsByClassName("collapsible");
    var i;
    
    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active2");
        var content = this.nextElementSibling;
        
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          content.style.maxHeight = content.scrollHeight + "px";
        } 
      });
    }
}

function filterTable() {
  var input, filter, table, tr, td, i, txtValue, confirmed, totalConfirmed=0, recovered, totalRecovered=0, death, totalDeath = 0;
  input = document.getElementById("myInput");
  filter = input.value.toUpperCase();
  table = document.getElementById("myCodeTable");
  tr = document.getElementsByClassName("datadiv");
  
  for (i = 0; i < tr.length; i++) {
    td      = tr[i].getElementsByTagName("button")[0];
    confirmed    = tr[i].getElementsByTagName("b")[1];
    recovered    = tr[i].getElementsByTagName("b")[2];
    death       = tr[i].getElementsByTagName("b")[3];
   
    if (td) {
      txtValue = td.textContent || td.innerText;
      
      //console.log(txtValue.toUpperCase().indexOf(filter));
      
      if (txtValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
        
        if(confirmed) {
            totalConfirmed += Number(confirmed.innerText);
        }
        
        if(recovered) {
            totalRecovered += Number(recovered.innerText);
        }
        
        if(death) {
            totalDeath += Number(death.innerText);
        }
        
      } else {
        tr[i].style.display = "none";
      }
    } 
    
  }
  
    $('#totalConfirmed').html('<b>' + totalConfirmed + '</b><br><br>Confirmed');
    $('#totalRecovered').html('<b>' + totalRecovered + '</b><br><br>Recovered');
    $('#totalDeath').html('<b>' + totalDeath + '</b><br><br>Deaths');
}

function getColor() {
  var color = '#1E90FF'
}

function getTopTenCountriesByDeath() {
    countries.sort(function(a, b) {
        return b.deaths - a.deaths
    });
    
    var totalXP = [];

    for(var j = 0; j < 10; j++) {
        var obj1  = countries[j];
                
        totalXP.push({
            label : obj1.country, y : obj1.deaths
        });
    }
    
    var options = {
        animationEnabled: true,
        exportEnabled: true,

        data: [{
                type: "doughnut",
                innerRadius: "40%",
                toolTipContent: "<b>{label}</b>: {y} (#percent%)",
                
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} ({y})",
                yValueFormatString:"#,##0.#"%"",
                dataPoints: totalXP
        }]
    };

    $("#chartContainer").CanvasJSChart(options);
    $("#myModal").modal('show');
    $(top10).on('touchmove',ontouchmove);
    function ontouchmove(event){
   	if(event.cancelable){
	   	event.preventDefault();
		}
	}
}

function getTopTenCountriesByTotal() {
    countries.sort(function(a, b) {
        return b.deaths - a.deaths
    });
    
    var totalXP = [];

    for(var j = 0; j < 10; j++) {
        var obj1  = countries[j];
                
        totalXP.push({
            label : obj1.country, y : obj1.confirmed
        });
    }
    
    var options = {
        animationEnabled: true,

        data: [{
                type: "doughnut",
                innerRadius: "40%",
                toolTipContent: "<b>{label}</b>: {y} (#percent%)",
                
                showInLegend: "true",
                legendText: "{label}",
                indexLabel: "{label} ({y})",
                yValueFormatString:"#,##0.#"%"",
                dataPoints: totalXP
        }]
    };

    $("#chartContainer").CanvasJSChart(options);
    $("#myModal").modal('show');
}
