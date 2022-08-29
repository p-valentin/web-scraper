import puppeteer from "puppeteer"
import autoscroll from 'puppeteer-autoscroll-down'

interface Job {
    name: string | null,
    company: string | null,
    image: string | null,
    jobUrl: string | null,
    term: string
}

export async function scrape (searchTerm: any = '', limit: any) {
    let jobList: Job[] = []
    const browser = await puppeteer.launch({})
    const page = await browser.newPage()
    
    await page.goto(`https://www.ejobs.ro/locuri-de-munca/${searchTerm}`)
    
    let length = parseInt(limit)

    if(limit === '' || !limit) {
        let elements = await page.$$('.JobCardWrapper')
        length = elements.length
    }
    
    for(let i:number=1; i<length + 1; i++) {
        

        let jobResult: Job = {name: '', company: '', image: '', jobUrl: '', term: searchTerm}
        //Name scrape
        let nameEl = await page.waitForSelector(`.JobCardWrapper:nth-child(${i}) .JCContentMiddle__Title`)
        let nameText = await page.evaluate(el => el?.textContent, nameEl)
        jobResult.name = nameText || ''
        //Company scrape
        let companyEl = await page.waitForSelector(`.JobCardWrapper:nth-child(${i}) .JCContentMiddle__Info>a`)
        let companyText = await page.evaluate(el => el?.textContent?.trim(), companyEl)   
        jobResult.company = companyText || ''
        //Image scrape
        let imgEl = await page.waitForSelector(`.JobCardWrapper:nth-child(${i}) .JCContent__Logo>img`)
        const imgs = await page.evaluate(el => el?.getAttribute('src'), imgEl);
        jobResult.image = imgs || ''
        //Link job
        let jobEl = await page.waitForSelector(`.JobCardWrapper:nth-child(${i}) .JCContentMiddle__Title>a`)
        const job = await page.evaluate(el => el?.getAttribute('href'), jobEl);
        jobResult.jobUrl = 'https://www.ejobs.ro' + job || ''

        await autoscroll.scrollPageToBottom(page, {size: 1000})
        jobList.push(jobResult)
    }
    browser.close()       
    return jobList
}