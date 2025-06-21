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
import Highlighter from 'react-highlight-words';
import { fetchMasterStockList, deleteMasterStockList } from "../api/masterStock.js";
import  ModelAdd from "../components/ModelAdd.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import { DeleteOutlined, PlusCircleOutlined, BarsOutlined, SearchOutlined, PrinterOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import { getUtilityData, updateUtility } from "../api/utility.js";
import dayjs from 'dayjs'; 

const MasterStock = () => {
  const screenWidth = window.innerWidth;
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Change this to show all
  const [totalCount, setTotalCount] = useState(0);
  const [dataState, setDataState] = useState("valid");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalWeightQuantity, setTotalWeight] = useState(0);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [openingBalance, setOpeningBalance] = useState(0);
  const [closingBalance, setClosingBalance] = useState(0);
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);

  const fetchRecords = async (page, pageSize) => {
    setPage(page);
    setItemsPerPage(pageSize);
  };
  
  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Master Stock - ' + dayjs().format("DD-MM-YYYY"),
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

    if (dataState !== dataType){
      setPage(1);
    };
    setDataState(dataType);
    // send request to check authenticated

    const balanceData = await getUtilityData(token);
    setOpeningBalance(parseFloat(balanceData[0]["masterStockOpeningBalance"]).toFixed(2));
    setClosingBalance(parseFloat(balanceData[0]["masterStockClosingBalance"]).toFixed(2));

    const masterStockData = await fetchMasterStockList(page, itemsPerPage, token, dataType);

    const docs = masterStockData["data"];
    const count = masterStockData["count"];
    const totalQty = masterStockData["totalQty"];
    setTotalCount(count);

    setRows(docs);
    if (totalQty[0]["weight"] === null){
      setTotalWeight(Number(0).toFixed(2));      
    }
    else{
      setTotalWeight(totalQty[0]["weight"].toFixed(2));
    }

    if (totalQty[0]["receive22k"] === null){
      setTotalRecvQty(Number(0).toFixed(2));
    }
    else{
      setTotalRecvQty(totalQty[0]["receive22k"].toFixed(2));
    }

    if (totalQty[0]["issue22k"] === null){
      setTotalIssueQty(Number(0).toFixed(2));
    }
    else{
      setTotalIssueQty(totalQty[0]["issue22k"].toFixed(2));
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

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showDeletePopup = (text) => {
    setIsDeleteModalOpen(true)
  }
  
  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const masterStockId = {
      masterstockId: selectedRowKeys
    }
    //console.log(selectedRowKeys, rows);

    const balanceData = await getUtilityData(token);

    let curMasterStockOpeningBalance = parseFloat(balanceData[0]["masterStockOpeningBalance"]);
    let curMasterStockClosingBalance = parseFloat(balanceData[0]["masterStockClosingBalance"]);
    let curMeltingBookOpeningBalance = parseFloat(balanceData[0]["meltingBookOpeningBalance"]);
    let curMeltingBookClosingBalance = parseFloat(balanceData[0]["meltingBookClosingBalance"]);
    let curMeltingBookOpening995Balance = parseFloat(balanceData[0]["meltingBookOpening995Balance"]);
    let curMeltingBookClosing995Balance = parseFloat(balanceData[0]["meltingBookClosing995Balance"]);
    let curMeltingBookOpening100Balance = parseFloat(balanceData[0]["meltingBookOpening100Balance"]);
    let curMeltingBookClosing100Balance = parseFloat(balanceData[0]["meltingBookClosing100Balance"]);
    
    const masterStockData = await fetchMasterStockList(1, Number.MAX_SAFE_INTEGER, token, "valid");
    const docs = masterStockData["data"];
    const count = masterStockData["count"];
    setTotalCount(count);

    selectedRowKeys.map((item, index) => {
      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["_id"] === item && !docs[i]["is_deleted_flag"]) {
          //console.log(docs[i])
          if (docs[i]["type"] === "Issue"){
              curMasterStockClosingBalance += parseFloat(docs[i]["issue22k"])
          }
          else if (docs[i]["type"] === "Receive"){
              if (docs[i]["category"] === "metal"){
                curMasterStockOpeningBalance -= parseFloat(docs[i]["receive22k"])
                curMasterStockClosingBalance -= parseFloat(docs[i]["receive22k"])
                //console.log(docs[i]["purity"]);
                if (docs[i]["purity"] === 99.5){
                  curMeltingBookOpening995Balance -= parseFloat(docs[i]["weight"])
                  curMeltingBookClosing995Balance -= parseFloat(docs[i]["weight"])
                }
                else if (docs[i]["purity"] === 100){
                  curMeltingBookOpening100Balance -= parseFloat(docs[i]["weight"])
                  curMeltingBookClosing100Balance -= parseFloat(docs[i]["weight"])
                }
                else{
                  curMeltingBookOpeningBalance -= parseFloat(docs[i]["weight"])
                  curMeltingBookClosingBalance -= parseFloat(docs[i]["weight"])
                }
              }
              else{
                curMasterStockOpeningBalance -= parseFloat(docs[i]["receive22k"])
                curMasterStockClosingBalance -= parseFloat(docs[i]["receive22k"])
              }
          }
          else{
            if (docs[i]["category"] === "metal"){
              curMasterStockOpeningBalance -= parseFloat(docs[i]["receive22k"])
              curMasterStockClosingBalance -= parseFloat(docs[i]["receive22k"])
              //console.log(docs[i]["purity"]);
              if (docs[i]["purity"] === 99.5){
                curMeltingBookOpening995Balance -= parseFloat(docs[i]["weight"])
                curMeltingBookClosing995Balance -= parseFloat(docs[i]["weight"])
              }
              else if (docs[i]["purity"] === 100){
                curMeltingBookOpening100Balance -= parseFloat(docs[i]["weight"])
                curMeltingBookClosing100Balance -= parseFloat(docs[i]["weight"])
              }
              else{
                curMeltingBookOpeningBalance -= parseFloat(docs[i]["weight"])
                curMeltingBookClosingBalance -= parseFloat(docs[i]["weight"])
              }
            }
            else{
              curMasterStockOpeningBalance -= parseFloat(docs[i]["receive22k"])
              curMasterStockClosingBalance -= parseFloat(docs[i]["receive22k"])
            }

            // issue22k
            curMasterStockClosingBalance += parseFloat(docs[i]["issue22k"])

          }
        }
        }
      }
    )
    
    const utilityData = {
      _id: balanceData[0]["_id"],
      masterStockOpeningBalance: curMasterStockOpeningBalance,
      masterStockClosingBalance: curMasterStockClosingBalance,
      meltingBookOpeningBalance: curMeltingBookOpeningBalance,
      meltingBookClosingBalance: curMeltingBookClosingBalance,
      meltingBookOpening995Balance: curMeltingBookOpening995Balance,
      meltingBookClosing995Balance: curMeltingBookClosing995Balance,
      meltingBookOpening100Balance: curMeltingBookOpening100Balance,
      meltingBookClosing100Balance: curMeltingBookClosing100Balance
    }
    await updateUtility(utilityData, token);

    await deleteMasterStockList(masterStockId, token );

    await updateRows("valid");
    setIsDeleteModalOpen(false);
    setIsLoading(false);
    setSelectedRowKeys([]);
  }
  const handleCancel = () => {
    // updateRows("valid");
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleUpdateClose = () => {
    updateRows("valid");
    setIsModalOpen(false);
    setIsDeleteModalOpen(false);  
  }

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const handleSearch = async(selectedKeys, confirm, dataIndex, close) => {
    setIsLoading(true);
    // confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
    let array = [];

    const token = localStorage.getItem("token");

    let allData = await fetchMasterStockList(1, Number.MAX_SAFE_INTEGER, token, dataState);
    let fullData = allData["data"];

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
    setTotalCount(array.length);

    // await sleep(100); // sleeps for 100 milli seconds

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
      title: "Type",
      dataIndex: "type",
      render: text => (
        <div style={{ maxWidth: '200px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('type'),
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
      align: 'right',
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
      align: 'right',
    },
    {
      title: "Receive Wt",
      dataIndex: "receive22k",
      render: text => (
        <div style={{minWidth: '140px', maxWidth: '140px', overflow: 'auto', textAlign: 'end !important'}}>
          {text}
        </div>
      ),
      width: '12%',
      ...getColumnSearchProps('receive22k'),
      align: 'right',
    },
    {
      title: "Issue Wt",
      dataIndex: "issue22k",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('issue22k'),
      align: 'right',
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

  const SelectAll = async() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");

    const masterStockData = await fetchMasterStockList(1, Number.MAX_SAFE_INTEGER, token, "valid");
    const docs = masterStockData["data"];

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
                Master Stock
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
                    Opening Balance:
                    <input className="ml-4 text-[#00203FFF] text-right w-32 px-2 text-lg h-7 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " readOnly={true} value={openingBalance}/>
                  </span>
                  <Tooltip title="Add" placement="topRight">
                    <PlusCircleOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showModal} />
                  </Tooltip>
                </div>
                <div className="mt-1 flex justify-between items-center h-12">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 font-medium bg-[#ABD6DFFF] h-12 p-2">
                      Closing Balance: &nbsp; <input className="ml-3 text-[#00203FFF] text-lg	h-7 text-right px-2 w-32 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " readOnly={true} value={closingBalance}/>
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
              }} className="text-center text-[#00203FFF]" >Master Stock</div>

          <div className="text-xl border-b-8 border-transparent	border-transparent  border-t-4 pt-4 flex justify-between items-center">
            <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="w-1/2" onClick={showModal} />
            <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="place-content-end	w-28" onClick={showDeletePopup} />
          </div>
          <div className="border-b-8 border-t-8 border-transparent	text-xl flex justify-end items-center">
            <span className="text-[#00203FFF] font-medium	 w-full bg-[#ABD6DFFF] p-2">
              Opening Balance:
              <input className="text-[#00203FFF] text-right px-2	float-end w-32 border-current	border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus-outline" readOnly={true} value={openingBalance}/>
            </span>
          </div>
          <div className="	text-xl flex justify-end items-center">
              <span className="text-[#00203FFF] font-medium	 w-full bg-[#ABD6DFFF] p-2">
                Closing Balance: &nbsp; <span className="text-[#00203FFF] px-2 text-right	float-end w-32 border-current	border-0 bg-[#ABD6DFFF] outline-blue-50 outline">{closingBalance}</span> 
              </span>
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
        <ModelAdd
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
      
      {/* <div style={{ textAlign: 'right', marginBottom: 16 }}>
      <Tooltip title="Print Table" placement="bottomLeft">
          <PrinterOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="text-right" onClick={handlePrint}/>
      </Tooltip>
      </div> */}
      
      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">Master Stock</div>}

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
            Master Stock - {dayjs().format("DD-MMMM-YYYY")}
          </div>
        )}
        summary={() => {
          return (
            <>
              <Table.Summary.Row className="footer-row font-bold	text-center text-lg bg-[#ABD6DFFF]">
                <Table.Summary.Cell index={0} className="" colSpan={4}>Total</Table.Summary.Cell>
                {/* <Table.Summary.Cell index={1}></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={2}></Table.Summary.Cell> */}
                <Table.Summary.Cell index={4}></Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  {totalWeightQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}></Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  {totalRecvQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  {totalIssueQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}></Table.Summary.Cell>
                <Table.Summary.Cell index={10}></Table.Summary.Cell>
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

export default MasterStock;
