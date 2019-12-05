import React, { useState } from "react";
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  Container,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  DropdownMenu
} from "reactstrap";

function Navigation(props) {
  const [isOpen, toggleOpen] = useState(false);
  const [dropdownOpen, toggleDropdownOpen] = useState(false);
  const navLinks = [
    { name: "View Categories", link: "/categories" },
    { name: "View Orders", link: "/history" }
  ];
  const accountLinks = [
    { name: "Cart", link: "/cart", callback: () => {} },
    { name: "Proflie", link: "/profile-view", callback: () => {} },
    { name: "Checkout", link: "/payment", callback: () => {} },
    { name: "Log out", link: "/login", callback: props.handleLogout }
  ];

  function getDropDown() {
    if (props.authed) {
      return (
        <Dropdown
          navbar="true"
          isOpen={dropdownOpen}
          toggle={() => toggleDropdownOpen(!dropdownOpen)}
        >
          <DropdownToggle navbar="true" caret>
            Account
          </DropdownToggle>
          <DropdownMenu dark="true">
            {accountLinks.map((link, index) => {
              return (
                <DropdownItem key={index}>
                  <NavLink
                    onClick={link.callback}
                    href={link.link}>
                    {link.name}
                  </NavLink>
                </DropdownItem>
              );
            })}
          </DropdownMenu>
        </Dropdown>
      );
    } else {
      return <p />;
    }
  }

  return (
    <Navbar color="dark" dark={true} expand="sm">
      <Container>
        <NavbarBrand href="/">StoreFront Team 30</NavbarBrand>
        <Collapse isOpen={isOpen} navbar={true}>
          <Nav className="mr-auto" navbar>
            {props.authed && navLinks.map((option, index) => {
              return (
                <NavItem key={index}>
                  <NavLink href={option.link}>{option.name}</NavLink>
                </NavItem>
              );
            })}
          </Nav>

          <Nav className="ml-auto" nav="true">
            {getDropDown()}
          </Nav>
        </Collapse>
        <NavbarToggler onClick={() => toggleOpen(!isOpen)} />
      </Container>
    </Navbar>
  );
}

export default Navigation;
