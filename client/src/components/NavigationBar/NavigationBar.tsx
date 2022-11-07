import React, { useState } from 'react';
import { PageNames } from '../../utilities/enums';

interface Props
{
	currentPage: PageNames,
	HandlePageChange: (page: PageNames) => void
}

export const NavigationBar: React.FC<Props> = (props: Props) =>
{
	const [burgerBarActive, SetBurgerBarState] = useState(false);
	
	const navBarClasses = `has-background-dark is-transparent has-text-white ${burgerBarActive ? "is-active" : ""}`;
	const navBarButtonClasses = "button navbar-item is-size-5 mr-2";

	function GetTextColour(pageName: PageNames)
	{
		if (props.currentPage === pageName) return 'has-text-dark';
		else return 'has-text-light';
	}

	function GetBackgroundColour(pageName: PageNames)
	{
		if (props.currentPage === pageName) return ' has-background-light';
		else return ' has-background-dark';
	}

	return (
		<div>
			<nav className="navbar has-background-dark p-2 has-text-weight-semibold is-transparent" role="navigation" aria-label="main navigation">
				<div className="navbar-brand">
					<div className="navbar-item has-text-white is-size-3 ml-5">Chess</div>
					<div 
						onClick ={() => SetBurgerBarState(!burgerBarActive)}
						role="button"
						className={navBarClasses + ` navbar-burger`}
						id="navbar-burger"
						aria-label="menu"
						aria-expanded="false">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</div>
				</div>
				<div id="navbar" className={navBarClasses + ` navbar-menu`}>
					<div className="navbar-end mr-5">
						<div className="navbar-item">
							<button className={navBarButtonClasses + GetBackgroundColour(PageNames.Home)} 
								onClick ={() => props.HandlePageChange(PageNames.Home)}>
								<div className = { GetTextColour(PageNames.Home) }>Home</div>
								</button>

							<button className={navBarButtonClasses + GetBackgroundColour(PageNames.User)} 
								onClick = {() => props.HandlePageChange(PageNames.User)}>
								<div className = { GetTextColour(PageNames.User) }>User</div>
								</button>

							<button className={navBarButtonClasses + GetBackgroundColour(PageNames.Chess)} 
								onClick = {() => props.HandlePageChange(PageNames.Chess)}>
								<div className = { GetTextColour(PageNames.Chess) }>Chess</div>
								</button>
						</div>
					</div>
				</div>
			</nav>
  		</div>
	);
}