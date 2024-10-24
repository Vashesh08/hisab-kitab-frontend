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
import { getUtilityData, updateUtility } from "../../api/utility.js"; 
// import { fetchGovindMeltingBookList, deleteGovindMeltingBookList } from "../../api/govind/govindMeltingBook.js";
import VijayMeltingBookAdd from  "../../components/Vijay/VijayMeltingBookAdd.js";
import '../../style/pages.css';
import Loading from "../../components/Loading.js";
import VijayMeltingBookUpdate from "../../components/Vijay/VijayMeltingBookUpdate.js";
// import MeltingBookUpdate from "../../components/MeltingBookUpdate.js";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import { deleteLossAcctList, fetchLossAcctList } from "../../api/LossAcct.js";
// import { deleteLossAcctList, fetchLossAcctList } from "../../api/LossAcct.js";
import { fetchVijayStockList, deleteVijayMeltingStockList } from "../../api/vijayBook.js";

const VijayMeltingBook = () => {
  const screenWidth = window.innerWidth;
  const [page] = useState(1);
  const [itemsPerPage] = useState(100000000); // Change this to show all
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
  const [opening995Balance, setOpening995Balance] = useState(0);
  const [closing995Balance, setClosing995Balance] = useState(0);
  const [opening100Balance, setOpening100Balance] = useState(0);
  const [closing100Balance, setClosing100Balance] = useState(0);

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

    setIsLoading(true);
    const token = localStorage.getItem("token");
    // send request to check authenticated
    const data = [];
    const deleted_data = [];
    // console.log("data", data)
    
    const balanceData = await getUtilityData(token);
    setOpeningBalance(parseFloat(balanceData[0]["meltingBookOpeningBalance"]).toFixed(2));
    setClosingBalance(parseFloat(balanceData[0]["meltingBookClosingBalance"]).toFixed(2));
    setOpening995Balance(parseFloat(balanceData[0]["meltingBookOpening995Balance"]).toFixed(2));
    setClosing995Balance(parseFloat(balanceData[0]["meltingBookClosing995Balance"]).toFixed(2));
    setOpening100Balance(parseFloat(balanceData[0]["meltingBookOpening100Balance"]).toFixed(2));
    setClosing100Balance(parseFloat(balanceData[0]["meltingBookClosing100Balance"]).toFixed(2));

    const docs = await fetchVijayStockList(page, itemsPerPage, token);
    setFullData(docs);

    for (let eachEntry in docs) {
      if (docs[eachEntry].is_melting_deleted_flag){
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
    data.forEach(({ meltingWeight, meltingReceive, meltingIssue, meltingIssueActual, meltingLoss}) => {
      // console.log(meltingWeight, meltingReceive, meltingIssue, meltingLoss);
      if (isNaN(parseFloat(meltingReceive))) {
        meltingReceive = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(meltingIssue))) {
        meltingIssue = 0; // Set it to zero if it's NaN
      } 
      if (isNaN(parseFloat(meltingWeight))){
        meltingWeight = 0; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(meltingLoss))){
        meltingLoss = 0; // Set it to zero if it's NaN
      }
      if (isNaN(parseFloat(meltingIssueActual))){
        meltingIssueActual = 0; // Set it to zero if it's NaN
      }
      const sumOfWeights = meltingWeight.map(Number).reduce((acc, curr) => acc + curr, 0);
      // console.log(sumOfWeights);
      totalWeight += parseFloat(sumOfWeights);
      totalRecvQty += parseFloat(meltingReceive);
      totalIssueQty += parseFloat(meltingIssue);
      totalIssueActualQty += parseFloat(meltingIssueActual);
      totalLossQty += parseFloat(meltingLoss);
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
        const handleKeyDown = (event) => {
            // Check if the specific key combination is pressed
            if ((event.ctrlKey && event.key === 'q') || (event.ctrlKey && event.key === 'Q')) { // Ctrl + S
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
        // console.log("data", data)

        const balanceData = await getUtilityData(token);
        setOpeningBalance(parseFloat(balanceData[0]["meltingBookOpeningBalance"]).toFixed(2));
        setClosingBalance(parseFloat(balanceData[0]["meltingBookClosingBalance"]).toFixed(2))
        setOpening995Balance(parseFloat(balanceData[0]["meltingBookOpening995Balance"]).toFixed(2));
        setClosing995Balance(parseFloat(balanceData[0]["meltingBookClosing995Balance"]).toFixed(2));
        setOpening100Balance(parseFloat(balanceData[0]["meltingBookOpening100Balance"]).toFixed(2));
        setClosing100Balance(parseFloat(balanceData[0]["meltingBookClosing100Balance"]).toFixed(2));
    
        const docs = await fetchVijayStockList(page, itemsPerPage, token);
        setFullData(docs);
        // console.log("data", docs);
        for (let eachEntry in docs) {
          if (docs[eachEntry].is_melting_deleted_flag){
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
        data.forEach(({ meltingWeight, meltingReceive, meltingIssue, meltingIssueActual, meltingLoss}) => {
          // console.log(meltingWeight, meltingReceive, meltingIssue, meltingLoss);
          if (isNaN(parseFloat(meltingReceive))) {
            meltingReceive = 0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(meltingIssue))) {
            meltingIssue = 0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(meltingWeight))){
            meltingWeight = 0 // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(meltingLoss))){
            meltingLoss = 0  // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(meltingIssueActual))){
            meltingIssueActual = 0; // Set it to zero if it's NaN
          }
          const sumOfWeights = meltingWeight.map(Number).reduce((acc, curr) => acc + curr, 0);
          // console.log(sumOfWeights);
          totalWeight += parseFloat(sumOfWeights);
          totalRecvQty += parseFloat(meltingReceive);
          totalIssueQty += parseFloat(meltingIssue);
          totalIssueActualQty += parseFloat(meltingIssueActual);
          totalLossQty += parseFloat(meltingLoss);
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

    // Clean up the event listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
  
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
    const lossAcctData = await fetchLossAcctList(page, itemsPerPage, token);
    const lossIds = [];
    
    let currMeltingBookClosingBalance = parseFloat(balanceData[0]["meltingBookClosingBalance"])
    let currMeltingBookClosing995Balance = parseFloat(balanceData[0]["meltingBookClosing995Balance"])
    let currMeltingBookClosing100Balance = parseFloat(balanceData[0]["meltingBookClosing100Balance"])

    const docs = await fetchVijayStockList(page, itemsPerPage, token);

    // console.log(selectedRowKeys, rows);
    selectedRowKeys.map((item, index) => {

      const matchedData = lossAcctData.find(row => row.transactionId === item && row.type === "Melting")
      if (matchedData){
        lossIds.push(matchedData._id);
      }

      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["_id"] === item && !docs[i]["is_melting_deleted_flag"]) {
          // console.log(rows[i]);

            docs[i]["meltingWeight"].forEach((element, index) => {
              console.log(element)
              if (docs[i]["meltingCategory"][index] === "Gold"){
                if (parseFloat(docs[i]["meltingPurity"][index]) === 99.5){
                  currMeltingBookClosing995Balance += parseFloat(element);
                }
                else if (parseFloat(docs[i]["meltingPurity"][index]) === 100){
                  currMeltingBookClosing100Balance += parseFloat(element);
                }
                else{
                  currMeltingBookClosingBalance += parseFloat(element);
                }
              }
            });
        }
        }
      }
    )

    const deleteFromLossAcct = {
      lossId: lossIds,
    }
    await deleteLossAcctList(deleteFromLossAcct, token);

    const utilityData = {
      _id: balanceData[0]["_id"],
      meltingBookClosingBalance: currMeltingBookClosingBalance,
      meltingBookClosing995Balance: currMeltingBookClosing995Balance,
      meltingBookClosing100Balance: currMeltingBookClosing100Balance,
    }
    await updateUtility(utilityData, token);

    // console.log(meltingBookId);
    await deleteVijayMeltingStockList(meltingBookId, token);

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
      dataIndex === "meltingDate" ? (
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
      ) : dataIndex === "meltingWeight" ?(
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
      ) : dataIndex === "meltingPurity" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "meltingConversion" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"right"}}>{eachText}</div>
        )
        )
      ) : dataIndex === "meltingCategory" ?(
        text && text.map((eachText) => (
          <div style={{textAlign:"left"}}>{eachText}</div>
        )
        )
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
      title: "Date",
      dataIndex: "meltingDate",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto'}}>
          {getFormattedDate(text)}
        </div>
      ),
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
      width: '9%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('meltingDate'),
    },
    {
      title: "Category",
      dataIndex: "meltingCategory",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"left"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('meltingCategory'),
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
      dataIndex: "meltingWeight",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('meltingWeight'),
      align: 'right',
    },
    {
      title: "Purity",
      dataIndex: "meltingPurity",
      render: text => (
        <div style={{ minWidth: '85px', maxWidth: '85px', overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('meltingPurity'),
      align: 'right',
    },
    {
      title: "Conversion",
      dataIndex: "meltingConversion",
      render: text => (
        <div style={{minWidth: '125px', maxWidth: '125px',  overflow: 'auto', textAlign: 'center'}}>
          {text.map((eachText) => (
            <div style={{textAlign:"right"}}>{eachText}</div>
          )
          )}
        </div>
      ),
      width: '9%',
      ...getColumnSearchProps('meltingConversion'),
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
      title: "Issue Wt",
      dataIndex: "meltingIssueActual",
      render: text => (
        <div style={{ minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '10%',
      ...getColumnSearchProps('meltingIssueActual'),
      align: 'right',
    },
    {
      title: "Receive Wt",
      dataIndex: "meltingReceive",
      render: text => (
        <div style={{minWidth: '140px', maxWidth: '140px', whiteSpace:"nowrap !important", textAlign: 'center'}} className="whitespace-nowrap">
          {text}
        </div>
      ),
      width: '15%',
      ...getColumnSearchProps('meltingReceive'),
      align: 'right',
    },
    {
      title: "Loss Qty",
      dataIndex: "meltingLoss",
      render: text => (
        <div style={{minWidth: '120px', maxWidth: '120px', overflow: 'auto', textAlign: 'center'}}>
          {text}
        </div>
      ),
      width: '12%',
      ...getColumnSearchProps('meltingLoss'),
      align: 'right',
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      
      render: (text, record, index) => (
        <>
          {text.is_melting_receiver_updated || text.is_melting_deleted_flag ? (
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
          <>
            <div className="text-xl border-transparent flex justify-between items-center">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "3em",
              marginTop: "-3rem",
              }} className="text-center text-[#00203FFF]" >
                Vijay Melting Book
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex justify-between items-center h-10">
                <div className="rounded text-[#00203FFF] whitespace-nowrap w-auto font-medium h-10 bg-[#ABD6DFFF] p-1 border-white border-x-2 border-y-1 flex items-center justify-center">
                    <span className="!w-48 !h-10 !text-[#00203FFF] !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    Purity
                    </span>
                    <span className="!w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    99.5
                    </span>
                    <span className="!w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    100
                    </span>
                    <span className="!w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1">
                    Others
                    </span>
                  </div>
                    <Tooltip title="Add" placement="topRight">
                    <PlusCircleOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showModal} />
                  </Tooltip>
                </div>
                <div className="flex justify-end h-10 mr-12">
                <div className="rounded text-[#00203FFF] whitespace-nowrap w-auto h-10 font-light	bg-[#ABD6DFFF] p-1 border-white border-x-2 border-y-1 flex items-center justify-center">
                    <span className="!w-48 !h-10 !text-[#00203FFF] font-medium !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    Opening Balance
                    </span>
                    <span className="overflow-auto !w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    {opening995Balance}
                    </span>
                    <span className="overflow-auto !w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    {opening100Balance}
                    </span>
                    <span className="overflow-auto !w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1">
                    {openingBalance}
                    </span>
                  </div>
                    {/* <Tooltip title="Delete" placement="bottomRight">
                    <DeleteOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="place-content-end	w-12" onClick={showDeletePopup}/>
                  </Tooltip> */}
                </div>
                <div className="mt-1 flex justify-end h-10">
                <div className="rounded text-[#00203FFF] whitespace-nowrap w-auto h-10 font-light	bg-[#ABD6DFFF] p-1 border-white border-x-2 border-y-1 flex items-center justify-center">
                    <span className="!w-48 !h-10 !text-[#00203FFF] font-medium !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    Remaining Balance
                    </span>
                    <span className="overflow-auto !w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    {closing995Balance}
                    </span>
                    <span className="overflow-auto !w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    {closing100Balance}
                    </span>
                    <span className="overflow-auto !w-24 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1">
                    {closingBalance}
                    </span>
                  </div>
                    <Tooltip title="Delete" placement="bottomRight">
                    <DeleteOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="place-content-end	w-12" onClick={showDeletePopup}/>
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
              }} className="text-center text-[#00203FFF]" >Vijay Melting Book</div>

          <div className="text-xl border-b-8 border-transparent border-t-4 pt-4	border-transparent flex justify-between items-center">
            <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="w-1/2" onClick={showModal} />
            <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="place-content-end	w-28" onClick={showDeletePopup} />
          </div>
          
          <div className="rounded text-[#00203FFF] whitespace-nowrap w-auto h-10 font-medium bg-[#ABD6DFFF] p-1 border-white border-2 flex items-center justify-center">
            <span className="!w-2/5 text-left !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            Purity
            </span>
            <span className="!w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            99.5
            </span>
            <span className="!w-1/5	text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            100
            </span>
            <span className="!w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1">
            Others
            </span>
          </div>
          <div className="rounded text-[#00203FFF] whitespace-nowrap w-auto h-10 font-light bg-[#ABD6DFFF] p-1 border-white border-2 flex items-center justify-center">
            <span className="!w-2/5 font-medium text-left !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            Opening Balance
            </span>
            <span className="overflow-auto !w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            {opening995Balance}
            </span>
            <span className="overflow-auto !w-1/5	text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            {opening100Balance}
            </span>
            <span className="overflow-auto !w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1">
            {openingBalance}
            </span>
          </div>
          <div className="rounded text-[#00203FFF] whitespace-nowrap w-auto h-10 font-light bg-[#ABD6DFFF] p-1 border-white border-2 flex items-center justify-center">
            <span className="!w-2/5 font-medium text-left !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            Closing Balance
            </span>
            <span className="overflow-auto !w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            {closing995Balance}
            </span>
            <span className="overflow-auto !w-1/5	text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            {closing100Balance}
            </span>
            <span className="overflow-auto !w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1">
            {closingBalance}
            </span>
          </div>
          </>
        ): (
          <>
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >Vijay Melting Book</div>

          <div className="text-xl border-b-8 border-transparent border-t-4 pt-4	border-transparent flex justify-between items-center">
            <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="w-1/2" onClick={showModal} />
            <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="place-content-end	w-28" onClick={showDeletePopup} />
          </div>
          <div className="text-[#00203FFF] whitespace-nowrap w-auto h-10 font-medium bg-[#ABD6DFFF] p-2 border-white border-2 flex items-center justify-center">
            <span className="overflow-x-auto !w-1/4 flex items-center justify-center text-left !h-10 !text-[#00203FFF] py-2 pr-10 pl-5 border-r-white border-r-2">
            Purity
            </span>
            <span className="!w-1/4 flex items-center justify-center text-right !h-10 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            99.5
            </span>
            <span className="!w-1/4	flex items-center justify-center text-right !h-10 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            100
            </span>
            <span className="!w-1/4 flex items-center justify-center text-right !h-10 !text-[#00203FFF] py-2 pr-2 pl-10">
            Others
            </span>
          </div>
          <div className="text-[#00203FFF] !h-20 whitespace-nowrap w-auto font-light bg-[#ABD6DFFF] p-2 border-white border-2 flex items-center justify-center">
            <span className="overflow-x-auto !w-1/4 font-medium flex items-center justify-center text-left !h-20 !text-[#00203FFF] whitespace-break-spaces py-2 pl-8 pr-8 border-r-white border-r-2">
            Opening Balance
            </span>
            <span className="!w-1/4 flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            {opening995Balance}
            </span>
            <span className="!w-1/4	flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            {opening100Balance}
            </span>
            <span className="!w-1/4 flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10">
            {openingBalance}
            </span>
          </div>
          <div className="text-[#00203FFF] !h-20 whitespace-nowrap w-auto font-light bg-[#ABD6DFFF] p-2 border-white border-2 flex items-center justify-center">
            <span className="overflow-x-auto !w-1/4 font-medium flex items-center justify-center text-left !h-20 !text-[#00203FFF] whitespace-break-spaces py-2 pl-4 border-r-white border-r-2">
            Remaining Balance
            </span>
            <span className="overflow-x-auto !w-1/4 flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            {closing995Balance}
            </span>
            <span className="overflow-x-auto !w-1/4	flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            {closing100Balance}
            </span>
            <span className="overflow-x-auto !w-1/4 flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10">
            {closingBalance}
            </span>
          </div>
          </>
        )}

      <Modal
        title="Add Item To Vijay Melting Book"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <VijayMeltingBookAdd
          handleOk={handleUpdateClose}
          closingBalance={parseFloat(closingBalance)}
          setClosingBalance={setClosingBalance}
          setClosing995Balance={setClosing995Balance}
          setClosing100Balance={setClosing100Balance}
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
      <VijayMeltingBookUpdate
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
                {/* <Table.Summary.Cell index={5}>
                  {totalIssueQuantity}
                </Table.Summary.Cell> */}
                <Table.Summary.Cell index={6}>
                  {totalIssueActualQuantity}
                  {/* Add Total Issue Weight {totalIssueQuantity} */}
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

export default VijayMeltingBook;