MOTION AUTO PHOTO BLUR - WINDOWS TO IPHONE

This is a prototype progressive web app (PWA), not an App Store app.
It uses @imgly/background-removal in Safari to remove the background and applies blur underneath the vehicle. AI mask quality, performance and compatibility require testing on your actual iPhone.

HOW TO PUBLISH WITHOUT A MAC
1. Create a free GitHub account at https://github.com
2. Create a PUBLIC repository, e.g. motion-auto-blur.
3. Upload all files from this folder to the root of the repository (not the ZIP itself).
4. In repository Settings > Pages, choose Deploy from a branch, main, /(root), Save.
5. Wait for GitHub Pages to publish. Open the HTTPS URL GitHub provides in Safari on your iPhone.
6. Safari Share > Add to Home Screen.

USE
- Take Photo uses iPhone camera picker; Select Photos allows batch selection.
- Choose blur strength (default 20), tap Blur selected photos.
- Save / Share each photo, or save all as a ZIP.
- Photos are processed in browser; no photo-upload server.

LIMITATIONS
- First use needs internet for JS and AI model downloads; do not assume offline model availability.
- iPhone Safari may reload memory-heavy pages, especially with many large photos. Start with 1-3 photos.
- Background removal quality may vary; vehicle masks can miss mirrors, glass, wheel gaps and details.
- Safari may put ZIPs in Files/Downloads; use the per-photo Share action to save to Photos.
- Outputs are resized to a max 2400px dimension for memory safety.
- The model/runtime are fetched from third-party CDNs; review third-party licenses and policies before commercial use.
- No actual iPhone testing or production deployment has been performed.
