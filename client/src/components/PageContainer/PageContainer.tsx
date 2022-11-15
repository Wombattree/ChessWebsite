import React, { useState } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import { PageNames } from '../../utilities/enums';
import Chess from '../Chess/Chess';
import SignUp from '../../pages/SignUp';
import SignIn from '../../pages/SignIn';
import About from '../../pages/About';
import Profile from '../../pages/Profile';

export default function PageContainer() 
{
	const [currentPage, SetCurrentPage] = useState(PageNames.Chess);
	const HandlePageChange = (page: PageNames) => SetCurrentPage(page);

	const [loggedIn, SetLoggedIn] = useState(false);
	const HandleLoggedIn = (value: boolean) => SetLoggedIn(value);

	function RenderPage()
	{
		switch (currentPage)
		{
			case PageNames.About: return <About />;
			case PageNames.UserProfile: return <Profile />;
			case PageNames.SignUp: return <SignUp HandleLoggedIn={HandleLoggedIn}/>;
			case PageNames.SignIn: return <SignIn HandleLoggedIn={HandleLoggedIn}/>;
			default: return <Chess />;
		}
	};

	return (
		<div>
			<NavigationBar currentPage={currentPage} HandlePageChange={HandlePageChange} loggedIn={loggedIn} HandleLoggedIn={HandleLoggedIn}/>
			{RenderPage()}
			{/* <Routes>
				<Route path="/" element={<Home />} />
				<Route path="/about" element={<About />} />
				<Route path="/chess" element={<Chess />} />
				<Route path="/profile" element={<Profile />} />
				<Route path="/signup" element={<SignUp />} />
				<Route path="/signin" element={<SignIn />} />
			</Routes> */}
		</div>
	);
}
