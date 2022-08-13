import { searchSelectors } from "../config/scrapperSelectors";
import { S } from "./selectors";

export async function waitForSelector (selector, intervalTime = 100, timeOut = 5000){
    new Promise((res,rej)=>{
        let cont = 0
        const interval = setInterval(()=>{
            cont++
            if(cont === timeOut/intervalTime + 1)
                clearInterval(interval)
                rej(false)
            if(selector){
                clearInterval(interval)
                res(true)
            }
        }, 500);      
    })
}

export async function waitForScroll(offset = 60, time=500, timeOut= 10000){
    let y = 0
    return new Promise((res, rej)=>{
        const interval = setInterval(()=>{
            if(y>= document.body.scrollHeight - document.body.scrollTop){
                clearInterval(interval)
                res(true)
            }
            y+=offset
            if(timeOut/time+1 > y/offset+2*offset){
                clearInterval(interval)
                rej(false)
            }
            window.scrollTo({top: y, behavior: 'smooth'})
        },time)
    })    
}