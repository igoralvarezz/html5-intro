const mobileMenuBtn = document.querySelector('#mobile-menu-btn'),
      mobileMenu = document.querySelector('#mobile-menu'),
      mobileMenuItems = mobileMenu.querySelectorAll('a'),
      slider = document.querySelector('#slider'),
      portfolioOverlay = document.querySelector('#portfolio-overlay'),
      portfolio = document.querySelector('#portfolio'),
      contactForm = document.querySelector('#contact form'),
      body = document.querySelector('body');

// Slider Functionality
const slides = slider.querySelectorAll('.slide'),
      slideControls = slider.querySelectorAll('.controls a');
      slideTime = 6000;

let currentSlide = 0,
    sliderAction,
    autoSlide = setInterval(()=>{
    sliderAction = 'next';
      updateSlides();
    },slideTime);

function updateSlides() {
  slides[currentSlide].classList = 'slide active animate';
  slides[currentSlide].addEventListener('transitionend', changeSlide);
}
function changeSlide(){
  if (sliderAction == 'next') {
    slides[currentSlide].classList = 'slide';

    if (currentSlide == slides.length - 1){
      currentSlide = 0;
    } else {
      currentSlide = currentSlide + 1;
    }

  } else {
      slides[currentSlide].classList = 'slide';
      if (currentSlide === 0){
        currentSlide = 3;
      } else {
        currentSlide = currentSlide - 1;
      }
  }
  slides[currentSlide].classList = 'slide active';
  console.log('current slide =', currentSlide, 'action =', sliderAction);
}
slides.forEach((slide) => {
  slide.addEventListener('click', ()=>{
    openPortfolioOverlay(slide);
  })
});

slideControls.forEach((control) => {
  control.addEventListener('click', (e)=>{
    e.preventDefault();
    if (control.id == '#prev-slide'){
      sliderAction = 'prev'
      updateSlides();
    } else {
      sliderAction = 'next';
      updateSlides();
    };
    clearInterval(autoSlide);
    autoSlide = setInterval(()=>{
    sliderAction = 'next';
      updateSlides();
    },slideTime);
  });
});


// code for mobile menu interaction
let mobileMenuToggle = false;

mobileMenuBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  if (!mobileMenuToggle) {
    mobileMenu.style.display = 'flex';
    mobileMenuToggle = true;
    mobileMenuBtn.querySelector('img').src = './img/close-icon.svg';
  } else {
    mobileMenu.style.display = 'none';
    mobileMenuToggle = false;
    mobileMenuBtn.querySelector('img').src = './img/menu-icon.svg';
  }
});
mobileMenuItems.forEach((link) => {
  link.addEventListener('click', ()=> {
      mobileMenu.style.display = 'none';
      mobileMenuToggle = false;
      mobileMenuBtn.querySelector('img').src = './img/menu-icon.svg';
  });
});


// contact form interaction
const contactFormInfo = {
  name: "",
  email: "",
  message: ""
},
      nameContactField = contactForm.querySelector('#name'),
      emailContactField = contactForm.querySelector('#email'),
      messageContactField = contactForm.querySelector('#message');

contactForm.addEventListener('submit', (event)=>{
  event.preventDefault();

  let mailtoLink = "";

  contactFormInfo.name = encodeURI(nameContactField.value);
  contactFormInfo.email = encodeURI(emailContactField.value);
  contactFormInfo.message = encodeURI(messageContactField.value);

  mailtoLink = `mailto:igoralvarez@email.com?subject=${contactFormInfo.name}%27s%20Message%20via%20Website%20Contact%20Form&body=${contactFormInfo.message}%0A%0A${contactFormInfo.name}%0A${contactFormInfo.email}`

  window.location.href = mailtoLink;
  // ToDo: Create function to transform form fields into mailto expression.
  // encoding: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
});


// portfolio area interaction
let portfolioToggle = false,
    categoriesToggle = false,
    choosenWork;

const works = portfolio.querySelectorAll('section#work > div'),
      closeOverlayDeskBtn = portfolioOverlay.querySelector('#close-overlay-btn'),
      closeOverlayMobileBtn = portfolioOverlay.querySelector('#close-overlay-btn-mobile'),
      backLinkOverlay = portfolioOverlay.querySelectorAll('.back-link'),
      portfolioCategories = portfolio.querySelectorAll('#category a');

function changeCategories(category){
  if (category ==='all'){
    if(categoriesToggle){
      document.styleSheets[1].deleteRule(document.styleSheets[1].cssRules.length-1);
    }
    let filteredStyles = document.querySelector('[data-identifier="filtered-styles"]');
    filteredStyles.remove();
    categoriesToggle = false;

  } else {
    if (!categoriesToggle) {
      let filteredStyles = document.createElement('link');
      filteredStyles.href = './css/filtered_portfolio.css';
      filteredStyles.type = 'text/css';
      filteredStyles.rel = 'stylesheet';
      filteredStyles.setAttribute('data-identifier', 'filtered-styles');
      document.querySelector('head').appendChild(filteredStyles);
    }
    else {
      document.styleSheets[1].deleteRule(document.styleSheets[1].cssRules.length-1);
    }
    window.document.styleSheets[1].insertRule(

    `#work .item:not(.${category}) {
      display: none;
    }`,
    window.document.styleSheets[1].cssRules.length);
    categoriesToggle = true;
  }

  portfolioCategories.forEach((item)=>{
    if (item.id == category){
      item.classList.add('active')
    } else {
      item.classList = '';
    }
  });

  }
function openPortfolioOverlay(item) {
  portfolioToggle = true;
  portfolioOverlay.style.display = 'inline-block';
  mobileMenuBtn.style.display = 'none';
  body.style.overflow = 'hidden';

  choosenWork = document.querySelector('#portfolio-overlay #' + item.dataset.identifier);
  choosenWork.style.display = 'grid';
}
function closePortfolioOverlay() {
  if (window.innerWidth <= 1000){
    mobileMenuBtn.style.display = 'inline-block';
  }
  body.style.overflow = 'auto';
  portfolioToggle = false;
  portfolioOverlay.style.display = 'none';
  choosenWork.style.display = 'none';
}

portfolioCategories.forEach((tag) =>{
  tag.addEventListener('click', (e)=>{
    e.preventDefault();
    changeCategories(tag.id);
  });
});
works.forEach((item) => {
  item.addEventListener('click', ()=>{
    openPortfolioOverlay(item);
  });
});

backLinkOverlay.forEach((item) => {
  item.addEventListener('click', (e)=>{
    e.preventDefault();
    closePortfolioOverlay();
  });
});

closeOverlayDeskBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  closePortfolioOverlay();
});
closeOverlayMobileBtn.addEventListener('click', (e)=>{
  e.preventDefault();
  closePortfolioOverlay();
});

// Fixes the mobile-menu button showing on desktop after the closing of a portfolio's work visualization and resizing the window
window.addEventListener('resize', ()=>{
  if (window.innerWidth <= 1000 && portfolioToggle === false){
    mobileMenuBtn.style.display = 'inline-block';
  } else {
    mobileMenuBtn.style.display = 'none';
  }
});
