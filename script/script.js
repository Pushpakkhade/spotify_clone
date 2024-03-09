let currentSong = new Audio;
let songs;
let currentSongIndex = 0

async function getSongs(folder) {
  let currFolder = folder
  let a = await fetch(`http://127.0.0.1:5500/${folder}`)
  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  songs = []
  let as = div.getElementsByTagName("a")
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`${folder}/`)[1].replaceAll("%20", " "))
    }
  }

  let list = document.querySelector(".songlist").getElementsByTagName('ul')[0]
  list.innerHTML = " "
  for (const song of songs) {

    list.innerHTML = list.innerHTML + `<li> <img class="invert" src="svg/music.svg" alt="music">
                                    <div class="info">
                                        <div id = songs>${song.replaceAll(".mp3", "")}</div>
                                        
                                    </div>
                                    <div class="playnow">
                                        <span>Play now</span>
                                        <img class="invert" src="svg/play.svg" alt="play">
                                    </div></li>`
  }

  function playSong(song) {
    currentSong.src = `http://127.0.0.1:5500/${currFolder}/${song + ".mp3"}`;
    currentSong.play();
    

  }

  let elements = document.querySelectorAll("li")
  if (elements) {

    elements.forEach(element => {
      element.addEventListener("click", e => {
        let info = e.target.closest("li").querySelector(".info")
        let music = info.firstElementChild.innerHTML
        document.querySelector(".songinfo").innerHTML = music.replace(".mp3", "")

        playSong(music)

      });
    });
  }

  function time(seconds) {
    if (isNaN(seconds) || seconds < 0) {
      return "00:00"
    }

    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)

    const formattedMinutes = String(minutes).padStart(2, '0')
    const formattedSeconds = String(remainingSeconds).padStart(2, '0')


    return `${formattedMinutes}:${formattedSeconds}`
  }

  currentSong.src = `http://127.0.0.1:5500/${folder}/${songs[0]}`;
  document.querySelector(".songinfo").innerHTML = songs[0].replace(".mp3", "")
  currentSong.addEventListener("loadedmetadata", () => {
    document.querySelector(".songtime").innerHTML = `${time(currentSong.currentTime)}/${time(currentSong.duration)}`


    document.querySelector(".songtime").innerHTML = `${time(currentSong.currentTime)}/${time(currentSong.duration)}`


    currentSong.addEventListener("timeupdate", function () {
      document.querySelector(".songtime").innerHTML = `${time(currentSong.currentTime)}/${time(currentSong.duration)}`
      document.querySelector(".circle").style.left = (currentSong.currentTime) / (currentSong.duration) * 99 + "%"
    });

    range = document.querySelector(".range").getElementsByTagName("input")[0]
    range.addEventListener("change", function () {
      let one = (range.value) / 100
      currentSong.volume = one
      if (one > 0) {
        mute.setAttribute("src", "svg/volume.svg")
      }
    })

    let mute = document.querySelector(".volume>img")
    mute.addEventListener("click", () => {
      if (mute.src.endsWith("svg/volume.svg")) {
        mute.src = "svg/mute.svg"
        range.value = 0
        currentSong.volume = 0
      }
      else {
        mute.src = "svg/volume.svg"
        range.value = 50
        currentSong.volume = 0.5
      }

    })
    
    currentSong.addEventListener("playing", function () {
      pause.setAttribute("src", "pause.svg")
      if (pause.src.endsWith("pause.svg")) {
        currentSong.play()
      }
    })

    currentSong.addEventListener("ended", function () {
      currentSongIndex++
      if (currentSong >= songs.length) {
        currentSongIndex = 1
      }
      let ending = songs[currentSongIndex]
      playSong(ending.replace(".mp3", ''))
      document.querySelector(".songinfo").innerHTML = ending.replace(".mp3", "");
    })

    let next = document.querySelector(".songbutton").getElementsByTagName("img")[2]
    let isPlaying = false;

    next.addEventListener("click", () => {
      if(!isPlaying){
        currentSongIndex = (currentSongIndex + 1) % songs.length
        console.log(currentSongIndex);
        let nextSong = songs[currentSongIndex]
        playSong(nextSong.replace(".mp3", ''))
        document.querySelector(".songinfo").innerHTML = nextSong.replace(".mp3", "");
        currentSong.addEventListener("playing", ()=>{
          isPlaying = true
        })
      }
    })

    let previous = document.querySelector(".songbutton").getElementsByTagName("img")[0]
    previous.addEventListener("click", function () {
      if(!isPlaying){
        currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length
        console.log(currentSongIndex);
        let previousSong = songs[currentSongIndex]
        playSong(previousSong.replace(".mp3", ''))
        document.querySelector(".songinfo").innerHTML = previousSong.replace(".mp3", "");
        currentSong.addEventListener("playing", ()=>{
          isPlaying = true
        })
      }
    })

    let hamburger = document.querySelector(".hamburger")
    hamburger.addEventListener("click", () => {
      document.querySelector(".left").style.left = 0 + "%"
    })

    let close = document.querySelector(".close")
    close.addEventListener("click", () => {
      document.querySelector(".left").style.left = -120 + "%"
    })

  })
}
getSongs("songs/Bollywood")

let pause = document.querySelector(".songbutton").getElementsByTagName("img")[1]
pause.addEventListener("click", () => {
  if (currentSong.play()) {
    currentSong.pause() == true
    pause.src = "svg/play.svg"
  }
})
document.querySelector(".seekbar").addEventListener("click", e => {
  let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
  document.querySelector(".circle").style.left = percent + "%"
  currentSong.currentTime = ((currentSong.duration) * percent) / 100
})

async function displayAlbum(songs) {
  let a = await fetch(`http://127.0.0.1:5500/songs`)
  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  let cardContainer = document.querySelector(".cardContainer")
  let anchors = div.getElementsByTagName("a")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs/")) {
      let folder = e.href.split('/songs/').slice(-1)[0]
      let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
      let response = await a.json()
      cardContainer.innerHTML = cardContainer.innerHTML + `  <div data-folder="${folder}" class="card font">
              <div class="play">
                  <svg width ="16" height ="16" viewBox ="0 0 24 24" fill = "none" xmlns ="http://www.w3.org/2000/svg"></svg>
                  <svg style="position: relative; right: 4px;" xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 23 23" fill="none">
                      <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" stroke-width="3" stroke-linejoin="round"/>
                  </svg>
              </div>
  
              <img src="/songs/${folder}/covers.jpg" alt="scdn">
              <h2>${response.title}</h2>
              <p>${response.description}</p>
          </div>`
    }
  }

  Array.from(document.getElementsByClassName("card")).forEach(e => {
    e.addEventListener("click", async item => {
      songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
    })
  })
}

displayAlbum(songs)












