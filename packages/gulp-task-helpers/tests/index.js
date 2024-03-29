// © Andrew Wei

'use strict';

const $ = require(`../`);
const expect = require(`chai`).expect;

describe(`helpers`, function() {
  it(`glob() should work with string patterns`, function() {
    expect($.glob(`a/b`)).to.eql(`a/b`);
  });

  it(`glob() should work with array patterns`, function() {
    expect($.glob([`a/b`, `b/c`])).to.eql([`a/b`, `b/c`]);
  });

  it(`glob() should work with base option`, function() {
    expect($.glob(`a/b`, { base: `z` })).to.eql(`z/a/b`);
    expect($.glob([`a/b`, `b/c`], { base: `z` })).to.eql([`z/a/b`, `z/b/c`]);
  });

  it(`glob() should work with exts option`, function() {
    expect($.glob(`a/b`, { exts: [`a`] })).to.eql(`a/b.a`);
    expect($.glob(`a/b`, { exts: [] })).to.eql(`a/b`);
    expect($.glob(`a/b`, { exts: [`a`, `b`] })).to.eql(`a/b.{a,b}`);
    expect($.glob(`a/b`, { exts: [[`a`, `b`], [`c`, `d`]] })).to.eql(`a/b.{a,b,c,d}`);
    expect($.glob([`a/b`, `c/d`], { exts: [[`a`, `b`], [`c`, `d`]] })).to.eql([`a/b.{a,b,c,d}`, `c/d.{a,b,c,d}`]);
  });

  it(`config() should work without defaults`, function() {
    expect($.config({
      a: 1,
      b: 2
    })).to.eql({
      a: 1,
      b: 2
    });
  });

  it(`config() should work with defaults`, function() {
    expect($.config({
      a: 1,
      b: 2
    }, {
      a: 2,
      b: 3,
      c: 4
    })).to.eql({
      a: 1,
      b: 2,
      c: 4
    });
  });
});
