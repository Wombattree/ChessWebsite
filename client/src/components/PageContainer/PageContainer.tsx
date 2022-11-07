import React, { useState } from 'react';
import { NavigationBar } from '../NavigationBar/NavigationBar';
import { PageNames } from '../../utilities/enums';
import Chess from '../Chess/Chess';

export default function PageContainer() 
{
	const [currentPage, SetCurrentPage] = useState(PageNames.Home);

	// function RenderPage()
	// {
	// 	// if (currentPage === CurrentPage.Home) return <AboutMe />;
	// 	// else if (currentPage === CurrentPage.Home) return <Portfolio />;
	// 	// else if (currentPage === CurrentPage.Home) return <Contact />;
	// 	// else return <Resume />;
	// };

	const HandlePageChange = (page: PageNames) => SetCurrentPage(page);

	return (
		<div>
			<NavigationBar currentPage={currentPage} HandlePageChange={HandlePageChange} />
			<Chess />
			{/* {RenderPage()} */}
		</div>
	);
}
