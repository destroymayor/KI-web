import React, { Component } from 'react';
import './index.css';

//載入react router組件庫
import { Link } from 'react-router-dom';

//載入ant design 組件庫
import { Menu, Icon } from 'antd';

class Menus extends Component {
  _renderLoginPage = () => (
    <Menu.Item key="Login">
      <Link to="/">
        <Icon type="user" />Login
      </Link>
    </Menu.Item>
  );

  _renderUserPage = () => (
    <Menu.Item key="User">
      <Link to="/Chat">
        <Icon type="user" />User
      </Link>
    </Menu.Item>
  );

  _renderTrainerPage = () => (
    <Menu.Item key="User">
      <Icon type="user" />Trainer
    </Menu.Item>
  );

  _renderExpert = () => (
    <Menu>
      <Menu.Item key="Ki">
        <Link to="/Ki">Keyword Identify</Link>
      </Menu.Item>
      <Menu.Item key="CsCreator">
        <Link to="/CsCreator">CsCreator</Link>
      </Menu.Item>
    </Menu>
  );

  render() {
    const { renderPage } = this.props;
    return (
      <div className="Menu">
        <Menu style={{ width: '100%' }} mode="horizontal">
          {renderPage === 'User'
            ? this._renderUserPage()
            : renderPage === 'Trainer'
              ? this._renderTrainerPage()
              : renderPage === 'Expert' ? this._renderExpert() : this._renderLoginPage()}
        </Menu>
      </div>
    );
  }
}

export default Menus;
