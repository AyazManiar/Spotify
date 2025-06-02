console.log("Let's write JavaScript")

// Global Variables
let songs = []
let songUL = document.querySelector('.songList ul')
let currentSong = new Audio()
const slider = document.getElementById("myRange");
const vol = document.getElementById("volume-range")
let vol_text = document.getElementById("vol-value");
// Var slider on hold
let songPaused = false
// Folders
let folders
let currentFolder


// Song Buttons
const play = document.getElementById("play");
const prev = document.getElementById("previous");
const next = document.getElementById("next");
// Other
const hamburger = document.querySelector('.hamburger')
const left = document.querySelector('.left')

// Getting Folders
async function getFolders() {
    const response = await fetch('../assets/songs/');
    const text = await response.text();
    const div = document.createElement('div');
    div.innerHTML = text;

    const folders = [];
    let cardContainer = document.querySelector('.card-container');

    let anchor = div.querySelectorAll('a')
    let array = Array.from(anchor)
    for (let index = 0; index < array.length; index++) {
        const link = array[index];

        if (link.href.includes("/songs/")) {
            const folderName = link.href.split('/').slice(-2)[0];
            folders.push(folderName);
            const a = await fetch(`../assets/songs/${folderName}/info.json`);
            const response = await a.json();
            console.log(response);
            cardContainer.innerHTML+=
                `<div class="card" data-folder=${folderName}>
					<div class="image-container">
						<img src="../assets/songs/${folderName}/cover.jpg" alt="song-cover">
						<img id="green-play-button" src="../assets/images/green-play-button.svg" alt="">
					</div>
					<h3>${response.title}</h3>
					<p>${response.description}</p>
				</div>`
        }
    }

    // Folder(Playlist) Selection
    document.querySelectorAll('.card').forEach(e => {
        e.querySelector('#green-play-button').addEventListener('click', async ()=>{
            console.log("Hi HI HI"+e.dataset.folder)
            await getSongs(e.dataset.folder)
        })
    })

    console.log(folders);
}


// Getting songs
async function getSongs(folder){
    // Fethcing Songs
    currentFolder = folder
    const a = await fetch(`http://127.0.0.1:3000/assets/songs/${currentFolder}/`)
    const response = await a.text()
    console.log(response);

    // Storing link of song link from it
    const div = document.createElement('div')
    div.innerHTML = response
    const as = div.getElementsByTagName('a')
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith('.mp3')){
            songs.push(element.href.split(`/${folder}/`)[1])
        }
    }

    // Insert songs in SongList Card of Library
    songUL.innerHTML = `<h3>${folder}</h3>`
    for (const song of songs) {
        // Get SongName from it
        songUL.innerHTML += 
        `
        <li>
            <div class='songList-left'>
                <img class="invert music-logo" src="../assets/images/music.svg" alt="music-logo">
                <div class="info">
                    <div class="song-name">${song.replace('.mp3', '').replaceAll('%20', ' ')}</div>
                    <div class="song-artist">Ayaz</div>
                </div>
            </div>
            <div class="playnow">
                <span class='pntext'>Play Now</span>
                <img class="invert playSong pointer" src="../assets/images/playbar/play.svg" alt="play">
            </div>
        </li>`
    }

    // Selecting CurrentSong
    songUL.querySelectorAll('li').forEach(e => {
        // Attaching an eventListener to all Songs playnow button
        e.querySelector('.playSong').addEventListener('click', () => {
            // Reset background color of all songs
            songUL.querySelectorAll('li').forEach(li => {
                li.style.backgroundColor = ''
                li.style.filter = 'invert(0)'
                // Resetting text
                li.querySelector('.pntext').innerHTML='Play Now'
            })

            // Play the selected song
            playSong(e.querySelector('.info').firstElementChild.innerHTML)
    
            // Highlight the selected song
            e.style.filter = 'invert(1)';
            e.style.backgroundColor='#C41B88'
            e.querySelector('.pntext').innerHTML='Playing...'
        })
    });


    return songs
}

function playSong(track){
    console.log(`http://127.0.0.1:3000/assets/songs/${currentFolder}/` + track)
    currentSong.src = `http://127.0.0.1:3000/assets/songs/${currentFolder}/` + track+'.mp3'
    currentSong.play()
    songPaused = false

    // Changing Image to pause
    play.src='http://127.0.0.1:3000/assets/images/playbar/pause.svg'
    // Changing Song Name
    document.querySelector('.songinfo').innerHTML = track.replaceAll('%20', ' ')

}

// Convert Seconds to Minutes:Seconds (MM:SS -> 01:12)
function formatTime(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00"; // Fallback for invalid input
    }

    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60); // Take the integer part of seconds

    // Limit seconds to the first two digits
    const limitedSecs = String(secs).padStart(2, '0').slice(0, 2);

    return `${String(minutes).padStart(2, '0')}:${limitedSecs}`;
}


// Function to update the seekbar smoothly
function updateSeekbar() {
    // First checking, if CurrentSong is Selected(from duration)
    if (!currentSong.paused) {
        slider.value = (currentSong.currentTime / currentSong.duration) * 100;
        requestAnimationFrame(updateSeekbar); // Recursively update
    }
}

async function main() {
    // Dynamically, folders are appeard in Card-Container
    // Get all folders
    getFolders()


    songs = await getSongs('Featured')
    console.log(songs);


    // Attaching Event Listener to Song Buttons (previous, play, next)
    play.addEventListener('click', (e)=>{
        if(currentSong.paused){
            currentSong.play()
            songPaused = false
            play.src='../assets/images/playbar/pause.svg'
        }
        else{
            currentSong.pause()
            play.src='../assets/images/playbar/play.svg'
            songPaused = true
        }
    })
    prev.addEventListener('click', (e)=>{
        // Get index of currentSong
        const index = songs.indexOf(currentSong.src.split('/').at(-1))
        // Returns -1 if not found  
        console.log('Clicked previous', index)

        // Check if it's not then first Song
        if(index>0){
            // Change it to previous one
            const track = songs[index-1]
            console.log(track.replace('.mp3', ''))
            playSong(track.replace('.mp3', ''))

            // Update SongUL
            // Get which li it's of
            songUL.querySelectorAll('li').forEach(e => {
                // Find the current Song
                if(e.querySelector('.song-name').innerHTML === track.replace('.mp3', '').replaceAll('%20', ' ')){
                    // Highlight the selected song
                    e.style.filter = 'invert(1)';
                    e.style.backgroundColor='#C41B88'
                    e.querySelector('.pntext').innerHTML='Playing...'
                }
                // Revert back color of the Song before
                if(e.querySelector('.song-name').innerHTML === songs[index].replace('.mp3', '').replaceAll('%20', ' ')){
                    e.style.backgroundColor = ''
                    e.style.filter = 'invert(0)'
                    // Resetting text
                    e.querySelector('.pntext').innerHTML='Play Now'
                }
            });
        }
    })
    next.addEventListener('click', (e)=>{
        // Get index of currentSong
        const index = songs.indexOf(currentSong.src.split('/').at(-1))
        // Returns -1 if not found  
        console.log('Clicked next', index)

        // Check if it's not the last Song
        if(index<songs.length){
            // Change it to next one
            const track = songs[index+1]
            console.log(track.replace('.mp3', ''))
            playSong(track.replace('.mp3', ''))

            // Update SongUL
            // Get which li it's of
            songUL.querySelectorAll('li').forEach(e => {
                // Find the current Song
                if(e.querySelector('.song-name').innerHTML === track.replace('.mp3', '').replaceAll('%20', ' ')){
                    // Highlight the selected song
                    e.style.filter = 'invert(1)';
                    e.style.backgroundColor='#C41B88'
                    e.querySelector('.pntext').innerHTML='Playing...'
                }
                // Revert back color of the Song before
                if(e.querySelector('.song-name').innerHTML === songs[index].replace('.mp3', '').replaceAll('%20', ' ')){
                    e.style.backgroundColor = ''
                    e.style.filter = 'invert(0)'
                    // Resetting text
                    e.querySelector('.pntext').innerHTML='Play Now'
                }
            });
        }
    })




    // Change song time using slider
    // Pause the song while holding the slider
    slider.onmousedown = function () {
        currentSong.pause(); // Pause the song while seeking
    };
    // Play the song after release of the slider
    slider.onmouseup = function () {
        if (!songPaused) {
            currentSong.play(); // Play the song after seeking
            songPaused = false;
        }
    };
    slider.oninput = function () {
        const seekTime = (this.value / 100) * currentSong.duration; // Calculate new time
        currentSong.currentTime = seekTime;
    };
    // Change song volume using slider
    vol.addEventListener('input', ()=>{
        vol_text.innerHTML= parseInt(vol.value)
        currentSong.volume = parseInt(vol.value)/100

        if (vol.value == 0){
            document.querySelector('.path3').style.visibility='hidden'
            document.querySelector('.path3').style.opacity=0

            document.querySelector('.path2').style.visibility='hidden'
            document.querySelector('.path2').style.opacity=0
        }
        else if (vol.value < 50){
            document.querySelector('.path3').style.visibility='hidden'
            document.querySelector('.path3').style.opacity=0

            document.querySelector('.path2').style.visibility='visible'
            document.querySelector('.path2').style.opacity=1
        }
        else{
            document.querySelector('.path3').style.visibility='visible'
            document.querySelector('.path3').style.opacity=1

            document.querySelector('.path2').style.visibility='visible'
            document.querySelector('.path2').style.opacity=1
        }
    })

    



    // Smooth update also when song starts playing
    currentSong.addEventListener('play', () => {
        // Start the cycle when the song starts
        updateSeekbar(); // Start the update cycle 
    });

    // Updating Seekbar in Realtime
    currentSong.addEventListener('timeupdate', ()=>{
        // Updating Time
        document.getElementById('cur-time').innerHTML = `${formatTime(currentSong.currentTime)}`
        document.getElementById('rem-time').innerHTML = `${formatTime(currentSong.duration)}`
        
        // Updating Seekbar value
        slider.value = (currentSong.currentTime/currentSong.duration)*100
    })


    // Hamburger
    // Showing Hamburger
    hamburger.addEventListener('click', (e)=>{
        e.stopPropagation(); // Prevent the click from bubbling to the document
        const left = document.querySelector('.left')
        left.style.left='-2%'
    })
    // Hiding again when clicking cancel
    const cancel = document.querySelector('.cancel')
    cancel.addEventListener('click', (event) => {
        left.style.left = '-120%'; // Hide sidebar
    });


    
    
}
main()

