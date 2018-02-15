import React from 'react';

import Button from 'antd/lib/button';

class Buttons extends React.PureComponent {
  render() {
    const {
      Text, Type, onClick, loading, disabled,
    } = this.props;
    return (
      <Button
        className="KI_touch"
        loading={loading}
        disabled={disabled}
        type={Type}
        onClick={onClick}
      >
        {Text}
      </Button>
    );
  }
}

export default Buttons;
