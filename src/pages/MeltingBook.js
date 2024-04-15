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
import { getUtilityData, updateUtility } from "../api/utility.js";
import { fetchMeltingBookList, deleteMeltingBookList } from "../api/meltingBook.js";
import  MeltingBookAdd from "../components/MeltingBookAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import MeltingBookUpdate from "../components/MeltingBookUpdate.js";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';

const MeltingBook = () => {
  const screenWidth = window.innerWidth;
  const [page] = useState(1);
  const [itemsPerPage] = useState(1000000); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [totalWeightQuantity, setTotalWeight] = useState(0);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [totalIssueActualQuantity, setTotalIssueActualQty] = useState(0);
  const [totalLossQuantity, setTotalLossQty] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);

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
    
    const balanceData = await getUtilityData(token);
    setOpeningBalance(balanceData[0]["meltingBookOpeningBalance"])
    setClosingBalance(balanceData[0]["meltingBookClosingBalance"])

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

    let totalWeight = 0.000;
    let totalRecvQty = 0.0;
    let totalIssueQty = 0.0;
    let totalLossQty = 0.0;
    let totalIssueActualQty = 0.0;
    data.forEach(({ weight24k, receive22k, issue22k, issue22kActual, loss22k}) => {
      // console.log(weight24k, receive22k, issue22k, loss22k);
      if (isNaN(parseFloat(receive22k))) {
        receive22k = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(issue22k))) {
        issue22k = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(weight24k))){
        weight24k = 0; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(loss22k))){
        loss22k = 0; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(issue22kActual))){
        issue22kActual = 0; // Set it to zero if it's NaN
      }
      totalWeight += parseFloat(weight24k);
      totalRecvQty += parseFloat(receive22k);
      totalIssueQty += parseFloat(issue22k);
      totalIssueActualQty += parseFloat(issue22kActual);
      totalLossQty += parseFloat(loss22k);
    });
    // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
    setTotalWeight(totalWeight.toFixed(2));
    setTotalRecvQty(totalRecvQty.toFixed(2));
    setTotalIssueQty(totalIssueQty.toFixed(2));
    setTotalIssueActualQty(totalIssueActualQty.toFixed(2));
    setTotalLossQty(totalLossQty.toFixed(2));
    
    // setClosingBalance((openingBalance + totalIssueQty - totalRecvQty - totalLossQty).toFixed(2));
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

        const balanceData = await getUtilityData(token);
        setOpeningBalance(balanceData[0]["meltingBookOpeningBalance"])
        setClosingBalance(balanceData[0]["meltingBookClosingBalance"])
    
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

        let totalWeight = 0.000;
        let totalRecvQty = 0.0;
        let totalIssueQty = 0.0;
        let totalLossQty = 0.0;
        let totalIssueActualQty = 0.0;
        data.forEach(({ weight24k, receive22k, issue22k, issue22kActual, loss22k}) => {
          // console.log(weight24k, receive22k, issue22k, loss22k);
          if (isNaN(parseFloat(receive22k))) {
            receive22k = 0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(issue22k))) {
            issue22k = 0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(weight24k))){
            weight24k = 0 // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(loss22k))){
            loss22k = 0  // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(issue22kActual))){
            issue22kActual = 0; // Set it to zero if it's NaN
          }    
          totalWeight += parseFloat(weight24k);
          totalRecvQty += parseFloat(receive22k);
          totalIssueQty += parseFloat(issue22k);
          totalIssueActualQty += parseFloat(issue22kActual);
          totalLossQty += parseFloat(loss22k);
        });
        // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
        setTotalWeight(totalWeight.toFixed(2));
        setTotalRecvQty(totalRecvQty.toFixed(2));
        setTotalIssueQty(totalIssueQty.toFixed(2));
        setTotalIssueActualQty(totalIssueActualQty.toFixed(2));
        setTotalLossQty(totalLossQty.toFixed(2));
        // setClosingBalance((openingBalance + totalIssueQty - totalRecvQty - totalLossQty).toFixed(2));

        setIsLoading(false);
    })();
    }, [page, itemsPerPage]);


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showAddPopup = (text) => {
    // console.log(text);
    setIsEditModalOpen(true);
    setUpdateData(text)
  };

  const showDeletePopup = (text) => {
    setIsDeleteModalOpen(true)
  }

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const meltingBookId = {
      _id: selectedRowKeys
    }
    const balanceData = await getUtilityData(token);
    let currMeltingBookClosingBalance = parseFloat(balanceData[0]["meltingBookClosingBalance"])

    // console.log(selectedRowKeys, rows);
    selectedRowKeys.map((item, index) => {
      for (let i = 0; i < rows.length; i++) {
        if (rows[i]["_id"] === item) {
          // console.log(rows[i]);
          currMeltingBookClosingBalance += parseFloat(rows[i]["weight24k"]);
        }
        }
      }
    )
    const utilityData = {
      _id: balanceData[0]["_id"],
      meltingBookClosingBalance: currMeltingBookClosingBalance
    }
    await updateUtility(utilityData, token);

    // console.log(meltingBookId);
    await deleteMeltingBookList(meltingBookId, token);

    await updateRows("valid");
    setSelectedRowKeys([]);
    setIsDeleteModalOpen(false);
    setIsLoading(false);
  }
  const handleCancel = () => {
    // updateRows("valid");
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setUpdateData([]);
  };

  const handleUpdateClose = () => {
    updateRows("valid");
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setUpdateData([]);
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = (selectedKeys, confirm, dataIndex, close) => {
    // console.log(selectedKeys, confirm, dataIndex)

    // updateRows("valid");
    const array = [];

    fullData.forEach(function (user){
      if (user[dataIndex]){
        if (dataIndex === "date"){
          if (getFormattedDate(user[dataIndex]).toString().toLowerCase().includes(selectedKeys[0].toString().toLowerCase())){
            array.push(user);
          }
        }
        else{
          if (user[dataIndex].toString().toLowerCase().includes(selectedKeys[0].toString().toLowerCase())){
            array.push(user);
          }
        }
    }
    });
    array.reverse();
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
        style={{
          color: filtered ? '#fff' : "#fff",
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
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
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
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('description'),
    },
    {
      title: "Weight",
      dataIndex: "weight24k",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('weight24k'),
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
      title: "Conversion",
      dataIndex: "conversion",
      render: text => (
        <div style={{minWidth: '85px', maxWidth: '85px',  overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('conversion'),
    },
    {
      title: "Issue Wt (Formula)",
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
      title: "Issue Wt (Actual)",
      dataIndex: "issue22kActual",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('issue22kActual'),
    },
    {
      title: "Receive Wt",
      dataIndex: "receive22k",
      render: text => (
        <div style={{minWidth: '140px', maxWidth: '140px', whiteSpace:"nowrap !important", textAlign: 'center'}} className="whitespace-nowrap">
          {text}
        </div>
      ),
      width: '15%',
      ...getColumnSearchProps('receive22k'),
    },
    {
      title: "Loss Qty",
      dataIndex: "loss22k",
      render: text => (
        <div style={{minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '12%',
      ...getColumnSearchProps('loss22k'),
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      
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
        {screenWidth > 800 ? (
          <>
            <div className="text-xl border-transparent flex justify-between items-center">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "3em",
              marginTop: "-3rem",
              }} className="text-center text-[#00203FFF]" >
                Melting Book
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex justify-between items-center h-12">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 h-12 font-medium bg-[#ABD6DFFF] p-2">
                  Opening Balance:&nbsp;&nbsp;&nbsp;&nbsp;
                    <input className="ml-4 text-[#00203FFF] text-right w-32 px-2 text-lg h-7 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " readOnly={true} value={openingBalance}/>
                  </span>
                  <Tooltip title="Add" placement="topRight">
                    <PlusCircleOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showModal} />
                  </Tooltip>
                </div>
                <div className="mt-1 flex justify-between items-center h-12">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 font-medium bg-[#ABD6DFFF] h-12 p-2">
                      Remaining Balance:  <input className="ml-3 text-[#00203FFF] text-lg	h-7 text-right px-2 w-32 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " readOnly={true} value={closingBalance}/>
                    </span>
                    <Tooltip title="Delete" placement="bottomRight">
                    <DeleteOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="place-content-end	w-12" onClick={showDeletePopup}/>
                  </Tooltip>
                </div>
              </div>
            </div>
            <br/>
          </>
        ) : (
          <>
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >Melting Book</div>

          <div className="text-xl border-b-8 border-transparent border-t-4 pt-4	border-transparent flex justify-between items-center">
            <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="w-1/2" onClick={showModal} />
            <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="place-content-end	w-28" onClick={showDeletePopup} />
          </div>
          <div className="border-b-8 border-t-8 border-transparent	text-xl flex justify-end items-center">
            <span className="text-[#00203FFF] font-medium	 w-full bg-[#ABD6DFFF] p-2">
              Opening Balance:
              <input className="text-[#00203FFF] text-right px-2	float-end w-24 border-current	border-0 bg-[#ABD6DFFF] outline-blue-50 outline" readOnly={true} value={openingBalance}/>
            </span>
          </div>
          <div className="	text-xl flex justify-end items-center">
              <span className="text-[#00203FFF] font-medium	 w-full bg-[#ABD6DFFF] p-2">
                Closing Balance: &nbsp; <span className="text-[#00203FFF] px-2 text-right	float-end w-24 border-current	border-0 bg-[#ABD6DFFF] outline-blue-50 outline">{closingBalance}</span> 
              </span>
            </div>
          </>
        )}

      <Modal
        title="Add Item"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <MeltingBookAdd
          handleOk={handleUpdateClose}
          closingBalance={parseFloat(closingBalance)}
          setClosingBalance={setClosingBalance}
          />
      </Modal>

      <Modal
        title="Are you sure you want to delete the selected rows ?"
        open={isDeleteModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex justify-center	">
        <Button className="bg-[#ABD6DFFF] mr-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={deleteModal}>
            Yes
        </Button>
        <Button className="bg-[#ABD6DFFF] ml-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={handleCancel}>
            No
        </Button>
        </div>
      </Modal>

      <Modal
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <MeltingBookUpdate
          handleOk={handleUpdateClose}
          textData={updateData}
          />
      </Modal>

      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowClassName={getRowClassName}
        dataSource={rows}
        rowKey="_id"
        scroll={{ x: 'calc(100vh - 4em)' }}
        pagination={{ defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100']}}
        summary={() => {
          return (
            <>
              <Table.Summary.Row className="footer-row font-bold	text-center text-lg bg-[#ABD6DFFF]">
                <Table.Summary.Cell index={0} className="" colSpan={4}>Total</Table.Summary.Cell>
                {/* <Table.Summary.Cell index={1}></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={2}></Table.Summary.Cell> */}
                <Table.Summary.Cell index={3}>
                  {totalWeightQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  {/* {totalWeightQuantity} */}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  {totalIssueQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                  {totalIssueActualQuantity}
                  {/* TODO Add Total Issue Weight {totalIssueQuantity} */}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  {totalRecvQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  {totalLossQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}></Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      <Divider />
    </div>
  );
};

export default MeltingBook;