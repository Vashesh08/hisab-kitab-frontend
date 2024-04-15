import React, { useEffect, useState } from "react";
import "../style/Cards.css"
import { Avatar, Card, Col, Row, Modal } from "antd";
import { getKareegarData } from "../api/kareegarDetail.js";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Loading from "../components/Loading.js";
import KareegarAdd from "../components/KareegarAdd.js";

export default function KareegarDetails({ setKareegarId, setKareegarDetailsPage }) {
    const { Meta } = Card;
    const [allKareegarDetails, setAllKareegarDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);

    async function updateData (){
        setIsLoading(true);

        const token = localStorage.getItem("token");
        setAllKareegarDetails(await getKareegarData(token));

        setIsLoading(false);
    }

    const showModal = () => {
        setIsModalOpen(true);
      };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    
    const handleUpdateClose = () => {
        updateData("valid");
        setIsModalOpen(false);
    }
    
    const changePage = (kareegar_id) => {
        // console.log(kareegar_id);
        setKareegarId(kareegar_id);
        setKareegarDetailsPage(false);
      }

    const deleteIcon = () => {
        console.log("Delete ICon clicked")
    }

    useEffect(() => {
        (async () => {
            setIsLoading(true);
            const token = localStorage.getItem("token");
            setAllKareegarDetails(await getKareegarData(token));
            // console.log(allKareegarDetails);
            setIsLoading(false);
        })();
    }, []);
        
    if (isLoading){
        return <Loading />
      }
    const renderCards = () => {
        return allKareegarDetails.map((i) => (
            
        <div className='hello float-left w-1/4 relative p-5 text-center' onClick={() => changePage(i.name)}>
            <Row gutter={16}>
            <Col className="hover:text-white" xs={24} xl={24}>
                <Card 
                    title={[<div className="fontsize-header">{i.name}</div>]} 
                    hoverable 
                    className="hoverable border-gray-800 hover:text-white hover:bg-gray-800"
                    // actions={[
                    //     <DeleteOutlined key="delete" onClick={event => { event.stopPropagation(); deleteIcon()}} style={{ fontSize:"200%" }} />
                    // ]}
                    >
                <Meta
                    // avatar={<Avatar src="profilepic.png" size={64} />}
                    title={[<div className="fontsize">{i.category}</div>]}
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
    <div className="flex flex-wrap">

        {renderCards()}
        <div className='hello float-left w-1/4 relative p-5 text-center'>
            <Row gutter={16}>
            <Col className="hover:text-white" xs={24} xl={24}>
                <Card 
                    title={[<div className="fontsize-header">Add Kareegar</div>]} 
                    hoverable 
                    className="hoverable border-gray-800 hover:text-white hover:bg-gray-800"
                    onClick={showModal}
                >
                <Meta
                    // avatar={<PlusOutlined height={64}/>}
                    // title={[<div className="fontsize"></div>]}
                    description={[
                        // <div className="data" height="100%">
                            <PlusOutlined className="data text-gray-800" style={{height: "64px", fontSize: "500%"}}/>
                            // </div>
                    ]} 
                />
                </Card>
            </Col>
            </Row>
            
            <br />
        </div>
    
    <Modal
        title="Add Kareegar Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
    >
      <KareegarAdd
          handleOk={handleUpdateClose}
          />
    </Modal>

    </div>
    );
    }