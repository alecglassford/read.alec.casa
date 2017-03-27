'use strict';

var template = `
    {{#articles}}
    <li>
        <a href="{{url}}">{{title}}</a>
        {{#time}}
            <span class="time">{{time}}</span>
        {{/time}}
        {{#star}}
            ⭐️<br>{{star}}
        {{/star}}
    </li>
    {{/articles}}
`;

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCdaNaedBlFJh69UklN3HBjW1_cd6CU9aI",
    authDomain: "read-8074e.firebaseapp.com",
    databaseURL: "https://read-8074e.firebaseio.com/"
};
firebase.initializeApp(config);
var db = firebase.database();

var query = db.ref('articles').orderByKey().once('value').then((snapshot) => {
  var data = snapshot.val();
  data = Object.keys(data).map(k => data[k]);
  data.reverse();

  var output = Mustache.render(template, {articles: data});
  document.getElementById('log').innerHTML = output;
});
