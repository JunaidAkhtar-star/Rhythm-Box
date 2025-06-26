const sidebar = document.getElementById('sidebar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.querySelectorAll('.nav-link');
const miniPlayPauseBtn = document.getElementById('mini-play-pause-btn');
const miniPlayIcon = document.getElementById('mini-play-icon');
const miniPauseIcon = document.getElementById('mini-pause-icon');
const audioSource = document.getElementById('audio-source');
const progressBar = document.getElementById('progress-bar');
const currentTimeSpan = document.getElementById('current-time');
const totalDurationSpan = document.getElementById('total-duration');
const volumeControl = document.getElementById('volume-control');
const playerSongTitle = document.getElementById('player-song-title');
const playerArtistName = document.getElementById('player-artist-name');
const playerCoverArt = document.getElementById('player-cover-art');
const newReleasesContainer = document.getElementById('new-releases-container');
const visualizerContainer = document.getElementById('visualizer-bars');
const artistsContainer = document.getElementById('artists-container');
const prevSongBtn = document.getElementById('prev-song-btn');
const nextSongBtn = document.getElementById('next-song-btn');
const addToLikedBtn = document.getElementById('add-to-liked-btn'); 

// Content Sections
const homeSection = document.getElementById('home-section');
const newReleasesSection = document.getElementById('new-releases-section');
const artistsSection = document.getElementById('artists-section');
const likedSongsSection = document.getElementById('liked-songs-section');
const likedSongsContainer = document.getElementById('liked-songs-container'); // Container for liked song cards

// Placeholder sections for other sidebar links
const searchSection = document.getElementById('search-section');
const librarySection = document.getElementById('library-section');
const playlistSection = document.getElementById('playlist-section');
const aboutSection = document.getElementById('about-section');
const contactsSection = document.getElementById('contacts-section');

let isPlaying = false; // Track playback state
let currentPlayingSongIndex = -1; // Stores the index of the currently loaded song
let likedSongs = new Set(); // Stores titles of liked songs for easy lookup

// --- Web Audio API variables for Visualizer ---
let audioContext;
let analyser;
let sourceNode;
let frequencyData;
const numberOfBars = 50; // Number of visualizer bars

// --- Hardcoded Song Data ---
const hindiSongs = [
    {
        title: "Sanam Teri Kasam",
        artist: "Himesh Reshmiya, Arijit Singh",
        cover: "https://www.koimoi.com/wp-content/new-galleries/2016/02/sanam-teri-kasam-review-2.jpg",
        audioSrc: "https://aac.saavncdn.com/820/8799d2eb43ce358038fd365558ce5811_160.mp4"
    },
    {
        title: "Dil ko karaar aaya",
        artist: " Neha Kakkar, Yasser Desai",
        cover: "https://c.saavncdn.com/290/Dil-Ko-Karaar-Aaya-From-Sukoon--Hindi-2020-20200727072824-500x500.jpg",
        audioSrc: "https://aac.saavncdn.com/290/b113092776f404910a044f834ba7eab4_160.mp4"
    },
    {
        title: "Tujhe Sochta Hoon",
        artist: "Pritam, KK",
        cover: "https://c.saavncdn.com/584/Jannat-2-Original-Motion-Picture-Soundtrack-Hindi-2012-20230412161822-500x500.jpg",
        audioSrc: "https://aac.saavncdn.com/584/0aba2e4d53ce969f083b71fbb67ec81f_160.mp4"
    },
    {
        title: "Pal pal dil ke paas",
        artist: "Kishore Kumar",
        cover: "https://c.saavncdn.com/821/Blackmail-Hindi-1973-20190924060932-500x500.jpg",
        audioSrc: "https://aac.saavncdn.com/821/fc6676156d0bab59229fc17f48ad2956_160.mp4"
    },
    {
        title: "Apna Bana Le Piya",
        artist: "Sachin jigar, Arijit singh",
        cover: "https://c.saavncdn.com/815/Bhediya-Hindi-2023-20230927155213-500x500.jpg",
        audioSrc: "https://aac.saavncdn.com/815/483a6e118e8108cbb3e5cd8701674f32_160.mp4"
    },
    {
        title: "Wada Raha Sanam",
        artist: "Udit Narayan, Shreya Ghoshal",
        cover: "https://c.saavncdn.com/817/Khakee-Hindi-2003-20221201092105-500x500.jpg",
        audioSrc: "https://aac.saavncdn.com/817/e359d4f0f07138ed5205ca7728eceb00_160.mp4"
    },
    {
        title: "Tujhe Bhula Diya Hai",
        artist: "Shekhar Ravjiani, Mohit Chauhan, Shruti Pathak",
        cover: "https://c.saavncdn.com/113/Anjaana-Anjaani-Hindi-2010-20241205131037-500x500.jpg",
        audioSrc: "https://aac.saavncdn.com/664/c71ac17cd40718ab5371a9d8d86b8bcc_160.mp4"
    },
    {
        title: "Har Faun Maula",
        artist: "Vishal Dadlani, Zara Khan",
        cover: "https://c.saavncdn.com/316/Koi-Jaane-Na-Hindi-2021-20210401141001-500x500.jpg",
        audioSrc: "https://aac.saavncdn.com/316/d0e78647fe9f75e1671dc8f48dc019e0_160.mp4"
    },
            {
                title: "Tu Hi Meri Shab Hai",
                artist: "KK, Pritam",
                cover: "https://c.saavncdn.com/810/Gangster-Hindi-2024-20240330053536-500x500.jpg",
                audioSrc: "https://aac.saavncdn.com/810/52b6b12c661d18d3cf86fe9dbf855199_160.mp4"
            },
            {
                title: "Hawa Banke",
                artist: "Darshan Raval",
                cover: "https://c.saavncdn.com/751/Hawa-Banke-Single-Punjabi-2019-20190710170223-500x500.jpg",
                audioSrc: "https://aac.saavncdn.com/751/0f95a1efad8027d16f31a4a4598b9f4c_160.mp4"
            },
            {
                title: "Judai",
                artist: "Pritam, Kamran Ahmad",
                cover: "https://c.saavncdn.com/801/Jannat-Hindi-2008-20190629135803-500x500.jpg",
                audioSrc: "https://aac.saavncdn.com/801/0a6db325afd5393e499b37d38bf687de_160.mp4"
            },
            {
                title: "Guzarish",
                artist: "Javed Ali",
                cover: "https://i.ytimg.com/vi/cK9h5PVzRpk/maxresdefault.jpg",
                audioSrc: "https://aac.saavncdn.com/464/570aab5bd10a7537076705d622728fed_160.mp4"
            }
        ];

        // --- Hardcoded Artist Data ---
        const artists = [
            {
                name: "Arijit Singh",
                image: "https://i.scdn.co/image/ab6761610000e5eb5ba2d75eb08a2d672f9b69b7",
                description: "One of the most versatile playback singers in India, known for his soulful voice."
            },
            {
                name: "KK",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZw98dZT5KW7bXK_LmyHpgUah2Vw_f-ZRy1Q&s",
                description: "He is a famous Indian playback singer who is noted for having a voice that is both soulful and melodic"
            },
            {
                name: "Shreya Ghoshal",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-1zcGmJbiBxESEPD2Dnon0Ddb0Ky3QSqMlg&s",
                description: "An acclaimed Indian playback singer, known for her wide vocal range."
            },
            {
                name: "Atif Aslam",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS1y6oC-Egw9ky3oB1WPtifzsyu2nlwW_WwtA&s",
                description: "A Pakistani playback singer and actor, popular for his distinct vocal style."
            },
            {
                name: "Neha Kakkar",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ8bK4dGGaKrJk8irfeUigGxpmL0COeE0X-xQ&s",
                description: "A popular Indian singer, known for her peppy and energetic songs."
            },
            {
                name: "Badshah",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRfhRnggkmpTb6I6K65gTLlkz4JBrWxF53ctQ&s",
                description: "An Indian rapper, singer, and music producer, known for his Hindi, Haryanvi, and Punjabi songs."
            },
            {
                name: "Jubin Nautiyal",
                image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThgTTV1LifZxSORWoKFpWJwhS2YstqOPtEgQ&s",
                description: "He showed interest in music from a very young age and by the time he turned 18"
            }
        ];

        // --- Utility Functions ---
        /**
         * Formats time from seconds into MM:SS format.
         * @param {number} seconds - The total time in seconds.
         * @returns {string} Formatted time string.
         */
        function formatTime(seconds) {
            const minutes = Math.floor(seconds / 60);
            const secs = Math.floor(seconds % 60);
            return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
        }

        // --- Audio Playback Functions ---
        /**
         * Loads a song into the audio player and updates mini-player UI.
         * @param {Object} song - The song object containing title, artist, cover, and audioSrc.
         * @param {number} index - The index of the song in the hindiSongs array.
         */
        function loadSong(song, index) {
            audioSource.src = song.audioSrc;
            // Crucial for Web Audio API to work with cross-origin audio
            audioSource.crossOrigin = "anonymous";
            playerSongTitle.textContent = song.title;
            playerArtistName.textContent = song.artist;
            playerCoverArt.src = song.cover;
            currentPlayingSongIndex = index;

            // Update liked status of the mini-player button
            updateLikedButtonState();

            // Load the audio to get its duration
            audioSource.load();
            audioSource.onloadedmetadata = () => {
                totalDurationSpan.textContent = formatTime(audioSource.duration);
                progressBar.max = audioSource.duration;
            };

            // Initialize visualizer when a song is loaded (first time playback or new song)
            if (!audioContext) {
                initAudioVisualizer();
            }
        }

        /**
         * Toggles play/pause state of the audio.
         */
        function togglePlayPause() {
            if (!audioSource.src) {
                // If no song is loaded, load the first song and play it
                if (hindiSongs.length > 0) {
                    loadSong(hindiSongs[0], 0);
                    playSong();
                }
                return;
            }

            if (isPlaying) {
                pauseSong();
            } else {
                playSong();
            }
        }

        /**
         * Plays the current song.
         */
        function playSong() {
            audioSource.play();
            miniPlayIcon.classList.add('hidden');
            miniPauseIcon.classList.remove('hidden');
            isPlaying = true;
            // Resume audio context if it's suspended (required by many browsers)
            if (audioContext && audioContext.state === 'suspended') {
                audioContext.resume().then(() => {
                    console.log('AudioContext resumed successfully');
                }).catch(e => console.error('Error resuming AudioContext:', e));
            }
            requestAnimationFrame(updateVisualizer); // Start visualizer animation
        }

        /**
         * Pauses the current song.
         */
        function pauseSong() {
            audioSource.pause();
            miniPlayIcon.classList.remove('hidden');
            miniPauseIcon.classList.add('hidden');
            isPlaying = false;
        }

        /**
         * Plays the previous song in the list.
         */
        function playPreviousSong() {
            if (hindiSongs.length === 0) return; // No songs to play

            if (currentPlayingSongIndex > 0) {
                loadSong(hindiSongs[currentPlayingSongIndex - 1], currentPlayingSongIndex - 1);
                playSong();
            } else {
                // Loop to the last song if at the beginning
                loadSong(hindiSongs[hindiSongs.length - 1], hindiSongs.length - 1);
                playSong();
            }
        }

        /**
         * Plays the next song in the list.
         */
        function playNextSong() {
            if (hindiSongs.length === 0) return; // No songs to play

            if (currentPlayingSongIndex < hindiSongs.length - 1) {
                loadSong(hindiSongs[currentPlayingSongIndex + 1], currentPlayingSongIndex + 1);
                playSong();
            } else {
                // Loop to the first song if at the end
                loadSong(hindiSongs[0], 0);
                playSong();
            }
        }

        /**
         * Toggles the liked status of a given song.
         * @param {Object} songToToggle - The song object to toggle liked status for.
         * @param {HTMLElement} [iconElement=null] - The specific icon element to update visually (e.g., from a card or mini-player).
         */
        function toggleLikedStatus(songToToggle, iconElement = null) {
            // If songToToggle is not provided, assume it's from the mini-player and use the current playing song
            if (!songToToggle) {
                if (currentPlayingSongIndex === -1) {
                    console.log("No song currently playing to like/unlike.");
                    return;
                }
                songToToggle = hindiSongs[currentPlayingSongIndex];
                iconElement = addToLikedBtn.querySelector('i'); // Default to mini-player icon
            }

            const songTitle = songToToggle.title;

            if (likedSongs.has(songTitle)) {
                // Unlike the song
                likedSongs.delete(songTitle);
                if (iconElement) {
                    iconElement.classList.remove('fas', 'text-fuchsia-400', 'animate-pop');
                    iconElement.classList.add('far', 'text-gray-400');
                }
            } else {
                // Like the song
                likedSongs.add(songTitle);
                if (iconElement) {
                    iconElement.classList.remove('far', 'text-gray-400');
                    iconElement.classList.add('fas', 'text-fuchsia-400', 'animate-pop');
                    // Remove animation class after it completes to allow re-triggering
                    iconElement.addEventListener('animationend', () => {
                        iconElement.classList.remove('animate-pop');
                    }, { once: true });
                }
            }
            console.log("Liked songs:", Array.from(likedSongs));

            // If currently viewing the liked songs section, re-render it to reflect changes
            if (!likedSongsSection.classList.contains('hidden')) {
                renderLikedSongs();
            }
            
            // If the song being liked/unliked is the currently playing song, update the mini-player's heart icon state
            if (currentPlayingSongIndex !== -1 && hindiSongs[currentPlayingSongIndex].title === songTitle) {
                 updateLikedButtonState();
            }
        }

        /**
         * Updates the state of the "Add to Liked Songs" button (mini-player).
         */
        function updateLikedButtonState() {
            const miniPlayerLikedIcon = addToLikedBtn.querySelector('i');
            if (currentPlayingSongIndex !== -1 && likedSongs.has(hindiSongs[currentPlayingSongIndex].title)) {
                miniPlayerLikedIcon.classList.remove('far', 'text-gray-400');
                miniPlayerLikedIcon.classList.add('fas', 'text-fuchsia-400');
            } else {
                miniPlayerLikedIcon.classList.remove('fas', 'text-fuchsia-400');
                miniPlayerLikedIcon.classList.add('far', 'text-gray-400');
            }
        }

        // --- Audio Visualizer Functions ---
        /**
         * Initializes the Web Audio API for the visualizer.
         */
        function initAudioVisualizer() {
            try {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyser = audioContext.createAnalyser();
                sourceNode = audioContext.createMediaElementSource(audioSource);
                
                sourceNode.connect(analyser);
                analyser.connect(audioContext.destination);

                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                frequencyData = new Uint8Array(bufferLength);

                createVisualizerBars();
                console.log('AudioContext initialized');
            } catch (e) {
                console.error('Web Audio API is not supported in this browser or failed to initialize:', e);
            }
        }

        /**
         * Creates the visualizer bars dynamically.
         */
        function createVisualizerBars() {
            visualizerContainer.innerHTML = ''; // Clear existing bars
            for (let i = 0; i < numberOfBars; i++) {
                const bar = document.createElement('div');
                bar.classList.add('visualizer-bar', 'rounded-full');
                visualizerContainer.appendChild(bar);
            }
        }

        /**
         * Updates the height of the visualizer bars based on audio frequency data.
         */
        function updateVisualizer() {
            if (!analyser || !isPlaying) {
                // Stop the animation loop if not playing or analyser not ready
                if (analyser && !isPlaying) {
                    // Reset bars to minimum height when paused
                    const bars = visualizerContainer.children;
                    for (let i = 0; i < bars.length; i++) {
                        bars[i].style.height = '2px'; // Minimum height
                    }
                }
                return;
            }

            analyser.getByteFrequencyData(frequencyData);
            const bars = visualizerContainer.children;
            const barWidth = visualizerContainer.clientWidth / numberOfBars;

            for (let i = 0; i < numberOfBars; i++) {
                const bar = bars[i];
                if (bar) {
                    // Map frequency data to bar height (0-80px for visualizer-container height)
                    // Take average of a segment of frequency data for each bar
                    const dataIndex = Math.floor(i * (frequencyData.length / numberOfBars));
                    const height = (frequencyData[dataIndex] / 255) * 78 + 2; // Scale to 2px-80px
                    bar.style.height = `${height}px`;

                    // Dynamic color based on height
                    const hue = (height / 80) * 180 + 200; // Hue from purple to blue
                    bar.style.backgroundColor = `hsl(${hue}, 80%, 60%)`;
                }
            }
            requestAnimationFrame(updateVisualizer);
        }

        // --- UI Rendering Functions ---
        /**
         * Renders music cards into the specified container.
         * @param {Array<Object>} songs - Array of song objects.
         * @param {HTMLElement} container - The DOM element to render cards into.
         */
        function renderMusicCards(songs, container) {
            container.innerHTML = ''; // Clear existing content
            songs.forEach((song, index) => {
                const card = document.createElement('div');
                // Added 'relative' to the card for absolute positioning of the heart icon
                card.classList.add('relative', 'flex-none', 'w-40', 'bg-gray-800', 'p-3', 'rounded-lg', 'shadow-lg', 'transform', 'hover:scale-105', 'transition-transform', 'duration-200', 'cursor-pointer');
                card.innerHTML = `
                    <img src="${song.cover}" alt="${song.title}" class="w-full h-32 object-cover rounded-md mb-3">
                    <h4 class="text-white font-semibold text-sm truncate">${song.title}</h4>
                    <p class="text-gray-400 text-xs truncate">${song.artist}</p>
                    <button class="absolute bottom-2 right-2 text-xl z-10 transition-colors duration-200 focus:outline-none" aria-label="Like song">
                        <i class="${likedSongs.has(song.title) ? 'fas fa-heart text-fuchsia-400' : 'far fa-heart text-gray-400'}"></i>
                    </button>
                `;
                
                // Get the newly created like button within this card
                const likeButton = card.querySelector('button');

                // Add event listener to the like button, stopping propagation
                likeButton.addEventListener('click', (event) => {
                    event.stopPropagation(); // Prevent the card's click event from firing
                    toggleLikedStatus(song, likeButton.querySelector('i'));
                });

                // Add event listener to the entire card to play the song
                card.addEventListener('click', () => {
                    loadSong(song, index);
                    playSong();
                });
                container.appendChild(card);
            });
        }

        /**
         * Renders artist cards into the specified container.
         * @param {Array<Object>} artistsData - Array of artist objects.
         * @param {HTMLElement} container - The DOM element to render cards into.
         */
        function renderArtistCards(artistsData, container) {
            container.innerHTML = ''; // Clear existing content
            artistsData.forEach(artist => {
                const card = document.createElement('div');
                card.classList.add('flex-none', 'w-40', 'flex', 'flex-col', 'items-center', 'bg-gray-800', 'p-3', 'rounded-lg', 'shadow-lg', 'transform', 'hover:scale-105', 'transition-transform', 'duration-200', 'cursor-pointer');
                card.innerHTML = `
                    <img src="${artist.image}" alt="${artist.name}" class="w-32 h-32 object-cover rounded-full mb-3">
                    <h4 class="text-white font-semibold text-sm text-center">${artist.name}</h4>
                    <p class="text-gray-400 text-xs text-center truncate w-full">${artist.description}</p>
                `;
                // Add click event for artist profile page or filter by artist
                card.addEventListener('click', () => {
                    console.log(`Clicked on artist: ${artist.name}`);
                    // Future: navigate to artist page or filter songs by this artist
                });
                container.appendChild(card);
            });
        }

        /**
         * Renders liked songs into the dedicated liked songs container.
         */
        function renderLikedSongs() {
            likedSongsContainer.innerHTML = ''; // Clear previous content
            if (likedSongs.size === 0) {
                likedSongsContainer.innerHTML = '<p class="text-gray-400 text-lg p-4">You haven\'t liked any songs yet. Like some music to see it here!</p>';
                return;
            }

            // Filter hindiSongs to get only the liked ones, maintaining original song object structure
            const filteredLikedSongs = hindiSongs.filter(song => likedSongs.has(song.title));
            
            if (filteredLikedSongs.length === 0) {
                 likedSongsContainer.innerHTML = '<p class="text-gray-400 text-lg p-4">No liked songs found from our list.</p>';
            } else {
                filteredLikedSongs.forEach((song) => {
                    const card = document.createElement('div');
                    card.classList.add('relative', 'w-full', 'sm:w-auto', 'bg-gray-800', 'p-3', 'rounded-lg', 'shadow-lg', 'transform', 'hover:scale-105', 'transition-transform', 'duration-200', 'cursor-pointer');
                    
                    // Find the original index for loading, needed for playNext/PrevSong logic
                    const originalIndex = hindiSongs.findIndex(s => s.title === song.title);
                    
                    card.innerHTML = `
                        <img src="${song.cover}" alt="${song.title}" class="w-full h-32 object-cover rounded-md mb-3">
                        <h4 class="text-white font-semibold text-sm truncate">${song.title}</h4>
                        <p class="text-gray-400 text-xs truncate">${song.artist}</p>
                        <button class="absolute bottom-2 right-2 text-xl z-10 transition-colors duration-200 focus:outline-none" aria-label="Unlike song">
                            <i class="fas fa-heart text-fuchsia-400"></i>
                        </button>
                    `;

                    // Get the newly created like button within this card
                    const likeButton = card.querySelector('button');

                    // Add event listener to the like button, stopping propagation
                    likeButton.addEventListener('click', (event) => {
                        event.stopPropagation(); // Prevent the card's click event from firing
                        toggleLikedStatus(song, likeButton.querySelector('i'));
                    });

                    card.addEventListener('click', () => {
                        loadSong(song, originalIndex);
                        playSong();
                    });
                    likedSongsContainer.appendChild(card);
                });
            }
        }

        // --- Event Listeners ---
        // Toggle sidebar on hamburger click (mobile)
        hamburger.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });

        // Mapping of data-section to DOM section elements
        const contentSections = {
            'home': homeSection,
            'search': searchSection,
            'library': librarySection,
            'playlist': playlistSection,
            'liked-songs': likedSongsSection,
            'about': aboutSection,
            'contacts': contactsSection,
        };

        // Function to hide all content sections
        function hideAllContentSections() {
            Object.values(contentSections).forEach(section => {
                if (section) section.classList.add('hidden');
            });
            // Also hide new releases and artists sections as they are part of the 'home' view
            newReleasesSection.classList.add('hidden');
            artistsSection.classList.add('hidden');
        }

        // Handle navigation link clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (event) => {
                event.preventDefault(); // Prevent default link behavior

                // Remove active class from all links
                navLinks.forEach(nav => nav.classList.remove('active'));
                // Add active class to the clicked link
                link.classList.add('active');

                // Get the target section from data-section attribute
                const targetSectionId = link.dataset.section;

                hideAllContentSections(); // Hide all sections first

                // Show the relevant section(s)
                if (targetSectionId === 'home') {
                    homeSection.classList.remove('hidden');
                    newReleasesSection.classList.remove('hidden'); // Show along with home
                    artistsSection.classList.remove('hidden');     // Show along with home
                } else if (targetSectionId === 'liked-songs') {
                    likedSongsSection.classList.remove('hidden');
                    renderLikedSongs(); // Render liked songs when navigated to this section
                } else {
                    const sectionToShow = contentSections[targetSectionId];
                    if (sectionToShow) {
                        sectionToShow.classList.remove('hidden');
                    }
                }

                // For mobile, close the sidebar after clicking a link
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('active');
                }
            });
        });

        // Mini-player controls
        miniPlayPauseBtn.addEventListener('click', () => togglePlayPause());
        prevSongBtn.addEventListener('click', () => playPreviousSong());
        nextSongBtn.addEventListener('click', () => playNextSong());
        // Updated call to toggleLikedStatus for mini-player
        addToLikedBtn.addEventListener('click', () => toggleLikedStatus(null)); 

        // Audio progress bar
        audioSource.addEventListener('timeupdate', () => {
            progressBar.value = audioSource.currentTime;
            currentTimeSpan.textContent = formatTime(audioSource.currentTime);
        });

        // Handle song ending
        audioSource.addEventListener('ended', () => {
            playNextSong(); // Automatically play the next song
        });

        progressBar.addEventListener('input', () => {
            audioSource.currentTime = progressBar.value;
        });

        // Volume control
        volumeControl.addEventListener('input', () => {
            audioSource.volume = volumeControl.value / 100;
        });

        // Initial render of music and artist cards
        window.addEventListener('load', () => {
            renderMusicCards(hindiSongs, newReleasesContainer);
            renderArtistCards(artists, artistsContainer);
            // Optionally load the first song on page load, but don't autoplay due to browser policies
            if (hindiSongs.length > 0) {
                loadSong(hindiSongs[0], 0);
                pauseSong(); // Ensure it's paused initially
            }
            // Ensure only home section is visible by default
            hideAllContentSections();
            homeSection.classList.remove('hidden');
            newReleasesSection.classList.remove('hidden');
            artistsSection.classList.remove('hidden');
        });

        // Adjust sidebar and content area based on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth >= 768) {
                sidebar.classList.remove('active'); // Ensure sidebar is visible on desktop
            }
            // Recalculate and recreate bars if needed, but the current visualizer is robust enough.
            // createVisualizerBars(); // Recreate bars on resize if their dimensions change significantly
        });

        // Initial visualizer bar creation (can also be done in initAudioVisualizer)
        createVisualizerBars();