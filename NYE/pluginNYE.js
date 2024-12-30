/*
    Requires 'DSEG7Modern-Regular.ttf' in 'web' folder for digital font - https://github.com/keshikan/DSEG/releases
*/

(() => {

    // Function to fetch server time
    async function fetchServerTime() {
        try {
            const response = await fetch('/server_time');
            const data = await response.json();
            return new Date(data.serverTime).getTime();
        } catch (error) {
            console.error('Error fetching server time:', error);
            return null;
        }
    }

    // Function to format time with leading zeroes
    function formatTime(value) {
        return value.toString().padStart(2, '0');
    }

    // Function to update the countdown
    async function updateCountdown() {
        const countdownElement = document.getElementById('new-countdown-div');
        if (!countdownElement) return;

        const newYear = new Date('2025-01-01T00:00:00.000Z').getTime();
        const serverTime = await fetchServerTime();

        if (!serverTime) return;

        const timeLeft = newYear - serverTime;

        const totalHours = Math.floor(timeLeft / (1000 * 60 * 60));
        const hours = formatTime(Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        const minutes = formatTime(Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60)));
        const seconds = formatTime(Math.floor((timeLeft % (1000 * 60)) / 1000));

        const fontSize = window.innerHeight < 860 ? 64 : 96;
        countdownElement.innerHTML = `<span class="text-small" style="font-family: 'Titillium Web', sans-serif; font-size: ${fontSize / 4}px; color: var(--color-5); font-weight: 700; opacity: 0.9;">NEW YEAR COUNTDOWN</span> <span class="text-small" style="font-family: 'Digital-font', 'Titillium Web', sans-serif; font-size: ${fontSize}px; color: var(--color-text-2); opacity: 0.8;">${totalHours}:${minutes}:${seconds}</span>`;

        if (timeLeft < 0) {
            clearInterval(interval);
            countdownElement.innerHTML = `<span style="font-size: ${fontSize}px; color: var(--color-5);">Happy New Year!</span>`;
        }
    }

    function loadFont(url) {
        const font = new FontFace('Digital-font', `url(${url})`);
        font.load().then((loadedFont) => {
            document.fonts.add(loadedFont);
        }).catch((error) => {
            console.error('Font loading failed:', error);
        });
    }

    // Create the countdown display
    const signalCanvas = document.getElementById('signal-canvas');
    let countdownDiv;
    if (signalCanvas) {
        signalCanvas.style.visibility = 'hidden';

        countdownDiv = document.createElement('div');
        countdownDiv.id = 'new-countdown-div';
        countdownDiv.style.display = 'flex';
        countdownDiv.style.flexDirection = 'column';
        countdownDiv.style.justifyContent = 'center';
        countdownDiv.style.alignItems = 'center';
        countdownDiv.style.textAlign = 'center';
        countdownDiv.style.height = '95%';
        countdownDiv.style.width = '96.75%';
        countdownDiv.style.maxWidth = '1170px';
        countdownDiv.style.position = 'absolute';
        countdownDiv.style.top = 0;
        countdownDiv.style.left = '50%';
        countdownDiv.style.transform = 'translateX(-50%)';
        //countdownDiv.style.border = '1px solid var(--color-4)';
        countdownDiv.style.borderRadius = '14px';
        countdownDiv.style.backgroundColor = 'var(--color-1-transparent)';
        countdownDiv.style.padding = '16px';
        countdownDiv.style.boxSizing = 'border-box';

        const parent = signalCanvas.parentNode;
        parent.style.position = 'relative';

        parent.appendChild(countdownDiv);
    }

    loadFont('./DSEG7Modern-Regular.ttf'); // https://github.com/keshikan/DSEG/releases
    //loadFont('./DSEG14Modern-Regular.ttf'); // https://github.com/keshikan/DSEG/releases
                                   
    const interval = setInterval(updateCountdown, 500);

    updateCountdown();

    // Create the Countdown Button
    const COUNTDOWN_BUTTON_NAME = 'COUNTDOWN';
    const countdownCss = `
    #countdown-button {
        border-radius: 0px;
        width: 100px;
        height: 22px;
        position: relative;
        margin-top: 8px;
        margin-left: 5px;
        right: 0px;
    }

    #countdown-button.active {
        background-color: var(--color-4);
    }
    `;

    $("<style>")
        .prop("type", "text/css")
        .html(countdownCss)
        .appendTo("head");

    const countdownText = $('<strong>', {
        class: 'countdown-text',
        html: COUNTDOWN_BUTTON_NAME
    });

    const countdownButton = $('<button>', {
        id: 'countdown-button',
        class: 'active' // Active by default
    });

    countdownButton.append(countdownText);

    function initializeCountdownButton() {
        let buttonWrapper = $('#button-wrapper');
        if (buttonWrapper.length < 1) {
            buttonWrapper = createDefaultButtonWrapper();
        }

        if (buttonWrapper.length) {
            countdownButton.addClass('hide-phone bg-color-2');
            buttonWrapper.append(countdownButton);
        }
    }

    function createDefaultButtonWrapper() {
        const wrapperElement = $('.tuner-info');
        if (wrapperElement.length) {
            const buttonWrapper = $('<div>', {
                id: 'button-wrapper'
            });
            buttonWrapper.addClass('button-wrapper');
            wrapperElement.append(buttonWrapper);
            wrapperElement.append(document.createElement('br'));
            return buttonWrapper;
        } else {
            console.error('Countdown: Standard button location not found. Unable to add button.');
            return null;
        }
    }

    $(window).on('load', function() {
        setTimeout(initializeCountdownButton, 200);

        countdownButton.on('click', function() {
            toggleCountdownDisplay();
            $(this).toggleClass('active');
        });
    });

    function toggleCountdownDisplay() {
        if (signalCanvas && countdownDiv) {
            const isCountdownVisible = countdownDiv.style.display === 'flex';
            countdownDiv.style.display = isCountdownVisible ? 'none' : 'flex';
            signalCanvas.style.visibility = isCountdownVisible ? 'visible' : 'hidden';
        }
    }

    let isManuallyHidden = false;

    function isAnyElementVisible() {
        const sdrGraph = document.querySelector("#sdr-graph");
        const loggingCanvas = document.querySelector("#logging-canvas");

        const isSdrGraphVisible = sdrGraph && window.getComputedStyle(sdrGraph).display !== 'none';
        const isLoggingCanvasVisible = loggingCanvas && window.getComputedStyle(loggingCanvas).display !== 'none';

        return isSdrGraphVisible || isLoggingCanvasVisible;
    }

    function toggleVisibility() {
        const countdownDiv = document.querySelector("#new-countdown-div");
        const signalCanvas = document.querySelector("#signal-canvas");
        const countdownButton = document.querySelector("#countdown-button");

        if (!countdownDiv || !signalCanvas || !countdownButton) return;

        if (window.getComputedStyle(countdownDiv).display !== 'flex') {
            countdownButton.classList.remove('bg-color-4');  // Remove highlight
        }

        if (isManuallyHidden) {
            // If manually hidden, don't automatically show the countdown
            signalCanvas.style.visibility = 'visible';
            return;
        }

        // Check if the countdown div is visible
        const isCountdownVisible = window.getComputedStyle(countdownDiv).display === 'flex';

        if (isAnyElementVisible()) {
            countdownDiv.style.display = 'none';
            signalCanvas.style.visibility = 'hidden';
        } else {
            countdownDiv.style.display = 'flex';  // Show countdown
            signalCanvas.style.visibility = 'hidden';
        }

        // Highlight button if countdown is visible
        if (isCountdownVisible) {
            countdownButton.classList.add('bg-color-4');
        }
    }

    function startMutationObserver() {
        const countdownDiv = document.querySelector("#new-countdown-div");
        const sdrGraph = document.querySelector("#sdr-graph");
        const loggingCanvas = document.querySelector("#logging-canvas");

        const observer = new MutationObserver(() => {
            toggleVisibility();
        });

        observer.observe(countdownDiv, {
            attributes: true,
            attributeFilter: ['style'],
        });

        observer.observe(sdrGraph, {
            attributes: true,
            attributeFilter: ['style'],
        });

        observer.observe(loggingCanvas, {
            attributes: true,
            attributeFilter: ['style'],
        });
    }

    function toggleCountdownDisplay() {
        const countdownDiv = document.querySelector("#new-countdown-div");
        const signalCanvas = document.querySelector("#signal-canvas");
        const countdownButton = document.querySelector("#countdown-button");

        if (countdownDiv && signalCanvas && countdownButton) {
            const isCountdownVisible = window.getComputedStyle(countdownDiv).display === 'flex';

            if (isCountdownVisible) {
                countdownDiv.style.display = 'none';
                signalCanvas.style.visibility = 'visible';
                isManuallyHidden = true;
                countdownButton.classList.remove('bg-color-4');
            } else {
                countdownDiv.style.display = 'flex';
                signalCanvas.style.visibility = 'hidden';
                isManuallyHidden = false;
                countdownButton.classList.add('bg-color-4');
            }
        }
    }

    window.onload = function() {
        startMutationObserver();
        
        const countdownButton = document.querySelector('#countdown-button');
        if (countdownButton) {
            countdownButton.addEventListener('click', toggleCountdownDisplay);
        }
    };
})();
