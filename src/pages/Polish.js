/* eslint-disable no-template-curly-in-string */
import React, { useRef, useState, useEffect, useCallback } from "react";
import {
  Divider,
  Table,
  Button,
  Modal,
  Input,
  Space,
} from "antd";
import { useReactToPrint } from "react-to-print";
import dayjs from 'dayjs'; // Import Day.js
import Highlighter from 'react-highlight-words';
import  PolishAdd from "../components/PolishAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import { DeleteOutlined, PlusCircleOutlined, EnterOutlined, PrinterOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import { fetchPolishList, deletePolishList } from "../api/polishBook.js";
import { getUtilityData, updateUtility } from "../api/utility.js";
import { deleteLossAcctList, fetchLossAcctList } from "../api/LossAcct.js";
import PolishClose from "../components/PolishClose.js";

const Polish = () => {
  const screenWidth = window.innerWidth;
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Change this to show all
  const [totalCount, setTotalCount] = useState(0);
  const [dataState, setDataState] = useState("today");  
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullData, setFullData] = useState([]);
  // const [totalWeightQuantity, setTotalWeight] = useState(0);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [totalFineQuantity, setTotalFineQty] = useState(0);
  const [totalChatkaQuantity, setTotalChatkaQty] = useState(0);
  const [totalLossQuantity, setTotalLossQty] = useState(0);
  const [totalChillQuantity, setTotalChillQty] = useState(0);
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);

  const fetchRecords = async (page, pageSize) => {
    setPage(page);
    setItemsPerPage(pageSize);
  };

  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Polish - ' + dayjs().format("DD-MM-YYYY"),
    // onBeforeGetContent: () => {
    //   return new Promise((resolve) => {
    //     setIsPaginationEnabled(false); // Disable pagination
    //   });
    // },
    onAfterPrint: () => setIsPaginationEnabled(true),
  });

  const handlePrintNowCallback = useCallback(handlePrintNow, [handlePrintNow]);
    
  useEffect(() => {
    if (!isPaginationEnabled) {
      handlePrintNowCallback();
    }
  }, [isPaginationEnabled, handlePrintNowCallback]); // Runs when `isPaginationEnabled` changes

  // Handle Print Click
  const handlePrint = () => {
    setIsPaginationEnabled(false); // Disable pagination
  };

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

    if (searchText !== ""){
      return;
    };

    setIsLoading(true);
    const token = localStorage.getItem("token");
    // send request to check authenticated

    if (dataState !== dataType){
      setPage(1);
    };
    setDataState(dataType);

    const currentDateData = [];
    const today = dayjs();
    
    const allPolishData = await fetchPolishList(page, itemsPerPage, token, dataType);
    const docs = allPolishData["data"];
    const count = allPolishData["count"];
    const totalQty = allPolishData["totalQty"];
    setTotalCount(count);

    setTotalIssueQty(totalQty[0]["issueWeight"].toFixed(2));
    setTotalRecvQty(totalQty[0]["recvWeight"].toFixed(2));
    setTotalLossQty(totalQty[0]["lossWeight"].toFixed(2));
    setTotalFineQty(totalQty[0]["fine"].toFixed(2));
    setTotalChillQty(totalQty[0]["chill"].toFixed(2));
    setTotalChatkaQty(totalQty[0]["chatka"].toFixed(2));

    setFullData(docs);
    for (let eachEntry in docs) {
        if (today.isSame(dayjs(docs[eachEntry].date), 'day')){
            currentDateData.push(docs[eachEntry]);
        }
    }

    if (dataType === "today"){
      setRows(currentDateData);
    }
    else{
      setRows(docs);
    }
        
    setIsLoading(false);
  };

   useEffect(() => {
    (async () => {
      updateRows(dataState);
    })();
  }, [page, itemsPerPage]);

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

    // Clean up the event listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  
    }, []);


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

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const polishBookId = {
      polishId: selectedRowKeys
    }
    //console.log(selectedRowKeys, rows);
    const lossIds = [];
    const balanceData = await getUtilityData(token)
    let curPolishLoss = parseFloat(balanceData[0]["polishLoss"])
    let curPolishChatkaLoss = parseFloat(balanceData[0]["polishChatkaLoss"])
    let curPolishFineLoss = parseFloat(balanceData[0]["polishFineLoss"])

    const allPolishData = await fetchPolishList(page, itemsPerPage, token, dataState);
    const docs = allPolishData["data"];
    const count = allPolishData["count"];
    setTotalCount(count);
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
          if (!isNaN(docs[i]["fine"])){
            curPolishFineLoss += parseFloat(docs[i]["fine"]);
          }
          if (!isNaN(docs[i]["chill"])){
            curPolishLoss += parseFloat(docs[i]["chill"]);
          }
        }
      }

      for (let i = 0; i < lossAcctData.length; i++) {
        if ((!lossAcctData[i].is_deleted_flag) && (lossAcctData[i].transactionId === item) && (lossAcctData[i].type === "Polish")){
          if (lossAcctData[i].description.toLowerCase().includes("chatka")){
            curPolishChatkaLoss += parseFloat(lossAcctData[i].lossWt);
          }
          if (lossAcctData[i].description.toLowerCase().includes("fine")){
            curPolishFineLoss += parseFloat(lossAcctData[i].lossWt);
          }
          if (lossAcctData[i].description.toLowerCase().includes("chill")){
            curPolishLoss += parseFloat(lossAcctData[i].lossWt);
          }
        }
      }
  
    })
    
    // console.log(lossIds);
    const deleteFromLossAcct = {
      lossId: lossIds
    }
    await deleteLossAcctList(deleteFromLossAcct, token);

    const utilityData = {
      _id: balanceData[0]["_id"],
      polishLoss: curPolishLoss.toFixed(2),
      polishChatkaLoss: curPolishChatkaLoss.toFixed(2),
      polishFineLoss: curPolishFineLoss.toFixed(2)
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
    setIsAcctClosingModalOpen(false);
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = async(selectedKeys, confirm, dataIndex, close) => {
    setIsLoading(true);
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);

    let array = [];

    const token = localStorage.getItem("token");

    let allPolishData = await fetchPolishList(1, Number.MAX_SAFE_INTEGER, token, "all");
    let fullData = allPolishData["data"];

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
    setRows(array);

    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    setPage(1);
    setItemsPerPage(array.length);
    close();
    setIsLoading(false);
  };
  
  const handleReset = (clearFilters, close) => {
    clearFilters();
    updateRows("valid");
    setSearchText('');
    setSearchedColumn('');
    setDataState("valid");
    setItemsPerPage(20);
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

  const SelectAll = async() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const allPolishData = await fetchPolishList(1, Number.MAX_SAFE_INTEGER, token, "valid");
    const docs = allPolishData["data"];

    const array = docs.map(({ _id }) => _id);

    setSelectedRowKeys(array);
    setIsLoading(false);
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
              
            <div className="flex flex-col mt-5">
              <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "1em",
              marginTop: "-1rem",
              }} className="text-center text-[#00203FFF]" >
                Polish Book
              </div>
              <div className="text-left mt-5">
              <Tooltip title="Print Table" placement="bottomLeft">
                  <PrinterOutlined style={{ fontSize: '200%', color:"#1f2937"}} onClick={handlePrint}/>
              </Tooltip>
              </div>
              
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
        title="Close Polish Account"
        open={isAcctClosingModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <PolishClose
          handleOk={handleUpdateClose}
        />
      </Modal>

      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">Polish</div>}

      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowClassName={getRowClassName}
        dataSource={rows}
        rowKey="_id"
        scroll={{ x: 'calc(100vh - 4em)' }}
        pagination={isPaginationEnabled ? 
          { defaultPageSize: itemsPerPage, current: page ,showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '1000'], total:totalCount, 
            onChange: (page, pageSize) => {
              fetchRecords(page, pageSize);
            }
          } : 
          false
        }
        footer={isPaginationEnabled ? false : () => (
          <div className="print-footer">
            Polish - {dayjs().format("DD-MMMM-YYYY")}
          </div>
        )}
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

      </div>

      <Divider />

    </div>
  );
};

export default Polish;
