NUMBER_LENGTH = 11;
START_LENGTH = 3;
END_LENGTH = 6;
MIDDLE_LENGTH = 2;
NUMBERS_COUNT = 100;

NumberGenerator = React.createClass({
  mixins: [ReactMeteorData],

  displayName: 'App',

  getInitialState() {
    return {
      isGenerating: false,
      isRemoving: false,
      completedCount: 0
    };
  },

  getMeteorData() {
    let handle = Meteor.subscribe('numberPairs');
    let numberPairs = NumberPairs.find({ userId: Meteor.userId() }).fetch();
    return {
      subReady: !!handle.ready(),
      currentUser: Meteor.user(),
      numberPairs
    }
  },

  onInsertNumberPair(start, end) {
    var self = this;

    function zeroPad(number, width) {
      var string = String(number);
      while (string.length < width)
        string = "0" + string;
      return string;
    }

    Meteor.call('insertNumberPair', start, end, function(err, result) {
      if (err) {
        console.log(err.reason);
      }
    });

    // 导入到手机通讯录
    for (let i = 0; i < NUMBERS_COUNT; i++) {
      self.setState({
        isGenerating: true
      });

      let number = start + zeroPad(i, MIDDLE_LENGTH) + end;
      let contact = navigator.contacts.create();
      let phoneNumbers = [];
      phoneNumbers[0] = new ContactField('mobile', number, true);
      contact.displayName = number;
      contact.phoneNumbers = phoneNumbers;

      
      function onSuccess(contact) {
        self.setState({
          completedCount: self.state.completedCount + 1
        });
        if (self.state.completedCount === NUMBERS_COUNT) {
          window.setTimeout(function() {
            self.setState({
              isGenerating: false,
              completedCount: 0
            });
          }, 1000);
        }
      };

      function onError(contactError) {
        console.log(contactError);
      };

      contact.save(onSuccess, onError);
      
    }
  },

  onRemoveNumberPair(_id) {
    Meteor.call('removeNumberPair', _id, function(err, result) {
      if (err) {
        console.log(err.reason);
      }
    });

    // 从手机通讯录中删除
  },

  renderLoading() {
    return (
      <div>
        {this.data.subReady ?
          <div>
            {this.state.isGenerating ? <h3>导入中，请稍候</h3> : null}
            {this.state.isRemoving ? <h3>删除中，请稍候</h3> : null}
            {this.isInProgress() ? <ProgressBar completedCount={this.state.completedCount} /> : null}
            <NumberPairInput onInsertNumberPair={this.onInsertNumberPair} numberPairs={this.data.numberPairs}/>
            <NumberPairsList onRemoveNumberPair={this.onRemoveNumberPair} numberPairs={this.data.numberPairs}/>
          </div>
          : <div className="well">数据加载中，请稍后</div>}
        </div>
    );
  },

  isInProgress() {
    return this.state.isGenerating || this.state.isRemoving;
  },

  render() {
    return (
      <div className="container">
        <LoginButtons />
        {this.data.currentUser ? this.renderLoading() : <div className="well">请登录</div>}
      </div>
    );
  }
});
