
import convertObjectToFormData from "../utils/convertObjectToFormData";

export async function getMasterStock(token) {
    // send request to check authenticated
    const res = await fetch(`http://0.0.0.0:5003/masterStock`, {
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

export async function postMasterStock(masterStock, token) {
    // send request to check authenticated
    const formData = await convertObjectToFormData(masterStock);

    const res = await fetch(`http://0.0.0.0:5003/masterStock`, {
      method: 'post',
      headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json, text/plain, */*'
          // 'provider_id': providerId
      },
      body:formData
    });
    if ( res.status !== 200) {
        throw Error('Failed to update');
    }
    const body = await res.json();
    return body;
}