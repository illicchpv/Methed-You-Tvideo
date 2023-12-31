// index.js
// https://console.cloud.google.com/apis/credentials/key/98459311-8184-44ca-bfc5-c44ed49a9925?project=yt-video-402511
const API_KEY = 'AIzaSyAfjt_fFcPVWe3A6YFiAe9jLRBcyzELjdI'
// https://developers.google.com/youtube/v3/docs/videos/list
const VIDEOS_URL = 'https://www.googleapis.com/youtube/v3/videos'
// https://developers.google.com/youtube/v3/docs/search/list
const SEARCH_URL = 'https://www.googleapis.com/youtube/v3/search'

const LS_KEY = 'YTfavorite'
let favoriteIds = JSON.parse(localStorage.getItem(LS_KEY) || '[]')
// console.log('favoriteIds:', favoriteIds)

var videoListItems // = document.querySelector('.video-list__items')
function get_videoListItems(){
  if(videoListItems) return videoListItems
  videoListItems = document.querySelector('.video-list__items')
  return videoListItems
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
    // get_videoListItems().textContent = `
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
    // get_videoListItems().textContent = `
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
    if(get_videoListItems()) get_videoListItems().textContent = `
    <h3>извините, в трендах ничего нет.</h3>
    <h4>fetchTrendingVideo error:${e}</h4>
    `;
  }
}

const displayListVideo = (v) => {
  // console.log( JSON.stringify(v, false, 2) )
  // debugger
  if(!v){
    '<h3>извините, в трендах ничего нет.</h3>'
    return;
  }
  if(get_videoListItems()) get_videoListItems().textContent = ''
  const listVideos = v.items.map(video => {
    const li = document.createElement('li')
    li.classList.add('video-list__item')
    li.innerHTML = fillVideoListTemplate(video) 
    return li
  })
  if(get_videoListItems()) get_videoListItems().append(...listVideos)
}
const displayVideo = ({items: [video]}) => { // v
  // console.log(JSON.stringify(v, false, 2))
  // debugger
  // const video = v.items[0]
  const d = video.snippet.description
  video.snippet.description = replaceAll(d, '\n', '<br>')
  // console.log(JSON.stringify(video.snippet.description, false, 2))
  const videoEl = document.querySelector('.video')
  if(videoEl) videoEl.innerHTML = fillVideoTemplate(video)
}

const init = () =>{
  // console.log('favoriteIds:', favoriteIds)
  const a = []
  favoriteIds.forEach((e)=>{
    if(e) a.push(e);
  })
  favoriteIds = a;
  localStorage.setItem(LS_KEY, JSON.stringify(favoriteIds))
  // console.log('favoriteIds:', favoriteIds)

  const currPage = location.pathname.split("/").pop().toLowerCase()
  const searchParams = new URLSearchParams(location.search)
  const videoId = searchParams.get('id')
  const searchQuery = searchParams.get('q')

  if(currPage === '' || currPage === 'index.html'
    // || currPage === 'test.html'
  ){ // выводим тренды
    // debugger
    console.log('currPage: index.html ')
    fetchTrendingVideo().then(v => {
      displayListVideo(v)
    });

  } else if(currPage === 'favorite.html'
  // || currPage === 'test.html'
  ){
    console.log('currPage: favorite.html')
    fetchFavoriteVideo().then(v => {
      displayListVideo(v)
    });

  } else if(currPage === 'video.html' && videoId
  // || currPage === 'test.html'
  ){
    console.log('currPage: video.html videoId:', videoId)
    // ?id=-BXItmWzWNE
    fetchVideoData(videoId).then(v => {
      displayVideo(v)
    });
    fetchFavoriteVideo().then(v => {
      displayListVideo(v)
    });

  } else if(currPage === 'search.html'
  // || currPage === 'test.html'
  ){
    console.log('currPage: search.html', 'searchQuery:', searchQuery)
    fetchFavoriteVideo().then(v => {
      displayListVideo(v)
    });

  } else {
    console.log('Not supported page:', currPage)
  }

  document.body.addEventListener('click', ({target})=>{
    // debugger
    // console.log('favoriteIds:', favoriteIds)
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

// document.addEventListener("DOMContentLoaded", function () {
//   // videoListItems = document.querySelector('.video-list__items')
//   // init()
// });

const inc_Onload = function (p) {
  // обработчик вставляемых элементов
  p.extEl.innerHTML = IncludHtml.replaceAll(p.extEl.innerHTML, "../image/", "./image/");
};
document.addEventListener("DOMContentLoaded", function () {
  IncludHtml.doIncludAll(".incs", () => {
    console.log("IncludHtml Finish: Ok"); // вызывается когда IncludHtml всё сделал
    init()
  });
});
