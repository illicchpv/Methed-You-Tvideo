// index.js
// https://console.cloud.google.com/apis/credentials/key/98459311-8184-44ca-bfc5-c44ed49a9925?project=yt-video-402511
const API_KEY = 'AIzaSyAfjt_fFcPVWe3A6YFiAe9jLRBcyzELjdI'
// https://developers.google.com/youtube/v3/docs/videos/list
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
// https://developers.google.com/youtube/v3/docs/search/list
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const videoListItems = document.querySelector('.video-list__items')

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
  console.log(v, r)
  return r;
}

const fetchTrendingVideo = async () => {
  // debugger
  // let dt = parseISO8601('PT1M') // "duration": "PT26M32S",
  try{
    const url = new URL(VIDEOS_URL)
    url.searchParams.append('key', API_KEY)
    url.searchParams.append('part', 'contentDetails,id,snippet')
    url.searchParams.append('chart', 'mostPopular')
    url.searchParams.append('regionCode', 'ru')
    url.searchParams.append('maxResults', '12')
    const resp = await fetch(url)
    if(!resp.ok){
      throw new Error(`HTTP error: ${resp.status} `)
    }
    return await resp.json()
  }catch(e){
    console.log('fetchTrendingVideo error:', e)
  }
}
const displayVideo = (v) => {
  // console.log( JSON.stringify(v, false, 2) )
  videoListItems.textContent = ''
  if(!v)
    return;
  const listVideos = v.items.map(video => {
    const li = document.createElement('li')
    li.classList.add('video-list__item')
    li.innerHTML = `
<article class="video-card">
  <a class="video-card__link" href="/video.html?id=${video.id}">
    <img class="video-card__thumbnail" src="${video.snippet.thumbnails.standard?.url 
      || video.snippet.thumbnails.high?.url}" 
      alt="${video.snippet.title}">

    <h3 class="video-card__title">${video.snippet.title}</h3>

    <p class="video-card__chanel">${video.snippet.channelTitle}</p>

    <p class="video-card__duration">${parseISO8601(video.contentDetails.duration)} <!-- 31 мин 25 сек --></p>
  </a>
  <button class="video-card__favorite" type="button" 
    aria-label="Добавить в избранное, ${video.snippet.title}">
    <svg class="video-card__icon">
      <use class="star-o" xlink:href="./image/sprite.svg#star-ob"></use>
      <use class="star" xlink:href="./image/sprite.svg#star"></use>
    </svg>
  </button>
</article>
`;
    return li
  })
  videoListItems.append(...listVideos)
}

fetchTrendingVideo().then(v => {
  displayVideo(v)
})