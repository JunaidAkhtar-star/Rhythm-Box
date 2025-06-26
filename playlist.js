const mainPlaylistView = document.getElementById('main-playlist-view');
        const playlistDetailView = document.getElementById('playlist-detail-view');
        const backToPlaylistsBtn = document.getElementById('back-to-playlists-btn');
        const playlistNameInput = document.getElementById('playlist-name');
        const playlistDescriptionInput = document.getElementById('playlist-description');
        const createPlaylistBtn = document.getElementById('create-playlist-btn');
        const playlistMessage = document.getElementById('playlist-message');
        const userPlaylistsContainer = document.getElementById('user-playlists-container');
        const noPlaylistsMessage = document.getElementById('no-playlists-message');

        const detailPlaylistCover = document.getElementById('detail-playlist-cover');
        const detailPlaylistName = document.getElementById('detail-playlist-name');
        const detailPlaylistDescription = document.getElementById('detail-playlist-description');
        const songsInCurrentPlaylistContainer = document.getElementById('songs-in-current-playlist');
        const noSongsInPlaylistMessage = document.getElementById('no-songs-in-playlist-message');
        const songsInPlaylistCount = document.getElementById('songs-in-playlist-count');
        const songSearchInput = document.getElementById('song-search-input');
        const availableSongsContainer = document.getElementById('available-songs-container');
        const deletePlaylistBtn = document.getElementById('delete-playlist-btn');

        // Modal elements
        const customModalOverlay = document.getElementById('custom-modal-overlay');
        const modalTitle = document.getElementById('modal-title');
        const modalMessage = document.getElementById('modal-message');
        const modalConfirmBtn = document.getElementById('modal-confirm-btn');
        const modalCancelBtn = document.getElementById('modal-cancel-btn');

        let userPlaylists = []; // Array to store user-created playlists
        let currentViewingPlaylistId = null; // To keep track of which playlist is open in detail view
        let resolveModalPromise; // Used to resolve the promise for custom confirm

        // --- Hardcoded Song Data (from previous context) ---
        const hindiSongs = [
            {
                title: "Sanam Teri Kasam",
                artist: "Himesh Reshmiya, Arijit Singh",
                cover: "https://www.koimoi.com/wp-content/new-galleries/2016/02/sanam-teri-kasam-review-2.jpg",
                audioSrc: "https://aac.saavncdn.com/820/8799d2eb43ce358038fd365558ce5811_160.mp4"
            },
            {
                title: "Dil ko karaar aaya",
                artist: "Neha Kakkar, Yasser Desai",
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


        // --- Utility Functions (Updated to use custom modals) ---

        /**
         * Shows a custom alert modal.
         * @param {string} message - The message content.
         * @param {string} title - The title of the alert.
         * @returns {Promise<void>} A promise that resolves when the user clicks OK.
         */
        function showCustomAlert(title, message) {
            return new Promise(resolve => {
                modalTitle.textContent = title;
                modalMessage.textContent = message;
                modalConfirmBtn.textContent = 'OK';
                modalConfirmBtn.classList.remove('hidden');
                modalCancelBtn.classList.add('hidden');
                customModalOverlay.classList.remove('hidden');

                const handleConfirm = () => {
                    customModalOverlay.classList.add('hidden');
                    modalConfirmBtn.removeEventListener('click', handleConfirm);
                    resolve();
                };
                modalConfirmBtn.addEventListener('click', handleConfirm);
            });
        }

        /**
         * Shows a custom confirmation modal.
         * @param {string} message - The confirmation message.
         * @param {string} title - The title of the confirmation.
         * @returns {Promise<boolean>} A promise that resolves with true if confirmed, false otherwise.
         */
        function showCustomConfirm(title, message) {
            return new Promise(resolve => {
                resolveModalPromise = resolve; // Store resolve function

                modalTitle.textContent = title;
                modalMessage.textContent = message;
                modalConfirmBtn.textContent = 'Confirm';
                modalConfirmBtn.classList.remove('hidden');
                modalCancelBtn.classList.remove('hidden');
                customModalOverlay.classList.remove('hidden');

                const handleConfirm = () => {
                    customModalOverlay.classList.add('hidden');
                    modalConfirmBtn.removeEventListener('click', handleConfirm);
                    modalCancelBtn.removeEventListener('click', handleCancel);
                    resolveModalPromise(true);
                };

                const handleCancel = () => {
                    customModalOverlay.classList.add('hidden');
                    modalConfirmBtn.removeEventListener('click', handleConfirm);
                    modalCancelBtn.removeEventListener('click', handleCancel);
                    resolveModalPromise(false);
                };

                modalConfirmBtn.addEventListener('click', handleConfirm);
                modalCancelBtn.addEventListener('click', handleCancel);
            });
        }

        /**
         * Saves user playlists to local storage.
         */
        function saveUserPlaylists() {
            try {
                localStorage.setItem('standalonePlaylists', JSON.stringify(userPlaylists));
            } catch (e) {
                console.error("Error saving user playlists to local storage:", e);
                showCustomAlert("Error", "Could not save playlists. Please check your browser storage settings.");
            }
        }

        /**
         * Loads user playlists from local storage.
         */
        function loadUserPlaylists() {
            try {
                const storedPlaylists = localStorage.getItem('standalonePlaylists');
                if (storedPlaylists) {
                    userPlaylists = JSON.parse(storedPlaylists);
                }
            } catch (e) {
                console.error("Error loading user playlists from local storage:", e);
                userPlaylists = []; // Reset if there's an error
                showCustomAlert("Error", "Could not load playlists. Your saved playlists might be corrupted.");
            }
        }

        /**
         * Renders user created playlists into the user-playlists-container.
         */
        function renderUserPlaylists() {
            userPlaylistsContainer.innerHTML = ''; // Clear existing playlists
            if (userPlaylists.length === 0) {
                noPlaylistsMessage.classList.remove('hidden');
                userPlaylistsContainer.appendChild(noPlaylistsMessage);
            } else {
                noPlaylistsMessage.classList.add('hidden'); // Hide the message if playlists exist
                userPlaylists.forEach((playlist) => {
                    const playlistCard = document.createElement('div');
                    playlistCard.classList.add('bg-gray-800', 'rounded-lg', 'shadow-lg', 'p-4', 'cursor-pointer', 'hover:bg-gray-700', 'transition-colors', 'duration-200');
                    playlistCard.innerHTML = `
                        <img src="${playlist.cover || 'https://placehold.co/100x100/663399/FFFFFF?text=Playlist'}" alt="${playlist.name}" class="w-full h-auto rounded-md mb-2 object-cover aspect-square">
                        <h4 class="text-white font-semibold text-lg truncate mb-1">${playlist.name}</h4>
                        <p class="text-gray-400 text-sm mb-2">${playlist.description || 'No description'}</p>
                        <p class="text-gray-500 text-xs">${playlist.songs.length} songs</p>
                    `;
                    // Add event listener to show playlist details
                    playlistCard.addEventListener('click', () => {
                        showPlaylistDetail(playlist.id);
                    });
                    userPlaylistsContainer.appendChild(playlistCard);
                });
            }
        }

        /**
         * Displays the detail view for a specific playlist.
         * @param {string} playlistId - The ID of the playlist to show.
         */
        function showPlaylistDetail(playlistId) {
            currentViewingPlaylistId = playlistId;
            const playlist = userPlaylists.find(p => p.id === playlistId);

            if (!playlist) {
                showCustomAlert("Error", "Playlist not found!");
                return;
            }

            detailPlaylistCover.src = playlist.cover || 'https://placehold.co/150x150/663399/FFFFFF?text=Playlist';
            detailPlaylistName.textContent = playlist.name;
            detailPlaylistDescription.textContent = playlist.description || 'No description provided.';

            renderSongsInPlaylist(playlist);
            renderAvailableSongsForAdding(); // Populate the add songs section

            mainPlaylistView.classList.add('hidden');
            playlistDetailView.classList.remove('hidden');
        }

        /**
         * Renders songs currently in the opened playlist.
         * @param {Object} playlist - The playlist object.
         */
        function renderSongsInPlaylist(playlist) {
            songsInCurrentPlaylistContainer.innerHTML = ''; // Clear existing songs
            songsInPlaylistCount.textContent = playlist.songs.length;

            if (playlist.songs.length === 0) {
                noSongsInPlaylistMessage.classList.remove('hidden');
                songsInCurrentPlaylistContainer.appendChild(noSongsInPlaylistMessage);
            } else {
                noSongsInPlaylistMessage.classList.add('hidden');
                playlist.songs.forEach(song => {
                    const songItem = document.createElement('div');
                    songItem.classList.add('flex', 'items-center', 'justify-between', 'bg-gray-700', 'p-3', 'rounded-md');
                    songItem.innerHTML = `
                        <div class="flex items-center space-x-3">
                            <img src="${song.cover}" alt="${song.title}" class="w-10 h-10 rounded object-cover">
                            <div>
                                <p class="text-white font-medium text-sm truncate">${song.title}</p>
                                <p class="text-gray-400 text-xs truncate">${song.artist}</p>
                            </div>
                        </div>
                        <button class="remove-song-btn text-red-400 hover:text-red-500 transition-colors duration-200" data-song-title="${song.title}">
                            <i class="fas fa-times-circle"></i>
                        </button>
                    `;
                    songsInCurrentPlaylistContainer.appendChild(songItem);
                });

                // Add event listeners for remove buttons
                songsInCurrentPlaylistContainer.querySelectorAll('.remove-song-btn').forEach(button => {
                    button.addEventListener('click', async (e) => {
                        const songTitleToRemove = e.currentTarget.dataset.songTitle;
                        if (await showCustomConfirm("Confirm Removal", `Are you sure you want to remove "${songTitleToRemove}" from this playlist?`)) {
                            removeSongFromPlaylist(currentViewingPlaylistId, songTitleToRemove);
                        }
                    });
                });
            }
        }

        /**
         * Renders available songs for adding to the playlist, with search/filter functionality.
         * @param {string} searchTerm - Optional search term to filter songs.
         */
        function renderAvailableSongsForAdding(searchTerm = '') {
            availableSongsContainer.innerHTML = ''; // Clear existing songs

            const filteredSongs = hindiSongs.filter(song =>
                song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                song.artist.toLowerCase().includes(searchTerm.toLowerCase())
            );

            if (filteredSongs.length === 0) {
                availableSongsContainer.innerHTML = '<p class="text-gray-400 text-center col-span-full">No songs found matching your search.</p>';
                return;
            }

            const currentPlaylist = userPlaylists.find(p => p.id === currentViewingPlaylistId);
            const songsInCurrentPlaylistTitles = new Set(currentPlaylist ? currentPlaylist.songs.map(s => s.title) : []);

            filteredSongs.forEach(song => {
                const songAlreadyInPlaylist = songsInCurrentPlaylistTitles.has(song.title);

                const songItem = document.createElement('div');
                songItem.classList.add('bg-gray-700', 'rounded-lg', 'p-3', 'flex', 'items-center', 'justify-between');
                songItem.innerHTML = `
                    <div class="flex items-center space-x-3 flex-grow min-w-0">
                        <img src="${song.cover}" alt="${song.title}" class="w-12 h-12 rounded object-cover flex-shrink-0">
                        <div class="flex-grow min-w-0">
                            <p class="text-white font-medium text-sm truncate">${song.title}</p>
                            <p class="text-gray-400 text-xs truncate">${song.artist}</p>
                        </div>
                    </div>
                    <button class="add-song-btn ml-3 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-full text-xs font-bold transition-colors duration-200 flex-shrink-0 ${songAlreadyInPlaylist ? 'opacity-50 cursor-not-allowed' : ''}"
                            data-song-title="${song.title}" ${songAlreadyInPlaylist ? 'disabled' : ''}>
                        ${songAlreadyInPlaylist ? '<i class="fas fa-check"></i> Added' : '<i class="fas fa-plus"></i> Add'}
                    </button>
                `;
                availableSongsContainer.appendChild(songItem);
            });

            // Add event listeners for add buttons
            availableSongsContainer.querySelectorAll('.add-song-btn').forEach(button => {
                button.addEventListener('click', async (e) => {
                    const songTitleToAdd = e.currentTarget.dataset.songTitle;
                    const songToAdd = hindiSongs.find(s => s.title === songTitleToAdd);
                    if (songToAdd && currentViewingPlaylistId) {
                        addSongToPlaylist(currentViewingPlaylistId, songToAdd);
                    }
                });
            });
        }

        /**
         * Adds a song to a specific playlist.
         * @param {string} playlistId - The ID of the playlist.
         * @param {Object} song - The song object to add.
         */
        async function addSongToPlaylist(playlistId, song) {
            const playlistIndex = userPlaylists.findIndex(p => p.id === playlistId);
            if (playlistIndex !== -1) {
                // Check if song is already in playlist to prevent duplicates
                if (!userPlaylists[playlistIndex].songs.some(s => s.title === song.title)) {
                    userPlaylists[playlistIndex].songs.push(song);
                    saveUserPlaylists();
                    await showCustomAlert("Song Added", `"${song.title}" added to playlist!`);
                    renderSongsInPlaylist(userPlaylists[playlistIndex]); // Re-render songs in current playlist
                    renderAvailableSongsForAdding(songSearchInput.value); // Re-render available songs to update button state
                } else {
                    await showCustomAlert("Already Added", `"${song.title}" is already in this playlist.`);
                }
            }
        }

        /**
         * Removes a song from a specific playlist.
         * @param {string} playlistId - The ID of the playlist.
         * @param {string} songTitle - The title of the song to remove.
         */
        async function removeSongFromPlaylist(playlistId, songTitle) {
            const playlistIndex = userPlaylists.findIndex(p => p.id === playlistId);
            if (playlistIndex !== -1) {
                userPlaylists[playlistIndex].songs = userPlaylists[playlistIndex].songs.filter(
                    s => s.title !== songTitle
                );
                saveUserPlaylists();
                await showCustomAlert("Song Removed", `"${songTitle}" removed from playlist.`);
                renderSongsInPlaylist(userPlaylists[playlistIndex]); // Re-render songs in current playlist
                renderAvailableSongsForAdding(songSearchInput.value); // Re-render available songs to update button state
            }
        }

        /**
         * Deletes an entire playlist.
         * @param {string} playlistId - The ID of the playlist to delete.
         */
        async function deletePlaylist(playlistId) {
            if (await showCustomConfirm("Confirm Deletion", "Are you sure you want to delete this playlist? This action cannot be undone.")) {
                userPlaylists = userPlaylists.filter(p => p.id !== playlistId);
                saveUserPlaylists();
                await showCustomAlert("Playlist Deleted", "Playlist deleted successfully!");
                renderUserPlaylists(); // Re-render the main playlist list
                // Go back to main playlist view after deletion
                mainPlaylistView.classList.remove('hidden');
                playlistDetailView.classList.add('hidden');
                currentViewingPlaylistId = null;
            }
        }


        // --- Event Listeners ---

        // Event listener for Create Playlist button
        createPlaylistBtn.addEventListener('click', async () => {
            const name = playlistNameInput.value.trim();
            const description = playlistDescriptionInput.value.trim();

            if (name === '') {
                playlistMessage.textContent = 'Playlist name cannot be empty!';
                playlistMessage.classList.remove('hidden', 'text-green-400');
                playlistMessage.classList.add('text-red-400');
                await showCustomAlert("Error", "Playlist name cannot be empty!");
                return;
            }

            // Check for duplicate playlist names (case-insensitive)
            if (userPlaylists.some(p => p.name.toLowerCase() === name.toLowerCase())) {
                playlistMessage.textContent = 'A playlist with this name already exists!';
                playlistMessage.classList.remove('hidden', 'text-green-400');
                playlistMessage.classList.add('text-red-400');
                await showCustomAlert("Error", "A playlist with this name already exists!");
                return;
            }

            const newPlaylist = {
                id: Date.now().toString(), // Simple unique ID
                name: name,
                description: description,
                songs: [], // Initially empty array of song objects
                cover: 'https://placehold.co/150x150/663399/FFFFFF?text=Playlist' // Default cover
            };

            userPlaylists.push(newPlaylist);
            saveUserPlaylists(); // Save the updated list to local storage

            playlistNameInput.value = ''; // Clear input
            playlistDescriptionInput.value = ''; // Clear input

            playlistMessage.textContent = `Playlist "${name}" created successfully!`;
            playlistMessage.classList.remove('hidden', 'text-red-400');
            playlistMessage.classList.add('text-green-400');

            renderUserPlaylists(); // Re-render the list of playlists
            await showCustomAlert("Success", `Playlist "${name}" created successfully!`);
        });

        // Event listener for Back to Playlists button
        backToPlaylistsBtn.addEventListener('click', () => {
            mainPlaylistView.classList.remove('hidden');
            playlistDetailView.classList.add('hidden');
            currentViewingPlaylistId = null;
            songSearchInput.value = ''; // Clear search input
        });

        // Event listener for playlist search input
        songSearchInput.addEventListener('input', (e) => {
            renderAvailableSongsForAdding(e.target.value);
        });

        // Event listener for Delete Playlist button
        deletePlaylistBtn.addEventListener('click', async () => {
            if (currentViewingPlaylistId) {
                deletePlaylist(currentViewingPlaylistId);
            }
        });


        // --- Three.js Background Animation ---
        let scene, camera, renderer;
        let musicSymbols = [];
        let particles = [];
        let mouseX = 0, mouseY = 0;
        let windowHalfX = window.innerWidth / 2;
        let windowHalfY = window.innerHeight / 2;
        let autoCameraRotation = 0; // Added for subtle automatic camera drift

        /**
         * Initializes the Three.js scene, camera, and renderer.
         */
        function initThreeJS() {
            const canvas = document.getElementById('three-js-canvas');

            scene = new THREE.Scene();
            camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            // Use WebGLRenderer with alpha for transparent background
            renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true }); 
            renderer.setSize(window.innerWidth, window.innerHeight);
            // Set clear color to transparent for the canvas background
            renderer.setClearColor(0x000000, 0); 

            camera.position.z = 50; // Pull camera back to see symbols

            // Create light source for better material rendering
            const ambientLight = new THREE.AmbientLight(0x404040, 3); // Soft white light, adjusted intensity
            scene.add(ambientLight);

            const directionalLight = new THREE.DirectionalLight(0xffffff, 2); // Brighter directional light
            directionalLight.position.set(0, 1, 1).normalize();
            scene.add(directionalLight);

            // Create music symbols
            const numSymbols = 150; // Increased number of symbols for more density
            const symbolTypes = [
                'tetrahedron', 'box', 'sphere', 'octahedron', 'dodecahedron', 'torus' // Added torus
            ];
            for (let i = 0; i < numSymbols; i++) {
                const type = symbolTypes[Math.floor(Math.random() * symbolTypes.length)];
                createMusicSymbol(type);
            }

            // Create a particle system (stars/dust)
            createParticles(2000); // 2000 particles for a subtle star field effect

            // Event listeners for responsive resizing and mouse interaction
            window.addEventListener('resize', onWindowResize, false);
            document.addEventListener('mousemove', onDocumentMouseMove, false);
            // For touch-enabled devices
            document.addEventListener('touchmove', onDocumentTouchMove, { passive: false }); 
        }

        /**
         * Creates a single music symbol with varying geometry and material.
         * @param {string} type - The type of geometry ('tetrahedron', 'box', 'sphere', etc.).
         */
        function createMusicSymbol(type) {
            let geometry;
            // Random size for variety
            const size = Math.random() * 0.8 + 0.3; 

            switch (type) {
                case 'tetrahedron':
                    geometry = new THREE.TetrahedronGeometry(size);
                    break;
                case 'box':
                    geometry = new THREE.BoxGeometry(size, size, size);
                    break;
                case 'sphere':
                    geometry = new THREE.SphereGeometry(size * 0.8, 16, 16);
                    break;
                case 'octahedron':
                    geometry = new THREE.OctahedronGeometry(size);
                    break;
                case 'dodecahedron':
                    geometry = new THREE.DodecahedronGeometry(size);
                    break;
                case 'torus':
                    geometry = new THREE.TorusGeometry(size * 0.7, size * 0.3, 16, 32); // Outer radius, tube radius
                    break;
                default:
                    geometry = new THREE.SphereGeometry(size * 0.8, 16, 16); // Default to sphere
            }

            // Random vibrant color for the symbol
            const color = new THREE.Color(Math.random() * 0xffffff); 
            // MeshStandardMaterial for metallic, reflective appearance
            const material = new THREE.MeshStandardMaterial({ 
                color: color, 
                roughness: 0.5, 
                metalness: 0.8 
            }); 
            const mesh = new THREE.Mesh(geometry, material);

            // Random initial position within a larger range
            mesh.position.x = (Math.random() * 200 - 100); 
            mesh.position.y = (Math.random() * 200 - 100);
            mesh.position.z = (Math.random() * 200 - 100);

            // Random initial rotation
            mesh.rotation.x = Math.random() * Math.PI * 2;
            mesh.rotation.y = Math.random() * Math.PI * 2;
            mesh.rotation.z = Math.random() * Math.PI * 2;

            // Store animation properties
            mesh.speedX = (Math.random() - 0.5) * 0.05;
            mesh.speedY = (Math.random() - 0.5) * 0.05;
            mesh.speedZ = (Math.random() - 0.5) * 0.05;
            mesh.rotationSpeedX = (Math.random() - 0.5) * 0.01;
            mesh.rotationSpeedY = (Math.random() - 0.5) * 0.01;

            musicSymbols.push(mesh);
            scene.add(mesh);
        }

        /**
         * Creates a particle system for background effect.
         * @param {number} count - Number of particles.
         */
        function createParticles(count) {
            const geometry = new THREE.BufferGeometry();
            const positions = [];

            // Generate random positions for particles
            for (let i = 0; i < count; i++) {
                // Particles distributed in a cube shape
                positions.push((Math.random() * 2 - 1) * 200); 
                positions.push((Math.random() * 2 - 1) * 200);
                positions.push((Math.random() * 2 - 1) * 200);
            }

            geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

            // Particle material
            const material = new THREE.PointsMaterial({ 
                color: 0xeeeeee, 
                size: 0.5, 
                transparent: true, 
                opacity: 0.7 
            });
            const points = new THREE.Points(geometry, material);
            scene.add(points);
            particles.push(points); // Add to particles array for potential animation
        }

        /**
         * Handles window resize events to update camera aspect ratio and renderer size.
         */
        function onWindowResize() {
            windowHalfX = window.innerWidth / 2;
            windowHalfY = window.innerHeight / 2;

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }

        /**
         * Updates mouse X and Y coordinates for camera movement.
         * @param {MouseEvent} event - The mouse move event.
         */
        function onDocumentMouseMove(event) {
            mouseX = (event.clientX - windowHalfX) * 0.1; // Reduced sensitivity
            mouseY = (event.clientY - windowHalfY) * 0.1;
        }

        /**
         * Updates mouse X and Y coordinates for camera movement on touch devices.
         * @param {TouchEvent} event - The touch move event.
         */
        function onDocumentTouchMove(event) {
            if (event.touches.length > 0) {
                mouseX = (event.touches[0].clientX - windowHalfX) * 0.1;
                mouseY = (event.touches[0].clientY - windowHalfY) * 0.1;
            }
        }

        /**
         * Animation loop for Three.js scene.
         */
        function animate() {
            requestAnimationFrame(animate);

            // Update camera position based on mouse/touch and subtle auto-rotation
            camera.position.x += (mouseX - camera.position.x) * .05;
            camera.position.y += (-mouseY - camera.position.y) * .05;
            camera.lookAt(scene.position); // Always look at the center of the scene

            // Auto camera rotation for a dynamic feel even without mouse movement
            autoCameraRotation += 0.0001; 
            camera.position.x = 50 * Math.sin(autoCameraRotation);
            camera.position.z = 50 * Math.cos(autoCameraRotation);


            // Animate music symbols
            musicSymbols.forEach(symbol => {
                symbol.position.x += symbol.speedX;
                symbol.position.y += symbol.speedY;
                symbol.position.z += symbol.speedZ;

                symbol.rotation.x += symbol.rotationSpeedX;
                symbol.rotation.y += symbol.rotationSpeedY;

                // If symbols move too far, reset their position to create a continuous flow
                if (symbol.position.x > 100 || symbol.position.x < -100) symbol.position.x *= -1;
                if (symbol.position.y > 100 || symbol.position.y < -100) symbol.position.y *= -1;
                if (symbol.position.z > 100 || symbol.position.z < -100) symbol.position.z *= -1;
            });

            // Animate particles (e.g., subtle rotation for the entire system)
            particles.forEach(p => {
                p.rotation.y += 0.0005;
                p.rotation.x += 0.0002;
            });

            renderer.render(scene, camera);
        }

        // Initialize Three.js on window load
        window.onload = function () {
            initThreeJS();
            animate(); // Start the animation loop
            loadUserPlaylists(); // Load playlists when the page loads
            renderUserPlaylists(); // Render initial playlists
        };

        // Call initial render for available songs (empty search term)
        // This is called when the detail view is shown, so no need to call it here globally.
        // renderAvailableSongsForAdding(); 