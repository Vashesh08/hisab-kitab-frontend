import React, { useEffect, useState } from "react";
import "../style/Cards.css"
import { getKareegarData} from "../api/kareegarDetail.js";
import Loading from "../components/Loading.js";
import { Table } from "antd";
import { getUtilityData } from "../api/utility.js";
import { fetchLossAcctList } from "../api/LossAcct.js";
import { fetchKareegarBookList } from "../api/kareegarBook.js";

export default function BalanceSheet() {
    const screenWidth = window.innerWidth;
    const [page] = useState(1);
    const [itemsPerPage] = useState(100000000); 
    const [allKareegarDetails, setAllKareegarDetails] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [rows, setRows] = useState(false);
    const [totalKareegarBalance, setTotalKareegarBalance] = useState(false);
    const [factoryStock, setFactoryStock] = useState(0);
    const [remainingStock, setRemainingStock] = useState(0);
    const [totalLoss, setTotalLoss] = useState(0);

    useEffect(() => {
        (async () => {
            setIsLoading(true);

            const token = localStorage.getItem("token");

            const data = await getKareegarData(1, 100000000, token);
            const filteredData = data.filter(item => item.is_deleted_flag === false && item.is_hidden_flag === false);
            // console.log(filteredData)
            const allKareegarIds = filteredData.map(item => item._id);
            let kareegarDetails = [];

            for (const item of filteredData) {
              
              const allData = await fetchKareegarBookList(page, itemsPerPage, item._id, token);
              
              let currentKareegarData = [];

              for (let eachEntry in allData) {
                // console.log(allData[eachEntry].is_editable_flag);
                if (allData[eachEntry].is_deleted_flag === false && (allData[eachEntry].is_editable_flag === true)){
                  currentKareegarData.push(allData[eachEntry]);
                }
              }

              // console.log(allData, "currentKareegarData", currentKareegarData);

              let currentKareegarIssueQty = 0.0;
              let currentKareegarRecvQty = 0.0;
              let currentKareegarLossQty = 0.0;
              let currentKareegarBeadsIssueQty = 0.0;
              let currentKareegarBeadsRecvQty = 0.0;
              currentKareegarData.forEach(({ issue_wt, recv_wt, loss_wt, beads_issue_wt, beads_recv_wt}) => {
                // console.log(weight24k, receive22k, issue22k, loss22k);
                if (isNaN(parseFloat(issue_wt))) {
                  issue_wt = 0.0; // Set it to zero if it's NaN
                } 
                if (isNaN(parseFloat(recv_wt))) {
                  recv_wt = 0.0; // Set it to zero if it's NaN
                } 
                if (isNaN(parseFloat(loss_wt))){
                  loss_wt = 0.0; // Set it to zero if it's NaN
                }
                if (isNaN(parseFloat(beads_issue_wt))){
                  beads_issue_wt = 0.0;  // Set it to zero if it's NaN
                }
                if (isNaN(parseFloat(beads_recv_wt))){
                  beads_recv_wt = 0.0;  // Set it to zero if it's NaN
                }
                currentKareegarIssueQty += parseFloat(issue_wt);
                currentKareegarRecvQty += parseFloat(recv_wt);
                currentKareegarLossQty += parseFloat(loss_wt);
                currentKareegarBeadsIssueQty += parseFloat(beads_issue_wt);
                currentKareegarBeadsRecvQty += parseFloat(beads_recv_wt);
              });


              kareegarDetails.push({
                "_id": item._id,
                "name": item.name, 
                "category": item.category,
                "balance": parseFloat(currentKareegarIssueQty - currentKareegarRecvQty - currentKareegarLossQty).toFixed(2),
                "beads_balance": parseFloat(currentKareegarBeadsIssueQty - currentKareegarBeadsRecvQty).toFixed(2)
              });
              // console.log(parseFloat(currentKareegarIssueQty - currentKareegarRecvQty - currentKareegarLossQty).toFixed(2));

              //console.log(parseFloat(currentKareegarBeadsIssueQty - currentKareegarBeadsRecvQty).toFixed(2));
            };
            
            setAllKareegarDetails(kareegarDetails);
                        
            
            const current_data = [];
            const deleted_data = [];
            let totalKareegarStock = 0;
        
            for (let eachEntry in kareegarDetails) {
                if (kareegarDetails[eachEntry].is_deleted_flag){
                  deleted_data.push(kareegarDetails[eachEntry]);
                }
                else{
                  current_data.push(kareegarDetails[eachEntry]);
                  totalKareegarStock += parseFloat(kareegarDetails[eachEntry].balance)
                }
              }
            //console.log("Vashesh", data);
            setRows(current_data);
            setTotalKareegarBalance(parseFloat(totalKareegarStock).toFixed(2))

            const balanceData = await getUtilityData(token);
            setFactoryStock(parseFloat(balanceData[0]["masterStockClosingBalance"]).toFixed(2));


            const lossDocs = await fetchLossAcctList(1, 100000000, token);
            let currentLoss = 0;

            for (let eachEntry in lossDocs) {
                if (lossDocs[eachEntry].is_deleted_flag){
                  deleted_data.push(lossDocs[eachEntry]);
                }
                else{
                    currentLoss += parseFloat(lossDocs[eachEntry].lossWt)
                //   data.push(docs[eachEntry]);
                //   totalKareegarStock += parseFloat(docs[eachEntry].balance)
                }
              }
            setTotalLoss(parseFloat(currentLoss).toFixed(2))

            setRemainingStock(parseFloat(parseFloat(balanceData[0]["masterStockClosingBalance"]) - parseFloat(totalKareegarStock) - parseFloat(currentLoss)).toFixed(2));

            setIsLoading(false);
        })();
    }, []);


const columns = [
    {
      title: 'Kareegar Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Balance',
      dataIndex: 'balance',
      key: 'balance',
    },
  ];
  
    
  const getRowClassName = (record, i) => {
    // console.log(i, record, record._id)
    return i % 2 ? "odd" : "even";
  };


    if (isLoading){
        return <Loading />
      }

    return (
<>
{screenWidth > 953 ? (
          <>
            <div className="text-xl border-transparent flex justify-between items-center">
            <div style={{ 
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "3em",
              marginTop: "-3rem",
              }} className="text-center text-[#00203FFF]" >
                Balance Sheet
              </div>

              <div className="flex flex-col">
                <div className="mb-1 flex justify-end h-10">
                <div className="rounded text-[#00203FFF] whitespace-nowrap h-10 font-light	bg-[#ABD6DFFF] p-1 border-white border-x-2 border-y-1 flex items-center justify-center">
                    <span className="!w-64 !h-10 !text-[#00203FFF] font-medium !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    Total Factory Stock
                    </span>
                    <span className="overflow-auto !w-32 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white">
                    {factoryStock}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end h-10">
                <div className="rounded text-[#00203FFF] whitespace-nowrap h-10 font-light	bg-[#ABD6DFFF] p-1 border-white border-x-2 border-y-1 flex items-center justify-center">
                    <span className="!w-64 !h-10 !text-[#00203FFF] font-medium !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    Total Kareegar Balance
                    </span>
                    <span className="overflow-auto !w-32 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white">
                    {totalKareegarBalance}
                    </span>
                  </div>
                </div>
                <div className="mt-1 flex justify-end h-10">
                <div className="rounded text-[#00203FFF] whitespace-nowrap h-10 font-light	bg-[#ABD6DFFF] p-1 border-white border-x-2 border-y-1 flex items-center justify-center">
                    <span className="!w-64 !h-10 !text-[#00203FFF] font-medium !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    Total Loss
                    </span>
                    <span className="overflow-auto !w-32 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white">
                    {totalLoss}
                    </span>
                  </div>
                </div>
                <div className="mt-1 flex justify-end h-10">
                <div className="rounded text-[#00203FFF] whitespace-nowrap h-10 font-light	bg-[#ABD6DFFF] p-1 border-white border-x-2 border-y-1 flex items-center justify-center">
                    <span className="!w-64 !h-10 !text-[#00203FFF] font-medium !text-lg py-1 pr-1 pl-1 border-r-white border-r-2">
                    Remaining Balance
                    </span>
                    <span className="overflow-auto !w-32 !h-10 !text-[#00203FFF] text-right !text-lg py-1 pr-1 pl-1 border-r-white">
                    {remainingStock}
                    </span>
                  </div>
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
              }} className="text-center text-[#00203FFF]" >Melting Book</div>

          
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
            opening995Balance
            </span>
            <span className="overflow-auto !w-1/5	text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            opening100Balance
            </span>
            <span className="overflow-auto !w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1">
            openingBalance
            </span>
          </div>
          <div className="rounded text-[#00203FFF] whitespace-nowrap w-auto h-10 font-light bg-[#ABD6DFFF] p-1 border-white border-2 flex items-center justify-center">
            <span className="!w-2/5 font-medium text-left !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            Closing Balance
            </span>
            <span className="overflow-auto !w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            closing995Balance
            </span>
            <span className="overflow-auto !w-1/5	text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1 border-r-white border-r-2">
            closing100Balance
            </span>
            <span className="overflow-auto !w-1/5 text-right !h-10 !text-[#00203FFF] py-2 pr-1 pl-1">
            closingBalance
            </span>
          </div>
          </>
        ): (
          <>
            <div style={{
              fontSize: '250%',
              fontWeight: 'bolder',
              lineHeight: "2em",
              }} className="text-center text-[#00203FFF]" >Melting Book</div>

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
            opening995Balance
            </span>
            <span className="!w-1/4	flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            opening100Balance
            </span>
            <span className="!w-1/4 flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10">
            openingBalance
            </span>
          </div>
          <div className="text-[#00203FFF] !h-20 whitespace-nowrap w-auto font-light bg-[#ABD6DFFF] p-2 border-white border-2 flex items-center justify-center">
            <span className="overflow-x-auto !w-1/4 font-medium flex items-center justify-center text-left !h-20 !text-[#00203FFF] whitespace-break-spaces py-2 pl-4 border-r-white border-r-2">
            Remaining Balance
            </span>
            <span className="overflow-x-auto !w-1/4 flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            closing995Balance
            </span>
            <span className="overflow-x-auto !w-1/4	flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10 border-r-white border-r-2">
            closing100Balance
            </span>
            <span className="overflow-x-auto !w-1/4 flex items-center justify-center text-right !h-20 !text-[#00203FFF] py-2 pr-2 pl-10">
            closingBalance
            </span>
          </div>
          </>
        )}



            <>
        <Table
        dataSource={rows}
        rowClassName={getRowClassName}
        columns={columns}
        scroll={{ x: 'calc(100vh - 4em)' }}
        pagination={{ defaultPageSize: 100, showSizeChanger: true, pageSizeOptions: ['10', '20', '50', '100']}}
        summary={() => {
              <Table.Summary.Row className="footer-row font-bold	text-center text-lg bg-[#ABD6DFFF]">
                <Table.Summary.Cell index={0} className="" colSpan={2}>Total</Table.Summary.Cell>
              </Table.Summary.Row>
              }}/>
            </>
        
    
{/* {console.log(allKareegarDetails)} */}
{/* {allKareegarDetails} */}
</>
    );
}