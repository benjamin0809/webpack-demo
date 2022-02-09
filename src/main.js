import { getUserName } from './common/utils'
 
const div = document.createElement('div')

const btn = document.createElement('button')

btn.innerHTML = 'main button'
const input = document.getElementById('input')
btn.onclick = () => { 
    div.innerHTML = getUserName(input.value)
    document.body.appendChild(div)
}
document.body.appendChild(btn)

// 这是注释
console.log11(88888)