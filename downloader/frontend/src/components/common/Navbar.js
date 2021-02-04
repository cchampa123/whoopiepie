import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css'

class Navbar extends React.Component {

  render() {
    const link_items = this.props.link_list.map(function(x, index) {return <Link key={index} className="menu-item" to={x.link}>{x.text}</Link>})
    return (
      <Menu right className='bm-menu'>
        {link_items}
      </Menu>
    )
  }
}

export default Navbar;
//
// function NavItem(props) {
//   return (
//     <ul><Link to={props.link}>{props.text}</Link></ul>
//   )
// }
//
// class Navbar extends React.Component {
//   render(){
//     const navItems = this.props.list.map(item => <NavItem key={item.id} link={item.link} text={item.text}/>)
//     return (
//       <nav className="navbar navbar-default">
//           {navItems}
//       </nav>
//     )
//   }
// }
//
// export default Navbar;
