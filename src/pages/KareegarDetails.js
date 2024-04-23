import React, { useEffect, useState } from "react";
import "../style/Cards.css"
import { Button, Avatar, Card, Col, Row, Modal } from "antd";
import { getKareegarData, deleteKareegarData } from "../api/kareegarDetail.js";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Loading from "../components/Loading.js";
import AddKareegar from "../components/AddKareegar.js";

export default function KareegarDetails({ setKareegarId, setKareegarDetailsPage, setKareegarName }) {
    const { Meta } = Card;
    const [allKareegarDetails, setAllKareegarDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedKareegarId, setSelectedKareegarId] = useState(null);
    const [selectedKareegarName, setSelectedKareegarName] = useState(null);
  
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
        setIsDeleteModalOpen(false);
        setSelectedKareegarId(null);
    };
    
    const handleUpdateClose = () => {
        updateData("valid");
        setIsModalOpen(false);
    }
    
    const changePage = (kareegar_id, kareegarName) => {
        // console.log(kareegar_id);
        setKareegarId(kareegar_id);
        setKareegarName(kareegarName);
        setKareegarDetailsPage(false);
      }

    async function deleteIcon(){
        setIsLoading(true);
        const token = localStorage.getItem("token");
        const kareegarDataId = {
            "kareegarIds": selectedKareegarId
        }

        await deleteKareegarData(kareegarDataId, token);
        // console.log(kareegarId, "Delete ICon clicked");
        
        setAllKareegarDetails(await getKareegarData(token));
        
        setIsDeleteModalOpen(false);
        setIsLoading(false);
    }

    const showDeletePopup = (id, name) => {
        setIsDeleteModalOpen(true);
        setSelectedKareegarId(id);
        setSelectedKareegarName(name);
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
            i.is_deleted_flag === false?(
        <div className='hello float-left w-1/4 relative p-5 text-center' onClick={() => changePage(i._id, i.name)}>
            <Row gutter={16}>
            <Col className="hover:text-white" xs={24} xl={24}>
                <Card 
                    title={[<div className="fontsize-header">{i.name}</div>]} 
                    hoverable 
                    className="hoverable border-gray-800 hover:text-white hover:bg-gray-800"
                    actions={[
                        <DeleteOutlined key="delete" onClick={event => { event.stopPropagation(); showDeletePopup(i._id, i.name)}} style={{ fontSize:"200%" }} />
                    ]}
                    >
                <Meta
                    // avatar={<Avatar src="profilepic.png" size={64} />}
                    title={[<div className="fontsize">{i.category}</div>]}
                    description={[
                        <div className="data">
                            <p style={{ whiteSpace: 'nowrap', overflow: 'auto' }}>
                            Current Balance: {i.balance}
                            </p>
                         </div>
                       ]} />
                </Card>
            </Col>
            </Row>
            
            <br />
        </div>
        ): ("")
        ));
    };

    return (
    <div className="flex flex-wrap">

        {renderCards()}
        <div className='hello float-left w-1/4 relative p-5 text-center'>
            <Row gutter={16}>
            <Col className="hover:text-white" xs={24} xl={24}>
                <Card 
                    title={[<div className="fontsize-special" style={{ whiteSpace: 'nowrap', overflow: 'auto' }}>Add Kareegar</div>]} 
                    hoverable 
                    className="hoverable border-gray-800 hover:text-white hover:bg-gray-800"
                    onClick={showModal}
                >
                <Meta
                    // avatar={<PlusOutlined height={64}/>}
                    // title={[<div className="fontsize"></div>]}
                    description={[
                        // <div className="data" height="100%">
                            <PlusOutlined className="data text-gray-800" style={{height: "110px", fontSize: "500%"}}/>
                            // </div>
                    ]} 
                />
                </Card>
            </Col>
            </Row>
            
            <br />
        </div>
    
    <Modal
        title={`Are you sure you want to delete Kareegar ${selectedKareegarName}`}
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex justify-center	">
        <Button className="bg-[#ABD6DFFF] mr-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={deleteIcon}>
            Yes
        </Button>
        <Button className="bg-[#ABD6DFFF] ml-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={handleCancel}>
            No
        </Button>
        </div>
      </Modal>

    <Modal
        title="Add Kareegar Details"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
    >
      <AddKareegar
          handleOk={handleUpdateClose}
          />
    </Modal>

    </div>
    );
    }