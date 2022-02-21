import { getUserName } from './common/utils'
import request from './common/request'
const div = document.createElement('div')

const btn = document.createElement('button')

btn.innerHTML = 'main button'
const input = document.getElementById('input')
btn.onclick = () => { 
    div.innerHTML = getUserName(input.value)
    document.body.appendChild(div)
}
document.body.appendChild(btn)

requestAnimationFrame(() =>{
    request()
})
// 这是注释
console.log(8888822)