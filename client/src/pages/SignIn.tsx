import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { LOGIN } from '../utilities/mutations';
import Authentication from '../utilities/authentication';
import Input from '../components/Input/Input';
import "./style.css";

function GetTopPosition(position: number): number
{
    const screenHeight: number = window.innerHeight;
    return screenHeight * 0.2 + position * 50;
}

function GetLeftPosition(width: number): number
{
    const screenWidth:number = window.innerWidth;
    return screenWidth * 0.5 - width * 0.5;
}

function GetWidth(): number
{
    const screenWidth:number = window.innerWidth;

    if (screenWidth < 1000) return screenWidth * 0.5;
    else if (screenWidth < 2000) return screenWidth * 0.3333;
    else return screenWidth * 0.2;
}

interface Props
{
	HandleLoggedIn: (value: boolean) => void,
}

export default function SignIn(props: Props)
{
    const [formState, SetFormState] = useState({ username: "", password: "" });
    const [Login, { error }] = useMutation(LOGIN);

    async function HandleFormSubmit(event: React.FormEvent<HTMLButtonElement>)
    {
        event.preventDefault();

        try 
        {
            const mutationResponse = await Login
            ({
                variables: 
                { 
                    username: formState.username, 
                    password: formState.password 
                },
            });
            const token = mutationResponse.data.Login.token;
            Authentication.Login(token);
            props.HandleLoggedIn(true);
        } 
        catch (error) { console.log(error); }
    }

    function HandleChange(event: React.ChangeEvent<HTMLInputElement>)
    {
        if (event)
        {
            const { name, value } = event.target;
            
            SetFormState
            ({
                ...formState,
                [name]: value,
            });
        }
    };

    const width: number = GetWidth();
    const leftPosition: number = GetLeftPosition(width);
    
    const pageTitleStyle =
    {
        width: width,
        left: leftPosition,
        top: GetTopPosition(0)
    }

    const pageButtonStyle =
    {
        width: width * 0.25,
        left: GetLeftPosition(width * 0.25),
        top: GetTopPosition(3)
    }

    return (
        <div>
            <h2 style={pageTitleStyle} className="fixedPosition formTitle centeredText">Sign In</h2>

            <Input name="username" width={width} leftPosition={leftPosition} topPosition={GetTopPosition(1)} HandleChange={HandleChange}/>
            <Input name="password" width={width} leftPosition={leftPosition} topPosition={GetTopPosition(2)} HandleChange={HandleChange}/>
            
            <button 
                style={pageButtonStyle}
                className={`fixedPosition button`}
                onClick={(event) => HandleFormSubmit(event)}
                >
                <div>Submit</div>
            </button>
        </div>
    );
}