import { useState, useEffect } from "react";
import React from "react";
import { fetchMasterStockList, postMasterStock } from "../api/masterStock.js";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "./Loading.js";
import { Button, Form, Input, InputNumber, Select, DatePicker, AutoComplete } from "antd";
import { getUtilityData, updateUtility } from "../api/utility.js";

function ModelAdd({handleOk}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionType, setTransactionType] = useState("receive");
  // const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
  const [lastDate, setLastDate] = useState(dayjs());
  const [forceUpdate, setForceUpdate] = useState(0);
  
  const purityOptions = [
    {
      label: "91.80",
      value: "91.80",
    },
    {
      label: "99.50",
      value: "99.50",
    },
    {
      label: "100",
      value: "100",
    },
  ];

  const validateMessages = {
    // eslint-disable-next-line
    required: "${label} is required!",
    types: {
      // eslint-disable-next-line
      email: "${label} is not a valid email!",
      // eslint-disable-next-line
      number: "${label} is not a valid number!",
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

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const docs = await fetchMasterStockList(1, 100000000, token);
      // console.log(docs)
      if (docs.length > 0){
        const lastEntry = docs[docs.length - 1];
        setLastDate(dayjs(lastEntry.date));
        // console.log(lastEntry.type, "Vashesh", lastEntry.type === "Receive");
        if (lastEntry.type === "Receive"){
          setTransactionType("receive");
        }
        else{
          setTransactionType("issue")
        }
      }
      setForceUpdate(1);
    })();
  }, []);

  const onFinish = async ({ user }) => {
    const token = localStorage.getItem("token");

    setIsLoading(true);
    // console.log(user);
    
    const {
      date,
      description,
      // goodsType,
      issueReceive,
      issuerName,
      receiverName,
      purity: originalPurity,
      weight: originalWt,
      issuePurity: originalIssuePurity,
      metal,
      issueweight: originalIssueWeight,
    } = user;
    
    const balanceData = await getUtilityData(token)

    if (issueReceive === "issue"){
      const issueweight = parseFloat(originalIssueWeight).toFixed(2);
      const issuePurity = parseFloat(originalIssuePurity).toFixed(2);
      
      const issueWt = (issueweight * issuePurity)  / 91.8;
      const issueWtRounded = Math.round(issueWt * 100) / 100;
      
      const backendData = {
        type: "Issue",
        date: dayjs(date, "YYYY-MM-DD"),
        // category: goodsType,
        description,
        weight: issueweight,
        issuer: issuerName,
        receiver: receiverName,
        purity: issuePurity,
        issue22k: (issueWtRounded).toFixed(2)
      };
      await postMasterStock(backendData, token);
      const utilityData = {
        _id: balanceData[0]["_id"],
        masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) - (parseFloat(issueWtRounded))).toFixed(2)
      }
      await updateUtility(utilityData, token);
      // const updated = await postMasterStock(backendData, token);
      // console.log("Added ",updated);
    }
    else if (issueReceive === "issuereceive"){

      const weight = parseFloat(originalWt).toFixed(2);
      const purity = parseFloat(originalPurity).toFixed(2);
  
      const number = (weight * purity)  / 91.8;
      const roundedNumber = Math.round(number * 100) / 100;
  
      const issueweight = parseFloat(originalIssueWeight).toFixed(2);
      const issuePurity = parseFloat(originalIssuePurity).toFixed(2);

      const issueWt = (issueweight * issuePurity)  / 91.8;
      const issueWtRounded = Math.round(issueWt * 100) / 100;

      const backendData = {
        type: "Issue & Receive",
        date: dayjs(date, "YYYY-MM-DD"),
        // category: goodsType,
        category: metal,
        description,
        weight: weight,
        issuer: issuerName,
        receiver: receiverName,
        purity: purity,
        issue22k: (issueWtRounded).toFixed(2),
        receive22k:(roundedNumber).toFixed(2)
      };
      await postMasterStock(backendData, token);

      if (metal === "metal")
        {
          // console.log(purity, typeof purity, purity === "99.50");
          if (parseFloat(purity) === 99.5){
            const utilityData = {
              _id: balanceData[0]["_id"],
              masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
              masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2) - (parseFloat(issueWtRounded)).toFixed(2),
              meltingBookOpening995Balance: (parseFloat(balanceData[0]["meltingBookOpening995Balance"]) + parseFloat(weight)).toFixed(2) ,
              meltingBookClosing995Balance: (parseFloat(balanceData[0]["meltingBookClosing995Balance"]) + parseFloat(weight)).toFixed(2)
            }
            await updateUtility(utilityData, token);
          }
          else if (parseFloat(purity) === 100){
            const utilityData = {
              _id: balanceData[0]["_id"],
              masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
              masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2) - (parseFloat(issueWtRounded)).toFixed(2),
              meltingBookOpening100Balance: (parseFloat(balanceData[0]["meltingBookOpening100Balance"]) + parseFloat(weight)).toFixed(2) ,
              meltingBookClosing100Balance: (parseFloat(balanceData[0]["meltingBookClosing100Balance"]) + parseFloat(weight)).toFixed(2)
            }
            await updateUtility(utilityData, token);
          }
          else{
            const utilityData = {
              _id: balanceData[0]["_id"],
              masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
              masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2) - (parseFloat(issueWtRounded)).toFixed(2),
              meltingBookOpeningBalance: (parseFloat(balanceData[0]["meltingBookOpeningBalance"]) + parseFloat(weight)).toFixed(2) ,
              meltingBookClosingBalance: (parseFloat(balanceData[0]["meltingBookClosingBalance"]) + parseFloat(weight)).toFixed(2)
            }
            await updateUtility(utilityData, token);
          }
        }
        else{
          const utilityData = {
            _id: balanceData[0]["_id"],
            masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
            masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2) - (parseFloat(issueWtRounded)).toFixed(2)
          }
        await updateUtility(utilityData, token);
        }
  

    }
    else{
      const weight = parseFloat(originalWt).toFixed(2);
      const purity = parseFloat(originalPurity).toFixed(2);
  
      const number = (weight * purity)  / 91.8;
      const roundedNumber = Math.round(number * 100) / 100;
  
      const backendData = {
        type: "Receive",
        date: dayjs(date, "YYYY-MM-DD"),
        category: metal,
        description,
        weight: weight,
        issuer: issuerName,
        receiver: receiverName,
        purity: purity,
        receive22k: (roundedNumber).toFixed(2)
      };
      if (metal === "metal")
      {
        // console.log(purity, typeof purity, purity === "99.50");
        if (parseFloat(purity) === 99.5){
          const utilityData = {
            _id: balanceData[0]["_id"],
            masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
            masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
            meltingBookOpening995Balance: (parseFloat(balanceData[0]["meltingBookOpening995Balance"]) + parseFloat(weight)).toFixed(2) ,
            meltingBookClosing995Balance: (parseFloat(balanceData[0]["meltingBookClosing995Balance"]) + parseFloat(weight)).toFixed(2)
          }
          await updateUtility(utilityData, token);
        }
        else if (parseFloat(purity) === 100){
          const utilityData = {
            _id: balanceData[0]["_id"],
            masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
            masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
            meltingBookOpening100Balance: (parseFloat(balanceData[0]["meltingBookOpening100Balance"]) + parseFloat(weight)).toFixed(2) ,
            meltingBookClosing100Balance: (parseFloat(balanceData[0]["meltingBookClosing100Balance"]) + parseFloat(weight)).toFixed(2)
          }
          await updateUtility(utilityData, token);
        }
        else{
          const utilityData = {
            _id: balanceData[0]["_id"],
            masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
            masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
            meltingBookOpeningBalance: (parseFloat(balanceData[0]["meltingBookOpeningBalance"]) + parseFloat(weight)).toFixed(2) ,
            meltingBookClosingBalance: (parseFloat(balanceData[0]["meltingBookClosingBalance"]) + parseFloat(weight)).toFixed(2)
          }
          await updateUtility(utilityData, token);
        }
      }
      else{
        const utilityData = {
          _id: balanceData[0]["_id"],
          masterStockOpeningBalance: (parseFloat(balanceData[0]["masterStockOpeningBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2),
          masterStockClosingBalance: (parseFloat(balanceData[0]["masterStockClosingBalance"]) + (parseFloat(roundedNumber.toFixed(2)))).toFixed(2)
        }
        await updateUtility(utilityData, token);  
      }
      await postMasterStock(backendData, token);
      // const updated = await postMasterStock(backendData, token);
      // console.log("Added ",updated);

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
        label="Receive / Issue"
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
            { value: "receive", label: "Receive" },
            { value: "issue", label: "Issue" },
            { value: "issuereceive", label: "Issue & Receive" },
          ]}
        />
      </Form.Item>
        { transactionType === "receive" ? (
      
      <>
      <Form.Item
        name={["user", "metal"]}
        label="Category"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue="metal"
      >
        <Select
          options={[
            { value: "metal", label: "Metal" },
            { value: "non-metal", label: "Non-Metal" },
          ]}
        />
      </Form.Item>

      <Form.Item name={["user", "description"]} label="Description">
        <Input />
      </Form.Item>
      <Form.Item
        name={["user", "weight"]}
        label="Weight (gm)"
        rules={[{ type: "number", min: 0, required: true }]}
      >
        <InputNumber
        // precision={4}
        // step={0.01}
      />
      </Form.Item>

      <Form.Item
        name={["user", "purity"]}
        label="Purity"
        rules={[
          {           
            validator: (_, value) => {
              const intValue = parseInt(value, 10);
              if (isNaN(intValue)) {
                return Promise.reject(new Error("Please enter a valid number."));
              } else if (intValue < 0) {
                return Promise.reject(new Error("Value must be greater than or equal to 0."));
              }
              return Promise.resolve();
            },
            required: true 
          }
        ]}
        transform={(value) => (value ? parseInt(value, 10) : NaN)} // Convert string to number
      >
        <AutoComplete
          options={purityOptions}
          // onSelect={onSelect}
          // onChange={onChange}            
        >
        </AutoComplete>
      </Form.Item>
      
      </>
      
        ) : transactionType === "issue" ?(
          <>      
          <Form.Item name={["user", "description"]} label="Description">
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "issueweight"]}
            label="Weight (gm)"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>
          <Form.Item
            name={["user", "issuePurity"]}
            label="Purity"
            rules={[
              {           
                validator: (_, value) => {
                  const intValue = parseInt(value, 10);
                  if (isNaN(intValue)) {
                    return Promise.reject(new Error("Please enter a valid number."));
                  } else if (intValue < 0) {
                    return Promise.reject(new Error("Value must be greater than or equal to 0."));
                  }
                  return Promise.resolve();
                },
                required: true 
              }
            ]}
            transform={(value) => (value ? parseInt(value, 10) : NaN)} // Convert string to number
          >
            <AutoComplete
              options={purityOptions}
              // onSelect={onSelect}
              // onChange={onChange}            
            >
            </AutoComplete>
          </Form.Item>
        </>
        ):(
      
          <>
          <Form.Item
            name={["user", "metal"]}
            label="Category"
            rules={[
              {
                required: true,
              },
            ]}
            initialValue="metal"
          >
            <Select
              options={[
                { value: "metal", label: "Metal" },
                { value: "non-metal", label: "Non-Metal" },
              ]}
            />
          </Form.Item>
    
          <Form.Item name={["user", "description"]} label="Description">
            <Input />
          </Form.Item>
          <Form.Item
            name={["user", "weight"]}
            label="Recv Weight (gm)"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>
    
          <Form.Item
            name={["user", "purity"]}
            label="Purity of Recv Wt"
            rules={[
              {           
                validator: (_, value) => {
                  const intValue = parseInt(value, 10);
                  if (isNaN(intValue)) {
                    return Promise.reject(new Error("Please enter a valid number."));
                  } else if (intValue < 0) {
                    return Promise.reject(new Error("Value must be greater than or equal to 0."));
                  }
                  return Promise.resolve();
                },
                required: true 
              }
            ]}
            transform={(value) => (value ? parseInt(value, 10) : NaN)} // Convert string to number
          >
            <AutoComplete
              options={purityOptions}
              // onSelect={onSelect}
              // onChange={onChange}            
            >
            </AutoComplete>
          </Form.Item>

          <Form.Item
            name={["user", "issueweight"]}
            label="Issue Weight (gm)"
            rules={[{ type: "number", min: 0, required: true }]}
          >
            <InputNumber
            // precision={4}
            // step={0.01}
          />
          </Form.Item>
          <Form.Item
            name={["user", "issuePurity"]}
            label="Purity of Issue Wt"
            rules={[
              {           
                validator: (_, value) => {
                  const intValue = parseInt(value, 10);
                  if (isNaN(intValue)) {
                    return Promise.reject(new Error("Please enter a valid number."));
                  } else if (intValue < 0) {
                    return Promise.reject(new Error("Value must be greater than or equal to 0."));
                  }
                  return Promise.resolve();
                },
                required: true 
              }
            ]}
            transform={(value) => (value ? parseInt(value, 10) : NaN)} // Convert string to number
          >
            <AutoComplete
              options={purityOptions}
              // onSelect={onSelect}
              // onChange={onChange}            
            >
            </AutoComplete>
          </Form.Item>

          </>             
        )
        }
      <Form.Item name={["user", "issuerName"]} label="Issuer Name">
        <Input />
      </Form.Item>
      <Form.Item name={["user", "receiverName"]} label="Receiver Name">
        <Input />
      </Form.Item>
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

export default ModelAdd;
