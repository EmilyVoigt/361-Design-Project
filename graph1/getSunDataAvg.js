const summerData = [...juneData.slice(20, 30), ...julyData, ...augustData, ...septemberData.slice(0, 22)];
//combine webscraped dates for all summer dates 


const stringTimeToArray = (stringTime)=>{
    // inputs: a string date format
    //returns: the same date and time, formatted as an array to make data useable in our code
    let newTime = stringTime.split(":")
    let lastSplit = newTime[2].split(' ')
    newTime = [...newTime.splice(0,2), ...lastSplit]

    //convert all string to numbers
    for (i = 0; i< 3; i++){
        newTime[i] = parseInt(newTime[i])
    }

    if(newTime[3] === "pm"){ //convert to 24 hour time
        newTime[0] += 12
    }

    newTime = newTime.splice(0,2) //remove am/pm string and second value - we don't need either
    return newTime
}

const findAverageTime = (seasonData)=>{
    //input: array of all sunrise / sunset values for a season
    //return: average sunrise and sunset time for summer as an object containing the hour and minute value
    let totalSunriseMins = 0 
    let totalSunsetMins = 0

    seasonData.forEach(day =>{
        let sunrise = stringTimeToArray(day.sunrise)
        let sunset = stringTimeToArray(day.sunset)
        // now, we have both dates as arrays like ['5', '39'] 

        sunrise[0] *= 60 //convert hour to mins 
        sunset[0] *= 60 

        totalSunriseMins += sunrise[0] + sunrise[1] // add all minutes to total rise time
        totalSunsetMins += sunset[0] + sunset[1]
    })

    const riseAvgTime = totalSunriseMins / seasonData.length
    const setAvgTime = totalSunsetMins / seasonData.length
    const sunriseHour = Math.floor(riseAvgTime/60)
    const sunriseMin = riseAvgTime % 60

    const sunsetHour = Math.floor(setAvgTime / 60)
    const sunsetMin = setAvgTime % 60
    return {riseTime : {hour: sunriseHour, minute: sunriseMin}, setTime: {hour: sunsetHour, minute: sunsetMin}}
}


