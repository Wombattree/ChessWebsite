import { useState } from 'react';
import { PageNames } from '../../utilities/enums';

interface Props
{
    buttonName: string,
    pageName: PageNames,
	currentPage: PageNames,
	HandlePageChange: (page: PageNames) => void
}

export default function NavigationBarButton (props: Props)
{
    const [hovered, SetHovered] = useState(false);

	function GetTextColour(pageName: PageNames)
	{
		if (props.currentPage === pageName) return 'has-text-dark';
		else return 'has-text-light';
	}

	function GetBackgroundColour(pageName: PageNames): string
	{
        if (props.currentPage === pageName) return "";
        if (hovered) return " backgroundMedium"
        else return " backgroundDark";
	}

    function GetTextSize(pageName: PageNames)
	{
		if (props.currentPage === pageName || hovered) return " navBarButtonTextLarge";
        else return "";
	}

	return (
        <button 
            className={`button navBarButton ${GetBackgroundColour(props.pageName)} ${GetTextSize(props.pageName)}`} 
            onClick ={() => props.HandlePageChange(props.pageName)}
            onMouseEnter={() => SetHovered(true)}
            onMouseLeave={() => SetHovered(false)}
            >
            <div className = { GetTextColour(props.pageName) }>{props.buttonName}</div>
        </button>
	);
}