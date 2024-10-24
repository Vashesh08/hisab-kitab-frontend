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
import '../../style/pages.css';
import Loading from "../../components/Loading.js";
import { EditOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { fetchVijayStockList } from "../../api/vijayBook.js";
import VijayTarPattaBookUpdate from "../../components/Vijay/VijayTarPattaBookUpdate.js";

const VijayTarPattaBook = () => {
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
  const [meltingWtBalance, setMeltingWtBalance] = useState(0);

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
    
    const docs = await fetchVijayStockList(page, itemsPerPage, token);
    setFullData(docs);

    for (let eachEntry in docs) {
      if (docs[eachEntry].is_melting_deleted_flag || (isNaN(docs[eachEntry].meltingReceive))){
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

    let totalMeltingWeight = 0.000;
    let totalRecvQty = 0.0;
    let totalIssueQty = 0.0;
    let totalLossQty = 0.0;
    let totalBhukaQty = 0.0;
    data.forEach(({ meltingReceive, tarpattaReceive, tarpattaIssue, tarpattaBhuka, tarpattaLoss}) => {
      // console.log(meltingWeight, meltingReceive, meltingIssue, meltingLoss);
      if (isNaN(parseFloat(tarpattaReceive))) {
        tarpattaReceive = [0]; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(tarpattaIssue))) {
        tarpattaIssue = [0]; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(meltingReceive))){
        meltingReceive = 0; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(tarpattaLoss))){
        tarpattaLoss = 0; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(tarpattaBhuka))){
        tarpattaBhuka = [0]; // Set it to zero if it's NaN
      }
      // const sumOfWeights = meltingWeight.map(Number).reduce((acc, curr) => acc + curr, 0);
      // console.log(sumOfWeights);
      const sumOfTarpattaIssue = tarpattaIssue.map(Number).reduce((acc, curr) => acc + curr, 0);
      const sumOfTarpattaReceive = tarpattaReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
      const sumOfTarpattaBhuka = tarpattaBhuka.map(Number).reduce((acc, curr) => acc + curr, 0);
      
      totalMeltingWeight += parseFloat(meltingReceive);
      totalRecvQty += parseFloat(sumOfTarpattaReceive);
      totalIssueQty += parseFloat(sumOfTarpattaIssue);
      totalBhukaQty += parseFloat(sumOfTarpattaBhuka);
      totalLossQty += parseFloat(tarpattaLoss);
    });
    // console.log("sum", totalWeight, totalRecvQty, totalIssueQty, totalIssueQty,  totalLossQty)
    setMeltingWtBalance(totalMeltingWeight.toFixed(2));
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
        
        const docs = await fetchVijayStockList(page, itemsPerPage, token);
        setFullData(docs);
        // console.log("data", docs);
        for (let eachEntry in docs) {
          if (docs[eachEntry].is_melting_deleted_flag || (isNaN(docs[eachEntry].meltingReceive))){
              deleted_data.push(docs[eachEntry]);
          }
          else{
            data.push(docs[eachEntry]);
          }
        }
        data.reverse();
        setRows(data);

        let totalMeltingWeight = 0.000;
        let totalRecvQty = 0.0;
        let totalIssueQty = 0.0;
        let totalLossQty = 0.0;
        let totalBhukaQty = 0.0;
        data.forEach(({ meltingReceive, tarpattaReceive, tarpattaIssue, tarpattaBhuka, tarpattaLoss}) => {
          // console.log(meltingWeight, meltingReceive, meltingIssue, meltingLoss);
          // console.log( meltingReceive, tarpattaReceive, tarpattaIssue, tarpattaBhuka, tarpattaLoss);
          if (isNaN(parseFloat(tarpattaReceive))) {
            tarpattaReceive = [0]; // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(tarpattaIssue))) {
            tarpattaIssue = [0]; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(meltingReceive))){
            meltingReceive = 0 // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(tarpattaLoss))){
            tarpattaLoss = 0  // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(tarpattaBhuka))){
            tarpattaBhuka = [0]; // Set it to zero if it's NaN
          }
          // const sumOfWeights = meltingWeight.map(Number).reduce((acc, curr) => acc + curr, 0);
          // console.log(sumOfWeights);
          const sumOfTarpattaIssue = tarpattaIssue.map(Number).reduce((acc, curr) => acc + curr, 0);
          const sumOfTarpattaReceive = tarpattaReceive.map(Number).reduce((acc, curr) => acc + curr, 0);
          const sumOfTarpattaBhuka = tarpattaBhuka.map(Number).reduce((acc, curr) => acc + curr, 0);
          
          totalMeltingWeight += parseFloat(meltingReceive);
          totalRecvQty += parseFloat(sumOfTarpattaReceive);
          totalIssueQty += parseFloat(sumOfTarpattaIssue);
          totalBhukaQty += parseFloat(sumOfTarpattaBhuka);
          totalLossQty += parseFloat(tarpattaLoss);
              
        });
        // console.log("sum", totalWeight, totalRecvQty, totalIssueQty, totalIssueQty,  totalLossQty)
        setMeltingWtBalance(totalMeltingWeight.toFixed(2));
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
    console.log("addpopup", text);
    setEditModalData(text);
    console.log("updateData",editModalData);
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
      ) : dataIndex === "tarpattaWeight" ?(
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
      ) : dataIndex === "tarpattaPurity" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "tarpattaConversion" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "tarpattaCategory" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"left"}}>{eachText}</div>
        )
        )
      ): dataIndex === "tarpattaIssue" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"left"}}>{eachText}</div>
        )
        )
      ): dataIndex === "tarpattaReceive" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"left"}}>{eachText}</div>
        )
        )
      ): dataIndex === "tarpattaBhuka" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"left"}}>{eachText}</div>
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
      title: "Melting Wt",
      dataIndex: "meltingReceive",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('meltingReceive'),
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
        <div style={{minWidth: '85px', maxWidth: '85px',  overflow: 'auto', textAlign: 'center'}}>
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
        <div style={{minWidth: '125px', maxWidth: '125px',  overflow: 'auto', textAlign: 'center'}}>
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
      dataIndex: "tarpattaLoss",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('tarpattaLoss'),
      align: 'right',
    },
    {
      title: "Assigned To",
      dataIndex: "issue_to_kareegar",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '10%',
      align: 'center',
      ...getColumnSearchProps('issue_to_kareegar'),
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

  const SelectAll = () => {
    const array = [];

    rows.forEach( function(number){
      if (number.is_melting_deleted_flag === false){
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
      disabled: record.is_melting_deleted_flag === true,
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
    return record.is_melting_deleted_flag ? 'striked-row delete' : i % 2 ? "odd" : "even";
  };

  if (isLoading){
    return <Loading />
  }

  return (
    <div>
      {screenWidth > 953 ? (
          <div className="text-xl border-transparent flex justify-between items-center">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "3em",
              marginTop: "-3rem",
              }} className="text-center text-[#00203FFF]" >
                Vijay TarPatta Book
              </div>
          </div>
          ) : screenWidth > 500 ? (
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >Vijay TarPatta Book</div>

            ): (
              <div style={{
                fontSize: '250%',
                fontWeight: 'bolder',
                lineHeight: "2em",
                }} className="text-center text-[#00203FFF]" >Vijay TarPatta Book</div>
        )}

      <Modal
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <VijayTarPattaBookUpdate
          handleOk={handleUpdateClose}
          textData={editModalData}
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
                <Table.Summary.Cell index={0} className="" colSpan={1}>Total</Table.Summary.Cell> 
                {/* <Table.Summary.Cell index={1}></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={2}></Table.Summary.Cell> */}
                <Table.Summary.Cell index={1}>
                  {meltingWtBalance}
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

export default VijayTarPattaBook;