'use strict';

// Compile these with http://mrcoles.com/bookmarklet/


// Log reading
var x = open('https://alec-reads.gomix.me/read?secret=PASTESECRETHERE&url=' + encodeURIComponent(document.URL));
setTimeout(function() {
    x.close();
}, 1000);

//Star reading
var y = open('https://alec-reads.gomix.me/read?secret=PASTESECRETHERE&url=' + encodeURIComponent(document.URL) +
    '&star=%20' + encodeURIComponent(prompt('Comment?')));
setTimeout(function() {
    y.close();
}, 1000);
