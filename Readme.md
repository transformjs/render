# log [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url]

> Pretty print log file

You may also interested in [another log parser](https://gist.github.com/CatTail/7c3248d8d596ed8e452b)

## Installation

    npm install tran-log


## Usage

    var log = require('tran-log');
    var format = '^#{\\w+:type}$';
    var rules = {
        type: 'yellow'
    };
    var pattern = new log.Pattern(format, rules);
    var groups = pattern.apply('This_word_will_be_yellow');
    console.log(groups.join());


## License

MIT

[npm-image]: https://img.shields.io/npm/v/tran-log.svg?style=flat
[npm-url]: https://npmjs.org/package/tran-log
[travis-image]: https://img.shields.io/travis/transformjs/log.svg?style=flat
[travis-url]: https://travis-ci.org/transformjs/log
[coveralls-image]: https://img.shields.io/coveralls/transformjs/log.svg?style=flat
[coveralls-url]: https://coveralls.io/r/transformjs/log?branch=master
