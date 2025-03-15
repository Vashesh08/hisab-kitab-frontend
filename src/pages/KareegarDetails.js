import React, { useEffect, useState } from "react";
import "../style/Cards.css"
import { Button, Card, Col, Row, Modal } from "antd";
import { getKareegarData, deleteKareegarData, updateKareegarBalance } from "../api/kareegarDetail.js";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import Loading from "../components/Loading.js";
import AddKareegar from "../components/AddKareegar.js";
import { deleteLossAcctList, fetchLossAcctList } from "../api/LossAcct.js";
import { deleteKareegarBookList, fetchKareegarBookList } from "../api/kareegarBook.js";

export default function KareegarDetails({ setKareegarId, setKareegarDetailsPage, setKareegarName }) {
    const { Meta } = Card;
    const [page] = useState(1);
    const [itemsPerPage] = useState(100000000); 
    const [allKareegarDetails, setAllKareegarDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedKareegarId, setSelectedKareegarId] = useState(null);
    const [selectedKareegarName, setSelectedKareegarName] = useState(null);
  
    async function updateData (){
        setIsLoading(true);

        const token = localStorage.getItem("token");
        const data = await getKareegarData(1, 100000000, token);
        const filteredData = data.filter(item => item.is_deleted_flag === false && item.is_hidden_flag === false);
        setAllKareegarDetails(filteredData);

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
        const docs = await fetchKareegarBookList(1, 100000000, selectedKareegarId, token);
        const data =  await getKareegarData(1, 100000000, token);
        const kareegarData = data.find(item => item._id === selectedKareegarId);
        let balance = parseFloat(kareegarData["balance"]);
        let beads_balance = parseFloat(kareegarData["beads_balance"]);
        // console.log(kareegarData, balance);
        
        const lossAcctData = await fetchLossAcctList(1, 100000000, token);
        const lossIds = [];
        const selectedIds = [];

        for (let i = 0; i < docs.length; i++) {
            if (!docs[i]["is_deleted_flag"]){
            //   console.log("row", docs[i]);
                selectedIds.push(docs[i]["_id"]);
              if (docs[i]["type"] === "Issue"){
                  balance -= parseFloat(docs[i]["issue_wt"]);
                  if (docs[i]["beads_issue_wt"] !== "" && !isNaN(docs[i]["beads_issue_wt"])){
                    beads_balance -= parseFloat(docs[i]["beads_issue_wt"]);
                  }
              }
              else{
                balance += parseFloat(docs[i]["recv_wt"]);
                if (docs[i]["beads_recv_wt"] !== "" && !isNaN(docs[i]["beads_recv_wt"])){
                  beads_balance += parseFloat(docs[i]["beads_recv_wt"]);
                }
              }
              if (docs[i]["loss_wt"] !== "" && !isNaN(docs[i]["loss_wt"])) {
                balance += parseFloat(docs[i]["loss_wt"]);
                const matchedData = lossAcctData.find(row => row.transactionId === docs[i]["_id"] && row.type === "Kareegar")
                if (matchedData){
                  lossIds.push(matchedData._id);  
                }
              }
              //console.log("balance", balance, beads_balance);
            }
          }
          //console.log("lossIds",lossIds);
        
          const deleteFromLossAcct = {
            lossId: lossIds,
          }
          await deleteLossAcctList(deleteFromLossAcct, token);
      
          const kareegarBalanceData = {
            '_id': kareegarDataId,
            "balance": balance.toFixed(2),
            "beads_balance": beads_balance.toFixed(2)
          }

          await updateKareegarBalance(kareegarBalanceData, token);

          const kareegarBookId = {
            "kareegarBookId": selectedIds
          }
          
          // console.log(meltingBookId);
          await deleteKareegarBookList(kareegarBookId, token);
      
      
      
        // console.log(kareegarId, "Delete ICon clicked");
        const kareegar_data = await getKareegarData(page, itemsPerPage, token);
        const filteredData = kareegar_data.filter(item => item.is_deleted_flag === false && item.is_hidden_flag === false);

        const allKareegarIds = filteredData.map(item => item._id);
        let kareegarDetails = [];

        for (const item of filteredData) {
          
          const allData = await fetchKareegarBookList(page, itemsPerPage, item._id, token);
          
          let currentKareegarData = [];

          for (let eachEntry in allData) {
            // console.log(allData[eachEntry].is_editable_flag);
            if (allData[eachEntry].is_deleted_flag === false && (allData[eachEntry].is_editable_flag === true)){
              currentKareegarData.push(allData[eachEntry]);
            }
          }

          // console.log(allData, "currentKareegarData", currentKareegarData);

          let currentKareegarIssueQty = 0.0;
          let currentKareegarRecvQty = 0.0;
          let currentKareegarLossQty = 0.0;
          let currentKareegarBeadsIssueQty = 0.0;
          let currentKareegarBeadsRecvQty = 0.0;
          currentKareegarData.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
            // console.log(weight24k, receive22k, issue22k, loss22k);
            if (isNaN(parseFloat(issue_wt))) {
              issue_wt = 0.0; // Set it to zero if it's NaN
            } 
            if (isNaN(parseFloat(recv_wt))) {
              recv_wt = 0.0; // Set it to zero if it's NaN
            } 
            if (isNaN(parseFloat(loss_wt))){
              loss_wt = 0.0; // Set it to zero if it's NaN
            }
            if (isNaN(parseFloat(beads_issue_wt))){
              beads_issue_wt = 0.0;  // Set it to zero if it's NaN
            }
            if (isNaN(parseFloat(beads_recv_wt))){
              beads_recv_wt = 0.0; // Set it to zero if it's NaN
            }
            currentKareegarIssueQty += parseFloat(issue_wt);
            currentKareegarRecvQty += parseFloat(recv_wt);
            currentKareegarLossQty += parseFloat(loss_wt);
            currentKareegarBeadsIssueQty += parseFloat(beads_issue_wt);
            currentKareegarBeadsRecvQty += parseFloat(beads_recv_wt);
          });


          kareegarDetails.push({
            "_id": item._id,
            "name": item.name, 
            "category": item.category,
            "balance": parseFloat(currentKareegarIssueQty - currentKareegarRecvQty - currentKareegarLossQty).toFixed(2),
            "bead balance": parseFloat(currentKareegarBeadsIssueQty - currentKareegarBeadsRecvQty).toFixed(2)
          });

        };
        
        setAllKareegarDetails(kareegarDetails);
       
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
            const data = await getKareegarData(1, 100000000, token);
            const filteredData = data.filter(item => item.is_deleted_flag === false && item.is_hidden_flag === false);
            // console.log(data, filteredData)
            const allKareegarIds = filteredData.map(item => item._id);
            let kareegarDetails = [];

            for (const item of filteredData) {
              
              const allData = await fetchKareegarBookList(page, itemsPerPage, item._id, token);
              
              let currentKareegarData = [];

              for (let eachEntry in allData) {
                if (allData[eachEntry].is_deleted_flag === false && (allData[eachEntry].is_editable_flag === true)){
                  currentKareegarData.push(allData[eachEntry]);
                }
              }
              // console.log("currentKareegarData",currentKareegarData, item._id,item.name,item.category);

              // console.log(allData, "currentKareegarData", currentKareegarData);

              let currentKareegarIssueQty = 0.0;
              let currentKareegarRecvQty = 0.0;
              let currentKareegarLossQty = 0.0;
              let currentKareegarBeadsIssueQty = 0.0;
              let currentKareegarBeadsRecvQty = 0.0;
              currentKareegarData.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
                // console.log(weight24k, receive22k, issue22k, loss22k);
                if (isNaN(parseFloat(issue_wt))) {
                  issue_wt = 0.0; // Set it to zero if it's NaN
                } 
                if (isNaN(parseFloat(recv_wt))) {
                  recv_wt = 0.0; // Set it to zero if it's NaN
                } 
                if (isNaN(parseFloat(loss_wt))){
                  loss_wt = 0.0; // Set it to zero if it's NaN
                }
                if (isNaN(parseFloat(beads_issue_wt))){
                  beads_issue_wt = 0.0;  // Set it to zero if it's NaN
                }
                if (isNaN(parseFloat(beads_recv_wt))){
                  beads_recv_wt = 0.0;  // Set it to zero if it's NaN
                }
                currentKareegarIssueQty += parseFloat(issue_wt);
                currentKareegarRecvQty += parseFloat(recv_wt);
                currentKareegarLossQty += parseFloat(loss_wt);
                currentKareegarBeadsIssueQty += parseFloat(beads_issue_wt);
                currentKareegarBeadsRecvQty += parseFloat(beads_recv_wt);
              });


              kareegarDetails.push({
                "_id": item._id,
                "name": item.name, 
                "category": item.category,
                "balance": parseFloat(currentKareegarIssueQty - currentKareegarRecvQty - currentKareegarLossQty).toFixed(2),
                "beads_balance": parseFloat(currentKareegarBeadsIssueQty - currentKareegarBeadsRecvQty).toFixed(2)
              });
              // console.log(parseFloat(currentKareegarIssueQty - currentKareegarRecvQty - currentKareegarLossQty).toFixed(2));

              //console.log(parseFloat(currentKareegarBeadsIssueQty - currentKareegarBeadsRecvQty).toFixed(2));
            };
            
            setAllKareegarDetails(kareegarDetails);
            
            setIsLoading(false);
        })();
    }, []);
        
    if (isLoading){
        return <Loading />
      }
    const renderCards = () => {
        return allKareegarDetails.map((i) => (
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
                            <p style={{ whiteSpace: 'nowrap', overflow: 'auto' }}>
                            Beads Balance: {i.beads_balance}
                            </p>
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