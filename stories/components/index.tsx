import styled from "styled-components";

export const StatusBar =  styled.div`
    width: 500px;
    background: linear-gradient(to bottom, #f6f7f9 0%, #ebedf0 100%);
    box-shadow: -1px -1px 1px #cecece;
    padding: 10px 15px;
`;

export const ConnectionStatus = styled.div`
    background: ${(props: any) => props.online ? "#7ecc30" : "#cc3030"};
    display: inline-block;
    padding: 1px 4px;
    color: #fff;
    font-weight: bold;
    font-family: monospace;
    border-radius: 10px;
    margin-right: 10px;
` as any;

export const ConnectButton = styled.button`
    box-shadow: inset 0px 1px 3px 0px #b8d490;
    background: linear-gradient(to bottom,#84b359 5%,#639940 100%);
    background-color: #90b359;
    border-radius: 27px;
    border: 1px solid #688f29;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 12px;
    font-weight: bold;
    padding: 3px 14px;
    -webkit-text-decoration: none;
    text-decoration: none;
    text-shadow: 0px -1px 0px #508a3d;
    margin-right: 10px;
    &:hover{
        background:linear-gradient(to bottom, #639940 5%, #84b359 100%);
	    background-color:#408c99;
    }
    &:active{
        position:relative;
	    top:1px;
    }
`;
export const DisConnectButton = styled.button`
    box-shadow: inset 0px 1px 3px 0px #d49090;
    background: linear-gradient(to bottom,#b91e1e 5%,#d80404 100%);
    background-color: #b35959;
    border-radius: 27px;
    border: 1px solid #8f2929;
    display: inline-block;
    cursor: pointer;
    color: #ffffff;
    font-family: Arial;
    font-size: 12px;
    font-weight: bold;
    padding: 3px 14px;
    text-decoration: none;
    text-shadow: 0px -1px 0px #632222;
    margin-right: 10px;
    &:hover{
        background:linear-gradient(to bottom, #d80404 5%, #b91e1e 100%);
	    background-color:#408c99;
    }
    &:active{
        position:relative;
	    top:1px;
    }
`;

export const TextArea = styled.textarea `
    color: #fff;
    width: 522px;
    min-height: 250px;
    height: auto;
    float: left;
    border: 1px solid #e2e2e2;
    background: #464646;
`;

export const Handlers = styled.div `
    float: left;
    width: 527px;
    font-family: monospace;
`;

export const HTitle = styled.p`
    margin: 0;
    float: left;
    width: 527px;
    padding: 5px 0px;
    text-align: center;
    background: #03436b;
    color: #fff;
    font-weight: bold;
`;

export const HItem = styled.p`
    float: left;
    width: 517px;
    padding: 5PX;
    margin: 0;
    border-bottom: 1px solid #d4d4d4;
`;
