
// const summerData = julyData.concat(augustData, juneData.slice(20, 30), septemberData.slice(0, 22))
const summerData = [...juneData.slice(20, 30), ...julyData, ...augustData, ...septemberData.slice(0, 22)];

const stringTimeToArray = (stringTime)=>{
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
    let totalRiseMins = 0 
    let totalSetMins = 0

    seasonData.forEach(day =>{
        let sunrise = stringTimeToArray(day.sunrise)
        let sunset = stringTimeToArray(day.sunset)
        // now, we have both dates as arrays like ['5', '39'] 

        sunrise[0] *= 60 //convert hour to mins 
        sunset[0] *= 60 

        totalRiseMins += sunrise[0] + sunrise[1]
        totalSetMins += sunset[0] + sunset[1]
    })

    const riseAvgTime = totalRiseMins / seasonData.length
    const setAvgTime = totalSetMins / seasonData.length
    const riseHour = Math.floor(riseAvgTime/60)
    const riseMin = riseAvgTime % 60

    const setHour = Math.floor(setAvgTime / 60)
    const setMin = setAvgTime % 60
    return {riseTime : {hour: riseHour, minute: riseMin}, setTime: {hour: setHour, minute: setMin}}
}


