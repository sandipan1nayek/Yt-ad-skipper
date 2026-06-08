let isAdActive = false;
let backupSpeed = 16; 

// Initial read from memory
chrome.storage.local.get(['adSpeed'], function(result) {
    if (result.adSpeed) {
        backupSpeed = result.adSpeed;
    }
});

// Update speed config if changed in the popup menu on the fly
chrome.storage.onChanged.addListener(function(changes, namespace) {
    if (changes.adSpeed) {
        backupSpeed = changes.adSpeed.newValue;
    }
});

// Run loop every 250ms for lightning fast reaction times
setInterval(() => {
    const video = document.querySelector('video.html5-main-video');
    if (!video) return;

    // Check if YouTube has applied the ad flag to the player canvas wrapper
    const isAdShowing = document.querySelector('.ad-showing') !== null;

    if (isAdShowing) {
        // 1. Mute audio instantly to protect the vibe
        video.muted = true;
        isAdActive = true;

        // 2. Teleport playhead straight to the final millisecond of the ad file
        if (video.duration && video.currentTime < video.duration - 0.2) {
            video.currentTime = video.duration - 0.1;
        }
        
        // 3. Apply the speed controller as a secondary acceleration layer
        if (video.playbackRate < backupSpeed) {
            video.playbackRate = backupSpeed;
        }
    } else {
        // Clear modifiers once normal main content video resumes
        if (isAdActive) {
            video.playbackRate = 1; 
            video.muted = false;    
            isAdActive = false;
        }
    }
}, 250);