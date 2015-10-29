NumberPairsList = React.createClass({
  displayName: 'NumberPairsList',

  propTypes: {
    numberPairs: React.PropTypes.array.isRequired,
    onRemoveNumberPair: React.PropTypes.func.isRequired
  },

  handleRemove(e) {
    debugger;
  },

  render() {
    let lists = this.props.numberPairs.map(numberPair => {
      return (
        <NumberPair key={numberPair._id} onRemoveNumberPair={this.props.onRemoveNumberPair} numberPair={numberPair} />
      );
    });
    return (
      <div>
        <h3>已导入号码段</h3>
        <ul className="list-group">
          {lists}
        </ul>
      </div>
    );
  }
});
