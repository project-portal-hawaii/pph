import { Meteor } from 'meteor/meteor';
import { expect } from 'chai';
import { Sponsors } from './Sponsors';

/* eslint prefer-arrow-callback: "off", no-unused-expressions: "off" */
/* eslint-env mocha */

if (Meteor.isServer) {
  describe('SponsorsCollection', function testSuite() {
    it('Check that a new interest can be defined and retrieved', function test() {
      const name = `test-interest-${new Date().getTime()}`;
      Sponsors.collection.insert({ name });
      expect(Sponsors.collection.findOne({ name }).name).to.equal(name);
    });
  });
}
