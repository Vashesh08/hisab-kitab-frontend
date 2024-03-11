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

const MeltingStock = () => {
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
    for (let eachEntry in docs) {
      const dateEntry = docs[eachEntry].date;
      const curDateEntry = new Date(dateEntry);
      
      const day = curDateEntry.getDate().toString().padStart(2, '0');
      const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
      const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
      const formattedDate = `${day}/${month}/${year}`;

      docs[eachEntry].date = formattedDate;
      if (docs[eachEntry].is_deleted_flag){
        deleted_data.push(docs[eachEntry]);
      }
      else{
        data.push(docs[eachEntry]);
      }
    }
    if (dataType === "all"){
    setRows(docs);
    }
    else if (dataType === "valid"){
      setRows(data);
    }
    else{
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
        for (let eachEntry in docs) {
          const dateEntry = docs[eachEntry].date;
          const curDateEntry = new Date(dateEntry);
          
          const day = curDateEntry.getDate().toString().padStart(2, '0');
          const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
          const formattedDate = `${day}/${month}/${year}`;

          docs[eachEntry].date = formattedDate;
          if (docs[eachEntry].is_deleted_flag){
            deleted_data.push(docs[eachEntry]);
          }
          else{
            data.push(docs[eachEntry]);
          }
        }
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
  }
  const handleCancel = () => {
    setIsModalOpen(false);
    updateRows("valid");
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Category",
      dataIndex: "category",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Weight (in grams)",
      dataIndex: "weight",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Purity",
      dataIndex: "purity",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Issue 22k",
      dataIndex: "issue22k",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Receive 22k",
      dataIndex: "receive22k",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
    },
  ];

  // const rowSelection = {
  //   onChange: (selectedRowKeys, selectedRows) => {
  //     console.log(
  //       `selectedRowKeys: ${selectedRowKeys}`,
  //       "selectedRows: ",
  //       selectedRows
  //     );
  //   },
  //   getCheckboxProps: (record) => ({
  //     disabled: record.name === "Disabled User",
  //     name: record.name,
  //   }),
  // };
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
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: 'deleted',
        text: 'Show Only Deleted Entries',
        onSelect: ()=> {updateRows("deleted")},
        // async (changableRowKeys) => {
        //   const token = localStorage.getItem("token");
        //   // send request to check authenticated
        //   const data = [];
        //   const deleted_data = [];
        //   // console.log("data", data)
  
        //   const docs = await fetchMasterStockList(page, itemsPerPage, token);
        //   for (let eachEntry in docs) {
        //     const dateEntry = docs[eachEntry].date;
        //     const curDateEntry = new Date(dateEntry);
            
        //     const day = curDateEntry.getDate().toString().padStart(2, '0');
        //     const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        //     const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
        //     const formattedDate = `${day}/${month}/${year}`;
  
        //     docs[eachEntry].date = formattedDate;
        //     if (docs[eachEntry].is_deleted_flag){
        //       deleted_data.push(docs[eachEntry]);
        //     }
        //     else{
        //       data.push(docs[eachEntry]);
        //     }
        //   }
        //   setRows(deleted_data);
        // },
      },
      {
        key: 'all_entries',
        text: 'Show All Entries',
        onSelect: ()=> {updateRows("all")},
        // onSelect: async () => {
        //   const token = localStorage.getItem("token");
        //   // send request to check authenticated
        //   const data = [];
        //   const deleted_data = [];
        //   // console.log("data", data)
  
        //   const docs = await fetchMasterStockList(page, itemsPerPage, token);
        //   for (let eachEntry in docs) {
        //     const dateEntry = docs[eachEntry].date;
        //     const curDateEntry = new Date(dateEntry);
            
        //     const day = curDateEntry.getDate().toString().padStart(2, '0');
        //     const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        //     const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
        //     const formattedDate = `${day}/${month}/${year}`;
  
        //     docs[eachEntry].date = formattedDate;
        //     if (docs[eachEntry].is_deleted_flag){
        //       deleted_data.push(docs[eachEntry]);
        //     }
        //     else{
        //       data.push(docs[eachEntry]);
        //     }
        //   }
        //   setRows(docs);
        // },
      },
      {
        key: 'valid',
        text: 'Show Valid Entries',
        onSelect: ()=> {updateRows("valid")},
        // onSelect: async (changableRowKeys) => {
        //   const token = localStorage.getItem("token");
        //   // send request to check authenticated
        //   const data = [];
        //   const deleted_data = [];
        //   // console.log("data", data)
  
        //   const docs = await fetchMasterStockList(page, itemsPerPage, token);
        //   for (let eachEntry in docs) {
        //     const dateEntry = docs[eachEntry].date;
        //     const curDateEntry = new Date(dateEntry);
            
        //     const day = curDateEntry.getDate().toString().padStart(2, '0');
        //     const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
        //     const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
        //     const formattedDate = `${day}/${month}/${year}`;
  
        //     docs[eachEntry].date = formattedDate;
        //     if (docs[eachEntry].is_deleted_flag){
        //       deleted_data.push(docs[eachEntry]);
        //     }
        //     else{
        //       data.push(docs[eachEntry]);
        //     }
        //   }
        //   setRows(data);
        // },
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
        <Button type="primary" style={{ background: "green", borderColor: "yellow" }} onClick={showModal}>
          Add Item
        </Button>
        <div style={{ padding: "4px", fontWeight: "bolder" }}>Melting Stock</div>
        <Button type="primary" style={{ background: "red", borderColor: "yellow" }} onClick={deleteModal} >Delete</Button>
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

export default MeltingStock;
