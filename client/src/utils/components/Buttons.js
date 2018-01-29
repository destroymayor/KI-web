import React, { Component } from "react";

import Button from "antd/lib/button";

class Buttons extends Component {
  render() {
    const { Text, Type, onClick, disabled } = this.props;
    return (
      <Button className="KI_touch" disabled={disabled} type={Type} onClick={onClick}>
        {Text}
      </Button>
    );
  }
}

export default Buttons;
