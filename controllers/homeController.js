const createDynamoDbService = require('../services/homeService')

const dynamoDbService = createDynamoDbService()

const getBalance = async (req,res) => {
    try{
        const donar = req.query.donar
        const rewards = await dynamoDbService.getBalance(donar)
        res.status(200).json(rewards)
    }catch (error){
        res.status(401).json({ message: "error fetching balance", error})
    }
}
const getRecentTransactions = async (req,res) => {
    try{
        const donar = req.query.donar
        const recents =  await dynamoDbService.getRecentTransactions(donar)
        res.status(200).json(recents)
    }catch (error) {
        res.status(500).json({ message: "Error fetching details", error })
    }
}
const addNewExpense = async (req,res) => {
    try{
        const { donar,location,category,description } = req.body
        if (!donar || !location || !category || !description){
            return res.status(400).json(({message:'Missing fields'}))
        }
        const donation = req.body
        const { updatedBalance ,newItem } = await dynamoDbService.addNewExpense(donation)
        res.status(200).json({newItem,updatedBalance})
    }catch (err) {
        console.log('Error',err)
        res.status(500).json({ message: "Error", err })
    }
}
module.exports = {
    getBalance,
    getRecentTransactions,
    addNewExpense
}