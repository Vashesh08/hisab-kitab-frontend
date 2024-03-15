/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect } from "react";
import {
  Divider,
  Table,
  Button,
  Modal,
} from "antd";
import { fetchMasterStockList, deleteMasterStockList } from "../api/masterStock.js";
import  ModelAdd from "../components/ModelAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import { DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

const MasterStock = () => {
  const [page] = useState(1);
  const [itemsPerPage] = useState(100); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  async function updateRows (dataType){

    setIsLoading(true);
    const token = localStorage.getItem("token");
    // send request to check authenticated
    const data = [];
    const deleted_data = [];
    // console.log("data", data)

    const docs = await fetchMasterStockList(page, itemsPerPage, token);
    console.log(docs);
    for (let eachEntry in docs) {
      const dateEntry = docs[eachEntry].date;
      const curDateEntry = new Date(dateEntry);
      
      const day = curDateEntry.getDate().toString().padStart(2, '0');
      // const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const month = curDateEntry.toLocaleString('en-US', {month: 'short'})
      const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
      const formattedDate = `${day}-${month}-${year}`;

      docs[eachEntry].date = formattedDate;
      if (docs[eachEntry].is_deleted_flag){
        deleted_data.push(docs[eachEntry]);
      }
      else{
        data.push(docs[eachEntry]);
      }
    }
    if (dataType === "all"){
      docs.reverse();
      setRows(docs);
    }
    else if (dataType === "valid"){
      data.reverse();
      setRows(data);
    }
    else{
      deleted_data.reverse();
      setRows(deleted_data);
    }
    setIsLoading(false);
  };

    useEffect(() => {
        (async () => {

        setIsLoading(true);
            const token = localStorage.getItem("token");
        // send request to check authenticated
        const data = [];
        const deleted_data = [];
        // console.log("data", data)

        const docs = await fetchMasterStockList(page, itemsPerPage, token);
        console.log(docs);
        for (let eachEntry in docs) {
          const dateEntry = docs[eachEntry].date;
          const curDateEntry = new Date(dateEntry);
          
          const day = curDateEntry.getDate().toString().padStart(2, '0');
          // const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const month = curDateEntry.toLocaleString('en-US', {month: 'short'})
          const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year
          const formattedDate = `${day}-${month}-${year}`;

          docs[eachEntry].date = formattedDate;
          if (docs[eachEntry].is_deleted_flag){
            deleted_data.push(docs[eachEntry]);
          }
          else{
            data.push(docs[eachEntry]);
          }
        }
        data.reverse();
        setRows(data);
        setIsLoading(false);
    })();
    }, [page, itemsPerPage]);


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const masterStockId = {
      masterstockId: selectedRowKeys
    }
    await deleteMasterStockList(masterStockId, token );

    updateRows("valid");
    setIsLoading(false);
    setSelectedRowKeys([]);
  }
  const handleCancel = () => {
    updateRows("valid");
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: text => (
        <div style={{ minWidth: '65px', maxWidth: '65px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '7%',
    },
    {
      title: "Category",
      dataIndex: "category",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
    },
    {
      title: "Description",
      dataIndex: "description",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '18%',
    },
    {
      title: "Weight",
      dataIndex: "weight",
      render: text => (
        <div style={{ minWidth: '65px', maxWidth: '65', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '8%',
    },
    {
      title: "Purity",
      dataIndex: "purity",
      render: text => (
        <div style={{minWidth: '65px', maxWidth: '65',  overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '8%',
    },
    {
      title: "Receive Qty",
      dataIndex: "receive22k",
      render: text => (
        <div style={{minWidth: '100px', maxWidth: '100px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
    },
    {
      title: "Issue Qty",
      dataIndex: "issue22k",
      render: text => (
        <div style={{ minWidth: '100px', maxWidth: '100px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
    },
    {
      title: "Issuer Name",
      dataIndex: "issuer",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
    },
    {
      title: "Receiver Name",
      dataIndex: "receiver",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
    },
  ];

  const onSelectChange = (newSelectedRowKeys) => {
    console.log('selectedRowKeys changed: ', newSelectedRowKeys);
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.is_deleted_flag === true,
    }),
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_NONE,
      {
        key: 'deleted',
        text: 'Show Only Deleted Entries',
        onSelect: ()=> {updateRows("deleted")},
        
      },
      {
        key: 'all_entries',
        text: 'Show All Entries',
        onSelect: ()=> {updateRows("all")},
        
      },
      {
        key: 'valid',
        text: 'Show Valid Entries',
        onSelect: ()=> {updateRows("valid")},
      }
    ],
  };

  const getRowClassName = (record) => {
    return record.is_deleted_flag ? 'striked-row' : '';
  };

  if (isLoading){
    return <Loading />
  }

  return (
    <div>
      
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        

        {/* <Button type="primary" style={{ background: "green", borderColor: "yellow" }} onClick={showModal}>
          Add Item
        </Button> */}
        <PlusCircleOutlined style={{ fontSize: '200%', color:"#1f2937"}} onClick={showModal} />
        <div style={{ fontSize: '175%', fontWeight: "bolder" }}>Master Stock</div>
        <DeleteOutlined style={{ fontSize: '200%', color:"#1f2937"}} onClick={deleteModal} />
        {/* <Button type="primary" style={{ background: "red", borderColor: "yellow" }} onClick={deleteModal} >Delete</Button> */}
      </div>
      <Modal
        title="Add Item"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <ModelAdd
          handleOk={handleCancel}
          />
      </Modal>

      <Divider />
      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowClassName={getRowClassName}
        dataSource={rows}
        rowKey="_id"
        scroll={{ x: 'calc(100vh - 4em)' }}
      />
      <Divider />
    </div>
  );
};

export default MasterStock;
