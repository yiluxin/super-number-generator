NumberPair = React.createClass({
  propTypes: {
    numberPair: React.PropTypes.object.isRequired
  },

  handleRemove(e) {
    this.props.onRemoveNumberPair(this.props.numberPair._id);
  },

  render() {
    return (
      <li className="list-group-item">
        <span>{`${this.props.numberPair.start} --- ${this.props.numberPair.end}`}</span>
        <button className="btn btn-default btn-sm pull-right" onClick={this.handleRemove}>删除</button>
      </li>
    );
  }
});
