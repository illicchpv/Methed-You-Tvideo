// index.js
// https://console.cloud.google.com/apis/credentials/key/98459311-8184-44ca-bfc5-c44ed49a9925?project=yt-video-402511
const API_KEY = 'AIzaSyAfjt_fFcPVWe3A6YFiAe9jLRBcyzELjdI'
// https://developers.google.com/youtube/v3/docs/videos/list
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
// https://developers.google.com/youtube/v3/docs/search/list
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const LS_KEY = 'YTfavorite'
const favoriteIds = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
// console.log('favoriteIds:', favoriteIds)

const videoListItems = document.querySelector('.video-list__items')

const fillVideoListTemplate = (video) => (`
<article class="video-card">
  <a class="video-card__link" href="./video.html?id=${video.id}">
    <img class="video-card__thumbnail" src="${video.snippet.thumbnails.standard?.url 
      || video.snippet.thumbnails.high?.url}" 
      alt="${video.snippet.title}">

    <h3 class="video-card__title">${video.snippet.title}</h3>

    <p class="video-card__chanel">${video.snippet.channelTitle}</p>

    <p class="video-card__duration">${parseISO8601_v2(video.contentDetails.duration)} <!-- 31 мин 25 сек --></p>
  </a>
  <button class="video-card__favorite favorite ${favoriteIds.includes(video.id)?'active':''}" 
    type="button" 
    aria-label="Добавить в избранное, ${video.snippet.title}"
    data-video-id="${video.id}">
    <svg class="video-card__icon">
      <use class="star-o" xlink:href="./image/sprite.svg#star-ob"></use>
      <use class="star" xlink:href="./image/sprite.svg#star"></use>
    </svg>
  </button>
</article>
`);
const fillVideoTemplate = (video) => (`
<div class="container video_container">
  <div class="video__player">
    <iframe class="video__iframe"
      title="YouTube video player" frameborder="0" 
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
      allowfullscreen

      src="https://www.youtube.com/embed/${video.id}"

    ></iframe>
  </div>

  <!-- временно вставлен. для удобства -->
  <div class="video__container">
    <div class="video__content">
      <h2 class="video__title">${video.snippet.title}</h2>

      <p class="video__chanel">${video.snippet.channelTitle}</p>

      <p class="video__info">
        <span class="video__views">${parseInt(video.statistics.viewCount).toLocaleString()} просмотр.</span>

        <span class="video__date">Дата премьеры: ${formatDte(video.snippet.publishedAt)}
        <!-- 16 авг. 2024 г. -->
        </span>
      </p>

      <p class="video__description">${video.snippet.description}
      <!-- Смотрите наш курс-саммари «Как понимать философию» фоном. -->
      </p>
    </div>
    <button class="video__link favorite ${favoriteIds.includes(video.id)?'active':''}">
      <span class="video__no-favorite">Избранное</span>
      <span class="video__favorite">В избранном</span>

      <!-- покрасить *  -->
      <svg class="video__icon">
        <use xlink:href="./image/sprite.svg#star-ob"></use>
      </svg>
    </button>
  </div>
</div>
`);

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
    videoListItems.textContent = `
    <h3>извините, в трендах ничего нет.</h3>
    <h4>fetchTrendingVideo error:${e}</h4>
    `;
  }
}
const fetchFavoriteVideo = async () => {
  // debugger
  // let dt = parseISO8601('PT1M') // "duration": "PT26M32S",
  try{
    if(favoriteIds.length === 0){
      return {items: []}
    }

    const url = new URL(VIDEOS_URL)
    url.searchParams.append('key', API_KEY)
    url.searchParams.append('part', 'contentDetails,id,snippet')
    url.searchParams.append('id', favoriteIds.join(','))
    url.searchParams.append('maxResults', '12')
    const resp = await fetch(url)
    if(!resp.ok){
      throw new Error(`HTTP error: ${resp.status} `)
    }
    return await resp.json()
  }catch(e){
    console.log('fetchTrendingVideo error:', e)
    videoListItems.textContent = `
    <h3>извините, в трендах ничего нет.</h3>
    <h4>fetchTrendingVideo error:${e}</h4>
    `;
  }
}
const fetchVideoData = async (id) => {
  // debugger
  // let dt = parseISO8601('PT1M') // "duration": "PT26M32S",
  try{
    if(!id){
      return {items: []}
    }

    const url = new URL(VIDEOS_URL)
    url.searchParams.append('key', API_KEY)
    url.searchParams.append('part', 'snippet,statistics')
    url.searchParams.append('id', id)
    url.searchParams.append('maxResults', '12')
    const resp = await fetch(url)
    if(!resp.ok){
      throw new Error(`HTTP error: ${resp.status} `)
    }
    return await resp.json()
  }catch(e){
    console.log('fetchTrendingVideo error:', e)
    videoListItems.textContent = `
    <h3>извините, в трендах ничего нет.</h3>
    <h4>fetchTrendingVideo error:${e}</h4>
    `;
  }
}

const displayListVideo = (v) => {
  // console.log( JSON.stringify(v, false, 2) )
  if(!v){
    '<h3>извините, в трендах ничего нет.</h3>'
    return;
  }
  videoListItems.textContent = ''
  const listVideos = v.items.map(video => {
    const li = document.createElement('li')
    li.classList.add('video-list__item')
    li.innerHTML = fillVideoListTemplate(video) 
    return li
  })
  videoListItems.append(...listVideos)
}
const displayVideo = ({items: [video]}) => { // v
  // console.log(JSON.stringify(v, false, 2))
  // debugger
  // const video = v.items[0]
  // console.log(JSON.stringify(video, false, 2))
  const videoEl = document.querySelector('.video')
  videoEl.innerHTML = fillVideoTemplate(video)
return

  videoListItems.textContent = ''
  const listVideos = v.items.map(video => {
    const li = document.createElement('li')
    li.classList.add('video-list__item')
    li.innerHTML = fillVideoListTemplate(video) 
    return li
  })
  videoListItems.append(...listVideos)
}

const init = () =>{
  const currPage = location.pathname.split("/").pop().toLowerCase()
  const searchParams = new URLSearchParams(location.search)
  const videoId = searchParams.get('id')
  const searchQuery = searchParams.get('q')

  if(currPage === '' || currPage === 'index.html'){ // выводим тренды
    console.log('currPage: index.html ')
    fetchTrendingVideo().then(v => {
      displayListVideo(v)
    });

  } else if(currPage === 'favorite.html'){
    console.log('currPage: favorite.html')
    fetchFavoriteVideo().then(v => {
      displayListVideo(v)
    });

  } else if(currPage === 'video.html' && videoId){
    console.log('currPage: video.html videoId:', videoId)
    // ?id=-BXItmWzWNE
    fetchVideoData(videoId).then(v => {
      displayVideo(v)
    });
    fetchFavoriteVideo().then(v => {
      displayListVideo(v)
    });

  } else if(currPage === 'search.html'){
    console.log('currPage: search.html', 'searchQuery:', searchQuery)
    fetchFavoriteVideo().then(v => {
      displayListVideo(v)
    });

  } else {
    console.log('Not supported page:', currPage)
  }

  document.body.addEventListener('click', ({target})=>{
    // debugger
    const itemFavorite = target.closest('.favorite')
    if(itemFavorite){
      console.log('itemFavorite', itemFavorite.dataset.videoId)
      const videoId = itemFavorite.dataset.videoId
      if(favoriteIds.includes(videoId)){
        const i = favoriteIds.indexOf(videoId)
        favoriteIds.splice(i, 1)
        itemFavorite.classList.remove('active')
      }else{
        favoriteIds.push(videoId)
        itemFavorite.classList.add('active')
      }
      localStorage.setItem(LS_KEY, JSON.stringify(favoriteIds))
    }
  })
}

init()