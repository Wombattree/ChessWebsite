import React, { useState } from 'react';
import { PageNames } from '../../utilities/enums';
import NavigationBarButton from './NavigationBarButton';
import "./style.css";

interface Props
{
	currentPage: PageNames,
	HandlePageChange: (page: PageNames) => void,
	loggedIn: boolean,
	HandleLoggedIn: (value: boolean) => void,
}

export default function NavigationBar (props: Props)
{
	const [burgerBarActive, SetBurgerBarState] = useState(false);
	
	const navBarClasses = `${burgerBarActive ? "is-active" : ""}`;

	return (
		<div>
			<div className="navBarContainer">
				<nav className="navbar backgroundDark" role="navigation" aria-label="main navigation">
					<div className="navbar-brand backgroundDark">
						<div className="navbar-item navBarTitle has-text-light">Chess</div>
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
						<div className="navbar-start">
							<div className="navbar-item">

								<NavigationBarButton
									buttonName="Play Chess" 
									pageName={PageNames.Chess}
									currentPage={props.currentPage} 
									HandlePageChange={props.HandlePageChange}
								/>

								<NavigationBarButton
									buttonName="About" 
									pageName={PageNames.About}
									currentPage={props.currentPage} 
									HandlePageChange={props.HandlePageChange}
								/>
							</div>
						</div>
					</div>
				</nav>
			</div>
  		</div>
	);
}