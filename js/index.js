// index.js
// https://console.cloud.google.com/apis/credentials/key/98459311-8184-44ca-bfc5-c44ed49a9925?project=yt-video-402511
const API_KEY = 'AIzaSyAfjt_fFcPVWe3A6YFiAe9jLRBcyzELjdI'
// https://developers.google.com/youtube/v3/docs/videos/list
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
// https://developers.google.com/youtube/v3/docs/search/list
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const LS_KEY = 'YTfavorite'
let favoriteIds = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
console.log('favoriteIds:', favoriteIds)

const videoListItems = document.querySelector('.video-list__items')

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
    // videoListItems.textContent = `
    // <h3>извините, в трендах ничего нет.</h3>
    // <h4>fetchTrendingVideo error:${e}</h4>
    // `;
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
    console.log('fetchFavoriteVideo error:', e)
    // videoListItems.textContent = `
    // <h3>извините, в трендах ничего нет.</h3>
    // <h4>fetchTrendingVideo error:${e}</h4>
    // `;
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
    if(videoListItems) videoListItems.textContent = `
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
  if(videoListItems) videoListItems.textContent = ''
  const listVideos = v.items.map(video => {
    const li = document.createElement('li')
    li.classList.add('video-list__item')
    li.innerHTML = fillVideoListTemplate(video) 
    return li
  })
  if(videoListItems) videoListItems.append(...listVideos)
}
const displayVideo = ({items: [video]}) => { // v
  // console.log(JSON.stringify(v, false, 2))
  // debugger
  // const video = v.items[0]
  const d = video.snippet.description
  video.snippet.description = replaceAll(d, '\n', '<br>')
  // console.log(JSON.stringify(video.snippet.description, false, 2))
  const videoEl = document.querySelector('.video')
  videoEl.innerHTML = fillVideoTemplate(video)
}

const init = () =>{
  console.log('favoriteIds:', favoriteIds)
  const a = []
  favoriteIds.forEach((e)=>{
    if(e) a.push(e);
  })
  favoriteIds = a;
  localStorage.setItem(LS_KEY, JSON.stringify(favoriteIds))
  console.log('favoriteIds:', favoriteIds)

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
    console.log('favoriteIds:', favoriteIds)
    const itemFavorite = target.closest('.favorite')
    if(itemFavorite){
      console.log('itemFavorite:', itemFavorite.dataset.videoId)
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

document.addEventListener("DOMContentLoaded", function () {
  init()
});

