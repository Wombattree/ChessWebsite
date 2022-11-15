import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utilities/mutations';
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

export default function SignUp(props: Props)
{
    const [formState, SetFormState] = useState({ username: "", email: "", password: "" });
    const [AddUser] = useMutation(ADD_USER);

    async function HandleFormSubmit(event: React.FormEvent<HTMLButtonElement>)
    {
        event.preventDefault();

        const mutationResponse = await AddUser
        ({
            variables: 
            {
                username: formState.username,
                email: formState.email,
                password: formState.password,
            },
        });

        const token = mutationResponse.data.AddUser.token;
        Authentication.Login(token);
        props.HandleLoggedIn(true);
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
        top: GetTopPosition(4)
    }

    return (
        <div>
            <h2 style={pageTitleStyle} className="fixedPosition formTitle centeredText">Sign Up</h2>
            {/* <form onSubmit={(event) => HandleFormSubmit(event)}> */}

            <Input name="username" width={width} leftPosition={leftPosition} topPosition={GetTopPosition(1)} HandleChange={HandleChange}/>
            <Input name="email" width={width} leftPosition={leftPosition} topPosition={GetTopPosition(2)} HandleChange={HandleChange}/>
            <Input name="password" width={width} leftPosition={leftPosition} topPosition={GetTopPosition(3)} HandleChange={HandleChange}/>
            
            <button 
                style={pageButtonStyle}
                className={`fixedPosition button`}
                onClick={(event) => HandleFormSubmit(event)}
                >
                <div>Submit</div>
            </button>

            {/* </form> */}
        </div>
    );
}