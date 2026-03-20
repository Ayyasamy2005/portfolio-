// Navigation and Mobile Menu
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li a');

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle function
function toggleMenu() {
    navLinks.classList.toggle('active');
    hamburger.innerHTML = navLinks.classList.contains('active')
        ? '<i class="fas fa-times"></i>'
        : '<i class="fas fa-bars"></i>';
}

hamburger.addEventListener('click', toggleMenu);

// Close mobile menu on click
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
});

// Typing Effect for Hero Section
const typingText = document.querySelector('.typing-text');
//const phrases = ["Full-Stack Developer", "Data Engineer", "UI/UX Designer"];
const phrases = ["Full-Stack Developer", " AR & VR ", "UI/UX Designer"];
let phraseIndex = 0;
let letterIndex = 0;
let isDeleting = false;

function type() {
    const currentPhrase = phrases[phraseIndex];
    if (isDeleting) {
        typingText.textContent = currentPhrase.substring(0, letterIndex - 1);
        letterIndex--;
    } else {
        typingText.textContent = currentPhrase.substring(0, letterIndex + 1);
        letterIndex++;
    }

    let typeSpeed = 100;
    if (isDeleting) { typeSpeed /= 2; }

    if (!isDeleting && letterIndex === currentPhrase.length) {
        typeSpeed = 2000;
        isDeleting = true;
    } else if (isDeleting && letterIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}
// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(type, 1000);
});


// Three.js Background Animation
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// Add fog to dynamically fade out grid edges
scene.fog = new THREE.Fog(0x050505, 10, 50);

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// Position camera looking down slightly at the wave
camera.position.set(0, 5, 20);

const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- Data Landscape Wavy Particle Grid ---
const particlesGeometry = new THREE.BufferGeometry();
const gridWidth = 70;
const gridDepth = 70;
const particlesCount = gridWidth * gridDepth;
const posArray = new Float32Array(particlesCount * 3);
const colorsArray = new Float32Array(particlesCount * 3);

const color1 = new THREE.Color('#a855f7');
const color2 = new THREE.Color('#3b82f6');

let index = 0;
for (let ix = 0; ix < gridWidth; ix++) {
    for (let iz = 0; iz < gridDepth; iz++) {
        // Space out particles widely
        const x = (ix - gridWidth / 2) * 1.5;
        const z = (iz - gridDepth / 2) * 1.5;
        const y = 0;

        posArray[index * 3] = x;
        posArray[index * 3 + 1] = y;
        posArray[index * 3 + 2] = z;

        // Mix color horizontally and randomly for a cool glowing grid variation
        const mixedColor = color1.clone().lerp(color2, (ix / gridWidth) + (Math.random() * 0.1 - 0.05));
        colorsArray[index * 3] = mixedColor.r;
        colorsArray[index * 3 + 1] = mixedColor.g;
        colorsArray[index * 3 + 2] = mixedColor.b;
        
        index++;
    }
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorsArray, 3));

const particleMaterial = new THREE.PointsMaterial({
    size: 0.12,
    vertexColors: true,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending
});

const particleMesh = new THREE.Points(particlesGeometry, particleMaterial);
// Tilt to resemble a floor plane
particleMesh.rotation.x = -Math.PI / 2 + 0.5;
particleMesh.position.y = -8;
scene.add(particleMesh);

// Mouse interaction tracking
let mouseX = 0;
let mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX);
    mouseY = (e.clientY - windowHalfY);
});

// Animation loop
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Loop through grid points and create wavy terrain using sinusoids
    const positions = particleMesh.geometry.attributes.position.array;
    let i = 0;
    for (let ix = 0; ix < gridWidth; ix++) {
        for (let iz = 0; iz < gridDepth; iz++) {
            const wave1 = Math.sin((ix * 0.1) + (elapsedTime * 0.5)) * 1.0;
            const wave2 = Math.cos((iz * 0.1) + (elapsedTime * 0.5)) * 1.0;
            const wave3 = Math.sin((ix * 0.05) + (iz * 0.05) + (elapsedTime * 1.2)) * 1.5;
            
            // Modify only the Y axis based on the wave harmonics
            positions[i * 3 + 1] = wave1 + wave2 + wave3;
            i++;
        }
    }
    // Update buffer in memory to reflect geometry structural shifts
    particleMesh.geometry.attributes.position.needsUpdate = true;

    // Smooth interactive parallax for the camera tied to mouse position
    const targetX = mouseX * 0.01;
    const targetY = mouseY * 0.01;
    
    camera.position.x += (targetX * 0.5 - camera.position.x) * 0.02;
    camera.position.y += (-targetY * 0.5 + 5 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
}
animate();

// Handle Window Resize
window.addEventListener('resize', () => {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
});

// GSAP Scroll Animations
gsap.registerPlugin(ScrollTrigger);

// Hero elements animation on load
gsap.from(".greeting", { opacity: 0, y: 30, duration: 1, delay: 0.2 });
gsap.from(".glitch", { opacity: 0, y: 30, duration: 1, delay: 0.4 });
gsap.from(".hero h2", { opacity: 0, y: 30, duration: 1, delay: 0.6 });
gsap.from(".hero-btns", { opacity: 0, y: 30, duration: 1, delay: 0.8 });

// General Section animations
const sections = document.querySelectorAll('.section-padding');

sections.forEach(section => {
    const title = section.querySelector('.section-title');
    const content = section.querySelectorAll('.glass-panel');

    if (title) {
        gsap.from(title, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
            },
            opacity: 0,
            y: 30,
            duration: 0.8
        });
    }

    if (content.length) {
        gsap.from(content, {
            scrollTrigger: {
                trigger: section,
                start: "top 70%",
            },
            opacity: 0,
            y: 50,
            duration: 0.8,
            stagger: 0.2
        });
    }
});

// Nav active state on scroll
const sectionsForNav = document.querySelectorAll('section');

window.addEventListener('scroll', () => {
    let current = '';

    sectionsForNav.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(li => {
        li.classList.remove('active');
        if (li.getAttribute('href') === `#${current}`) {
            li.classList.add('active');
        }
    });
});