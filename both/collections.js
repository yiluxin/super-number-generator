NumberPairs = new Mongo.Collection('numberPairs');

Meteor.methods({
  insertNumberPair(start, end) {
    check(start, String);
    check(end, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'must log in to insert number pairs');
    }
    return NumberPairs.insert({start, end, userId: this.userId });
  },

  removeNumberPair(_id) {
    check(_id, String);
    if (!this.userId) {
      throw new Meteor.Error('not-authorized', 'must log in to remove number pairs');
    }
    return NumberPairs.remove({_id});
  }
});
