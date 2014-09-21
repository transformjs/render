require('colors');

var formatPattern = /#\{(.+?)(?::(\w+))?\}/g;

function Pattern(format, rules, context) {
    rules = rules || {};
    context = context || {};
    var mapping = [];
    format = format.replace(formatPattern, function(match, p, name) {
        name = name || p.slice(1);
        mapping.push(name);
        if (p[0] === '$') {
            if (!context[p.slice(1)]) {
                throw new Error("context don't have format " + p);
            }
            p = context[p.slice(1)];
        }
        return '(' + p + ')';
    });

    this.mapping = mapping;
    this.rules = rules;
    this.regex = new RegExp(format);
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

function Recognizer() {
    this.patterns = [];
}

Recognizer.prototype.add = function(format, rules, context) {
    this.patterns.push(new Pattern(format, rules, context));
};

Recognizer.prototype.apply = function(line, join) {
    join = join || function(groups) {
        return groups.join(' ');
    };
    for (var i=0; i<this.patterns.length; i++) {
        if (this.patterns[i].test(line)) {
            return join(this.patterns[i].apply(line));
        }
    }
};

module.exports = function createRecognizer() {
    return new Recognizer();
};

module.exports.Pattern = Pattern;
