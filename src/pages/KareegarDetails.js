import React from "react";
import "../style/Cards.css"
import { Avatar, Card, Col, Row } from "antd";

export default function KareegarDetails({ setKareegarId, setKareegarDetailsPage }) {
    const { Meta } = Card;

    const changePage = (kareegar_id) => {
        // console.log(kareegar_id);
        setKareegarId(kareegar_id);
        setKareegarDetailsPage(false);
      }

    const customCard = [
        {
        registeredObjectID: "1",
        },
        {
        registeredObjectID: "2",
        },
        {
        registeredObjectID: "3",
        },
        {
        registeredObjectID: "4",
        },
        {
        registeredObjectID: "5",
        },
        {
        registeredObjectID: "6",
        }
    ];
        
    const renderCards = () => {
        return customCard.map((i) => (
            
        <div className='hello float-left w-1/3 relative p-5 text-center' key={i.registeredObjectID} onClick={() => changePage(i.registeredObjectID)}>
            <Row gutter={16}>
            <Col className="hover:text-white" xs={24} xl={24}>
                <Card 
                    title={[<div className="fontsize-header">Process Name</div>]} 
                    hoverable 
                    className="hoverable border-gray-800 hover:text-white hover:bg-gray-800"
                    >
                <Meta
                    avatar={<Avatar src="profilepic.png" size={64} />}
                    title={[<div className="fontsize">{"Kareegar " + i.registeredObjectID + " Name"}</div>]}
                    description={[
                        <div className="data">
                            <p>Current Balance</p>
                         </div>
                       ]} />
                </Card>
            </Col>
            </Row>
            
            <br />
        </div>
        ));
    };

    return (
    <div className="flex flex-wrap justify-between">{renderCards()}</div>
    );
    }