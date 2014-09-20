require('colors');
var log = require('../');
var debug = require('debug')('test');
var hub = require('regexhub');

describe('Pattern', function() {
    var line = 'ERROR 2014-09-20 14:11:42 10.64.11.231 /var/www/honey/index.html[line:20] <CODE_ERROR> Undefined variable: XXX';
    var format = '^#{\\w+:type}\\s+#{$date}\\s+#{$time}\\s+#{$ipv4:ip}\\s+#{[^\\s]+:path}\\s+#{.+:misc}$';
    var rules = {
        type: 'red',
        time: function(time) {
            return time.replace(/:/g, '-');
        }
    };

    var pattern = new log.Pattern(format, rules, hub);
    var groups = pattern.apply(line);
    debug(groups.join(' '));

    it('should parse format group mapping', function() {
        var mapping = ['type', 'date', 'time', 'ip', 'path', 'misc'];
        pattern.mapping.should.eql(mapping);
    });

    it('should colorize if rule is string', function() {
        groups[0].should.equal('ERROR'.red);
    });

    it('should leave group untouch if no rule specified', function() {
        groups[1].should.equal('2014-09-20');
    });

    it('should process by rule function', function() {
        groups[2].should.equal('14-11-42');
    });

    it('should return empty array if line dont match format', function() {
        pattern.apply('sample unmatch line').length.should.equal(0);
    });
});
