import { useState, useEffect } from "react";
import React from "react";
import { fetchKareegarBookList, postKareegarBook } from "../api/kareegarBook.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "./Loading.js";
import { Button, Form, Input, InputNumber, Select, DatePicker } from "antd";
import { getKareegarData, updateKareegarBalance } from "../api/kareegarDetail.js";

function KareegarAddItems({ kareegarId, handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("Issue");
  // const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
  const [lastDate, setLastDate] = useState(dayjs());
  const [forceUpdate, setForceUpdate] = useState(0);
  
  // const purityOptions = [
  //   {
  //     label: "91.80",
  //     value: "91.80",
  //   },
  //   {
  //     label: "99.50",
  //     value: "99.50",
  //   },
  //   {
  //     label: "100",
  //     value: "100",
  //   },
  // ];

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const kareegarDetails =  await getKareegarData(1,Number.MAX_SAFE_INTEGER, token);
      const kareegarUtilityData = kareegarDetails["data"];
      const kareegarData = kareegarUtilityData.find(item => item._id === kareegarId);

      const allKareegarData = await fetchKareegarBookList(1,1, kareegarId, token, "valid", kareegarData.kareegarCutoffStartDate.length);
      const docs = allKareegarData["data"];
      // console.log(docs)
      if (docs.length > 0){
        const lastEntry = docs[docs.length - 1];
        setLastDate(dayjs(lastEntry.date));
        if (lastEntry.type !== "Loss"){
          setTransactionType(lastEntry.type);
        };
        // console.log(lastEntry, lastDate)
      }
      setForceUpdate(1);
    })();
  }, []);

  const validateMessages = {
    // eslint-disable-next-line
    required: "${label} is required!",
    types: {
      // eslint-disable-next-line
      email: "${label} is not a valid email!",
      // eslint-disable-next-line
      number: "${label} is not a valid number!",
      integer: "${label} is not a valid integer"
    },
    number: {
      // eslint-disable-next-line
      range: "${label} must be between ${min} and ${max}",
    },
  };

  const handleTransactionType = (value) => {
    // console.log(`selected transaction type ${value}`);
    setTransactionType(value);
  }

  const disabledDate = (current) => {
    // Disable dates after the current date
    return current && dayjs(current).isAfter(dayjs().endOf('day'));
  };

  const layout = {
    labelCol: {
      span: 8,
    },
    wrapperCol: {
      span: 16,
    },
  };

  const onFinish = async ({ user }) => {
    const token = localStorage.getItem("token");

    setIsLoading(true);
    // console.log(user);
    
    const {
      date,
      description,
      category,
      issueReceive,
      issue_wt,
      recv_wt,
      beads_issue_wt,
      beads_recv_wt,
    } = user;

    const allKareegarDetails = await getKareegarData(1, Number.MAX_SAFE_INTEGER, token);
    const data = allKareegarDetails["data"];
    const kareegarData = data.find(item => item._id === kareegarId);
    
    if (issueReceive === "Issue"){
      const backendData = {
        kareegar_id: kareegarId,
        type: "Issue",
        date: dayjs(date, "YYYY-MM-DD"),
        category: category,
        description: description,
        issue_wt: issue_wt,
        beads_issue_wt: beads_issue_wt,
        is_receiver_updated: false,
      };
      await postKareegarBook(backendData, token);
      // console.log(issue_wt,  typeof issue_wt)
      let balance = (parseFloat(kareegarData.balance) + parseFloat(issue_wt)).toFixed(2);
      let beads_issue_wt_balance = (parseFloat(kareegarData.beads_balance))
      // const updated = await postMasterStock(backendData, token);
      // console.log("Added ", balance);
      if (!isNaN(beads_issue_wt)){
          beads_issue_wt_balance += beads_issue_wt; 
      }
      const kareegarBalanceData = {
        '_id': kareegarId,
        "balance": balance,
        "beads_balance": beads_issue_wt_balance
      }
      await updateKareegarBalance(kareegarBalanceData, token);
    }
    else if (issueReceive === "Receive"){
      const backendData = {
        kareegar_id: kareegarId,
        type: "Receive",
        date: dayjs(date, "YYYY-MM-DD"),
        category: category,
        description: description,
        recv_wt: recv_wt,
        beads_recv_wt: beads_recv_wt
      };
      await postKareegarBook(backendData, token);
      // const updated = await postMasterStock(backendData, token);
      // console.log(recv_wt, typeof recv_wt)
      let balance = (parseFloat(kareegarData.balance) - parseFloat(recv_wt)).toFixed(2);
      let beads_recv_wt_balance = (parseFloat(kareegarData.beads_balance))
      // console.log("Added ", balance);
      if (!isNaN(beads_recv_wt)){
        beads_recv_wt_balance -= beads_recv_wt; 
      }
      const kareegarBalanceData = {
        '_id': kareegarId,
        "balance": balance,
        "beads_balance": beads_recv_wt_balance
      }
      await updateKareegarBalance(kareegarBalanceData, token);
    }
    else{
      const backendData = {
        kareegar_id: kareegarId,
        type: "Issue & Receive",
        date: dayjs(date, "YYYY-MM-DD"),
        category: category,
        description: description,
        issue_wt: issue_wt,
        beads_issue_wt: beads_issue_wt,
        recv_wt: recv_wt,
        beads_recv_wt: beads_recv_wt
      };
      await postKareegarBook(backendData, token);
      // console.log(issue_wt,  typeof issue_wt)
      let balance = (parseFloat(kareegarData.balance) + parseFloat(issue_wt) - parseFloat(recv_wt)).toFixed(2);
      let beads_balance_last = (parseFloat(kareegarData.beads_balance))
      // const updated = await postMasterStock(backendData, token);
      // console.log("Added ", balance);
      if (!isNaN(beads_issue_wt)){
        beads_balance_last += beads_issue_wt; 
      }
      if (!isNaN(beads_recv_wt)){
        beads_balance_last -= beads_recv_wt; 
      }
      const kareegarBalanceData = {
        '_id': kareegarId,
        "balance": balance,
        "beads_balance": beads_balance_last
      }
      await updateKareegarBalance(kareegarBalanceData, token);
    }


    form.resetFields();
    setIsLoading(false);
    handleOk();
  };

  if (isLoading){
    return <Loading />
  }

  return (
    <Form
      {...layout}
      key={forceUpdate}
      name="nest-messages"
      onFinish={onFinish}
      style={{
        maxWidth: 600,
      }}
      validateMessages={validateMessages}
    >
            <Form.Item
        name={["user", "date"]}
        label="Date"
        rules={[
          {
            type: "Date",
          },
        ]}
        initialValue={lastDate}
      >
        <DatePicker format="DD MMM, YYYY" disabledDate={disabledDate} />
      </Form.Item>
      

      <Form.Item
        name={["user", "issueReceive"]}
        label="Issue / Receive"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={transactionType}
      >
        <Select
          onChange={handleTransactionType}
          options={[
            { value: "Issue", label: "Issue" },
            { value: "Receive", label: "Receive" },
            { value: "IssueReceive", label: "Issue & Receive" },
          ]}
        />
      </Form.Item>
      <Form.Item name={["user", "category"]} label="Category">
        <Input />
      </Form.Item>

      <Form.Item name={["user", "description"]} label="Description">
        <Input />
      </Form.Item>

        { transactionType === "Receive" ? (
      
      <>
      
      <Form.Item
        name={["user", "recv_wt"]}
        label="Receive Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
      >
        <InputNumber
        // precision={4}
        // step={0.01}
      />
      </Form.Item>
      <Form.Item
            name={["user", "beads_recv_wt"]}
            label="Beads Receive"
            rules={[{ type: "integer", min: 0 }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>

      </>
      
        ):transactionType === "Issue" ?(
          <>
          <Form.Item
            name={["user", "issue_wt"]}
            label="Issue Weight (gm)"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>
          <Form.Item
            name={["user", "beads_issue_wt"]}
            label="Beads Issue "
            rules={[{ type: "integer", min: 0 }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>
        </>
        ) : (
          <>
        <Form.Item
            name={["user", "issue_wt"]}
            label="Issue Weight (gm)"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>
          <Form.Item
          name={["user", "recv_wt"]}
          label="Receive Weight (gm)"
          rules={[{ type: "number", min: 0, required: true }]}
        >
          <InputNumber
          // precision={4}
          // step={0.01}
        />
        </Form.Item>
  
          <Form.Item
            name={["user", "beads_issue_wt"]}
            label="Beads Issue "
            rules={[{ type: "integer", min: 0 }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>
          <Form.Item
              name={["user", "beads_recv_wt"]}
              label="Beads Receive"
              rules={[{ type: "integer", min: 0 }]}
            >
              <InputNumber
              // precision={4}
              // step={0.01}
            />
          </Form.Item>
        </>
      )
        }
      {/* <Form.Item name={["user", "issuerName"]} label="Issuer Name">
        <Input />
      </Form.Item>
      <Form.Item name={["user", "receiverName"]} label="Receiver Name">
        <Input />
      </Form.Item> */}
      <Form.Item
        wrapperCol={{
          ...layout.wrapperCol,
          offset: 8,
        }}
      >
        <Button className="bg-[#ABD6DFFF] text-black hover:!bg-gray-800 hover:!text-white active:!bg-gray-800 active:!text-white focus-visible:!outline-none" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default KareegarAddItems;
