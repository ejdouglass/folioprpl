import styled from 'styled-components';

const Card = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    box-sizing: border-box;
    max-width: 400px;
    margin: 0 auto;
    padding: 0 2rem;
`;

const Form = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const Input = styled.input`
    padding: 1rem;
    border: 1px solid #888;
    margin-bottom: 1rem;
    font-size: 0.8rem;
`;

const HalfInput = styled.input`
    padding: 1rem;
    border: 1px solid #888;
    margin-bottom: 1rem;
    font-size: 0.8rem;
    width: 47%;
`;

const Button = styled.button`
    background: linear-gradient(to bottom, #0AF, #07D);
    border-color: #148;
    border-radius: 3px;
    padding: 1rem;
    color: white;
    font-weight: 700;
    width: 100%;
    margin-bottom: 1rem;
    font-size: 0.8rem;
`;

const LogoBlock = styled.div`
    height: 25vmin;
    width: 25vmin;
    margin-top: 1rem;
    margin-bottom: 1rem;
    background-color: green;
    transition: background-color 2s;
    :hover {
        background-color: #0A4;
    }
`;

const Error = styled.div`
    background-color: red;
`;

export { Card, Form, Input, HalfInput, Button, LogoBlock, Error };