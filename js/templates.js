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
    <button class="video__link favorite 
        ${favoriteIds.includes(video.id)?'active':''}"
        data-video-id="${video.id}">
      <span class="video__no-favorite">Избранное</span>
      <span class="video__favorite">В избранном</span>

      <!-- покрасить *  -->
      <svg class="video__icon">
        <use xlink:href="./image/sprite.svg#star-ob"></use>
        <use class="star" xlink:href="./image/sprite.svg#star"></use>
      </svg>
    </button>
  </div>
</div>
`);
