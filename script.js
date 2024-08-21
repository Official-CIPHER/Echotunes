// console.log("Lets write javascript");
let currentSong = new Audio();
let songs;
let currFolder;

function secToMin(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;

}

async function getSongs(folder) {
    currFolder = folder
    let a = await fetch(`http://127.0.0.1:5500/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []

    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }
    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li>
                             <img class="invert" src="music.svg" alt="">
                             <div class="info">
                                 <div>${song.replaceAll("%20", " ")}</div>
                                 <div>Vishal</div>
                             </div>
                             <div class="playnow">
                                 <span>Play Now</span>
                                 <img class="invert" src="play.svg" alt="">
                             </div></li>`;
    }

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {

        e.addEventListener('click', element => {
            //  console.log(e.querySelector(".info").firstElementChild.innerHTML.trim());
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })


}

const playMusic = (track, pause = false) => {
    // let audio = new Audio( "/songs/" + track)
    currentSong.src = `/${currFolder}/` + track
    if (!pause) {
        currentSong.play()
        play.src = "pause.svg"
    }
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00 "
}

async function displayAlbums() {

    let a = await fetch(`http://127.0.0.1:5500/songs/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a")
    let array =  Array.from(anchors)
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
            
        if(e.href.includes("/songs/")){
            let folder = e.href.split("/").slice(-1)[0]
            
            // Get the metadata of the folder
            let a = await fetch(`http://127.0.0.1:5500/songs/${folder}/info.json`)
            let response = await a.json();
            console.log(response);
            let cardContainer = document.querySelector(".cardContainer")
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" color="#000000" fill="none">
                                <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="currentColor" stroke-width="1.5" fill="#000" stroke-linejoin="round" />
                            </svg>
                        </div>

                        <img src="./songs/${folder}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
        }
    }


    // load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        // console.log(e);

        e.addEventListener("click", async item => {
            // console.log(item, item.currentTarget.dataset)
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })


}

function likeKaro() {
    // add evnetlistener to like the songs
    let love = document.querySelector("i")

    let con = document.querySelector(".heart")
    let count = 0
    con.addEventListener("click", function() {
        if(count==0){
            love.style.color = "#00ffff"

            count = 1
        }
        else {
            love.style.color = "black"

            count = 0
        }
    })
}



async function main() {
    await getSongs("songs/ncs")

    playMusic(songs[0], true)

    // Display all the album on the page
    displayAlbums()


    // attach an event listener to play, next and previous

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "pause.svg"
        } else {
            currentSong.pause()
            play.src = "play.svg"
        }
    })

    // Listen for time update event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secToMin(currentSong.currentTime)} / ${secToMin(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })

    // add evnetlistener to seekbar

    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = (currentSong.duration) * percent / 100

    })

    // add evnetlistener on hamburger 
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0"
    })
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%"
    })

    //add evnetlistener to previous and next
    previous.addEventListener("click", () => {
        console.log("Previous click")
        // console.log(currentSong)

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })
    next.addEventListener("click", () => {
        // console.log("Next click")
        currentSong.pause()


        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }

    })

    //add evnetlistener volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        // console.log(e,e.target,e.target.value);
        currentSong.volume = parseInt(e.target.value) / 100
    })


    

    // add evnetlistener to mute the volume 
    document.querySelector(".volume>img").addEventListener("click", e => {
        console.log(e.target);
        if (e.target.src.includes("volume.svg")) {
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0
        } else {
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10
        }
    })

    likeKaro()
    
}

main();
