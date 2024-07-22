async function fetchWithRefreshes(url, refreshCount, delay) {
    for (let i = 0; i < refreshCount; i++) {
        try {
            console.log(`Refreshing ${i + 1} out of ${refreshCount}`);
            await fetch(url, { cache: 'reload' }); // Use cache: 'reload' to bypass the cache
            await new Promise(resolve => setTimeout(resolve, delay)); // Wait for the specified delay
        } catch (error) {
            console.error('Error during refresh:', error);
        }
    }
    
    // After the refreshes, fetch the final content
    try {
        const response = await fetch(url, { cache: 'reload' });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');

        const p = Array.from(doc.querySelectorAll('p')).map(element => element.textContent);
        const arr = p[1].split('-')

        const lyricsUrl = `https://api.lyrics.ovh/v1/${p[2]}/${arr[0]}`;
        const lyricsResponse = await fetch(lyricsUrl);
        const result = await lyricsResponse.json();
        const lyrics = result.lyrics;

        const formattedLyrics = lyrics.replace(/\n/g, '<br>');
        const lyricsElement = document.getElementById('lyrics');
        lyricsElement.innerHTML = formattedLyrics;
        const headerElement = document.getElementById("player");
        headerElement.innerHTML=`<img src="https://now-playing-spotify-server.vercel.app/now-playing" width="512" height="64" alt="Now Playing">`
    } catch (error) {
        console.error('Error fetching the final content:', error);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const scrapeUrl = 'https://now-playing-spotify-server.vercel.app/now-playing';
    const refreshCount = 3; // Number of times to refresh
    const delay = 1000; // Delay between refreshes in milliseconds

    fetchWithRefreshes(scrapeUrl, refreshCount, delay);
});
