import React, { useState } from 'react';
import NavigationBar from '../NavigationBar/NavigationBar';
import { PageNames } from '../../utilities/enums';
import Chess from '../Chess/Chess';
import About from '../../pages/About';

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
			default: return <Chess />;
		}
	};

	return (
		<div>
			<NavigationBar currentPage={currentPage} HandlePageChange={HandlePageChange} loggedIn={loggedIn} HandleLoggedIn={HandleLoggedIn}/>
			{RenderPage()}
		</div>
	);
}
