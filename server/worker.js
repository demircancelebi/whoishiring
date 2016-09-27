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
  locs: {
    sf: [[...mapWords(['san-francisco']), 'SF'], mapWords(['nsf', 'ssf', 'isf', 'esf'])],
    dc: [[...mapWords(['washington-dc']), 'Washington, DC']],
    mountainView: [mapWords(['mountain-view'])],
    daniaBeach: [mapWords(['dania-beach'])],
    ny: [mapWords(['new-york', 'ny', 'nyc', 'manhattan']), mapWords(['any', 'nyse', 'ony', 'eny', 'iny', 'uny'])],
    bayArea: [mapWords(['bay-area'])],
    mendrisio: [mapWords(['mendrisio'])],
    mcLean: [mapWords(['mc-lean'])],
    austin: [mapWords(['austin'])],
    atlanta: [mapWords(['atlanta'])],
    menloPark: [mapWords(['menlo-park'])],
    eindhoven: [mapWords(['eindhoven'])],
    hasselt: [mapWords(['hasselt'])],
    liege: [mapWords(['liege'])],
    london: [mapWords(['london'])],
    seattle: [mapWords(['seattle'])],
    costaMesa: [mapWords(['costa-mesa'])],
    berlin: [mapWords(['berlin'])],
    newZealand: [mapWords(['new-zealand'])],
    sanMateo: [mapWords(['san-mateo'])],
    denver: [mapWords(['denver'])],
    boulder: [mapWords(['boulder'])],
    dallas: [mapWords(['dallas'])],
    riga: [mapWords(['riga'])],
    melbourne: [mapWords(['melbourne'])],
    australia: [mapWords(['australia'])],
    paloAlto: [mapWords(['palo-alto'])],
    toronto: [mapWords(['toronto'])],
    edinburgh: [mapWords(['edinburgh'])],
    boston: [mapWords(['boston'])],
    reston: [mapWords(['reston'])],
    gurgaon: [mapWords(['gurgaon'])],
    bangalore: [mapWords(['bangalore'])],
    plano: [mapWords(['plano'])],
    louisville: [mapWords(['louisville'])],
    berkeley: [mapWords(['berkeley'])],
    redwoodCity: [mapWords(['redwood-city'])],
    ottawa: [mapWords(['ottawa'])],
    montreal: [mapWords(['montreal'])],
    waterloo: [mapWords(['waterloo'])],
    sanJose: [mapWords(['san-jose'])],
    remagen: [mapWords(['remagen'])],
    newJersey: [mapWords(['new-jersey'])],
    amsterdam: [mapWords(['amsterdam'])],
    cupertino: [mapWords(['cupertino'])],
    chicago: [mapWords(['chicago'])],
    dublin: [mapWords(['dublin'])],
    pasadena: [mapWords(['pasadena'])],
    losAngeles: [mapWords(['los-angeles'])],
    irving: [mapWords(['irving'])],
    hongKong: [mapWords(['hong-kong'])],
    denver: [mapWords(['denver'])],
    cambridge: [mapWords(['cambridge'])],
    singapore: [mapWords(['singapore'])],
    barcelona: [mapWords(['barcelona'])],
    glasgow: [mapWords(['glasgow'])],
    budapest: [mapWords(['budapest'])],
    sofia: [mapWords(['sofia'])],
    tokyo: [mapWords(['tokyo'])],
    baltimore: [mapWords(['baltimore'])],
    stockholm: [mapWords(['stockholm'])],
    sweden: [mapWords(['sweden'])],
    colorado: [mapWords(['colorado'])],
    paris: [mapWords(['paris'])],
    charleston: [mapWords(['charleston'])],
    sanDiego: [mapWords(['san-diego'])],
    copenhagen: [mapWords(['copenhagen'])],
    israel: [mapWords(['israel'])],
    kitchener: [mapWords(['kitchener'])],
    canada: [mapWords(['canada'])],
    portland: [mapWords(['portland'])],
    oregon: [mapWords(['oregon'])],
    arlington: [mapWords(['arlington'])],
    oakland: [mapWords(['oakland'])],
    pittsburgh: [mapWords(['pittsburgh'])],
    heidelberg: [mapWords(['heidelberg'])],
    kelowna: [mapWords(['kelowna'])],
    boise: [mapWords(['boise'])],
    charlottesville: [mapWords(['charlottesville'])],
    durham: [mapWords(['durham'])],
    miami: [mapWords(['miami'])],
    lausanne: [mapWords(['lausanne'])],
    shanghai: [mapWords(['shanghai'])],
    orangeCounty: [mapWords(['orange-county'])],
    ontario: [mapWords(['ontario'])],
    newcastle: [mapWords(['newcastle'])],
    brixton: [mapWords(['brixton'])],
    champaign: [mapWords(['champaign'])],
    sydney: [mapWords(['sydney'])],
    manchester: [mapWords(['manchester'])],
    cleveland: [mapWords(['cleveland'])],
    charlotte: [mapWords(['charlotte'])],
    goldCoast: [mapWords(['gold-coast'])],
    medford: [mapWords(['medford'])],
    portsmouth: [mapWords(['portsmouth'])],
    medford: [mapWords(['medford'])],
    istanbul: [mapWords(['istanbul'])],
    ashford: [mapWords(['ashford'])],
    zurich: [mapWords(['zurich'])],
    florence: [mapWords(['florence'])],
    italy: [mapWords(['italy'])],
    spain: [mapWords(['spain'])],
    germany: [mapWords(['germany'])],
    cologne: [mapWords(['cologne'])],
    india: [mapWords(['india'])],
    sunnyvale: [mapWords(['sunnyvale'])],
    alisoViejo: [mapWords(['aliso-viejo'])],
    regensburg: [mapWords(['regensburg'])],
    belgrade: [mapWords(['belgrade'])],
    serbia: [mapWords(['serbia'])],
    raleigh: [mapWords(['raleigh'])],
    annArbor: [mapWords(['ann-arbor'])],
    rioDeJaneiro: [mapWords(['rio-de-janeiro'])],
    nuremberg: [mapWords(['nuremberg'])],
    prague: [mapWords(['prague'])],
    philadelphia: [mapWords(['philadelphia'])],
    detroit: [mapWords(['detroit'])],
    wiesbaden: [mapWords(['wiesbaden'])],
    melbourne: [mapWords(['melbourne'])],
    brecksville: [mapWords(['brecksville'])]
  },
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
  // const links = getUrls(html);

  // remove duplicate and bad formatted links
  // const linksLen = links.length;
  // for (var i = linksLen - 1; i >= 0; i--) {
  //   if (links[i].indexOf('%3C') > -1 || links[i].indexOf('</a>') > -1) {
  //     links.splice(i, 1);
  //   }
  // }

  // remove reply link
  // links.pop();

  // handle attr
  const attr = {
    locs: [],
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
  const circle = html.indexOf('&#x2022;');
  const arr = [pipe, dash, dots, link1, link2, is, has, dot, ldash, lldash, apos, star, circle];

  const smallest = Math.min.apply(null, arr.filter(n => n !== -1));
  let company = html.slice(37, smallest);

  if (company.length > 40) {
    if (company.indexOf('(') > -1) {
      company = company.slice(0, company.indexOf('('));
    }
  }

  company = company.trim();
  if (company.indexOf('Open Whisper Systems') > -1) {
    console.log(company);
  }

  return {
    company,
    locs: _.union(attr.locs),
    type: _.union(attr.type),
    field: _.union(attr.field),
    stack: _.union(attr.stack),
    where: _.union(attr.where),
    // links,
    active: true,
    by: $($html.find('.comhead a.hnuser')[0]).text(),
    hn_id: $($html.find('.age a')[0]).attr('href').split('?id=')[1]
  }
};

const fetch = (line, cb) => {
  const lineArr = line.split(' - ');
  const date = lineArr[0];
  const id = lineArr[1];
  const url = `https://news.ycombinator.com/item?id=${id}`;
  const d = date.replace(' ', '');

  rp(url)
    .then(function (html) {
      fs.writeFileSync(path.resolve(__dirname, 'stories', `${d}.html`), html);
    });
};

const traverse = () => {
  const files = fs.readdirSync(path.resolve(__dirname, 'stories'));

  files.forEach(file => {
    const html = fs.readFileSync(path.resolve(__dirname, 'stories', file), 'utf-8');
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

    const d = file.split('.')[0];
    const jobsWithDate = jobs.map((j) => {
      j.onstory = d;
      return j;
    });

    Job.create(jobs);
  });
};

module.exports = () => {
  // for (let i = 0; i < ids.length; i += 1) {
  //   fetch(ids[i]);
  // };
  traverse();
};
