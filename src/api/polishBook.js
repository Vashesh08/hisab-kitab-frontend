
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function fetchPolishList(page, itemsPerPage, token, isDeleted) {
    const response = await fetch(`${config.API_URL}/admin/polish-list?page=${page}&itemsPerPage=${itemsPerPage}&state=${isDeleted}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    if (response.status !== 200) {
        throw Error('Failed to update');
    }
    const data = await response.json();
    return data;
}

export async function deletePolishList(polishStockId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(polishStockId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/polishDelete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json, text/plain, */*'
        },
        body: formData

    })
    if (response.status !== 200) {
        throw Error('Failed to update');
    }
    const data = await response.json();
    return data;
}

export async function postPolishStock(polishStock, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(polishStock);

    const res = await fetch(`${config.API_URL}/admin/polish`, {
      method: 'post',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
      },
      body:formData
    });
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}