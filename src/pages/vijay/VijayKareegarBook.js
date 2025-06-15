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
import { Tooltip } from 'antd';
import { useReactToPrint } from "react-to-print";
import dayjs from 'dayjs'; // Import Day.js
import Highlighter from 'react-highlight-words';
import '../../style/pages.css';
import Loading from "../../components/Loading.js";
import { EditOutlined, BarsOutlined, PrinterOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchVijayStockList } from "../../api/vijayBook.js";
import VijayKareegarBookUpdate from "../../components/Vijay/VijayKareegarBookUpdate.js";

const VijayKareegarBook = () => {
  const screenWidth = window.innerWidth;
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Change this to show all
  const [totalCount, setTotalCount] = useState(0);
  const [dataState, setDataState] = useState("valid");
  const [issue_to_kareegar] = useState("Vijay");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalData, setEditModalData] = useState([]);
  const [issueBalance, setIssueBalance] = useState(0);
  const [receiveBalance, setReceiveBalance] = useState(0);
  const [bhukaBalance, setBhukaBalance] = useState(0);
  const [lossBalance, setLossBalance] = useState(0);
  const [tarpattaRecvBalance, setTarpattaRecvBalance] = useState(0);
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);

  const fetchRecords = async (page, pageSize) => {
    setPage(page);
    setItemsPerPage(pageSize);
  };

  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Vijay - Vijay Kareegar Book - ' + dayjs().format("DD-MM-YYYY"),
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
    if (date === undefined){
      return ""
    }
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

    const vijayStockData = await fetchVijayStockList(page, itemsPerPage, token, dataType, issue_to_kareegar);
    const docs = vijayStockData["data"];
    const count = vijayStockData["count"];
    const totalQty = vijayStockData["totalQty"];
    setTotalCount(count);

    setRows(docs);

    setTarpattaRecvBalance(totalQty[0]["vijayTarpattaReceive"][0]["vijayTarpattaReceive"].toFixed(2));
    setReceiveBalance(totalQty[0]["vijayReceive"][0]["vijayReceive"].toFixed(2));
    setIssueBalance(totalQty[0]["vijayIssue"][0]["vijayIssue"].toFixed(2));
    setBhukaBalance(totalQty[0]["vijayBhuka"][0]["vijayBhuka"].toFixed(2));
    setLossBalance(totalQty[0]["vijayLoss"][0]["vijayLoss"].toFixed(2));
    
    setIsLoading(false);
  };
  
    useEffect(() => {
      (async () => {
        updateRows(dataState);
      })();
    }, [page, itemsPerPage]);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const showAddPopup = (text) => {
    //console.log("addpopup", text);
    setEditModalData(text);
    //console.log("updateData",editModalData);
    setIsEditModalOpen(true);
  };

  const handleCancel = () => {
    updateRows("valid");
    setIsEditModalOpen(false);
    setEditModalData([]);
  };

  const handleUpdateClose = () => {
    updateRows("valid");
    setIsEditModalOpen(false);
    setEditModalData([]);
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

    let allData = await fetchVijayStockList(1, Number.MAX_SAFE_INTEGER, token, dataState, issue_to_kareegar);
    let fullData = allData["data"];

    fullData.forEach(function (user){
      if (user[dataIndex]){
        if (dataIndex === "vijayDate"){
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
      dataIndex === "vijayDate" ? (
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
      ): dataIndex === "vijayIssue" ?(
        searchedColumn === "vijayIssue" ? (text && text.map((eachText) => (
              (eachText.toString().includes(searchText)? (
              <div><Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={eachText}
              />
              </div>
            ) : (
                <div style={{textAlign:"right"}}>{eachText}</div>
              )
              )
            )
        )): (
          text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
          )
        ))
      ): dataIndex === "vijayReceive" ?(
        searchedColumn === "vijayReceive" ? (text && text.map((eachText) => (
              (eachText.toString().includes(searchText)? (
              <div><Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={eachText}
              />
              </div>
            ) : (
                <div style={{textAlign:"right"}}>{eachText}</div>
              )
              )
            )
        )): (
          text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
          )
        ))
      ): dataIndex === "vijayBhuka" ?(
        searchedColumn === "vijayBhuka" ? (text && text.map((eachText) => (
              (eachText.toString().includes(searchText)? (
              <div><Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={eachText}
              />
              </div>
            ) : (
                <div style={{textAlign:"right"}}>{eachText}</div>
              )
              )
            )
        )): (
          text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
          )
        ))
      ): dataIndex === "tarpattaReceive" ?(
        searchedColumn === "tarpattaReceive" ? (text && text.map((eachText) => (
              (eachText.toString().includes(searchText)? (
              <div><Highlighter
              highlightStyle={{
                backgroundColor: '#ffc069',
                padding: 0,
              }}
              searchWords={[searchText]}
              autoEscape
              textToHighlight={eachText}
              />
              </div>
            ) : (
                <div style={{textAlign:"right"}}>{eachText}</div>
              )
              )
            )
        )): (
          text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
          )
        ))
      ):(
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
      title: "Tarpatta Recv",
      dataIndex: "tarpattaReceive",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('tarpattaReceive'),
      align: 'right',
    },
    {
      title: "Date",
      dataIndex: "vijayDate",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '9%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('vijayDate'),
    },
    {
      title: "Description",
      dataIndex: "vijayDescription",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('vijayDescription'),
    },
    {
      title: "Issue",
      dataIndex: "vijayIssue",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('vijayIssue'),
      align: 'right',
    },
    {
      title: "Receive",
      dataIndex: "vijayReceive",
      render: text => (
        <div style={{minWidth: '85px', maxWidth: '85px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('vijayReceive'),
      align: 'right',
    },
    {
      title: "Bhuka",
      dataIndex: "vijayBhuka",
      render: text => (
        <div style={{minWidth: '125px', maxWidth: '125px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('vijayBhuka'),
      align: 'right',
    },
    {
      title: "Loss",
      dataIndex: "vijayLoss",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('vijayLoss'),
      align: 'right',
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      
      render: (text, record, index) => (
        <>
          <div style={{ textAlign:"center"}}>
          <Space>
            <EditOutlined style={{ color:"#1f2937", fontSize: '175%'}} onClick={() => showAddPopup(text)}/>
          </Space>
          </div>
        </>
      )
    }
  ];

  const SelectNone = () => {
    setSelectedRowKeys();
  }

  const SelectAll = async() => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const vijayStockData = await fetchVijayStockList(1, Number.MAX_SAFE_INTEGER, token, "valid", issue_to_kareegar);
    const docs = vijayStockData["data"];

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
      {screenWidth > 953 ? (
          <div className="text-xl border-transparent flex justify-between items-center">

            <div className="flex flex-col mt-5">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "1em",
              marginTop: "-1rem",
              }} className="text-center text-[#00203FFF]" >
                Vijay Kareegar Book
              </div>
              <div className="text-left mt-5">
              <Tooltip title="Print Table" placement="bottomLeft">
                  <PrinterOutlined style={{ fontSize: '200%', color:"#1f2937"}} onClick={handlePrint}/>
              </Tooltip>
              </div>
              
              </div>

          </div>
          ) : screenWidth > 500 ? (
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >Vijay Kareegar Book</div>

            ): (
              <div style={{
                fontSize: '250%',
                fontWeight: 'bolder',
                lineHeight: "2em",
                }} className="text-center text-[#00203FFF]" >Vijay Kareegar Book</div>
        )}

      <Modal
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <VijayKareegarBookUpdate
          handleOk={handleUpdateClose}
          textData={editModalData}
          />
      </Modal>

      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">Vijay - Vijay Kareegar Book</div>}

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
            Vijay - Vijay Kareegar Book - {dayjs().format("DD-MMMM-YYYY")}
          </div>
        )}
        summary={() => {
          return (
            <>
              <Table.Summary.Row className="footer-row font-bold	text-center text-lg bg-[#ABD6DFFF]">
                <Table.Summary.Cell index={0} className="" colSpan={1}>Total</Table.Summary.Cell> 
                {/* <Table.Summary.Cell index={1}></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={2}></Table.Summary.Cell> */}
                <Table.Summary.Cell index={1}>
                  {tarpattaRecvBalance}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={2}>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                  {/* {totalWeightQuantity} */}
                  {issueBalance}
                  </Table.Summary.Cell>
                {/* <Table.Summary.Cell index={5}>
                  {totalIssueQuantity}
                </Table.Summary.Cell> */}
                  <Table.Summary.Cell index={5}>
                  {receiveBalance}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={6}>
                {bhukaBalance}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  {lossBalance}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}></Table.Summary.Cell>
                {/* <Table.Summary.Cell index={9}></Table.Summary.Cell> */}
                
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

export default VijayKareegarBook;