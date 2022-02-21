import { cloneDeep } from 'lodash-es'
import * as moment from 'moment';


export const info = () => {
    console.log('this is typescript: changed')
    let now = moment().format('LLLL');
    return cloneDeep({ name: 'benjamin', now})
}