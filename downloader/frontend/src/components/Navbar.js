import React from 'react';
import { Link } from 'react-router-dom'

function NavItem(props) {
  return (
    <ul><Link to={props.link}>{props.text}</Link></ul>
  )
}

class Navbar extends React.Component {
  render(){
    const navItems = this.props.list.map(item => <NavItem key={item.id} link={item.link} text={item.text}/>)
    return (
      <nav className="navbar navbar-default">
          {navItems}
      </nav>
    )
  }
}

export default Navbar;
