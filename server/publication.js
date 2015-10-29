Meteor.publish('numberPairs', function() {
  return NumberPairs.find({ userId: this.userId });
});
