let from = document.getElementById("from");
let to = document.getElementById("to");
const fromAmount = document.getElementById("fromAmount");
const convertBtn = document.getElementById("convertBtn");
const swapBtn = document.getElementById("swapBtn");
const ratesBtn = document.getElementById("ratesBtn");
let container = document.getElementById("container");

var myHeaders = new Headers();
myHeaders.append("apikey", "bMbOQJhmC8iT4UBD1H6OsGg0oVhsSPkO");

var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: myHeaders,
};

let canva = document.createElement("canvas");
canva.setAttribute("id", "myChart");
container.appendChild(canva);
const data = {
    labels: [],
    datasets: [
        {
            label: "My First dataset",
            backgroundColor: "rgb(255, 99, 132)",
            borderColor: "rgb(255, 99, 132)",
            data: [],
        },
    ],
};

const config = {
    type: "line",
    data: data,
    options: {},
};

const myChart = new Chart(document.getElementById("myChart"), config);

const destroyChart = () => {
    document.getElementById("myChart").remove();
};

let getRates = () => {
    fetch("https://api.apilayer.com/exchangerates_data/latest", requestOptions)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            let rates = data.rates;
            Object.entries(rates).map((item) => {
                if (item[0] != "EUR") {
                    from.innerHTML += `<option>${item[0]}</option>`;
                }
                if (item[0] != "BAM") {
                    to.innerHTML += `<option>${item[0]}</option>`;
                }
            });
        });
};

getRates();

const convert = () => {
    fetch(
        `https://api.apilayer.com/exchangerates_data/convert?to=${to.value}&from=${from.value}&amount=${fromAmount.value}`,
        requestOptions
    )
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            toAmount.value =
                Math.round((data.result + Number.EPSILON) * 100) / 100;
        });

    monthlyRates();
};

let swap = () => {
    let temp = from.value;
    from.value = to.value;
    to.value = temp;
    convert();
};

convertBtn.addEventListener("click", convert);
swapBtn.addEventListener("click", swap);

let temp_date = new Date();
temp_date.setMonth(temp_date.getMonth() - 1);
let start_date = temp_date.toISOString().split("T", 1)[0];
let end_date = new Date().toISOString().split("T", 1)[0];

const createChart = (labels, dataArr) => {
    destroyChart();
    let canva = document.createElement("canvas");
    canva.setAttribute("id", "myChart");
    container.appendChild(canva);
    const data = {
        labels: labels,
        datasets: [
            {
                label: "My First dataset",
                backgroundColor: "rgb(255, 99, 132)",
                borderColor: "rgb(255, 99, 132)",
                data: dataArr,
            },
        ],
    };

    const config = {
        type: "line",
        data: data,
        options: {},
    };

    const myChart = new Chart(document.getElementById("myChart"), config);
};

const monthlyRates = () => {
    fetch(
        `https://api.apilayer.com/exchangerates_data/timeseries?start_date=${start_date}&end_date=${end_date}&symbols=${from.value},${to.value}`,
        requestOptions
    )
        .then((res) => res.json())
        .then((response) => {
            console.log(response);
            labels = [];
            let dataArr = [];
            Object.entries(response.rates).map((item) => {
                console.log(item[0]);
                labels.push(item[0]);
            });

            Object.entries(response.rates).map((item) => {
                let pret = to.value;
                console.log(item[1][pret]);
                dataArr.push(item[1][pret]);
            });

            createChart(labels, dataArr);
        });
};

ratesBtn.addEventListener("click", monthlyRates);
