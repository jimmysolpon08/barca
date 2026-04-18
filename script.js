document.addEventListener('DOMContentLoaded', () => {
    // Audio Elements
    const anthem = document.getElementById('anthem');
    const audioToggle = document.getElementById('audio-toggle');
    const audioIcon = document.getElementById('audio-icon');
    let isPlaying = false;

    // Screens
    const screens = {
        landing: document.getElementById('landing-screen'),
        video: document.getElementById('video-screen'),
        portal: document.getElementById('portal-screen'),
        home: document.getElementById('home-screen'),
        history: document.getElementById('history-screen'),
        squadIntro: document.getElementById('squad-intro-screen'),
        squad: document.getElementById('squad-screen'),
        msn: document.getElementById('msn-screen')
    };

    // Video Elements
    const introVideo = document.getElementById('intro-video');
    const skipBtn = document.getElementById('skip-video');
    let videoPhase = 1;

    // Background Slider
    const bgSliderContainer = document.getElementById('home-bg-slider');
    const bgImages = [
        'barcahome/Camp Nou.jpeg',
        'barcahome/FC Barcelona.jpeg',
        'barcahome/Torcedores do FC Barcelona.jpeg',
        'barcahome/_ (1).jpeg',
        'barcahome/_.jpeg',
        'barcahome/😮_💨.jpeg'
    ];
    let currentSlide = 0;
    let sliderInterval;

    // --- Utility: Show Screen ---
    function showScreen(screenKey) {
        Object.values(screens).forEach(s => {
            s.classList.remove('active');
            s.classList.add('hidden');
        });
        screens[screenKey].classList.remove('hidden');
        screens[screenKey].classList.add('active');
        
        // Start slider if home
        if (screenKey === 'home') {
            startBgSlider();
        } else {
            stopBgSlider();
        }

        // Parallax active handling in CSS via mousemove
    }

    // --- Audio Control ---
    function toggleAudio() {
        if (isPlaying) {
            anthem.pause();
            audioIcon.textContent = '🔇';
        } else {
            anthem.play().catch(e => console.log("Play blocked", e));
            audioIcon.textContent = '🔊';
        }
        isPlaying = !isPlaying;
    }

    audioToggle.addEventListener('click', toggleAudio);

    // --- Sequence 1: Landing -> Video ---
    screens.landing.addEventListener('click', () => {
        showScreen('video');
        introVideo.src = 'barcavid.mp4';
        introVideo.play();
    });

    // --- Audio Start Logic ---
    function startMusic() {
        if (!isPlaying) {
            anthem.play().catch(e => console.log("Audio play failed:", e));
            isPlaying = true;
            audioIcon.textContent = '🔊';
            audioToggle.classList.remove('hidden');
        }
    }

    // --- Sequence 2: Video Logic ---
    function handleVideoEnd() {
        if (videoPhase === 1) {
            videoPhase = 2;
            introVideo.src = 'vid2.mp4';
            introVideo.play();
        } else {
            startMusic();
            showScreen('portal');
        }
    }

    introVideo.addEventListener('ended', handleVideoEnd);
    skipBtn.addEventListener('click', () => {
        introVideo.pause();
        startMusic();
        showScreen('portal');
    });

    // --- Sequence 3: Portal -> Home ---
    document.getElementById('enter-home-btn').addEventListener('click', () => {
        showScreen('home');
    });

    // --- Background Slider ---
    function initSlider() {
        bgSliderContainer.innerHTML = '';
        bgImages.forEach((imgSrc, idx) => {
            const img = document.createElement('img');
            img.src = imgSrc;
            img.className = 'bg-slide' + (idx === 0 ? ' active' : '');
            bgSliderContainer.appendChild(img);
        });
    }

    function startBgSlider() {
        if (sliderInterval) clearInterval(sliderInterval);
        const slides = document.querySelectorAll('.bg-slide');
        if(slides.length === 0) return;
        
        sliderInterval = setInterval(() => {
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % slides.length;
            slides[currentSlide].classList.add('active');
        }, 3000);
    }

    function stopBgSlider() {
        if (sliderInterval) clearInterval(sliderInterval);
    }

    initSlider();

    // --- Typewriter Effect for History ---
    function typeWriter(element, text, speed = 15) {
        element.innerHTML = '';
        let i = 0;
        function type() {
            if (i < text.length) {
                element.innerHTML += text.charAt(i);
                i++;
                setTimeout(type, speed);
            }
        }
        type();
    }

    // --- Navigation Links ---
    document.getElementById('nav-history').addEventListener('click', () => {
        showScreen('history');
        const historyTexts = document.querySelectorAll('.history-text');
        historyTexts.forEach(el => {
            const fullText = el.getAttribute('data-text') || el.innerText;
            if (!el.getAttribute('data-text')) el.setAttribute('data-text', fullText);
            typeWriter(el, fullText, 20);
        });
    });
    document.getElementById('nav-squad').addEventListener('click', () => showScreen('squadIntro'));
    
    // Intro Squad Image Click -> Real Squad Grid
    document.getElementById('squad-intro-img').addEventListener('click', () => showScreen('squad'));

    // --- Back Buttons ---
    document.querySelectorAll('.back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-target');
            if (target === 'home-screen') showScreen('home');
        });
    });

    // --- Squad Section ---
    const squadData = [
        { num: 3, name: 'Alejandro Balde', pos: 'Left Back', height: '1.75m', nat: 'Spain', age: 22, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/82dfc9f5-ffc4-4b47-a828-21de924f9b5f/03-Balde.jpg?width=470&height=470', history: 'A product of La Masia, Balde has established himself as a phenomenal attacking full-back with blistering pace.' },
        { num: 4, name: 'Ronald Araújo', pos: 'Center Back', height: '1.92m', nat: 'Uruguay', age: 27, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/46af26e5-df57-406a-9bb1-b6f037631f0f/04-Araujo.jpg?width=470&height=470', history: 'Known for his incredible physical presence and leadership, Araújo is the bedrock of Barça\'s defense.' },
        { num: 2, name: 'Pau Cubarsí', pos: 'Center Back', height: '1.84m', nat: 'Spain', age: 19, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/2ca1e448-3d31-4ff2-9909-44fd00368472/02-Cubarsi.jpg?width=470&height=470', history: 'A prodigy from La Masia, Cubarsí has dazzled the world with his composure and elite ball-playing abilities at such a young age.' },
        { num: 6, name: 'Gavi', pos: 'Midfielder', height: '1.73m', nat: 'Spain', age: 21, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/21356702-1d94-49a8-a94a-4170afe7ca16/06-Gavi.jpg?width=470&height=470', history: 'The heart and soul of the midfield, Gavi plays with unmatched intensity, passion, and technical brilliance.' },
        { num: 8, name: 'Pedri', pos: 'Midfielder', height: '1.74m', nat: 'Spain', age: 23, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/10/597a1e13-c0b2-4c93-a2fd-4cc39a9459cc/08-Pedri.jpg?width=470&height=470', history: 'A true midfield maestro, Pedri controls the tempo of the game with his incredible vision and flawless passing.' },
        { num: 9, name: 'R. Lewandowski', pos: 'Striker', height: '1.85m', nat: 'Poland', age: 37, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/10/6dd5aa47-d5fb-45a5-b171-0da82c9c7105/09-Lewandowski.jpg?width=470&height=470', history: 'One of the greatest strikers of his generation, Lewandowski brings lethal finishing and world-class experience to the attack.' },
        { num: 10, name: 'Lamine Yamal', pos: 'Right Winger', height: '1.80m', nat: 'Spain', age: 18, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/a9ecee2c-116c-405c-8524-3127913e7a3c/10-Lamine.jpg?width=470&height=470', history: 'A generational talent, Lamine Yamal has broken numerous records with his magical dribbling and spectacular goals.' },
        { num: 11, name: 'Raphinha', pos: 'Left Winger', height: '1.76m', nat: 'Brazil', age: 29, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/10/08bbb1ff-004b-4623-a675-66fd1fbfdc8b/11-Raphinha.jpg?width=470&height=470', history: 'Bringing Brazilian flair to the wings, Raphinha is known for his incredible work rate, deadly left foot, and playmaking.' },
        { num: 1, name: 'Joan García', pos: 'Goalkeeper', height: '1.93m', nat: 'Spain', age: 24, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/2b12f57a-582e-408a-b23e-ec9c42b0d5b9/01-Joan_Garcia.jpg?width=470&height=470', history: 'A young and promising goalkeeper with excellent reflexes and commanding presence in the box.' },
        { num: 20, name: 'Dani Olmo', pos: 'Midfielder', height: '1.79m', nat: 'Spain', age: 27, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/79af1dbc-34f3-4bb7-9ee4-08269866ab47/20-Olmo.jpg?width=470&height=470', history: 'A versatile and creative attacking midfielder, Olmo brings flair and an eye for goal to the Barça squad.' },
        { num: 21, name: 'Frenkie de Jong', pos: 'Midfielder', height: '1.80m', nat: 'Netherlands', age: 28, img: 'https://www.fcbarcelona.com/photo-resources/2025/09/09/793001b1-f225-4259-8a74-27e418a3e4c9/21-De_Jong.jpg?width=470&height=470', history: 'An elite deep-lying playmaker, Frenkie controls the game with his elegant dribbling and incredible tactical intelligence.' }
    ];

    // Sort by jersey number ascending
    squadData.sort((a, b) => a.num - b.num);

    const rosterGrid = document.getElementById('roster-grid');
    const playerModal = document.getElementById('player-modal');

    squadData.forEach(player => {
        const card = document.createElement('div');
        card.className = 'player-card-advanced';
        card.innerHTML = `
            <img src="${player.img}" alt="${player.name}">
            <div class="player-card-number">${player.num}</div>
            <div class="player-card-name">${player.name}</div>
        `;
        
        card.addEventListener('click', () => {
            document.getElementById('modal-player-img').src = player.img;
            document.getElementById('modal-player-num').textContent = player.num;
            document.getElementById('modal-player-name').textContent = player.name;
            document.getElementById('modal-player-history').textContent = player.history;
            document.getElementById('modal-player-pos').textContent = player.pos;
            document.getElementById('modal-player-height').textContent = player.height;
            document.getElementById('modal-player-nat').textContent = player.nat;
            document.getElementById('modal-player-age').textContent = player.age;
            playerModal.classList.remove('hidden');
        });
        
        rosterGrid.appendChild(card);
    });

    document.getElementById('close-player-modal').addEventListener('click', () => {
        playerModal.classList.add('hidden');
    });

    // --- MSN Logic ---
    const msnData = {
        messi: { title: "Lionel Messi", desc: "Arguably the greatest player of all time. Messi's vision, dribbling, and goal-scoring defined the MSN era, orchestrating attacks from the right wing." },
        suarez: { title: "Luis Suárez", desc: "El Pistolero. A lethal striker known for his incredible work rate, finishing, and volleying ability. Suárez was the ultimate number 9." },
        neymar: { title: "Neymar Jr", desc: "The Brazilian flair. Neymar brought unmatched skill, pace, and creativity on the left wing, complementing Messi and Suárez perfectly." }
    };

    const msnModal = document.getElementById('msn-modal');
    const msnTitle = document.getElementById('modal-title');
    const msnDesc = document.getElementById('modal-desc');

    document.querySelectorAll('.msn-icon-wrapper').forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const player = wrapper.getAttribute('data-player');
            msnTitle.textContent = msnData[player].title;
            msnDesc.textContent = msnData[player].desc;
            msnModal.classList.remove('hidden');
        });
    });

    document.getElementById('close-modal').addEventListener('click', () => {
        msnModal.classList.add('hidden');
    });
});
