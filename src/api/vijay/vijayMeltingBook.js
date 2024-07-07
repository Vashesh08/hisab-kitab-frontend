
import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getVijayMeltingBook(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/vijayMeltingBook`, {
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

export async function fetchVijayMeltingBookList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/vijayMeltingStock-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteVijayMeltingBookList(vijayMeltingBookId, token) {
    // console.log(meltingBookId);
    const formData = await convertObjectToFormData(vijayMeltingBookId);  
    // Var name to be changed later
    // console.log("vas",formData);

    const response = await fetch(`${config.API_URL}/admin/vijayMeltingBookDelete`, {
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

export async function postVijayMeltingBook(vijayMeltingBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(vijayMeltingBook);

    const res = await fetch(`${config.API_URL}/admin/vijayMeltingBook`, {
      method: 'post',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
      },
      body:formData
    });
    // console.log(res);
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}

export async function updateVijayMeltingBook(vijayMeltingBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(vijayMeltingBook);

    const res = await fetch(`${config.API_URL}/admin/update/vijayMeltingBook`, {
    method: 'PATCH',
    headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json, text/plain, */*'
    },
    body:formData
    });
    // console.log(res);
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}