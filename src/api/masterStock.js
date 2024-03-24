
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getMasterStock(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/masterStock`, {
      method: 'get',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
          // 'provider_id': providerId
      },
    });
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}

export async function fetchMasterStockList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/masterStock-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteMasterStockList(masterStockId, token) {
    // console.log(masterStockId);
    const formData = await convertObjectToFormData(masterStockId);
    // console.log(formData);

    const response = await fetch(`${config.API_URL}/admin/masterStockDelete`, {
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

export async function postMasterStock(masterStock, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(masterStock);

    const res = await fetch(`${config.API_URL}/admin/masterStock`, {
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