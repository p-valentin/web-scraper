import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    company: {
        type: String,
        trim: true,
        required: true
    },
    image: {
        type: String,
        trim: true,
    },
    jobUrl: {
        type: String,
        trim: true,
        required: true
    },
    term: {
        type: String,
        trim: true,
        default: ''
    },
    expireAt: {
        type: Date,
        default: new Date(new Date().valueOf() + 604800000),
        expires: 604800000
    }
}, {
    timestamps: true
})

//jobSchema.index({createdAt: 1},{expireAfterSeconds: 604800});

export const Job = mongoose.model('Job', jobSchema)
