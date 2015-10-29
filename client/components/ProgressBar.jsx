ProgressBar = React.createClass({
  displayName: 'ProgressBar',

  propTypes: {
    completedCount: React.PropTypes.number.isRequired
  },

  progress() {
    return this.props.completedCount / NUMBERS_COUNT * 100;
  },

  render() {
    let progressBarStyle = {
      width: `${this.progress()}%`
    };
    return (
      <div className="progress">
        <div className="progress-bar" role="progressbar" aria-valuenow={this.progress()} aria-valuemin="0" aria-valuemax="100" style={progressBarStyle}>
          {`${this.props.completedCount}/${NUMBERS_COUNT}`}
        </div>
      </div>
    );
  }
});
