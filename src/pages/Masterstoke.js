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

const MasterStock = () => {
  const [page] = useState(1);
  const [itemsPerPage] = useState(25);
  const [rows, setRows] = useState([]);

    useEffect(() => {
        (async () => {
            const token = localStorage.getItem("token");
        // send request to check authenticated
        // console.log(localStorage);
        // console.log("dashboaord", token);
        const docs = await fetchMasterStockList(page, itemsPerPage, token);
        console.log("Vashesh", docs);
        for (let eachEntry in docs) {
          console.log("Vash", docs[eachEntry].date, typeof docs[eachEntry].date);
          const dateEntry = docs[eachEntry].date;
          const curDateEntry = new Date(dateEntry);
          
          const day = curDateEntry.getDate().toString().padStart(2, '0');
          const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
          const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
          const formattedDate = `${day}/${month}/${year}`;

          console.log(formattedDate);
          docs[eachEntry].date = formattedDate;
        }
        setRows(docs);

    })();
    }, [page, itemsPerPage]);


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const deleteModal = async () => {
    const token = localStorage.getItem("token");
    const masterStockId = {
      masterstockId: selectedRowKeys
    }
    await deleteMasterStockList(masterStockId, token );

  }
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
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
    },
    {
      title: "Weight",
      dataIndex: "weight",
    },
    {
      title: "Purity",
      dataIndex: "purity",
    },
    {
      title: "Issue 22k",
      dataIndex: "issue22k",
    },
    {
      title: "Receive 22k",
      dataIndex: "receive22k",
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
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
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
    ],
  };

  // const layout = {
  //   labelCol: {
  //     span: 8,
  //   },
  //   wrapperCol: {
  //     span: 16,
  //   },
  // };
  const getRowClassName = (record) => {
    return record.is_deleted_flag ? 'striked-row' : '';
  };

  return (
    <div>
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

      />
      <Divider />
    </div>
  );
};

export default MasterStock;
