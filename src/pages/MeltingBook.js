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
import { fetchMeltingBookList, deleteMeltingBookList } from "../api/meltingBook.js";
import  MeltingBookAdd from "../components/MeltingBookAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import MeltingBookUpdate from "../components/MeltingBookUpdate.js";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined,SearchOutlined } from "@ant-design/icons";

const MeltingBook = () => {
  const [page] = useState(1);
  const [itemsPerPage] = useState(100); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [fullData, setFullData] = useState([]);

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

    const docs = await fetchMeltingBookList(page, itemsPerPage, token);
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
        setFullData(docs);
        // console.log("data", docs);
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
    // console.log(text);
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
      <SearchOutlined
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
      width: '7%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('date'),
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
      ...getColumnSearchProps('description'),
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
      ...getColumnSearchProps('weight24k'),
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
      ...getColumnSearchProps('purity'),
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
      ...getColumnSearchProps('issue22k'),
    },
    {
      title: "Receive Qty",
      dataIndex: "receive22k",
      render: text => (
        <div style={{minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('receive22k'),
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
      ...getColumnSearchProps('loss22k'),
    },
    {
      title: "Action",
      key: "action",
      width: 200,
      
      render: (text, record, index) => (
        <>
          {text.is_receiver_updated || text.is_deleted_flag ? (
          <div></div>
        ) : (
          <div style={{ textAlign:"center"}}>
          <Space>
            <EditOutlined style={{ color:"#1f2937", fontSize: '175%'}} onClick={() => showAddPopup(text)}/>
          </Space>
          </div>
        )}
        </>
      )
    }
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
    // console.log('selectedRowKeys changed: ', newSelectedRowKeys);
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
        key: 'deleted',
        text: 'Show Deleted',
        onSelect: ()=> {updateRows("deleted")},
        
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
      }
    ],
  };

  const getRowClassName = (record, i) => {
    // console.log(i, record, record._id)
    return record.is_deleted_flag ? 'striked-row delete' : i % 2 ? "odd" : "even";
  };

  if (isLoading){
    return <Loading />
  }

  return (
    <div>
      
        <div style={{ display: "flex", justifyContent: "space-between" }}>
        

        <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} onClick={showModal} />
        {/* <Button type="primary" style={{ background: "green", borderColor: "yellow" }} onClick={showModal}>
          Add Item
        </Button> */}
        <div style={{ fontSize: '175%', fontWeight: "bolder" }}>Melting Book</div>
        <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} onClick={deleteModal} />
        {/* <Button type="primary" style={{ background: "red", borderColor: "yellow" }} onClick={deleteModal} >Delete</Button> */}
      </div>


      {/* <div className="text-xl flex justify-between items-center">
          <span className="w-72 bg-indigo-400 p-2">
            Opening Balance:
            <input className="float-end w-24 border-current	border-0 bg-indigo-400 outline-blue-50 outline"/>
          </span>
          <span className="w-72 bg-indigo-400 p-2">
            Closing Balance: &nbsp; <span className="float-end">1000</span> 
          </span>
      </div> */}
      
      <div className="flex justify-end mb-2 items-center">
        <div className="rounded text-xl flex text-gray-600 justify-between p-3 items-center bg-indigo-400"> 
          <span className="w-44">Opening Balance</span>
          <span className="w-4">:</span>
          <input className="rounded float-end text-right w-20 border-current	border-0 bg-indigo-400 outline-blue-50 outline"/>
           </div>
      </div>

      <div className="flex justify-end items-center">
        <div className="rounded text-xl text-gray-600 flex p-3 justify-between bg-indigo-400 items-center">
          <span className="w-44">Closing Balance &nbsp; </span>
          <span className="w-4">:</span>
          <span className="float-end text-right	w-20"> 1000</span>
        </div>
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