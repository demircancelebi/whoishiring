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
    ny: [mapWords(['new-york', 'ny', 'nyc', 'manhattan']), mapWords(['any', 'nyse', 'ony', 'eny', 'iny', 'uny'])],
    dc: [[...mapWords(['washington-dc']), 'Washington, DC', 'Washington DC']],
    alameda: [mapWords(['alameda'])],
    alisoViejo: [mapWords(['aliso-viejo'])],
    amsterdam: [mapWords(['amsterdam'])],
    annArbor: [mapWords(['ann-arbor'])],
    arlington: [mapWords(['arlington'])],
    ashford: [mapWords(['ashford'])],
    atlanta: [mapWords(['atlanta'])],
    austin: [mapWords(['austin'])],
    australia: [mapWords(['australia'])],
    austria: [mapWords(['austria'])],
    baltimore: [mapWords(['baltimore'])],
    bangalore: [mapWords(['bangalore', 'bengaluru'])],
    bangkok: [mapWords(['bangkok'])],
    barcelona: [mapWords(['barcelona'])],
    baskingRidge: [mapWords(['basking-ridge'])],
    bayArea: [mapWords(['bay-area'])],
    belgrade: [mapWords(['belgrade'])],
    berkeley: [mapWords(['berkeley'])],
    berlin: [mapWords(['berlin'])],
    birmingham: [mapWords(['birmingham'])],
    boise: [mapWords(['boise'])],
    boston: [mapWords(['boston'])],
    boulder: [mapWords(['boulder'])],
    brecksville: [mapWords(['brecksville'])],
    brighton: [mapWords(['brighton'])],
    brixton: [mapWords(['brixton'])],
    budapest: [mapWords(['budapest'])],
    burlingame: [mapWords(['burlingame'])],
    cambridge: [mapWords(['cambridge'])],
    canada: [mapWords(['canada'])],
    champaign: [mapWords(['champaign'])],
    charleston: [mapWords(['charleston'])],
    charlotte: [mapWords(['charlotte'])],
    charlottesville: [mapWords(['charlottesville'])],
    chattanooga: [mapWords(['chattanooga'])],
    chicago: [mapWords(['chicago'])],
    chile: [mapWords(['chile'])],
    cleveland: [mapWords(['cleveland'])],
    cologne: [mapWords(['cologne'])],
    colorado: [mapWords(['colorado'])],
    copenhagen: [mapWords(['copenhagen'])],
    costaMesa: [mapWords(['costa-mesa'])],
    cupertino: [mapWords(['cupertino'])],
    dallas: [mapWords(['dallas'])],
    daniaBeach: [mapWords(['dania-beach'])],
    denver: [mapWords(['denver'])],
    detroit: [mapWords(['detroit'])],
    dublin: [mapWords(['dublin'])],
    durham: [mapWords(['durham'])],
    edinburgh: [mapWords(['edinburgh'])],
    eindhoven: [mapWords(['eindhoven'])],
    emeryville: [mapWords(['emeryville'])],
    england: [mapWords(['england'])],
    florence: [mapWords(['florence'])],
    germany: [mapWords(['germany'])],
    glasgow: [mapWords(['glasgow'])],
    goldCoast: [mapWords(['gold-coast'])],
    gurgaon: [mapWords(['gurgaon'])],
    hasselt: [mapWords(['hasselt'])],
    heidelberg: [mapWords(['heidelberg'])],
    hongKong: [mapWords(['hong-kong'])],
    houston: [mapWords(['houston'])],
    india: [mapWords(['india'])],
    indonesia: [mapWords(['indonesia'])],
    irving: [mapWords(['irving'])],
    israel: [mapWords(['israel'])],
    istanbul: [mapWords(['istanbul'])],
    italy: [mapWords(['italy'])],
    jakarta: [mapWords(['jakarta'])],
    japan: [mapWords(['japan'])],
    kelowna: [mapWords(['kelowna'])],
    kitchener: [mapWords(['kitchener'])],
    lausanne: [mapWords(['lausanne'])],
    liege: [mapWords(['liege'])],
    lisbon: [mapWords(['lisbon'])],
    london: [mapWords(['london'])],
    losAngeles: [mapWords(['los-angeles'])],
    losGatos: [mapWords(['los-gatos'])],
    louisville: [mapWords(['louisville'])],
    luxembourg: [mapWords(['luxembourg'])],
    manchester: [mapWords(['manchester'])],
    mcLean: [mapWords(['mc-lean'])],
    medford: [mapWords(['medford'])],
    melbourne: [mapWords(['melbourne'])],
    mendrisio: [mapWords(['mendrisio'])],
    menloPark: [mapWords(['menlo-park'])],
    miami: [mapWords(['miami'])],
    minneapolis: [mapWords(['minneapolis'])],
    montreal: [mapWords(['montreal'])],
    mountainView: [mapWords(['mountain-view'])],
    netherlands: [mapWords(['netherlands'])],
    newcastle: [mapWords(['newcastle'])],
    newJersey: [mapWords(['new-jersey'])],
    newZealand: [mapWords(['new-zealand'])],
    norway: [mapWords(['norway'])],
    nuremberg: [mapWords(['nuremberg'])],
    oakland: [mapWords(['oakland'])],
    ontario: [mapWords(['ontario'])],
    oregon: [mapWords(['oregon'])],
    orangeCounty: [mapWords(['orange-county'])],
    oslo: [mapWords(['oslo'])],
    ottawa: [mapWords(['ottawa'])],
    oxford: [mapWords(['oxford'])],
    paloAlto: [mapWords(['palo-alto'])],
    paris: [mapWords(['paris'])],
    pasadena: [mapWords(['pasadena'])],
    philadelphia: [mapWords(['philadelphia'])],
    pittsburgh: [mapWords(['pittsburgh'])],
    plano: [mapWords(['plano'])],
    portland: [mapWords(['portland'])],
    portsmouth: [mapWords(['portsmouth'])],
    portugal: [mapWords(['portugal'])],
    prague: [mapWords(['prague'])],
    raleigh: [mapWords(['raleigh'])],
    redwoodCity: [mapWords(['redwood-city'])],
    regensburg: [mapWords(['regensburg'])],
    remagen: [mapWords(['remagen'])],
    reston: [mapWords(['reston'])],
    riga: [mapWords(['riga'])],
    rioDeJaneiro: [[...mapWords(['rio-de-janeiro']), 'Rio de Janeiro']],
    salzburg: [mapWords(['salzburg'])],
    sanDiego: [mapWords(['san-diego'])],
    sanJose: [mapWords(['san-jose'])],
    sanMateo: [mapWords(['san-mateo'])],
    santaClara: [mapWords(['santa-clara'])],
    santaMonica: [mapWords(['santa-monica'])],
    santiago: [mapWords(['santiago'])],
    scottsValley: [mapWords(['scotts-valley'])],
    seattle: [mapWords(['seattle'])],
    serbia: [mapWords(['serbia'])],
    shanghai: [mapWords(['shanghai'])],
    singapore: [mapWords(['singapore'])],
    sofia: [mapWords(['sofia'])],
    spain: [mapWords(['spain'])],
    stockholm: [mapWords(['stockholm'])],
    sunnyvale: [mapWords(['sunnyvale'])],
    sweden: [mapWords(['sweden'])],
    sydney: [mapWords(['sydney'])],
    tokyo: [mapWords(['tokyo'])],
    toronto: [mapWords(['toronto'])],
    waterloo: [mapWords(['waterloo'])],
    wiesbaden: [mapWords(['wiesbaden'])],
    zurich: [mapWords(['zurich'])]
  },
  type: {
    fulltime: [mapWords(['full-time'])],
    parttime: [mapWords(['part-time'])]
  },
  visa: {
    yes: [mapWords(['visa'])]
  },
  intern: {
    yes: [mapWords(['intern']), mapWords(['internal', 'internet'])]
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
    pm: [mapWords(['product-manager', 'project-manager', 'scrum-master'])],
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

  // handle attr
  const attr = {
    locs: [],
    type: [],
    field: [],
    where: [],
    stack: [],
    visa: [],
    intern: []
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
  const dotComma = html.indexOf(';');
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
  const slash = html.indexOf('/');
  const we1 = html.indexOf('We&apos');
  const we2 = html.indexOf('we&apos');
  const paren = html.indexOf('(');
  const its = html.indexOf('It&apos');

  const arr = [pipe, dash, dots, dotComma, link1, link2, is, has, dot, ldash,
              lldash, apos, star, circle, slash, we1, we2, paren, its];

  const smallest = Math.min.apply(null, arr.filter(n => n !== -1));
  let company = html.slice(37, smallest);

  if (company.length > 40) {
    if (company.indexOf('(') > -1) {
      company = company.slice(0, company.indexOf('('));
    }
  }

  company = company.replace(/<(?:.|\n)*?>/gm, '');
  company = company.trim();

  const active = !(html.indexOf('[flagged]') > -1) && !(html.indexOf('[dupe]') > -1)

  if (attr.type.indexOf('parttime') < -1) {
    attr.type.push('fulltime');
  }

  if (attr.type.indexOf('remote') < -1) {
    attr.type.push('onsite');
  }

  if (attr.visa.length > 0) {
    attr.visa = attr.visa[0];
  }

  if (attr.intern.length > 0) {
    attr.intern = attr.intern[0];
  }

  return {
    locs: _.union(attr.locs),
    type: _.union(attr.type),
    field: _.union(attr.field),
    stack: _.union(attr.stack),
    where: _.union(attr.where),
    visa: attr.visa,
    intern: attr.intern,
    html,
    links,
    active,
    company,
    by: $($html.find('.comhead a.hnuser')[0]).text(),
    hn_id: $($html.find('.age a')[0]).attr('href').split('?id=')[1]
  }
};

const fetch = (line) => {
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

const traverse = (cb) => {
  const files = fs.readdirSync(path.resolve(__dirname, 'stories'));
  console.log(`File count: ${files.length}`);
  files.forEach((file, i) => {
    if (file === 'October2016.html') {
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

      Job.createAsync(jobs)
        .then(() => {
          cb();
        });
    }
  });
};

module.exports = () => {
  traverse(() => {
    for (let i = 0; i < ids.length; i += 1) {
     fetch(ids[i]);
    };
  });
};
