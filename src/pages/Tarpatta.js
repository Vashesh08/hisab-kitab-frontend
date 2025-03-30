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
import { fetchMeltingBookList } from "../api/meltingBook.js";
import '../style/pages.css';
import Loading from "../components/Loading.js";
// import MeltingBookUpdate from "../components/MeltingBookUpdate.js";
import TarpattaBookUpdate from "../components/TarpattaBookUpdate.js";
import { EditOutlined, BarsOutlined, SearchOutlined, PrinterOutlined } from "@ant-design/icons";
import dayjs from 'dayjs'; 
import { Tooltip } from 'antd';

const Tarpatta = () => {
  const screenWidth = window.innerWidth;
  const [page] = useState(1);
  const [itemsPerPage] = useState(100000000); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateData, setUpdateData] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [totalMeltingReceiveQty, setTotalMeltingReceiveQty] = useState(0);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [totalBhukaQty, setTotalBhukaQty] = useState(0);
  const [totalLossQuantity, setTotalLossQty] = useState(0);
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);
  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Tarpatta Book - ' + dayjs().format("DD-MM-YYYY"),
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


    let totalBhukaQty = 0.000;
    let totalRecvQty = 0.0;
    let totalIssueQty = 0.0;
    let totalLossQty = 0.0;
    let totalMeltingRecvQty = 0.0;
    data.forEach(({ receive22k, tarpattaIssue, tarpattaReceive, tarpattaBhuka, tarpattaLoss}) => {
      // console.log(weight24k, receive22k, issue22k, loss22k);
      if (isNaN(parseFloat(tarpattaIssue))) {
        tarpattaIssue = [0]; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(receive22k))) {
        receive22k = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(tarpattaReceive))) {
        tarpattaReceive = [0]; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(tarpattaLoss))){
        tarpattaLoss = 0 // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(tarpattaBhuka))){
        tarpattaBhuka = [0]  // Set it to zero if it's NaN
      }
      const totalIssue = tarpattaIssue.map(Number).reduce((acc, curr) => acc + curr, 0);
      const totalReceive = tarpattaReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
      const totalBhuka = tarpattaBhuka.map(Number).reduce((acc, curr) => acc + curr, 0);
      
      totalMeltingRecvQty += parseFloat(receive22k);
      totalIssueQty += parseFloat(totalIssue);
      totalRecvQty += parseFloat(totalReceive);
      totalBhukaQty += parseFloat(totalBhuka);
      totalLossQty += parseFloat(tarpattaLoss);

      // console.log(sumOfWeights);
    });
    // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
    setTotalRecvQty(totalRecvQty.toFixed(2));
    setTotalIssueQty(totalIssueQty.toFixed(2));
    setTotalLossQty(totalLossQty.toFixed(2));
    setTotalBhukaQty(totalBhukaQty.toFixed(2));
    setTotalMeltingReceiveQty(totalMeltingRecvQty.toFixed(2));
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

        let totalBhukaQty = 0.000;
        let totalRecvQty = 0.0;
        let totalIssueQty = 0.0;
        let totalLossQty = 0.0;
        let totalMeltingRecvQty = 0.0;
        data.forEach(({ receive22k, tarpattaIssue, tarpattaReceive, tarpattaBhuka, tarpattaLoss}) => {
          // console.log(weight24k, receive22k, issue22k, loss22k);
          if (isNaN(parseFloat(tarpattaIssue))) {
            tarpattaIssue = [0]; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(receive22k))) {
            receive22k = 0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(tarpattaReceive))) {
            tarpattaReceive = [0]; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(tarpattaLoss))){
            tarpattaLoss = 0 // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(tarpattaBhuka))){
            tarpattaBhuka = [0]  // Set it to zero if it's NaN
          }
          const totalIssue = tarpattaIssue.map(Number).reduce((acc, curr) => acc + curr, 0);
          const totalReceive = tarpattaReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
          const totalBhuka = tarpattaBhuka.map(Number).reduce((acc, curr) => acc + curr, 0);
          
          totalMeltingRecvQty += parseFloat(receive22k);
          totalIssueQty += parseFloat(totalIssue);
          totalRecvQty += parseFloat(totalReceive);
          totalBhukaQty += parseFloat(totalBhuka);
          totalLossQty += parseFloat(tarpattaLoss);

          // console.log(sumOfWeights);
        });
        // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
        setTotalRecvQty(totalRecvQty.toFixed(2));
        setTotalIssueQty(totalIssueQty.toFixed(2));
        setTotalLossQty(totalLossQty.toFixed(2));
        setTotalBhukaQty(totalBhukaQty.toFixed(2));
        setTotalMeltingReceiveQty(totalMeltingRecvQty.toFixed(2));
        // setClosingBalance((openingBalance + totalIssueQty - totalRecvQty - totalLossQty).toFixed(2));

        setIsLoading(false);
    })();
  
    }, [page, itemsPerPage]);


  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);  

  const showAddPopup = (text) => {
    // console.log(text);
    setIsEditModalOpen(true);
    setUpdateData(text)
  };

  const handleCancel = () => {
    // updateRows("valid");
    setIsEditModalOpen(false);
    setUpdateData([]);
  };

  const handleUpdateClose = () => {
    updateRows("valid");
    setIsEditModalOpen(false);
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
        if (dataIndex === "tarpattaDate"){
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
      dataIndex === "tarpattaDate" ? (
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
      ) : dataIndex === "weight24k" ?(
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
      ) : dataIndex === "tarpattaBhuka" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "tarpattaIssue" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "tarpattaReceive" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"left"}}>{eachText}</div>
        )
        )
      ): dataIndex === "tarpattaDescription" ?(
          <div style={{textAlign:"left"}}>{text}</div>
      ): dataIndex === "tarpattaLoss" ?(
        <div style={{textAlign:"left"}}>{text}</div>
      ): (
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
      title: "Melting Receive",
      dataIndex: "receive22k",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('receive22k'),
      align: 'right',
    },
    {
      title: "Date",
      dataIndex: "tarpattaDate",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '9%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('tarpattaDate'),
    },
    {
      title: "Description",
      dataIndex: "tarpattaDescription",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('tarpattaDescription'),
    },
    {
      title: "Issue",
      dataIndex: "tarpattaIssue",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('tarpattaIssue'),
      align: 'right',
    },
    {
      title: "Receive",
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
      title: "Bhuka",
      dataIndex: "tarpattaBhuka",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('tarpattaBhuka'),
      align: 'right',
    },
    {
      title: "Loss",
      dataIndex: "tarpattaLoss",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('tarpattaLoss'),
      align: 'right',
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      
      render: (text, record, index) => (
        <>
          {text.is_deleted_flag ? (
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
        {screenWidth > 953 ? (
          <>
            <div className="text-xl border-transparent flex justify-between items-center">
            
            <div className="flex flex-col mt-5">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "1em",
              marginTop: "-1rem",
              }} className="text-center text-[#00203FFF]" >
                Tarpatta Book
              </div>
              <div className="text-left mt-5">
              <Tooltip title="Print Table" placement="bottomLeft">
                  <PrinterOutlined style={{ fontSize: '200%', color:"#1f2937"}} onClick={handlePrint}/>
              </Tooltip>
              </div>
              
              </div>


            </div>
            <br/>
          </>
        ) : screenWidth > 500 ? (
          <>
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >Tarpatta Book</div>

          </>
        ): (
          <>
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >Tarpatta Book</div>

          </>
        )}


      <Modal
        title="Add Tarpatta Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <TarpattaBookUpdate
          handleOk={handleUpdateClose}
          textData={updateData}
          />
      </Modal>

      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">Tarpatta Book</div>}

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
            Tarpatta Book - {dayjs().format("DD-MMMM-YYYY")}
          </div>
        )}
        summary={() => {
          return (
            <>
              <Table.Summary.Row className="footer-row font-bold	text-center text-lg bg-[#ABD6DFFF]">
                <Table.Summary.Cell index={0} className="" colSpan={1}>Total</Table.Summary.Cell>
                {/* <Table.Summary.Cell index={1}></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={2}></Table.Summary.Cell> */}
                <Table.Summary.Cell index={3}>
                  {totalMeltingReceiveQty}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={4}>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={5}>
                  {/* {totalWeightQuantity} */}
                </Table.Summary.Cell>
                {/* <Table.Summary.Cell index={5}>
                  {totalIssueQuantity}
                </Table.Summary.Cell> */}
                <Table.Summary.Cell index={6}>
                  {totalIssueQuantity}
                  {/* Add Total Issue Weight {totalIssueQuantity} */}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={7}>
                  {totalRecvQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  {totalBhukaQty}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  {totalLossQuantity}
                </Table.Summary.Cell>
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

export default Tarpatta;