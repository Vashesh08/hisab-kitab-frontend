import React, { useState, useEffect } from "react";
import dayjs from 'dayjs'; // Import Day.js
import Loading from "../Loading.js";
import { Button, Form, Input, InputNumber, Select, DatePicker, AutoComplete } from "antd";
import { getUtilityData, updateUtility } from "../../api/utility.js";
import { fetchGovindCapMeltingStockList, postGovindCapMeltingStock } from "../../api/govindCapMeltingBook.js";

function GovindCapMeltingBookAdd({handleOk, setClosingBalance, setClosing995Balance, setClosing100Balance}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [categoryType, setCategoryType] = useState(["Gold", "Gold", "Gold", "Gold", "Gold"]);
  const [numberOfItems, setNumberOfItems] = useState(1);
  const [currentDate, setCurrentDate] = useState(dayjs()); // Initialize with Day.js
  const [meltingIssueWt, setMeltingIssueWt] = useState(0);
  const [formWeightValues, setFormWeightValues] = useState([0, 0, 0, 0, 0]);
  const [formPurityValues, setFormPurityValues] = useState([0, 0, 0, 0, 0]);
  const [formConversionValues, setFormConversionValues] = useState([0, 0, 0, 0, 0]);
  const [issueActualWt, setIssueActualWt] = useState(0);
  const [lastDate, setLastDate] = useState(dayjs());
  const [forceUpdate, setForceUpdate] = useState(0);
  const [error, setError] = useState(false);

  const handleActualIssueWt = (value) => {
    setIssueActualWt(value);
  }

  const onSelectWt = (value, type, index) => {
    if (type === "weight"){
      let newFormWeightValues = Array.from(formWeightValues);
      newFormWeightValues[index] = value;
      setFormWeightValues([...newFormWeightValues.slice()]);
    }
    else if (type === "purity"){
      let newFormPurityValues = Array.from(formPurityValues);
      newFormPurityValues[index] = value;
      setFormPurityValues([...newFormPurityValues.slice()]);
    }
    else if (type === "conversion"){
      let newFormConversionValues = Array.from(formConversionValues);
      newFormConversionValues[index] = value;
      setFormConversionValues([...newFormConversionValues.slice()]);      
    }
    
    let totalRoundedNumber = 0;
    for (let index = 0; index < numberOfItems; index++) {
      if (
        formWeightValues[index] !== 0 &&
        formPurityValues[index] !== 0 &&
        formConversionValues[index] !== 0
      ) {
        totalRoundedNumber += parseFloat(formWeightValues[index]) *
          parseFloat(formPurityValues[index]) /
          parseFloat(formConversionValues[index]);
      }
    }
    // console.log(totalRoundedNumber);
    setMeltingIssueWt(totalRoundedNumber.toFixed(2));
    setIssueActualWt(totalRoundedNumber.toFixed(2));
  }

  const onChangeWt = (event, type, index) => {
    if (event && event.target && event.target.value) {
      const value = event.target.value;
    // console.log(type, index, value)
    if (type === "weight"){
      let newFormWeightValues = Array.from(formWeightValues);
      newFormWeightValues[index] = value;
      setFormWeightValues([...newFormWeightValues.slice()]);
    }
    else if (type === "purity"){
      let newFormPurityValues = Array.from(formPurityValues);
      newFormPurityValues[index] = value;
      setFormPurityValues([...newFormPurityValues.slice()]);
    }
    else if (type === "conversion"){
      let newFormConversionValues = Array.from(formConversionValues);
      newFormConversionValues[index] = value;
      setFormConversionValues([...newFormConversionValues.slice()]);      
    }
    }
    
    let totalRoundedNumber = 0;
    for (let index = 0; index < numberOfItems; index++) {
      if (
        formWeightValues[index] !== 0 &&
        formPurityValues[index] !== 0 &&
        formConversionValues[index] !== 0
      ) {
        totalRoundedNumber += parseFloat(formWeightValues[index]) *
          parseFloat(formPurityValues[index]) /
          parseFloat(formConversionValues[index]);
      }
    }
    // console.log(totalRoundedNumber);
    setMeltingIssueWt(totalRoundedNumber.toFixed(2));
    setIssueActualWt(totalRoundedNumber.toFixed(2));
    // const weightKeys = [...Array(numberOfItems)].map((_, index) => `weight${index}`);
    // const weightValues = weightKeys.map((key) => (user && user[key]) || 0);
    
    // const purityKeys = [...Array(numberOfItems)].map((_, index) => `purity${index}`);
    // const purityValues = purityKeys.map((key) => (user && user[key]) || 0);

    // const conversionKeys = [...Array(numberOfItems)].map((_, index) => `conversion${index}`);
    // const conversionValues = conversionKeys.map((key) => (user && user[key]) || 0);
    // console.log("conversion", conversionKeys, conversionValues, user[conversionValues[0]])
    // let totalRoundedNumber = 0;
    // for (let index = 0; index < numberOfItems; index++) {
    //   if (
    //       (!isNaN(formWeightValues[index])) && 
    //       (!isNaN(formPurityValues[index])) && 
    //       (!isNaN(formConversionValues[index])) && 
    //       (formConversionValues[index] !== 0)
    //     ){
    //     totalRoundedNumber += ((parseFloat(formWeightValues[index]) * parseFloat(formPurityValues[index]))  / parseFloat(formConversionValues[index]));
    //   }
    // //   // console.log("Vashesh", totalRoundedNumber);
    // }
    // console.log(totalRoundedNumber);
    // setMeltingIssueWt(totalRoundedNumber);
  }

  useEffect(() => {
    setIsLoading(true);
    let totalRoundedNumber = 0;
    for (let index = 0; index < numberOfItems; index++) {
      if (
        formWeightValues[index] !== 0 &&
        formPurityValues[index] !== 0 &&
        formConversionValues[index] !== 0
      ) {
        totalRoundedNumber += parseFloat(formWeightValues[index]) *
          parseFloat(formPurityValues[index]) /
          parseFloat(formConversionValues[index]);
      }
    }
    // console.log(totalRoundedNumber);
    setMeltingIssueWt(totalRoundedNumber.toFixed(2));
    setIssueActualWt(totalRoundedNumber.toFixed(2));
    (async () => {
      const token = localStorage.getItem("token");
      const docs = await fetchGovindCapMeltingStockList(1, 100000000, token);
      // console.log(docs)
      if (docs.length > 0){
        const lastEntry = docs[docs.length - 1];
        setLastDate(dayjs(lastEntry.date));
        // console.log(lastEntry, lastDate)
      }
      setForceUpdate(1);
      // setForceUpdate(prev => prev + 1);
    })();
    setIsLoading(false);
  }, [formWeightValues, formPurityValues, formConversionValues, numberOfItems]);

  const renderCommonItems = (index) => {
    return (
      <>
    <Form.Item
    name={["user", `purity${index}`]}
    label={`Purity ${index + 1}`}
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
    onChange={(e) => onChangeWt(e, "purity", index)} 
  >
    <AutoComplete
      options={purityOptions}
      onSelect={(e) => onSelectWt(e, "purity", index)}
      // onChange={onChange}            
    >
    </AutoComplete>
  </Form.Item>
  <Form.Item
    name={["user", `conversion${index}`]}
    label={`Conversion ${index + 1}`}
    rules={[
      {
        validator: (_, value) => {
          const intValue = parseInt(value, 10);
          if (isNaN(intValue)) {
            return Promise.reject(new Error("Please enter a valid number."));
          } else if (intValue <= 0) {
            return Promise.reject(new Error("Value must be greater than 0."));
          }
          return Promise.resolve();
        },
        required: true 
      }
    ]}
    transform={(value) => (value ? parseInt(value, 10) : NaN)} // Convert string to number
    onChange={(e) => onChangeWt(e, "conversion", index)}
  >
    <AutoComplete
      options={purityOptions}
      onSelect={(e) => onSelectWt(e, "conversion", index)}
      onChange={onChangeWt}            
    >
    </AutoComplete>
  </Form.Item>
      </>
    )
  }

  const renderItems = () => {
    return [...Array(numberOfItems)].map((_, index) => (
      <>
      <Form.Item
        name={["user", `category${index}`]}
        label={`Category ${index+1}`}
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={categoryType[index]}
      >
        <Select
          onChange={(e) => handleCategoryType(e, index)} 
          options={[
            { value: "Gold", label: "Gold" },
            { value: "Bhuka", label: "Bhuka" },
          ]}
        />
      </Form.Item>

    {(categoryType[index] === "Gold") ? (
        <>
        <Form.Item
          name={["user", `weight${index}`]}
          label={`Weight (gm) ${index+1}`}
          rules={[{ type: "number", min: 0, required: true }]}
          onChange={(e) => onChangeWt(e, "weight", index)} 
        >
          <InputNumber/>
        </Form.Item>
        {renderCommonItems(index)}
        </>
    ): (
      <>
        <Form.Item
          name={["user", `weight${index}`]}
          label={`Weight (gm) ${index+1}`}
          rules={[{ type: "number", min: 0, required: true }]}
          onChange={(e) => onChangeWt(e, "weight", index)} 
        >
          <InputNumber/>
        </Form.Item>
        {renderCommonItems(index)}
        </>
      )
    }
      </>
  ))
  }


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

  // const onSelect = (data) => {
  //   console.log('onSelect', data);
  // };

  // const onChange = (data) => {
  //   console.log('onSelect', data, typeof data);
  // };

  const handleNumberOfItems = (value) => {
    if (value >= 1 && value <= 5) {
      setNumberOfItems(value);
    }
    // console.log([...Array(numberOfItems)].map((_, index) => `purity${index + 1}`));
    // console.log(originalPurity.slice(0, numberOfItems).map((_, index) => `purity${index + 1}`));
  }

  const handleCategoryType = (value, index) => {
    // console.log(`selected transaction type ${value} ${index}`);
    // setCategoryType(value);
    let newArrayCopy = Array.from(categoryType);
    newArrayCopy[index] = value;
    // console.log("New Array Copy:", newArrayCopy);

    setCategoryType([...newArrayCopy.slice()]);
    // console.log(categoryType);
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
    const balanceData = await getUtilityData(token);
    
    const weightKeys = [...Array(numberOfItems)].map((_, index) => `weight${index}`);
    const weightValues = weightKeys.map((key) => user[key]);
    
    const purityKeys = [...Array(numberOfItems)].map((_, index) => `purity${index}`);
    const purityValues = purityKeys.map((key) => user[key]);

    const conversionKeys = [...Array(numberOfItems)].map((_, index) => `conversion${index}`);
    const conversionValues = conversionKeys.map((key) => user[key]);
    
    const categoryKeys = [...Array(numberOfItems)].map((_, index) => `category${index}`);
    const categoryValues = categoryKeys.map((key) => user[key]);
    // console.log(purityValues, weightValues, conversionValues);

    const {
      date,
      description,
      // issue22kActual
    } = user;
    
    let totalWeight = 0;
    let totalWeight995 = 0;
    let totalWeight100 = 0;
    let totalRoundedNumber = 0;
    for (let index = 0; index < numberOfItems; index++) {
      if (categoryType[index] === "Gold"){
        // console.log(purityValues[index], parseFloat(purityValues[index]) === 99.5, parseFloat(purityValues[index]) === 100);
        if (parseFloat(purityValues[index]) === 99.5){
          totalWeight995 += weightValues[index];
        }
        else if (parseFloat(purityValues[index]) === 100){
          totalWeight100 += weightValues[index];
        }
        else {
          totalWeight += weightValues[index];
        }
      };
      totalRoundedNumber += ((weightValues[index] * purityValues[index])  / conversionValues[index]);
    }
    
    form.resetFields();

        if ((parseFloat(totalWeight) <= parseFloat(balanceData[0]["meltingBookClosingBalance"])) && (parseFloat(totalWeight995) <= parseFloat(balanceData[0]["meltingBookClosing995Balance"])) && (parseFloat(totalWeight100) <= parseFloat(balanceData[0]["meltingBookClosing100Balance"]))){

          
          const backendData = {
            meltingDate: dayjs(date, "YYYY-MM-DD"),
            meltingDescription: description,
            meltingWeight: weightValues,
            meltingPurity: purityValues,
            meltingCategory: categoryValues,
            meltingConversion: conversionValues,
            meltingIssue: (totalRoundedNumber).toFixed(2),
            meltingIssueActual: parseFloat(issueActualWt).toFixed(2),
            };
            await postGovindCapMeltingStock(backendData, token);
            
            
        //   if (category === "Gold")
        //   {        
            const utilityData = {
              _id: balanceData[0]["_id"],
              meltingBookClosingBalance: (parseFloat(balanceData[0]["meltingBookClosingBalance"]) - parseFloat(totalWeight)).toFixed(2),
              meltingBookClosing995Balance: (parseFloat(balanceData[0]["meltingBookClosing995Balance"]) - parseFloat(totalWeight995)).toFixed(2),
              meltingBookClosing100Balance: (parseFloat(balanceData[0]["meltingBookClosing100Balance"]) - parseFloat(totalWeight100)).toFixed(2)
            }
            await updateUtility(utilityData, token);
          // }
          setError(false);
        }
        else{
          setClosingBalance(parseFloat(balanceData[0]["meltingBookClosingBalance"]).toFixed(2));
          setClosing995Balance(parseFloat(balanceData[0]["meltingBookClosing995Balance"]).toFixed(2));
          setClosing100Balance(parseFloat(balanceData[0]["meltingBookClosing100Balance"]).toFixed(2));
          
          setError(true);
          setFormWeightValues([0, 0, 0, 0, 0]);
          setFormPurityValues([0, 0, 0, 0, 0]);
          setFormConversionValues([0, 0, 0, 0, 0]);
          setMeltingIssueWt(0);
          setIssueActualWt(0);
          setIsLoading(false);
          return
        }
      // }

      handleOk();
    setIsLoading(false);

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
      {error ? (
        <>
        <div className="text-red-600 text-center py-3"> Melting Weight is more than Available Stock </div>
        </>
      ) : (
        <></>
      )}
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
      <Form.Item name={["user", "description"]} label="Description">
        <Input />
      </Form.Item>

      {/* <Form.Item
        name={["user", `category `]}
        label={`Category`}
        rules={[
          {
            required: true,
          },
        ]}
        initialValue="Gold"
      >
        <Select
          onChange={handleCategoryType}
          options={[
            { value: "Gold", label: "Gold" },
            { value: "Bhuka", label: "Bhuka" },
          ]}
        />
      </Form.Item> */}

      <Form.Item
          name={["user", "items"]}
          label="Number of Items"
          rules={[
            { type: "number", min: 1, max: 5, required: true, step:1 }
          ]}
          initialValue={numberOfItems}
        >
        <InputNumber
          onChange={handleNumberOfItems}
        />
      </Form.Item>

          {renderItems()}

          <Form.Item
          name={["user", "issue22k"]}
          label="Issue Weight Formula"
          // initialValue={meltingIssueWt}
          >
            {meltingIssueWt}
            {/* <InputNumber value={meltingIssueWt} style={{color: "black", backgroundColor:"white"}} disabled={true}></InputNumber> */}
          </Form.Item>
          
          <Form.Item
          name={["user", "issue22kActual"]}
          label="Issue Weight Actual"
          // initialValue={meltingIssueWt}
          >
            <InputNumber 
            value={issueActualWt}
            onChange={handleActualIssueWt}
            />
            <Input value={issueActualWt} hidden={true}/>
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

export default GovindCapMeltingBookAdd;
