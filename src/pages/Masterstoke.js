/* eslint-disable no-template-curly-in-string */
import React, { useRef, useState, useEffect } from "react";
import {
  Divider,
  Table,
  Button,
  Modal,
  Input,
  Space,
} from "antd";

import Highlighter from 'react-highlight-words';
import { fetchMasterStockList, deleteMasterStockList } from "../api/masterStock.js";
import  ModelAdd from "../components/ModelAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import { DeleteOutlined, PlusCircleOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";

const MasterStock = () => {
  const [page] = useState(1);
  const [itemsPerPage] = useState(100); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullData, setFullData] = useState([]);
  const [totalWeightQuantity, setTotalWeight] = useState(10);
  const [totalRecvQuantity, setTotalRecvQty] = useState(20);
  const [totalIssueQuantity, setTotalIssueQty] = useState(30);

  const getFormattedDate = (date) => {
    const dateEntry = date;
    const curDateEntry = new Date(dateEntry);
    
    const day = curDateEntry.getDate().toString().padStart(2, '0');
    // const month = (curDateEntry.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const month = curDateEntry.toLocaleString('en-US', {month: 'short'})
    const year = curDateEntry.getFullYear().toString().slice(-2); // Get the last two digits of the year          
    const formattedDate = `${day}-${month}-${year}`;

    return formattedDate
  }
  
  async function updateRows (dataType){

    setIsLoading(true);
    const token = localStorage.getItem("token");
    // send request to check authenticated
    const data = [];
    const deleted_data = [];
    // console.log("data", data)

    const docs = await fetchMasterStockList(page, itemsPerPage, token);
    // console.log(docs);
    setFullData(docs);
    for (let eachEntry in docs) {
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
    

    let totalWeight = 0;
    let totalRecvQty = 0;
    let totalIssueQty = 0;
    data.forEach(({ weight, receive22k, issue22k }) => {
      if (isNaN(receive22k)) {
        receive22k = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(issue22k)) {
        issue22k = 0; // Set it to zero if it's NaN
      } 
      totalWeight += weight;
      totalRecvQty += receive22k;
      totalIssueQty += issue22k;
    });
    setTotalWeight(totalWeight.toFixed(3));
    setTotalRecvQty(totalRecvQty.toFixed(3));
    setTotalIssueQty(totalIssueQty.toFixed(3));

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
        setFullData(docs);
        // console.log(docs);
        for (let eachEntry in docs) {
          if (docs[eachEntry].is_deleted_flag){
            deleted_data.push(docs[eachEntry]);
          }
          else{
            data.push(docs[eachEntry]);
          }
        }
        data.reverse();
        setRows(data);
        
        // let totalWeight = 0;
        // let totalRecvQty = 0;
        // let totalIssueQty = 0;
        // data.forEach(({ weight, receive22k, issue22k }) => {
        //   if (isNaN(receive22k)) {
        //     receive22k = 0; // Set it to zero if it's NaN
        //   } 
        //   if (isNaN(issue22k)) {
        //     issue22k = 0; // Set it to zero if it's NaN
        //   } 
        //   totalWeight += weight;
        //   totalRecvQty += receive22k;
        //   totalIssueQty += issue22k;
        // });
        // setTotalWeight(totalWeight.toFixed(3));
        // setTotalRecvQty(totalRecvQty.toFixed(3));
        // setTotalIssueQty(totalIssueQty.toFixed(3));
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


  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex, close) => {
    console.log(selectedKeys, confirm, dataIndex)

    // updateRows("valid");
    const array = [];

    fullData.forEach(function (user){
      if (user[dataIndex]){
        if (user[dataIndex].toString().toLowerCase().includes(selectedKeys[0])){
          array.push(user)
        }
    }
    });
    setRows(array);
    // confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    close()
  };
  const handleReset = (clearFilters, close) => {
    clearFilters();
    updateRows("valid");
    setSearchText('');
    close();
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex, close)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex, close)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters, close)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <BarsOutlined 
        className="text-base	"
        style={{
          color: filtered ? '#1677ff' : "#8da2fb",
        }}
      />
    ),
    onFilter: (value, record) => {if (record[dataIndex])  record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())},
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      dataIndex === "date" ? (
        searchedColumn === dataIndex ? (<Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={getFormattedDate(text) ? getFormattedDate(text).toString() : ''}
        />
        ) : (
          getFormattedDate(text)
        )
      ) : (
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      )
      )
  });

  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '9%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('date'),
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
      ...getColumnSearchProps('category'),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '15%',
      ...getColumnSearchProps('description'),
    },
    {
      title: "Weight",
      dataIndex: "weight",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('weight'),
    },
    {
      title: "Purity",
      dataIndex: "purity",
      render: text => (
        <div style={{minWidth: '85px', maxWidth: '85px',  overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('purity'),
    },
    {
      title: "Receive Qty",
      dataIndex: "receive22k",
      render: text => (
        <div style={{minWidth: '140px', maxWidth: '140px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '12%',
      ...getColumnSearchProps('receive22k'),
    },
    {
      title: "Issue Qty",
      dataIndex: "issue22k",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('issue22k'),
    },
    {
      title: "Issuer",
      dataIndex: "issuer",
      render: text => (
        <div style={{ minWidth: '100px', maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('issuer'),
    },
    {
      title: "Receiver",
      dataIndex: "receiver",
      render: text => (
        <div style={{ minWidth: '100px', maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('receiver'),
    },
  ];

  const SelectNone = () => {
    setSelectedRowKeys();
  }

  const SelectAll = () => {
    const array = [];

    rows.forEach( function(number){
      if (number.is_deleted_flag === false){
        array.push(number._id);
      }
    }
    )
    setSelectedRowKeys(array);
  }

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record) => ({
      disabled: record.is_deleted_flag === true,
    }),
    selections: [
      {
        key: 'all',
        text: 'Select All',
        onSelect: () => {SelectAll()},
        hideSelectionColumn: true,
      },
      {
        key: 'none',
        text: 'Unselect All',
        onSelect: () => {SelectNone()},
      },
      {
        key: 'all_entries',
        text: 'Show All',
        onSelect: ()=> {updateRows("all")},
        
      },
      {
        key: 'valid',
        text: 'Show Valid',
        onSelect: ()=> {updateRows("valid")},
      },
      {
        key: 'deleted',
        text: 'Show Deleted',
        onSelect: ()=> {updateRows("deleted")},
      },
    ],
  };

  const getRowClassName = (record, i) => {
    return record.is_deleted_flag ? 'striked-row delete' : i % 2 ? "odd" : "even";
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
        <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} onClick={showModal} />
        <div style={{ fontSize: '175%', fontWeight: "bolder" }}>Master Stock</div>
        <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} onClick={deleteModal} />
        {/* <Button type="primary" style={{ background: "red", borderColor: "yellow" }} onClick={deleteModal} >Delete</Button> */}
      </div>
      {/* <br/> */}

      
      {/* <div className="flex justify-end mb-2 items-center">
        <div className="rounded text-xl flex text-gray-600 justify-between p-3 items-center bg-indigo-400"> 
          <span className="w-44">Opening Balance</span>
          <span className="w-4">:</span>
          <input className="rounded float-end text-right w-20 border-current	border-0 bg-indigo-400 outline-blue-50 outline"/>
           </div>
      </div>

      <div className="flex justify-end items-center">
        <div className="rounded text-xl text-black flex p-3 justify-between bg-[#e4e7eb] items-center">
          <span className="w-44">Closing Balance &nbsp; </span>
          <span className="w-4">:</span>
          <span className="float-end text-right	w-20"> 1000</span>
        </div>
      </div>



      <div className="flex justify-end items-center">
        <div className="rounded text-xl text-white flex p-3 justify-between bg-[#e6aaa7] items-center">
          <span className="w-44">Closing Balance &nbsp; </span>
          <span className="w-4">:</span>
          <span className="float-end text-right	w-20"> 1000</span>
        </div>
      </div>
      
      <div className="flex justify-end items-center">
        <div className="rounded text-xl text-black flex p-3 justify-between bg-[#81c992] items-center">
          <span className="w-44">Closing Balance &nbsp; </span>
          <span className="w-4">:</span>
          <span className="float-end text-right	w-20"> 1000</span>
        </div>
      </div> */}

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
        summary={(pageData) => {
          let totalWeight = 0;
          let totalRecvQty = 0;
          let totalIssueQty = 0;
          pageData.forEach(({ weight, receive22k, issue22k }) => {
            if (isNaN(receive22k)) {
              receive22k = 0; // Set it to zero if it's NaN
            } 
            if (isNaN(issue22k)) {
              issue22k = 0; // Set it to zero if it's NaN
            } 
            totalWeight += weight;
            totalRecvQty += receive22k;
            totalIssueQty += issue22k;
          });
          totalWeight = totalWeight.toFixed(3);
          totalRecvQty = totalRecvQty.toFixed(3);
          totalIssueQty = totalIssueQty.toFixed(3);
          return (
            <>
              <Table.Summary.Row className="text-center !text-white !bg-green-500	mt-1">
                <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={1}></Table.Summary.Cell>
                <Table.Summary.Cell index={2}></Table.Summary.Cell>
                <Table.Summary.Cell index={3}></Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {totalWeight}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}></Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  {totalRecvQty}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  {totalIssueQty}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}></Table.Summary.Cell>
                <Table.Summary.Cell index={9}></Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      <Divider />
             {/* <Table.Summary.Row className="text-center !text-white !bg-green-500	">
                 <Table.Summary.Cell index={0}>Total</Table.Summary.Cell>
                 <Table.Summary.Cell index={1}></Table.Summary.Cell>
                 <Table.Summary.Cell index={2}></Table.Summary.Cell>
                 <Table.Summary.Cell index={3}></Table.Summary.Cell>
                 <Table.Summary.Cell index={4}>
                   {totalWeightQuantity}
                 </Table.Summary.Cell>
                 <Table.Summary.Cell index={5}></Table.Summary.Cell>
                 <Table.Summary.Cell index={6}>
                   {totalRecvQuantity}
                 </Table.Summary.Cell>
                 <Table.Summary.Cell index={7}>
                   {totalIssueQuantity}
                 </Table.Summary.Cell>
                 <Table.Summary.Cell index={8}></Table.Summary.Cell>
                 <Table.Summary.Cell index={9}></Table.Summary.Cell>
               </Table.Summary.Row></> */}

<div className="text-xl flex justify-between items-center">
          <span className="w-72 bg-indigo-400 p-2">
            Opening Balance:
            <input className="float-end w-24 border-current	border-0 bg-indigo-400 outline-blue-50 outline"/>
          </span>
          <span className="w-72 bg-indigo-400 p-2">
            Closing Balance: &nbsp; <span className="float-end">1000</span> 
          </span>
      </div>
    </div>
  );
};

export default MasterStock;
