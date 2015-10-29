LoginButtons = React.createClass({
  displayName: 'LoginButtons',

  componentDidMount() {
    // Use Meteor Blaze to render login buttons
    this.view = Blaze.render(Template._loginButtons,
                             React.findDOMNode(this.refs.container));
  },
  componentWillUnmount() {
    // Clean up Blaze view
    Blaze.remove(this.view);
  },
  render() {
    // Just render a placeholder container that will be filled in
    return (
      <div className="navbar navbar-default" role="navigation">
        <div className="navbar-header">
          <a className="navbar-brand" href="#">编号神器</a>
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target=".navbar-collapse">
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
        </div>
        <div className="navbar-collapse collapse">
          <ul className="nav navbar-nav navbar-right" ref="container">
          </ul>
        </div>
      </div>
    );
  }
});
