let isAdSpeedUpActive = false;
let currentAdSpeed = 16; // Default to absolute maximum speed

// 1. Fetch your saved speed from memory when YouTube loads
chrome.storage.local.get(['adSpeed'], function(result) {
    if (result.adSpeed) {
        currentAdSpeed = result.adSpeed;
    }
});

// 2. Listen in case you change the speed from the popup while watching a video
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.adSpeed) {
        currentAdSpeed = changes.adSpeed.newValue;
    }
});

// 3. The main ghost loop that runs twice a second
setInterval(() => {
    // Find the actual video player
    const video = document.querySelector('video.html5-main-video');
    if (!video) return;

    // Check if YouTube's wrapper has the "ad-showing" class
    const isAdShowing = document.querySelector('.ad-showing') !== null;
    
    // Look for all known variations of the YouTube skip button class
    const skipButton = document.querySelector('.ytp-ad-skip-button, .ytp-ad-skip-button-modern, .ytp-skip-ad-button, .ytp-ad-skip-button-container');

    if (isAdShowing) {
        // We are inside an ad! Crank the speed and mute it so you don't hear chipmunk audio.
        if (video.playbackRate < currentAdSpeed) {
            video.playbackRate = currentAdSpeed;
            video.muted = true; 
            isAdSpeedUpActive = true;
        }

        // The exact millisecond the skip button physically renders on screen, click it
        if (skipButton) {
            skipButton.click();
        }
    } else {
        // No ad is playing. If we just finished speeding one up, reset the video to normal.
        if (isAdSpeedUpActive) {
            video.playbackRate = 1; // Return to standard 1x speed
            video.muted = false;    // Give audio back
            isAdSpeedUpActive = false;
        }
    }
}, 500);