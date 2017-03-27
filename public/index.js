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
    apiKey: "AIzaSyDTfoIGcBT9dpT67fzcOWcwmER29rD0X0M",
    databaseURL: "https://portfolio-8b0ef.firebaseio.com",
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
