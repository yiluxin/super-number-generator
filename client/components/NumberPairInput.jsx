NumberPairInput = React.createClass({
  displayName: 'NumberPairInput',

  propTypes: {
    numberPairs: React.PropTypes.array.isRequired,
    onInsertNumberPair: React.PropTypes.func.isRequired
  },

  handleSubmit(e) {
    e.preventDefault();
    let start = React.findDOMNode(this.refs.start).value.trim();
    let end = React.findDOMNode(this.refs.end).value.trim();

    if (!start || !end || start.length < START_LENGTH || end.length < END_LENGTH) {
      alert('请输入4位开头号码和3位末尾号码');
      return;
    }

    let hasBeenGenerated = this.props.numberPairs.some(numberPair => {
      return numberPair.start === start && numberPair.end === end;
    });
    if (hasBeenGenerated) {
      alert('已经导入过该号码段');
      React.findDOMNode(this.refs.start).value = '';
      React.findDOMNode(this.refs.end).value = '';
      return;
    }

    if (isNaN(start) || isNaN(end)) {
      alert('请输入数字');
      if (isNaN(start)) {
        React.findDOMNode(this.refs.start).value = '';
      }
      if (isNaN(end)) {
        React.findDOMNode(this.refs.end).value = '';
      }
      return;
    }

    this.props.onInsertNumberPair(start, end);

    React.findDOMNode(this.refs.start).value = '';
    React.findDOMNode(this.refs.end).value = '';
  },

  render() {
    return (
      <form className="form-inline" onSubmit={this.handleSubmit}>
        <input type="text" className="form-control" placeholder={`开头${START_LENGTH}位`} ref="start" maxLength={START_LENGTH} />
        <input type="text" className="form-control" placeholder={`末尾${END_LENGTH}位`} ref="end" maxLength={END_LENGTH} />
        <button type="submit" className="btn btn-default">导入到通讯录</button>
      </form>
    );
  }
});
