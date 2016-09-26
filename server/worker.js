const fs = require('fs');
const path = require('path');
const jsonfile = require('jsonfile');
const _ = require('lodash');
const cheerio = require('cheerio');
const getUrls = require('get-urls');
const rp = require('request-promise');
import Job from './api/job/job.model';

const ids = fs.readFileSync(path.resolve(__dirname, 'ids.txt')).toString().split('\n');
for (var i = ids.length - 1; i >= 0; i--) {
  if (ids[i][0] === '#') {
    ids.splice(i, 1);
  }
}

const mapWord = (ws, delimiter) => {
  let w = '';

  ws.forEach((s, i) => {
    w += s;
    if (!(i === ws.length - 1)) {
      w += delimiter;
    }
  });
  return w;
}

const capitalize = (w) => w.toUpperCase();
const capitalizeFirst = (w, delimiter) => {
  if (!delimiter) {
    return w[0].toUpperCase() + w.slice(1, w.length)
  }

  let word = '';
  const ws = w.split(delimiter);
  ws.forEach((s, i) => {
    word += capitalizeFirst(s);
    if (!(i === ws.length - 1)) {
      word += delimiter;
    }
  });
  return word;
};

const mw = (ws, delimiter, delimiters) => {
  const dels = ['', ' ', '-'];

  if (delimiters && delimiters.length > 0) {
    dels.push(...delimiters);
  }

  const result = [
    mapWord(ws, delimiter),
    capitalize(mapWord(ws, delimiter))
  ];

  dels.forEach(del => {
    result.push(capitalizeFirst(mapWord(ws, del), del));
    result.push(capitalizeFirst(mapWord(ws, delimiter), del));
  });

  return _.union(result);
};

const mapWords = (wordsArray) => {
  const result = [];
  wordsArray.forEach(w => {
    const ws = w.split('-');

    result.push(
      ...mw(ws, ''),
      ...mw(ws, ' '),
      ...mw(ws, '-')
    );

    if (w.indexOf(',') === -1) {
      result.push(
        _.camelCase(w),
        _.capitalize(_.camelCase(w))
      );
    }

  });

  return _.union(result);
}

const criteria = {
  type: {
    fulltime: [mapWords(['full-time'])],
    parttime: [mapWords(['part-time'])],
    visa: [mapWords(['visa'])],
    intern: [mapWords(['intern']), mapWords(['internal', 'internet'])]
  },
  where: {
    onsite: [[...mapWords(['on-site', 'or-remote']), 'or REMOTE', 'or Remote', 'or remote']],
    remote: [mapWords(['remote'])]
  },
  field: {
    frontend: [mapWords(['front-end', 'front-end-developer', 'front-end-development'])],
    backend: [mapWords(['back-end', 'back-end-developer', 'back-end-development'])],
    fullstack: [mapWords(['full-stack', 'full-stack-develop'])],
    ios: [[...mapWords(['ios-engineer', 'ios-develop']), 'iOS engineer']],
    android: [mapWords(['android-engineer', 'android-develop'])],
    data: [mapWords(['machine-learning', 'deep-learning', 'data-architect', 'data-scient'])],
    devops: [mapWords(['dev-ops'])],
    pm: [mapWords(['product-manager'])],
    sre: [mapWords(['reliability', 'sre']), ['ssre']],
    security: [mapWords(['security-engineer'])]
  },
  stack: {
    javascript: [[...mapWords(['java-script', 'node-js', 'js-engineer', 'angular', 'react']), ...mw(['node', 'js'], '.', ['.'])]],
    nodejs: [[...mapWords(['node-js']), ...mw(['node', 'js'], '.', ['.'])]],
    java: [mapWords(['java']), mapWords(['java-script'])],
    python: [mapWords(['python', 'django', 'flask'])],
    c: [['C/C++', 'C, C++', 'C and C++']],
    cpp: [['c++', 'C++']],
    csharp: [['c#', 'C#']],
    mongodb: [[...mapWords(['mongo', 'mongo-db']), 'mongoDB']],
    ruby: [[...mapWords(['ruby', 'rails', 'ruby-on-rails', 'ror']), 'RoR']],
    go: [mapWords(['golang', 'go,']), ['ago,', 'ego,', 'ngo,']],
    rust: [mapWords(['rust']), mapWords(['trust', 'frustra'])],
    postgresql: [mapWords(['postgre'])],
    angular: [mapWords(['angular'])],
    django: [mapWords(['django'])],
    react: [mapWords(['react']), mapWords(['reacti'])],
    scala: [mapWords(['scala']), mapWords(['scalab'])],
    aws: [mapWords(['aws', 'amazon-web', 'ec2'])],
    docker: [mapWords(['docker', 'kubernetes', 'k8s'])],
    kubernetes: [mapWords(['kubernetes', 'k8s'])],
    spark: [mapWords(['spark']), mapWords(['p-spark', 'l-spark', 'e-spark', 'spark-capital'])],
    kafka: [mapWords(['kafka'])],
    mysql: [[...mapWords(['my-sql']), 'MySQL', 'mySQL']],
    elasticsearch: [mapWords(['elastic-search'])],
    linux: [mapWords(['linux'])],
    php: [mapWords(['php', 'symfony'])],
    unity: [mapWords(['unity']), mapWords(['munity', 'tunity'])],
    rabbit: [mapWords(['rabbit', 'rabbit-mq'])],
    redis: [mapWords(['redis'])],
    hadoop: [mapWords(['hadoop'])],
    backbone: [mapWords(['backbone']), mapWords(['backbone-of', 'backbone-for'])],
    ember: [mapWords(['ember'])],
    webrtc: [[...mapWords(['web-rtc']), 'WebRTC']]
  }
};

const parseJob = ($html) => {
  const $ = cheerio.load($html.html());

  const html = $html.find('.comment').html();
  const links = getUrls(html);

  // remove duplicate and bad formatted links
  const linksLen = links.length;
  for (var i = linksLen - 1; i >= 0; i--) {
    if (links[i].indexOf('%3C') > -1 || links[i].indexOf('</a>') > -1) {
      links.splice(i, 1);
    }
  }

  // remove reply link
  links.pop();

  // handle attr
  const attr = {
    type: [],
    field: [],
    where: [],
    stack: []
  };

  for (const criterion in criteria) {
    for (const check in criteria[criterion]) {
      criteria[criterion][check][0].forEach(ch => {
      if (html.indexOf(ch) > -1) {
        if (criteria[criterion][check].length > 1) {
          let pushWord = true;
          criteria[criterion][check][1].forEach(nope => {
            if (html.indexOf(nope) > -1) {
              if (Math.abs(html.indexOf(ch) - html.indexOf(nope)) < 3) {
                pushWord = false;
              }
            }
          });
          if (pushWord) {
            attr[criterion].push(check);
          }
        } else {
          attr[criterion].push(check);
        }
      }
    })
    }
  }

  // handle company
  const pipe = html.indexOf('|');
  const dash = html.indexOf('-');
  const dots = html.indexOf(':');
  const link1 = html.indexOf('<a');
  const link2 = html.indexOf('(<a');
  const is = html.indexOf('is ');
  const has = html.indexOf('has ');
  const dot = html.indexOf('. ');
  const ldash = html.indexOf('&#x2013;');
  const lldash = html.indexOf('&#x2014;');
  const apos = html.indexOf('&#x2019;');
  const star = html.indexOf('*');
  const arr = [pipe, dash, dots, link1, link2, is, has, dot, ldash, lldash, apos, star];

  const smallest = Math.min.apply(null, arr.filter(n => n !== -1));
  let company = html.slice(37, smallest);

  if (company.length > 40) {
    if (company.indexOf('(') > -1) {
      company = company.slice(0, company.indexOf('('));
    }
  }

  return {
    company,
    // locs,
    type: _.union(attr.type),
    field: _.union(attr.field),
    stack: _.union(attr.stack),
    where: _.union(attr.where),
    links,
    active: true,
    by: $($html.find('.comhead a.hnuser')[0]).text(),
    hn_id: $($html.find('.age a')[0]).attr('href').split('?id=')[1]
  }
};

module.exports = () => {
  console.log(ids);
  for (let i = 0; i < ids.length; i += 1) {
    const line = ids[i].split(' - ');
    const date = line[0];
    const id = line[1];
    const url = `https://news.ycombinator.com/item?id=${id}`;
    const d = date.replace(' ', '');

    rp(url)
      .then(function (html) {
        fs.writeFile(path.resolve(__dirname, 'stories', `${d}.html`), html);
        const $ = cheerio.load(html);

        const comments = $('body').find('.athing.comtr');
        const jobs = [];
        let text = '';
        comments.each((i, c) => {
          const $c = $(c);
          const isJob = !parseInt($($c.find('.ind img')[0]).attr('width'), 10);
          if (isJob) {
            jobs.push(parseJob($c));
          }
        });

        const jobsWithDate = jobs.map((j) => {
          j.onstory = d;
          return j;
        });

        Job.create(jobs);
      })
      .catch(function (err) {
        console.log('Crawl Error:');
        console.log(err.message);
      });
  }
}
