import convertObjectToFormData from "../utils/convertObjectToFormData";
import config from '../config';

export async function getUtilityData(token) {
    // send request to check authenticated
    const res = await fetch(`${config.API_URL}/admin/utility-list`, {
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

export async function updateUtility(utilityData, token){
    // send request to check authenticated
    const formData = await convertObjectToFormData(utilityData);

    const res = await fetch(`${config.API_URL}/admin/update/utility`, {
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

export async function deleteUtilityList(token) {
    const response = await fetch(`${config.API_URL}/admin/utilityDelete`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json, text/plain, */*'
        },
    })
    if (response.status !== 200) {
        throw Error('Failed to update');
    }
    const data = await response.json();
    return data;
}
