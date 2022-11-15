import React from 'react';

interface props
{
    name: string,
    width: number,
    leftPosition: number,
    topPosition: number,
    HandleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}	

export default function Input(props: props)
{

    const inputStyle = 
    {
        width: props.width,
        top: props.topPosition,
        left: props.leftPosition,
    }
    
    return (
        <div className="field">
            <p className="control">
                <input style={inputStyle} className="input fixedPosition centeredText"
                    placeholder={props.name}
                    name={props.name}
                    type={props.name}
                    id={props.name}
                    onChange={(event) => props.HandleChange(event)}
                />
            </p>
        </div>
    );
}