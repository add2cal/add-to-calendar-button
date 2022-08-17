/**
 * ++++++++++++++++++++++
 * Add-to-Calendar Button
 * ++++++++++++++++++++++
 */
const atcbVersion = '1.14.3';
/* Creator: Jens Kuerschner (https://jenskuerschner.de)
 * Project: https://github.com/add2cal/add-to-calendar-button
 * License: MIT with “Commons Clause” License Condition v1.0
 *
 */

// CHECKING FOR SPECIFIC DEVICED AND SYSTEMS
// browser
const isBrowser = new Function('try { return this===window; } catch(e) { return false; }');
// iOS
const isiOS = isBrowser()
  ? new Function(
      'if ((/iPad|iPhone|iPod/i.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1)) { return true; } else { return false; }'
    )
  : new Function('return false;');
// Android
const isAndroid = isBrowser()
  ? new Function(
      'if (/android/i.test(navigator.userAgent || navigator.vendor || window.opera) && !window.MSStream) { return true; } else { return false; }'
    )
  : new Function('return false;');
// Mobile
const isMobile = () => {
  if (isAndroid() || isiOS()) {
    return true;
  } else {
    return false;
  }
};
// WebView (iOS and Android)
const isWebView = isBrowser()
  ? new Function(
      'if (/(; ?wv|(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari))/i.test(navigator.userAgent || navigator.vendor)) { return true; } else { return false; }'
    )
  : new Function('return false;');
// checking for problematic apps
const isProblematicWebView = isBrowser()
  ? new Function(
      'if (/(Instagram)/i.test(navigator.userAgent || navigator.vendor || window.opera)) { return true; } else { return false; }'
    )
  : new Function('return false;');

// DEFINE DEFAULT LINK TARGET
let atcbDefaultTarget = '_blank';
if (isWebView()) {
  atcbDefaultTarget = '_system';
}

// DEFINING GLOBAL ICONS
const atcbIcon = {
  trigger:
    '<svg class="atcb-icon-trigger" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200.016"><path d="M132.829 7.699c0-4.248 4.199-7.699 9.391-7.699s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zm-5.941 123.747c2.979 0 5.404 2.425 5.404 5.404s-2.425 5.404-5.404 5.404l-21.077-.065-.065 21.045c0 2.979-2.425 5.404-5.404 5.404s-5.404-2.425-5.404-5.404l.065-21.061-21.045-.081c-2.979 0-5.404-2.425-5.404-5.404s2.425-5.404 5.404-5.404l21.061.065.065-21.045c0-2.979 2.425-5.404 5.404-5.404s5.404 2.425 5.404 5.404l-.065 21.077 21.061.065zM48.193 7.699C48.193 3.451 52.393 0 57.585 0s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zM10.417 73.763h179.167V34.945c0-1.302-.537-2.49-1.4-3.369-.863-.863-2.051-1.4-3.369-1.4h-17.171c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h17.171c4.183 0 7.975 1.709 10.726 4.46S200 30.762 200 34.945v44.043 105.843c0 4.183-1.709 7.975-4.46 10.726s-6.543 4.46-10.726 4.46H15.186c-4.183 0-7.975-1.709-10.726-4.46C1.709 192.79 0 188.997 0 184.814V78.988 34.945c0-4.183 1.709-7.975 4.46-10.726s6.543-4.46 10.726-4.46h18.343c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208H15.186c-1.302 0-2.49.537-3.369 1.4-.863.863-1.4 2.051-1.4 3.369zm179.167 10.433H10.417v100.618c0 1.302.537 2.49 1.4 3.369.863.863 2.051 1.4 3.369 1.4h169.629c1.302 0 2.49-.537 3.369-1.4.863-.863 1.4-2.051 1.4-3.369zM82.08 30.176c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h34.977c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208z"/></svg>',
  apple:
    '<svg class="atcb-icon-apple" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 245.657"><path d="M167.084 130.514c-.308-31.099 25.364-46.022 26.511-46.761-14.429-21.107-36.91-24.008-44.921-24.335-19.13-1.931-37.323 11.27-47.042 11.27-9.692 0-24.67-10.98-40.532-10.689-20.849.308-40.07 12.126-50.818 30.799-21.661 37.581-5.54 93.281 15.572 123.754 10.313 14.923 22.612 31.688 38.764 31.089 15.549-.612 21.433-10.073 40.242-10.073s24.086 10.073 40.546 9.751c16.737-.308 27.34-15.214 37.585-30.187 11.855-17.318 16.714-34.064 17.009-34.925-.372-.168-32.635-12.525-32.962-49.68l.045-.013zm-30.917-91.287C144.735 28.832 150.524 14.402 148.942 0c-12.344.503-27.313 8.228-36.176 18.609-7.956 9.216-14.906 23.904-13.047 38.011 13.786 1.075 27.862-7.004 36.434-17.376z"/></svg>',
  google:
    '<svg class="atcb-icon-google" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M152.637 47.363H47.363v105.273h105.273z" fill="#fff"/><path d="M152.637 200L200 152.637h-47.363z" fill="#f72a25"/><path d="M200 47.363h-47.363v105.273H200z" fill="#fbbc04"/><path d="M152.637 152.637H47.363V200h105.273z" fill="#34a853"/><path d="M0 152.637v31.576A15.788 15.788 0 0 0 15.788 200h31.576v-47.363z" fill="#188038"/><path d="M200 47.363V15.788A15.79 15.79 0 0 0 184.212 0h-31.575v47.363z" fill="#1967d2"/><path d="M15.788 0A15.79 15.79 0 0 0 0 15.788v136.849h47.363V47.363h105.274V0z" fill="#4285f4"/><path d="M68.962 129.02c-3.939-2.653-6.657-6.543-8.138-11.67l9.131-3.76c.83 3.158 2.279 5.599 4.346 7.341 2.051 1.742 4.557 2.588 7.471 2.588 2.995 0 5.55-.911 7.699-2.718 2.148-1.823 3.223-4.134 3.223-6.934 0-2.865-1.139-5.208-3.402-7.031s-5.111-2.718-8.496-2.718h-5.273v-9.033h4.736c2.913 0 5.387-.781 7.389-2.376 2.002-1.579 2.995-3.743 2.995-6.494 0-2.441-.895-4.395-2.686-5.859s-4.053-2.197-6.803-2.197c-2.686 0-4.818.716-6.396 2.148s-2.767 3.255-3.451 5.273l-9.033-3.76c1.204-3.402 3.402-6.396 6.624-8.984s7.34-3.89 12.337-3.89c3.695 0 7.031.716 9.977 2.148s5.257 3.418 6.934 5.941c1.676 2.539 2.507 5.387 2.507 8.545 0 3.223-.781 5.941-2.327 8.187-1.546 2.23-3.467 3.955-5.729 5.143v.537a17.39 17.39 0 0 1 7.34 5.729c1.904 2.572 2.865 5.632 2.865 9.212s-.911 6.771-2.718 9.57c-1.823 2.799-4.329 5.013-7.52 6.624s-6.787 2.425-10.775 2.425c-4.622 0-8.887-1.318-12.826-3.988zm56.087-45.312l-10.026 7.243-5.013-7.601 17.985-12.972h6.901v61.198h-9.847z" fill="#1a73e8"/></svg>',
  ical: '<svg class="atcb-icon-ical" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200.016"><path d="M132.829 7.699c0-4.248 4.199-7.699 9.391-7.699s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zm-25.228 161.263c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm-81.803-59.766c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.918 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM25.798 139.079c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.918 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM25.798 168.962c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zm40.902 0c-.553 0-.993-2.327-.993-5.208s.439-5.208.993-5.208h25.7c.553 0 .993 2.327.993 5.208s-.439 5.208-.993 5.208zM48.193 7.699C48.193 3.451 52.393 0 57.585 0s9.391 3.451 9.391 7.699v33.724c0 4.248-4.199 7.699-9.391 7.699s-9.391-3.451-9.391-7.699zM10.417 73.763h179.15V34.945c0-1.302-.537-2.49-1.4-3.369-.863-.863-2.051-1.4-3.369-1.4h-17.155c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h17.171c4.183 0 7.975 1.709 10.726 4.46S200 30.762 200 34.945v44.043 105.843c0 4.183-1.709 7.975-4.46 10.726s-6.543 4.46-10.726 4.46H15.186c-4.183 0-7.975-1.709-10.726-4.46C1.709 192.79 0 188.997 0 184.814V78.971 34.945c0-4.183 1.709-7.975 4.46-10.726s6.543-4.46 10.726-4.46h18.343c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208H15.186c-1.302 0-2.49.537-3.369 1.4-.863.863-1.4 2.051-1.4 3.369zm179.167 10.433H10.417v100.618c0 1.302.537 2.49 1.4 3.369.863.863 2.051 1.4 3.369 1.4h169.629c1.302 0 2.49-.537 3.369-1.4.863-.863 1.4-2.051 1.4-3.369zM82.08 30.176c-2.881 0-5.208-2.327-5.208-5.208s2.327-5.208 5.208-5.208h34.977c2.881 0 5.208 2.327 5.208 5.208s-2.327 5.208-5.208 5.208z"/></svg>',
  msteams:
    '<svg class="atcb-icon-msteams" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 200 186.047"><path d="M195.349 39.535a20.93 20.93 0 1 1-41.86 0 20.93 20.93 0 1 1 41.86 0zm-55.847 30.233h51.66A8.84 8.84 0 0 1 200 78.605v47.056c0 17.938-14.541 32.479-32.479 32.479h0-.154c-17.938.003-32.481-14.537-32.484-32.474v-.005-51.274a4.62 4.62 0 0 1 4.619-4.619z" fill="#5059c9"/><path d="M149.614 69.767H64.34c-4.823.119-8.637 4.122-8.526 8.944v53.67c-.673 28.941 22.223 52.957 51.163 53.665 28.94-.708 51.836-24.725 51.163-53.665v-53.67c.112-4.823-3.703-8.825-8.526-8.944zm-10.079-39.535a30.233 30.233 0 0 1-60.465 0 30.233 30.233 0 0 1 60.465 0z" fill="#7b83eb"/><path opacity=".1" d="M111.628 69.767v75.209c-.023 3.449-2.113 6.547-5.302 7.86-1.015.43-2.107.651-3.209.651H59.907l-1.628-4.651c-1.628-5.337-2.459-10.885-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".2" d="M106.977 69.767v79.86a8.241 8.241 0 0 1-.651 3.209c-1.313 3.189-4.412 5.279-7.86 5.302H62.093l-2.186-4.651a46.13 46.13 0 0 1-1.628-4.651 56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".2" d="M102.326 69.767v70.558a8.58 8.58 0 0 1-8.512 8.512H58.279a56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z"/><path opacity=".1" d="M111.628 45.721v14.651l-2.326.093c-.791 0-1.535-.046-2.326-.093-1.57-.104-3.127-.353-4.651-.744a30.233 30.233 0 0 1-20.93-17.767 25.845 25.845 0 0 1-1.488-4.651h23.209c4.693.018 8.494 3.818 8.512 8.512z"/><use xlink:href="#B" opacity=".2" transform="scale(.08973306)"/><path d="M106.977 50.372v10c-1.57-.104-3.127-.353-4.651-.744a30.233 30.233 0 0 1-20.93-17.767h17.07c4.693.018 8.494 3.818 8.512 8.512zm0 19.395v70.558a8.58 8.58 0 0 1-8.512 8.512H58.279a56.647 56.647 0 0 1-2.465-16.465V78.698c-.112-4.815 3.697-8.811 8.512-8.93z" opacity=".2"/><path opacity=".2" d="M102.326 50.372v9.256a30.233 30.233 0 0 1-20.93-17.767h12.419c4.693.018 8.494 3.818 8.512 8.512z"/><linearGradient id="A" gradientUnits="userSpaceOnUse" x1="17.776" y1="35.199" x2="84.55" y2="150.848"><stop offset="0" stop-color="#5a62c3"/><stop offset=".5" stop-color="#4d55bd"/><stop offset="1" stop-color="#3940ab"/></linearGradient><path fill="url(#A)" d="M8.526 41.86H93.8a8.53 8.53 0 0 1 8.526 8.526v85.274a8.53 8.53 0 0 1-8.526 8.526H8.526A8.53 8.53 0 0 1 0 135.66V50.386a8.53 8.53 0 0 1 8.526-8.526z"/><path fill="#fff" d="M73.6 74.316H56.553v46.419h-10.86V74.316H28.726v-9.005H73.6z"/><defs><path id="B" d="M1192.167 561.355v111.442c-17.496-1.161-34.848-3.937-51.833-8.293a336.92 336.92 0 0 1-233.25-198.003h190.228c52.304.198 94.656 42.55 94.855 94.854z"/></defs></svg>',
  ms365:
    '<svg class="atcb-icon-ms365" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 239.766"><path d="M200 219.785l-.021-.012V20.591L128.615 0 .322 48.172 0 48.234.016 192.257l43.78-17.134V57.943l84.819-20.279-.012 172.285L.088 192.257l128.515 47.456v.053l71.376-19.753v-.227z"/></svg>',
  outlookcom:
    '<svg class="atcb-icon-outlookcom" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 175"><path d="M178.725 0H71.275A8.775 8.775 0 0 0 62.5 8.775v9.975l60.563 18.75L187.5 18.75V8.775A8.775 8.775 0 0 0 178.725 0z" fill="#0364b8"/><path d="M197.813 96.281c.915-2.878 2.187-5.855 2.187-8.781-.002-1.485-.795-2.857-1.491-3.26l-68.434-38.99a9.37 9.37 0 0 0-9.244-.519c-.312.154-.614.325-.906.512l-67.737 38.6-.025.013-.075.044a4.16 4.16 0 0 0-2.088 3.6c.541 2.971 1.272 5.904 2.188 8.781l71.825 52.532z" fill="#0a2767"/><path d="M150 18.75h-43.75L93.619 37.5l12.631 18.75L150 93.75h37.5v-37.5z" fill="#28a8ea"/><path d="M150 18.75h37.5v37.5H150z" fill="#50d9ff"/><path d="M150 93.75l-43.75-37.5H62.5v37.5l43.75 37.5 67.7 11.05z" fill="#0364b8"/><path d="M106.25 56.25v37.5H150v-37.5zM150 93.75v37.5h37.5v-37.5zm-87.5-75h43.75v37.5H62.5z" fill="#0078d4"/><path d="M62.5 93.75h43.75v37.5H62.5z" fill="#064a8c"/><path d="M126.188 145.113l-73.706-53.75 3.094-5.438 68.181 38.825a3.3 3.3 0 0 0 2.625-.075l68.331-38.937 3.1 5.431z" fill="#0a2767" opacity=".5"/><path d="M197.919 91.106l-.088.05-.019.013-67.738 38.588c-2.736 1.764-6.192 1.979-9.125.569l23.588 31.631 51.588 11.257v-.001c2.434-1.761 3.876-4.583 3.875-7.587V87.5c.001 1.488-.793 2.862-2.081 3.606z" fill="#1490df"/><path d="M200 165.625v-4.613l-62.394-35.55-7.531 4.294a9.356 9.356 0 0 1-9.125.569l23.588 31.631 51.588 11.231v.025a9.362 9.362 0 0 0 3.875-7.588z" opacity=".05"/><path d="M199.688 168.019l-68.394-38.956-1.219.688c-2.734 1.766-6.19 1.984-9.125.575l23.588 31.631 51.587 11.256v.001a9.38 9.38 0 0 0 3.562-5.187z" opacity=".1"/><path d="M51.455 90.721c-.733-.467-1.468-1.795-1.455-3.221v78.125c-.007 5.181 4.194 9.382 9.375 9.375h131.25c1.395-.015 2.614-.366 3.813-.813.638-.258 1.252-.652 1.687-.974z" fill="#28a8ea"/><path d="M112.5 141.669V39.581a8.356 8.356 0 0 0-8.331-8.331H62.687v46.6l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031V150h54.169a8.356 8.356 0 0 0 8.331-8.331z" opacity=".1"/><path d="M106.25 147.919V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 68.75h47.919a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M106.25 135.419V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 56.25h47.919a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M100 135.419V45.831a8.356 8.356 0 0 0-8.331-8.331H62.687v40.35l-10.5 5.987-.031.012-.075.044A4.162 4.162 0 0 0 50 87.5v.031-.031 56.25h41.669a8.356 8.356 0 0 0 8.331-8.331z" opacity=".2"/><path d="M8.331 37.5h83.337A8.331 8.331 0 0 1 100 45.831v83.338a8.331 8.331 0 0 1-8.331 8.331H8.331A8.331 8.331 0 0 1 0 129.169V45.831A8.331 8.331 0 0 1 8.331 37.5z" fill="#0078d4"/><path d="M24.169 71.675a26.131 26.131 0 0 1 10.263-11.337 31.031 31.031 0 0 1 16.313-4.087 28.856 28.856 0 0 1 15.081 3.875 25.875 25.875 0 0 1 9.988 10.831 34.981 34.981 0 0 1 3.5 15.938 36.881 36.881 0 0 1-3.606 16.662 26.494 26.494 0 0 1-10.281 11.213 30 30 0 0 1-15.656 3.981 29.556 29.556 0 0 1-15.425-3.919 26.275 26.275 0 0 1-10.112-10.85 34.119 34.119 0 0 1-3.544-15.744 37.844 37.844 0 0 1 3.481-16.563zm10.938 26.613a16.975 16.975 0 0 0 5.769 7.463 15.069 15.069 0 0 0 9.019 2.719 15.831 15.831 0 0 0 9.631-2.806 16.269 16.269 0 0 0 5.606-7.481 28.913 28.913 0 0 0 1.787-10.406 31.644 31.644 0 0 0-1.687-10.538 16.681 16.681 0 0 0-5.413-7.75 14.919 14.919 0 0 0-9.544-2.956 15.581 15.581 0 0 0-9.231 2.744 17.131 17.131 0 0 0-5.9 7.519 29.85 29.85 0 0 0-.044 21.5z" fill="#fff"/></svg>',
  yahoo:
    '<svg class="atcb-icon-yahoo" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 177.803"><path d="M0 43.284h38.144l22.211 56.822 22.5-56.822h37.135L64.071 177.803H26.694l15.308-35.645L.001 43.284zm163.235 45.403H121.64L158.558 0 200 .002zm-30.699 8.488c12.762 0 23.108 10.346 23.108 23.106s-10.345 23.106-23.108 23.106a23.11 23.11 0 0 1-23.104-23.106 23.11 23.11 0 0 1 23.104-23.106z"/></svg>',
  close:
    '<svg class="atcb-icon-close" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path d="M2.321 13.529a7.927 7.927 0 0 1 0-11.208 7.927 7.927 0 0 1 11.208 0l86.471 86.471L186.47 2.321a7.927 7.927 0 0 1 11.209 0 7.927 7.927 0 0 1 0 11.208l-86.474 86.469 86.472 86.473a7.927 7.927 0 0 1-11.209 11.208l-86.471-86.471-86.469 86.471a7.927 7.927 0 0 1-11.208-11.208l86.471-86.473z"/></svg>',
  browser:
    '<svg class="atcb-icon-browser" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 245.657"><path d="M117.011 163.676q-6.283 6.218-13.623 12.419l6.087-1.009a80.373 80.373 0 0 0 11.524-3.255l.7 1.042 1.628 2.067h0 0a26.693 26.693 0 0 0 3.467 3.255 89.992 89.992 0 0 1-15.837 4.753 95.592 95.592 0 0 1-37.159 0 87.046 87.046 0 0 1-17.253-5.322.423.423 0 0 1-.228-.114 101.077 101.077 0 0 1-15.625-8.415 88.56 88.56 0 0 1-13.672-11.214 85.761 85.761 0 0 1-11.214-13.64 97.317 97.317 0 0 1-8.545-15.658 90.806 90.806 0 0 1-5.436-17.546 95.592 95.592 0 0 1 0-37.159 86.037 86.037 0 0 1 5.339-17.253.537.537 0 0 1 .098-.228 98.212 98.212 0 0 1 8.545-15.707 87.893 87.893 0 0 1 11.214-13.656 84.947 84.947 0 0 1 13.672-11.231A97.17 97.17 0 0 1 56.43 7.259a88.739 88.739 0 0 1 17.448-5.436 95.592 95.592 0 0 1 37.159 0 87.714 87.714 0 0 1 17.253 5.322.456.456 0 0 1 .212.114 100.507 100.507 0 0 1 15.756 8.545 88.56 88.56 0 0 1 13.623 11.198 85.077 85.077 0 0 1 11.214 13.688 94.713 94.713 0 0 1 8.545 15.739 88.739 88.739 0 0 1 5.436 17.481l.195.977-8.822-2.49a76.499 76.499 0 0 0-4.232-12.744 88.251 88.251 0 0 0-4.671-9.375H138.48a106.562 106.562 0 0 1 6.836 13.819l-10.026-2.702a106.985 106.985 0 0 0-6.283-11.117H96.454v5.55l-.993.358a21.941 21.941 0 0 0-7.097 4.362V50.245H55.812q-12.484 19.385-14.03 38.152H83.4q1.628 4.02 3.402 8.138H41.7c.505 12.81 4.883 25.505 12.826 38.152h33.888v-34.49l8.138 17.904v16.553h7.748l3.727 8.138H96.503v28.5a201.567 201.567 0 0 0 17.139-15.707q1.709 4.053 3.369 8.138zm69.761-4.167a7.552 7.552 0 0 1-1.904 1.286h-.13a6.738 6.738 0 0 1-7.097-.977l-18.881-16.016-6.511 15.902a21.045 21.045 0 0 1-1.937 3.662 14.812 14.812 0 0 1-2.458 2.865 7.78 7.78 0 0 1-12.207-1.335 15.105 15.105 0 0 1-1.497-2.653c-11.231-28.467-26.465-56.805-37.859-85.289a5.062 5.062 0 0 1 5.68-6.966c27.296 5.046 62.664 16.586 90.416 23.943 8.627 2.279 10.026 9.88 3.662 15.772a19.874 19.874 0 0 1-3.255 2.474c-4.883 2.767-9.766 5.973-14.649 8.903l18.799 16.114a6.917 6.917 0 0 1 1.628 2.051v.13a6.966 6.966 0 0 1 .635 2.393h0a6.934 6.934 0 0 1-.26 2.507 7.145 7.145 0 0 1-1.172 2.262 153.894 153.894 0 0 1-11.003 12.972zm-4.883-6.25l9.099-10.677c-4.004-3.434-21.159-16.748-22.933-19.955a3.923 3.923 0 0 1 1.351-5.29c5.957-3.255 13.607-7.91 19.255-11.67a13.64 13.64 0 0 0 1.986-1.449 7.194 7.194 0 0 0 1.221-1.416l.26-.488-.505-.293a6.38 6.38 0 0 0-1.237-.423l-84.589-22.494 35.531 79.982a7.813 7.813 0 0 0 .619 1.139l.358.472.456-.326a7.341 7.341 0 0 0 1.188-1.449 12.224 12.224 0 0 0 1.107-2.165c2.653-6.511 5.68-15.414 8.789-21.436l.374-.521a3.906 3.906 0 0 1 5.485-.439l22.201 18.832zM81.594 176.095a171.814 171.814 0 0 1-31.348-33.334h-25.57A83.824 83.824 0 0 0 45.2 162.292a85.956 85.956 0 0 0 14.47 7.813.22.22 0 0 0 .179.114 79.966 79.966 0 0 0 15.69 4.883 106.008 106.008 0 0 0 6.104 1.009zm-62.241-41.44h25.733a82.359 82.359 0 0 1-11.394-38.152H8.138a90.741 90.741 0 0 0 1.628 12.923 78.566 78.566 0 0 0 4.883 15.902 88.153 88.153 0 0 0 4.655 9.375zM8.138 88.397h25.635A88.511 88.511 0 0 1 46.42 50.245H19.353a88.153 88.153 0 0 0-4.704 9.375s0 .114-.114.163A81.236 81.236 0 0 0 9.652 75.49a83.759 83.759 0 0 0-1.628 12.907zm16.488-46.241h27.003A191.606 191.606 0 0 1 82.131 8.708c-2.262.277-4.492.602-6.641 1.058a78.713 78.713 0 0 0-15.87 4.883 89.911 89.911 0 0 0-14.47 7.813 83.824 83.824 0 0 0-20.525 19.532h0zm78.127-33.448a186.577 186.577 0 0 1 30.518 33.448h27.019a79.152 79.152 0 0 0-8.138-9.375 81.073 81.073 0 0 0-12.419-10.205 86.705 86.705 0 0 0-14.405-7.829s-.098 0-.163-.098a79.999 79.999 0 0 0-15.69-4.883c-2.214-.439-4.443-.781-6.657-1.058h0zm-6.25 5.274v28.175h26.84a188.286 188.286 0 0 0-26.84-28.175zm-8.138 157.279v-28.5H60.223a171.993 171.993 0 0 0 28.24 28.5zm0-129.105V13.981a189.295 189.295 0 0 0-26.807 28.175z"/></svg>',
};

// INITIALIZE THE SCRIPT AND FUNCTIONALITY
function atcb_init() {
  // let's get started
  console.log('add-to-calendar button initialized (version ' + atcbVersion + ')');
  console.log('See https://github.com/add2cal/add-to-calendar-button for details');
  // abort if not in a browser
  if (!isBrowser()) {
    console.error('no further initialization due to wrong environment (no browser)');
    return;
  }
  // get all placeholders
  const atcButtons = document.querySelectorAll('.atcb');
  // if there are some, move on
  if (atcButtons.length > 0) {
    // get the amount of already initialized ones first
    const atcButtonsInitialized = document.querySelectorAll('.atcb-initialized');
    // generate the buttons one by one
    for (let i = 0; i < atcButtons.length; i++) {
      // skip already initialized ones
      if (atcButtons[parseInt(i)].classList.contains('atcb-initialized')) {
        continue;
      }
      // get JSON from HTML block, but remove real code line breaks before parsing.
      // use <br> or \n explicitely in the description to create a line break.
      let atcbConfig = JSON.parse(
        atcb_secure_content(atcButtons[parseInt(i)].innerHTML.replace(/(\r\n|\n|\r)/g, ''), false)
      );
      // rewrite config for backwards compatibility
      atcbConfig = atcb_patch_config(atcbConfig);
      // check, if all required data is available
      if (atcb_check_required(atcbConfig)) {
        // Rewrite dynamic dates, standardize line breaks and transform urls in the description
        atcbConfig = atcb_decorate_data(atcbConfig);
        // validate the config (JSON iput) ...
        if (atcb_validate(atcbConfig)) {
          // ... and generate the button on success
          // set identifier
          if (atcbConfig.identifier == null || atcbConfig.identifier == '') {
            atcbConfig.identifier = 'atcb-btn-' + (i + atcButtonsInitialized.length + 1);
          }
          // generate the button
          atcb_generate(atcButtons[parseInt(i)], atcbConfig);
        }
      }
    }
  }
}

// BACKWARDS COMPATIBILITY REWRITE
function atcb_patch_config(atcbConfig) {
  // you can remove this, if you did not use this script before v1.10.0
  // adjusts any old schema.org structure
  if (atcbConfig.event != null) {
    Object.keys(atcbConfig.event).forEach((key) => {
      // move entries one level up, but skip schema types
      if (key.charAt(0) !== '@') {
        atcbConfig[`${key}`] = atcbConfig.event[`${key}`];
      }
    });
    delete atcbConfig.event;
  }
  // you can remove this, if you did not use this script before v1.4.0
  // adjust deprecated config options
  const keyChanges = {
    title: 'name',
    dateStart: 'startDate',
    dateEnd: 'endDate',
    timeStart: 'startTime',
    timeEnd: 'endTime',
  };
  Object.keys(keyChanges).forEach((key) => {
    if (atcbConfig[keyChanges[`${key}`]] == null && atcbConfig[`${key}`] != null) {
      atcbConfig[keyChanges[`${key}`]] = atcbConfig[`${key}`];
    }
  });
  return atcbConfig;
}

// CLEAN DATA BEFORE FURTHER VALIDATION (CONSIDERING SPECIAL RULES AND SCHEMES)
function atcb_decorate_data(atcbConfig) {
  // cleanup options
  for (let i = 0; i < atcbConfig.options.length; i++) {
    let cleanOption = atcbConfig.options[`${i}`].split('|');
    atcbConfig.options[`${i}`] = cleanOption[0].toLowerCase().replace('microsoft', 'ms').replace('.', '');
  }
  // cleanup different date-time formats
  atcbConfig = atcb_date_cleanup(atcbConfig);
  // calculate the real date values in case that there are some special rules included (e.g. adding days dynamically)
  atcbConfig.startDate = atcb_date_calculation(atcbConfig.startDate);
  atcbConfig.endDate = atcb_date_calculation(atcbConfig.endDate);
  // set default listStyle
  if (atcbConfig.listStyle == null || atcbConfig.listStyle == '') {
    atcbConfig.listStyle = 'dropdown';
  }
  // force click trigger on modal style
  if (atcbConfig.listStyle === 'modal') {
    atcbConfig.trigger = 'click';
  }
  // set size
  if (atcbConfig.size != null && atcbConfig.size != '' && atcbConfig.size >= 0 && atcbConfig.size < 11) {
    atcbConfig.size = 10 + parseInt(atcbConfig.size);
  } else {
    atcbConfig.size = 16;
  }
  // determine dark mode
  if (atcbConfig.lightMode == null || atcbConfig.lightMode == '') {
    atcbConfig.lightMode = 'light';
  } else if (atcbConfig.lightMode != null && atcbConfig.lightMode != '') {
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    switch (atcbConfig.lightMode) {
      case 'system':
        if (prefersDarkScheme.matches) {
          atcbConfig.lightMode = 'dark';
        } else {
          atcbConfig.lightMode = 'light';
        }
        break;
      case 'bodyScheme':
      case 'dark':
        break;
      default:
        atcbConfig.lightMode = 'light';
        break;
    }
  }
  // set language if not set
  if (atcbConfig.language == null || atcbConfig.language == '') {
    atcbConfig.language = 'en';
  }
  // format RRULE (remove spaces)
  if (atcbConfig.recurrence != null && atcbConfig.recurrence != '') {
    atcbConfig.recurrence = atcbConfig.recurrence.replace(/\s+/g, '');
  }

  // if no description or already decorated, return early here
  if (!atcbConfig.description || atcbConfig.descriptionHtmlFree) return atcbConfig;

  // make a copy of the given argument rather than mutating in place
  const data = Object.assign({}, atcbConfig);
  // store a clean description copy without the URL magic for iCal
  data.descriptionHtmlFree = atcb_rewrite_html_elements(data.description, true);
  // ...and transform pseudo elements for the regular one
  data.description = atcb_rewrite_html_elements(data.description);
  return data;
}

// CHECK FOR REQUIRED FIELDS
function atcb_check_required(data) {
  // check for at least 1 option
  if (data.options == null || data.options.length < 1) {
    console.error('add-to-calendar button generation failed: no options set');
    return false;
  }
  // check for min required data (without "options")
  const requiredField = ['name', 'startDate'];
  return requiredField.every(function (field) {
    if (data[`${field}`] == null || data[`${field}`] == '') {
      console.error('add-to-calendar button generation failed: required setting missing [' + field + ']');
      return false;
    }
    return true;
  });
}

// CALCULATE AND CLEAN UP THE ACTUAL DATES
function atcb_date_cleanup(data) {
  // set endDate = startDate, if not provided
  if ((data.endDate == null || data.endDate == '') && data.startDate != null) {
    data.endDate = data.startDate;
  }
  // parse date+time format (unofficial alternative to the main implementation)
  const endpoints = ['start', 'end'];
  endpoints.forEach(function (point) {
    if (data[point + 'Date'] != null) {
      // remove any milliseconds information
      data[point + 'Date'] = data[point + 'Date'].replace(/\.\d{3}/, '').replace('Z', '');
      // identify a possible time information within the date string
      const tmpSplitStartDate = data[point + 'Date'].split('T');
      if (tmpSplitStartDate[1] != null) {
        data[point + 'Date'] = tmpSplitStartDate[0];
        data[point + 'Time'] = tmpSplitStartDate[1];
      }
    }
    // remove any seconds from time information
    if (data[point + 'Time'] != null && data[point + 'Time'].length === 8) {
      const timeStr = data[point + 'Time'];
      data[point + 'Time'] = timeStr.substring(0, timeStr.length - 3);
    }
  });
  return data;
}

function atcb_date_calculation(dateString) {
  // replace "today" with the current date first
  const today = new Date();
  const todayString = today.getUTCMonth() + 1 + '-' + today.getUTCDate() + '-' + today.getUTCFullYear();
  dateString = dateString.replace(/today/gi, todayString);
  // check for any dynamic additions and adjust
  const dateStringParts = dateString.split('+');
  const dateParts = dateStringParts[0].split('-');
  let newDate = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
  if (dateParts[0].length < 4) {
    // backwards compatibility for version <1.5.0
    newDate = new Date(dateParts[2], dateParts[0] - 1, dateParts[1]);
  }
  if (dateStringParts[1] != null && dateStringParts[1] > 0) {
    newDate.setDate(newDate.getDate() + parseInt(dateStringParts[1]));
  }
  return (
    newDate.getFullYear() +
    '-' +
    ((newDate.getMonth() + 1 < 10 ? '0' : '') + (newDate.getMonth() + 1)) +
    '-' +
    (newDate.getDate() < 10 ? '0' : '') +
    newDate.getDate()
  );
}

// VALIDATE THE INPUT DATA
function atcb_validate(data) {
  // validate prefix
  if (data.identifier != null && data.identifier != '') {
    if (!/^[\w-]+$/.test(data.identifier)) {
      data.identifier = '';
      console.error('add-to-calendar button generation: identifier invalid - using auto numbers instead');
    }
  }
  // validate explicit ics file
  if (data.icsFile != null && data.icsFile != '') {
    if (!atcb_secure_url(data.icsFile, false) || !/\.ics$/.test(data.icsFile)) {
      console.error('add-to-calendar button generation failed: explicit ics file path not valid');
      return false;
    }
  }
  // validate options
  const options = ['apple', 'google', 'ical', 'ms365', 'outlookcom', 'msteams', 'yahoo'];
  const validRecurrOptions = ['apple', 'google', 'ical'];
  if (
    !data.options.every(function (option) {
      const cleanOption = option.split('|');
      if (!options.includes(cleanOption[0])) {
        console.error('add-to-calendar button generation failed: invalid option [' + cleanOption[0] + ']');
        return false;
      }
      return true;
    })
  ) {
    return false;
  }
  if ((data.recurrence != null) & (data.recurrence != '')) {
    let oneValidOption = false;
    data.options.forEach(function (option) {
      const cleanOption = option.split('|');
      if (validRecurrOptions.includes(cleanOption[0])) {
        oneValidOption = true;
      }
    });
    if (!oneValidOption) {
      console.error(
        'add-to-calendar button generation failed: no supported valid option for recurring events'
      );
      return false;
    }
  }
  // validate date
  const dates = ['startDate', 'endDate'];
  const newDate = dates;
  if (
    !dates.every(function (date) {
      if (data[`${date}`].length !== 10) {
        console.error('add-to-calendar button generation failed: date misspelled [-> YYYY-MM-DD]');
        return false;
      }
      const dateParts = data[`${date}`].split('-');
      if (dateParts.length < 3 || dateParts.length > 3) {
        console.error(
          'add-to-calendar button generation failed: date misspelled [' + date + ': ' + data[`${date}`] + ']'
        );
        return false;
      }
      newDate[`${date}`] = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
      return true;
    })
  ) {
    return false;
  }
  // validate time
  const times = ['startTime', 'endTime'];
  if (
    !times.every(function (time) {
      if (data[`${time}`] != null) {
        if (data[`${time}`].length !== 5) {
          console.error('add-to-calendar button generation failed: time misspelled [-> HH:MM]');
          return false;
        }
        const timeParts = data[`${time}`].split(':');
        // validate the time parts
        if (timeParts.length < 2 || timeParts.length > 2) {
          console.error(
            'add-to-calendar button generation failed: time misspelled [' +
              time +
              ': ' +
              data[`${time}`] +
              ']'
          );
          return false;
        }
        if (timeParts[0] > 23) {
          console.error(
            'add-to-calendar button generation failed: time misspelled - hours number too high [' +
              time +
              ': ' +
              timeParts[0] +
              ']'
          );
          return false;
        }
        if (timeParts[1] > 59) {
          console.error(
            'add-to-calendar button generation failed: time misspelled - minutes number too high [' +
              time +
              ': ' +
              timeParts[1] +
              ']'
          );
          return false;
        }
        // update the date with the time for further validation steps
        if (time == 'startTime') {
          newDate.startDate = new Date(
            newDate.startDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
          );
        }
        if (time == 'endTime') {
          newDate.endDate = new Date(
            newDate.endDate.getTime() + timeParts[0] * 3600000 + timeParts[1] * 60000
          );
        }
      }
      return true;
    })
  ) {
    return false;
  }
  if ((data.startTime != null && data.endTime == null) || (data.startTime == null && data.endTime != null)) {
    console.error(
      'add-to-calendar button generation failed: if you set a starting time, you also need to define an end time'
    );
    return false;
  }
  // validate whether end is not before start
  if (newDate.endDate < newDate.startDate) {
    console.error('add-to-calendar button generation failed: end date before start date');
    return false;
  }
  // validate any given RRULE (or respective other parameters)
  if (data.recurrence != null && data.recurrence != '') {
    if (!/^[\w=;:*+-/\\]+$/.test(data.recurrence)) {
      console.error('add-to-calendar button generation failed: RRULE data misspelled');
      return false;
    }
  }
  // on passing the validation, return true
  return true;
}

// GENERATE THE ACTUAL BUTTON
// helper function to generate the labels for the button and list options
function atcb_generate_label(data, parent, type, icon = false, text = '', oneOption = false) {
  let defaultTriggerText = atcb_translate_hook('Add to Calendar', data.language, data);
  // if there is only 1 option, we use the trigger text on the option label. Therefore, forcing it here
  if (oneOption && text == '') {
    text = defaultTriggerText;
  }
  switch (type) {
    case 'trigger':
    default:
      if (data.trigger === 'click') {
        parent.addEventListener('click', (event) => {
          event.preventDefault();
          atcb_toggle('auto', data, parent, false, true);
        });
      } else {
        parent.addEventListener('touchend', (event) => {
          event.preventDefault();
          atcb_toggle('auto', data, parent, false, true);
        });
        parent.addEventListener(
          'mouseenter',
          atcb_debounce_leading((event) => {
            event.preventDefault();
            atcb_toggle('open', data, parent, false, true);
          })
        );
      }
      parent.id = data.identifier;
      text = text || defaultTriggerText;
      break;
    case 'apple':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_ical(data);
        })
      );
      parent.id = data.identifier + '-apple';
      text = text || 'Apple';
      break;
    case 'google':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_google(data);
        })
      );
      parent.id = data.identifier + '-google';
      text = text || 'Google';
      break;
    case 'ical':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_ical(data);
        })
      );
      parent.id = data.identifier + '-ical';
      text = text || atcb_translate_hook('iCal File', data.language, data);
      break;
    case 'msteams':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_teams(data);
        })
      );
      parent.id = data.identifier + '-msteams';
      text = text || 'Microsoft Teams';
      break;
    case 'ms365':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_microsoft(data, '365');
        })
      );
      parent.id = data.identifier + '-ms365';
      text = text || 'Microsoft 365';
      break;
    case 'outlookcom':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_microsoft(data, 'outlook');
        })
      );
      parent.id = data.identifier + '-outlook';
      text = text || 'Outlook.com';
      break;
    case 'yahoo':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
          atcb_generate_yahoo(data);
        })
      );
      parent.id = data.identifier + '-yahoo';
      text = text || 'Yahoo';
      break;
    case 'close':
      parent.addEventListener(
        'click',
        atcb_debounce(() => {
          oneOption ? parent.blur() : atcb_toggle('close');
        })
      );
      parent.addEventListener(
        'focus',
        atcb_debounce(() => atcb_close(false))
      );
      parent.id = data.identifier + '-close';
      text = atcb_translate_hook('Close', data.language, data);
      break;
  }
  // override the id for the oneOption button, since the button always needs to have the button id
  if (oneOption) {
    parent.id = data.identifier;
  }
  // support keyboard input
  if (!oneOption && type === 'trigger') {
    parent.addEventListener(
      'keyup',
      atcb_debounce_leading((event) => {
        if (event.key == 'Enter') {
          event.preventDefault();
          atcb_toggle('auto', data, parent, true, true);
        }
      })
    );
  } else {
    parent.addEventListener(
      'keyup',
      atcb_debounce_leading((event) => {
        if (event.key == 'Enter') {
          event.preventDefault();
          parent.click();
        }
      })
    );
  }
  // add icon and text label
  if (icon) {
    const iconEl = document.createElement('span');
    iconEl.classList.add('atcb-icon');
    iconEl.innerHTML = atcbIcon[`${type}`];
    parent.appendChild(iconEl);
  }
  const textEl = document.createElement('span');
  textEl.classList.add('atcb-text');
  textEl.textContent = text;
  parent.appendChild(textEl);
}

// generate the triggering button
function atcb_generate(button, data) {
  // clean the placeholder
  button.textContent = '';
  // create schema.org data, if possible (https://schema.org/Event)
  // TODO: support recurring events
  if (data.name && data.location && data.startDate) {
    const schemaEl = document.createElement('script');
    schemaEl.type = 'application/ld+json';
    schemaEl.textContent = '{ "event": { "@context":"https://schema.org", "@type":"Event", ';
    schemaEl.textContent += '"name":"' + data.name + '", ';
    if (data.descriptionHtmlFree)
      schemaEl.textContent += '"description":"' + data.descriptionHtmlFree + '", ';
    const formattedDate = atcb_generate_time(data, 'delimiters', 'general', true);
    schemaEl.textContent += '"startDate":"' + formattedDate.start + '", ';
    schemaEl.textContent += '"endDate":"' + formattedDate.end + '", ';
    if (data.location.startsWith('http')) {
      schemaEl.textContent += '"eventAttendanceMode":"https://schema.org/OnlineEventAttendanceMode", ';
      schemaEl.textContent += '"location": { "@type":"VirtualLocation", "url":"' + data.location + '" } ';
    } else {
      schemaEl.textContent += '"location":"' + data.location + '" ';
    }
    schemaEl.textContent += '} }';
    button.appendChild(schemaEl);
  }
  // generate the wrapper div
  const buttonTriggerWrapper = document.createElement('div');
  buttonTriggerWrapper.classList.add('atcb-button-wrapper');
  buttonTriggerWrapper.classList.add('atcb-' + data.lightMode);
  buttonTriggerWrapper.style.fontSize = data.size + 'px';
  button.appendChild(buttonTriggerWrapper);
  // generate the button trigger div
  const buttonTrigger = document.createElement('button');
  buttonTrigger.classList.add('atcb-button');
  if (data.listStyle === 'overlay') {
    buttonTrigger.classList.add('atcb-dropoverlay');
  }
  buttonTrigger.type = 'button';
  buttonTriggerWrapper.appendChild(buttonTrigger);
  // generate the label incl. eventListeners
  // if there is only 1 calendar option, we directly show this at the button, but with the trigger's label text
  if (data.options.length === 1) {
    const optionParts = data.options[0].split('|');
    buttonTrigger.classList.add('atcb-single');
    atcb_generate_label(data, buttonTrigger, optionParts[0], true, data.label, true);
  } else {
    atcb_generate_label(data, buttonTrigger, 'trigger', true, data.label);
    // create an empty anchor div to place the dropdown, while the position can be defined via CSS
    const buttonDropdownAnchor = document.createElement('div');
    buttonDropdownAnchor.classList.add('atcb-dropdown-anchor');
    buttonTrigger.appendChild(buttonDropdownAnchor);
  }
  // update the placeholder class to prevent multiple initializations
  button.classList.remove('atcb');
  button.classList.add('atcb-initialized');
  // show the placeholder div
  if (data.inline) {
    button.style.display = 'inline-block';
  } else {
    button.style.display = 'block';
  }
  // console log
  console.log('add-to-calendar button "' + data.identifier + '" created');
}

// generate the dropdown list (can also appear wihtin a modal, if option is set)
function atcb_generate_dropdown_list(data) {
  const optionsList = document.createElement('div');
  optionsList.classList.add('atcb-list');
  optionsList.classList.add('atcb-' + data.lightMode);
  optionsList.style.fontSize = data.size + 'px';
  // generate the list items
  let listCount = 0;
  data.options.forEach(function (option) {
    const optionParts = option.split('|');
    // skip the option if not supported
    if (data.recurrence != null && data.recurrence != '') {
      if (
        optionParts[0] == 'msteams' ||
        optionParts[0] == 'ms365' ||
        optionParts[0] == 'outlookcom' ||
        optionParts[0] == 'yahoo'
      ) {
        return;
      }
    }
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item');
    optionItem.tabIndex = 0;
    listCount++;
    optionItem.dataset.optionNumber = listCount;
    optionsList.appendChild(optionItem);
    // generate the label incl. individual eventListener
    atcb_generate_label(data, optionItem, optionParts[0], true, optionParts[1]);
  });
  // in the modal case, we also render a close option
  if (data.listStyle === 'modal') {
    const optionItem = document.createElement('div');
    optionItem.classList.add('atcb-list-item', 'atcb-list-item-close');
    optionItem.tabIndex = 0;
    optionsList.appendChild(optionItem);
    atcb_generate_label(data, optionItem, 'close', true);
  }
  return optionsList;
}

// create the background overlay, which also acts as trigger to close any dropdowns
function atcb_generate_bg_overlay(listStyle = 'dropdown', trigger = '', darken = true) {
  const bgOverlay = document.createElement('div');
  bgOverlay.id = 'atcb-bgoverlay';
  if (listStyle !== 'modal' && darken) {
    bgOverlay.classList.add('atcb-animate-bg');
  }
  if (!darken) {
    bgOverlay.classList.add('atcb-no-bg');
  }
  bgOverlay.tabIndex = 0;
  bgOverlay.addEventListener(
    'click',
    atcb_debounce((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle('close');
    })
  );
  let fingerMoved = false;
  bgOverlay.addEventListener(
    'touchstart',
    atcb_debounce_leading(() => (fingerMoved = false)),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'touchmove',
    atcb_debounce_leading(() => (fingerMoved = true)),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'touchend',
    atcb_debounce((e) => {
      if (fingerMoved !== false || e.target !== e.currentTarget) return;
      atcb_toggle('close');
    }),
    { passive: true }
  );
  bgOverlay.addEventListener(
    'focus',
    atcb_debounce_leading((e) => {
      if (e.target !== e.currentTarget) return;
      atcb_toggle('close');
    })
  );
  if (trigger !== 'click') {
    bgOverlay.addEventListener(
      'mousemove',
      atcb_debounce_leading((e) => {
        if (e.target !== e.currentTarget) return;
        atcb_toggle('close');
      })
    );
  } else {
    // if trigger is not set to 'click', we render a close icon, when hovering over the background
    bgOverlay.classList.add('atcb-click');
  }
  return bgOverlay;
}

// FUNCTIONS TO CONTROL THE INTERACTION
function atcb_toggle(action, data = '', button = '', keyboardTrigger = false, generatedButton = false) {
  // check for state and adjust accordingly
  // action can be 'open', 'close', or 'auto'
  if (action == 'open') {
    atcb_open(data, button, keyboardTrigger, generatedButton);
  } else if (
    action == 'close' ||
    button.classList.contains('atcb-active') ||
    document.querySelector('.atcb-active-modal')
  ) {
    atcb_close(keyboardTrigger);
  } else {
    atcb_open(data, button, keyboardTrigger, generatedButton);
  }
}

// show the dropdown list + background overlay
function atcb_open(data, button, keyboardTrigger = false, generatedButton = false) {
  // abort early if an add-to-calendar dropdown or modal already opened
  if (document.querySelector('.atcb-list') || document.querySelector('.atcb-modal')) return;
  // generate list and prepare wrapper
  const list = atcb_generate_dropdown_list(data);
  const listWrapper = document.createElement('div');
  listWrapper.classList.add('atcb-list-wrapper');
  // set list styles, set button to atcb-active and force modal listStyle if no button is set
  if (button) {
    button.classList.add('atcb-active');
    if (data.listStyle === 'modal') {
      button.classList.add('atcb-modal-style');
      list.classList.add('atcb-modal');
    } else {
      listWrapper.appendChild(list);
      listWrapper.classList.add('atcb-dropdown');
      if (data.listStyle === 'overlay') {
        listWrapper.classList.add('atcb-dropoverlay');
      }
    }
    if (generatedButton) {
      list.classList.add('atcb-generated-button'); // if the button has been generated by the script, we add some more specifics
    }
  } else {
    list.classList.add('atcb-modal');
  }
  // define background overlay
  const bgOverlay = atcb_generate_bg_overlay(data.listStyle, data.trigger, data.background);
  // render the items depending on the liststyle
  if (data.listStyle === 'modal') {
    document.body.appendChild(bgOverlay);
    bgOverlay.appendChild(list);
    document.body.classList.add('atcb-modal-no-scroll');
  } else {
    document.body.appendChild(listWrapper);
    listWrapper.appendChild(list);
    document.body.appendChild(bgOverlay);
    if (data.listStyle === 'dropdown-static') {
      // in the dropdown-static case, we do not dynamically adjust whether we show the dropdown upwards
      atcb_position_list(button, listWrapper, true);
    } else {
      atcb_position_list(button, listWrapper);
    }
  }
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // give keyboard focus to first item in list, if not blocked, because there is definitely no keyboard trigger
  if (keyboardTrigger) {
    list.firstChild.focus();
  } else {
    list.firstChild.focus({ preventScroll: true });
  }
  list.firstChild.blur();
}

function atcb_close(keyboardTrigger = false) {
  // focus triggering button if available - especially relevant for keyboard navigation
  let newFocusEl = document.querySelector('.atcb-active, .atcb-active-modal');
  if (newFocusEl) {
    newFocusEl.focus({ preventScroll: true });
    if (!keyboardTrigger) {
      newFocusEl.blur();
    }
  }
  // inactivate all buttons
  Array.from(document.querySelectorAll('.atcb-active')).forEach((button) => {
    button.classList.remove('atcb-active');
  });
  Array.from(document.querySelectorAll('.atcb-active-modal')).forEach((button) => {
    button.classList.remove('atcb-active-modal');
  });
  // make body scrollable again
  document.body.classList.remove('atcb-modal-no-scroll');
  // remove dropdowns, modals, and bg overlays (should only be one of each at max)
  Array.from(document.querySelectorAll('.atcb-list-wrapper'))
    .concat(Array.from(document.querySelectorAll('.atcb-list')))
    .concat(Array.from(document.querySelectorAll('.atcb-info-modal')))
    .concat(Array.from(document.querySelectorAll('#atcb-bgoverlay')))
    .forEach((el) => el.remove());
}

// prepare data when not using the init function
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function atcb_action(data, triggerElement, keyboardTrigger = true) {
  data = atcb_secure_content(data);
  // validate & decorate data
  if (!atcb_check_required(data)) {
    throw new Error('data missing; see logs');
  }
  data = atcb_decorate_data(data);
  if (!atcb_validate(data)) {
    throw new Error('Invalid data; see logs');
  }
  if (triggerElement) {
    data.identifier = triggerElement.id;
    // if listStyle some dropdown one, force overlay
    if (data.listStyle != 'modal') {
      data.listStyle = 'overlay';
    }
  } else {
    data.identifier = 'atcb-btn-custom';
    // if no button is defined, fallback to listStyle "modal" and "click" trigger
    data.listStyle = 'modal';
    data.trigger = 'click';
  }
  atcb_toggle('open', data, triggerElement, keyboardTrigger);
}

// FUNCTION TO GENERATE THE GOOGLE URL
// See specs at: TODO
function atcb_generate_google(data) {
  // base url
  let url = 'https://calendar.google.com/calendar/render?action=TEMPLATE';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean', 'google');
  url += '&dates=' + encodeURIComponent(formattedDate.start) + '%2F' + encodeURIComponent(formattedDate.end);
  // add details (if set)
  if (data.name != null && data.name != '') {
    url += '&text=' + encodeURIComponent(data.name);
  }
  let tmpDataDescription = '';
  if (data.description != null && data.description != '') {
    tmpDataDescription = data.description;
  }
  if (data.location != null && data.location != '') {
    url += '&location=' + encodeURIComponent(data.location);
    // TODO: Find a better solution for the next temporary workaround.
    if (isiOS()) {
      // workaround to cover a bug, where, when using Google Calendar on an iPhone, the location is not recognized. So, for the moment, we simply add it to the description.
      if (tmpDataDescription != '') {
        tmpDataDescription += '<br><br>';
      }
      tmpDataDescription += '&#128205;: ' + data.location;
    }
  }
  if (tmpDataDescription != '') {
    url += '&details=' + encodeURIComponent(tmpDataDescription);
  }
  if (data.recurrence != null && data.recurrence != '') {
    url += '&recur=' + encodeURIComponent(data.recurrence);
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE YAHOO URL
// See specs at: TODO
function atcb_generate_yahoo(data) {
  // base url
  let url = 'https://calendar.yahoo.com/?v=60';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'clean');
  url += '&st=' + encodeURIComponent(formattedDate.start) + '&et=' + encodeURIComponent(formattedDate.end);
  if (formattedDate.allday) {
    url += '&dur=allday';
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    url += '&title=' + encodeURIComponent(data.name);
  }
  if (data.location != null && data.location != '') {
    url += '&in_loc=' + encodeURIComponent(data.location);
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Yahoo does not support html tags in a stable way
    url += '&desc=' + encodeURIComponent(data.descriptionHtmlFree);
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE MICROSOFT 365 OR OUTLOOK WEB URL
// See specs at: TODO
function atcb_generate_microsoft(data, type = '365') {
  // redirect to iCal solution on mobile devices, since the Microsoft web apps are buggy on mobile devices (see https://github.com/add2cal/add-to-calendar-button/discussions/113)
  if (isMobile()) {
    atcb_generate_ical(data);
    return;
  }
  // base url
  let url = 'https://';
  if (type == 'outlook') {
    url += 'outlook.live.com';
  } else {
    url += 'outlook.office.com';
  }
  url += '/calendar/0/deeplink/compose?path=%2Fcalendar%2Faction%2Fcompose&rru=addevent';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  url +=
    '&startdt=' + encodeURIComponent(formattedDate.start) + '&enddt=' + encodeURIComponent(formattedDate.end);
  if (formattedDate.allday) {
    url += '&allday=true';
  }
  // add details (if set)
  if (data.name != null && data.name != '') {
    url += '&subject=' + encodeURIComponent(data.name);
  }
  if (data.location != null && data.location != '') {
    url += '&location=' + encodeURIComponent(data.location);
  }
  if (data.description != null && data.description != '') {
    url += '&body=' + encodeURIComponent(data.description.replace(/\n/g, '<br>'));
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE MICROSOFT TEAMS URL
// See specs at: https://docs.microsoft.com/en-us/microsoftteams/platform/concepts/build-and-test/deep-links#deep-linking-to-the-scheduling-dialog
// Mind that this is still in development mode by Microsoft! Location, html tags and linebreaks in the description are not supported yet.
function atcb_generate_teams(data) {
  // base url
  let url = 'https://teams.microsoft.com/l/meeting/new?';
  // generate and add date
  const formattedDate = atcb_generate_time(data, 'delimiters', 'microsoft');
  url +=
    '&startTime=' +
    encodeURIComponent(formattedDate.start) +
    '&endTime=' +
    encodeURIComponent(formattedDate.end);
  // add details (if set)
  let locationString = '';
  if (data.name != null && data.name != '') {
    url += '&subject=' + encodeURIComponent(data.name);
  }
  if (data.location != null && data.location != '') {
    locationString = encodeURIComponent(data.location);
    url += '&location=' + locationString;
    locationString += ' // '; // preparing the workaround putting the location into the description, since the native field is not supported yet
  }
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    // using descriptionHtmlFree instead of description, since Teams does not support html tags
    url += '&content=' + locationString + encodeURIComponent(data.descriptionHtmlFree);
  }
  if (atcb_secure_url(url)) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(url, atcbDefaultTarget).focus();
  }
}

// FUNCTION TO GENERATE THE iCAL FILE (also for the Apple option)
// See specs at: https://www.rfc-editor.org/rfc/rfc5545.html
function atcb_generate_ical(data) {
  // check for a given explicit file (not if iOS and WebView - will catched further down)
  if (
    data.icsFile != null &&
    data.icsFile != '' &&
    atcb_secure_url(data.icsFile) &&
    data.icsFile.startsWith('https://') &&
    (!isiOS() || !isWebView())
  ) {
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    window.open(data.icsFile, atcbDefaultTarget);
    return;
  }
  // otherwise, generate one on the fly
  let now = new Date();
  now = now.toISOString();
  const formattedDate = atcb_generate_time(data, 'clean', 'ical');
  let timeslot = '';
  if (formattedDate.allday) {
    timeslot = ';VALUE=DATE';
  }
  const ics_lines = ['BEGIN:VCALENDAR', 'VERSION:2.0'];
  const corp = 'github.com/add2cal/add-to-calendar-button';
  ics_lines.push('PRODID:-// ' + corp + ' // atcb v' + atcbVersion + ' //EN');
  ics_lines.push('CALSCALE:GREGORIAN');
  ics_lines.push('BEGIN:VEVENT');
  ics_lines.push('UID:' + now + '@add-to-calendar-button');
  ics_lines.push(
    'DTSTAMP:' + formattedDate.start,
    'DTSTART' + timeslot + ':' + formattedDate.start,
    'DTEND' + timeslot + ':' + formattedDate.end,
    'SUMMARY:' + data.name.replace(/.{65}/g, '$&' + '\r\n ') // making sure it does not exceed 75 characters per line
  );
  if (data.descriptionHtmlFree != null && data.descriptionHtmlFree != '') {
    ics_lines.push(
      'DESCRIPTION:' + data.descriptionHtmlFree.replace(/\n/g, '\\n').replace(/.{60}/g, '$&' + '\r\n ') // adjusting for intended line breaks + making sure it does not exceed 75 characters per line
    );
  }
  if (data.description != null && data.description != '') {
    ics_lines.push(
      'X-ALT-DESC;FMTTYPE=text/html:\r\n <!DOCTYPE HTML PUBLIC ""-//W3C//DTD HTML 3.2//EN"">\r\n <HTML><BODY>\r\n ' +
        data.description.replace(/\n/g, '<br>').replace(/.{60}/g, '$&' + '\r\n ') +
        '\r\n </BODY></HTML>'
    );
  }
  if (data.location != null && data.location != '') {
    ics_lines.push('LOCATION:' + data.location);
  }
  if (data.recurrence != null && data.recurrence != '') {
    ics_lines.push(data.recurrence);
  }
  now = now.replace(/\.\d{3}/g, '').replace(/[^a-z\d]/gi, '');
  ics_lines.push('STATUS:CONFIRMED', 'LAST-MODIFIED:' + now, 'SEQUENCE:0', 'END:VEVENT', 'END:VCALENDAR');
  let dlurl = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics_lines.join('\r\n'));
  const filename = data.iCalFileName || 'event-to-save-in-my-calendar';
  // if we got to this point with an explicitely given iCal file, we are on an iOS device within an in-app browser (WebView). If the provided URL is save, we override the dlurl
  if (data.icsFile != null && data.icsFile != '') {
    if (atcb_secure_url(data.icsFile) && data.icsFile.startsWith('https://')) {
      dlurl = data.icsFile;
    }
  }
  // in in-app browser cases (WebView), we offer a copy option, since the on-the-fly client side generation is usually not supported
  // for Android, we are more specific and only go for specific apps at the moment
  if (isWebView() && (isiOS() || (isAndroid() && isProblematicWebView()))) {
    // putting the download url to the clipboard
    const tmpInput = document.createElement('input');
    document.body.appendChild(tmpInput);
    var editable = tmpInput.contentEditable;
    var readOnly = tmpInput.readOnly;
    tmpInput.value = dlurl;
    tmpInput.contentEditable = true;
    tmpInput.readOnly = false;
    if (isiOS()) {
      var range = document.createRange();
      range.selectNodeContents(tmpInput);
      var selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(range);
      tmpInput.setSelectionRange(0, 999999);
    } else {
      // the next 2 lines are basically doing the same in different ways (just to be sure)
      navigator.clipboard.writeText(dlurl);
      tmpInput.select();
    }
    tmpInput.contentEditable = editable;
    tmpInput.readOnly = readOnly;
    document.execCommand('copy');
    tmpInput.remove();
    // creating the modal
    atcb_create_modal(
      data,
      'browser',
      atcb_translate_hook('WebView iCal', data.language, data),
      atcb_translate_hook('WebView info description', data.language, data)
    );
  } else {
    try {
      if (!window.ActiveXObject) {
        const save = document.createElement('a');
        save.href = dlurl;
        save.target = atcbDefaultTarget;
        save.download = filename;
        const evt = new MouseEvent('click', {
          view: window,
          button: 0,
          bubbles: true,
          cancelable: false,
        });
        save.dispatchEvent(evt);
        (window.URL || window.webkitURL).revokeObjectURL(save.href);
      }
      // for IE < 11 (even no longer officially supported)
      else if (!!window.ActiveXObject && document.execCommand) {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const _window = window.open(dlurl, atcbDefaultTarget);
        _window.document.close();
        _window.document.execCommand('SaveAs', true, filename || dlurl);
        _window.close();
      }
    } catch (e) {
      console.error(e);
    }
  }
}

// SHARED FUNCTION TO GENERATE A TIME STRING
function atcb_generate_time(data, style = 'delimiters', targetCal = 'general', addTimeZoneOffset = false) {
  const startDate = data.startDate.split('-');
  const endDate = data.endDate.split('-');
  let start = '';
  let end = '';
  let allday = false;
  if (data.startTime != null && data.endTime != null) {
    // Adjust for timezone, if set (see https://en.wikipedia.org/wiki/List_of_tz_database_time_zones for either the TZ name or the offset)
    if (data.timeZoneOffset != null && data.timeZoneOffset != '') {
      // if we have a timezone offset given, consider it
      start = new Date(
        startDate[0] +
          '-' +
          startDate[1] +
          '-' +
          startDate[2] +
          'T' +
          data.startTime +
          ':00.000' +
          data.timeZoneOffset
      );
      end = new Date(
        endDate[0] +
          '-' +
          endDate[1] +
          '-' +
          endDate[2] +
          'T' +
          data.endTime +
          ':00.000' +
          data.timeZoneOffset
      );
    } else {
      // if there is no offset, we prepare the time, assuming it is UTC formatted
      start = new Date(
        startDate[0] + '-' + startDate[1] + '-' + startDate[2] + 'T' + data.startTime + ':00.000+00:00'
      );
      end = new Date(endDate[0] + '-' + endDate[1] + '-' + endDate[2] + 'T' + data.endTime + ':00.000+00:00');
      if (data.timeZone != null && data.timeZone != '') {
        // if a timezone is given, we adjust dynamically with the modern toLocaleString function
        const utcDate = new Date(start.toLocaleString('en-US', { timeZone: 'UTC' }));
        if (data.timeZone == 'currentBrowser') {
          data.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        }
        const tzDate = new Date(start.toLocaleString('en-US', { timeZone: data.timeZone }));
        const calcOffset = utcDate.getTime() - tzDate.getTime();
        start.setTime(start.getTime() + calcOffset);
        end.setTime(end.getTime() + calcOffset);
      }
    }
    start = start.toISOString().replace('.000', '');
    end = end.toISOString().replace('.000', '');
    if (style == 'clean') {
      start = start.replace(/-/g, '').replace(/:/g, '');
      end = end.replace(/-/g, '').replace(/:/g, '');
    }
    if (addTimeZoneOffset) {
      let tzOffsetStart = '';
      let tzOffsetEnd = '';
      if (data.timeZoneOffset != null && data.timeZoneOffset != '') {
        tzOffsetStart = data.timeZoneOffset;
        tzOffsetEnd = data.timeZoneOffset;
      } else if (data.timeZone != null && data.timeZone != '') {
        let tzOffsetDateStart = new Date(start.toLocaleString('sv', { timeZone: data.timeZone }));
        let tzOffsetStartSearch = tzOffsetDateStart.toString().match(/GMT(.{5})/g);
        tzOffsetStart = tzOffsetStartSearch[0].replace(/GMT(.{3})(.{2})/g, '$1:$2');
        let tzOffsetDateEnd = new Date(end.toLocaleString('sv', { timeZone: data.timeZone }));
        let tzOffsetEndSearch = tzOffsetDateEnd.toString().match(/GMT(.{5})/g);
        tzOffsetEnd = tzOffsetEndSearch[0].replace(/GMT(.{3})(.{2})/g, '$1:$2');
      }
      start = start.slice(0, -1) + tzOffsetStart;
      end = end.slice(0, -1) + tzOffsetEnd;
    }
  } else {
    // would be an allday event then
    allday = true;
    start = new Date(Date.UTC(startDate[0], startDate[1] - 1, startDate[2]));
    let breakStart = start.toISOString().replace(/T(.+)Z/g, '');
    end = new Date(Date.UTC(endDate[0], endDate[1] - 1, endDate[2]));
    if (targetCal == 'google' || targetCal == 'microsoft' || targetCal == 'ical') {
      end.setDate(end.getDate() + 1); // increment the day by 1 for Google Calendar, iCal and Outlook
    }
    let breakEnd = end.toISOString().replace(/T(.+)Z/g, '');
    if (style == 'clean') {
      breakStart = breakStart.replace(/-/g, '');
      breakEnd = breakEnd.replace(/-/g, '');
    }
    start = breakStart;
    end = breakEnd;
  }
  const returnObject = { start, end, allday };
  return returnObject;
}

// SHARED FUNCTION TO SECURE DATA
function atcb_secure_content(data, isJSON = true) {
  // strip HTML tags (especially since stupid Safari adds stuff) - except for <br>
  let toClean;
  // differentiates between JSON and string input
  if (isJSON) {
    toClean = JSON.stringify(data);
  } else {
    toClean = data;
  }
  toClean = toClean.replace(/(<(?!br)([^>]+)>)/gi, '');
  if (isJSON) {
    return JSON.parse(toClean);
  } else {
    return toClean;
  }
}

// SHARED FUNCTION TO SECURE URLS
function atcb_secure_url(url, throwError = true) {
  if (
    url.match(
      /((\.\.\/)|(\.\.\\)|(%2e%2e%2f)|(%252e%252e%252f)|(%2e%2e\/)|(%252e%252e\/)|(\.\.%2f)|(\.\.%252f)|(%2e%2e%5c)|(%252e%252e%255c)|(%2e%2e\\)|(%252e%252e\\)|(\.\.%5c)|(\.\.%255c)|(\.\.%c0%af)|(\.\.%25c0%25af)|(\.\.%c1%9c)|(\.\.%25c1%259c))/gi
    )
  ) {
    if (throwError) {
      console.error(
        'Seems like the generated URL includes at least one security issue and got blocked. Please check the calendar button parameters!'
      );
    }
    return false;
  } else {
    return true;
  }
}

// SHARED FUNCTION TO REPLACE HTML PSEUDO ELEMENTS
function atcb_rewrite_html_elements(content, clear = false) {
  // standardize any line breaks
  content = content.replace(/<br\s*\/?>/gi, '\n');
  // remove any pseudo elements, if necessary
  if (clear) {
    content = content.replace(/\[(|\/)(url|br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]|((\|.*)\[\/url\])/gi, '');
    // and build html for the rest
    // supporting: br, hr, p, strong, u, i, em, li, ul, ol, h (like h1, h2, h3, ...), url (= a)
  } else {
    content = content.replace(/\[(\/|)(br|hr|p|b|strong|u|i|em|li|ul|ol|h\d)\]/gi, '<$1$2>');
    content = content.replace(/\[url\]([\w&$+.,:;=~!*'?@^%#|\s\-()/]*)\[\/url\]/gi, function (match, p1) {
      const urlText = p1.split('|');
      let link = '<a href="' + urlText[0] + '" target="' + atcbDefaultTarget + '" rel="noopener">';
      if (urlText.length > 1 && urlText[1] != '') {
        link += urlText[1];
      } else {
        link += urlText[0];
      }
      return link + '</a>';
    });
  }
  return content;
}

// SHARED FUNCTION TO CREATE INFO MODALS
function atcb_create_modal(data, icon = '', headline, content, buttons) {
  // setting the stage
  const bgOverlay = atcb_generate_bg_overlay('modal', 'click');
  const infoModalWrapper = document.createElement('div');
  infoModalWrapper.classList.add('atcb-modal', 'atcb-info-modal');
  infoModalWrapper.tabIndex = 0;
  bgOverlay.appendChild(infoModalWrapper);
  document.body.appendChild(bgOverlay);
  document.body.classList.add('atcb-modal-no-scroll');
  const parentButton = document.getElementById(data.identifier);
  if (parentButton != null) {
    parentButton.classList.add('atcb-active-modal');
  }
  const infoModal = document.createElement('div');
  infoModal.classList.add('atcb-modal-box');
  infoModal.classList.add('atcb-' + data.lightMode);
  infoModal.style.fontSize = data.size + 'px';
  infoModalWrapper.appendChild(infoModal);
  // set overlay size just to be sure
  atcb_set_fullsize(bgOverlay);
  // adding closing button
  const infoModalClose = document.createElement('div');
  infoModalClose.classList.add('atcb-modal-close');
  infoModalClose.innerHTML = atcbIcon.close;
  infoModal.appendChild(infoModalClose);
  infoModalClose.addEventListener(
    'click',
    atcb_debounce(() => atcb_close())
  );
  infoModalClose.addEventListener(
    'keyup',
    atcb_debounce_leading((event) => {
      if (event.key == 'Enter') {
        event.preventDefault();
        atcb_toggle('close', '', '', true);
      }
    })
  );
  if (buttons == null || buttons.length == 0) {
    infoModalClose.tabIndex = 0;
    infoModalClose.focus();
  }
  // adding headline (incl. icon)
  const infoModalHeadline = document.createElement('div');
  infoModalHeadline.classList.add('atcb-modal-headline');
  infoModal.appendChild(infoModalHeadline);
  if (icon != '') {
    const infoModalHeadlineIcon = document.createElement('span');
    infoModalHeadlineIcon.classList.add('atcb-modal-headline-icon');
    infoModalHeadlineIcon.innerHTML = atcbIcon[`${icon}`];
    infoModalHeadline.appendChild(infoModalHeadlineIcon);
  }
  let infoModalHeadlineText = document.createTextNode(headline);
  infoModalHeadline.appendChild(infoModalHeadlineText);
  // and text content
  const infoModalContent = document.createElement('div');
  infoModalContent.classList.add('atcb-modal-content');
  infoModalContent.innerHTML = content;
  infoModal.appendChild(infoModalContent);
  // and buttons (array of objects; attributes: href, type, label, primary(boolean))
  if (buttons != null && buttons.length > 0) {
    const infoModalButtons = document.createElement('div');
    infoModalButtons.classList.add('atcb-modal-buttons');
    infoModal.appendChild(infoModalButtons);
    buttons.forEach((button, index) => {
      let infoModalButton;
      if (button.href != null && button.href != '') {
        infoModalButton = document.createElement('a');
        infoModalButton.setAttribute('target', atcbDefaultTarget);
        infoModalButton.setAttribute('href', button.href);
        infoModalButton.setAttribute('rel', 'noopener');
      } else {
        infoModalButton = document.createElement('button');
        infoModalButton.type = 'button';
      }
      infoModalButton.classList.add('atcb-modal-btn');
      if (button.primary) {
        infoModalButton.classList.add('atcb-modal-btn-primary');
      }
      if (button.label == null || button.label == '') {
        button.label = atcb_translate_hook('Click me', data.language, data);
      }
      infoModalButton.textContent = button.label;
      infoModalButtons.appendChild(infoModalButton);
      if (index == 0) {
        infoModalButton.focus();
      }
      switch (button.type) {
        default:
          infoModalButton.addEventListener(
            'click',
            atcb_debounce(() => atcb_close())
          );
          infoModalButton.addEventListener(
            'keyup',
            atcb_debounce((event) => {
              if (event.key == 'Enter') {
                atcb_toggle('close', '', '', true);
              }
            })
          );
          break;
        case 'close':
          infoModalButton.addEventListener(
            'click',
            atcb_debounce(() => atcb_close())
          );
          infoModalButton.addEventListener(
            'keyup',
            atcb_debounce_leading((event) => {
              if (event.key == 'Enter') {
                event.preventDefault();
                atcb_toggle('close', '', '', true);
              }
            })
          );
          break;
      }
    });
  }
}

// SHARED FUNCTION TO CALCULATE THE POSITION OF THE DROPDOWN LIST
function atcb_position_list(trigger, list, blockUpwards = false, resize = false) {
  // check for position anchor
  let anchorSet = false;
  const originalTrigger = trigger;
  if (trigger.querySelector('.atcb-dropdown-anchor') !== null) {
    trigger = trigger.querySelector('.atcb-dropdown-anchor');
    anchorSet = true;
  }
  // calculate position
  let triggerDim = trigger.getBoundingClientRect();
  let listDim = list.getBoundingClientRect();
  const btnDim = originalTrigger.getBoundingClientRect();
  if (anchorSet === true && !list.classList.contains('atcb-dropoverlay')) {
    // in the regular case, we also check for the ideal direction
    // not in the !updateDirection case and not if there is not enough space above
    const viewportHeight = document.documentElement.clientHeight;
    if (
      (list.classList.contains('atcb-dropup') && resize) ||
      (!blockUpwards &&
        triggerDim.top + listDim.height > viewportHeight - 20 &&
        2 * btnDim.top + btnDim.height - triggerDim.top - listDim.height > 20)
    ) {
      originalTrigger.classList.add('atcb-dropup');
      list.classList.add('atcb-dropup');
      list.style.bottom =
        2 * viewportHeight -
        (viewportHeight + (btnDim.top + (btnDim.top + btnDim.height - triggerDim.top))) -
        window.scrollY +
        'px';
    } else {
      list.style.top = window.scrollY + triggerDim.top + 'px';
      if (originalTrigger.classList.contains('atcb-dropup')) {
        originalTrigger.classList.remove('atcb-dropup');
      }
    }
    // read trigger dimensions again, since after adjusting the top value of the list, something might have changed (e.g. re-adjustment due to missing scrollbars at this point in time)
    triggerDim = trigger.getBoundingClientRect();
    list.style.width = triggerDim.width + 'px';
    list.style.left = triggerDim.left + 'px';
  } else {
    // when there is no anchor set (only the case with custom implementations) or the listStyle is set respectively (overlay), we render the modal centered above the trigger
    // make sure the trigger is not moved over it via CSS in this case!
    let listWidth = triggerDim.width + 20 + 'px';
    list.style.minWidth = listWidth;
    // read list dimensions again, since we altered the width in the step before
    listDim = list.getBoundingClientRect();
    list.style.top = window.scrollY + btnDim.top + btnDim.height / 2 - listDim.height / 2 + 'px';
    list.style.left = triggerDim.left - (listDim.width - triggerDim.width) / 2 + 'px';
  }
}

// SHARED FUNCTION TO DEFINE WIDTH AND HEIGHT FOR "FULLSCREEN" FULLSIZE ELEMENTS
function atcb_set_fullsize(el) {
  el.style.width = window.innerWidth + 'px';
  el.style.height = window.innerHeight + 100 + 'px';
}

// SHARED DEBOUNCE AND THROTTLE FUNCTIONS
// going for last call debounce
function atcb_debounce(func, timeout = 200) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}
// dropping subsequent calls debounce
function atcb_debounce_leading(func, timeout = 300) {
  let timer;
  return (...args) => {
    if (!timer) {
      func.apply(this, args);
    }
    clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
    }, timeout);
  };
}
// throttle
function atcb_throttle(func, delay = 10) {
  let result;
  let timeout = null;
  let previous = 0;
  let later = (...args) => {
    previous = Date.now();
    timeout = null;
    result = func.apply(this, args);
  };
  return (...args) => {
    let now = Date.now();
    let remaining = delay - (now - previous);
    if (remaining <= 0 || remaining > delay) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(this, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

// GLOBAL KEYBOARD AND DEVICE LISTENERS
if (isBrowser()) {
  // global listener to ESC key to close dropdown
  document.addEventListener(
    'keyup',
    atcb_debounce_leading((event) => {
      if (event.key === 'Escape') {
        atcb_toggle('close', '', '', true);
      }
    })
  );
  // global listener to arrow key optionlist navigation
  document.addEventListener('keydown', (event) => {
    if (
      document.querySelector('.atcb-list') &&
      (event.key === 'ArrowDown' || event.key === 'ArrowUp' || event.key === 'Tab')
    ) {
      let targetFocus = 0;
      let currFocusOption = document.activeElement;
      const optionListCount = document.querySelectorAll('.atcb-list-item').length;
      if (currFocusOption.classList.contains('atcb-list-item')) {
        if (event.key === 'ArrowDown' && currFocusOption.dataset.optionNumber < optionListCount) {
          event.preventDefault();
          targetFocus = parseInt(currFocusOption.dataset.optionNumber) + 1;
        } else if (event.key === 'ArrowUp' && currFocusOption.dataset.optionNumber >= 1) {
          event.preventDefault();
          targetFocus = parseInt(currFocusOption.dataset.optionNumber) - 1;
        }
        if (targetFocus > 0) {
          document.querySelector('.atcb-list-item[data-option-number="' + targetFocus + '"]').focus();
        }
      } else {
        event.preventDefault();
        if (
          document.querySelector('.atcb-list-wrapper.atcb-dropup') &&
          (event.key === 'ArrowDown' || event.key === 'ArrowUp')
        ) {
          document.querySelector('.atcb-list-item[data-option-number="' + optionListCount + '"]').focus();
        } else {
          document.querySelector('.atcb-list-item[data-option-number="1"]').focus();
        }
      }
    }
  });
  // Global listener to any screen changes
  window.addEventListener(
    'resize',
    atcb_throttle(() => {
      let activeOverlay = document.getElementById('atcb-bgoverlay');
      if (activeOverlay != null) {
        atcb_set_fullsize(activeOverlay);
      }
      let activeButton = document.querySelector('.atcb-active');
      let activeList = document.querySelector('.atcb-dropdown');
      if (activeButton != null && activeList != null) {
        atcb_position_list(activeButton, activeList, false, true);
      }
    })
  );
}

// TRANSLATIONS
// hook, which can be used to override all potential "hard" strings by setting customLabel_ + the key (without spaces) as option key and the intended string as value
function atcb_translate_hook(identifier, language, data) {
  let searchKey = identifier.replace(/\s+/g, '').toLowerCase();
  if (
    data.customLabels != null &&
    data.customLabels[`${searchKey}`] != null &&
    data.customLabels[`${searchKey}`] != ''
  ) {
    return atcb_rewrite_html_elements(data.customLabels[`${searchKey}`]);
  } else {
    return atcb_translate(identifier, language);
  }
}

function atcb_translate(identifier, language) {
  switch (language) {
    case 'en':
    default:
      switch (identifier) {
        case 'Add to Calendar':
          return 'Add to Calendar';
        case 'iCal File':
          return 'iCal File';
        case 'Close':
          return 'Close';
        case 'Close Selection':
          return 'Close Selection';
        case 'Click me':
          return 'Click me';
        case 'WebView iCal':
          return 'Open your browser';
        case 'WebView info description':
          return "Unfortunately, in-app browsers have problems with the way we generate the calendar file.<br>We automatically put a magical URL into your phone's clipboard.<br><ol><li><strong>Open any other browser</strong> on your phone, ...</li><li><strong>Paste</strong> the clipboard content and go.";
      }
      break;
    case 'de':
      switch (identifier) {
        case 'Add to Calendar':
          return 'Im Kalender speichern';
        case 'iCal File':
          return 'iCal-Datei';
        case 'Close':
          return 'Schließen';
        case 'Close Selection':
          return 'Auswahl schließen';
        case 'Click me':
          return 'Klick mich';
        case 'WebView iCal':
          return 'Öffne deinen Browser';
        case 'WebView info description':
          return 'Leider haben In-App-Browser Probleme mit der Art, wie wir Kalender-Dateien erzeugen.<br>Wir haben automatisch eine magische URL in die Zwischenablage deines Smartphones kopiert.<br><ol><li><strong>Öffne einen anderen Browser</strong> auf deinem Smartphone, ...</li><li>Nutze die <strong>Einfügen</strong>-Funktion, um fortzufahren.';
      }
      break;
  }
  // if nothing found, return the original identifier
  return identifier;
}

// START INIT
if (isBrowser()) {
  if (document.readyState !== 'loading') {
    // if the script is loaded after the page has been loaded, run the initilization
    atcb_init();
  } else {
    // otherwise, init the magic as soon as the DOM has been loaded
    document.addEventListener('DOMContentLoaded', atcb_init, false);
  }
}
// END INIT
