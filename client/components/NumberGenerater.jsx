NUMBER_LENGTH = 11;
START_LENGTH = 3;
END_LENGTH = 5;
MIDDLE_LENGTH = 3;
NUMBERS_COUNT = 1000;
BOUND = 100;

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


    function generateNumbers(from) {
      if (from === 0) {
        self.setState({
          isGenerating: true
        });
      }

      function onSuccess(contact) {
        contact = null;

        self.setState({
          completedCount: self.state.completedCount + 1
        });

        if (self.state.completedCount === NUMBERS_COUNT) { // 生成结束，在100%进度条停留1秒
          Meteor.call('insertNumberPair', start, end, function(err, result) {
            if (err) {
              console.log(err.reason);
            }
          });
          window.setTimeout(function() {
            self.setState({
              isGenerating: false,
              completedCount: 0
            });
          }, 1000);
          return ;
        }

        if (self.state.completedCount % BOUND === 0) {
          generateNumbers(self.state.completedCount);
        }
      };

      function onError(contactError) {
        console.log(contactError);
      };

      for (let i = from; i < from + BOUND; i++) { // 每次生成100个
        let number = start + zeroPad(i, MIDDLE_LENGTH) + end;
        let contact = navigator.contacts.create();
        let phoneNumbers = [];
        phoneNumbers[0] = new ContactField('mobile', number, true);
        contact.displayName = number;
        contact.phoneNumbers = phoneNumbers;


        contact.save(onSuccess, onError);
      }
    }

    // 导入到手机通讯录
    generateNumbers(0);
  },

  onRemoveNumberPair(_id) {
    var self = this;
    let {start, end} = NumberPairs.findOne({_id: _id});

    // 找出1000个号码（先用末位数字匹配，再用开头数字）
    function onSuccess(contacts) {
      let filteredContacts = contacts.filter(function(contact) {
        return contact.displayName.startsWith(start);
      });

      // 分断删除1000个号码
      removeNumbers(0);

      function removeNumbers(from) {
        if (from === 0) {
          self.setState({
            isRemoving: true
          });
        }

        function onSuccess() {
          self.setState({
            completedCount: self.state.completedCount + 1
          });

          if (self.state.completedCount === NUMBERS_COUNT) {
            Meteor.call('removeNumberPair', _id, function(err, result) {
              if (err) {
                console.log(err.reason);
              }
            });
            window.setTimeout(function() {
              self.setState({
                isRemoving: false,
                completedCount: 0
              });
            }, 1000);
            return ;
          }

          if (self.state.completedCount % BOUND === 0) {
            removeNumbers(self.state.completedCount);
          }
        }

        function onError(contactError) {
          console.log(contactError);
        };

        for (let i = from; i < from + BOUND; i++) {
          filteredContacts[i].remove(onSuccess, onError);
        }
      }
    };

    function onError(contactError) {
      alert('onError!');
    };

    var options      = new ContactFindOptions();
    options.filter   = end
    options.multiple = true;
    var fields       = [navigator.contacts.fieldType.displayName];
    navigator.contacts.find(fields, onSuccess, onError, options);
  },

  renderLoading() {
    return (
      <div>
        {this.data.subReady ?
          <div>
            {this.state.isGenerating ? <h3>导入中，请稍候</h3> : null}
            {this.state.isRemoving ? <h3>删除中，请稍候</h3> : null}
            {this.isInProgress() ? <ProgressBar completedCount={this.state.completedCount} /> :
              <div>
                <NumberPairInput onInsertNumberPair={this.onInsertNumberPair} numberPairs={this.data.numberPairs}/>
                <NumberPairsList onRemoveNumberPair={this.onRemoveNumberPair} numberPairs={this.data.numberPairs}/>
              </div>
              }
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
