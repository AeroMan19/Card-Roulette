"use strict";
function homeButtonEventHandler() {
    const homeButton = document.querySelector('.logo');
    homeButton === null || homeButton === void 0 ? void 0 : homeButton.addEventListener('click', () => {
        location.reload();
    });
}
function startButtonEventHandler() {
    const startButtons = document.querySelectorAll('.play-button');
    startButtons.forEach((button) => {
        button === null || button === void 0 ? void 0 : button.addEventListener('click', (event) => {
            event.stopPropagation();
            const getUserInputEvent = new Event('user-input');
            document.dispatchEvent(getUserInputEvent);
        });
    });
}
function randomIntBetweenInterval(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}
function userInputEventHandler() {
    document.addEventListener('user-input', () => {
        const mainPage = document.querySelector('.main');
        mainPage.style.filter = 'blur(2px)';
        const inputWindow = document.querySelector('.user-input-window');
        inputWindow.style.display = 'flex';
        const inputForm = document.getElementById('input-form');
        if ((inputForm === null || inputForm === void 0 ? void 0 : inputForm.getAttribute('data-listener-added')) !== "true") {
            inputForm === null || inputForm === void 0 ? void 0 : inputForm.setAttribute('data-listener-added', 'true'); // avoid adding multiple instances of same event listener
            inputForm === null || inputForm === void 0 ? void 0 : inputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const navButton = document.querySelector('.nav-button');
                navButton.style.display = 'none';
                const input = document.getElementById('user-input').value;
                localStorage['numberOfCards'] = input;
                const renderRouletteEvent = new CustomEvent('render-roulette', {
                    detail: {
                        numberOfCards: parseInt(input),
                    }
                });
                inputWindow.style.display = 'none';
                const main = document.querySelector('.main');
                main.style.display = 'none';
                document.dispatchEvent(renderRouletteEvent);
            });
            mainPage.addEventListener('click', () => {
                mainPage.style.filter = 'none';
                inputWindow.style.display = 'none';
            });
        }
    });
}
function rouletteRendererEventHandler() {
    document.addEventListener('render-roulette', (event) => {
        window.scrollTo(0, 0);
        const body = document.querySelector('body');
        const html = `
            <div class="roulette-container">
                <div class="text-container">
                    <h2>Select a Card</h2>
                </div>
                <div class="cards-container">
                </div>
            </div>
        `;
        body === null || body === void 0 ? void 0 : body.insertAdjacentHTML('beforeend', html);
        const cardsContainer = document.querySelector('.cards-container');
        const numberOfCards = event.detail.numberOfCards;
        const randomNumber = randomIntBetweenInterval(0, numberOfCards - 1);
        for (let i = 0; i < numberOfCards; i++) {
            const type = (i == randomNumber) ? 'cross' : 'tick';
            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');
            cardInner.addEventListener('click', cardClickedEventHandler);
            cardInner.dataset.type = type;
            const flip_card_html = `
                <div class="card-front">
                    <img src="static/images/card_front.svg" alt="purple card with question mark on it">
                </div>
    
                <div class="card-back">
                    <img src="static/images/card_back_${type}.svg" alt="card with a ${type} on it">
                </div>
            `;
            cardInner === null || cardInner === void 0 ? void 0 : cardInner.insertAdjacentHTML('beforeend', flip_card_html);
            cardsContainer === null || cardsContainer === void 0 ? void 0 : cardsContainer.appendChild(cardInner);
        }
    });
}
function cardClickedEventHandler(event) {
    const cardElement = event.currentTarget;
    if (!(cardElement === null || cardElement === void 0 ? void 0 : cardElement.classList.contains('card-flipped'))) {
        cardElement === null || cardElement === void 0 ? void 0 : cardElement.classList.toggle('card-flipped');
        if (cardElement.dataset.type == 'tick') {
            console.log('success!');
        }
        else {
            doLossAnimation(cardElement);
        }
    }
}
function doLossAnimation(card) {
    const cardsContainer = document.querySelector('.cards-container');
    cardsContainer.style.pointerEvents = 'none';
    setTimeout(() => {
        card.setAttribute('style', 'animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both');
    }, 500);
    setTimeout(() => {
        displayEndGameWindow();
    }, 1200);
}
function displayEndGameWindow() {
    const gameScreen = document.querySelector('.roulette-container');
    gameScreen.style.filter = 'blur(2px)';
    const exitWindow = document.querySelector('.exit-window');
    exitWindow.style.display = 'flex';
    const restartButton = document.querySelector('#restart');
    restartButton === null || restartButton === void 0 ? void 0 : restartButton.addEventListener('click', () => {
        // reset window
        const rouletteContainer = document.querySelector('.roulette-container');
        rouletteContainer.remove();
        const exitWindow = document.querySelector('.exit-window');
        exitWindow.style.display = 'none';
        const cachedNumberOfCards = parseInt(localStorage['numberOfCards']);
        const renderRouletteEvent = new CustomEvent('render-roulette', {
            detail: {
                numberOfCards: cachedNumberOfCards,
            }
        });
        document.dispatchEvent(renderRouletteEvent);
    });
}
document.addEventListener('DOMContentLoaded', () => {
    homeButtonEventHandler();
    userInputEventHandler();
    rouletteRendererEventHandler();
    startButtonEventHandler();
});
