import React from "react";
import "./index.css";

class Notfound extends React.PureComponent {
  render() {
    const { NotfoundText } = this.props;
    return (
      <div className="Notfound">
        <h1>{NotfoundText}</h1>
      </div>
    );
  }
}

export default Notfound;
