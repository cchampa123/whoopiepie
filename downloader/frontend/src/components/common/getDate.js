export function getCurrentDate(separator='-') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth()+1
  let year = newDate.getFullYear()
  return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}

export function nonTimestampDate(date) {
    const local_date = date.toLocaleString().split(', ')[0]
    const date_array = local_date.split('/')
    const year = String(date_array[2])
    const month = date_array[0] < 10 ? `0${date_array[0]}` : String(date_array[0])
    const day = date_array[1] < 10 ? `0${date_array[1]}` : String(date_array[1])
    return year ? year+'-'+month+'-'+day : null;
}
