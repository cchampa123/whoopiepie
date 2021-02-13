import React from 'react';
import { Link } from 'react-router-dom';
import { slide as Menu } from 'react-burger-menu';
import './Navbar.css'
import { useAuth } from './auth'

class Navbar extends React.Component {

  constructor() {
    super()
    this.state = {
      selected:'WhoopiePie'
    }
    this.changeSelected = this.changeSelected.bind(this)
  }

  changeSelected(event) {
    this.setState({selected:event.target.name})
  }

  render() {
    const link_items = this.props.link_list.map(
      function(x, index) {
        return (
                    <Link
                      key={index}
                      name={x.text}
                      onClick={this.changeSelected}
                      className="btn btn-secondary"
                      to={x.link}
                    >
                    {x.text}
                    </Link>
                  )
                }, this
    )
    return (
      <nav className='navbar navbar-dark bg-primary fixed-top'>
      <h1>{this.state.selected}</h1>
      <Menu right className='bm-menu'>
        {link_items}
        <a onClick={this.props.logout} className='btn btn-secondary'>Log Out</a>
      </Menu>
      </nav>
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
