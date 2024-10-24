
import convertObjectToFormData from "../../utils/convertObjectToFormData";
import config from '../../config';

export async function getGovindMeltingBook(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/govindMeltingBook`, {
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

export async function fetchGovindMeltingBookList(page, itemsPerPage, token) {
    const response = await fetch(`${config.API_URL}/admin/govindMeltingStock-list?page=${page}&itemsPerPage=${itemsPerPage}`, {
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

export async function deleteGovindMeltingBookList(govindMeltingBookId, token) {
    // console.log(meltingBookId);
    const formData = await convertObjectToFormData(govindMeltingBookId);  
    // Var name to be changed later
    // console.log("vas",formData);

    const response = await fetch(`${config.API_URL}/admin/govindMeltingBookDelete`, {
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

export async function postGovindMeltingBook(govindMeltingBook, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindMeltingBook);

    const res = await fetch(`${config.API_URL}/admin/govindMeltingBook`, {
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

export async function updateGovindMeltingBook(govindMeltingBook, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(govindMeltingBook);

    const res = await fetch(`${config.API_URL}/admin/update/govindMeltingBook`, {
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