import './main.css'
import './sass.scss'
import './less.less'
const msg = 'hello world' 
console.log(msg)
import { info } from './demo' 
import { getUserName } from './common/utils'
import request from './common/request'
info()

requestAnimationFrame(() =>{
  request()
})
export const getFullName = () => getUserName('index') + ';894306909@qq.com' 

const div = document.createElement('div')

const btn = document.createElement('button')

btn.innerHTML = 'index button'
const input = document.getElementById('input')
btn.onclick = () => { 
    div.innerHTML = getUserName(input.value)
    document.body.appendChild(div)
}
document.body.appendChild(btn)
const Counter = {
    data() {
      return {
        counter: 0
      }
    }
  }
   
class Author {
    name = 'benjamin'
    age = 18
    email = '894306909@qq.com'

    info = () => {
        return {
            name: this.name,
            age: this.age,
            email: this.email
        }
    }
}
// module.exports = Author

export default new Author()