import { iBaseRequest } from '../../../../JacTools/index'
import API from 'lib/API'


export default class BaseRequest extends iBaseRequest
{
  get host()
  {
    return API.host
  }

  constructor()
  {
    super({
      SuccessCodes,
      ErrorCodes
    })
  }

}
