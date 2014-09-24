require('colors');
var createRenderer = require('../');
var debug = require('debug')('render:test');
var context = require('regexhub');

describe('render', function() {
    var line = 'ERROR 2014-09-20 14:11:42 10.64.11.231 /var/www/honey/index.html[line:20] <CODE_ERROR> Undefined variable: XXX';
    var format = '^#{\\w+:type}\\s+#{$date}\\s+#{$time}\\s+#{$ipv4:ip}\\s+#{[^\\s]+:path}\\s+#{.+:misc}$';
    var actions = {
        type: 'red',
        time: function(time) {
            return time.replace(/:/g, '-');
        }
    };

    describe('Rule', function() {
        var rule = new createRenderer.Rule(format, actions, context);
        var rendered = rule.apply(line);

        it('should parse format group mapping', function() {
            var mapping = ['type', 'date', 'time', 'ip', 'path', 'misc'];
            rule.mapping.should.eql(mapping);
        });

        it('should colorize if rule is string', function() {
            rendered.indexOf('ERROR'.red).should.equal(0);
        });

        it('should leave group untouch if no rule specified', function() {
            rendered.indexOf('2014-09-20').should.not.equal(-1);
        });

        it('should process by rule function', function() {
            rendered.indexOf('14-11-42').should.not.equal(-1);
        });

        it('should throw exception if context dont exist', function() {
            (function(){
                new createRenderer.Rule(format, actions, {});
            }).should.throw();
        });
    });

    describe('Renderer', function() {
        it('should allow default context for all rules', function() {
            var renderer = createRenderer(context);
            renderer.add('#{$date:date}', {date: 'blue'});
            var rendered = renderer.apply(line);
            rendered.indexOf('2014-09-20'.blue).should.not.equal(-1);
        });

        it('should allow multi rule render', function() {
            var renderer = createRenderer(context);
            renderer.add('#{$date:date}', {date: 'blue'});
            renderer.add('#{$time:time}', {time: 'red'});
            var rendered = renderer.apply(line);
            rendered.indexOf('2014-09-20'.blue).should.not.equal(-1);
            rendered.indexOf('14:11:42'.red).should.not.equal(-1);
        });

        it('should return original line if no format matches', function()  {
            var renderer = createRenderer();
            renderer.add('#{PREFIX}');
            renderer.apply(line).should.equal(line);
        });
    });
});
