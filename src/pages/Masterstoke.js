/* eslint-disable no-template-curly-in-string */
import React, { useState, useEffect } from "react";
import {
  Divider,
  Table,
  Button,
  Modal,
} from "antd";
import { fetchMasterStockList } from "../api/masterStock.js";
import  ModelAdd from "../components/ModelAdd.js"

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
        setRows(docs);

    })();
    }, [page, itemsPerPage]);




  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
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
  const data = [
    {
      date: "03/02/2024",
      description: "agag",
      category: "gaga",
      weight: "100",
      purity: "99.5",
      issue22k: "gaga",
      receive22k: "gagag",
      issuer: "gagag",
      receiver: "iuioga",
    },
    {
      date: "03/02/2024",
      description: "agag",
      category: "gaga",
      weight: "100",
      purity: "99.5",
      issue22k: "gaga",
      receive22k: "gagag",
      issuer: "gagag",
      receiver: "iuioga",
    },
  ];

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        "selectedRows: ",
        selectedRows
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === "Disabled User",
      name: record.name,
    }),
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Button type="primary" style={{ background: "green", borderColor: "yellow" }} onClick={showModal}>
          Add Item
        </Button>
        <Button type="primary" style={{ background: "red", borderColor: "yellow" }} >Delete</Button>
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
        rowSelection={{
          type: "checkbox",
          ...rowSelection,
        }}
        columns={columns}
        dataSource={rows}
      />
      <Divider />
    </div>
  );
};

export default MasterStock;
