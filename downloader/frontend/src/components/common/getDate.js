function getCurrentDate(separator='-') {
  let newDate = new Date()
  let date = newDate.getDate()
  let month = newDate.getMonth()+1
  let year = newDate.getFullYear()
  console.log(date)
  console.log(month)
  console.log(year)
  return `${year}${separator}${month<10?`0${month}`:`${month}`}${separator}${date}`
}

export default getCurrentDate;
