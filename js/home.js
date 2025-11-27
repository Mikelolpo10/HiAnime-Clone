function spotlightRender(data) {
  let html = ``

  data.forEach((child, index) => {
    const { film_poster_img, desi_sub_text, desi_head_title, btn_primary_link, btn_secondary_link} = child;

    html += 
      `<div class="carousel-slide" 
      style="
      background: radial-gradient(circle at top center, transparent, #1f1f3070, #1f1f30, #1f1f30), url(${film_poster_img});
      background-size: cover;
      background-repeat: no-repeat;
      ">
        <h2>${desi_sub_text}</h2>
        <h1>${desi_head_title}</h1>
        <div class="carousel-cta">
          <div class="carousel-watch-btn">
            <a href="${btn_primary_link}">
              <i class="fa-solid fa-circle-play"></i>
              Watch Now
            </a>
          </div>
            <a class="carousel-detail-btn" href="${btn_secondary_link}">
              Detail >
            </a>
        </div>
      </div>`
  })

  document.getElementById("spotlight-carousel").innerHTML += html;
}

function trendingRender(data) {
  let html = ``

  data.forEach((child) => {
    const { film_poster_img, desi_sub_text, desi_head_title, btn_primary_link } = child;

    html += 
    `<div class="trending-slide">
      <a href="${btn_primary_link}" title="one-piece"></a>
      <img src="${film_poster_img}" alt="${desi_head_title}">
      <span><strong>${desi_sub_text}</strong></span>
    </div>`
  })

  document.getElementById("trending-slider").innerHTML += html;
}

async function spotlightData() {
  try {
    const res = await fetch("/data/home/main-content/spotlight-carousel.json")
    const data = await res.json()
    
    spotlightRender(data)
    
    const navButtons = document.querySelectorAll(".carousel-nav-option");
    const slides = document.querySelectorAll(".carousel-slide");

    navButtons.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        if (!btn.classList.contains("carousel-nav-option-active")) {
          navButtons.forEach(b => b.classList.remove("carousel-nav-option-active"));
          btn.classList.add("carousel-nav-option-active");
        }

        slides.forEach(slide => {
          slide.style.transform = `translateX(-${index * 100}%)`;
        });
      });
    });
  } catch (err) {
    console.error("❌ ERROR: Gagal memuat spotlight data", err);
  }
}

async function trendingData() {
  try {
    const res = await fetch("/data/home/main-content/trending.json")
    const data = await res.json()

    trendingRender(data)
  } catch (err){
    console.error("❌ ERROR: Gagal memuat trending data", err)
  }
}

function renderMain(btn_primary_link, film_poster_img, desi_head_title, sub_count, dub, btn_secondary_link, type, duration) {
  return `<div class="main-content-card">
    <div class="main-content-card-img">
      <a href="${btn_primary_link}" title="title"></a>
      <img src="${film_poster_img}" alt="">
    </div>
    <div class="main-content-card-meta">
      <a href="${btn_secondary_link}">${desi_head_title}</a>
      <div>
        <span class="card-meta-sub">
          <i class="fa-solid fa-closed-captioning"></i>
          ${sub_count}
        </span>
        ${dub}
        <span class="card-meta-type"><strong>&centerdot;</strong> ${type}</span>
      </div> 
    </div>
  </div>`
}

function renderSecondary(btn_primary_link, film_poster_img, desi_head_title, sub_count, dub, btn_secondary_link, type, duration) {
  return `<div class="secondary-content-card">
    <div class="secondary-content-card-img">
      <a href="${btn_primary_link}" title="title"></a>
      <img src="${film_poster_img}" alt="${desi_head_title}">
      <div>
        <span class="card-sub">
          <i class="fa-solid fa-closed-captioning"></i>
          ${sub_count}
        </span>
        ${dub}
      </div>
    </div>
    <div class="secondary-content-card-meta">
      <a href="${btn_secondary_link}">${desi_head_title}</a>
      <span class="card-type">${type} <strong>&centerdot;</strong> ${duration}</span>
    </div>
  </div>`
}

function renderHtml(data, target, qnty, renderType) {
  let html = ``
  let count = 0

  data.forEach((child) => {
    count++

    const { btn_primary_link, film_poster_img, desi_head_title, sub_count, dub_count, btn_secondary_link, type, duration} = child
    let dubHtml = ``

    if (count <= qnty) {
      if (dub_count === 0) {
        dubHtml = 
        `<span class="card-dub">
          <i class="fa-solid fa-microphone"></i>
          ${dub_count}
        </span>`
      }
      html += renderType(btn_primary_link, film_poster_img, desi_head_title, sub_count, dubHtml, btn_secondary_link, type, duration)
    }
  })

  if (renderType === renderMain) {
    document.getElementById(target).insertAdjacentHTML("beforebegin", html)
  } else {
    document.getElementById(target).innerHTML = html
  }
}



async function factoryFetch(url, target, qnty, renderType) {
  try {
    const res = await fetch(url)
    const data = await res.json()
    renderHtml(data, target, qnty, renderType)
  } catch (err){
    console.error(`❌ ERROR: Gagal memuat ${url}`, err)
  }
}

function renderGenres(data, limit=24) {
  let html = ``
  let indexCount = 1
  let typeCount = 0
  
  data.forEach((child) => {
    if (indexCount <= limit) {
      const { genre, url } = child
      indexCount++
      typeCount++
      
      if (typeCount >= 8) {
        typeCount = 1
      }
      
      html += 
      `<div class="genre-opt genre-type-${typeCount}">
      <a href="${url}" title="${genre}"></a>
      ${genre}
      </div>`
    }
  })
  document.getElementById("genre-wrapper").innerHTML = html
}

async function genresData() {
  try {
    const res = await fetch("/data/home/secondary-content/genres.json")
    const data = await res.json()
    renderGenres(data)
    
    document.getElementById("genres-more").addEventListener("click", function() {
      // if (this.innerText ===`Show more`) {
      //   this.textContent = `Show less`
      //   renderGenres(data, 40)
      // } else {
      //   this.textContent = `Show more`
      //   renderGenres(data, 24)
      // }

      const expanded = this.textContent === "Show more";

      this.textContent = expanded ? "Show less" : "Show more";
      renderGenres(data, expanded ? 40 : 24);
    })
  } catch(err) {
    console.log(`❌ ERROR: Gagal memuat Genres`, err)
  }
}

spotlightData()
trendingData()
factoryFetch("/data/home/main-content/top-airing.json", "top-airing-view-more", 4, renderMain)
factoryFetch("/data/home/main-content/most-popular.json", "most-popular-view-more", 4, renderMain)
factoryFetch("/data/home/main-content/latest-completed.json", "latest-completed-more", 4, renderMain)
factoryFetch("/data/home/secondary-content/latest-episode.json", "latest-episode-card-wrapper", 12, renderSecondary)
factoryFetch("/data/home/secondary-content/new-on-hianime.json", "new-on-hianime-card-wrapper", 12, renderSecondary)
factoryFetch("/data/home/secondary-content/top-upcoming.json", "top-upcoming-card-wrapper", 12, renderSecondary)
genresData()
