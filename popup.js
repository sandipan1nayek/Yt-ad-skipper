document.addEventListener('DOMContentLoaded', function() {
    const speedSelect = document.getElementById('speedSelect');

    // 1. Check memory to see what speed you chose last time (default to 16x)
    chrome.storage.local.get(['adSpeed'], function(result) {
        if (result.adSpeed) {
            speedSelect.value = result.adSpeed;
        } else {
            speedSelect.value = "16"; // Set default dropdown visual to 16x
        }
    });

    // 2. When you pick a new speed, save it to memory instantly
    speedSelect.addEventListener('change', function() {
        chrome.storage.local.set({ adSpeed: parseInt(speedSelect.value) });
    });
});