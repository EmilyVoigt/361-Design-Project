const measurementInterval = 10; // interval between sensor readings in minutes
const dataFileName = "fake_avg_day.csv"; // the file to read data from

const testTime = 1656507600000; //9am on Wednesday June 29

// get CSV data, return as an array of objects
async function getCsvData() {
    const csvData = d3.csv(`https://emilyvoigt.github.io/361-Design-Project/data/${dataFileName}`, function (d, i) {
       // TODO: change path to match our actual data file
      return {
        temp: +d.temp,
        humidity: +d.humidity,
        light: +d.light,
        uv: +d.uv,
        time: new Date(testTime + (600000*i)), // add 10minutes to each time
        // time: new Date(+d.time)
        //TODO: add time
      };
    });
    return csvData;
};

// takes in date obejct
async function getCsvDataForDate(date) {
    const csvData = await getCsvData();
    const beginning = new Date(date.getFullYear(), date.getMonth(), date.getDate()).valueOf();
    const end = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1).valueOf();

    let dailyValues = [];

    for (let i = csvData.length - 1; i >= 0; i--) {
        const data = csvData[i];
        if (data.time.valueOf() > beginning && data.time.valueOf() < end) {
            dailyValues.push(data);
        }
    }

    return dailyValues;
}

function getDataDays(data){
    let dates = []; 

    data.forEach(point =>{
        const curPointData = {
            year: point.time.getFullYear(),
            month: point.time.getMonth(),
            date: point.time.getDate(),
            day: point.time.getDay(),
            key: `${point.time.getFullYear()}${point.time.getMonth()}${point.time.getDate()}`
        }
           const inArray = dates.find(point =>{
            if (point.key === curPointData.key){
                return true
            }
            return false
        })
        if (!inArray){
            dates.push(curPointData)
        }
    })
    return dates
}

