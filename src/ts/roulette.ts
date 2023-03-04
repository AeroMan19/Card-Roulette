
function homeButtonEventHandler():void {
    const homeButton = document.querySelector('.logo');
    homeButton?.addEventListener('click', () => {
        location.reload();
    });
}


function startButtonEventHandler(): void {
    const startButtons = document.querySelectorAll('.play-button');
    startButtons.forEach( (button) => {
        button?.addEventListener('click', (event) => {
            event.stopPropagation();  
            const getUserInputEvent = new Event('user-input');
            document.dispatchEvent(getUserInputEvent);
        });
    })
}



function randomIntBetweenInterval(min:number, max:number): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}


function userInputEventHandler(): void {

    document.addEventListener('user-input', () => {
        const mainPage = document.querySelector('.main') as HTMLElement;
        mainPage.style.filter = 'blur(2px)';
        
        const inputWindow = document.querySelector('.user-input-window') as HTMLElement;
        inputWindow.style.display = 'flex';

        const inputForm = document.getElementById('input-form');
        if (inputForm?.getAttribute('data-listener-added') !== "true") {
            inputForm?.setAttribute('data-listener-added', 'true');  // avoid adding multiple instances of same event listener

            inputForm?.addEventListener('submit', (e) => {
                e.preventDefault();
        
                const navButton = document.querySelector('.nav-button') as HTMLElement;
                navButton.style.display = 'none';
    
                const input:string = (<HTMLInputElement>document.getElementById('user-input')).value;
                localStorage['numberOfCards'] = input;
    
                const renderRouletteEvent = new CustomEvent('render-roulette', {
                    detail: {
                        numberOfCards : parseInt(input),
                    }
                });
                inputWindow.style.display = 'none';
                const main = document.querySelector('.main') as HTMLElement;
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


function rouletteRendererEventHandler(): void {

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
        body?.insertAdjacentHTML('beforeend', html); 
    
        const cardsContainer = document.querySelector('.cards-container');
        const numberOfCards:number = (<CustomEvent>event).detail.numberOfCards;
        const randomNumber:number = randomIntBetweenInterval(0, numberOfCards - 1);

        for (let i = 0; i < numberOfCards; i++) {
            const type:string = (i == randomNumber) ? 'cross' : 'tick';
            const cardInner = document.createElement('div');
            cardInner.classList.add('card-inner');
    
            cardInner.addEventListener('click', cardClickedEventHandler);
            cardInner.dataset.type = type
    
            const flip_card_html = `
                <div class="card-front">
                    <img src="images/card_front.jpg" alt="purple card with question mark on it">
                </div>
    
                <div class="card-back">
                    <img src="images/card_back_${type}.jpg" alt="card with a ${type} on it">
                </div>
            `
            cardInner?.insertAdjacentHTML('beforeend', flip_card_html);
    
            cardsContainer?.appendChild(cardInner);
        }
    });    
}


function cardClickedEventHandler(event:MouseEvent): void {
    const cardElement = event.currentTarget as HTMLElement;
    if (!cardElement?.classList.contains('card-flipped')){
        cardElement?.classList.toggle('card-flipped');

        if (cardElement.dataset.type == 'tick'){
            console.log('success!')
        }
        else {
            doLossAnimation(cardElement);
        }
    }
}

function doLossAnimation(card:HTMLElement): void {
    const cardsContainer = document.querySelector('.cards-container') as HTMLElement;
    cardsContainer.style.pointerEvents = 'none';

    setTimeout(() => {
        card.setAttribute('style', 'animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both');
    }, 500);
    setTimeout(() => {
        displayEndGameWindow();
    }, 1200);
}


function displayEndGameWindow(): void {
    const gameScreen = document.querySelector('.roulette-container') as HTMLElement;
    gameScreen.style.filter = 'blur(2px)';

    const exitWindow = document.querySelector('.exit-window') as HTMLElement;
    exitWindow.style.display = 'flex';

    const restartButton = document.querySelector('#restart');
    restartButton?.addEventListener('click', () => {
        // reset window
        const rouletteContainer = document.querySelector('.roulette-container') as HTMLElement;
        rouletteContainer.remove();
        const exitWindow = document.querySelector('.exit-window') as HTMLElement;
        exitWindow.style.display = 'none';

        const cachedNumberOfCards:number = parseInt(localStorage['numberOfCards']);
        const renderRouletteEvent = new CustomEvent('render-roulette', {
            detail: {
                numberOfCards : cachedNumberOfCards,
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

