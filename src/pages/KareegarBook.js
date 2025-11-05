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
import { fetchKareegarBookList, deleteKareegarBookList } from "../api/kareegarBook.js";
import KareegarAddItems from "../components/KareegarAddItems.js";
import '../style/pages.css';
import Loading from "../components/Loading.js";
import { EditOutlined, DeleteOutlined, LeftOutlined, PrinterOutlined, PlusCircleOutlined, BarsOutlined, SearchOutlined, EnterOutlined } from "@ant-design/icons";
import { Tooltip } from 'antd';
import { closeKareegarBook } from "../api/kareegarBook.js";
import { getKareegarData, updateKareegarBalance, updateKareegarDetail } from "../api/kareegarDetail.js";
import KaareegarChangeBoxWt from "../components/KareegarChangeBoxWt.js";
import KaareegarClose from "../components/KareegarClose.js";
import { deleteLossAcctList, fetchLossAcctList } from "../api/LossAcct.js";
import KareegarBookUpdate from "../components/KareegarBookUpdate.js";
import { Select } from 'antd';
import { postKareegarBook } from "../api/kareegarBook.js";
import { postLossAcct } from "../api/LossAcct.js";
import PrintModel from "../components/PrintModel.js";
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

const KareegarBook = ({ kareegarId , kareegarName, setKareegarDetailsPage }) => {
  const screenWidth = window.innerWidth;
  const [initialLoad, setInitialLoad] = useState(true);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(20); // Change this to show allAdd commentMore actions
  const [totalCount, setTotalCount] = useState(0);
  const [dataState, setDataState] = useState("valid");
  const [rows, setRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [fullData, setFullData] = useState([]);
  const [updateData, setUpdateData] = useState([]);
  const [totalIssueQuantity, setTotalIssueQty] = useState(0);
  const [totalRecvQuantity, setTotalRecvQty] = useState(0);
  const [totalLossQuantity, setTotalLossQty] = useState(0);
  const [totalBeadsIssueQuantity, setTotalBeadsIssueQty] = useState(0);
  const [totalBeadsRecvQuantity, setTotalBeadsRecvQty] = useState(0);
  const [boxWt, setBoxWt] = useState(0);
  const [dateSelectOption, setDateSelectOption] = useState([]);
  const [currentSelectedDate, setCurrentSelectedDate] = useState(0);
  const latestDateValueRef = useRef();
  const componentRef = useRef(null);
  const [isPaginationEnabled, setIsPaginationEnabled] = useState(true);

  const fetchRecords = async (page, pageSize) => {
    setPage(page);
    setItemsPerPage(pageSize);
  };

  const handlePrintNow = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: kareegarName + ' Kareegar Book',
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

  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  const handlePrintUpdate = async(startDate, endDate) => {
    setIsLoading(true);
    setPage(1);
    await updateRows("valid", currentSelectedDate, startDate, endDate);
    setIsPaginationEnabled(false); // Disable pagination
    setIsPrintModalOpen(false);
  };
  
  // Handle Print Click
  const handlePrint = () => {
    setIsPrintModalOpen(true);
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

  const handleDateChange = (value) => {
    // console.log("value", value);
    if (!isNaN(parseFloat(value))){
      latestDateValueRef.current = value;
      setPage(1);
      setItemsPerPage(20);
      updateRows("valid", value);
    }
  };

  const handleOpeningChange = (event) => {
    if (!isNaN(parseFloat(event.target.value))){
    }
    else{
    }
  };

  async function updateRows (dataType, cutoffDateNumber, printStartDate = null, printEndDate = null){
    if (searchText !== ""){
      return;
    };
    setIsLoading(true);

    if (dataState !== dataType){
      setPage(1);
    };
    setDataState(dataType);

    if (cutoffDateNumber !== currentSelectedDate){
      setPage(1);
    }
    setCurrentSelectedDate(cutoffDateNumber);

    const token = localStorage.getItem("token");
    const kareegarDetails =  await getKareegarData(1,Number.MAX_SAFE_INTEGER, token);
    const kareegarUtilityData = kareegarDetails["data"];
    const kareegarData = kareegarUtilityData.find(item => item._id === kareegarId);
    setBoxWt(kareegarData["boxWt"]);

    // send request to check authenticated
    const currentDateData = [];
    const today = dayjs();

    const KareegarBookData = await fetchKareegarBookList(page, itemsPerPage, kareegarId, token, dataType, cutoffDateNumber);
    const docs = KareegarBookData["data"];
    const count = KareegarBookData["count"];
    const totalQty = KareegarBookData["totalQty"];
    setTotalCount(count);

    setRows(docs);

    if (totalQty[0]["issue_wt"] === null){
      setTotalIssueQty(Number(0).toFixed(2));
    }
    else{
      setTotalIssueQty(totalQty[0]["issue_wt"].toFixed(2));
    }

    if (totalQty[0]["recv_wt"] === null){
      setTotalRecvQty(Number(0).toFixed(2));
    }
    else{
      setTotalRecvQty(totalQty[0]["recv_wt"].toFixed(2));
    }

    if (totalQty[0]["loss_wt"] === null){
      setTotalLossQty(Number(0).toFixed(2));
    }
    else{
      setTotalLossQty(totalQty[0]["loss_wt"].toFixed(2));
    }
    
    if (totalQty[0]["beads_issue_wt"] === null){
      setTotalBeadsIssueQty(Number(0).toFixed(2));
    }
    else{
      setTotalBeadsIssueQty(totalQty[0]["beads_issue_wt"].toFixed(2));
    }
    
    if (totalQty[0]["beads_recv_wt"] === null){
      setTotalBeadsRecvQty(Number(0).toFixed(2));
    }
    else{
      setTotalBeadsRecvQty(totalQty[0]["beads_recv_wt"].toFixed(2));  
    }
    if (dataType === "today"){
      for (let eachEntry in docs) {
        if (!docs[eachEntry].is_deleted_flag){
          if (today.isSame(dayjs(docs[eachEntry].date), 'day')){
            currentDateData.push(docs[eachEntry]);
          }
        }
      }

      setRows(currentDateData);
    }

    if (printStartDate !== null && printEndDate !== null && printStartDate <= printEndDate) {
        const KareegarBookData = await fetchKareegarBookList(page, Number.MAX_SAFE_INTEGER, kareegarId, token, dataType, cutoffDateNumber);
        const docs = KareegarBookData["data"];
        const count = KareegarBookData["count"];
        const totalQty = KareegarBookData["totalQty"];
        setTotalCount(count);

        setRows(docs);

        if (totalQty[0]["issue_wt"] === null){
          setTotalIssueQty(Number(0).toFixed(2));
        }
        else{
          setTotalIssueQty(totalQty[0]["issue_wt"].toFixed(2));
        }

        if (totalQty[0]["recv_wt"] === null){
          setTotalRecvQty(Number(0).toFixed(2));
        }
        else{
          setTotalRecvQty(totalQty[0]["recv_wt"].toFixed(2));
        }

        if (totalQty[0]["loss_wt"] === null){
          setTotalLossQty(Number(0).toFixed(2));
        }
        else{
          setTotalLossQty(totalQty[0]["loss_wt"].toFixed(2));
        }
        
        if (totalQty[0]["beads_issue_wt"] === null){
          setTotalBeadsIssueQty(Number(0).toFixed(2));
        }
        else{
          setTotalBeadsIssueQty(totalQty[0]["beads_issue_wt"].toFixed(2));
        }
        
        if (totalQty[0]["beads_recv_wt"] === null){
          setTotalBeadsRecvQty(Number(0).toFixed(2));
        }
        else{
          setTotalBeadsRecvQty(totalQty[0]["beads_recv_wt"].toFixed(2));  
        }
        
      const printData = [];
      for (let eachEntry in docs) {
        if (
        dayjs(docs[eachEntry].date).isSameOrAfter(dayjs(printStartDate), 'day') &&
        dayjs(docs[eachEntry].date).isSameOrBefore(dayjs(printEndDate), 'day')
        ){
              printData.push(docs[eachEntry]);
          }
      }
      setRows(printData);
    };

    setIsLoading(false);
  };

  useEffect(() => {
    (async () => {
      if (!initialLoad){
        if (!isPrintModalOpen){
          updateRows(dataState, currentSelectedDate);
        };
      };
    })();
  }, [page, itemsPerPage]);

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
          if (searchText !== ""){
            return;
          };
        setIsLoading(true);
          
          const token = localStorage.getItem("token");
          const kareegarDetails =  await getKareegarData(1,Number.MAX_SAFE_INTEGER, token);
          const kareegarUtilityData = kareegarDetails["data"];
          const kareegarData = kareegarUtilityData.find(item => item._id === kareegarId);

          const startDates = Array.isArray(kareegarData.kareegarCutoffStartDate) && kareegarData.kareegarCutoffStartDate.length > 0 
          ? [...kareegarData.kareegarCutoffStartDate] 
          : [dayjs("2000-01-01")];

          const endDates = [...kareegarData.kareegarCutoffEndDate];

          endDates.push("");
          
          const combinedDates = [];
          for (let i = 0; i < startDates.length; i++) {
            combinedDates.push({ start: startDates[i], end: endDates[i] });
          }
          setDateSelectOption(combinedDates);

          latestDateValueRef.current = combinedDates.length;
          setCurrentSelectedDate(combinedDates.length);
          setInitialLoad(false);
          await updateRows(dataState, combinedDates.length);
          
          setBoxWt(kareegarData["boxWt"]);
        
        setIsLoading(false);
    })();

    // Clean up the event listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
    }, []);

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCutoffDateModalOpen, setIsCutoffDateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBoxWtModalOpen, setIsBoxWtModalOpen] = useState(false);
  const [isCompleteModalOpen, setIsCompleteModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  
  const showCutoffDateModal = (text) => {
    setIsCutoffDateModalOpen(true);
  }

  const showAddPopup = (text) => {
    setIsEditModalOpen(true);
    setUpdateData(text)
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

  const enterCutoffDate = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const today = dayjs();
    
    const data = [];
    const deleted_data = [];

    const allData = await fetchKareegarBookList(page, itemsPerPage, kareegarId, token, "valid", 0);
    const docs = allData["data"];
    const totalQty = allData["totalQty"];

    for (let eachEntry in docs) {
      if (docs[eachEntry].is_deleted_flag){
        deleted_data.push(docs[eachEntry]);
      }
      else{
        data.push(docs[eachEntry]);
      }
    }
    let totalIssueQty = 0.0;
    let totalRecvQty = 0.0;
    let totalLossQty = 0.0;
    let totalBeadsIssueQty = 0.0;
    let totalBeadsRecvQty = 0.0;

    if (totalQty[0]["issue_wt"] === null){
      totalIssueQty = Number(0).toFixed(2);
    }
    else{
      totalIssueQty = totalQty[0]["issue_wt"].toFixed(2);
    }

    if (totalQty[0]["recv_wt"] === null){
      totalRecvQty = Number(0).toFixed(2);
    }
    else{
      totalRecvQty = totalQty[0]["recv_wt"].toFixed(2);
    }

    if (totalQty[0]["loss_wt"] === null){
      totalLossQty = Number(0).toFixed(2);
    }
    else{
      totalLossQty = totalQty[0]["loss_wt"].toFixed(2);
    }
    
    if (totalQty[0]["beads_issue_wt"] === null){
      totalBeadsIssueQty = Number(0).toFixed(2);
    }
    else{
      totalBeadsIssueQty = totalQty[0]["beads_issue_wt"].toFixed(2);
    }
    
    if (totalQty[0]["beads_recv_wt"] === null){
      totalBeadsRecvQty = Number(0).toFixed(2);
    }
    else{
      totalBeadsRecvQty = totalQty[0]["beads_recv_wt"].toFixed(2);  
    }

    const backendData = {
      kareegar_id: kareegarId,
      type: "Loss",
      date: dayjs(today, "YYYY-MM-DD"),
      // date: currentDate,
      description: `Closing Monthly Acc - Loss, Beads Loss - ${parseFloat(totalBeadsIssueQty) - parseFloat(totalBeadsRecvQty)}`,
      loss_wt: (parseFloat(totalIssueQty) - parseFloat(totalRecvQty) - parseFloat(totalLossQty)).toFixed(2),
    }
    const updatedData = await postKareegarBook(backendData, token);

    const lossData = {
      "type": "Kareegar",
      "date": today,
      "lossWt": (parseFloat(totalIssueQty) - parseFloat(totalRecvQty) - parseFloat(totalLossQty)).toFixed(2),
      "transactionId": updatedData.kareegarBook_id, 
      "description": kareegarName + " Monthly Loss - " + getFormattedDate(today)
    }
    await postLossAcct(lossData, token)

    const kareegarDetails =  await getKareegarData(1,Number.MAX_SAFE_INTEGER, token);
    const kareegarUtilityData = kareegarDetails["data"];
    const kareegarData = kareegarUtilityData.find(item => item._id === kareegarId);
    //console.log(kareegarUtilityData,kareegarData);

    const updatedKareegarDetail = {
      kareegar_id: kareegarId,
      cutoffDateNumber: parseInt(kareegarData.kareegarCutoffDateNumber) + 1,
    }
    //console.log("updatedKareegarDetail",updatedKareegarDetail);
    await closeKareegarBook(updatedKareegarDetail, token);

    const newKareegarCutoffStartDate = [...kareegarData.kareegarCutoffStartDate];
    let startDateLength = newKareegarCutoffStartDate.length;

    const newKareegarCutoffEndDate = [...kareegarData.kareegarCutoffEndDate];
    let endDateLength = newKareegarCutoffStartDate.length;

    if (startDateLength > 0){
      newKareegarCutoffEndDate.push(today);
    }else{
      newKareegarCutoffStartDate.push(dayjs("2000-01-01"));
      newKareegarCutoffEndDate.push(today);
      newKareegarCutoffStartDate.push(today);
    }

    if (endDateLength > 0){
      newKareegarCutoffStartDate.push(newKareegarCutoffEndDate[newKareegarCutoffEndDate.length - 1]);
    }
    
    const kareegarBalanceData = {
      '_id': kareegarId,
      kareegarCutoffDateNumber: parseInt(kareegarData.kareegarCutoffDateNumber)+1,
      kareegarCutoffStartDate: newKareegarCutoffStartDate,
      kareegarCutoffEndDate: newKareegarCutoffEndDate,
    }
    // // console.log(balance);
    await updateKareegarDetail(kareegarBalanceData, token);
    updateRows("today", currentSelectedDate);
    setKareegarDetailsPage(true);
    setIsCutoffDateModalOpen(false);
    setIsLoading(false);
  }

  const deleteModal = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    const kareegarDetails =  await getKareegarData(1,Number.MAX_SAFE_INTEGER, token);
    const data = kareegarDetails["data"];
    const kareegarData = data.find(item => item._id === kareegarId);
    let balance = parseFloat(kareegarData["balance"]);
    let beads_balance = parseFloat(kareegarData["beads_balance"]);
    const lossAcctData = await fetchLossAcctList(page, itemsPerPage, token);
    const lossIds = [];

    const kareegarDetail =  await getKareegarData(1,Number.MAX_SAFE_INTEGER, token);
    const kareegarUtilityData = kareegarDetail["data"];
    const kareegarDetailData = kareegarUtilityData.find(item => item._id === kareegarId);

    const allData = await fetchKareegarBookList(page, itemsPerPage, kareegarId, token, "valid", kareegarDetailData.kareegarCutoffStartDate.length);
    const docs = allData["data"];

    selectedRowKeys.map((item, index) => {
      for (let i = 0; i < docs.length; i++) {
        if (docs[i]["_id"] === item && !docs[i]["is_deleted_flag"]){
          if (docs[i]["type"] === "Issue"){
              balance -= parseFloat(docs[i]["issue_wt"]);
              if (docs[i]["beads_issue_wt"] !== "" && !isNaN(docs[i]["beads_issue_wt"])){
                beads_balance -= parseFloat(docs[i]["beads_issue_wt"]);
              }

              // Receiving Later
              if (docs[i]["recv_wt"] !== "" && !isNaN(docs[i]["recv_wt"])){
                balance += parseFloat(docs[i]["recv_wt"]);
              }
              if (docs[i]["beads_recv_wt"] !== "" && !isNaN(docs[i]["beads_recv_wt"])){
                beads_balance += parseFloat(docs[i]["beads_recv_wt"]);
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
          if (!isNaN(docs[i]["loss_wt"]) && docs[i]["loss_wt"] !== "") {
            balance += parseFloat(docs[i]["loss_wt"]);
            const matchedData = lossAcctData.find(row => row.transactionId === item && row.type === "Kareegar")
            if (matchedData){
              lossIds.push(matchedData._id);  
            }
          }
        }
      }
    })

    const deleteFromLossAcct = {
      lossId: lossIds,
    }
    await deleteLossAcctList(deleteFromLossAcct, token);
    
    const kareegarBalanceData = {
      '_id': kareegarId,
      "balance": balance.toFixed(2),
      "beads_balance": beads_balance.toFixed(2)
    }
    await updateKareegarBalance(kareegarBalanceData, token);

    const kareegarBookId = {
      "kareegarBookId": selectedRowKeys
    }
    
    await deleteKareegarBookList(kareegarBookId, token);

    setSelectedRowKeys([]);
    await updateRows("today", currentSelectedDate);
    setIsDeleteModalOpen(false);
    setIsLoading(false);
  }
  
  const handleCancel = () => {
    setIsBoxWtModalOpen(false);
    setIsEditModalOpen(false);
    setIsModalOpen(false);
    setIsPrintModalOpen(false);
    setIsCutoffDateModalOpen(false);
    setIsCompleteModalOpen(false);
    setIsDeleteModalOpen(false);
  };

  const handleUpdateClose = () => {
    updateRows("today", currentSelectedDate);
    setIsBoxWtModalOpen(false);
    setIsModalOpen(false);
    setIsEditModalOpen(false);
    setIsCutoffDateModalOpen(false);
    setIsCompleteModalOpen(false);
    setIsDeleteModalOpen(false);
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

    let allData = await fetchKareegarBookList(1, Number.MAX_SAFE_INTEGER, kareegarId, token, dataState, currentSelectedDate);
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
    setPage(1);
    setItemsPerPage(array.length);
    close();
    setIsLoading(false);
  };

  const handleReset = (clearFilters, close) => {
    clearFilters();
    updateRows("valid", currentSelectedDate);
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
          ...getColumnSearchProps('issue_wt'),
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
          ...getColumnSearchProps('recv_wt'),    
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
          ...getColumnSearchProps('loss_wt'),
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
          ...getColumnSearchProps('beads_issue_wt'),
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
          ...getColumnSearchProps('beads_recv_wt'),  
          align: 'right',  
        }
      ]
    },
    {
      title: "Action",
      key: "action",
      width: "8%",
      
      render: (text, record, index) => (
        <>
          {text.is_receiver_updated || text.is_deleted_flag || (text.is_editable_flag===false) ? (
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

  const SelectAll = async() => {
    setIsLoading(true);

    const token = localStorage.getItem("token");

    const allKareegarData = await fetchKareegarBookList(1, Number.MAX_SAFE_INTEGER, kareegarId, token, "valid", currentSelectedDate);
    const docs = allKareegarData["data"];

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
      disabled: ((record.is_deleted_flag === true) || (record.is_editable_flag === false)),
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
        onSelect: ()=> {updateRows("deleted", currentSelectedDate)},
        
      },
      {
        key: 'all_entries',
        text: 'Show All',
        onSelect: ()=> {updateRows("all", currentSelectedDate)},
        
      },
      {
        key: 'valid',
        text: 'Show Valid',
        onSelect: ()=> {updateRows("valid", currentSelectedDate)},
      }
    ],
  };

  const getRowClassName = (record, i) => {
    // console.log(i, record, record._id)
    return record.is_deleted_flag ? 'striked-row delete' : (record.is_editable_flag===false)? "not-editable": i % 2 ? "odd" : "even";
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
                <LeftOutlined onClick={() => setKareegarDetailsPage(true)}/>
                {kareegarName}
              </div>
              <div className="text-left mt-5">
              <Tooltip title="Print Table" placement="bottomLeft">
                  <PrinterOutlined style={{ fontSize: '200%', color:"#1f2937"}} onClick={handlePrint}/>
              </Tooltip>
              </div>
              
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
                    </span>
                    <Tooltip title="Delete" placement="bottomRight">
                    <DeleteOutlined style={{ fontSize: '150%', color:"#1f2937"}} className="place-content-end	w-12" onClick={showDeletePopup}/>
                  </Tooltip>
                </div>
                <div className="mt-1 flex justify-between items-center bg-[#ABD6DFFF] h-12 p-2">
                <span className="text-[#00203FFF] whitespace-nowrap w-full font-medium h-12 py-2 flex ">
                Cutoff Date &nbsp;
                  <Select
                  selectorBg="#ABD6DF"
                  value={currentSelectedDate}
                  onChange={handleDateChange}
                  style={{
                    width: '180px',
                    height: '100%',
                  }}
                >
                  {dateSelectOption.map((date, index) => (
                    <Select.Option key={index} value={index+1}>
                      {`${getFormattedDate(date.start)} - ${date.end && date.end !== "" ? getFormattedDate(date.end) : 'Current'}`}
                    </Select.Option>
                  ))}
                </Select>
                </span>
                <Tooltip title="Close Monthly Account" placement="bottomRight">
                  <EnterOutlined className="ml-2 float-end" style={{ fontSize:"125%"}} onClick={showCutoffDateModal}/> 
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
            
            <div className="	text-xl flex justify-end items-center">
              <span className="text-[#00203FFF] font-medium	 w-full bg-[#ABD6DFFF] p-2">
                Close Account: <EnterOutlined className=" float-end" style={{ fontSize:"140%"}} onClick={showCutoffDateModal}/> 
              </span>
            </div>
          </>
        )}
        
        <Modal
        title={
          <>
          Close Monthly Book
          </>
        }
        open={isCutoffDateModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
              Are you sure you want to make today cutoff date? <br />
              This will hide all previous entries. <br />
        <div className="flex justify-center	">
        <Button className="bg-[#ABD6DFFF] mr-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={enterCutoffDate}>
            Yes
        </Button>
        <Button className="bg-[#ABD6DFFF] ml-2 text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" onClick={handleCancel}>
            No
        </Button>
        </div>
      </Modal> 

      <Modal
        title="Print Table"
        open={isPrintModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <PrintModel
          handlePrintUpdate={handlePrintUpdate}
          />
      </Modal>

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
        title="Add Receive Quantity"
        open={isEditModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
      <KareegarBookUpdate
          handleOk={handleUpdateClose}
          textData={updateData}
          kareegarId={kareegarId}
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

      <div ref={componentRef} className="print-table">
      {!isPaginationEnabled && <div className="text-5xl text-center mb-8 print-only">{kareegarName} Kareegar Book</div>}

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
            {kareegarName} Kareegar Book
          </div>
        )}
        summary={() => {
          return (
            <>
              <Table.Summary.Row className="footer-row font-bold	text-center text-lg bg-[#ABD6DFFF]">
                <Table.Summary.Cell index={0} className="" colSpan={4}>Total</Table.Summary.Cell>
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
                <Table.Summary.Cell index={13}></Table.Summary.Cell>
              </Table.Summary.Row>
            </>
          );
        }}
      />
      {isPaginationEnabled?(
        <div></div>
      ):(
                    <>
            <div className="text-xl border-transparent flex justify-between items-center">
            <div className="flex flex-col mt-5">
              
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex justify-end items-center h-6">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 h-6 font-medium p-2 flex items-center">
                  Balance: {(Number(totalIssueQuantity) - Number(totalRecvQuantity) - Number(totalLossQuantity)).toFixed(2)}
                  </span>
                </div>
                <div className="mb-1 flex justify-end items-center h-6">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 h-6 font-medium p-2 flex items-center">
                  Box Weight: {Number(boxWt).toFixed(2)}
                  </span>
                </div>
                <div className="mb-1 flex justify-end items-center h-6">
                  <span className="text-[#00203FFF] whitespace-nowrap w-76 h-6 font-medium p-2 flex items-center">
                  Balance + Box Weight: {(Number(boxWt) + Number(totalIssueQuantity) - Number(totalRecvQuantity) - Number(totalLossQuantity)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
            </>
      )
      }
      
      </div>

      <Divider />
    </div>
  );
};

export default KareegarBook;