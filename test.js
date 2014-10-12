'use strict';

var stemmer,
    content,
    visit,
    Retext,
    assert,
    retext,
    otherWords,
    otherStems;

/**
 * Module dependencies.
 */

stemmer = require('./');
Retext = require('retext');
visit = require('retext-visit');
content = require('retext-content');
assert = require('assert');

/**
 * Retext.
 */

retext = new Retext()
    .use(visit)
    .use(content)
    .use(stemmer);

/**
 * Constants.
 */

otherWords = ['An', 'easy', 'normal', 'paragraph'];
otherStems = ['an', 'easy', 'norm', 'paragraph'];

/**
 * Tests.
 */

describe('porterStemmer()', function () {
    it('should be a `function`', function () {
        assert(typeof stemmer === 'function');
    });

    it('should export an `attach` method', function () {
        assert(typeof stemmer.attach === 'function');
    });

    retext.parse('A simple, english, sentence', function (err, tree) {
        it('should not throw', function (done) {
            done(err);
        });

        it('should `stem` each `WordNode`', function () {
            tree.visitType(tree.WORD_NODE, function (wordNode) {
                assert('stem' in wordNode.data);
            });
        });

        it('should set each stem to `null` when a WordNode (no longer?) ' +
            'has a value', function () {
                tree.visitType(tree.WORD_NODE, function (wordNode) {
                    wordNode.removeContent();

                    assert(wordNode.data.stem === null);
                });
            }
        );

        it('should automatically re-stem `WordNode`s when their values ' +
            'change',
            function () {
                var index;

                index = -1;

                tree.visitType(tree.WORD_NODE, function (wordNode) {
                    wordNode.replaceContent(otherWords[++index]);

                    assert(wordNode.data.stem === otherStems[index]);
                });
            }
        );
    });
});