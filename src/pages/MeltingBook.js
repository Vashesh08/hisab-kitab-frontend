/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect } from "react";
import {
  Divider,
  Table,
  Button,
  Modal,
} from "antd";
import { fetchMeltingBookList, deleteMeltingBookList } from "../api/meltingBook.js";
import  MeltingBookAdd from "../components/MeltingBookAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import MeltingBookUpdate from "../components/MeltingBookUpdate.js";

const MeltingBook = () => {
  const [page] = useState(1);
  const [itemsPerPage] = useState(100); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState([]);

  async function updateRows (dataType){

    setIsLoading(true);
    const token = localStorage.getItem("token");
    // send request to check authenticated
    const data = [];
    const deleted_data = [];
    // console.log("data", data)

    const docs = await fetchMeltingBookList(page, itemsPerPage, token);
    
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

        const docs = await fetchMeltingBookList(page, itemsPerPage, token);
        // console.log("data", docs);
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showAddPopup = (text) => {
    console.log(text);
    setIsEditModalOpen(true);
    setUpdateData(text)
  };

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const meltingBookId = {
      _id: selectedRowKeys
    }
    console.log(meltingBookId);
    await deleteMeltingBookList(meltingBookId, token);

    updateRows("valid");
    setSelectedRowKeys([]);
    setIsLoading(false);
  }
  const handleCancel = () => {
    updateRows("valid");
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setUpdateData([]);
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
      title: "Description",
      dataIndex: "description",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '38%',
    },
    {
      title: "Weight",
      dataIndex: "weight24k",
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
      title: "Loss Qty",
      dataIndex: "loss22k",
      render: text => (
        <div style={{minWidth: '100px', maxWidth: '100px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      
      render: (text, record, index) => (
        <>
          {text.is_receiver_updated ? (
          <div></div>
        ) : (
          <Button onClick={() => showAddPopup(text)}>
          Add Receive Qty
          </Button>
        )}
        </>
      )
    }
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
      <div style={{ fontWeight: "bolder" }}>Melting Book</div>
      
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        

        <Button type="primary" style={{ background: "green", borderColor: "yellow" }} onClick={showModal}>
          Add Item
        </Button>
        <Button type="primary" style={{ background: "red", borderColor: "yellow" }} onClick={deleteModal} >Delete</Button>
      </div>
      <Modal
        title="Add Item"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <MeltingBookAdd
          handleOk={handleCancel}
          />
      </Modal>

      <Modal
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <MeltingBookUpdate
          handleOk={handleCancel}
          textData={updateData}
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

export default MeltingBook;