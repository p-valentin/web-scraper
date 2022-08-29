import express from 'express'
import { scrape } from './utils/scraper'
import {Job} from '../models/job'
require('../db/mongoose')

const app = express()

const port = process.env.PORT || 3000

app.post('', async (req, res) => {
    const jobs = await scrape(req.query.term, req.query.limit)

    try {
        jobs.forEach(async (e) => {
            const job = new Job({...e})
            try {
                await job.save()
                res.status(201)
            } catch(e) {
                res.status(400).send(e)
            }
        })
        
        res.send(jobs)
    } catch(e) {
        res.status(400).send(e)
    }
    
})

app.get('/jobs', async (req, res) => {
    try {
  
        const jobs = await Job.find({})

        if(Object.keys(jobs).length === 0) {
            return res.status(201).send({info: 'No jobs found'})
        }
       return res.status(201).send(jobs)
    } catch(e) {
       return res.status(400).send('Something went wrong')
    }
    
})

app.get('/:term', async (req, res) => {
    try {
        const term = req.params.term
        const jobs = await Job.find({term})

        if(Object.keys(jobs).length === 0) {
            return res.status(201).send({info: 'No jobs found'})
        }

        return res.status(201).send(jobs)
    } catch(e) {
        return res.status(400).send(e)
    }
})

app.get('/jobs/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)

        if(!job) {
            throw new Error()
        }

        return res.status(201).send(job)
    } catch(e) {
        return res.status(404).send({Error: 'No jobs found'})
    }
})

app.delete('/jobs/delete/all', async (req, res) => {
    try {
        await Job.deleteMany({})

        res.status(201).send({info: 'database emptied'})
    } catch(e) {
        return res.status(404).send(e)
    }
})

app.delete('/:term/delete/all', async (req, res) => {
    try {
        await Job.deleteMany({term: req.params.term})
        
        res.status(201).send({info: 'selected job have been deleted'})
    } catch(e) {
        return res.status(404).send(e)
    }
})

app.delete('/jobs/delete/:id', async (req, res) => {
    try {
        await Job.findByIdAndDelete(req.params.id)
        res.status(201).send({info: 'job deleted'})
    } catch(e) {
        return res.status(404).send(e)
    }
})


app.listen(port, () => {
    console.log(`Running on port ${port}`)
})