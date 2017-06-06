'use strict';

var db = firebase.database();

var query = db.ref('articles').orderByKey().once('value').then((snapshot) => {
  var data = snapshot.val();
  data = Object.keys(data).map(k => data[k]);
  data.reverse();

  writeLog(data);
  drawRecent(data);
});

function writeLog(data) {
  var logItems = d3.select('#log').text('')
    .selectAll('li')
      .data(data)
    .enter().append('li');

  logItems.append('a')
      .attr('href', d => d.url)
      .text(d => d.title);

  logItems.filter(d => d.time).append('span')
    .attr('class', 'time')
    .text(d => d.time);

  var starred = logItems.filter(d => d.star);
  starred.append('span')
      .text('⭐️');
  starred.append('div')
      .text(d => d.star);
}

/* For the chart */

function drawRecent(data) {
  var dayAndWc = getRecent(data);
  var wordsPerDay = d3.nest()
    .key(d => d.day).sortKeys(d3.ascending)
    .rollup(sumWcs)
    .entries(dayAndWc);

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
    var month = oldest.getMonth() + 1,
        date = oldest.getDate();
    zeroes.push({day: `${month}/${date}`, wc: 0});
    oldest.setDate(oldest.getDate() - 1);
  }
  oldest.setHours(23);
  oldest.setMinutes(59);
  oldest.setSeconds(59);
  for (var i in data) {
    if (new Date(data[i].time) <= oldest) break;
  }
  return data.slice(0, i)
             .map(getDayAndWc)
             .concat(zeroes);
}

function getDayAndWc(d) {
  var t = new Date(d.time),
      month = t.getMonth() + 1,
      date = t.getDate();
  return {day: `${month}/${date}`, wc: d.wc};
}

function sumWcs(articles) {
  return articles.reduce((result, d) => result + d.wc, 0);
}
