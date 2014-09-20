require('colors');

var patternPattern = /#\{(.+?)(?::(\w+))?\}/g;

function Pattern(pattern, rules, context) {
    var mapping = [];
    pattern = pattern.replace(patternPattern, function(match, p, name) {
        name = name || p.slice(1);
        mapping.push(name);
        if (p[0] === '$') {
            if (!context[p.slice(1)]) {
                throw new Error("context don't have pattern " + p);
            }
            p = context[p.slice(1)];
        }
        return '(' + p + ')';
    });

    this.mapping = mapping;
    this.rules = rules;
    this.regex = new RegExp(pattern);
}

Pattern.prototype.test = function(line) {
    return this.regex.test(line);
};

Pattern.prototype.apply = function(line) {
    if (this.test(line)) {
        return line.match(this.regex).slice(1).map(function(match, index) {
            var rule = this.rules[this.mapping[index]];
            switch (typeof rule) {
                case 'string':
                    return match[rule];
                case 'function':
                    return rule(match);
                case 'undefined':
                    default:
                    return match;
            }
        }, this);
    } else {
        return [];
    }
};

module.exports = {
    Pattern: Pattern
};
