'use strict';

// Compile these with http://mrcoles.com/bookmarklet/


// Log reading
var x = open('https://alec-reads.glitch.me/read?secret=PASTESECRETHERE&url=' + encodeURIComponent(document.URL));
setTimeout(function() {
    x.close();
}, 10000);

//Star reading
var y = open('https://alec-reads.glitch.me/read?secret=PASTESECRETHERE&url=' + encodeURIComponent(document.URL) +
    '&star=%20' + encodeURIComponent(prompt('Comment?')));
setTimeout(function() {
    y.close();
}, 10000);
