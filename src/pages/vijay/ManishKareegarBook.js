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
import ManishKareegarBookUpdate from "../../components/Vijay/ManishKareegarBookUpdate.js";

const ManishKareegarBook = () => {
  const screenWidth = window.innerWidth;
  const [page] = useState(1);
  const [itemsPerPage] = useState(100000000); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editModalData, setEditModalData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [issueBalance, setIssueBalance] = useState(0);
  const [receiveBalance, setReceiveBalance] = useState(0);
  const [bhukaBalance, setBhukaBalance] = useState(0);
  const [lossBalance, setLossBalance] = useState(0);
  const [tarpattaRecvBalance, setTarpattaRecvBalance] = useState(0);
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);

  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Vijay - Manish Kareegar Book - ' + dayjs().format("DD-MM-YYYY"),
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

    setIsLoading(true);
    const token = localStorage.getItem("token");
    // send request to check authenticated
    const data = [];
    const deleted_data = [];
    // console.log("data", data)
    
    const allData = await fetchVijayStockList(page, itemsPerPage, token);
    const docs = allData.filter(item => item.issue_to_kareegar === "Manish");
    setFullData(docs);

    for (let eachEntry in docs) {
      if (docs[eachEntry].is_deleted_flag || (isNaN(docs[eachEntry].meltingReceive))){
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

    let totalTarpattaRecv = 0.000;
    let totalRecvQty = 0.0;
    let totalIssueQty = 0.0;
    let totalLossQty = 0.0;
    let totalBhukaQty = 0.0;
    data.forEach(({ tarpattaReceive, manishReceive, manishIssue, manishBhuka, manishLoss}) => {
      // console.log(meltingWeight, meltingReceive, meltingIssue, meltingLoss);
      if (isNaN(parseFloat(tarpattaReceive))) {
        tarpattaReceive = [0]; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(manishIssue))) {
        manishIssue = [0]; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(manishReceive))){
        manishReceive = [0]; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(manishLoss))){
        manishLoss = 0; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(manishBhuka))){
        manishBhuka = [0]; // Set it to zero if it's NaN
      }
      // const sumOfWeights = meltingWeight.map(Number).reduce((acc, curr) => acc + curr, 0);
      // console.log(sumOfWeights);
      const sumOfTarpattaReceive = tarpattaReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
      const sumOfManishIssue = manishIssue.map(Number).reduce((acc, curr) => acc + curr, 0);
      const sumOfManishReceive = manishReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
      const sumOfManishBhuka = manishBhuka.map(Number).reduce((acc, curr) => acc + curr, 0);
      
      totalTarpattaRecv += parseFloat(sumOfTarpattaReceive);
      totalRecvQty += parseFloat(sumOfManishReceive);
      totalIssueQty += parseFloat(sumOfManishIssue);
      totalBhukaQty += parseFloat(sumOfManishBhuka);
      totalLossQty += parseFloat(manishLoss);
    });
    // console.log("sum", totalWeight, totalRecvQty, totalIssueQty, totalIssueQty,  totalLossQty)
    setTarpattaRecvBalance(totalTarpattaRecv.toFixed(2));
    setReceiveBalance(totalRecvQty.toFixed(2));
    setIssueBalance(totalIssueQty.toFixed(2));
    setBhukaBalance(totalBhukaQty.toFixed(2));
    setLossBalance(totalLossQty.toFixed(2));
    
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
        
        const allData = await fetchVijayStockList(page, itemsPerPage, token);
        const docs = allData.filter(item => item.issue_to_kareegar === "Manish");
        setFullData(docs);
        // console.log("data", docs);
        for (let eachEntry in docs) {
          if (docs[eachEntry].is_deleted_flag || (isNaN(docs[eachEntry].meltingReceive))){
              deleted_data.push(docs[eachEntry]);
          }
          else{
            data.push(docs[eachEntry]);
          }
        }
        data.reverse();
        setRows(data);

        let totalTarpattaRecv = 0.000;
        let totalRecvQty = 0.0;
        let totalIssueQty = 0.0;
        let totalLossQty = 0.0;
        let totalBhukaQty = 0.0;
        data.forEach(({ tarpattaReceive, manishReceive, manishIssue, manishBhuka, manishLoss}) => {
          // console.log(meltingWeight, meltingReceive, meltingIssue, meltingLoss);
          if (isNaN(parseFloat(manishReceive))) {
            manishReceive = [0]; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(manishIssue))) {
            manishIssue = [0]; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(manishReceive))){
            manishReceive = [0]; // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(manishLoss))){
            manishLoss = 0; // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(manishBhuka))){
            manishBhuka = [0]; // Set it to zero if it's NaN
          }
          // const sumOfWeights = meltingWeight.map(Number).reduce((acc, curr) => acc + curr, 0);
          // console.log(sumOfWeights);
          const sumOfTarpattaReceive = tarpattaReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
          const sumOfManishIssue = manishIssue.map(Number).reduce((acc, curr) => acc + curr, 0);
          const sumOfManishReceive = manishReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
          const sumOfManishBhuka = manishBhuka.map(Number).reduce((acc, curr) => acc + curr, 0);
          
          totalTarpattaRecv += parseFloat(sumOfTarpattaReceive);
          totalRecvQty += parseFloat(sumOfManishReceive);
          totalIssueQty += parseFloat(sumOfManishIssue);
          totalBhukaQty += parseFloat(sumOfManishBhuka);
          totalLossQty += parseFloat(manishLoss);
        });
        // console.log("sum", totalWeight, totalRecvQty, totalIssueQty, totalIssueQty,  totalLossQty)
        setTarpattaRecvBalance(totalTarpattaRecv.toFixed(2));
        setReceiveBalance(totalRecvQty.toFixed(2));
        setIssueBalance(totalIssueQty.toFixed(2));
        setBhukaBalance(totalBhukaQty.toFixed(2));
        setLossBalance(totalLossQty.toFixed(2));
        // setClosingBalance((openingBalance + totalIssueQty - totalRecvQty - totalLossQty).toFixed(2));

        setIsLoading(false);
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
  const handleSearch = (selectedKeys, confirm, dataIndex, close) => {
    // console.log(selectedKeys, confirm, dataIndex)

    // updateRows("valid");
    const array = [];

    fullData.forEach(function (user){
      if (user[dataIndex]){
        if (dataIndex === "manishDate"){
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
      dataIndex === "manishDate" ? (
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
      ) : dataIndex === "manishWeight" ?(
        // searchedColumn === dataIndex ? (<Highlighter
        //   highlightStyle={{
        //     backgroundColor: '#ffc069',
        //     padding: 0,
        //   }}
        //   searchWords={[searchText]}
        //   autoEscape
        //   textToHighlight={text ? (
        //     text.join("\n")
        //   ) : ''}
        //   />
        // ) : (
          text && text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )
        // )
      ) : dataIndex === "manishPurity" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "manishConversion" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "manishCategory" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"left"}}>{eachText}</div>
        )
        )
        
      ): dataIndex === "manishIssue" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ): dataIndex === "tarpattaReceive" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ): dataIndex === "manishReceive" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ): dataIndex === "manishBhuka" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
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
      dataIndex: "manishDate",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '9%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('manishDate'),
    },
    {
      title: "Description",
      dataIndex: "manishDescription",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('manishDescription'),
    },
    {
      title: "Issue",
      dataIndex: "manishIssue",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('manishIssue'),
      align: 'right',
    },
    {
      title: "Receive",
      dataIndex: "manishReceive",
      render: text => (
        <div style={{minWidth: '85px', maxWidth: '85px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('manishReceive'),
      align: 'right',
    },
    {
      title: "Bhuka",
      dataIndex: "manishBhuka",
      render: text => (
        <div style={{minWidth: '125px', maxWidth: '125px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('manishBhuka'),
      align: 'right',
    },
    // {
    //   title: "Issue Wt (F)",
    //   dataIndex: "meltingIssue",
    //   render: text => (
    //     <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
    //       {text}
    //     </div>
    //   ),
    //   width: '10%',
    //   ...getColumnSearchProps('meltingIssue'),
    // },
    {
      title: "Loss",
      dataIndex: "manishLoss",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('manishLoss'),
      align: 'right',
    },
    // {
    //   title: "Assigned To",
    //   dataIndex: "issue_to_kareegar",
    //   render: text => (
    //     <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
    //       {text}
    //     </div>
    //   ),
    //   width: '10%',
    //   align: 'center',
    //   ...getColumnSearchProps('issue_to_kareegar'),
    // },
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
      {screenWidth > 953 ? (
          <div className="text-xl border-transparent flex justify-between items-center">

            <div className="flex flex-col mt-5">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "1em",
              marginTop: "-1rem",
              }} className="text-center text-[#00203FFF]" >
                Manish Kareegar Book
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
              }} className="text-center text-[#00203FFF]" >Manish Kareegar Book</div>

            ): (
              <div style={{
                fontSize: '250%',
                fontWeight: 'bolder',
                lineHeight: "2em",
                }} className="text-center text-[#00203FFF]" >Manish Kareegar Book</div>
        )}

      <Modal
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <ManishKareegarBookUpdate
          handleOk={handleUpdateClose}
          textData={editModalData}
          />
      </Modal>

      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">Vijay - Manish Kareegar Book</div>}

      <Table
        rowSelection={rowSelection}
        columns={columns}
        rowClassName={getRowClassName}
        dataSource={rows}
        rowKey="_id"
        scroll={{ x: 'calc(100vh - 4em)' }}
        pagination={isPaginationEnabled ? 
          { defaultPageSize: 10, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100', '1000']} : 
          false
        }
        footer={isPaginationEnabled ? false : () => (
          <div className="print-footer">
            Vijay - Manish Kareegar Book - {dayjs().format("DD-MMMM-YYYY")}
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

export default ManishKareegarBook;