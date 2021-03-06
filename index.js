require('colors');
var debug = require('debug')('render:index');

function Rule(format, actions, context) {
    debug('rule construct', format, actions);
    this.context = context || {};
    this.actions = actions || {};
    this.mapping = [];
    this.formatPattern = /#\{(.+?)(?::(\w+))?\}/g;

    if (typeof this.actions !== 'object') {
        this.actions = {default: this.actions};
    }

    if (typeof format === 'object') {
        // format directly passing regular expression
        this.regex = format;
    } else if (!this.formatPattern.test(format)) {
        this.regex = new RegExp(format);
    } else {
        // reset formatpattern
        this.formatPattern.lastIndex = 0;
        this.isParsed = true;
        this.regex = new RegExp(this._parse(format));
    }
}

Rule.prototype._wrap = function(pattern) {
    return '(' + pattern + ')';
};

Rule.prototype._replace = function(pattern) {
    if (pattern[0] === '$') {
        if (!this.context[pattern.slice(1)]) {
            throw new Error("context don't have format " + pattern);
        }
        pattern = this.context[pattern.slice(1)];
    }
    return pattern;
};

Rule.prototype._parse = function(format) {
    var match, name, pattern = '', lastIndex = 0;
    while (match = this.formatPattern.exec(format)) {
        name = match[2] || (match[1][0] === '$' ? match[1].slice(1) : 'default');
        this.mapping.push(name);
        pattern += this._wrap(format.slice(lastIndex, match.index));
        pattern += this._wrap(this._replace(match[1]));
        lastIndex = match.index + match[0].length;
    }
    pattern += this._wrap(format.slice(lastIndex));
    debug('pattern', pattern);
    return pattern;
};

Rule.prototype._render = function(text, action) {
    action = this.actions[action];
    switch (typeof action) {
        case 'string':
            return text[action];
        case 'function':
            return action(text);
        case 'undefined':
        default:
            return text;
    }
};

Rule.prototype.test = function(line) {
    return this.regex.test(line);
};

Rule.prototype.apply = function(line) {
    var self = this;
    return line.replace(self.regex, self.isParsed ? (function() {
        var groups = [].slice.call(arguments, 1, -2);
        groups = groups.map(function(group, index) {
            if (index % 2) {
                return self._render(group, self.mapping[(index - 1) / 2]);
            } else {
                return group;
            }
        }, self);
        debug('groups', groups);
        return groups.join('');
    }) : function(match) {
        return self._render(match, 'default');
    });
};

function Renderer(context) {
    this.rules = [];
    this.context = context || {};
}

Renderer.prototype.add = function(format, actions, context) {
    this.rules.push(new Rule(format, actions, context || this.context));
};

Renderer.prototype.apply = function(line) {
    this.rules.forEach(function(rule) {
        if (rule.test(line)) {
            line = rule.apply(line);
        }
    });
    debug('rendered', line);
    return line;
};

module.exports = function createRenderer(context) {
    return new Renderer(context);
};

module.exports.Rule = Rule;
