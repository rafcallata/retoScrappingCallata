import axios from "axios";
import { profileSelectors } from "../config/scrapperSelectors";
import { $, $$ } from "../utils/selectors";
import { getCookie} from "../utils/cookie";
import dayjs from "dayjs";
import { waitForScroll, waitForSelector } from "../utils/waitFor";
//const tokenKey = 'JSESSIONID';


async function getContactInfo(){
    try {
        const token = getCookie('JSESSIONID', document.cookie)
    
        const [contactInfoName] = $(profileSelectors.contactInfo).href.match(/in\/.+\/o/g) ?? [];
        const contactInfoURL = `https://www.linkedin.com/voyager/api/identity/profiles${contactInfoName.slice(2,-2)}/profileContactInfo`;

        const {data} = await axios.get(contactInfoURL, {
            headers:{
                accept: 'application/vnd.linkedin.normalized+json+2.1',
                'csrf-token': token
            }
        });
        return data
    } catch (error) {
        console.log('🚀 ~ file: scrapper.js ~ line 23 ~ getContactInfo ~ error', error); 
        throw new Error('error al obtener info del contacto');
    }
}

function getEspecificInfo (selector){
    try {
        const Elements = $$(selector);
        return Elements.map((listItem) => {
          if(!$('.pvs-entity__path-node', listItem)){
            const [title, enterprise, dateStringInfo] = $$('span[aria-hidden]', listItem).map(element => element.textContent);
        
            const [parsedRawDate] = dateStringInfo.match(/.+·|\d{4} - \d{4}/) ?? [];
            const [startDate, endDate] = (parsedRawDate?.replace(/\s|·/g,'').split('-') ?? [])
              .map(rawDateElement => dayjs(rawDateElement).isValid() ? dayjs(rawDateElement).toDate(): null);
    
            return {
              title,
              enterprise,
              startDate,
              endDate
            };
          }
        });
        
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log('🚀 ~ file: scrapper.js ~ line 50 ~ getEspecificInfo ~ error', error);  
      }
}

async function scrap(){
    
    try {
        console.log("inicio de Scrap")
        await waitForSelector('h1')
        await waitForScroll()

        const name = $(profileSelectors.name).textContent
        const experienceTitles = getEspecificInfo(profileSelectors.experiencesElements)
        const educationTitles = getEspecificInfo(profileSelectors.educationElements)
        const contactInfo = await getContactInfo()
        const profile = {
            name,
            contactInfo,
            experienceTitles,
            educationTitles
        }
        console.log(profile)
    } catch (error) {
        console.log('🚀 ~ file: scrapper.js ~ line 70 ~ scrap ~ error', error);
    }
}

scrap();