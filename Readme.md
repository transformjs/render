# render [![NPM version][npm-image]][npm-url] [![build status][travis-image]][travis-url] [![Test coverage][coveralls-image]][coveralls-url]

> Text renderer

## Installation

    npm install tran-render


## Usage

    var createRenderer = require('tran-render');
    var format = '#{\\w+}';
    var renderer = createRenderer(format, 'yellow');
    console.log(renderer.apply('This_word_will_be_yellow'));


## License

MIT

[npm-image]: https://img.shields.io/npm/v/tran-render.svg?style=flat
[npm-url]: https://npmjs.org/package/tran-render
[travis-image]: https://img.shields.io/travis/transformjs/render.svg?style=flat
[travis-url]: https://travis-ci.org/transformjs/render
[coveralls-image]: https://img.shields.io/coveralls/transformjs/render.svg?style=flat
[coveralls-url]: https://coveralls.io/r/transformjs/render?branch=master
