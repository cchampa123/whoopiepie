import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css'
import { useAuth } from './auth'

function Navbar(props) {
  const link_items = props.link_list.map(function(x, index) {return <Link key={index} className="menu-item" to={x.link}>{x.text}</Link>})
  const setAuthTokens = useAuth()

  return (
    <Menu right className='bm-menu'>
      {link_items}
      <a onClick={props.logout}>Log Out</a>
    </Menu>
  )
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
