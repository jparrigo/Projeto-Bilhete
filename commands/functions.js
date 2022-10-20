
function ConverteTime () {
    let time = new Date().getMinutes()
    let hour = new Date().getHours()
    let result = (hour+':'+time).toString()

    return result
}

exports.ConverteTime = ConverteTime