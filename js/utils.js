/*
The length of the video. The property value is an ISO 8601 duration. 
For example, for a video that is at least one minute long and less than one hour long, 
the duration is 
in the format PT#M#S, 
in which the letters PT indicate that the value 
specifies a period of time, and the letters M and S refer to length in minutes and seconds, 
respectively. The # characters preceding the M and S letters are both integers that specify 
the number of minutes (or seconds) of the video. 
For example, 
a value of PT15M33S indicates that the video is 15 minutes and 33 seconds long.
If the video is at least one hour long, the duration is 
in the format PT#H#M#S, 
in which the # preceding the letter H specifies the length of the video in hours and 
all of the other details are the same as described above. 
If the video is at least one day long, 
the letters P and T are separated, and the value's 
format is P#DT#H#M#S. 
Please refer to the ISO 8601 specification for complete details.
*/
const parseISO8601 = (v) => {
  const prefs = []; // ' час ', ' мин ', ' сек'
  if(v.indexOf('H')>=0)
    prefs.push(' час ');
  if(v.indexOf('M')>=0)
    prefs.push(' мин ');
  if(v.indexOf('S')>=0)
    prefs.push(' сек');
  const rArr = v.replace('S', ' ').replace('M', ' ').replace('H', ' ').replace('PT', ' ').trim().split(' ');
  var r = ''
  for(let i = (rArr.length -1); i >= 0; i--){
    r = rArr[i] + prefs.pop() + r;
  }
  // console.log(v, r)
  return r.trim();
}
const parseISO8601_v2 = (v) =>{
  let hMatch = v.match(/(\d+)H/)
  let mMatch = v.match(/(\d+)M/)
  let sMatch = v.match(/(\d+)S/)
  let h = hMatch ? parseInt(hMatch[1]) : 0;
  let m = hMatch ? parseInt(mMatch[1]) : 0;
  let s = hMatch ? parseInt(sMatch[1]) : 0;
  let r = ''
  if(h > 0){
    r += `${h} ч `
  }
  if(m > 0){
    r += `${m} мин `
  }
  if(h > 0){
    r += `${s} сек`
  }
  return r.trim()
}
const formatDte = (v) => {
  const date = new Date(v)
  const formatter = new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
  return formatter.format(date)
}

const replaceAll = (src, search, replace) => {
  return src.split(search).join(replace);
}
