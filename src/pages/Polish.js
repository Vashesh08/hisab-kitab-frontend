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

import dayjs from 'dayjs'; // Import Day.js
import Highlighter from 'react-highlight-words';
import  PolishAdd from "../components/PolishAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import { DeleteOutlined, PlusCircleOutlined, EnterOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import { fetchPolishList, deletePolishList, postPolishStock } from "../api/polishBook.js";
import { getUtilityData, updateUtility } from "../api/utility.js";
import { deleteLossAcctList, fetchLossAcctList, postLossAcct } from "../api/LossAcct.js";

const Polish = () => {
  const screenWidth = window.innerWidth;
  const [page] = useState(1);
  const [itemsPerPage] = useState(100000000); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullData, setFullData] = useState([]);
  const [totalWeightQuantity, setTotalWeight] = useState(0);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [totalFineQuantity, setTotalFineQuantity] = useState(0);
  const [totalChatkaQuantity, setTotalChatkaQty] = useState(0);
  const [totalLossQuantity, setTotalLossQty] = useState(0);
  const [totalChillQuantity, setTotalChillQty] = useState(0);

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
    const currentDateData = [];
    const today = dayjs();
    
    // console.log("data", data)


    const docs = await fetchPolishList(page, itemsPerPage, token);
    // console.log(docs);
    setFullData(docs);
    for (let eachEntry in docs) {
      if (docs[eachEntry].is_deleted_flag){
        deleted_data.push(docs[eachEntry]);
      }
      else{
        if (today.isSame(dayjs(docs[eachEntry].date), 'day')){
            currentDateData.push(docs[eachEntry]);
        }
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
    else if (dataType === "today"){
      currentDateData.reverse();
      setRows(currentDateData);
    }
    else{
      deleted_data.reverse();
      setRows(deleted_data);
    }
    
    let totalRecvQty = 0.0;
    let totalIssueQty = 0.0;
    let totalLossQty = 0.0;
    let totalFineQty = 0.0;
    let totalChillQty = 0.0;
    let totalChatkaQty = 0.0;
    
    data.forEach(({ issueWeight, recvWeight, lossWeight, chill, fine, chatka }) => {
      if (isNaN(parseFloat(issueWeight))) {
        issueWeight = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(recvWeight))) {
        recvWeight = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(lossWeight))){
        lossWeight = 0;  // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(chill))){
        chill = 0;  // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(fine))){
        fine = 0;  // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(chatka))){
        chatka = 0;  // Set it to zero if it's NaN
      }
      totalIssueQty += parseFloat(issueWeight);
      totalRecvQty += parseFloat(recvWeight);
      totalLossQty += parseFloat(lossWeight);
      totalFineQty += parseFloat(fine);
      totalChillQty += parseFloat(chill);
      totalChatkaQty += parseFloat(chatka);
    });
    
    setTotalIssueQty(totalIssueQty);
    setTotalRecvQty(totalRecvQty);
    setTotalLossQty(totalLossQty);
    setTotalIssueQty(totalFineQty);
    setTotalChillQty(totalChillQty);
    setTotalChatkaQty(totalChatkaQty);
    
    setIsLoading(false);
  };

    useEffect(() => {
        const handleKeyDown = (event) => {
            // Check if the specific key combination is pressed
            if ((event.ctrlKey && event.key === 'q') || (event.ctrlKey && event.key === 'Q')) { // Show Modal
                event.preventDefault();
                showModal();
            }
        };

        // Add event listener for keydown event
        window.addEventListener('keydown', handleKeyDown);

        (async () => {

        setIsLoading(true);
            const token = localStorage.getItem("token");
        // send request to check authenticated
        const data = [];
        const deleted_data = [];
        const currentDateData = [];
        const today = dayjs();
        // console.log("data", data)


        const docs = await fetchPolishList(page, itemsPerPage, token);
        setFullData(docs);
        for (let eachEntry in docs) {
          if (docs[eachEntry].is_deleted_flag){
            deleted_data.push(docs[eachEntry]);
          }
          else{
            if (today.isSame(dayjs(docs[eachEntry].date), 'day')){
              currentDateData.push(docs[eachEntry]);
              }
              data.push(docs[eachEntry]);
            }
        }
        currentDateData.reverse();
        setRows(currentDateData);
        
        let totalRecvQty = 0.0;
        let totalIssueQty = 0.0;
        let totalLossQty = 0.0;
        let totalFineQty = 0.0;
        let totalChillQty = 0.0;
        let totalChatkaQty = 0.0;
        
        data.forEach(({ issueWeight, recvWeight, lossWeight, chill, fine, chatka }) => {
        if (isNaN(parseFloat(issueWeight))) {
            issueWeight = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(recvWeight))) {
            recvWeight = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(lossWeight))){
            lossWeight = 0;  // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(chill))){
            chill = 0;  // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(fine))){
            fine = 0;  // Set it to zero if it's NaN
        }
        if (isNaN(parseFloat(chatka))){
            chatka = 0;  // Set it to zero if it's NaN
        }
        totalIssueQty += parseFloat(issueWeight);
        totalRecvQty += parseFloat(recvWeight);
        totalLossQty += parseFloat(lossWeight);
        totalFineQty += parseFloat(fine);
        totalChillQty += parseFloat(chill);
        totalChatkaQty += parseFloat(chatka);
        });
        
        setTotalIssueQty(totalIssueQty);
        setTotalRecvQty(totalRecvQty);
        setTotalLossQty(totalLossQty);
        setTotalIssueQty(totalFineQty);
        setTotalChillQty(totalChillQty);
        setTotalChatkaQty(totalChatkaQty);
        
        setIsLoading(false);

    })();

    // Clean up the event listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  
    }, [page, itemsPerPage]);


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);


  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isAcctClosingModalOpen, setIsAcctClosingModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showAcctClosingModal = () => {
    setIsAcctClosingModalOpen(true);
  };

  const showDeletePopup = (text) => {
    setIsDeleteModalOpen(true)
  }
  
  const acctCloseModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
     
    const utilityData = await getUtilityData(token);
    const polishChatkaLoss = utilityData[0]["polishChatkaLoss"]
    const polishLoss = utilityData[0]["polishLoss"]
    const date = dayjs()

    const data = {
      date: dayjs(date, "YYYY-MM-DD"),
      goods: "Acct Closing For Day " + getFormattedDate(dayjs(date, "YYYY-MM-DD")),
      chatka: parseFloat(polishChatkaLoss).toFixed(2),
      chill: parseFloat(polishLoss).toFixed(2)
    }
    const updatedData = await postPolishStock(data, token);
    console.log(updatedData)

    if ((parseFloat(polishChatkaLoss)) > 0){
      const lossData = {
        "type": "Polish",
        "date": date,
        "lossWt": parseFloat(polishChatkaLoss).toFixed(2),
        "transactionId": updatedData.polish_id, 
        "description": " Polish Chatka Loss for " + getFormattedDate(date)
      }
      await postLossAcct(lossData, token)
    }

    if ((parseFloat(polishLoss)) > 0){
      const lossData = {
        "type": "Polish",
        "date": date,
        "lossWt": parseFloat(polishLoss).toFixed(2),
        "transactionId": updatedData.polish_id, 
        "description": " Polish Chill Loss for " + getFormattedDate(date)
      }
      await postLossAcct(lossData, token)
    }

    const utilityBackendData = {
      _id: utilityData[0]["_id"],
      polishChatkaLoss: 0,
      polishLoss: 0
    }
    await updateUtility(utilityBackendData, token);

    await updateRows("today");
    setIsAcctClosingModalOpen(false);

    setIsLoading(false);
  }

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const polishBookId = {
      polishId: selectedRowKeys
    }
    console.log(selectedRowKeys, rows);
    const lossIds = [];
    const balanceData = await getUtilityData(token)
    let curPolishLoss = parseFloat(balanceData[0]["polishLoss"])
    let curPolishChatkaLoss = parseFloat(balanceData[0]["polishChatkaLoss"])
    
    const docs = await fetchPolishList(page, itemsPerPage, token);
    const lossAcctData = await fetchLossAcctList(page, itemsPerPage, token);
    
    // TODO: Remove Rows From Loss Book
    selectedRowKeys.map((item, index) => {

      const matchedData = lossAcctData.filter(row => row.transactionId === item && row.type === "Polish")
      matchedData.forEach(row => {
          lossIds.push(row._id);
      });
      // if (matchedData){
      //   lossIds.push(matchedData._id);
      // }

      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["_id"] === item && !docs[i]["is_deleted_flag"]) {
          if (!isNaN(docs[i]["chatka"])){
            curPolishChatkaLoss -= parseFloat(docs[i]["chatka"]);
          }
          if (!isNaN(docs[i]["lossWeight"])){
            curPolishLoss -= parseFloat(docs[i]["lossWeight"]);
          }
          if (!isNaN(docs[i]["chill"])){
            curPolishLoss += parseFloat(docs[i]["chill"]);
            curPolishChatkaLoss += 2 * parseFloat(docs[i]["chatka"]);
          }
        }
      }
    })

    console.log(lossIds);
    const deleteFromLossAcct = {
      lossId: lossIds
    }
    await deleteLossAcctList(deleteFromLossAcct, token);

    const utilityData = {
      _id: balanceData[0]["_id"],
      polishLoss: curPolishLoss,
      polishChatkaLoss: curPolishChatkaLoss
    }
    await updateUtility(utilityData, token);

    await deletePolishList(polishBookId, token );

    await updateRows("today");
    setIsDeleteModalOpen(false);
    setIsLoading(false);
    setSelectedRowKeys([]);
  }
  const handleCancel = () => {
    // updateRows("valid");
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsAcctClosingModalOpen(false);
  };

  const handleUpdateClose = () => {
    updateRows("today");
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);  
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
      <Tooltip title="filter">
      <BarsOutlined 
        className="text-base"
        style={{
          color: filtered ? '#fff' : "#fff",
        }}
      />
      </Tooltip>
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
      title: "Goods",
      dataIndex: "goods",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '15%',
      ...getColumnSearchProps('goods'),
    },
    {
      title: "Fine",
      dataIndex: "fine",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('fine'),
      align: 'right',
    },
    {
      title: "Chatka",
      dataIndex: "chatka",
      render: text => (
        <div style={{minWidth: '85px', maxWidth: '85px',  overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('chatka'),
      align: 'right',
    },
    {
      title: "Issue Wt",
      dataIndex: "issueWeight",
      render: text => (
        <div style={{minWidth: '140px', maxWidth: '140px', overflow: 'auto', textAlign: 'end !important'}}>
          {text}
        </div>
      ),
      width: '12%',
      ...getColumnSearchProps('issueWeight'),
      align: 'right',
    },
    {
      title: "Receive Wt",
      dataIndex: "recvWeight",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('recvWeight'),
      align: 'right',
    },
    {
      title: "Loss Wt",
      dataIndex: "lossWeight",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('lossWeight'),
      align: 'right',
    },
    {
      title: "Chill",
      dataIndex: "chill",
      render: text => (
        <div style={{ minWidth: '100px', maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('chill'),
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
      

        {screenWidth > 800 ? (
          <>
            <div className="text-xl border-transparent flex justify-between items-center">
              
              <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "3em",
              marginTop: "-3rem",
              }} className="text-center text-[#00203FFF]" >
                Polish Book
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex justify-between items-center h-12">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 h-12 font-medium bg-[#ABD6DFFF] p-2">
                    Close Daily Acct:
                    <Tooltip title="Close Daily Acct" placement="topRight">
                    <EnterOutlined style={{ fontSize: '125%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showAcctClosingModal} />
                  </Tooltip>
                    {/* <input className="ml-4 text-[#00203FFF] text-right w-32 px-2 text-lg h-7 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " readOnly={true} value={"Put button here"}/> */}
                  </span>
                  <Tooltip title="Add" placement="topRight">
                    <PlusCircleOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showModal} />
                  </Tooltip>
                </div>
                <div className="mt-1 flex justify-end items-right h-12">
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
              }} className="text-center text-[#00203FFF]" >Polish Book</div>
          <div className="border-b-8 border-t-8 border-transparent	p-2 bg-[#ABD6DFFF] text-xl flex justify-between items-center">
            <span className="text-[#00203FFF] font-medium	 w-full " onClick={showAcctClosingModal} >
              Close Daily Acct:
              </span>
              <span>
            <Tooltip title="Close Daily Acct" placement="topRight">
              <EnterOutlined style={{ fontSize: '125%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showAcctClosingModal} />
            </Tooltip>
            </span>
          </div>

          <div className="text-xl border-b-8 border-transparent	border-transparent  border-t-4 pt-4 flex justify-between items-center">
            <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="w-1/2" onClick={showModal} />
            <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="place-content-end	w-28" onClick={showDeletePopup} />
          </div>
            <br/>
        </>
        
      )}


      <Modal
        title="Add Item"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <PolishAdd
          handleOk={handleUpdateClose}
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
        title="Are you sure you want to close the daily account for Polish Book ?"
        open={isAcctClosingModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <div className="flex justify-center	">
          <Button className="bg-[#ABD6DFFF] mr-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={acctCloseModal}>
              Yes
          </Button>
          <Button className="bg-[#ABD6DFFF] ml-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={handleCancel}>
              No
          </Button>
        </div>
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
                <Table.Summary.Cell index={0} className="" colSpan={3}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                    {totalFineQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                    {totalChatkaQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                    {totalIssueQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                    {totalRecvQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                    {totalLossQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                    {totalChillQuantity}
                </Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      <Divider />

    </div>
  );
};

export default Polish;
