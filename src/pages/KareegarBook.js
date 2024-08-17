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
import { fetchKareegarBookList, deleteKareegarBookList } from "../api/kareegarBook.js";
import KareegarAddItems from "../components/KareegarAddItems.js"
import '../style/pages.css';
import Loading from "../components/Loading.js";
import { EditOutlined, DeleteOutlined, LeftOutlined , PlusCircleOutlined, BarsOutlined, SearchOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import { getKareegarData, updateKareegarBalance } from "../api/kareegarDetail.js";
import KaareegarChangeBoxWt from "../components/KareegarChangeBoxWt.js"
import KaareegarClose from "../components/KareegarClose.js";
import { deleteLossAcctList, fetchLossAcctList } from "../api/LossAcct.js";

const KareegarBook = ({ kareegarId , kareegarName, setKareegarDetailsPage }) => {
  const screenWidth = window.innerWidth;
  const [page] = useState(1);
  const [itemsPerPage] = useState(100000000); // Change this to show all
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullData, setFullData] = useState([]);
  // const [todayData, setTodayData] = useState([]);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalLossQuantity, setTotalLossQty] = useState(0);
  const [totalBeadsIssueQuantity, setTotalBeadsIssueQty] = useState(0);
  const [totalBeadsRecvQuantity, setTotalBeadsRecvQty] = useState(0);
  const [boxWt, setBoxWt] = useState(0);
  // const [closingBalance, setClosingBalance] = useState(0);

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

  const handleOpeningChange = (event) => {
    // console.log(event.target.value, isNaN(event.target.value))
    if (!isNaN(parseFloat(event.target.value))){
      // console.log(event.target.value, parseFloat(event.target.value))
      // setOpeningBalance(parseFloat(event.target.value));
      // console.log(openingBalance);
      // setClosingBalance((parseFloat(event.target.value) + parseFloat(totalIssueQuantity) - parseFloat(totalRecvQuantity) - parseFloat(totalLossQuantity)).toFixed(2));
      // console.log((parseFloat(openingBalance) + parseFloat(totalRecvQuantity) - parseFloat(totalIssueQuantity)).toFixed(3));
      // console.log(openingBalance, closingBalance);
    }
    else{
      // setOpeningBalance(0);
      // setClosingBalance((parseFloat(totalIssueQuantity) - parseFloat(totalRecvQuantity) - parseFloat(totalLossQuantity)).toFixed(2));
    }
  };

  async function updateRows (dataType){

    setIsLoading(true);
    const token = localStorage.getItem("token");
    const kareegarUtilityData =  await getKareegarData(page,itemsPerPage, token);
    const kareegarData = kareegarUtilityData.find(item => item._id === kareegarId);
    setBoxWt(kareegarData["boxWt"]);

    // send request to check authenticated
    const data = [];
    const deleted_data = [];
    const currentDateData = [];
    const today = dayjs();
    // console.log("data", data)

    const docs = await fetchKareegarBookList(page, itemsPerPage, kareegarId, token);
    setFullData(docs);

    for (let eachEntry in docs) {
      if (docs[eachEntry].is_deleted_flag){
        deleted_data.push(docs[eachEntry]);
      }
      else{
        data.push(docs[eachEntry]);
        if (today.isSame(dayjs(docs[eachEntry].date), 'day')){
          currentDateData.push(docs[eachEntry]);
        }
      }
    }
    if (dataType === "all"){
      docs.reverse();
      setRows(docs);
      let totalIssueQty = 0.0;
      let totalRecvQty = 0.0;
      let totalLossQty = 0.0;
      let totalBeadsIssueQty = 0.0;
      let totalBeadsRecvQty = 0.0;
      data.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
        // console.log(weight24k, receive22k, issue22k, loss22k);
        if (isNaN(parseFloat(issue_wt))) {
          issue_wt = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(recv_wt))) {
          recv_wt = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(loss_wt))){
          loss_wt = 0 // Set it to zero if it's NaN
        }
        if (isNaN(parseFloat(beads_issue_wt))){
          beads_issue_wt = 0  // Set it to zero if it's NaN
        }
        if (isNaN(parseFloat(beads_recv_wt))){
          beads_recv_wt = 0  // Set it to zero if it's NaN
        }
        totalIssueQty += parseFloat(issue_wt);
        totalRecvQty += parseFloat(recv_wt);
        totalLossQty += parseFloat(loss_wt);
        totalBeadsIssueQty += parseFloat(beads_issue_wt);
        totalBeadsRecvQty += parseFloat(beads_recv_wt);
      });
      // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
      setTotalIssueQty(totalIssueQty.toFixed(2));
      setTotalRecvQty(totalRecvQty.toFixed(2));
      setTotalLossQty(totalLossQty.toFixed(2));
      setTotalBeadsIssueQty(totalBeadsIssueQty.toFixed(2));
      setTotalBeadsRecvQty(totalBeadsRecvQty.toFixed(2));
  
    }
    else if (dataType === "valid"){
      data.reverse();

      // setRows(currentDateData);
      setRows(data);
      let totalIssueQty = 0.0;
      let totalRecvQty = 0.0;
      let totalLossQty = 0.0;
      let totalBeadsIssueQty = 0.0;
      let totalBeadsRecvQty = 0.0;
      data.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
        // console.log(weight24k, receive22k, issue22k, loss22k);
        if (isNaN(parseFloat(issue_wt))) {
          issue_wt = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(recv_wt))) {
          recv_wt = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(loss_wt))){
          loss_wt = 0 // Set it to zero if it's NaN
        }
        if (isNaN(parseFloat(beads_issue_wt))){
          beads_issue_wt = 0  // Set it to zero if it's NaN
        }
        if (isNaN(parseFloat(beads_recv_wt))){
          beads_recv_wt = 0  // Set it to zero if it's NaN
        }
        totalIssueQty += parseFloat(issue_wt);
        totalRecvQty += parseFloat(recv_wt);
        totalLossQty += parseFloat(loss_wt);
        totalBeadsIssueQty += parseFloat(beads_issue_wt);
        totalBeadsRecvQty += parseFloat(beads_recv_wt);
      });
      // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
      setTotalIssueQty(totalIssueQty.toFixed(2));
      setTotalRecvQty(totalRecvQty.toFixed(2));
      setTotalLossQty(totalLossQty.toFixed(2));
      setTotalBeadsIssueQty(totalBeadsIssueQty.toFixed(2));
      setTotalBeadsRecvQty(totalBeadsRecvQty.toFixed(2));
  
    }
    else if (dataType === "today"){
      setRows(currentDateData);
      let totalIssueQty = 0.0;
      let totalRecvQty = 0.0;
      let totalLossQty = 0.0;
      let totalBeadsIssueQty = 0.0;
      let totalBeadsRecvQty = 0.0;
      currentDateData.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
        // console.log(weight24k, receive22k, issue22k, loss22k);
        if (isNaN(parseFloat(issue_wt))) {
          issue_wt = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(recv_wt))) {
          recv_wt = 0; // Set it to zero if it's NaN
        } 
        if (isNaN(parseFloat(loss_wt))){
          loss_wt = 0 // Set it to zero if it's NaN
        }
        if (isNaN(parseFloat(beads_issue_wt))){
          beads_issue_wt = 0  // Set it to zero if it's NaN
        }
        if (isNaN(parseFloat(beads_recv_wt))){
          beads_recv_wt = 0  // Set it to zero if it's NaN
        }
        totalIssueQty += parseFloat(issue_wt);
        totalRecvQty += parseFloat(recv_wt);
        totalLossQty += parseFloat(loss_wt);
        totalBeadsIssueQty += parseFloat(beads_issue_wt);
        totalBeadsRecvQty += parseFloat(beads_recv_wt);
      });
      // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
      setTotalIssueQty(totalIssueQty.toFixed(2));
      setTotalRecvQty(totalRecvQty.toFixed(2));
      setTotalLossQty(totalLossQty.toFixed(2));
      setTotalBeadsIssueQty(totalBeadsIssueQty.toFixed(2));
      setTotalBeadsRecvQty(totalBeadsRecvQty.toFixed(2));
     
    }
    else{
      deleted_data.reverse();
      setRows(deleted_data);
      let totalIssueQty = 0.0;
      let totalRecvQty = 0.0;
      let totalLossQty = 0.0;
      let totalBeadsIssueQty = 0.0;
      let totalBeadsRecvQty = 0.0;
      // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
      setTotalIssueQty(totalIssueQty.toFixed(2));
      setTotalRecvQty(totalRecvQty.toFixed(2));
      setTotalLossQty(totalLossQty.toFixed(2));
      setTotalBeadsIssueQty(totalBeadsIssueQty.toFixed(2));
      setTotalBeadsRecvQty(totalBeadsRecvQty.toFixed(2));
  
    }

    // setClosingBalance((totalIssueQty - totalRecvQty - totalLossQty).toFixed(2));
    setIsLoading(false);
  };

    useEffect(() => {
      const handleKeyDown = (event) => {
            // Check if the specific key combination is pressed
            if (event.key === 'Escape') { // Back Button
                event.preventDefault();
                setKareegarDetailsPage(true);
            }
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
          const kareegarUtilityData =  await getKareegarData(page, itemsPerPage, token);
          const kareegarData = kareegarUtilityData.find(item => item._id === kareegarId);
          setBoxWt(kareegarData["boxWt"])
    
        // send request to check authenticated
        const data = [];
        const deleted_data = [];
        const currentDateData = [];
        const today = dayjs();
        // console.log("data", data)

        const docs = await fetchKareegarBookList(page, itemsPerPage, kareegarId, token);
        setFullData(docs);
        // console.log("data", docs);
        for (let eachEntry in docs) {
          if (docs[eachEntry].is_deleted_flag){
            deleted_data.push(docs[eachEntry]);
          }
          else{
            data.push(docs[eachEntry]);
            if (today.isSame(dayjs(docs[eachEntry].date), 'day')){
              currentDateData.push(docs[eachEntry]);
            }
            // currentDateData.push()
          }
        }
        // data.reverse();
        currentDateData.reverse();
        setRows(currentDateData);

        let totalIssueQty = 0.0;
        let totalRecvQty = 0.0;
        let totalLossQty = 0.0;
        let totalBeadsIssueQty = 0.0;
        let totalBeadsRecvQty = 0.0;
        currentDateData.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
          // console.log(weight24k, receive22k, issue22k, loss22k);
          if (isNaN(parseFloat(issue_wt))) {
            issue_wt = 0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(recv_wt))) {
            recv_wt = 0; // Set it to zero if it's NaN
          } 
          if (isNaN(parseFloat(loss_wt))){
            loss_wt = 0 // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(beads_issue_wt))){
            beads_issue_wt = 0  // Set it to zero if it's NaN
          }
          if (isNaN(parseFloat(beads_recv_wt))){
            beads_recv_wt = 0  // Set it to zero if it's NaN
          }
          totalIssueQty += parseFloat(issue_wt);
          totalRecvQty += parseFloat(recv_wt);
          totalLossQty += parseFloat(loss_wt);
          totalBeadsIssueQty += parseFloat(beads_issue_wt);
          totalBeadsRecvQty += parseFloat(beads_recv_wt);
        });
        // console.log(totalWeight, totalRecvQty, totalIssueQty,  totalLossQty)
        setTotalIssueQty(totalIssueQty.toFixed(2));
        setTotalRecvQty(totalRecvQty.toFixed(2));
        setTotalLossQty(totalLossQty.toFixed(2));
        setTotalBeadsIssueQty(totalBeadsIssueQty.toFixed(2));
        setTotalBeadsRecvQty(totalBeadsRecvQty.toFixed(2));
    
        // setClosingBalance((totalIssueQty - totalRecvQty - totalLossQty).toFixed(2));
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
  const [isBoxWtModalOpen, setIsBoxWtModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const showBoxWtModal = () => {
    setIsBoxWtModalOpen(true);
  }

  const showCompleteModal = () => {
    setIsCompleteModalOpen(true);
  }

  const showDeletePopup = (text) => {
    setIsDeleteModalOpen(true)
  }

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const data =  await getKareegarData(page, itemsPerPage, token);
    const kareegarData = data.find(item => item._id === kareegarId);
    let balance = parseFloat(kareegarData["balance"]);
    let beads_balance = parseFloat(kareegarData["beads_balance"]);
    // console.log(kareegarData, balance);
    const lossAcctData = await fetchLossAcctList(page, itemsPerPage, token);
    const lossIds = [];
    console.log(lossAcctData);
    console.log(selectedRowKeys);

    const docs = await fetchKareegarBookList(page, itemsPerPage, kareegarId, token);

    selectedRowKeys.map((item, index) => {
      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["_id"] === item && !docs[i]["is_deleted_flag"]){
          // console.log("row", docs[i]);
          if (docs[i]["type"] === "Issue"){
              balance -= parseFloat(docs[i]["issue_wt"]);
              if (docs[i]["beads_issue_wt"] !== "" && !isNaN(docs[i]["beads_issue_wt"])){
                beads_balance -= parseFloat(docs[i]["beads_issue_wt"]);
              }
          }
          else if (docs[i]["type"] === "Receive"){
            balance += parseFloat(docs[i]["recv_wt"]);
            if (docs[i]["beads_recv_wt"] !== "" && !isNaN(docs[i]["beads_recv_wt"])){
              beads_balance += parseFloat(docs[i]["beads_recv_wt"]);
            }
          }
          else{
            balance -= parseFloat(docs[i]["issue_wt"]);
            if (docs[i]["beads_issue_wt"] !== "" && !isNaN(docs[i]["beads_issue_wt"])){
              beads_balance -= parseFloat(docs[i]["beads_issue_wt"]);
            }
            balance += parseFloat(docs[i]["recv_wt"]);
            if (docs[i]["beads_recv_wt"] !== "" && !isNaN(docs[i]["beads_recv_wt"])){
              beads_balance += parseFloat(docs[i]["beads_recv_wt"]);
            }
          }
          if (docs[i]["loss_wt"] !== "" && !isNaN(docs[i]["loss_wt"])) {
            balance += parseFloat(docs[i]["loss_wt"]);
            const matchedData = lossAcctData.find(row => row.transactionId === item && row.type === "Kareegar")
            console.log(item, matchedData, docs[i]);
            if (matchedData){
              lossIds.push(matchedData._id);  
            }
          }
          // console.log("balance", balance, beads_balance);
        }
      }
    })

    console.log(lossIds);
    const deleteFromLossAcct = {
      lossId: lossIds,
    }
    await deleteLossAcctList(deleteFromLossAcct, token);
    
    const kareegarBalanceData = {
      '_id': kareegarId,
      "balance": balance.toFixed(2),
      "beads_balance": beads_balance.toFixed(2)
    }
    console.log(balance);
    await updateKareegarBalance(kareegarBalanceData, token);

    const kareegarBookId = {
      "kareegarBookId": selectedRowKeys
    }
    
    // console.log(meltingBookId);
    await deleteKareegarBookList(kareegarBookId, token);

    updateRows("today");
    setSelectedRowKeys([]);
    setIsDeleteModalOpen(false);
    setIsLoading(false);
  }
  const handleCancel = () => {
    // updateRows("valid");
    setIsBoxWtModalOpen(false);
    setIsModalOpen(false);
    setIsCompleteModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleUpdateClose = () => {
    updateRows("today");
    setIsBoxWtModalOpen(false);
    setIsModalOpen(false);
    setIsCompleteModalOpen(false);
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
      width: '10%',
      sortDirections: ['ascend', "descend", 'ascend'],
      ...getColumnSearchProps('date'),
    },
    {
      title: "Type",
      dataIndex: "type",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
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
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '11%',
      ...getColumnSearchProps('category'),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: text => (
        <div style={{ minWidth:'140px', maxWidth: '140px', overflow: 'auto'}}>
          {text}
        </div>
      ),
      width: '14%',
      ...getColumnSearchProps('description'),
    },
    {
      title: "Net Weight Metal (gm)	",
      children: [
        {
          title: "Issue",
          dataIndex: "issue_wt",
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
          title: "Receive",
          dataIndex: "recv_wt",
          render: text => (
            <div style={{minWidth: '140px', maxWidth: '140px', whiteSpace:"nowrap !important", textAlign: 'center'}} className="whitespace-nowrap">
              {text}
            </div>
          ),
          width: '10%',
          ...getColumnSearchProps('receive22k'),    
          align: 'right',
        },
        {
          title: "Loss",
          dataIndex: "loss_wt",
          render: text => (
            <div style={{minWidth: '140px', maxWidth: '140px', whiteSpace:"nowrap !important", textAlign: 'center'}} className="whitespace-nowrap">
              {text}
            </div>
          ),
          width: '10%',
          ...getColumnSearchProps('loss22k'),
          align: 'right',
        }
      ]
    },
    {
      title: "Beads(Pc)	",
      children: [
        {
          title: "Issue",
          dataIndex: "beads_issue_wt",
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
          title: "Receive",
          dataIndex: "beads_recv_wt",
          render: text => (
            <div style={{minWidth: '140px', maxWidth: '140px', whiteSpace:"nowrap !important", textAlign: 'center'}} className="whitespace-nowrap">
              {text}
            </div>
          ),
          width: '10%',
          ...getColumnSearchProps('receive22k'),  
          align: 'right',  
        }
      ]
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
        {screenWidth > 800 ? (
          <>
            <div className="text-xl border-transparent flex justify-between items-center">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "3em",
              marginTop: "-3rem",
              }} className="text-center text-[#00203FFF]" >
                <LeftOutlined onClick={() => setKareegarDetailsPage(true)}/>
                {kareegarName}
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex justify-between items-center h-12">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 h-12 font-medium bg-[#ABD6DFFF] p-2 flex items-center">
                  Box Weight:
                    <input className="ml-4 mr-4 text-[#00203FFF] text-right w-24 px-2 text-lg h-7 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " onChange={handleOpeningChange} value={boxWt}/>
                    <Tooltip title="Edit Box Wt" placement="top">
                      <EditOutlined style={{ fontSize: "125%" }} onClick={showBoxWtModal}/>
                    </Tooltip>
                  </span>
                  <Tooltip title="Add" placement="topRight">
                    <PlusCircleOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="w-12 place-content-end" onClick={showModal} />
                  </Tooltip>
                </div>
                <div className="mt-1 flex justify-between items-center h-12">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 font-medium bg-[#ABD6DFFF] h-12 p-2">
                  Close Daily Account: <PlusCircleOutlined className="ml-12 float-end" style={{ fontSize:"125%"}} onClick={showCompleteModal}/> 
                   {/* <input className="ml-3 text-[#00203FFF] text-lg	h-7 text-right px-2 w-32 border-current border-0 bg-[#ABD6DFFF] outline-blue-50 outline focus:ring-offset-white focus:ring-white focus:shadow-white " readOnly={true} value={closingBalance}/> */}
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
          <LeftOutlined onClick={() => setKareegarDetailsPage(true)}/>
                
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >{kareegarName}</div>

          <div className="text-xl border-b-8 border-transparent border-t-4 pt-4	border-transparent flex justify-between items-center">
            <PlusCircleOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="w-1/2" onClick={showModal} />
            <DeleteOutlined style={{ fontSize: '175%', color:"#1f2937"}} className="place-content-end	w-28" onClick={showDeletePopup} />
          </div>
          <div className="border-b-8 border-t-8 border-transparent text-xl flex justify-end items-center">
            <span className="text-[#00203FFF] whitespace-nowrap font-medium w-full bg-[#ABD6DFFF] p-2">
              <span className="relative top-1">
              Box Weight:
              </span>
              <span className="float-end">
                <input className="text-[#00203FFF] text-right px-2 w-24 border-current	border-0 bg-[#ABD6DFFF] outline-blue-50 outline" onChange={handleOpeningChange} value={boxWt}/>
                <EditOutlined className="relative top-1 ml-2" style={{ fontSize: "140%" }} onClick={showBoxWtModal}/>
              </span>
            </span>
          </div>
          <div className="	text-xl flex justify-end items-center">
              <span className="text-[#00203FFF] font-medium	 w-full bg-[#ABD6DFFF] p-2">
                Close Daily Account: <PlusCircleOutlined className=" float-end" style={{ fontSize:"140%"}} onClick={showCompleteModal}/> 
              </span>
            </div>
          </>
        )}

      <Modal
        title="Add Item"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <KareegarAddItems
          kareegarId={kareegarId}
          handleOk={handleUpdateClose}
          />
      </Modal>

      <Modal
      title="Change Box Weight"
      open={isBoxWtModalOpen}
      onCancel={handleCancel}
      footer={null}
      >
        <KaareegarChangeBoxWt
        kareegarId={kareegarId}
        handleOk={handleUpdateClose}
        />
      </Modal>

      <Modal
      title="Close Daily Account"
      open={isCompleteModalOpen}
      onCancel={handleCancel}
      footer={null}
      >
        <KaareegarClose
        kareegarId={kareegarId}
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
                {/* <Table.Summary.Cell index={4}></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={5}></Table.Summary.Cell> */}
                {/* <Table.Summary.Cell index={6}></Table.Summary.Cell> */}
                <Table.Summary.Cell index={7}></Table.Summary.Cell>
                <Table.Summary.Cell index={8}>
                  {totalIssueQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={9}>
                  {totalRecvQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={10}>
                  {totalLossQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={11}>
                  {totalBeadsIssueQuantity}
                </Table.Summary.Cell>
                <Table.Summary.Cell index={12}>
                  {totalBeadsRecvQuantity}
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

export default KareegarBook;