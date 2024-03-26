let cryptoChoice = 1;

// Données du graphique
const labels = [];
const data = {
    labels: labels,
    datasets: [{
        label: 'Bitcoin BTC',
        data: [],
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
    }]
};

// Options du graphique
const options = {
    scales: {
        y: {
            min: 1,
            max: 1
        }
    }
};

// Créer le graphique en ligne
const config = {
    type: 'line',
    data: data,
    options: options
};
var ctx = document.getElementById('myLineChart');
var myLineChart = new Chart(ctx, config);

const dataPieChart = [];

function generateRandomColors(numColors) {
    var colors = [];
    var letters = '0123456789ABCDEF';

    for (var j = 0; j < numColors; j++) {
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        colors.push(color);
    }

    return colors;
}
var palette = generateRandomColors(100);


var pieChartData = {
    labels: [],
    datasets: [{
      data: dataPieChart, // Adjust these values according to your data
      backgroundColor: palette
    }]
  };

  // Get the canvas element and create the pie chart
  var ctxPieChart = document.getElementById('myPieChart').getContext('2d');
  var myPieChart = new Chart(ctxPieChart, {
    type: 'pie',
    data: pieChartData,
    options: {
        plugins: {
            legend: false,
            title: {
                font: {
                    size: 30,
                },
                display: true,
                text: 'Capitalisation boursière',
                color: 'white'
            },
        },
    }
  });

function addNewData(value) {
    var newValue = value
    // Ajouter la nouvelle valeur à l'ensemble de données existant
    var percent = (newValue * 2) / 100;
    if (newValue < options.scales.y.min || options.scales.y.min == 1) {
        options.scales.y.min = newValue - percent;
    }

    // Ajouter la nouvelle valeur à l'ensemble de données existant
    if (newValue > options.scales.y.max || options.scales.y.min == 1) {
        options.scales.y.max = newValue + percent;
    }

    if (data.datasets[0].data.length == 1) {
        options.scales.y.max = newValue + percent;
        options.scales.y.min = newValue - percent;
    }

    data.datasets[0].data.push(newValue);
    let hourNow = moment().format('h:mm:ss');
    data.labels.push(hourNow);
    // Mettre à jour le graphique
    myLineChart.update();
}


$(document).on('click', '#changeCrypto', function () {
    cryptoChoice = $(this).attr('lineId');
    data.labels = [];
    data.datasets[0].label = $(this).attr('crypto')
    data.datasets[0].data = []
    options.scales.y.min = 10;
    options.scales.y.max = 1;
    myLineChart.update();
})


$(document).ready(() => {
    var socket = io.connect('http://' + document.domain + ':' + location.port);
    var table = $('#table').DataTable({
        pageLength: 5,
        lengthMenu: [[5, 10, 20, -1], [5, 10, 20, 'Tous']],
        "language": {
            "emptyTable": "Data are coming soon..."
        }
    })
    socket.on('update_data', function (data) {
        var line = 1;
        var data = data.filter(function (item) {
            return item.length === 14;
        });
        console.log(data);
        var sortedArrayMax = data.slice().sort(function (a, b) {
            let val1 = b[4].replace(/\$/g, '').replace(/,/g, '');
            var floatVal1 = parseFloat(val1);
            let val2 = a[4].replace(/\$/g, '').replace(/,/g, '');
            var floatVal2 = parseFloat(val2);
            return floatVal1 - floatVal2;
        });

        var topThreeValues = sortedArrayMax.slice(0, 3);
        var maxValue = topThreeValues;
        var position = 1;
        let iconUp = '&nbsp;<i class="fa-solid fa-arrow-trend-up fa-xl" style="color: green"></i>'
        let iconDown = '&nbsp;<i class="fa-solid fa-arrow-trend-down fa-xl" style="color: red"></i>'
        maxValue.forEach(val => {
            var icon = '';
            let newVal = val[4].replace(/\$/g, '').replace(/,/g, '');
            var newValFloat = parseFloat(newVal);

            if($('#best-' + position).text() != '') {
                let oldVal = $('#best-' + position).text().replace(/\$/g, '').replace(/,/g, '');
                var oldValFloat = parseFloat(oldVal);
    
                if (newValFloat > oldValFloat) {
                    var icon = iconUp;
                } else if(newValFloat < oldValFloat) {
                    var icon = iconDown
                }
            }
            rows += '<tr><td>' + position + '</td><td>' + val[2] + '</td><td id="best-'+ position +'">' + val[4] + ' ' + icon + '</td></tr>';
            position++;
        });
        $('#bodyBest').empty()
        $('#bodyBest').append(rows)

        var bottomThreeValues = sortedArrayMax.slice(-3);
        var minValue = bottomThreeValues.sort(function (a, b) {
            return b[4] < a[4];
        });
        var position = 1;
        var rows = '';
        minValue.forEach(val => {
            var icon = '';
            let newVal = val[4].replace(/\$/g, '').replace(/,/g, '');
            var newValFloat = parseFloat(newVal);

            if($('#worst-' + position).text() != '') {
                let oldVal = $('#worst-' + position).text().replace(/\$/g, '').replace(/,/g, '');
                var oldValFloat = parseFloat(oldVal);
    
                if (newValFloat > oldValFloat) {
                    var icon = iconUp;
                } else if(newValFloat < oldValFloat) {
                    var icon = iconDown
                }

            }

            rows += '<tr><td>' + position + '</td><td>' + val[2] + '</td><td id="worst-'+ position +'">' + val[4] + ' ' + icon + '</td></tr>';
            position++;
        });
        $('#bodyWorst').empty();
        $('#bodyWorst').append(rows);


        let dataToAdd = [];
        let cryptoName = [];
        data.forEach(cryptos => {
            var rowData = [];
            var colonne = 0;
            cryptos.forEach(element => {
                if (colonne == 1 || colonne == 2 || colonne == 8 || colonne == 9 || colonne == 12 || element == '') {
                    colonne++;
                    return true;
                }
                
                if (colonne == 3) {
                    rowData.push(`<img src="${cryptos[3]}" width="30px" height="30px" style="margin-right:10px;">`);
                    rowData.push(cryptos[2]);
                }
                else if (colonne == 13) {
                    rowData.push(`<img src="${element}" alt="Description de l'image">`);
                } else {
                    rowData.push(element);
                }
                colonne++;
            });
            
            let oldValue = cryptos[4].replace(/\$/g, '').replace(/,/g, '');
            var newValue = parseFloat(oldValue);
            if (line == cryptoChoice) {
                addNewData(newValue)
            }

            let oldValueMarketCap = cryptos[10].replace(/\$/g, '').replace(/,/g, '');
            var newValueMarketCap = parseFloat(oldValueMarketCap);
            dataToAdd.push(newValueMarketCap);
            cryptoName.push(cryptos[2]);

            // Check if a row with the same identifier already exists
            var duplicate = false;
            //UPDATE DATA IN THIS FUNCTION
            table.rows().every(function () {
                if (this.data()[1] === cryptos[2]) {
                    //prix en cours
                    var cell = $(this.node()).find('td:eq(2)');
                    updateColorCell(cell, this.data()[2], cryptos[4])
                    this.data()[2] = cryptos[4]
                    
                    //1h
                    var cell = $(this.node()).find('td:eq(3)');
                    updateColorCell(cell, this.data()[3], cryptos[5])
                    this.data()[3] = cryptos[5]

                    //24h
                    var cell = $(this.node()).find('td:eq(4)');
                    updateColorCell(cell, this.data()[4], cryptos[6])
                    this.data()[4] = cryptos[6]

                    //7j
                    var cell = $(this.node()).find('td:eq(5)');
                    updateColorCell(cell, this.data()[5], cryptos[7])
                    this.data()[5] = cryptos[7]

                    //marketCap
                    var cell = $(this.node()).find('td:eq(6)');
                    updateColorCell(cell, this.data()[6], cryptos[10])
                    this.data()[6] = cryptos[10]

                    //24h volume
                    var cell = $(this.node()).find('td:eq(7)');
                    updateColorCell(cell, this.data()[7], cryptos[11])
                    this.data()[7] = cryptos[11]

                    duplicate = true;
                    this.invalidate();
                    return false; // Exit the loop early
                }
                return true;
            });

            rowData.push('<button id="changeCrypto" lineId="' + line + '" crypto="' + cryptos[2] + '" class="btn btn-xs btn-primary" data-bs-target="#exampleModalToggle2" data-bs-toggle="modal">voir plus</button>')
            if (!duplicate) {
                table.row.add(rowData).draw();
            }
            line++;
        });

        // Mettre à jour les données du diagramme
        myPieChart.data.datasets[0].data = dataToAdd;
        myPieChart.data.labels = cryptoName
        // Mettre à jour le diagramme
        myPieChart.update();
    });



    function updateColorCell(cell, oldValue, newValue) {
        if (oldValue < newValue) {
            cell.css('color', 'red');
        } else if (oldValue == newValue) {
            cell.css('color', 'black');
        } else {
            cell.css('color', 'green');
        }
    }
    
    // Exemple d'utilisation pour générer une palette de 100 couleurs
})
