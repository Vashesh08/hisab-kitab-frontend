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
import GovindCapBookAdd from "../../components/GovindCap/GovindCapBookAdd.js";
import '../../style/pages.css';
import Loading from "../../components/Loading.js";
// import GovindCapBookUpdate from "../../components/GovindCap/GovindCapBookUpdate.js";
import { DeleteOutlined, PlusCircleOutlined, PrinterOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import { deleteLossAcctList, fetchLossAcctList } from "../../api/LossAcct.js";
import { fetchGovindCapStockList, deleteGovindCapStockList } from "../../api/govindCapBook.js";
import GovindCapBookClose from "../../components/GovindCap/GovindCapBookClose.js";

const GovindCapAccountBook = () => {
  const screenWidth = window.innerWidth;
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Change this to show all
  const [totalCount, setTotalCount] = useState(0);
  const [dataState, setDataState] = useState("valid");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [totalLossQuantity, setTotalLossQty] = useState(0);
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);

  const fetchRecords = async (page, pageSize) => {
    setPage(page);
    setItemsPerPage(pageSize);
  };

  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Govind Cap Account - ' + dayjs().format("DD-MM-YYYY"),
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

    return formattedDate;
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
    const data = [];
    const deleted_data = [];
    // console.log("data", data)
    
    const allGovindCapData = await fetchGovindCapStockList(page, itemsPerPage, token, dataType);
    const docs = allGovindCapData["data"];
    const count = allGovindCapData["count"];
    const totalQty = allGovindCapData["totalQty"];
    setTotalCount(count);

    setRows(docs);
    
    setTotalRecvQty(totalQty[0]["capAcctReceive"].toFixed(2));
    setTotalIssueQty(totalQty[0]["capAcctIssue"].toFixed(2));
    setTotalLossQty(totalQty[0]["capAcctLoss"].toFixed(2));

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
            if ((event.ctrlKey && event.key === 'q') || (event.ctrlKey && event.key === 'Q')) { // Ctrl + S
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
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBoxWtModalOpen, setIsBoxWtModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showAddPopup = (text) => {
    // console.log(text);
    setIsEditModalOpen(true);
    setUpdateData(text)
  };

  const showCompleteModal = () => {
    setIsCompleteModalOpen(true);
  }

  const showBoxWtModal = () => {
    setIsBoxWtModalOpen(true);
  }

  const showDeletePopup = (text) => {
    setIsDeleteModalOpen(true)
  }

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const capAcctBookId = {
      _id: selectedRowKeys
    }
    const lossAcctData = await fetchLossAcctList(page, itemsPerPage, token);
    const lossIds = [];
    
    const allGovindCapData = await fetchGovindCapStockList(page, itemsPerPage, token, dataState);
    const docs = allGovindCapData["data"];
    const count = allGovindCapData["count"];
    const totalQty = allGovindCapData["totalQty"];
    setTotalCount(count);
    
    // console.log(selectedRowKeys, rows);
    selectedRowKeys.map((item, index) => {
      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["capAcctLoss"] !== "" && !isNaN(docs[i]["capAcctLoss"])) {
        const matchedData = lossAcctData.find(row => row.transactionId === item && row.type === "Govind Cap Account")
        if (matchedData){
          lossIds.push(matchedData._id);
        }
      }
      }
    }
    )

    const deleteFromLossAcct = {
      lossId: lossIds,
    }
    await deleteLossAcctList(deleteFromLossAcct, token);

    await deleteGovindCapStockList(capAcctBookId, token);

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
    setIsCompleteModalOpen(false);
    setUpdateData([]);
  };

  const handleUpdateClose = () => {
    updateRows("valid");
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsDeleteModalOpen(false);
    setIsCompleteModalOpen(false);
    setUpdateData([]);
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

    let allData = await fetchGovindCapStockList(1, Number.MAX_SAFE_INTEGER, token, "all");
    let fullData = allData["data"];

    fullData.forEach(function (user){
      if (user[dataIndex]){
        if (dataIndex === "meltingDate"){
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
    setTotalCount(array.length);
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
      dataIndex === "capAcctDate" ? (
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
      ) :(
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
      dataIndex: "capAcctDate",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '10%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('capAcctDate'),
    },
    {
      title: "Type",
      dataIndex: "capAcctType",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '20%',
      ...getColumnSearchProps('capAcctType'),
    },
    {
      title: "Description",
      dataIndex: "capAcctDescription",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '20%',
      ...getColumnSearchProps('capAcctDescription'),
    },
    {
      title: "Issue",
      dataIndex: "capAcctIssue",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '15%',
      ...getColumnSearchProps('capAcctIssue'),
      align: 'right',
    },
    {
      title: "Receive",
      dataIndex: "capAcctReceive",
      render: text => (
        <div style={{minWidth: '125px', maxWidth: '125px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '15%',
      ...getColumnSearchProps('capAcctReceive'),
      align: 'right',
    },
    {
      title: "Loss",
      dataIndex: "capAcctLoss",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '15%',
      ...getColumnSearchProps('capAcctLoss'),
      align: 'right',
    },
  ];

  const SelectNone = () => {
    setSelectedRowKeys();
  }

  const SelectAll = async() => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const govindCapData = await fetchGovindCapStockList(1, Number.MAX_SAFE_INTEGER, token, "valid");
    const docs = govindCapData["data"];

    const array = docs.map(({ _id }) => _id);

    setSelectedRowKeys(array);
    setIsLoading(false);
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
            
            <div className="flex flex-col mt-5">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "1em",
              marginTop: "-1rem",
              }} className="text-center text-[#00203FFF]" >
                Govind Cap Account
              </div>
              <div className="text-left mt-5">
              <Tooltip title="Print Table" placement="bottomLeft">
                  <PrinterOutlined style={{ fontSize: '200%', color:"#1f2937"}} onClick={handlePrint}/>
              </Tooltip>
              </div>
              
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex justify-end items-right h-12">
                  {/* <span className="text-[#00203FFF] whitespace-nowrap w-76 h-12 font-medium bg-[#ABD6DFFF] p-2 flex items-center">
                  Box Weight:
                    <input className="ml-4 mr-4 text-[#00203FFF] text-right w-24 px-2 text-lg h-7 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " onChange={handleOpeningChange} value={boxWt}/>
                    <Tooltip title="Edit Box Wt" placement="top">
                      <EditOutlined style={{ fontSize: "125%" }} onClick={showBoxWtModal}/>
                    </Tooltip>
                  </span> */}
                  <Tooltip title="Add" placement="topRight">
                    <PlusCircleOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showModal} />
                  </Tooltip>
                </div>
                <div className="mt-1 flex justify-between items-center h-12">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 font-medium bg-[#ABD6DFFF] h-12 p-2">
                  Close Daily Account: <PlusCircleOutlined className="ml-12 float-end" style={{ fontSize:"125%"}} onClick={showCompleteModal}/> 
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
              }} className="text-center text-[#00203FFF]" >Govind Cap Account</div>

          <div className="text-xl border-b-8 border-transparent border-t-4 pt-4	border-transparent flex justify-between items-center">
            <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="w-1/2" onClick={showModal} />
            <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="place-content-end	w-28" onClick={showDeletePopup} />
          </div>
          <div className="my-2 text-xl flex justify-end items-center">
              <span className="text-[#00203FFF] font-medium	 w-full bg-[#ABD6DFFF] p-2">
                Close Daily Account: <PlusCircleOutlined className=" float-end" style={{ fontSize:"140%"}} onClick={showCompleteModal}/> 
              </span>
            </div>
          </>
        )}

      <Modal
        title="Add Item To Govind Cap Book"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <GovindCapBookAdd
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
      title="Close Daily Account"
      open={isCompleteModalOpen}
      onCancel={handleCancel}
      footer={null}
      >
        <GovindCapBookClose
        handleOk={handleUpdateClose}
        />
      </Modal>

      {/* <Modal
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <GovindCapBookUpdate
          handleOk={handleUpdateClose}
          textData={updateData}
          />
      </Modal> */}

      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">Govind Cap Account Book</div>}

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
            Govind Cap Account - {dayjs().format("DD-MMMM-YYYY")}
          </div>
        )}
        summary={() => {
          return (
            <>
              <Table.Summary.Row className="footer-row font-bold	text-center text-lg bg-[#ABD6DFFF]">
                <Table.Summary.Cell index={0} className="" colSpan={2}>Total</Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {totalIssueQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                {totalRecvQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                {totalLossQuantity}
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

export default GovindCapAccountBook;