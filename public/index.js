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

var db = firebase.database();

var query = db.ref('articles').orderByKey().once('value').then((snapshot) => {
  var data = snapshot.val();
  data = Object.keys(data).map(k => data[k]);
  data.reverse();

  var output = Mustache.render(template, {articles: data});
  document.getElementById('log').innerHTML = output;
  drawRecent(data);
});

/* For the chart */

function drawRecent(data) {
  var dayAndWc = getRecent(data);
  var wordsPerDay = d3.nest()
    .key(d => d.day).sortKeys(d3.ascending)
    .rollup(sumWcs)
    .entries(dayAndWc);
  console.log(wordsPerDay);

  var width = 600,
      height = 160,
      margin = 20,
      svg = d3.select('#recent svg')
          .attr('width', width)
          .attr('height', height + 2 * margin);


  var barWidth = width / wordsPerDay.length;
  var y = d3.scaleLinear()
      .domain([0, d3.max(wordsPerDay, d => d.value)])
      .range([height, margin]);

  var bar = svg.selectAll('g')
      .data(wordsPerDay)
    .enter().append('g')
      .attr('transform', (d, i) => `translate(${i * barWidth}, 0)`);
  bar.append('rect')
      .attr('y', d => y(d.value))
      .attr('height', d => height - y(d.value))
      .attr('width', barWidth - 1);
  bar.append('text')
      .attr('x', barWidth / 2)
      .attr('y', d => height)
      .attr('dy', '1em')
      .text(d => d.key);
  bar.append('text')
      .attr('x', barWidth / 2)
      .attr('y', d => y(d.value))
      .attr('dy', '-1em')
      .text(d => `${d.value} words`);
}

function getRecent(data) {
  var LENGTH = 7;
  var oldest = new Date();
  var zeroes = [];
  for (var j = 0; j < LENGTH; j += 1) {
    var month = oldest.getMonth(),
        date = oldest.getDate();
    zeroes.push({day: `${month}/${date}`, wc: 0});
    oldest.setDate(oldest.getDate() - 1);
  }
  for (var i in data) {
    if (new Date(data[i].time) < oldest) break;
  }
  return data.slice(0, i)
             .map(getDayAndWc)
             .concat(zeroes);
}

function getDayAndWc(d) {
  var t = new Date(d.time),
      month = t.getMonth(),
      date = t.getDate();
  return {day: `${month}/${date}`, wc: d.wc};
}

function sumWcs(articles) {
  return articles.reduce((result, d) => result + d.wc, 0);
}
