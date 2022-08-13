/**
 * @param  {string} selector
 * @param  {HTMLElement} node=document.body
 * @return  {HTMLElement} {return node.querySelector(selector)
 */
export function $ (selector, node=document.body){
    return node.querySelector(selector)
}
/**
 * @param  {string} selector
 * @param  {HTMLElement} node=document.body
 * @return  {HTMLElement} {return[...node.querySelectorAll(selector)]
 */
export function $$(selector, node=document.body){
    return [...node.querySelectorAll(selector)]
}
