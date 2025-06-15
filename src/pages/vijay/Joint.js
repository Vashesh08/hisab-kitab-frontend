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
import { EditOutlined, BarsOutlined, SearchOutlined, PrinterOutlined } from "@ant-design/icons";
import { fetchVijayStockList } from "../../api/vijayBook.js";
import VijayJointUpdate from "../../components/Vijay/VijayJointUpdate.js";

const Joint = () => {
  const screenWidth = window.innerWidth;
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Change this to show all
  const [totalCount, setTotalCount] = useState(0);
  const [dataState, setDataState] = useState("valid");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalData, setEditModalData] = useState([]);
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);

  const fetchRecords = async (page, pageSize) => {
    setPage(page);
    setItemsPerPage(pageSize);
  };
  
  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Vijay Joint Book - ' + dayjs().format("DD-MM-YYYY"),
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
    
    const vijayStockData = await fetchVijayStockList(page, itemsPerPage, token, dataType, "all", "false", "true");
    const docs = vijayStockData["data"];
    const count = vijayStockData["count"];

    setRows(docs);
    setTotalCount(count);

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

    let allData = await fetchVijayStockList(1, Number.MAX_SAFE_INTEGER, token, dataState, "all", "false", "true");
    let docs = allData["data"];

    docs.forEach(function (user){
      if (user[dataIndex]){
        if (dataIndex === "jointDate"){
          if (getFormattedDate(user[dataIndex]).toString().toLowerCase().includes(selectedKeys[0].toString().toLowerCase())){
            array.push(user);
          }
        }
        else{
          const value = user[dataIndex];
          if(Array.isArray(value)
              ? value[user["index"]] !== "-1" && value[user["index"]].toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
              : value !== "-1" && value.toString().toLowerCase().includes(selectedKeys[0].toLowerCase())
            ){
              array.push(user);
            }
        }}
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
    render: (text, record) =>
      dataIndex === "jointDate" ? (
        searchedColumn === dataIndex ? (<Highlighter
          highlightStyle={{
            backgroundColor: '#ffc069',
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={getFormattedDate(text[record.index]) ? getFormattedDate(text[record.index]).toString() : ''}
        />
        ) : (
            <div style={{textAlign:"right"}}>{getFormattedDate(text[record.index])}</div>
      )) : dataIndex === "solderChainReceive" ?(
          (text === "-1" || text === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "solderChainReceive" ? (
              (text).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text}</div>
                ))
      ) : dataIndex === "jointLotNo" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointLotNo" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ) : dataIndex === "jointChainIssue" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointChainIssue" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
    ) : dataIndex === "jointItem" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointItem" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ) : dataIndex === "jointMelting" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointMelting" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ): dataIndex === "jointChainReceive" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointChainReceive" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ): dataIndex === "jointBhuka" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointBhuka" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ): dataIndex === "jointTotal" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointTotal" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ): dataIndex === "jointPowder" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointPowder" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ): dataIndex === "jointR1" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointR1" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                ))
      ): dataIndex === "jointR2" ?(
          (text[record.index] === "-1" || text[record.index] === undefined) ?(
            <div style={{textAlign:"right"}}></div>
          ):(
            searchedColumn === "jointR2" ? (
              (text[record.index]).toString().includes(searchText)? (
                <div>
                  <Highlighter
                highlightStyle={{
                  backgroundColor: '#ffc069',
                  padding: 0,
                }}
                searchWords={[searchText]}
                autoEscape
                textToHighlight={text[record.index]}
                />
                </div>
              ) : (
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
                  )
                ):(
            <div style={{textAlign:"right"}}>{text[record.index]}</div>
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
      title: "Kareegar",
      dataIndex: "issue_to_kareegar",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('issue_to_kareegar'),
      align: 'center',
    },
    {
      title: "Solder Chain(R)",
      dataIndex: "solderChainReceive",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('solderChainReceive'),
      align: 'center',
    },
    {
      title: "Date",
      dataIndex: "jointDate",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('jointDate'),
      align: 'right',
    },
    {
      title: "Lot No",
      dataIndex: "jointLotNo",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '9%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('jointLotNo'),
      align: 'right',
    },
    {
      title: "Item",
      dataIndex: "jointItem",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('jointItem'),
    },
    {
      title: "Melting",
      dataIndex: "jointMelting",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('jointMelting'),
      align: 'right',
    },
    {
      title: "Chain(I)",
      dataIndex: "jointChainIssue",
      render: text => (
        <div style={{minWidth: '85px', maxWidth: '85px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('jointChainIssue'),
      align: 'right',
    },
    {
      title: "Chain(R)",
      dataIndex: "jointChainReceive",
      render: text => (
        <div style={{minWidth: '125px', maxWidth: '125px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('jointChainReceive'),
      align: 'right',
    },
    {
      title: "Bhuka",
      dataIndex: "jointBhuka",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('jointBhuka'),
      align: 'right',
    },
    {
      title: "Total",
      dataIndex: "jointTotal",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      align: 'center',
      ...getColumnSearchProps('jointTotal'),
    },
    {
      title: "Powder",
      dataIndex: "jointPowder",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      align: 'center',
      ...getColumnSearchProps('jointPowder'),
    },
    {
      title: "R1",
      dataIndex: "jointR1",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      align: 'center',
      ...getColumnSearchProps('jointR1'),
    },
    {
      title: "R2",
      dataIndex: "jointR2",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      align: 'center',
      ...getColumnSearchProps('jointR2'),
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

    const vijayStockData = await fetchVijayStockList(1, Number.MAX_SAFE_INTEGER, token, "valid", "all", "false", "true");
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
                Vijay Joint Book
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
              }} className="text-center text-[#00203FFF]" >Vijay Joint Book</div>

            ): (
              <div style={{
                fontSize: '250%',
                fontWeight: 'bolder',
                lineHeight: "2em",
                }} className="text-center text-[#00203FFF]" >Vijay Joint Book</div>
        )}

      <Modal
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <VijayJointUpdate
          handleOk={handleUpdateClose}
          textData={editModalData}
          />
      </Modal>

      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">Vijay Joint Book</div>}

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
            Vijay Joint Book - {dayjs().format("DD-MMMM-YYYY")}
          </div>
        )}
      />

      </div>
      
      <Divider />
    </div>
  );
};

export default Joint;