import React, { useEffect, useState } from "react";
import "../style/Cards.css"
import { getKareegarData} from "../api/kareegarDetail.js";
import Loading from "../components/Loading.js";
import { Table } from "antd";
import { getUtilityData } from "../api/utility.js";
import { fetchLossAcctList } from "../api/LossAcct.js";

export default function BalanceSheet() {
    const screenWidth = window.innerWidth;
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
            const docs = await getKareegarData(1, 100000000, token);
            setAllKareegarDetails(docs);
            const data = [];
            const deleted_data = [];
            let totalKareegarStock = 0;
        
            for (let eachEntry in docs) {
                if (docs[eachEntry].is_deleted_flag){
                  deleted_data.push(docs[eachEntry]);
                }
                else{
                  data.push(docs[eachEntry]);
                  totalKareegarStock += parseFloat(docs[eachEntry].balance)
                }
              }
            console.log("Vashesh", data);
            setRows(data);
            setTotalKareegarBalance(parseFloat(totalKareegarStock).toFixed(2))

            const balanceData = await getUtilityData(token);
            setFactoryStock(parseFloat(balanceData[0]["masterStockClosingBalance"]).toFixed(2));


            const lossDocs = await fetchLossAcctList(1, 100000000, token);
            let currentLoss = 0;

            for (let eachEntry in lossDocs) {
                if (lossDocs[eachEntry].is_deleted_flag){
                  deleted_data.push(docs[eachEntry]);
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


{console.log(rows)}

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