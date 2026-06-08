document.addEventListener('DOMContentLoaded', function() {
    const speedSelect = document.getElementById('speedSelect');

    // Load previously saved speed, default to 16x if empty
    chrome.storage.local.get(['adSpeed'], function(result) {
        if (result.adSpeed) {
            speedSelect.value = result.adSpeed;
        } else {
            speedSelect.value = "16"; 
        }
    });

    // Save changes to memory instantly when selecting a new speed
    speedSelect.addEventListener('change', function() {
        chrome.storage.local.set({ adSpeed: parseInt(speedSelect.value) });
    });
});